import { cookies } from 'next/headers';
import crypto from 'crypto';

// SECURITY: the admin session cookie no longer holds the raw password.
// Instead it holds a signed token derived from it — if the cookie ever
// leaked, it wouldn't reveal the password, and changing ADMIN_PASSWORD
// automatically invalidates every existing session.
export function adminSessionToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_PASSWORD)
    .update('vividpress-admin-session')
    .digest('hex');
}

export function isAdmin() {
  const cookie = cookies().get('vp_admin');
  if (!cookie?.value) return false;

  const expected = adminSessionToken();
  const a = Buffer.from(cookie.value);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}
