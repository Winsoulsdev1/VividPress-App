import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '../../../lib/adminAuth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import AdminNav from '../../../components/AdminNav';

export const revalidate = 0;

const STATUS_COLORS = {
  pending_payment: '#94a3b8',
  paid: '#00B9FC',
  in_production: '#FECD01',
  ready: '#FD6100',
  delivered: '#22c55e',
  cancelled: '#F52D20',
};

export default async function AdminOrdersPage() {
  if (!isAdmin()) redirect('/admin');

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <>
      <AdminNav />
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ marginBottom: 0 }}>Orders</h1>
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
                <td>
                  <span className="status-badge" style={{ borderColor: STATUS_COLORS[o.status], color: STATUS_COLORS[o.status] }}>
                    {o.status.replace('_', ' ')}
                  </span>
                </td>
                <td>₦{o.total.toLocaleString()}</td>
                <td><Link href={`/admin/orders/${o.id}`} style={{ fontWeight: 700 }}>Manage →</Link></td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={5}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
