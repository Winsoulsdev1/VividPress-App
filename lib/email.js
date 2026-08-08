// Sends transactional emails via Resend (resend.com). Free tier covers a
// small business's order volume easily. Swap this file out later if you
// prefer another provider — nothing else in the app needs to change.
export async function sendEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('Email failed to send:', errText);
    // Don't throw — a failed email shouldn't break an order update.
  }
}

const SITE = process.env.NEXT_PUBLIC_SITE_URL;

export function orderPaidEmail({ name, trackingCode }) {
  return {
    subject: `We've got your order — ${trackingCode}`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for your order! Payment received — we're getting it ready.</p>
      <p>Track your order anytime here: <a href="${SITE}/track/${trackingCode}">${SITE}/track/${trackingCode}</a></p>
      <p>— VividPress</p>
    `,
  };
}

export function orderInProductionEmail({ name, trackingCode }) {
  return {
    subject: `Your order is in production — ${trackingCode}`,
    html: `
      <p>Hi ${name},</p>
      <p>Good news — your order is now in production. We'll let you know as soon as it's ready.</p>
      <p>Track it here: <a href="${SITE}/track/${trackingCode}">${SITE}/track/${trackingCode}</a></p>
      <p>— VividPress</p>
    `,
  };
}

export function orderReadyEmail({ name, trackingCode }) {
  return {
    subject: `Your order is ready — ${trackingCode}`,
    html: `
      <p>Hi ${name},</p>
      <p>Your order is ready! We'll be in touch shortly to arrange delivery.</p>
      <p>Track it here: <a href="${SITE}/track/${trackingCode}">${SITE}/track/${trackingCode}</a></p>
      <p>— VividPress</p>
    `,
  };
}

export function orderDeliveredEmail({ name, trackingCode }) {
  return {
    subject: `Delivered! How did we do? — ${trackingCode}`,
    html: `
      <p>Hi ${name},</p>
      <p>Your order has been delivered — we hope you love it.</p>
      <p>We'd really appreciate a quick review, it helps other customers a lot:</p>
      <p><a href="${SITE}/review/${trackingCode}">${SITE}/review/${trackingCode}</a></p>
      <p>Thanks for choosing VividPress.</p>
    `,
  };
}
