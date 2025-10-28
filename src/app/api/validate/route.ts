export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { validateRedemption } from '@/lib/redemption';
import { getUserByEmail } from '@/lib/supabase';

/**
 * POST /api/validate
 * Validates if a user can redeem an item
 * 
 * Body: { userId: string, itemType: 'coffee' | 'food' | 'dessert' }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, itemType } = await request.json();

    if ((!userId && !email) || !itemType) {
      return NextResponse.json(
        { error: 'Missing userId/email or itemType' },
        { status: 400 }
      );
    }
    let resolvedUserId = userId;
    if (!resolvedUserId && email) {
      const user = await getUserByEmail(String(email));
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      resolvedUserId = (user as any).id as string;
    }

    // Validate the redemption
    const validation = await validateRedemption(resolvedUserId as string, itemType);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          valid: false,
          reason: validation.reason,
        },
        { status: 200 }
      );
    }

    // Return success with subscription info
    return NextResponse.json({
      valid: true,
      subscription: {
        id: validation.subscription.id,
        planName: validation.subscription.plan_name,
        planId: validation.subscription.plan_id,
        status: validation.subscription.status,
        expiresAt: validation.subscription.current_period_end,
      },
      limits: {
        remainingCoffees: validation.remainingCoffees,
        remainingFood: validation.remainingFood,
        period: {
          start: validation.subscription.current_period_start,
          end: validation.subscription.current_period_end,
        },
      },
      usageToday: validation.usageToday || [],
    });
  } catch (error) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/validate?userId=xxx
 * Get user's subscription and usage info
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId && !email) {
      return NextResponse.json(
        { error: 'Missing userId or email parameter' },
        { status: 400 }
      );
    }
    let resolvedUserId = userId;
    if (!resolvedUserId && email) {
      const user = await getUserByEmail(String(email));
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      resolvedUserId = (user as any).id as string;
    }

    // Validate for coffee (most common item)
    const validation = await validateRedemption(resolvedUserId as string, 'coffee');

    if (!validation.subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subscription: {
        id: validation.subscription.id,
        userId: validation.subscription.user_id,
        planName: validation.subscription.plan_name,
        planId: validation.subscription.plan_id,
        status: validation.subscription.status,
        expiresAt: validation.subscription.current_period_end,
      },
      limits: {
        remainingCoffees: validation.remainingCoffees,
        remainingFood: validation.remainingFood,
      },
      usageToday: validation.usageToday || [],
      memberUserId: resolvedUserId,
    });
  } catch (error) {
    console.error('Get validation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
