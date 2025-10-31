export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionById, updateSubscriptionById, supabase } from '@/lib/supabase';
import { sendMail, renderInvoiceEmail } from '@/lib/email';

/**
 * POST /api/membership/status
 * Body: { subscriptionId: string, status: 'paid' | 'pending_payment' | 'active' | 'paused' | 'cancelled' }
 *
 * When status changes to 'paid', we mark subscription active, create wallet pass, and return URLs.
 */
export async function POST(request: NextRequest) {
  try {
    const { subscriptionId, status } = await request.json();
    if (!subscriptionId || !status) {
      return NextResponse.json({ error: 'Missing subscriptionId or status' }, { status: 400 });
    }

    const subscription = await getSubscriptionById(subscriptionId);
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    // If moving from pending_payment to paid, activate subscription (no wallet pass)
    if (subscription.status === 'pending_payment' && status === 'paid') {
      const newEnd = new Date(new Date(subscription.current_period_start).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const updated = await updateSubscriptionById(subscription.id, {
        status: 'active',
        currentPeriodEnd: newEnd,
      });

      // Create invoice (cash payment)
      const planPrices: Record<string, number> = {
        // normalized ids
        'chill-mode': 200,
        'daily-coffee': 450,
        'double-shot': 800,
        'caffeine-royalty': 1400,
        // legacy aliases
        '3-coffees': 200,
        'creator': 800,
        'unlimited': 1400,
      };
      const amount = planPrices[subscription.plan_id] ?? 0;
      let invoice: any = null;
      let invoiceError: any = null;
      try {
        const res = await (supabase as any)
          .from('invoices')
          .insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            amount,
            currency: 'XCD',
            status: 'paid',
            paid_at: new Date().toISOString(),
            issued_by: 'cashier',
          })
          .select()
          .single();
        invoice = res.data;
        invoiceError = res.error;
      } catch (e: any) {
        invoiceError = e;
      }

      if (invoiceError && String(invoiceError?.message || '').includes("issued_by")) {
        // Retry without issued_by column (older schema)
        try {
          const res2 = await (supabase as any)
            .from('invoices')
            .insert({
              user_id: subscription.user_id,
              subscription_id: subscription.id,
              amount,
              currency: 'XCD',
              status: 'paid',
              paid_at: new Date().toISOString(),
            })
            .select()
            .single();
          invoice = res2.data;
          invoiceError = res2.error;
        } catch (e2) {
          invoiceError = e2;
        }
      }

      if (invoiceError && String(invoiceError?.message || '').includes("subscription_id")) {
        // Retry without subscription_id if column missing in schema
        try {
          const res3 = await (supabase as any)
            .from('invoices')
            .insert({
              user_id: subscription.user_id,
              amount,
              currency: 'XCD',
              status: 'paid',
              paid_at: new Date().toISOString(),
            })
            .select()
            .single();
          invoice = res3.data;
          invoiceError = res3.error;
        } catch (e3) {
          invoiceError = e3;
        }
      }

      if (invoiceError) {
        console.error('Invoice creation failed:', invoiceError);
      } else if (invoice) {
        // Email receipt
        const emailData = renderInvoiceEmail({
          name: (subscription as any).users?.name || 'Member',
          planName: subscription.plan_name,
          amount,
          currency: 'XCD',
          invoiceId: invoice.id,
        });
        await sendMail({
          to: (subscription as any).users?.email || '',
          subject: emailData.subject,
          html: emailData.html,
        }).catch((e) => console.warn('Email send skipped/failed:', e));
      }

      return NextResponse.json({
        success: true,
        subscription: {
          id: updated.id,
          status: updated.status,
          
        },
        invoiceId: invoice?.id,
      });
    }

    // For other statuses, just update
    const updated = await updateSubscriptionById(subscription.id, {
      status: status === 'paid' ? 'active' : status,
    });

    return NextResponse.json({ success: true, subscription: { id: updated.id, status: updated.status } });
  } catch (error: any) {
    console.error('Membership status API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}


