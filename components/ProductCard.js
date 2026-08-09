'use client';
import { useState } from 'react';
import { useCart } from '../lib/cart';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const colors = product.colors || [];
  const [color, setColor] = useState(colors[0]?.name || '');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wantsBranding, setWantsBranding] = useState(false);
  const [brandingDetails, setBrandingDetails] = useState('');
  const [added, setAdded] = useState(false);

  const unitPrice = product.price_min;

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      unitPrice,
      quantity: Number(quantity) || 1,
      size,
      color,
      brandingRequested: wantsBranding,
      brandingDetails: wantsBranding ? brandingDetails : '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="card">
      <div style={{
        aspectRatio: '1/1', position: 'relative', background: 'var(--paper-soft)',
        padding: '28px 18px', textAlign: 'center'
      }}>
        <span style={{
          position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800,
          letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 10px',
          borderRadius: 999, color: '#fff', background: 'var(--grad)'
        }}>VividPress</span>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              title={c.name}
              style={{
                width: 18, height: 18, borderRadius: '50%', background: c.hex,
                border: color === c.name ? '2px solid var(--ink)' : '1.5px solid rgba(11,15,46,0.2)',
                cursor: 'pointer', boxShadow: color === c.name ? '0 0 0 2px #fff, 0 0 0 3.5px var(--ink)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div className="card-inner">
        <h3 style={{ fontSize: 17, marginBottom: 6 }}>{product.name}</h3>
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>
          {product.sizes}
        </p>
        <p style={{ fontWeight: 800, fontFamily: 'Poppins, sans-serif', fontSize: 15, marginBottom: 14 }}>
          ₦{product.price_min.toLocaleString()} – ₦{product.price_max.toLocaleString()}
        </p>

        <div className="field">
          <label>Size</label>
          <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. L" />
        </div>

        <div className="field">
          <label>Quantity</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={wantsBranding}
              onChange={(e) => setWantsBranding(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Add branding to this item
          </label>
        </div>

        {wantsBranding && (
          <div className="field">
            <label>Branding details</label>
            <textarea
              rows={2}
              value={brandingDetails}
              onChange={(e) => setBrandingDetails(e.target.value)}
              placeholder="Logo, text, colours..."
            />
          </div>
        )}

        <button className="btn" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAdd} disabled={!size}>
          {added ? 'Added ✓' : 'Add to cart'}
        </button>
        {!size && <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Enter a size to add to cart</p>}
      </div>
    </div>
  );
}
