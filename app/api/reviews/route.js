import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

const MAX_SUBMISSIONS_PER_HOUR = 3;

export async function POST(req) {
  try {
    const { trackingCode, customerName, item, rating, text } = await req.json();

    if (!customerName || !rating || !text) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count } = await supabaseAdmin
      .from('review_submission_log')
      .select('*', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('submitted_at', oneHourAgo);

    if (count >= MAX_SUBMISSIONS_PER_HOUR) {
      return NextResponse.json(
        { error: 'Too many reviews submitted. Please try again later.' },
        { status: 429 }
      );
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

    await supabaseAdmin.from('review_submission_log').insert({ ip });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not save review' }, { status: 500 });
  }
}
