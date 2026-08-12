import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';
import { isAdmin } from '../../../../../../lib/adminAuth';
import {
  sendEmail,
  orderInProductionEmail,
  orderReadyEmail,
  orderDeliveredEmail,
} from '../../../../../../lib/email';

const EMAIL_BY_STATUS = {
  in_production: orderInProductionEmail,
  ready: orderReadyEmail,
  delivered: orderDeliveredEmail,
};

export async function POST(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { status } = await req.json();
  const orderId = params.id;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin.from('order_status_history').insert({
    order_id: orderId,
    status,
    note: 'Updated by admin',
  });

  // Email the customer for any status that has a matching template.
  const buildEmail = EMAIL_BY_STATUS[status];
  if (buildEmail) {
    const { subject, html } = buildEmail({ name: order.customer_name, trackingCode: order.tracking_code });
    await sendEmail({ to: order.customer_email, subject, html });
  }

  return NextResponse.json({ ok: true });
}
