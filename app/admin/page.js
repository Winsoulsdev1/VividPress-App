'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin/orders');
    } else {
      setError('Wrong password');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper-soft)' }}>
      <div style={{ width: '100%', maxWidth: 340, padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <Image src="/logo.webp" alt="VividPress logo" width={52} height={52} style={{ marginBottom: 10 }} />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: 20 }}>
            Vivid<span className="grad">Press</span>
          </span>
          <span style={{ fontSize: 12, opacity: 0.55, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
            Admin
          </span>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: 24 }}>
          <div className="field" style={{ marginBottom: 18 }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 44 }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p style={{ color: 'var(--red)', fontSize: 13, marginBottom: 14 }}>{error}</p>}
          <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Checking...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
