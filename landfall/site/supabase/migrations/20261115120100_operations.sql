-- =====================================================================
-- Landfall: operational tables and functions (server only)
-- Search caches, webhook de-duplication, the email log, contact messages,
-- rate limiting and the atomic booking state changes. None of these are
-- readable from the browser: RLS is on with no policies, and every
-- function below can only be executed by the service role.
-- =====================================================================

-- ---------- flight search cache ----------
-- One row per supplier search (Duffel offer request). The results page, the
-- fare page, the traveler form and checkout all read the same normalised
-- offers from here, so an offer id in a URL can be resolved on the server
-- without searching again. Rows are purged after they expire (cron).
create table public.flight_searches (
  id text primary key,                 -- orq_... (Duffel) or sim_... (simulated)
  supplier text not null check (supplier in ('duffel', 'simulated')),
  -- the same search within its validity reuses this row: Duffel counts every search against
  -- a look-to-book ratio and live searches are rate limited (about 10 a minute by default)
  params_key text not null,
  params jsonb not null,               -- the normalised search
  passengers jsonb not null,           -- supplier passenger ids in traveler order
  payload jsonb not null,              -- { offers: Offer[], dict }
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index flight_searches_expires_idx on public.flight_searches (expires_at);
create index flight_searches_reuse_idx on public.flight_searches (params_key, expires_at desc);

create table public.flight_search_offers (
  offer_id text primary key,           -- every fare's offer id
  search_id text not null references public.flight_searches (id) on delete cascade,
  itinerary_index integer not null,
  fare_index integer not null
);
create index flight_search_offers_search_idx on public.flight_search_offers (search_id);

-- ---------- stay rate cache ----------
-- The hotel page stores each rate it showed, so the guest form and checkout
-- can resolve ?rate=<id> to the room, the board and the cancellation terms.
create table public.stay_rates (
  rate_id text primary key,            -- rat_... (Duffel) or simulated plan key
  supplier text not null check (supplier in ('duffel', 'simulated')),
  accommodation_id text not null,
  search_result_id text,               -- srr_... (Duffel)
  params jsonb not null,               -- the normalised stay search
  payload jsonb not null,              -- { hotel, room, plan }
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index stay_rates_expires_idx on public.stay_rates (expires_at);

-- ---------- webhooks: each delivery processed once ----------
create table public.webhook_events (
  provider text not null check (provider in ('stripe', 'duffel')),
  event_id text not null,
  type text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  error text,
  primary key (provider, event_id)
);

-- ---------- email log (and retry queue) ----------
create table public.email_log (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id) on delete set null,
  template text not null,
  to_email text not null,
  subject text not null,
  -- logged: no SMTP configured (development); pending: queued or retrying
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'logged')),
  attempts integer not null default 0,
  last_error text,
  message_id text,
  -- one email per event: e.g. booking_confirmed:<booking id>
  dedupe_key text unique,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create index email_log_status_idx on public.email_log (status, created_at);

-- ---------- contact form ----------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete set null,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  topic text check (char_length(topic) <= 60),
  booking_reference text check (char_length(booking_reference) <= 12),
  message text not null check (char_length(message) between 1 and 5000),
  ip_hash text,
  created_at timestamptz not null default now()
);

-- ---------- rate limiting (fixed window) ----------
create table public.rate_limits (
  key text primary key,
  window_start timestamptz not null,
  hits integer not null
);

-- RLS on, no policies, no grants: server only
alter table public.flight_searches enable row level security;
alter table public.flight_search_offers enable row level security;
alter table public.stay_rates enable row level security;
alter table public.webhook_events enable row level security;
alter table public.email_log enable row level security;
alter table public.contact_messages enable row level security;
alter table public.rate_limits enable row level security;

revoke all on public.flight_searches, public.flight_search_offers, public.stay_rates, public.webhook_events,
  public.email_log, public.contact_messages, public.rate_limits from anon, authenticated;
grant all on public.flight_searches, public.flight_search_offers, public.stay_rates, public.webhook_events,
  public.email_log, public.contact_messages, public.rate_limits to service_role;

-- =====================================================================
-- Functions (service role only)
-- =====================================================================

