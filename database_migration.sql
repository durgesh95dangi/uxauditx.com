-- 1. Add user_id to audits table for linking signed-in users to their scans
ALTER TABLE audits ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Add index for fast dashboard queries
CREATE INDEX IF NOT EXISTS audits_user_id_idx ON audits(user_id);
CREATE INDEX IF NOT EXISTS audits_email_idx ON audits(email);

-- 3. Enable Row Level Security (RLS) on audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- 4. Allow the service role to do anything (used by our API backend)
CREATE POLICY "service_role_all" ON audits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Allow authenticated users to see their own audits
CREATE POLICY "users_see_own_audits" ON audits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = auth.jwt()->>'email');
