import { NextResponse } from 'next/server';
import { adminSessionToken } from '../../../../lib/adminAuth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function POST(req) {
  const { password } = await req.json();

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const { data: record } = await supabaseAdmin
    .from('admin_login_attempts')
    .select('*')
    .eq('ip', ip)
    .maybeSingle();

  const now = new Date();

  if (record?.locked_until && new Date(record.locked_until) > now) {
    const minutesLeft = Math.ceil(
      (new Date(record.locked_until) - now) / 60000
    );
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${minutesLeft} minute(s).` },
      { status: 429 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    const attempts = (record?.attempts || 0) + 1;
    const lockedUntil =
      attempts >= MAX_ATTEMPTS
        ? new Date(now.getTime() + LOCKOUT_MINUTES * 60000).toISOString()
        : null;

    await supabaseAdmin.from('admin_login_attempts').upsert({
      ip,
      attempts: lockedUntil ? 0 : attempts,
      locked_until: lockedUntil,
    });

    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  await supabaseAdmin
    .from('admin_login_attempts')
    .delete()
    .eq('ip', ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set('vp_admin', adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}
