export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken, createAdminInviteToken } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';
import { getBaseUrl } from '@/lib/url';
import { renderAdminInviteEmail, sendMail } from '@/lib/email';

// List and create admins
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_admin')?.value || '';
  const admin = verifyAdminToken(token);
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ admins: data || [] }, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('bgc_admin')?.value || '';
    const admin = verifyAdminToken(token);
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // Upsert admin
    const { data: inserted, error: upErr } = await (supabase as any)
      .from('admins')
      .upsert({ email, name: name || null, invited_by: admin.email, status: 'active' }, { onConflict: 'email' })
      .select()
      .single();
    if (upErr) throw upErr;

    // Send invite email
    const inviteToken = createAdminInviteToken(email);
    const baseUrl = getBaseUrl(req.nextUrl.origin);
    const inviteUrl = `${baseUrl}/api/admin/admins/accept?token=${encodeURIComponent(inviteToken)}`;
    const { subject, html } = renderAdminInviteEmail({ inviteUrl, baseUrl });
    await sendMail({ to: email, subject, html });

    return NextResponse.json({ ok: true, admin: inserted }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}


