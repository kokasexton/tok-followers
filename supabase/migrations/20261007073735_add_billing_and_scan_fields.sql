-- Billing + scan-run wiring for Scoutline.
-- Adds: Stripe customer on profiles, Apify run fields + preview flag on scans,
-- the purchases ledger, a stripe_events idempotency table, and a follower dedupe guard.

-- ===== profiles: Stripe customer =====
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- ===== scans: Apify run + preview =====
ALTER TABLE scans ADD COLUMN IF NOT EXISTS apify_run_id text;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS apify_dataset_id text;
ALTER TABLE scans ADD COLUMN IF NOT EXISTS is_preview boolean NOT NULL DEFAULT false;

-- ===== purchases (credit-pack ledger) =====
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credits integer NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_purchases" ON purchases;
CREATE POLICY "select_own_purchases"
ON purchases FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_intent ON purchases(stripe_payment_intent);

-- ===== stripe_events (webhook idempotency) =====
CREATE TABLE IF NOT EXISTS stripe_events (
  id text PRIMARY KEY,
  type text NOT NULL,
  handled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- ===== followers: dedupe + lookup =====
CREATE UNIQUE INDEX IF NOT EXISTS uq_followers_scan_username ON followers(scan_id, username);
CREATE INDEX IF NOT EXISTS idx_followers_username ON followers(username);

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
