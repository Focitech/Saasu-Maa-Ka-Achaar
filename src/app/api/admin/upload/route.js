import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No image file uploaded' }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'Uploaded file must be an image (JPEG, PNG, WEBP)' }, { status: 400 });
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'Image size exceeds maximum limit of 10MB' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadToCloudinary(buffer, {
      folder: 'saasumaa/products',
      mimeType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      devMode: Boolean(result.devMode),
      message: 'Photo uploaded successfully',
    });
  } catch (err) {
    console.error('[Upload API Error]', err);
    return NextResponse.json({ success: false, error: err.message || 'Error processing photo upload' }, { status: 500 });
  }
}
