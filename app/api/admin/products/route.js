import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { isAdmin } from '../../../../lib/adminAuth';

export async function POST(req) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, type, description, priceMin, priceMax, sizes, colors, imageUrl } = await req.json();

    if (!name || !type || !priceMin) {
      return NextResponse.json({ error: 'Name, type, and price are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name,
        type,
        description: description || null,
        price_min: priceMin,
        price_max: priceMax || priceMin,
        sizes: sizes || null,
        colors: colors || [],
        image_url: imageUrl || null,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, product: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Could not create product' }, { status: 500 });
  }
        }
