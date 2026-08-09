'use client';
import { useState } from 'react';

export default function GeneralReviewForm() {
  const [name, setName] = useState('');
  const [item, setItem] = useState('');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Please add your name'); return; }
    if (!rating) { setError('Please pick a star rating'); return; }
    if (!text.trim()) { setError('Please write a short review'); return; }

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, item, rating, text }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError('Something went wrong — please try again.');
    }
  }

  if (submitted) {
    return <p>Thank you! Your review will appear on the site once approved.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
      <div className="field">
        <label>Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aniekan Okon" />
      </div>
      <div className="field">
        <label>What did you order?</label>
        <input value={item} onChange={(e) => setItem(e.target.value)} placeholder="e.g. Branded polos for our team" />
      </div>
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
        <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell us how it went" />
      </div>
      {error && <p style={{ color: '#F52D20' }}>{error}</p>}
      <button className="btn" type="submit">Submit review</button>
    </form>
  );
}
