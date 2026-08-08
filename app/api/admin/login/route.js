import { NextResponse } from 'next/server';

export async function POST(req) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  // Simple session cookie. Good enough for a one-person admin panel;
  // upgrade to real auth (e.g. Supabase Auth) if more people need access later.
  res.cookies.set('vp_admin', process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return res;
}
