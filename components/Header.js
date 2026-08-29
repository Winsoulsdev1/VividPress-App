'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '../lib/cart';

export default function Header() {
  const { items } = useCart();
  const pathname = usePathname();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const isHome = pathname === '/';

  return (
    <div className="wrap header">
      {isHome ? (
        <Link href="/" className="brand">
          <Image src="/logo.webp" alt="VividPress logo" width={36} height={36} />
          <span className="brand-word">Vivid<span className="grad">Press</span></span>
        </Link>
      ) : (
        <Link
          href="/"
          style={{
            fontWeight: 800, fontSize: 15, color: 'var(--ink)',
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 999, border: '2px solid var(--ink)',
          }}
        >
          ← Shop
        </Link>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <Link href="/reviews" style={{ fontWeight: 600, fontSize: 14 }}>
          Reviews
        </Link>

        <Link
          href="/cart"
          id="cart-icon"
          aria-label="View cart"
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 44, height: 44, borderRadius: '50%', border: '1.5px solid var(--line)',
          }}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {count > 0 && (
            <span style={{
              position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 999,
              background: 'var(--grad)', color: '#fff', fontSize: 11, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            }}>
              {count}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}
