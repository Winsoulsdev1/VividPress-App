const PAYSTACK_BASE = 'https://api.paystack.co';

// Starts a payment: Paystack gives back a checkout URL to redirect the customer to.
export async function initializeTransaction({ email, amountNaira, reference, callbackUrl, metadata }) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountNaira * 100), // Paystack expects kobo
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || 'Could not start payment');
  return data.data; // { authorization_url, access_code, reference }
}

// Used by the webhook to double-check a payment really succeeded before
// trusting it, instead of trusting the webhook payload alone.
export async function verifyTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || 'Could not verify payment');
  return data.data; // includes status: 'success' | 'failed' | ...
}
