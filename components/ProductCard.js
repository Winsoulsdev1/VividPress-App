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

  const unitPrice = product.price_min; // simplest starting point — price varies by size/qty in real pricing, adjust as needed

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
      <h3 style={{ fontSize: 17 }}>{product.name}</h3>
      <p style={{ fontSize: 13, opacity: 0.7 }}>
        ₦{product.price_min.toLocaleString()} – ₦{product.price_max.toLocaleString()} · {product.sizes}
      </p>

      <div className="field">
        <label>Colour</label>
        <select value={color} onChange={(e) => setColor(e.target.value)}>
          {colors.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Size</label>
        <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. L" />
      </div>

      <div className="field">
        <label>Quantity</label>
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={wantsBranding}
            onChange={(e) => setWantsBranding(e.target.checked)}
            style={{ width: 'auto', marginRight: 8 }}
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

      <button className="btn" onClick={handleAdd} disabled={!size}>
        {added ? 'Added ✓' : 'Add to cart'}
      </button>
      {!size && <p style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>Enter a size to add to cart</p>}
    </div>
  );
}
