import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { trackingCode, customerName, item, rating, text } = await req.json();

    if (!customerName || !rating || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    let orderId = null;
    if (trackingCode) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('tracking_code', trackingCode)
        .single();
      orderId = order?.id || null;
    }

    const { error } = await supabaseAdmin.from('reviews').insert({
      order_id: orderId,
      customer_name: customerName,
      item,
      rating,
      text,
      approved: false,
    });

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not save review' }, { status: 500 });
  }
}
