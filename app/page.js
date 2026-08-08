import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';

export const revalidate = 0; // always fetch fresh product/review data

export default async function HomePage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>Order it. Brand it. Wear it.</h1>
        <p style={{ opacity: 0.75, maxWidth: '52ch' }}>
          Quality polos, tees, caps and trousers — with branding added right at checkout.
        </p>
      </div>

      <div className="wrap section">
        <h2>Shop</h2>
        <div className="grid">
          {(products || []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {(!products || products.length === 0) && <p>No products yet — add some in Supabase.</p>}
        </div>
      </div>

      <div className="wrap section">
        <h2>Reviews</h2>
        <div className="grid">
          {(reviews || []).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
          {(!reviews || reviews.length === 0) && <p style={{ opacity: 0.6 }}>No reviews yet.</p>}
        </div>
      </div>
    </>
  );
}
