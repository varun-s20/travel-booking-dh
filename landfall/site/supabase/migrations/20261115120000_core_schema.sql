-- =====================================================================
-- Landfall: core schema (accounts, bookings, payments, documents)
--
-- Security model
-- - Every table has Row Level Security on. Browsers never write to these
--   tables directly: the Next.js server writes with the secret key after
--   validating input, and reads a signed-in customer's own rows with the
--   customer's session, so RLS is a second line of defence, not the only one.
-- - Roles live in public.profiles.role ('customer' | 'admin'). Customers can
--   update their names and phone only (column grants), never their role.
-- - Money is stored in minor units (cents) as integers, never floats.
-- - Passenger identity documents are never stored in clear text: they are
--   encrypted by the app (AES-256-GCM) between checkout and booking, then
--   erased (bookings.sensitive_enc is set to null).
-- =====================================================================

-- ---------- enums ----------
create type public.app_role as enum ('customer', 'admin');
create type public.booking_kind as enum ('flight', 'stay');
-- pending_payment: created at checkout, waiting for the card authorisation
-- processing:      card authorised, booking with the airline or hotel in progress
-- confirmed:       supplier booked and the payment captured
-- failed:          supplier refused (the card hold was released) or payment failed
-- cancelled:       cancelled after confirmation
-- expired:         abandoned checkout (the card hold, if any, was released)
create type public.booking_status as enum ('pending_payment', 'processing', 'confirmed', 'failed', 'cancelled', 'expired');
create type public.payment_status as enum ('requires_payment', 'authorized', 'captured', 'cancelled', 'failed', 'refunded', 'partially_refunded');
create type public.passenger_type as enum ('adult', 'child', 'infant');

-- ---------- helpers ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles (one per auth user) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '' check (char_length(first_name) <= 60),
  last_name text not null default '' check (char_length(last_name) <= 60),
  phone text not null default '' check (char_length(phone) <= 32),
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'Customer profile, one row per auth.users row. role is only changed by the service role or SQL.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- A profile for every new auth user. Names come from sign-up metadata
-- (user-controlled, so only names are read from it, never the role).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'first_name', ''), 60),
    left(coalesce(new.raw_user_meta_data ->> 'last_name', ''), 60)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- True when the signed-in user is an admin. Used inside RLS policies.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- ---------- saved travelers (profile page, prefill on the passenger form) ----------
create table public.saved_travelers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (title in ('mr', 'ms', 'mrs', 'miss', 'dr')),
  given_name text not null check (char_length(given_name) between 1 and 40),
  family_name text not null check (char_length(family_name) between 1 and 40),
  born_on date not null check (born_on > date '1900-01-01'),
  gender text not null check (gender in ('m', 'f')),
  passenger_type public.passenger_type not null default 'adult',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index saved_travelers_user_idx on public.saved_travelers (user_id);

create trigger saved_travelers_set_updated_at
  before update on public.saved_travelers
  for each row execute function public.set_updated_at();

-- ---------- bookings ----------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  -- our own reference shown to customers: 6 characters that can't be misread
  reference text not null unique check (reference ~ '^[A-HJ-NP-Z2-9]{6}$'),
  user_id uuid references public.profiles (id) on delete set null,
  kind public.booking_kind not null,
  status public.booking_status not null default 'pending_payment',

  -- supplier
  supplier text not null check (supplier in ('duffel', 'simulated')),
  live_mode boolean not null default false,
  offer_id text,                 -- flights: the fare's offer id (off_...)
  offer_request_id text,         -- flights: Duffel offer request (orq_...)
  rate_id text,                  -- stays: the chosen rate (rat_...)
  quote_id text,                 -- stays: quote created at checkout (quo_...)
  supplier_order_id text unique, -- ord_... / bok_...
  supplier_reference text,       -- airline PNR / hotel confirmation number

  -- idempotent checkout: one booking per checkout attempt key sent by the browser
  checkout_key text not null unique check (char_length(checkout_key) between 16 and 64),

  -- contact
  contact_email text not null check (char_length(contact_email) between 3 and 254),
  contact_phone text check (char_length(contact_phone) <= 32),

  -- money (minor units). total_amount is what the customer pays; supplier_amount what we pay the supplier.
  currency char(3) not null,
  total_amount integer not null check (total_amount > 0),
  tax_amount integer check (tax_amount >= 0),
  supplier_amount integer not null check (supplier_amount > 0),
  supplier_currency char(3) not null,

  -- display snapshot of the itinerary or stay, and travelers' names (no documents)
  summary jsonb not null,
  travelers jsonb not null default '[]'::jsonb,

  -- passenger documents and dates of birth, encrypted by the app; erased once booked
  sensitive_enc text,
  -- sha-256 of the guest access key (confirmation link for bookings made signed out)
  guest_token_hash text,

  failure_code text,
  expires_at timestamptz,
  -- a person must look at it (unclear supplier outcome after retries); the job leaves it alone
  needs_review boolean not null default false,
  -- the supplier accepted the request but hasn't confirmed (Duffel Stays 202): never resend, only check
  supplier_pending boolean not null default false,
  fulfilment_attempts integer not null default 0,
  fulfilment_started_at timestamptz,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on column public.bookings.sensitive_enc is 'AES-256-GCM ciphertext (app key). Null once the supplier booking is made or the checkout ends.';

