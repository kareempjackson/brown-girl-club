import { NextRequest, NextResponse } from 'next/server';
import { validateRedemption, recordRedemption } from '@/lib/redemption';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { sendMail, renderRedemptionReceiptEmail } from '@/lib/email';

/**
 * POST /api/redeem
 * Records a redemption after validation
 * 
 * Body: {
 *   userId: string,
 *   itemType: 'coffee' | 'food' | 'dessert',
 *   itemName: string,
 *   location?: string,
 *   quantity?: number
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, itemType, itemName, location, quantity } = await request.json();

    // Validate inputs
    if (!userId || !itemType || !itemName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, itemType, itemName' },
        { status: 400 }
      );
    }

    if (!['coffee', 'food', 'dessert'].includes(itemType)) {
      return NextResponse.json(
        { error: 'Invalid itemType. Must be: coffee, food, or dessert' },
        { status: 400 }
      );
    }

    // Step 1: Validate the redemption
    const validation = await validateRedemption(userId, itemType);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.reason || 'Redemption not allowed',
        },
        { status: 403 }
      );
    }

    // Step 2: Record the redemption (supports quantity)
    const qty = Math.max(1, Math.trunc(Number(quantity) || 1));
    if (itemType === 'coffee' && typeof validation.remainingCoffees === 'number') {
      if (qty > validation.remainingCoffees) {
        return NextResponse.json(
          { success: false, error: `Only ${validation.remainingCoffees} coffees remaining this period` },
          { status: 400 }
        );
      }
    }

    let redemptions: any[] = [];
    if (qty === 1) {
      const redemption = await recordRedemption(
        userId,
        validation.subscription.id,
        itemType,
        itemName,
        location
      );
      redemptions = [redemption];
    } else {
      const { recordUsageBulk } = await import('@/lib/supabase');
      redemptions = await recordUsageBulk({
        userId,
        subscriptionId: validation.subscription.id,
        itemType,
        itemName,
        location,
        quantity: qty,
      });
    }

    // Step 3: Compute remaining counts after this redemption
    const remainingCoffees = validation.remainingCoffees !== undefined
      ? Math.max(0, validation.remainingCoffees - (itemType === 'coffee' ? qty : 0))
      : undefined;
    const remainingFood = validation.remainingFood !== undefined
      ? Math.max(0, validation.remainingFood - (itemType === 'food' ? 1 : 0))
      : undefined;

    // Step 4: Send redemption receipt email (best-effort)
    try {
      type UserEmailName = Pick<Database['public']['Tables']['users']['Row'], 'name' | 'email'>;
      const userRes = await supabase
        .from('users')
        .select('name, email')
        .eq('id', userId)
        .single();
      const user = (userRes.data as unknown) as UserEmailName | null;

      const planName: string = validation.subscription?.plan_name || 'Membership';

      const firstRedemption = redemptions[0] || null;
      if (user && user.email && firstRedemption) {
        const emailTpl = renderRedemptionReceiptEmail({
          name: user.name || 'Member',
          planName,
          itemType,
          itemName,
          redeemedAt: firstRedemption.redeemed_at,
          location: firstRedemption.location || undefined,
          remainingCoffees,
          remainingFood,
        });
        await sendMail({ to: user.email, subject: emailTpl.subject, html: emailTpl.html }).catch(() => {});
      }
    } catch (_e) {
      // ignore email failures
    }

    // Step 5: Return success
    return NextResponse.json({
      success: true,
      redemptions: redemptions.map((r) => ({
        id: r.id,
        itemType: r.item_type,
        itemName: r.item_name,
        redeemedAt: r.redeemed_at,
        location: r.location,
      })),
      subscription: {
        planName: validation.subscription.plan_name,
      },
      remaining: {
        coffees: remainingCoffees,
        food: remainingFood,
      },
      needsNotice: Boolean((validation as any).needsNotice),
    });
  } catch (error: any) {
    console.error('Redemption API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to record redemption' 
      },
      { status: 500 }
    );
  }
}
