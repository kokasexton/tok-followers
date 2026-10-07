# Scoutline for TikTok

Pull any public TikTok account's follower list (with bios, counts and contact info) into a
CSV. Sell it by the row with Stripe. Built as a Vite + React + TypeScript SPA on Supabase
(Auth + Postgres + Edge Functions) with Apify for the scrape.

## Stack

| Layer | Choice |
|---|---|
| Front end | Vite · React 18 · TypeScript · Tailwind (utility only) |
| Auth + DB | Supabase (email/password, RLS) |
| Backend | Supabase Edge Functions (Deno): checkout, webhook, scan start/status |
| Scrape | Apify `afanasenko~tiktok-profile-scraper` (`evoGyJLMGMqysXSfl`) |
| Payments | Stripe Checkout (hosted) + a webhook that credits the account |

Credit model: **1 credit = 1 delivered row**. Credits are charged on **delivery**, not at run
start, so "private or hidden followers never cost a credit" is literally true.

## Local setup

```bash
npm install
cp .env.example .env          # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (+ price IDs)
npm run dev
```

## Deploy (see `docs/ACTIVATION-CHECKLIST.md` for the full ordered list)

```bash
supabase link --project-ref <ref>
supabase db push                                   # runs both migrations
supabase secrets set APIFY_TOKEN=… STRIPE_SECRET_KEY=… STRIPE_WEBHOOK_SECRET=…
supabase functions deploy create-checkout-session stripe-webhook start-scan scan-status
STRIPE_SECRET_KEY=sk_live_… node scripts/stripe-setup.mjs   # create products/prices
npm run build                                      # deploy dist/ to Netlify/Vercel/CF Pages
```

## Edge functions

- `create-checkout-session` — Stripe Checkout for a credit pack (resolves credits from the
  Price's `metadata.credits`, never from the client).
- `stripe-webhook` — verifies the Stripe signature; the **only** place credits are added;
  idempotent via the `stripe_events` table.
- `start-scan` — authenticated; enforces the credit ceiling and the one-per-24h free preview;
  launches the Apify run.
- `scan-status` — polls the run, ingests the dataset into `followers`, charges credits on
  delivery, and marks the scan complete.

## Known gap

`afanasenko~tiktok-profile-scraper` returns profile-level engagement + up to 20 post captions
— it does **not** return a per-video metrics table. The marketing "last 30 days of videos"
file therefore needs a second actor or a reframed deliverable. See
`docs/ACTIVATION-CHECKLIST.md` §3.
