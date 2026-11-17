# Landfall: accounts and environment setup

Everything the backend needs, in the order to do it. All keys go into **`landfall/site/.env.local`**. That file already exists with two values filled in (`DATA_ENCRYPTION_KEY` and `CRON_SECRET`, both generated locally). Git ignores it.

Never paste a secret key into chat, email or a ticket. Paste it straight into `.env.local`.

| Service | Cost for testing | Needed for | Blocks testing? |
|---|---|---|---|
| Supabase | Free plan | Database, sign-up and sign-in, password reset | Yes |
| Duffel | Free test mode | Real flight and hotel data (test inventory) | No: without it the site uses the demo catalogue |
| Stripe | Free test mode | The payment form and taking payment | Yes, for checkout |
| Resend (or any SMTP) | Free plan | Booking confirmation emails | No: without it emails are logged, not sent |
| Stripe CLI | Free | Payment webhooks on your machine | No: optional safety net |

---

## 1. Supabase: database and accounts (required)

1. Sign up at https://supabase.com and create a **New project**.
   - Name: `landfall` (anything works).
   - Database password: generate a strong one and save it in your password manager. You need it in step 4.
   - Region: the one closest to the customers. Pick the same region for Vercel later.
2. Go to **Project Settings → API Keys** and copy three values into `.env.local`:

   | Value in the dashboard | Variable in `.env.local` |
   |---|---|
   | Project URL (`https://xxxx.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
   | Publishable key (`sb_publishable_...`) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
   | Secret key (`sb_secret_...`). Click **Reveal**, or create one under "Secret keys". | `SUPABASE_SECRET_KEY` |

   If the project only shows the older keys, use `anon` for the publishable key and `service_role` for the secret key. The secret key bypasses all security rules, so it must stay server-side.
3. Go to **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3003`
   - Redirect URLs: add `http://localhost:3003/**`. Add the Vercel domain later.
4. Click **Connect** (top bar), then **Session pooler**. Copy the URI, replace `[YOUR-PASSWORD]` with the database password from step 1, and put it in `SUPABASE_DB_URL`. Only the migration command uses it.
5. Go to **Authentication → Sign In / Providers → Email**:
   - Keep **Confirm email** on.
   - Set the minimum password length to **8**, to match the site's forms.
6. Go to **Authentication → Emails → Templates**. Paste these three templates from this repo into the matching template:
   - "Confirm sign up": `supabase/templates/confirmation.html`
   - "Reset password": `supabase/templates/recovery.html`
   - "Change email address": `supabase/templates/email_change.html`

   The links in these templates point at the site's `/auth/confirm` route.
7. Tell me when steps 1 to 4 are done. I'll then apply the database schema with `npm run db:push`. You can also run it yourself from `landfall/site`.

**Email delivery while testing:** Supabase's built-in sender only delivers to email addresses of members of your Supabase organisation, and only a few per hour. Test sign-up and password reset with your own Supabase login email. For real customers, set up your own SMTP under **Authentication → Emails → SMTP Settings** (the same Resend account as step 4 below).

**Making yourself an admin:** after you create your account on the site, run this once in **SQL Editor**, with your own email:
```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## 2. Duffel: flights and hotels (test mode)

1. Sign up at https://app.duffel.com. If it asks for your account or balance currency, choose **USD**, the site's currency. Offers come back priced in that currency.
2. Make sure the **Test mode** toggle is on (top of the dashboard).
3. Go to **Developers → Access tokens → Create token**. Choose read-write and copy the `duffel_test_...` token into `DUFFEL_ACCESS_TOKEN`.
4. **Ask Duffel for Stays (hotels) access.** Use the dashboard's support chat or https://duffel.com/contact-us, for example: "Please enable Duffel Stays on our account; we're building a B2C booking site." Until they enable it, hotel searches may fail. Flights work right away.
5. Leave `DUFFEL_WEBHOOK_SECRET` empty for now. Duffel only sends webhooks to a public HTTPS address, so this is set up after the Vercel deploy.

Test mode only returns "Duffel Airways" (code ZZ) flights. Fares and schedules are fake, and the test balance is unlimited, so nothing real is ever booked or paid. Some test routes trigger specific failures on purpose:
- LHR → STN: the price changes when checked.
- LGW → STN: "insufficient balance".
- LHR → LGW: the order fails.

Hotels in test mode: pick **"Duffel test hotels"** in the destination list. It only appears in test mode.

## 3. Stripe: payments (test mode)

1. Sign up at https://dashboard.stripe.com. Test mode works straight away, with no business verification.
2. Make sure you are in **Test mode** (or a sandbox).
3. Go to **Developers → API keys** and copy:

   | Key | Variable in `.env.local` |
   |---|---|
   | Publishable key (`pk_test_...`) | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
   | Secret key (`sk_test_...`) | `STRIPE_SECRET_KEY` |

4. Optional, for webhooks on your machine:
   - Install the Stripe CLI: `winget install Stripe.StripeCli`.
   - Run `stripe login`.
   - Run `stripe listen --forward-to localhost:3003/api/webhooks/stripe`.
   - It prints a `whsec_...` secret. Put it in `STRIPE_WEBHOOK_SECRET`.

   Bookings complete without this. The webhook is the safety net for a customer who closes the tab mid-payment.

Test cards (any future expiry date, any CVC):
- `4242 4242 4242 4242`: succeeds.
- `4000 0025 0000 3155`: asks for 3-D Secure.
- `4000 0000 0000 9995`: declined (insufficient funds).

## 4. Email: booking confirmations (optional for now)

Without SMTP, booking emails are written to the server log and to the `email_log` table, and nothing is sent. To send real email:

1. Sign up at https://resend.com.
2. Verify the client's sending domain. This needs DNS access to the client's domain, which we don't have yet.
3. Fill in these variables:
   - `SMTP_HOST=smtp.resend.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=resend`
   - `SMTP_PASSWORD=` your Resend API key
   - `EMAIL_FROM="Landfall <bookings@clientdomain.com>"`
   - `SUPPORT_EMAIL=` the inbox that should receive contact-form messages

## 5. Already done for you

- `DATA_ENCRYPTION_KEY`: generated. It encrypts passport details between checkout and booking. Keep a copy in your password manager. Production needs its own value, set in Vercel.
- `CRON_SECRET`: generated. It protects the scheduled clean-up job.
- `APP_URL=http://localhost:3003` and `APP_CURRENCY=USD`.
- `PRICE_MARKUP_PERCENT=0` and `PRICE_MARKUP_FIXED_CENTS=0`: no markup until the client decides on one.

## 6. Later: deploy to Vercel (not now)

1. Import `landfall/site` as a Vercel project.
2. Copy every variable into **Settings → Environment Variables**, with `APP_URL` set to the live domain. Use a different `DATA_ENCRYPTION_KEY` and `CRON_SECRET` for production.
3. Add the live domain to Supabase **Redirect URLs** and set it as the **Site URL**.
4. Create a Stripe webhook endpoint at `https://<domain>/api/webhooks/stripe` and a Duffel webhook at `https://<domain>/api/webhooks/duffel`. Put their secrets in Vercel.
5. Live mode later means:
   - Duffel: a live token, a funded balance, and approval to go live.
   - Stripe: account activation and live keys.

## Check it works

Once Supabase and Stripe are filled in:
```
npm run db:push        # creates the tables, security rules and functions in Supabase
npm run dev            # http://localhost:3003
```
Then open http://localhost:3003/api/health. It reports which services are connected. It shows "configured" or "missing" for each one and never shows the keys themselves.
