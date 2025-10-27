import { supabase } from '@/lib/supabase';

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, users:users(*), subscriptions:subscriptions(*)')
    .eq('id', params.id)
    .single();

  if (!invoice) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6">
        <h1 className="text-serif text-3xl text-[var(--color-accent)] mb-2">Invoice not found</h1>
        <p className="text-[var(--color-ink)]/70">Please check the link.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-porcelain)] min-h-screen py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[var(--color-ink)]/10 p-8">
        <h1 className="text-serif text-3xl text-[var(--color-accent)] mb-1">Receipt</h1>
        <p className="text-sm text-[var(--color-ink)]/60 mb-6">Invoice ID: {invoice.id}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-accent)]/70 font-bold mb-1">Billed To</p>
            <p className="text-sm text-[var(--color-ink)]">{invoice.users?.name}</p>
            <p className="text-sm text-[var(--color-ink)]/70">{invoice.users?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--color-accent)]/70 font-bold mb-1">Details</p>
            <p className="text-sm text-[var(--color-ink)]">{invoice.subscriptions?.plan_name}</p>
            <p className="text-sm text-[var(--color-ink)]/70">Paid at: {invoice.paid_at ? new Date(invoice.paid_at).toLocaleString() : '-'}</p>
          </div>
        </div>

        <div className="border-t border-[var(--color-ink)]/10 pt-6">
          <div className="flex justify-between text-base">
            <span className="text-[var(--color-ink)]/70">Amount</span>
            <span className="text-[var(--color-accent)] font-medium">{invoice.currency} {Number(invoice.amount).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-[var(--color-ink)]/70">Status</span>
            <span className="text-[var(--color-ink)]">{invoice.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


