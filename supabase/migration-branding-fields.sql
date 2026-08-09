-- Run this once in the Supabase SQL Editor to add the new branding fields
-- (image upload, font choice, colour choice) to your existing database.

alter table order_items
  add column if not exists branding_font text,
  add column if not exists branding_color text,
  add column if not exists branding_image_url text;

-- Create the storage bucket for branding image uploads.
-- Note: this INSERT works because storage.buckets is a normal table you can
-- write to from the SQL Editor. If it fails, create the bucket manually
-- instead: Storage (left sidebar) -> New bucket -> name it
-- "branding-uploads" -> toggle "Public bucket" on -> Save.
insert into storage.buckets (id, name, public)
values ('branding-uploads', 'branding-uploads', true)
on conflict (id) do nothing;

-- Allow anyone to upload and view branding images (no login system exists,
-- so this has to stay open — same trust model as the rest of the site).
create policy "Public can upload branding images"
on storage.objects for insert
to public
with check (bucket_id = 'branding-uploads');

create policy "Public can view branding images"
on storage.objects for select
to public
using (bucket_id = 'branding-uploads');
