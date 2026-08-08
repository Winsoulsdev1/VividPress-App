import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '../../../lib/adminAuth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  if (!isAdmin()) redirect('/admin');

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="wrap section">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Orders</h1>
        <Link href="/admin/reviews" className="btn ghost">Pending reviews</Link>
      </div>

      <table>
        <thead>
          <tr><th>Code</th><th>Customer</th><th>Status</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {(orders || []).map((o) => (
            <tr key={o.id}>
              <td>{o.tracking_code}</td>
              <td>{o.customer_name}</td>
              <td><span className="status-badge">{o.status}</span></td>
              <td>₦{o.total.toLocaleString()}</td>
              <td><Link href={`/admin/orders/${o.id}`}>Manage</Link></td>
            </tr>
          ))}
          {(!orders || orders.length === 0) && (
            <tr><td colSpan={5}>No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