create index bookings_user_idx on public.bookings (user_id, created_at desc);
create index bookings_status_idx on public.bookings (status, updated_at);
create index bookings_email_idx on public.bookings (lower(contact_email)) where user_id is null;
-- Duffel allows one order per offer request: mirror it so two checkouts can't both book it
create unique index bookings_offer_request_once
  on public.bookings (offer_request_id)
  where offer_request_id is not null and status in ('processing', 'confirmed');

create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------- payments (Stripe PaymentIntents, manual capture) ----------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  provider text not null default 'stripe' check (provider = 'stripe'),
  intent_id text not null unique,
  status public.payment_status not null default 'requires_payment',
  amount integer not null check (amount > 0),
  currency char(3) not null,
  amount_refunded integer not null default 0 check (amount_refunded >= 0),
  card_brand text,
  card_last4 text check (card_last4 ~ '^[0-9]{4}$'),
  failure_code text,
  decline_code text,
  authorized_at timestamptz,
  captured_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_booking_idx on public.payments (booking_id);

create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- ---------- travel documents (e-tickets) ----------
create table public.travel_documents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id) on delete cascade,
  type text not null,
  unique_identifier text not null,
  passenger_name text,
  created_at timestamptz not null default now(),
  unique (booking_id, type, unique_identifier)
);

-- ---------- booking audit trail (support and admin only) ----------
create table public.booking_events (
  id bigint generated always as identity primary key,
  booking_id uuid not null references public.bookings (id) on delete cascade,
  type text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index booking_events_booking_idx on public.booking_events (booking_id, created_at);

-- =====================================================================
-- Privileges and Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.saved_travelers enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.travel_documents enable row level security;
alter table public.booking_events enable row level security;

-- Start from nothing for browser roles, then grant exactly what is needed.
revoke all on public.profiles, public.saved_travelers, public.bookings, public.payments,
  public.travel_documents, public.booking_events from anon, authenticated;
grant all on public.profiles, public.saved_travelers, public.bookings, public.payments,
  public.travel_documents, public.booking_events to service_role;

-- profiles: read your own row; update names and phone only
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone) on public.profiles to authenticated;
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- saved travelers: full control of your own
grant select, insert, update, delete on public.saved_travelers to authenticated;
create policy "saved_travelers: own rows" on public.saved_travelers
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- bookings: read your own (or all, for admins); never the secret columns
grant select (
  id, reference, user_id, kind, status, supplier, live_mode, supplier_reference,
  contact_email, contact_phone, currency, total_amount, tax_amount, summary, travelers,
  failure_code, confirmed_at, cancelled_at, created_at, updated_at
) on public.bookings to authenticated;
create policy "bookings: read own or admin" on public.bookings
  for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- payments and documents: readable with the booking they belong to
grant select (id, booking_id, status, amount, currency, amount_refunded, card_brand, card_last4, captured_at, created_at)
  on public.payments to authenticated;
create policy "payments: read with own booking" on public.payments
  for select to authenticated
  using (exists (
    select 1 from public.bookings b
    where b.id = booking_id and (b.user_id = (select auth.uid()) or (select public.is_admin()))
  ));

grant select on public.travel_documents to authenticated;
create policy "travel_documents: read with own booking" on public.travel_documents
  for select to authenticated
  using (exists (
    select 1 from public.bookings b
    where b.id = booking_id and (b.user_id = (select auth.uid()) or (select public.is_admin()))
  ));

-- audit trail: admins only
grant select on public.booking_events to authenticated;
create policy "booking_events: admins" on public.booking_events
  for select to authenticated
  using ((select public.is_admin()));

-- functions: is_admin is needed inside policies; the trigger function is internal
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;
