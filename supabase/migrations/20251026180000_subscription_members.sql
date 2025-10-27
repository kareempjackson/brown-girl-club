-- Subscription members (shared accounts)
create table if not exists subscription_members (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references subscriptions(id) on delete cascade,
  member_user_id text not null references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (subscription_id, member_user_id)
);

-- Helpful index to look up by member user
create index if not exists idx_subscription_members_member on subscription_members(member_user_id);


