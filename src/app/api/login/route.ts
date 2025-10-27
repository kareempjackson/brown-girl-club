export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createUserToken } from '@/lib/user-auth';
import { getOrCreateUser } from '@/lib/supabase';

const USER_COOKIE_NAME = 'bgc_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(req: NextRequest) {
  try {
    const { email, name, phone } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const user = await getOrCreateUser({ email, name: name || 'Member', phone });
    const token = createUserToken(user.id, user.email, COOKIE_MAX_AGE);

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set({
      name: USER_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Login failed' }, { status: 500 });
  }
}


