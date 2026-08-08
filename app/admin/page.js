'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/admin/orders');
    } else {
      setError('Wrong password');
    }
  }

  return (
    <div className="wrap section" style={{ maxWidth: 320 }}>
      <h1>Admin</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p style={{ color: '#F52D20' }}>{error}</p>}
        <button className="btn" type="submit">Log in</button>
      </form>
    </div>
  );
}
