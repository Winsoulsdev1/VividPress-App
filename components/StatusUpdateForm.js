'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const OPTIONS = ['paid', 'in_production', 'ready', 'delivered', 'cancelled'];

export default function StatusUpdateForm({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage('Updated — customer notified by email.');
      router.refresh();
    } else {
      setMessage('Something went wrong.');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 420 }}>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ flex: 1, padding: 10 }}>
        {OPTIONS.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <button className="btn" type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Update'}
      </button>
      {message && <p style={{ fontSize: 13 }}>{message}</p>}
    </form>
  );
}