-- Counts one hit for a key in a fixed window and says whether it is allowed.
create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_max integer)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := now();
  v_row public.rate_limits;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, v_now, 1)
  on conflict (key) do update set
    window_start = case when r.window_start <= v_now - make_interval(secs => p_window_seconds) then v_now else r.window_start end,
    hits = case when r.window_start <= v_now - make_interval(secs => p_window_seconds) then 1 else r.hits + 1 end
  returning * into v_row;
  return query select v_row.hits <= p_max,
    greatest(p_max - v_row.hits, 0),
    v_row.window_start + make_interval(secs => p_window_seconds);
end;
$$;

-- Moves a booking into 'processing' for exactly one worker. A booking stuck in
-- processing (a crashed worker) can be claimed again after p_stale_seconds, which
-- is far longer than one attempt can take (about 4 minutes at worst), so a slow
-- worker is never overtaken; the next worker checks the supplier before booking.
-- Bookings parked for a person (needs_review) are never claimed.
create or replace function public.claim_booking_for_fulfilment(p_booking uuid, p_stale_seconds integer default 600)
returns setof public.bookings
language sql
security definer
set search_path = ''
as $$
  update public.bookings
  set status = 'processing',
      fulfilment_started_at = now(),
      fulfilment_attempts = fulfilment_attempts + 1
  where id = p_booking
    and not needs_review
    and (
      status = 'pending_payment'
      or (status = 'processing' and fulfilment_started_at < now() - make_interval(secs => p_stale_seconds))
    )
  returning *;
$$;

-- Bookings made signed out with this (confirmed) email join the account, and their
-- guest key stops working (the account is the way in from then on). Only bookings
-- that were made signed out qualify (they have a guest key): bookings detached by
-- an account deletion have none, so they never pass to a new owner of the address.
create or replace function public.claim_guest_bookings(p_user uuid, p_email text)
returns integer
language sql
security definer
set search_path = ''
as $$
  with claimed as (
    update public.bookings
    set user_id = p_user, guest_token_hash = null
    where user_id is null
      and guest_token_hash is not null
      and lower(contact_email) = lower(p_email)
      and status in ('processing', 'confirmed', 'cancelled')
    returning 1
  )
  select count(*)::integer from claimed;
$$;

-- Held payments whose booking has finished: confirmed ones still to capture, failed or
-- expired ones still to release. Bookings parked for a person are left alone.
create or replace function public.payments_to_settle(p_limit integer default 20)
returns table (intent_id text, booking_id uuid, booking_status public.booking_status, confirmed_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select p.intent_id, p.booking_id, b.status, b.confirmed_at
  from public.payments p
  join public.bookings b on b.id = p.booking_id
  where p.status = 'authorized'
    and b.status in ('confirmed', 'failed', 'expired')
    and not b.needs_review
  order by p.updated_at
  limit p_limit;
$$;

-- Deletes expired caches and old rate-limit windows. Returns rows removed.
create or replace function public.purge_expired()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  n integer := 0;
  c integer;
begin
  delete from public.flight_searches where expires_at < now() - interval '1 hour';
  get diagnostics c = row_count; n := n + c;
  delete from public.stay_rates where expires_at < now() - interval '1 hour';
  get diagnostics c = row_count; n := n + c;
  delete from public.rate_limits where window_start < now() - interval '1 day';
  get diagnostics c = row_count; n := n + c;
  delete from public.webhook_events where processed_at is not null and received_at < now() - interval '30 days';
  get diagnostics c = row_count; n := n + c;
  return n;
end;
$$;

revoke execute on function public.rate_limit_hit(text, integer, integer) from public, anon, authenticated;
revoke execute on function public.claim_booking_for_fulfilment(uuid, integer) from public, anon, authenticated;
revoke execute on function public.claim_guest_bookings(uuid, text) from public, anon, authenticated;
revoke execute on function public.purge_expired() from public, anon, authenticated;
revoke execute on function public.payments_to_settle(integer) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, integer, integer) to service_role;
grant execute on function public.claim_booking_for_fulfilment(uuid, integer) to service_role;
grant execute on function public.claim_guest_bookings(uuid, text) to service_role;
grant execute on function public.purge_expired() to service_role;
grant execute on function public.payments_to_settle(integer) to service_role;
