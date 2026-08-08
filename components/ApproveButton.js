'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ApproveButton({ reviewId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function approve() {
    setLoading(true);
    await fetch(`/api/admin/reviews/${reviewId}/approve`, { method: 'POST' });
    setLoading(false);
    router.refresh();
  }

  return (
    <button className="btn" onClick={approve} disabled={loading}>
      {loading ? 'Approving...' : 'Approve & show on site'}
    </button>
  );
}
