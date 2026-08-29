import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import { initializeTransaction } from '../../../lib/paystack';

const BRANDING_FEE_TEXT_ONLY = 2500;
const BRANDING_FEE_TEXT_AND_IMAGE = 4500;

function generateTrackingCode() {
  const random = crypto.randomUUID().split('-')[0].toUpperCase();
  return `VP-${random}`;
}

function calculateBrandingFee(item) {
  if (!item.brandingRequested) return 0;
  // Image branding costs more than text-only branding.
  if (item.brandingImageUrl) return BRANDING_FEE_TEXT_AND_IMAGE;
  return BRANDING_FEE_TEXT_ONLY;
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

    // SECURITY: never trust prices sent from the browser — they can be edited
    // before the request is sent. Look up the real price for every item
    // directly from the database and use that instead.
    const productIds = items.map((i) => i.productId).filter(Boolean);
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name, price_min, active')
      .in('id', productIds);

    if (productsError) throw productsError;

    const priceById = new Map((products || []).map((p) => [p.id, p]));

    const verifiedItems = [];
    for (const i of items) {
      const product = priceById.get(i.productId);
      if (!product || !product.active) {
        return NextResponse.json({ error: `${i.name || 'An item'} is no longer available` }, { status: 400 });
      }
      const quantity = Math.max(1, Number(i.quantity) || 1);
      // SECURITY: the branding fee is calculated here from the branding request
      // itself (was branding requested? was an image uploaded?) — never trust
      // a fee amount sent from the browser.
      const brandingFee = calculateBrandingFee(i);
      verifiedItems.push({
        ...i,
        quantity,
        unitPrice: product.price_min, // real price, ignoring whatever the browser sent
        brandingFee,
        name: product.name,
      });
    }

    const subtotal = verifiedItems.reduce(
      (sum, i) => sum + (i.unitPrice + i.brandingFee) * i.quantity,
      0
    );
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
    const itemRows = verifiedItems.map((i) => ({
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
      branding_fee: i.brandingFee,
      line_total: (i.unitPrice + i.brandingFee) * i.quantity,
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
