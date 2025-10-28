export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser, createSubscription } from '@/lib/supabase';

function getPlanDisplayName(planId: string): string {
  const planNames: Record<string, string> = {
    '3-coffees': 'The Chill Mode — 3 Coffees / Week',
    'daily-coffee': 'The Daily Fix — 1 Coffee / Day',
    'creator': 'The Double Shot Life — 2 Coffees / Day',
    'unlimited': 'The Caffeine Royalty — 4 Coffees / Day',
    'meal-5': '5-Day Meal Prep',
    'meal-10': '10-Day Meal Prep',
    'meal-15': '15-Day Meal Prep',
    'meal-20': '20-Day Meal Prep',
  };
  return planNames[planId] || 'Membership';
}

import { sendMail, renderCashPaymentReminderEmail } from '@/lib/email';
import { getBaseUrl } from '@/lib/url';

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, planId } = await request.json();

    if (!email || !name || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1) Get or create user
    const user = await getOrCreateUser({ email, name, phone });

    // 2) Create subscription with pending_payment
    const now = new Date();
    const periodStart = now.toISOString();
    const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const subscription = await createSubscription({
      userId: user.id,
      planId,
      planName: getPlanDisplayName(planId),
      status: 'pending_payment',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    });

    // Send cash payment reminder email (non-blocking on failures)
    try {
      const baseUrl = getBaseUrl(request.nextUrl.origin);
      const emailTpl = renderCashPaymentReminderEmail({
        name: user.name || 'Member',
        planName: getPlanDisplayName(planId),
        baseUrl,
      });
      await sendMail({ to: user.email, subject: emailTpl.subject, html: emailTpl.html });
    } catch (e) {
      console.warn('Cash payment reminder email skipped/failed:', e);
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      subscription: {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.plan_id,
        planName: subscription.plan_name,
      }
    });
  } catch (error: any) {
    console.error('Join API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}


