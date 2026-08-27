'use client';

import { useState } from 'react';
import { useCart } from '../lib/cart';

const FONT_OPTIONS = [
  'Poppins', 'Inter', 'Playfair Display','Bebas Neue',
  'Pacifico', 'Roboto Slab', 'Oswald', 'Dancing Script',
];

const BRANDING_COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#F52D20' },
  { name: 'Gold', hex: '#FECD01' },
  { name: 'Navy', hex: '#0B0F2E' },
  { name: 'Cyan', hex: '#00B9FC' },
];

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const colors = product.colors || [];
  const [color, setColor] = useState(colors[0]?.name || '');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wantsBranding, setWantsBranding] = useState(false);
  const [brandingDetails, setBrandingDetails] = useState('');
  const [brandingFont, setBrandingFont] = useState(FONT_OPTIONS[0]);
  const [brandingColor, setBrandingColor] = useState(BRANDING_COLORS[0].name);
  const [brandingImageUrl, setBrandingImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [added, setAdded] = useState(false);

  const unitPrice = product.price_min;

  // Show the photo for whichever color is currently selected.
  // Falls back to the product's main image if a color has no photo of its own.
  const selectedColorObj = colors.find((c) => c.name === color);
  const displayImage = selectedColorObj?.imageUrl || product.image_url;

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('That image is too large — please use a file under 5MB.');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload-branding-image', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setBrandingImageUrl(data.url);
    } catch (err) {
      console.error(err);
      setUploadError(err?.message || 'Could not upload this image — please try again.');
    } finally {
      setUploading(false);
    }
  }

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
      brandingFont: wantsBranding ? brandingFont : '',
      brandingColor: wantsBranding ? brandingColor : '',
      brandingImageUrl: wantsBranding ? brandingImageUrl : '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="card">
      <div style={{
        aspectRatio: '1/1', position: 'relative', background: 'var(--paper-soft)',
        textAlign: 'center', overflow: 'hidden',
      }}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)', opacity: 0.3, fontSize: 13, fontWeight: 700 }}>
            No photo yet
          </div>
        )}
        <span style={{
          position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 800,
          letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 10px',
          borderRadius: 999, color: '#fff', background: 'var(--grad)'
        }}>VividPress</span>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', position: 'absolute', bottom: 14, left: 0, right: 0 }}>
          {colors.map((c) => (
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
        <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>{product.sizes}</p>
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
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 14, marginBottom: 14, background: 'var(--paper-soft)' }}>

            <div className="field">
              <label>Upload a design or logo (optional)</label>
              {brandingImageUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={brandingImageUrl}
                    alt="Branding upload preview"
                    style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--line)' }}
                  />
                  <button
                    type="button"
                    className="btn ghost"
                    style={{ padding: '6px 12px', fontSize: 12 }}
                    onClick={() => setBrandingImageUrl('')}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 56, height: 56, borderRadius: 12, border: '2px dashed var(--line)',
                  cursor: uploading ? 'wait' : 'pointer', fontSize: 26, fontWeight: 700,
                  color: 'var(--magenta)', background: '#fff',
                }}>
                  {uploading ? '…' : '+'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
              {uploadError && <p style={{ color: 'var(--red)', fontSize: 12, marginTop: 6 }}>{uploadError}</p>}
            </div>

            <div className="field">
              <label>Branding font</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setBrandingFont(f)}
                    style={{
                      textAlign: 'left', padding: '10px 14px', borderRadius: 10,
                      border: brandingFont === f ? '2px solid var(--ink)' : '1.5px solid var(--line)',
                      background: '#fff', cursor: 'pointer',
                      fontFamily: f, fontSize: 17, fontWeight: 700, color: 'var(--ink)',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Branding colour (ink / thread)</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {BRANDING_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setBrandingColor(c.name)}
                    title={c.name}
                    style={{
                      width: 26, height: 26, borderRadius: '50%', background: c.hex,
                      border: brandingColor === c.name ? '2px solid var(--ink)' : '1.5px solid rgba(11,15,46,0.2)',
                      cursor: 'pointer',
                      boxShadow: brandingColor === c.name ? '0 0 0 2px #fff, 0 0 0 3.5px var(--ink)' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>Notes (text to print, placement, anything else)</label>
              <textarea
                rows={2}
                value={brandingDetails}
                onChange={(e) => setBrandingDetails(e.target.value)}
                placeholder="e.g. Print 'My Love' on the chest"
              />
            </div>
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
