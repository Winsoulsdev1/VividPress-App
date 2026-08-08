'use client';
import { useState } from 'react';

export default function ReviewForm({ trackingCode, customerName, itemSummary }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!rating) { setError('Please pick a star rating'); return; }
    if (!text.trim()) { setError('Please write a short review'); return; }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode, customerName, item: itemSummary, rating, text }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError('Something went wrong — please try again.');
    }
  }

  if (submitted) {
    return <p>Thank you! Your review has been submitted and will appear on the site once approved.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <div className="field">
        <label>Your rating</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setRating(n)}
              style={{
                background: 'none', border: 'none', fontSize: 26, cursor: 'pointer',
                color: n <= rating ? '#FECD01' : '#ccc',
              }}
            >★</button>
          ))}
        </div>
      </div>
      <div className="field">
        <label>Your review</label>
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      {error && <p style={{ color: '#F52D20' }}>{error}</p>}
      <button className="btn" type="submit">Submit review</button>
    </form>
  );
}
