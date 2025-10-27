import DashboardPage from './DashboardPage';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/admin-auth';

export default async function AdminIndex() {
  const cookieStore = await cookies();
  const token = cookieStore.get('bgc_admin')?.value || '';
  const payload = verifyAdminToken(token);

  if (payload?.role === 'cashier') {
    redirect('/admin/cashier');
  }

  return <DashboardPage />;
}


