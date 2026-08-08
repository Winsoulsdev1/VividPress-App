import { redirect } from 'next/navigation';
import { isAdmin } from '../../../../lib/adminAuth';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import StatusUpdateForm from '../../../../components/StatusUpdateForm';

export const revalidate = 0;

export default async function AdminOrderDetailPage({ params }) {
  if (!isAdmin()) redirect('/admin');

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*), order_status_history(*)')
    .eq('id', params.id)
    .single();

  if (!order) {
    return <div className="wrap section"><h1>Order not found</h1></div>;
  }

  const history = [...(order.order_status_history || [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <div className="wrap section">
      <h1>Order {order.tracking_code}</h1>
      <p>{order.customer_name} · {order.customer_email} · {order.customer_phone}</p>
      <p style={{ opacity: 0.7 }}>{order.delivery_address}</p>

      <h3 style={{ marginTop: 20 }}>Items</h3>
      <table>
        <thead>
          <tr><th>Item</th><th>Size</th><th>Colour</th><th>Qty</th><th>Branding</th></tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.size}</td>
              <td>{item.color}</td>
              <td>{item.quantity}</td>
              <td>{item.branding_requested ? item.branding_details || 'Yes' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 20 }}>Update status</h3>
      <StatusUpdateForm orderId={order.id} currentStatus={order.status} />

      <h3 style={{ marginTop: 20 }}>History</h3>
      <ul>
        {history.map((h) => (
          <li key={h.id}>
            {new Date(h.created_at).toLocaleString()} — {h.status} {h.note ? `(${h.note})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}
