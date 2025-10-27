export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { createMagicToken } from '@/lib/user-auth';
import { sendMail, renderMagicLinkEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, redirectTo } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

    const token = createMagicToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;
    const redirect = typeof redirectTo === 'string' && redirectTo.startsWith('/') ? redirectTo : '/dashboard';
    const verifyUrl = `${baseUrl}/api/auth/magic/verify?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirect)}`;

    const emailTpl = renderMagicLinkEmail({ verifyUrl, baseUrl });
    await sendMail({ to: email, subject: emailTpl.subject, html: emailTpl.html });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to send link' }, { status: 500 });
  }
}


