import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '../../../../../../lib/supabaseAdmin';

export async function POST(req, { params }) {
  const cookie = cookies().get('vp_admin');
  if (cookie?.value !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from('reviews')
    .update({ approved: true })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
