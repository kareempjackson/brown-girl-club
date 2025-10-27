import { ServerClient } from 'postmark';

const postmarkToken = process.env.POSTMARK_API as string | undefined;
const fromEmail = (process.env.MAIL_FROM as string) || 'Brown Girl Club <no-reply@browngirlclub.com>';

export async function sendMail(options: { to: string; subject: string; html: string; text?: string; }) {
  if (!postmarkToken) {
    console.warn('POSTMARK_API not set; skipping email send');
    return { skipped: true } as const;
  }

  const client = new ServerClient(postmarkToken);
  const res = await client.sendEmail({
    From: fromEmail,
    To: options.to,
    Subject: options.subject,
    HtmlBody: options.html,
    TextBody: options.text,
    MessageStream: 'outbound',
  });

  return { messageId: res.MessageID } as const;
}

// Brand email layout
export function renderEmailLayout(params: {
  title?: string;
  preheader?: string;
  contentHtml: string;
  baseUrl?: string;
}) {
  const title = params.title || 'Brown Girl Club';
  const preheader = params.preheader || '';
  const baseUrl = params.baseUrl || '';
  // Brand colors (inline for email clients)
  const espresso = '#4B2E22';
  const porcelain = '#F2E4D2';
  const ink = '#292929';
  const white = '#FFFFFF';

  // Try to load brand fonts in supported email clients; gracefully fall back otherwise
  const fontFaceCss = baseUrl
    ? `
        @font-face {
          font-family: 'Mailendra';
          src: url('${baseUrl}/fonts/mailendra-regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `
    : '';

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
      <style>
        ${fontFaceCss}
        /* fallback fonts for email */
        body, table, td, a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        h1, h2, h3 { font-family: 'Mailendra', Georgia, serif; letter-spacing: 0.2px; }
        img { border: 0; outline: none; text-decoration: none; display: block; }
        .btn { background: ${espresso}; color: ${white}; padding: 12px 18px; border-radius: 10px; text-decoration: none; display: inline-block; font-weight: 700; }
        .brand-title { font-family: 'Mailendra', Georgia, serif; font-weight: 700; letter-spacing: 0.2px; color: ${espresso}; }
        .muted { color: rgba(41,41,41,0.7); }
        .card { background: ${white}; border:1px solid rgba(41,41,41,0.12); border-radius:16px; padding:24px; }
        .kv { margin: 0; padding: 0; list-style: none; }
        .kv li { margin: 0 0 6px 0; }
        .divider { height:1px; background: rgba(41,41,41,0.12); border:0; margin: 16px 0; }
      </style>
    </head>
    <body style="margin:0; padding:0; background:${porcelain}; color:${ink};">
      <span style="display:none; color:transparent; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden">${preheader}</span>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${porcelain}; padding: 24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
              <tr>
                <td style="padding: 12px 8px;" align="left">
                  <span class="brand-title" style="font-size:22px; line-height:1;">Brown Girl Club</span>
                </td>
              </tr>
              <tr>
                <td class="card">
                  ${params.contentHtml}
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 8px; color: rgba(41,41,41,0.6); font-size: 12px;" align="center">
                  © ${new Date().getFullYear()} Brown Girl Club. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
  return html;
}

export function renderMagicLinkEmail(params: { verifyUrl: string; baseUrl?: string }) {
  const espresso = '#4B2E22';
  const content = `
    <h2 style="margin:0 0 8px 0; color:${espresso}; font-size:24px;">Your Magic Sign‑in Link</h2>
    <p style="margin:0 0 16px 0; line-height:1.6;">Tap the button below to securely sign in to your Brown Girl Club account.</p>
    <p style="margin: 12px 0 24px 0;">
      <a class="btn" href="${params.verifyUrl}">Sign in</a>
    </p>
    <p style="margin:0; font-size:12px; color: rgba(41,41,41,0.7);">This link expires in 15 minutes. If you didn't request this, please ignore this email.</p>
  `;
  const html = renderEmailLayout({ title: 'Sign in to Brown Girl Club', preheader: 'Your secure sign‑in link', contentHtml: content, baseUrl: params.baseUrl });
  return { subject: 'Sign in to Brown Girl Club', html } as const;
}

