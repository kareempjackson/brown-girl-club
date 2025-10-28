import crypto from 'crypto';

interface AdminTokenPayload {
  email: string;
  role: 'admin' | 'cashier';
  exp: number; // epoch seconds
}

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error('ADMIN_SECRET is not set');
  return secret;
}

function base64UrlEncode(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(input: string): Buffer {
  const pad = input.length % 4;
  const normalized = input
    .replace(/-/g, '+')
    .replace(/_/g, '/') + (pad ? '='.repeat(4 - pad) : '');
  return Buffer.from(normalized, 'base64');
}

export function createAdminToken(
  email: string,
  role: 'admin' | 'cashier' = 'admin',
  ttlSeconds = 60 * 60 * 24 * 7
): string {
  const payload: AdminTokenPayload = {
    email,
    role,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const toSign = `${headerB64}.${payloadB64}`;
  const hmac = crypto.createHmac('sha256', getAdminSecret()).update(toSign).digest();
  const signatureB64 = base64UrlEncode(hmac);
  return `${toSign}.${signatureB64}`;
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const toSign = `${headerB64}.${payloadB64}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac('sha256', getAdminSecret()).update(toSign).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) return null;

  try {
    const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
    const payload = JSON.parse(payloadJson) as AdminTokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// Invite tokens (for cashier invites)
interface CashierInvitePayload {
  email: string;
  role: 'cashier';
  type: 'invite';
  exp: number;
}

export function createCashierInviteToken(email: string, ttlSeconds = 60 * 60): string {
  const payload: CashierInvitePayload = {
    email,
    role: 'cashier',
    type: 'invite',
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const toSign = `${headerB64}.${payloadB64}`;
  const hmac = crypto.createHmac('sha256', getAdminSecret()).update(toSign).digest();
  const signatureB64 = base64UrlEncode(hmac);
  return `${toSign}.${signatureB64}`;
}

export function verifyCashierInviteToken(token: string): CashierInvitePayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const toSign = `${headerB64}.${payloadB64}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac('sha256', getAdminSecret()).update(toSign).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) return null;

  try {
    const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
    const payload = JSON.parse(payloadJson) as CashierInvitePayload;
    if (payload.type !== 'invite' || payload.role !== 'cashier') return null;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}


