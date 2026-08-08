import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import Header from '../../../components/Header';

const STAGES = [
  { key: 'paid', label: 'Payment confirmed' },
  { key: 'in_production', label: 'In production' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
];

export default async function TrackPage({ params }) {
  const { code } = params;

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('tracking_code', code)
    .single();

  if (!order) {
    return (
      <>
        <Header />
        <div className="wrap section">
          <h1>Order not found</h1>
          <p>Double-check the tracking code and try again.</p>
        </div>
      </>
    );
  }

  const currentIndex = STAGES.findIndex((s) => s.key === order.status);

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>Order {order.tracking_code}</h1>
        <p style={{ opacity: 0.7 }}>Placed by {order.customer_name}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '20px 0' }}>
          {STAGES.map((stage, i) => (
            <span
              key={stage.key}
              className="status-badge"
              style={{
                background: i <= currentIndex ? '#FECD01' : undefined,
                borderColor: i <= currentIndex ? '#FECD01' : undefined,
              }}
            >
              {stage.label}
            </span>
          ))}
        </div>

        {order.status === 'pending_payment' && <p>Waiting for payment confirmation.</p>}
        {order.status === 'cancelled' && <p>This order was cancelled.</p>}

        <h3>Items</h3>
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

        <h3 style={{ marginTop: 20 }}>Total: ₦{order.total.toLocaleString()}</h3>

        {order.status === 'delivered' && (
          <p style={{ marginTop: 20 }}>
            Delivered! Got a minute? <a href={`/review/${order.tracking_code}`}>Leave a review</a>.
          </p>
        )}
      </div>
    </>
  );
}
