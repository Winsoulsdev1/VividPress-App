-- VividPress order system schema
-- Run this once in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

-- ---------- PRODUCTS ----------
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,               -- polo | tee | cap | trousers | other
  price_min numeric not null,
  price_max numeric not null,
  sizes text not null,              -- e.g. "S · M · L · XL"
  colors jsonb not null default '[]', -- e.g. [{"name":"Navy","hex":"#0B0F2E"}]
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- ORDERS ----------
create table orders (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,        -- short code shown to customer, e.g. VP-4F82A1
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery_address text not null,
  status text not null default 'pending_payment'
    check (status in ('pending_payment','paid','in_production','ready','delivered','cancelled')),
  subtotal numeric not null,
  total numeric not null,
  paystack_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_tracking_code_idx on orders (tracking_code);
create index orders_status_idx on orders (status);

-- ---------- ORDER ITEMS ----------
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_name text not null,
  quantity int not null default 1,
  size text,
  color text,
  branding_requested boolean not null default false,
  branding_details text,
  branding_font text,
  branding_color text,
  branding_image_url text,
  unit_price numeric not null,
  line_total numeric not null
);

-- ---------- STATUS HISTORY ----------
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

-- ---------- REVIEWS ----------
create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete set null,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  item text,
  text text not null,
  approved boolean not null default false,   -- you approve before it shows publicly
  created_at timestamptz not null default now()
);

-- ---------- ROW LEVEL SECURITY ----------
-- Public (anon key) can only READ active products and approved reviews.
-- Every write (orders, order_items, status updates, review inserts) goes
-- through Next.js API routes using the service role key, which bypasses RLS.
-- This keeps the database locked down without needing customer accounts.

alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table reviews enable row level security;

create policy "public can read active products"
  on products for select
  using (active = true);

create policy "public can read approved reviews"
  on reviews for select
  using (approved = true);

-- No public policies on orders / order_items / order_status_history:
-- only the service role (server-side) can touch them.

-- ---------- SEED PRODUCTS ----------
insert into products (name, type, price_min, price_max, sizes, colors) values
('Classic Polo', 'polo', 4500, 6000, 'S · M · L · XL', '[{"name":"Navy","hex":"#0B0F2E"},{"name":"Red","hex":"#F52D20"},{"name":"Yellow","hex":"#FECD01"},{"name":"White","hex":"#FFFFFF"}]'),
('Round-Neck Tee', 'tee', 3000, 4000, 'S · M · L · XL', '[{"name":"Navy","hex":"#0B0F2E"},{"name":"White","hex":"#FFFFFF"},{"name":"Red","hex":"#F52D20"}]'),
('Structured Cap', 'cap', 2000, 3000, 'Adjustable', '[{"name":"Navy","hex":"#0B0F2E"},{"name":"Yellow","hex":"#FECD01"},{"name":"Red","hex":"#F52D20"}]'),
('Chino Trousers', 'trousers', 7000, 9500, '30 · 32 · 34 · 36', '[{"name":"Navy","hex":"#0B0F2E"},{"name":"Charcoal","hex":"#2B2B28"},{"name":"Yellow","hex":"#FECD01"}]');
