import Link from 'next/link';
import Image from 'next/image';

export default function AdminNav({ backHref, backLabel }) {
  return (
    <div style={{ background: 'var(--ink)', color: '#fff', marginBottom: 28 }}>
      <div className="wrap" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logo.webp" alt="VividPress logo" width={28} height={28} />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff' }}>
            VividPress <span style={{ opacity: 0.55, fontWeight: 500 }}>Admin</span>
          </span>
        </Link>
        <div style={{ display: 'flex', gap: 18, fontSize: 14, fontWeight: 600 }}>
          <Link href="/admin/orders" style={{ color: '#fff', opacity: 0.85 }}>Orders</Link>
            <Link href="/admin/reviews" style={{ color: '#fff', opacity: 0.85 }}>Reviews</Link>
            <Link href="/admin/products/new" style={{ color: '#fff', opacity: 0.85 }}>Add Product</Link>
        </div>
      </div>
      {backHref && (
        <div className="wrap" style={{ padding: '0 24px 14px' }}>
          <Link
            href={backHref}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700,
              color: '#fff', opacity: 0.9,
            }}
          >
            ← {backLabel || 'Back'}
          </Link>
        </div>
      )}
    </div>
  );
}
