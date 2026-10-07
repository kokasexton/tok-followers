/*
# Create tables for TikTok Scoutline: profiles, scans, followers, videos

## Purpose
This migration sets up the full multi-user data model for the Scoutline app.
Users sign in with email/password via Supabase Auth. Each user can:
- View their profile (credits balance, email)
- Create "scans" (a pull request for a TikTok account's followers and/or videos)
- View the follower rows and video rows returned by each scan

## New Tables

### 1. profiles
- `id` (uuid, PK, references auth.users) — one row per user, same ID as auth
- `email` (text) — cached email for quick display
- `credits_balance` (integer, default 0) — remaining pull credits
- `created_at` (timestamptz)

### 2. scans
- `id` (uuid, PK)
- `user_id` (uuid, FK → profiles.id, NOT NULL DEFAULT auth.uid())
- `tiktok_handle` (text) — the handle that was pulled (e.g. "glowstudio.skin")
- `scan_type` (text) — 'followers', 'videos', or 'both'
- `status` (text) — 'pending', 'running', 'completed', 'failed'
- `results_limit` (integer) — max rows requested
- `followers_count` (integer, default 0) — rows actually delivered
- `videos_count` (integer, default 0) — rows actually delivered
- `credits_used` (integer, default 0) — credits deducted
- `continuation_token` (text, nullable) — for paginated follower pulls
- `error_message` (text, nullable) — populated if status = 'failed'
- `created_at` (timestamptz)
- `completed_at` (timestamptz, nullable)

### 3. followers
- `id` (uuid, PK)
- `scan_id` (uuid, FK → scans.id ON DELETE CASCADE)
- `user_id` (uuid, FK → profiles.id, NOT NULL DEFAULT auth.uid())
- `tiktok_user_id` (text) — TikTok's internal user ID
- `username` (text) — e.g. "@ava.glowsup"
- `display_name` (text, nullable) — nickName from scraper
- `profile_url` (text, nullable)
- `follower_count` (integer, nullable) — fans
- `video_count` (integer, nullable) — video
- `verified` (boolean, default false)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)

### 4. videos
- `id` (uuid, PK)
- `scan_id` (uuid, FK → scans.id ON DELETE CASCADE)
- `user_id` (uuid, FK → profiles.id, NOT NULL DEFAULT auth.uid())
- `tiktok_video_id` (text, nullable)
- `caption` (text, nullable) — full caption text
- `views` (bigint, nullable) — playCount
- `likes` (bigint, nullable) — diggCount
- `comments` (bigint, nullable) — commentCount
- `shares` (bigint, nullable) — shareCount
- `saves` (bigint, nullable) — collectCount
- `sound_name` (text, nullable) — musicMeta
- `duration_seconds` (integer, nullable) — videoMeta.duration
- `posted_at` (timestamptz, nullable) — createTimeISO
- `hashtags` (text[], nullable) — array of hashtags
- `created_at` (timestamptz)

## Security
- RLS enabled on all four tables.
- profiles: user can SELECT and UPDATE only their own row. INSERT is handled
  by a trigger or by the client on signup (only own row).
- scans: user can CRUD only their own scans (auth.uid() = user_id).
- followers: user can SELECT only followers from scans they own.
  INSERT only for own rows. DELETE via cascade from scans.
- videos: same pattern as followers.
- All policies scoped TO authenticated only (app has sign-in).
- user_id columns default to auth.uid() so client inserts work without
  explicitly passing user_id.

## Indexes
- scans(user_id) — dashboard list query
- followers(scan_id) — join to scan
- followers(user_id) — RLS policy check
- videos(scan_id) — join to scan
- videos(user_id) — RLS policy check
*/

-- ===== profiles =====
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  credits_balance integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ===== scans =====
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  tiktok_handle text NOT NULL,
  scan_type text NOT NULL DEFAULT 'followers',
  status text NOT NULL DEFAULT 'pending',
  results_limit integer NOT NULL DEFAULT 1000,
  followers_count integer NOT NULL DEFAULT 0,
  videos_count integer NOT NULL DEFAULT 0,
  credits_used integer NOT NULL DEFAULT 0,
  continuation_token text,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_scans" ON scans;
CREATE POLICY "select_own_scans"
ON scans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_scans" ON scans;
CREATE POLICY "insert_own_scans"
ON scans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_scans" ON scans;
CREATE POLICY "update_own_scans"
ON scans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_scans" ON scans;
CREATE POLICY "delete_own_scans"
ON scans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_created_at ON scans(created_at DESC);

-- ===== followers =====
CREATE TABLE IF NOT EXISTS followers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  tiktok_user_id text,
  username text NOT NULL,
  display_name text,
  profile_url text,
  follower_count integer,
  video_count integer,
  verified boolean NOT NULL DEFAULT false,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE followers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_followers" ON followers;
CREATE POLICY "select_own_followers"
ON followers FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_followers" ON followers;
CREATE POLICY "insert_own_followers"
ON followers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_followers" ON followers;
CREATE POLICY "update_own_followers"
ON followers FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_followers" ON followers;
CREATE POLICY "delete_own_followers"
ON followers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_followers_scan_id ON followers(scan_id);
CREATE INDEX IF NOT EXISTS idx_followers_user_id ON followers(user_id);

-- ===== videos =====
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id uuid NOT NULL REFERENCES scans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  tiktok_video_id text,
  caption text,
  views bigint,
  likes bigint,
  comments bigint,
  shares bigint,
  saves bigint,
  sound_name text,
  duration_seconds integer,
  posted_at timestamptz,
  hashtags text[],
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_videos" ON videos;
CREATE POLICY "select_own_videos"
ON videos FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_videos" ON videos;
CREATE POLICY "insert_own_videos"
ON videos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_videos" ON videos;
CREATE POLICY "update_own_videos"
ON videos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_videos" ON videos;
CREATE POLICY "delete_own_videos"
ON videos FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_videos_scan_id ON videos(scan_id);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_posted_at ON videos(posted_at DESC);

-- ===== Trigger: auto-create profile on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
