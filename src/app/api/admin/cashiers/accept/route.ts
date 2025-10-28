import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, verifyCashierInviteToken } from '@/lib/admin-auth';

const ADMIN_COOKIE_NAME = 'bgc_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    const invite = verifyCashierInviteToken(token);
    if (!invite) {
      return NextResponse.redirect(new URL('/admin/login?error=invalid_invite', req.nextUrl));
    }

    const adminJwt = createAdminToken(invite.email, 'cashier', COOKIE_MAX_AGE);
    const res = NextResponse.redirect(new URL('/admin/cashier', req.nextUrl));
    res.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: adminJwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });
    return res;
  } catch (e) {
    return NextResponse.redirect(new URL('/admin/login?error=invite_error', req.nextUrl));
  }
}


