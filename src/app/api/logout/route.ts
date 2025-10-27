export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';

const USER_COOKIE_NAME = 'bgc_user';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const reqHost = _req.headers.get('host')?.split(':')[0] || '';
  const envDomain = (process.env.COOKIE_DOMAIN || '').trim();
  const cookieDomain = envDomain && (reqHost === envDomain || reqHost.endsWith(envDomain)) ? envDomain : undefined;
  res.cookies.set({
    name: USER_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    domain: cookieDomain,
  });
  return res;
}