export function renderInvoiceEmail(params: {
  name: string;
  planName: string;
  amount: number;
  currency?: string;
  invoiceId: string;
}) {
  const currency = params.currency || 'XCD';
  const amount = params.amount.toFixed(2);
  const content = `
    <h2 style="margin:0 0 10px 0; color:#4B2E22; font-size:24px;">Receipt</h2>
    <p style="margin:0 0 10px 0;">Hi ${params.name},</p>
    <p style="margin:0 12px 16px 0;">Thanks for your payment. Your <strong>${params.planName}</strong> membership is now active.</p>
    <div style="margin:0 0 12px 0; padding:12px 16px; background:#F7F1E9; border:1px solid rgba(41,41,41,0.08); border-radius:12px;">
      <ul class="kv">
        <li><strong>Amount:</strong> ${currency} ${amount}</li>
        <li><strong>Invoice ID:</strong> ${params.invoiceId}</li>
      </ul>
    </div>
    <p class="muted" style="margin-top:16px; font-size:12px;">Keep this email for your records.</p>
  `;
  const html = renderEmailLayout({ title: 'Your Brown Girl Club Receipt', preheader: `Receipt for ${params.planName}`, contentHtml: content });
  return { subject: 'Your Brown Girl Club Receipt', html };
}

export function renderCashPaymentReminderEmail(params: {
  name: string;
  planName: string;
  baseUrl?: string;
}) {
  const espresso = '#4B2E22';
  const content = `
    <h2 style="margin:0 0 8px 0; color:${espresso}; font-size:24px;">Complete Your Membership Payment</h2>
    <p style="margin:0 0 8px 0;">Hi ${params.name},</p>
    <p style="margin:0 0 12px 0;">Thanks for joining Brown Girl Club! To activate your <strong>${params.planName}</strong> membership, please complete your cash payment at one of our locations:</p>
    <ul style="margin:0 0 12px 20px;">
      <li><strong>Brown Girl Cafe</strong>, Lance Aux Epines</li>
      <li><strong>Chebauffle House</strong>, True Blue</li>
    </ul>
    <p style="margin:0 0 12px 0;">Tell the cashier your email address so we can mark your subscription as paid right away.</p>
    <p style="margin:0 0 0 0; font-size:12px; color: rgba(41,41,41,0.7);">If you have any questions, just reply to this email.</p>
  `;
  const html = renderEmailLayout({ title: 'Complete Your Payment', preheader: 'Finish your cash payment in store', contentHtml: content, baseUrl: params.baseUrl });
  return { subject: 'Reminder: Complete Your Brown Girl Club Payment', html } as const;
}


export function renderRedemptionReceiptEmail(params: {
  name: string;
  planName: string;
  itemType: 'coffee' | 'food' | 'dessert';
  itemName: string;
  redeemedAt: string; // ISO string
  location?: string;
  remainingCoffees?: number;
  remainingFood?: number;
}) {
  const espresso = '#4B2E22';
  const dateStr = new Date(params.redeemedAt).toLocaleString();
  const remainingParts: string[] = [];
  if (typeof params.remainingCoffees === 'number') {
    remainingParts.push(`<strong>Coffees remaining:</strong> ${params.remainingCoffees}`);
  }
  if (typeof params.remainingFood === 'number') {
    remainingParts.push(`<strong>Food remaining:</strong> ${params.remainingFood}`);
  }
  const remainingHtml = remainingParts.length
    ? `<p style="margin:8px 0 0 0;">${remainingParts.join(' &nbsp; • &nbsp; ')}</p>`
    : '';

  const content = `
    <h2 style="margin:0 0 10px 0; color:${espresso}; font-size:24px;">Redemption receipt</h2>
    <p style="margin:0 0 8px 0;">Hi ${params.name},</p>
    <p style="margin:0 0 12px 0;">We recorded your ${params.itemType} redemption:</p>
    <div style="margin:0 0 12px 0; padding:12px 16px; background:#F7F1E9; border:1px solid rgba(41,41,41,0.08); border-radius:12px;">
      <ul class="kv">
        <li><strong>Item:</strong> ${params.itemName} (${params.itemType})</li>
        <li><strong>When:</strong> ${dateStr}</li>
        ${params.location ? `<li><strong>Location:</strong> ${params.location}</li>` : ''}
      </ul>
    </div>
    ${remainingHtml}
    <p class="muted" style="margin:16px 0 0 0; font-size:12px;">Keep this email for your records. If anything looks off, just reply to this email.</p>
  `;

  const html = renderEmailLayout({
    title: 'Your Brown Girl Club redemption',
    preheader: 'Thanks for visiting the cafe',
    contentHtml: content,
  });
  return { subject: 'Your Brown Girl Club redemption receipt', html } as const;
}

