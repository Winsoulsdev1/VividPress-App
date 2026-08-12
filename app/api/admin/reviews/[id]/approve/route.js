import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';
import { isAdmin } from '../../../../../../lib/adminAuth';

export async function POST(req, { params }) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .update({ approved: true })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
