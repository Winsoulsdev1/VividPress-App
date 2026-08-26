'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNav from '../../../../components/AdminNav';

export default function NewProductPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    priceMin: '',
    priceMax: '',
    sizes: '',
  });

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
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
      setImageUrl(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
          imageUrl,
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
            <label className="block text-sm font-semibold mb-1">Product Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-3 w-40 h-40 object-cover rounded border" />
            )}
          </div>

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

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-black text-white py-3 rounded font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
             }
