import Image from 'next/image';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import ReviewCard from '../components/ReviewCard';

export const revalidate = 0;

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

      <div className="wrap" style={{ padding: '56px 24px 48px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
        <div>
          <span className="tag">Print · Press · Impress</span>
          <h1 style={{ fontSize: 'clamp(34px, 5.4vw, 56px)' }}>
            Order it. <span style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Brand it.</span> Wear it.
          </h1>
          <p style={{ fontSize: 17, opacity: 0.75, maxWidth: '48ch', margin: '18px 0 28px', lineHeight: 1.6 }}>
            Quality polos, tees, caps and trousers — with branding added right at checkout.
          </p>
          <a href="#shop" className="btn">Shop the catalog</a>
        </div>
        <div style={{
          background: '#fff', borderRadius: 28, border: '1px solid var(--line)', padding: '40px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 20px 50px rgba(11,15,46,0.08)'
        }}>
          <Image src="/logo.webp" alt="VividPress logo" width={140} height={140} style={{ marginBottom: 14 }} />
          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.6, textAlign: 'center' }}>
            Apparel &amp; Branding
            <span style={{ display: 'block', background: 'var(--grad)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontSize: 15, marginTop: 6 }}>
              in one order
            </span>
          </div>
        </div>
      </div>

      <div className="wrap section" id="shop">
        <span className="tag">The catalog</span>
        <h2>Shop</h2>
        <div className="grid" style={{ marginTop: 24 }}>
          {(products || []).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {(!products || products.length === 0) && <p>No products yet — add some in Supabase.</p>}
        </div>
      </div>

      <div className="wrap section soft">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <span className="tag">What customers say</span>
            <h2>Reviews</h2>
          </div>
          <a href="/reviews" className="btn ghost">Leave a review →</a>
        </div>
        <div className="grid" style={{ marginTop: 24 }}>
          {(reviews || []).map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
          {(!reviews || reviews.length === 0) && <p style={{ opacity: 0.6 }}>No reviews yet.</p>}
        </div>
      </div>
    </>
  );
}
