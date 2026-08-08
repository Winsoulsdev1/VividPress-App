# VividPress — Setup Guide

This is a real Next.js app: cart, checkout, Paystack payment, email
notifications at each order stage, and a review system. Follow these steps
in order — each one unlocks the next.

## 1. Supabase (database)

1. Go to supabase.com → New project.
2. Once it's created, open the **SQL Editor** and paste in everything from
   `supabase/schema.sql`, then run it. This creates all your tables and adds
   your 4 starter products.
3. Go to **Project Settings → API**. You'll need three values from here in
   step 4: `Project URL`, `anon public` key, and `service_role` key (click
   "reveal" to see it — keep this one secret, never put it in frontend code).

## 2. Paystack (payments)

1. Sign up at paystack.com, switch to **Test mode** while you're setting up.
2. Go to **Settings → API Keys & Webhooks**. Copy your test `Secret Key` and
   `Public Key`.
3. Leave the webhook URL blank for now — you'll add it in step 5, after
   you have a live site URL.

## 3. Resend (emails)

1. Sign up at resend.com (free tier is generous — plenty for a small
   business).
2. Copy your API key from the dashboard.
3. For `EMAIL_FROM`, you can use Resend's test sending domain to start, or
   verify your own domain later for a proper "orders@vividpress.com" address.

## 4. Deploy to Vercel

1. Push this folder to a GitHub repo (same as you did for the AI Education
   Builders project).
2. Go to vercel.com → Add New Project → import that repo.
3. Before deploying, add these Environment Variables (copy from
   `.env.example`, filling in your real values):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PAYSTACK_SECRET_KEY`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
   - `RESEND_API_KEY`
   - `EMAIL_FROM`
   - `ADMIN_PASSWORD` — pick something only you know
   - `NEXT_PUBLIC_SITE_URL` — you won't have this until after the first
     deploy; put a placeholder like `https://placeholder.vercel.app` for now
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Click Deploy. Once it's live, copy your real Vercel URL and update
   `NEXT_PUBLIC_SITE_URL` in the project's environment variables to match,
   then redeploy (Vercel → Deployments → ⋯ → Redeploy) so links in emails
   point to the right place.

## 5. Connect the Paystack webhook

This is the step that makes payment confirmation automatic — without it,
orders will stay stuck on "pending_payment" forever.

1. Back in Paystack → Settings → API Keys & Webhooks.
2. Set the webhook URL to: `https://your-real-site.vercel.app/api/paystack/webhook`
3. Save.

Test it: place a test order on your site using Paystack's test card
(`4084084084084081`, any future expiry, any CVV). You should land on the
success page, and within a few seconds get a "we've got your order" email.

## 6. Using the admin panel

- Go to `https://your-site.vercel.app/admin`
- Log in with the `ADMIN_PASSWORD` you set
- **Orders**: see every order, click "Manage" to view items and update
  status. Moving an order to `in_production`, `ready`, or `delivered`
  automatically emails the customer. Moving to `delivered` also unlocks
  their review link.
- **Pending reviews**: every review a customer submits sits here until you
  approve it — approved ones show on the homepage.

## 7. Going live for real

- Switch Paystack from Test mode to Live mode, and swap in your live
  `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in Vercel's
  environment variables.
- Verify a real sending domain in Resend so emails come from your own
  domain instead of Resend's shared one.
- Update products directly in Supabase's Table Editor (or build a small
  admin form for it later — say the word and I'll add one).

## What's deliberately left simple

- **Admin login** is a single shared password, not full user accounts —
  fine for one person managing the shop. Worth upgrading if more people
  need access later.
- **Pricing** uses `price_min` per item regardless of size/quantity tiers —
  add tiered pricing logic in `components/ProductCard.js` if you need it.
- **Delivery fees** aren't calculated — `total` currently equals
  `subtotal`. Add a delivery fee field to the checkout form and API route
  when you're ready.
