'use client';
import Link from 'next/link';
import Header from '../../components/Header';
import { useCart } from '../../lib/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      <Header />
      <div className="wrap section">
        <h1>Your cart</h1>

        {items.length === 0 && (
          <p>
            Your cart is empty. <Link href="/">Go back to the shop</Link>.
          </p>
        )}

        {items.map((item) => (
          <div key={item.cartId} className="card" style={{ marginBottom: 14, padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{item.name}</strong>
              <button className="btn ghost" onClick={() => removeItem(item.cartId)}>
                Remove
              </button>
            </div>
            <p style={{ fontSize: 13, opacity: 0.7 }}>
              {item.color} · Size {item.size} · ₦{item.unitPrice.toLocaleString()} each
            </p>
            {item.brandingRequested && (
              <p style={{ fontSize: 13, opacity: 0.7 }}>Branding: {item.brandingDetails || '(details pending)'}</p>
            )}
            <div className="field" style={{ maxWidth: 120 }}>
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.cartId, Number(e.target.value) || 1)}
              />
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <>
            <h3>Subtotal: ₦{subtotal.toLocaleString()}</h3>
            <Link href="/checkout" className="btn">Proceed to checkout</Link>
          </>
        )}
      </div>
    </>
  );
}
