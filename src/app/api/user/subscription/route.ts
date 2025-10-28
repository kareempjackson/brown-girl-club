export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken } from '@/lib/user-auth';
import { supabase } from '@/lib/supabase';
import { getTodayUsageSummary, getRedemptionHistory, validateRedemption, getCoffeeUsageInPeriod, getCoffeeAllowanceForPeriod, PLAN_LIMITS } from '@/lib/redemption';
import { normalizePlanId, getPlanDisplayName } from '@/lib/plans';
import type { Database } from '@/lib/supabase';

/**
 * GET /api/user/subscription?userId=xxx
 * Get user's subscription info, usage, and invoices
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let userId = searchParams.get('userId');
    let email = searchParams.get('email');

    if (!userId && !email) {
      const cookieStore = await cookies();
      const token = cookieStore.get('bgc_user')?.value || '';
      const payload = verifyUserToken(token);
      if (payload) {
        userId = payload.userId;
        email = payload.email || null as any;
      }
    }

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Missing userId or email parameter' },
        { status: 400 }
      );
    }

    // Get user
    let user: Database['public']['Tables']['users']['Row'] | null = null;
    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      user = data as Database['public']['Tables']['users']['Row'];
    } else {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', String(email))
        .single();
      
      if (error) throw error;
      user = data as Database['public']['Tables']['users']['Row'];
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get subscriptions
    const subsRes = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (subsRes.error) throw subsRes.error;
    const subscriptions = (subsRes.data as unknown) as Database['public']['Tables']['subscriptions']['Row'][];

    const activeSubscription = subscriptions?.find(s => s.status === 'active');

    // Get recent invoices
    const { data: invoices, error: invError } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (invError) throw invError;

    // Usage summaries
    const usageSummary = await getTodayUsageSummary(user.id);

    // Get recent redemptions
    const recentRedemptions = await getRedemptionHistory(user.id, 10);

    // Compute remaining limits (per plan rules)
    let limits: any = {};
    if (activeSubscription) {
      try {
        const coffeeValidation = await validateRedemption(user.id, 'coffee');
        const foodValidation = await validateRedemption(user.id, 'food');
        // Monthly usage across period (for all monthly plans; support legacy IDs by normalizing)
        let coffeesThisPeriod: number | undefined = undefined;
        let coffeeAllowance: number | undefined = undefined;
        const normalizedPlanId = normalizePlanId(activeSubscription.plan_id);
        const hasMonthly = PLAN_LIMITS[normalizedPlanId as keyof typeof PLAN_LIMITS]?.coffeePerMonth;
        if (hasMonthly) {
          coffeesThisPeriod = await getCoffeeUsageInPeriod({
            subscriptionId: activeSubscription.id,
            periodStart: activeSubscription.current_period_start,
            periodEnd: activeSubscription.current_period_end,
          });
          coffeeAllowance = await getCoffeeAllowanceForPeriod({
            planId: normalizedPlanId,
            subscriptionId: activeSubscription.id,
            periodStart: activeSubscription.current_period_start,
            periodEnd: activeSubscription.current_period_end,
          });
        }

        limits = {
          remainingCoffees: coffeeValidation.remainingCoffees,
          remainingFood: foodValidation.remainingFood,
          unlimited: coffeeValidation.subscription && coffeeValidation.subscription.plan_id === 'unlimited' ? true : false,
          period: {
            start: coffeeValidation.subscription.current_period_start,
            end: coffeeValidation.subscription.current_period_end,
          },
          periodCoffeeUsage: coffeesThisPeriod,
          periodCoffeeAllowance: coffeeAllowance,
        };
      } catch (e) {
        // swallow limits errors to not break dashboard
        limits = {};
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        memberSince: user.created_at,
      },
      subscription: activeSubscription ? {
        id: activeSubscription.id,
        planId: normalizePlanId(activeSubscription.plan_id),
        planName: getPlanDisplayName(activeSubscription.plan_id),
        status: activeSubscription.status,
        currentPeriodStart: activeSubscription.current_period_start,
        currentPeriodEnd: activeSubscription.current_period_end,
        cancelAt: activeSubscription.cancel_at,
        pausedAt: activeSubscription.paused_at,
        createdAt: activeSubscription.created_at,
      } : null,
      limits,
      usage: {
        today: usageSummary,
        recent: recentRedemptions.map((r: any) => ({
          id: r.id,
          itemType: r.item_type,
          itemName: r.item_name,
          location: r.location,
          redeemedAt: r.redeemed_at,
        })),
        period: activeSubscription ? {
          coffees: limits?.periodCoffeeUsage ?? 0,
          allowance: limits?.periodCoffeeAllowance ?? PLAN_LIMITS[normalizePlanId(activeSubscription.plan_id) as keyof typeof PLAN_LIMITS]?.coffeePerMonth ?? 30,
          remaining: Math.max(0, (limits?.periodCoffeeAllowance ?? PLAN_LIMITS[normalizePlanId(activeSubscription.plan_id) as keyof typeof PLAN_LIMITS]?.coffeePerMonth ?? 30) - (limits?.periodCoffeeUsage ?? 0)),
          start: activeSubscription.current_period_start,
          end: activeSubscription.current_period_end,
        } : undefined,
      },
      members: await (async () => {
        if (!activeSubscription) return [];
        const { data, error } = await supabase
          .from('subscription_members')
          .select('*, users:member_user_id(id, name, email)')
          .eq('subscription_id', activeSubscription.id);
        if (error) return [];
        const rows = (data as any[]) || [];
        return rows.map(r => ({ id: r.id, userId: r.users?.id, name: r.users?.name, email: r.users?.email }));
      })(),
      invoices: (invoices || []).map((inv: any) => ({
        id: inv.id,
        amount: parseFloat(inv.amount),
        currency: inv.currency,
        status: inv.status,
        paidAt: inv.paid_at,
        createdAt: inv.created_at,
        subscriptionId: inv.subscription_id,
      })),
      allSubscriptions: subscriptions?.map((s: any) => ({
        id: s.id,
        planName: s.plan_name,
        status: s.status,
        createdAt: s.created_at,
      })) || [],
    });
  } catch (error: any) {
    console.error('Get user subscription API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
