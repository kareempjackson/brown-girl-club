export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { verifyMemberInviteToken } from '@/lib/user-auth';
import { supabase, getOrCreateUser } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    const invite = verifyMemberInviteToken(token);
    if (!invite) {
      return NextResponse.redirect(new URL('/?invite=invalid', req.nextUrl));
    }

    // Ensure user exists
    const user = await getOrCreateUser({ email: invite.email, name: invite.name || invite.email.split('@')[0] });

    // Add to subscription_members
    const { data, error } = await (supabase as any)
      .from('subscription_members')
      .upsert({ subscription_id: invite.subscriptionId, member_user_id: user.id }, { onConflict: 'subscription_id,member_user_id' })
      .select()
      .single();
    if (error) throw error;

    return NextResponse.redirect(new URL('/dashboard?invite=accepted', req.nextUrl));
  } catch (e) {
    return NextResponse.redirect(new URL('/?invite=error', req.nextUrl));
  }
}


