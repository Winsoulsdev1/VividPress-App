'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../../../components/AdminNav';

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    priceMin: '',
    priceMax: '',
    sizes: '',
  });

  const [colors, setColors] = useState([
    { name: '', hex: '#111111', imageUrl: '', imagePreview: '', uploading: false },
  ]);

  function addColorRow() {
    setColors([...colors, { name: '', hex: '#111111', imageUrl: '', imagePreview: '', uploading: false }]);
  }

  function removeColorRow(index) {
    setColors(colors.filter((_, i) => i !== index));
  }

  function updateColorField(index, field, value) {
    const next = [...colors];
    next[index] = { ...next[index], [field]: value };
    setColors(next);
  }

  async function handleColorImageChange(index, e) {
    const file = e.target.files[0];
    if (!file) return;

    updateColorField(index, 'imagePreview', URL.createObjectURL(file));
    updateColorField(index, 'uploading', true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload-product-image', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      updateColorField(index, 'imageUrl', data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      updateColorField(index, 'uploading', false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validColors = colors.filter((c) => c.name.trim());
    if (validColors.some((c) => !c.imageUrl)) {
      setError('Please upload a photo for every color you added.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          type: form.type,
          description: form.description,
          priceMin: Number(form.priceMin),
          priceMax: form.priceMax ? Number(form.priceMax) : undefined,
          sizes: form.sizes,
          colors: validColors.map((c) => ({ name: c.name, hex: c.hex, imageUrl: c.imageUrl })),
          imageUrl: validColors[0]?.imageUrl || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not save product');
      router.push('/admin/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const anyUploading = colors.some((c) => c.uploading);

  return (
    <div>
      <AdminNav backHref="/admin/orders" backLabel="Back to Orders" />
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">Product Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. Structured Cap"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Type</label>
            <input
              type="text"
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. cap, tee, polo, trousers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Min Price (₦)</label>
              <input
                type="number"
                required
                value={form.priceMin}
                onChange={(e) => setForm({ ...form, priceMin: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Max Price (₦)</label>
              <input
                type="number"
                value={form.priceMax}
                onChange={(e) => setForm({ ...form, priceMax: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Sizes</label>
            <input
              type="text"
              value={form.sizes}
              onChange={(e) => setForm({ ...form, sizes: e.target.value })}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. S - M - L - XL"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Colors & Photos</label>
            <p className="text-xs text-gray-500 mb-3">Add each color your product comes in, along with its own photo. Customers will see the matching photo when they tap a color.</p>

            <div className="space-y-4">
              {colors.map((c, index) => (
                <div key={index} className="border rounded-lg p-3 flex gap-3 items-start">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColorField(index, 'hex', e.target.value)}
                    className="w-10 h-10 rounded border"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateColorField(index, 'name', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="Color name, e.g. Navy"
                    />
                    <input type="file" accept="image/*" onChange={(e) => handleColorImageChange(index, e)} />
                    {c.uploading && <p className="text-xs text-gray-500">Uploading...</p>}
                    {c.imagePreview && (
                      <img src={c.imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                    )}
                  </div>
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColorRow(index)}
                      className="text-red-600 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addColorRow}
              className="mt-3 text-sm font-semibold text-blue-600"
            >
              + Add another color
            </button>
          </div>

          <button
            type="submit"
            disabled={saving || anyUploading}
            className="w-full bg-black text-white py-3 rounded font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
