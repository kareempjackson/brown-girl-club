export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyUserToken, createMemberInviteToken } from '@/lib/user-auth';
import { supabase } from '@/lib/supabase';
import { getActiveSubscriptionByUserId } from '@/lib/supabase';
import { PLAN_LIMITS } from '@/lib/redemption';
import { normalizePlanId } from '@/lib/plans';
import { getBaseUrl } from '@/lib/url';
import { renderMemberInviteEmail, sendMail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bgc_user')?.value || '';
    const user = verifyUserToken(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const subscription = await getActiveSubscriptionByUserId(user.userId);
    if (!subscription) return NextResponse.json({ error: 'No active subscription' }, { status: 400 });

    const planId = normalizePlanId(subscription.plan_id);
    const hasMonthly = PLAN_LIMITS[planId as keyof typeof PLAN_LIMITS]?.coffeePerMonth;
    const isBundlePlan = ['double-shot', 'caffeine-royalty'].includes(planId);
    if (!hasMonthly || !isBundlePlan) {
      return NextResponse.json({ error: 'Members not allowed for this plan' }, { status: 400 });
    }

    // Enforce max seats (including owner): double-shot -> 2, caffeine-royalty -> 4
    const maxSeats = planId === 'double-shot' ? 2 : 4;
    const { data: members, error: memErr } = await supabase
      .from('subscription_members')
      .select('id', { count: 'exact', head: false })
      .eq('subscription_id', subscription.id);
    if (memErr) return NextResponse.json({ error: 'Unable to check member count' }, { status: 500 });
    const currentSeats = 1 + ((members as any[])?.length || 0); // owner + members
    if (currentSeats >= maxSeats) {
      return NextResponse.json({ error: 'Max members reached for this plan' }, { status: 400 });
    }

    // Create invite token and send email
    const inviteToken = createMemberInviteToken({ subscriptionId: subscription.id, email, name });
    const baseUrl = getBaseUrl(req.nextUrl.origin);
    const inviteUrl = `${baseUrl}/api/user/members/accept?token=${encodeURIComponent(inviteToken)}`;
    const { subject, html } = renderMemberInviteEmail({ inviterName: '', planName: subscription.plan_name, inviteUrl, baseUrl });
    await sendMail({ to: email, subject, html });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('Member invite error:', e);
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}


