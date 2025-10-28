import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_admin')?.value || '';
  const admin = verifyAdminToken(token);
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const updates = await req.json();
  const { data, error } = await (supabase as any)
    .from('cashiers')
    .update({
      name: typeof updates.name !== 'undefined' ? updates.name : undefined,
      status: typeof updates.status !== 'undefined' ? updates.status : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cashier: data }, { status: 200 });
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_admin')?.value || '';
  const admin = verifyAdminToken(token);
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await context.params;
  const { error } = await supabase
    .from('cashiers')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 200 });
}


