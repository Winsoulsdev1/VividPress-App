'use client';
import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { useCart } from '../../lib/cart';

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: form, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      // Redirect to Paystack's hosted checkout page
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>Checkout</h1>
        <p style={{ opacity: 0.7 }}>Subtotal: ₦{subtotal.toLocaleString()}</p>

        <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
          <div className="field">
            <label>Full name</label>
            <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>Delivery address</label>
            <textarea required rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>

          {error && <p style={{ color: '#F52D20' }}>{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Redirecting to payment...' : `Pay ₦${subtotal.toLocaleString()}`}
          </button>
        </form>
      </div>
    </>
  );
}
