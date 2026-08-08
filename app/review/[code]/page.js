import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import Header from '../../../components/Header';
import ReviewForm from '../../../components/ReviewForm';

export default async function ReviewPage({ params }) {
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
        <div className="wrap section"><h1>Order not found</h1></div>
      </>
    );
  }

  if (order.status !== 'delivered') {
    return (
      <>
        <Header />
        <div className="wrap section">
          <h1>Not quite yet</h1>
          <p>Reviews open up once your order is marked delivered.</p>
        </div>
      </>
    );
  }

  const itemSummary = order.order_items.map((i) => i.product_name).join(', ');

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>How did we do?</h1>
        <p style={{ opacity: 0.7 }}>Order {order.tracking_code} — {itemSummary}</p>
        <ReviewForm trackingCode={order.tracking_code} customerName={order.customer_name} itemSummary={itemSummary} />
      </div>
    </>
  );
}
