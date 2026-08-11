import { redirect } from 'next/navigation';
import { isAdmin } from '../../../lib/adminAuth';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';
import ApproveButton from '../../../components/ApproveButton';
import AdminNav from '../../../components/AdminNav';

export const revalidate = 0;

export default async function AdminReviewsPage() {
  if (!isAdmin()) redirect('/admin');

  const { data: reviews } = await supabaseAdmin
    .from('reviews')
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });

  return (
    <>
      <AdminNav backHref="/admin/orders" backLabel="Back to orders" />
      <div className="wrap section" style={{ paddingTop: 0 }}>
        <h1>Pending reviews</h1>
        {(reviews || []).map((r) => (
          <div key={r.id} className="card" style={{ marginBottom: 12, padding: 18 }}>
            <div style={{ color: '#FECD01' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            <p>&quot;{r.text}&quot;</p>
            <p style={{ fontSize: 13, opacity: 0.7 }}>{r.customer_name} — {r.item}</p>
            <ApproveButton reviewId={r.id} />
          </div>
        ))}
        {(!reviews || reviews.length === 0) && <p>Nothing pending.</p>}
      </div>
    </>
  );
}
