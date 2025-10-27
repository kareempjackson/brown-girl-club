// Redemption business logic and validation

import { supabase } from './supabase';

function getTimezoneOffsetMinutes(): number {
  const raw = (process.env.BGC_TZ_OFFSET_MINUTES || process.env.NEXT_PUBLIC_BGC_TZ_OFFSET_MINUTES || '-240') as string;
  const n = Number(raw);
  if (!Number.isFinite(n)) return -240; // default to UTC-4
  // clamp to sensible range (-12h to +14h)
  return Math.max(-720, Math.min(840, Math.trunc(n)));
}

function getStartOfDayUtcDate(now: Date = new Date()): Date {
  const offset = getTimezoneOffsetMinutes();
  const localMs = now.getTime() + offset * 60_000;
  const local = new Date(localMs);
  local.setHours(0, 0, 0, 0);
  const utcMs = local.getTime() - offset * 60_000;
  return new Date(utcMs);
}

function getStartOfWeekUtcDate(now: Date = new Date()): Date {
  const offset = getTimezoneOffsetMinutes();
  const localMs = now.getTime() + offset * 60_000;
  const local = new Date(localMs);
  const day = local.getDay();
  const diff = local.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  local.setDate(diff);
  local.setHours(0, 0, 0, 0);
  const utcMs = local.getTime() - offset * 60_000;
  return new Date(utcMs);
}

export interface PlanLimits {
  coffeePerDay?: number;
  coffeePerWeek?: number;
  foodPerDay?: number;
  unlimited?: boolean;
}

// Define limits for each plan
export const PLAN_LIMITS: Record<string, PlanLimits> = {
  '3-coffees': {
    coffeePerWeek: 3,
  },
  'daily-coffee': {
    coffeePerDay: 1,
  },
  'creator': {
    coffeePerDay: 2, // bundle plan allows up to 2 coffees/day across members
    foodPerDay: 1,
  },
  'unlimited': {
    coffeePerDay: 4, // rename plan later in UI; logic: 4/day across members
  },
};

export interface RedemptionValidation {
  isValid: boolean;
  reason?: string;
  subscription?: any;
  remainingCoffees?: number;
  remainingFood?: number;
  usageToday?: any[];
  usageThisWeek?: any[];
  needsNotice?: boolean;
}

/**
 * Validate if a user can redeem an item
 */
