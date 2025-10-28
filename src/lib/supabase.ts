import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Database types (hybrid model)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          status: string; // pending_payment | active | paused | cancelled
          current_period_start: string;
          current_period_end: string;
          cancel_at: string | null;
          paused_at: string | null;
          wallet_pass_id: string | null;
          wallet_pass_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          plan_name: string;
          status: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at?: string | null;
          paused_at?: string | null;
          wallet_pass_id?: string | null;
          wallet_pass_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at?: string | null;
          paused_at?: string | null;
          wallet_pass_id?: string | null;
          wallet_pass_url?: string | null;
          updated_at?: string;
        };
      };
      usage: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string;
          redeemed_at: string;
          location: string | null;
          item_type: string;
          item_name: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id: string;
          redeemed_at?: string;
          location?: string | null;
          item_type: string;
          item_name?: string | null;
        };
      };
      subscription_members: {
        Row: {
          id: string;
          subscription_id: string;
          member_user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          member_user_id: string;
          created_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          user_id: string;
          subscription_id: string | null;
          amount: number;
          currency: string;
          status: string;
          paid_at: string;
          created_at: string;
          issued_by?: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          subscription_id?: string | null;
          amount: number;
          currency: string;
          status: string;
          paid_at: string;
          created_at?: string;
          issued_by?: string | null;
        };
      };
      cashiers: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          invited_by: string | null;
          status: string; // active | revoked
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          invited_by?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          invited_by?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          invited_by: string | null;
          status: string; // active | revoked
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          invited_by?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          invited_by?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      subscription_addons: {
        Row: {
          id: string;
          subscription_id: string;
          item_type: string;
          quantity: number;
          period_start: string;
          period_end: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          subscription_id: string;
          item_type: string;
          quantity: number;
          period_start: string;
          period_end: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

// Create Supabase client (server-only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;
const supabaseKey = serviceRoleKey || anonKey;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// Helpers
export async function createUser(data: {
  id?: string;
  email: string;
  name: string;
  phone?: string;
}) {
  const { data: user, error } = await (supabase as any)
    .from('users')
    .insert({
      id: data.id || generateUserId(),
      email: data.email,
      name: data.name,
      phone: data.phone || null,
    })
    .select()
    .single();

  if (error) throw error;
  return user;
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return data;
}

export async function getOrCreateUser(params: { email: string; name: string; phone?: string }): Promise<Database['public']['Tables']['users']['Row']> {
  const existing = await getUserByEmail(params.email);
  if (existing) return existing as Database['public']['Tables']['users']['Row'];
  return createUser({ email: params.email, name: params.name, phone: params.phone });
}

export async function createSubscription(data: {
  userId: string;
  planId: string;
  planName: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  walletPassId?: string;
  walletPassUrl?: string;
}): Promise<Database['public']['Tables']['subscriptions']['Row']> {
  const { data: subscription, error } = await (supabase as any)
    .from('subscriptions')
    .insert({
      user_id: data.userId,
      plan_id: data.planId,
      plan_name: data.planName,
      status: data.status,
      current_period_start: data.currentPeriodStart,
      current_period_end: data.currentPeriodEnd,
      wallet_pass_id: data.walletPassId || null,
      wallet_pass_url: data.walletPassUrl || null,
    })
    .select()
    .single();

  if (error) throw error;
  return subscription as Database['public']['Tables']['subscriptions']['Row'];
}

export async function updateSubscriptionById(
  subscriptionId: string,
  updates: {
    status?: string;
    currentPeriodStart?: string;
    currentPeriodEnd?: string;
    cancelAt?: string | null;
    pausedAt?: string | null;
    walletPassId?: string;
    walletPassUrl?: string;
  }
): Promise<Database['public']['Tables']['subscriptions']['Row']> {
  const { data, error } = await (supabase as any)
    .from('subscriptions')
    .update({
      status: updates.status,
      current_period_start: updates.currentPeriodStart,
      current_period_end: updates.currentPeriodEnd,
      cancel_at: updates.cancelAt,
      paused_at: updates.pausedAt,
      wallet_pass_id: updates.walletPassId,
      wallet_pass_url: updates.walletPassUrl,
      updated_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId)
    .select()
    .single();

  if (error) throw error;
  return data as Database['public']['Tables']['subscriptions']['Row'];
}

export async function getSubscriptionById(subscriptionId: string): Promise<
  (Database['public']['Tables']['subscriptions']['Row'] & { users?: Database['public']['Tables']['users']['Row'] | null }) | null
> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, users(*)')
    .eq('id', subscriptionId)
    .single();

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as unknown) as Database['public']['Tables']['subscriptions']['Row'] & {
    users?: Database['public']['Tables']['users']['Row'] | null;
  };
}

export async function getActiveSubscriptionByUserId(userId: string): Promise<Database['public']['Tables']['subscriptions']['Row'] | null> {
  // Direct subscription
  let { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    // Shared membership: find a subscription where this user is a member
    const { data: member, error: memErr } = await supabase
      .from('subscription_members')
      .select('subscription_id')
      .eq('member_user_id', userId)
      .limit(1)
      .single();
    if (!memErr && member) {
      const { data: sub, error: subErr } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', (member as any).subscription_id)
        .eq('status', 'active')
        .single();
      if (!subErr) data = sub as any;
    }
  }

  if (error && (error as any).code !== 'PGRST116') throw error;
  return (data as unknown) as Database['public']['Tables']['subscriptions']['Row'] | null;
}

export async function recordUsage(data: {
  userId: string;
  subscriptionId: string;
  itemType: string;
  itemName?: string;
  location?: string;
}) {
  const { data: usage, error } = await (supabase as any)
    .from('usage')
    .insert({
      user_id: data.userId,
      subscription_id: data.subscriptionId,
      item_type: data.itemType,
      item_name: data.itemName || null,
      location: data.location || null,
    })
    .select()
    .single();

  if (error) throw error;
  return usage;
}

export async function recordUsageBulk(params: {
  userId: string;
  subscriptionId: string;
  itemType: string;
  itemName?: string;
  location?: string;
  quantity: number;
}) {
  const quantity = Math.max(1, Math.trunc(params.quantity || 1));
  const rows = Array.from({ length: quantity }).map(() => ({
    user_id: params.userId,
    subscription_id: params.subscriptionId,
    item_type: params.itemType,
    item_name: params.itemName || null,
    location: params.location || null,
  }));
  const { data, error } = await (supabase as any)
    .from('usage')
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

export async function addSubscriptionAddon(params: {
  subscriptionId: string;
  itemType: string;
  quantity: number;
  periodStart: string;
  periodEnd: string;
  notes?: string;
}): Promise<Database['public']['Tables']['subscription_addons']['Row']> {
  const { data, error } = await (supabase as any)
    .from('subscription_addons')
    .insert({
      subscription_id: params.subscriptionId,
      item_type: params.itemType,
      quantity: Math.max(1, Math.trunc(params.quantity)),
      period_start: params.periodStart,
      period_end: params.periodEnd,
      notes: params.notes || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Database['public']['Tables']['subscription_addons']['Row'];
}

export async function sumSubscriptionAddonsInPeriod(params: {
  subscriptionId: string;
  itemType: string;
  periodStart: string;
  periodEnd: string;
}): Promise<number> {
  const { data, error } = await (supabase as any)
    .from('subscription_addons')
    .select('quantity')
    .eq('subscription_id', params.subscriptionId)
    .eq('item_type', params.itemType)
    .gte('period_start', params.periodStart)
    .lte('period_end', params.periodEnd);
  if (error) throw error;
  const rows = (data || []) as { quantity: number }[];
  return rows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
}

