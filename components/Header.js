'use client';
import Link from 'next/link';
import { useCart } from '../lib/cart';

export default function Header() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="wrap header">
      <Link href="/"><strong>VividPress</strong></Link>
      <Link href="/cart" className="btn ghost">
        Cart {count > 0 ? `(${count})` : ''}
      </Link>
    </div>
  );
}