export async function validateRedemption(
  userId: string,
  itemType: 'coffee' | 'food' | 'dessert'
): Promise<RedemptionValidation> {
  try {
    // 1. Get user's active subscription
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subError || !subscriptions) {
      return {
        isValid: false,
        reason: 'No active subscription found',
      };
    }

    const subscription = subscriptions;

    // 2. Check if subscription has expired
    const now = new Date();
    const periodEnd = new Date(subscription.current_period_end);
    if (now > periodEnd) {
      return {
        isValid: false,
        reason: 'Subscription has expired',
        subscription,
      };
    }

    // 3. Get plan limits
    const planId = subscription.plan_id;
    const limits = PLAN_LIMITS[planId];

    if (!limits) {
      return {
        isValid: false,
        reason: 'Invalid plan type',
        subscription,
      };
    }

    // 4. Unlimited flag no longer used; plans define per-day limits instead

    // 5. Get today's usage
    const startOfDay = getStartOfDayUtcDate();

    const { data: usageToday, error: todayError } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .gte('redeemed_at', startOfDay.toISOString());

    if (todayError) {
      console.error('Error fetching today usage:', todayError);
      return {
        isValid: false,
        reason: 'Error checking usage',
        subscription,
      };
    }

    // 6. Coffee behavior
    if (itemType === 'coffee') {
      const coffeesToday = usageToday?.filter((u) => u.item_type === 'coffee').length || 0;
      // Cafe policy: unlimited redemptions per day, but if plan has per-day cap, enforce at subscription level (e.g., creator/unlimited -> 4/day)
      // Note: per-day cap is across the subscription, not per user (enforced below using subscription_id count)
      const needsNotice = coffeesToday >= 5;
      // Weekly cap handled below if configured
    }

    // 7. Check daily food limit
    if (itemType === 'food' && limits.foodPerDay) {
      const foodToday = usageToday?.filter((u) => u.item_type === 'food').length || 0;
      if (foodToday >= limits.foodPerDay) {
        return {
          isValid: false,
          reason: `Daily food limit reached (${limits.foodPerDay})`,
          subscription,
          usageToday,
          remainingFood: 0,
        };
      }
      return {
        isValid: true,
        subscription,
        usageToday,
        remainingFood: limits.foodPerDay - foodToday,
      };
    }

    // 8. Check weekly coffee limit (for 3-coffees plan)
    if (itemType === 'coffee' && limits.coffeePerWeek) {
      // Get start of week (Monday) in cafe timezone, converted to UTC
      const startOfWeek = getStartOfWeekUtcDate();

      const { data: usageThisWeek, error: weekError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', userId)
        .eq('item_type', 'coffee')
        .gte('redeemed_at', startOfWeek.toISOString());

      if (weekError) {
        console.error('Error fetching week usage:', weekError);
        return {
          isValid: false,
          reason: 'Error checking usage',
          subscription,
        };
      }

      const coffeesThisWeek = usageThisWeek?.length || 0;
      if (coffeesThisWeek >= limits.coffeePerWeek) {
        return {
          isValid: false,
          reason: `Weekly coffee limit reached (${limits.coffeePerWeek})`,
          subscription,
          usageThisWeek,
          remainingCoffees: 0,
        };
      }

      // For weekly-limited plans, still allow unlimited per day but capped by weekly remaining
      // Add notice flag if today's redemptions exceed 5
      const coffeesToday = (await supabase
        .from('usage')
        .select('*')
        .eq('user_id', userId)
        .gte('redeemed_at', getStartOfDayUtcDate().toISOString())
      ).data?.filter(u => u.item_type === 'coffee').length || 0;

      return {
        isValid: true,
        subscription,
        usageThisWeek,
        remainingCoffees: limits.coffeePerWeek - coffeesThisWeek,
        needsNotice: coffeesToday >= 5,
      };
    }

    // 9. Enforce per-day per-subscription coffee caps for bundle plans (creator/unlimited -> 4/day)
    if (itemType === 'coffee' && limits.coffeePerDay) {
      const startOfDay = getStartOfDayUtcDate();
      const { data: subDayUsage, error: subDayErr } = await supabase
        .from('usage')
        .select('*')
        .eq('subscription_id', subscription.id)
        .eq('item_type', 'coffee')
        .gte('redeemed_at', startOfDay.toISOString());
      if (!subDayErr) {
        const count = (subDayUsage || []).length;
        if (count >= limits.coffeePerDay) {
          return {
            isValid: false,
            reason: `Daily coffee limit reached (${limits.coffeePerDay}) for this subscription`,
            subscription,
            usageToday,
            remainingCoffees: 0,
          };
        }
        return {
          isValid: true,
          subscription,
          usageToday,
          remainingCoffees: limits.coffeePerDay - count,
        };
      }
    }

    // 9. Default: allow if item type not restricted by plan
    return {
      isValid: true,
      subscription,
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      isValid: false,
      reason: 'System error during validation',
    };
  }
}

/**
 * Record a redemption
 */
export async function recordRedemption(
  userId: string,
  subscriptionId: string,
  itemType: 'coffee' | 'food' | 'dessert',
  itemName: string,
  location?: string
) {
  try {
    const { data, error } = await supabase.from('usage').insert([
      {
        user_id: userId,
        subscription_id: subscriptionId,
        item_type: itemType,
        item_name: itemName,
        location: location || 'Main Location',
        redeemed_at: new Date().toISOString(),
      },
    ]).select().single();

    if (error) {
      console.error('Error recording redemption:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Redemption error:', error);
    throw error;
  }
}

/**
 * Get user's redemption history
 */
export async function getRedemptionHistory(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .order('redeemed_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}

/**
 * Get today's usage summary
 */
export async function getTodayUsageSummary(userId: string) {
  const startOfDay = getStartOfDayUtcDate();

  try {
    const { data, error } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .gte('redeemed_at', startOfDay.toISOString());

    if (error) throw error;

    const coffees = data?.filter((u) => u.item_type === 'coffee').length || 0;
    const food = data?.filter((u) => u.item_type === 'food').length || 0;
    const desserts = data?.filter((u) => u.item_type === 'dessert').length || 0;

    return { coffees, food, desserts, total: data?.length || 0 };
  } catch (error) {
    console.error('Error fetching today summary:', error);
    return { coffees: 0, food: 0, desserts: 0, total: 0 };
  }
}
