import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * Uploads a file buffer directly to Cloudinary.
 * Falls back to a local base64 data URI in development mode if Cloudinary keys are missing.
 */
export async function uploadToCloudinary(buffer, options = {}) {
  if (!isConfigured) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[Cloudinary Warning] CLOUDINARY_* environment variables are not set. Operating in dev fallback mode.');
    }
    // Dev fallback: generate a base64 Data URI so uploading and testing works locally
    const base64 = buffer.toString('base64');
    const mimeType = options.mimeType || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64}`;

    return {
      success: true,
      url: dataUri,
      publicId: `dev-mock-${Date.now()}`,
      devMode: true,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'saasumaa/products',
        resource_type: 'image',
        format: options.format || 'webp',
        transformation: options.transformation || [
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]', error);
          reject(error);
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export { cloudinary, isConfigured };
