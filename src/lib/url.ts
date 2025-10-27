export function getBaseUrl(fallbackOrigin?: string): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL
    || process.env.SITE_URL
    || process.env.PUBLIC_BASE_URL
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  // Ensure no trailing slash for consistency
  const base = (envUrl || fallbackOrigin || 'http://localhost:3000').replace(/\/$/, '');
  return base;
}


