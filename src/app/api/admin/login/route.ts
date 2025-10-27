import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/admin-auth';

const ADMIN_COOKIE_NAME = 'bgc_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const cashierEmail = process.env.CASHIER_EMAIL;
    const cashierPassword = process.env.CASHIER_PASSWORD;
    if (!adminEmail || !adminPassword || !cashierEmail || !cashierPassword) {
      return NextResponse.json({ error: 'Admin/cashier credentials not configured' }, { status: 500 });
    }

    let role: 'admin' | 'cashier' | null = null;
    if (email === adminEmail && password === adminPassword) {
      role = 'admin';
    } else if (email === cashierEmail && password === cashierPassword) {
      role = 'cashier';
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createAdminToken(email, role, COOKIE_MAX_AGE);
    const res = NextResponse.json({ ok: true, role });
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}


