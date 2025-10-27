export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { getTodayUsageSummary } from '@/lib/redemption';

const PLAN_PRICES: Record<string, number> = {
  '3-coffees': 199,
  'daily-coffee': 400,
  'creator': 950,
  'unlimited': 1500,
};

export async function GET(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bgc_admin')?.value || '';
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch subscriptions with user info
    const { data: subs, error } = await supabase
      .from('subscriptions')
      .select('*, users(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const latestByUser = new Map<string, any>();
    for (const s of subs || []) {
      if (!latestByUser.has(s.user_id)) {
        latestByUser.set(s.user_id, s);
      }
    }

    // Build subscriber rows and enrich usage
    const rows: any[] = [];
    for (const sub of latestByUser.values()) {
      const user = (sub as any).users || {};
      const planId: string = sub.plan_id;
      const price = PLAN_PRICES[planId] ?? 0;
      const statusRaw: string = sub.status || 'active';
      const status = statusRaw === 'pending_payment' ? 'unpaid' : statusRaw;
      const usageToday = await getTodayUsageSummary(sub.user_id);
      const usageTotal = planId === 'unlimited' ? 999 : 30;

      rows.push({
        id: sub.id,
        userId: sub.user_id,
        name: user.name || 'Member',
        email: user.email || '',
        phone: user.phone || '',
        plan: planId,
        planName: sub.plan_name,
        status,
        mrr: status === 'active' ? price : 0,
        nextBillingDate: sub.current_period_end,
        startDate: sub.current_period_start,
        usageCurrent: usageToday.total || 0,
        usageTotal,
        notes: '',
      });
    }

    return NextResponse.json({ subscribers: rows, count: rows.length, generatedAt: new Date().toISOString() }, { status: 200 });
  } catch (e: any) {
    console.error('Admin subscribers API error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bgc_admin')?.value || '';
    const admin = verifyAdminToken(token);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, userId } = await req.json();
    if (!email && !userId) {
      return NextResponse.json({ error: 'Provide email or userId' }, { status: 400 });
    }

    let targetUserId = userId as string | undefined;
    if (!targetUserId && email) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', String(email))
        .single();
      if (error) throw error;
      if (!user) {
        return NextResponse.json({ ok: true, message: 'User not found, nothing to delete' }, { status: 200 });
      }
      targetUserId = user.id as string;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // No external wallet passes to clean up

    // Delete the user (CASCADE handles subscriptions, usage, invoices)
    const { error: delError } = await supabase
      .from('users')
      .delete()
      .eq('id', targetUserId);
    if (delError) throw delError;

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    console.error('Admin delete subscriber error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}


