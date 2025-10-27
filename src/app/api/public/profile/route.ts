export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { supabase, getActiveSubscriptionByUserId } from '@/lib/supabase';
import { getTodayUsageSummary, getRedemptionHistory, validateRedemption } from '@/lib/redemption';

/**
 * GET /api/public/profile?userId=xxx
 * Public-safe member profile information for display after QR scan
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Get user (only expose id, name, memberSince)
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, created_at')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get active subscription (direct or via membership)
    const subscription = await getActiveSubscriptionByUserId(userId);

    // Limits and usage
    let limits: any = {};
    if (subscription) {
      try {
        const coffeeValidation = await validateRedemption(userId, 'coffee');
        const foodValidation = await validateRedemption(userId, 'food');
        limits = {
          remainingCoffees: coffeeValidation.remainingCoffees ?? null,
          remainingFood: foodValidation.remainingFood ?? null,
          unlimited: coffeeValidation.subscription && coffeeValidation.subscription.plan_id === 'unlimited' ? true : false,
        };
      } catch (_e) {
        limits = {};
      }
    }

    const usageToday = await getTodayUsageSummary(userId);
    const recent = await getRedemptionHistory(userId, 5);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        memberSince: user.created_at,
      },
      subscription: subscription ? {
        id: subscription.id,
        planId: subscription.plan_id,
        planName: subscription.plan_name,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        createdAt: subscription.created_at,
      } : null,
      limits,
      usage: {
        today: usageToday,
        recent: recent.map((r: any) => ({
          id: r.id,
          itemType: r.item_type,
          itemName: r.item_name,
          redeemedAt: r.redeemed_at,
          location: r.location,
        })),
      },
    });
  } catch (error) {
    console.error('Public profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


