'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../lib/cart';

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="wrap header">
      <Link href="/" className="brand">
        <Image src="/logo.webp" alt="VividPress logo" width={36} height={36} />
        <span className="brand-word">Vivid<span className="grad">Press</span></span>
      </Link>
      <Link href="/cart" className="btn ghost">
        Cart {count > 0 ? `(${count})` : ''}
      </Link>
    </div>
  );
}
