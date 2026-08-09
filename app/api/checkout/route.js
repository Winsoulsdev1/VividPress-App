import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { initializeTransaction } from '../../../lib/paystack';

function generateTrackingCode() {
  const random = crypto.randomUUID().split('-')[0].toUpperCase();
  return `VP-${random}`;
}

export async function POST(req) {
  try {
    const { customer, items } = await req.json();

    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return NextResponse.json({ error: 'Missing customer details' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const trackingCode = generateTrackingCode();

    // 1. Create the order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        tracking_code: trackingCode,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        delivery_address: customer.address,
        status: 'pending_payment',
        subtotal,
        total: subtotal, // add delivery fee logic here later if needed
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const itemRows = items.map((i) => ({
      order_id: order.id,
      product_name: i.name,
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      branding_requested: i.brandingRequested,
      branding_details: i.brandingDetails,
      branding_font: i.brandingFont,
      branding_color: i.brandingColor,
      branding_image_url: i.brandingImageUrl,
      unit_price: i.unitPrice,
      line_total: i.unitPrice * i.quantity,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(itemRows);
    if (itemsError) throw itemsError;

    await supabaseAdmin.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending_payment',
      note: 'Order created, awaiting payment',
    });

    // 3. Start payment with Paystack
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const payment = await initializeTransaction({
      email: customer.email,
      amountNaira: subtotal,
      reference: trackingCode,
      callbackUrl: `${siteUrl}/checkout/success?ref=${trackingCode}`,
      metadata: { order_id: order.id, tracking_code: trackingCode },
    });

    return NextResponse.json({ authorizationUrl: payment.authorization_url, trackingCode });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Checkout failed' }, { status: 500 });
  }
}
