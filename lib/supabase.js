import { createClient } from '@supabase/supabase-js';

// Safe to use in the browser — only ever reads active products and approved reviews,
// because Row Level Security on the database only allows that with the anon key.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
