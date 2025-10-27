import crypto from 'crypto';

interface UserTokenPayload {
  userId: string;
  email?: string;
  exp: number; // epoch seconds
}

function getUserSecret(): string {
  const secret = process.env.USER_SECRET || process.env.ADMIN_SECRET;
  if (!secret) throw new Error('USER_SECRET is not set');
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

export function createUserToken(userId: string, email?: string, ttlSeconds = 60 * 60 * 24 * 30): string {
  const payload: UserTokenPayload = {
    userId,
    email,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const toSign = `${headerB64}.${payloadB64}`;
  const hmac = crypto.createHmac('sha256', getUserSecret()).update(toSign).digest();
  const signatureB64 = base64UrlEncode(hmac);
  return `${toSign}.${signatureB64}`;
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const toSign = `${headerB64}.${payloadB64}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac('sha256', getUserSecret()).update(toSign).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) return null;

  try {
    const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
    const payload = JSON.parse(payloadJson) as UserTokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}


// Magic link helpers
interface MagicTokenPayload {
  email: string;
  exp: number;
  nonce: string;
}

function getMagicSecret(): string {
  const secret = process.env.MAGIC_SECRET || process.env.USER_SECRET || process.env.ADMIN_SECRET;
  if (!secret) throw new Error('MAGIC_SECRET is not set');
  return secret;
}

export function createMagicToken(email: string, ttlSeconds = 60 * 15): string {
  const payload: MagicTokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
    nonce: crypto.randomBytes(8).toString('hex'),
  };
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const toSign = `${headerB64}.${payloadB64}`;
  const hmac = crypto.createHmac('sha256', getMagicSecret()).update(toSign).digest();
  const signatureB64 = base64UrlEncode(hmac);
  return `${toSign}.${signatureB64}`;
}

export function verifyMagicToken(token: string): MagicTokenPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;
  const toSign = `${headerB64}.${payloadB64}`;
  const expectedSig = base64UrlEncode(
    crypto.createHmac('sha256', getMagicSecret()).update(toSign).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(signatureB64), Buffer.from(expectedSig))) return null;

  try {
    const payloadJson = base64UrlDecode(payloadB64).toString('utf8');
    const payload = JSON.parse(payloadJson) as MagicTokenPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}


