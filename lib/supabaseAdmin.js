import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. This uses the service role key, which bypasses Row Level Security.
// Only ever import this file inside app/api/* route handlers or Server Components —
// never inside a file marked "use client", or the key would leak to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
