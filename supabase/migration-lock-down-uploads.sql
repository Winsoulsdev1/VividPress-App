-- Run this once, after deploying the new secure upload code.
-- Uploads now go through a server-side route (using the service role key,
-- which bypasses these policies entirely), so the old policy that let
-- anyone upload directly from the browser is no longer needed and is safe
-- to remove. The "public can view" policy stays, so uploaded images still
-- display correctly on the site.

drop policy if exists "Public can upload branding images" on storage.objects;
