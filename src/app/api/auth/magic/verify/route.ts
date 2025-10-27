export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { verifyMagicToken, createUserToken } from '@/lib/user-auth';
import { getOrCreateUser } from '@/lib/supabase';

const USER_COOKIE_NAME = 'bgc_user';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token') || '';
    const redirect = req.nextUrl.searchParams.get('redirect') || '/dashboard';

    const payload = verifyMagicToken(token);
    if (!payload) return NextResponse.redirect(new URL(`/login?error=invalid_or_expired`, req.url));

    // Ensure user exists
    const user = await getOrCreateUser({ email: payload.email, name: 'Member' });
    const sessionToken = createUserToken(user.id, user.email, COOKIE_MAX_AGE);

    const res = NextResponse.redirect(new URL(redirect, req.url), 302);
    const reqHost = new URL(req.url).hostname;
    const envDomain = (process.env.COOKIE_DOMAIN || '').trim();
    const cookieDomain = envDomain && (reqHost === envDomain || reqHost.endsWith(envDomain)) ? envDomain : undefined;
    res.cookies.set({
      name: USER_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      domain: cookieDomain,
    });
    return res;
  } catch (e) {
    return NextResponse.redirect(new URL(`/login?error=server`, req.url));
  }
}


