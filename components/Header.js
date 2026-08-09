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
      <Link href="/cart" className="btn ghost">
        Cart {count > 0 ? `(${count})` : ''}
      </Link>
    </div>
  );
}
