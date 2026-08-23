import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { verifyTransaction } from '../../../../lib/paystack';
import { sendEmail, orderPaidEmail } from '../../../../lib/email';

// Paystack calls this URL automatically when a payment event happens.
// Set it in Paystack dashboard > Settings > API Keys & Webhooks:
//   https://your-site.vercel.app/api/paystack/webhook

const OWNER_EMAIL = 'VividPress.ng@gmail.com';

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // Verify the request really came from Paystack, not someone faking a "payment success" call.
  const expectedSignature = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    const reference = event.data.reference;

    // Double-check directly with Paystack rather than trusting the webhook body alone.
    const verified = await verifyTransaction(reference);
    if (verified.status !== 'success') {
      return NextResponse.json({ received: true });
    }

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('tracking_code', reference)
      .single();

    if (order && order.status === 'pending_payment') {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', paystack_reference: reference, updated_at: new Date().toISOString() })
        .eq('id', order.id);

      await supabaseAdmin.from('order_status_history').insert({
        order_id: order.id,
        status: 'paid',
        note: 'Payment confirmed via Paystack',
      });

      const { subject, html } = orderPaidEmail({ name: order.customer_name, trackingCode: order.tracking_code });
      await sendEmail({ to: order.customer_email, subject, html });

      // Notify the business owner that a new paid order has come in.
      await sendEmail({
        to: OWNER_EMAIL,
        subject: `New order paid — ${order.tracking_code}`,
        html: `
          <p>You've got a new paid order.</p>
          <p><strong>Tracking code:</strong> ${order.tracking_code}</p>
          <p><strong>Customer:</strong> ${order.customer_name}</p>
          <p><strong>Phone:</strong> ${order.customer_phone}</p>
          <p><strong>Email:</strong> ${order.customer_email}</p>
          <p><strong>Delivery address:</strong> ${order.delivery_address}</p>
          <p><strong>Total:</strong> ₦${order.total}</p>
          <p>View it in your admin panel to see full branding details.</p>
        `,
      });
    }
  }

  return NextResponse.json({ received: true });
}
