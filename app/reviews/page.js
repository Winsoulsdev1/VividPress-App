import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import ReviewCard from '../../components/ReviewCard';
import GeneralReviewForm from '../../components/GeneralReviewForm';

export const revalidate = 0;

export default async function ReviewsPage() {
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  return (
    <>
      <Header />
      <div className="wrap section">
        <span className="tag">What customers say</span>
        <h1>Reviews</h1>
        <p style={{ opacity: 0.75, maxWidth: '48ch', marginBottom: 32 }}>
          See what people are saying, or leave your own below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 40, alignItems: 'start' }}>
          <div className="grid">
            {(reviews || []).map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
            {(!reviews || reviews.length === 0) && <p style={{ opacity: 0.6 }}>No reviews yet — be the first.</p>}
          </div>

          <div className="card" style={{ padding: 22 }}>
            <h3 style={{ marginBottom: 14 }}>Leave a review</h3>
            <GeneralReviewForm />
          </div>
        </div>
      </div>
    </>
  );
}
