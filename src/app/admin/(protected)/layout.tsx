import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/admin-auth';

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_admin')?.value || '';
  const payload = verifyAdminToken(token);
  if (!payload) {
    redirect('/admin/login');
  }
  // If a cashier hits the root admin page, redirect them to the cashier view
  // Note: this layout is shared; the individual pages may still guard finer permissions.
  return <>{children}</>;
}


