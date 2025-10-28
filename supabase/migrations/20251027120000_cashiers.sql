-- Cashiers table for admin-managed cashier accounts
CREATE TABLE IF NOT EXISTS cashiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  invited_by TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active | revoked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cashiers_email ON cashiers(email);
CREATE INDEX IF NOT EXISTS idx_cashiers_status ON cashiers(status);

-- Trigger
CREATE TRIGGER update_cashiers_updated_at BEFORE UPDATE ON cashiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE cashiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to cashiers" ON cashiers
    FOR ALL USING (auth.role() = 'service_role');


