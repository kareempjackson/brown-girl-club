-- Add subscription_addons table to support add-on coffee packages per billing period

CREATE TABLE IF NOT EXISTS subscription_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- e.g., 'coffee'
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_subscription_addons_subscription_id ON subscription_addons(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_period ON subscription_addons(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_subscription_addons_item_type ON subscription_addons(item_type);

ALTER TABLE subscription_addons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access to subscription_addons" ON subscription_addons
  FOR ALL USING (auth.role() = 'service_role');

COMMENT ON TABLE subscription_addons IS 'Add-on packages that increase allowances within a billing period';

