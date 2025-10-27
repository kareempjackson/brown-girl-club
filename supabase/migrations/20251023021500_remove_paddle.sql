-- Remove Paddle-specific columns from subscriptions (if they exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'paddle_subscription_id'
  ) THEN
    ALTER TABLE public.subscriptions DROP COLUMN paddle_subscription_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'paddle_customer_id'
  ) THEN
    ALTER TABLE public.subscriptions DROP COLUMN paddle_customer_id;
  END IF;
END $$;

-- Optional: drop any legacy indexes referencing those columns (if any existed)
-- Note: dropping the column also drops dependent indexes/constraints automatically


