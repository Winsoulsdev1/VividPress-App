'use client';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '../../../components/Header';
import { useCart } from '../../../lib/cart';

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const ref = params.get('ref');
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>Thank you!</h1>
        <p>
          Your order <strong>{ref}</strong> has been received. We&apos;ll confirm your payment shortly and start
          production — expect your order within 7 days.
        </p>
        <p>You&apos;ll get an email at each stage. You can also track it anytime here:</p>
        {ref && (
          <Link href={`/track/${ref}`} className="btn">
            Track my order
          </Link>
        )}
      </div>
    </>
  );
}
