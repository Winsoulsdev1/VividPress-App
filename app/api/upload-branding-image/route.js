import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

// SECURITY: uploads go through here (server-side, using the service role)
// instead of straight from the browser to Supabase. This lets us actually
// enforce file type and size limits — checks done only in the browser can
// be bypassed trivially.
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files (JPG, PNG, WEBP, GIF) are allowed' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 });
    }

    const ext = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabaseAdmin.storage
      .from('branding-uploads')
      .upload(filePath, buffer, { contentType: file.type });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from('branding-uploads').getPublicUrl(filePath);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
