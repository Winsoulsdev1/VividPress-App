import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import { isAdmin } from '../../../../lib/adminAuth';

// SECURITY: uploads go through here (server-side, using the service role)
// and only work if the request comes from a logged-in admin.
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req) {
  if (!isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
      .from('product-images')
      .upload(filePath, buffer, { contentType: file.type });

    if (error) throw error;

    const { data } = supabaseAdmin.storage.from('product-images').getPublicUrl(filePath);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
