import { cookies } from 'next/headers';

export function isAdmin() {
  const cookie = cookies().get('vp_admin');
  return cookie?.value === process.env.ADMIN_PASSWORD;
}
