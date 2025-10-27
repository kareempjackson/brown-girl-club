import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyUserToken } from '@/lib/user-auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_user')?.value || '';
  const payload = verifyUserToken(token);
  if (!payload) {
    redirect('/login');
  }
  return <>{children}</>;
}


