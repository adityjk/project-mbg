/**
 * Image Compression Utility
 * Mengkompres gambar sebelum upload ke Cloudinary untuk menghemat storage
 */
import imageCompression from 'browser-image-compression';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

/**
 * Compress gambar sebelum upload
 * - Convert PNG ke JPEG untuk ukuran lebih kecil
 * - Resize ke max 1200px
 * - Compress ke max 500KB
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 0.5,           // Max 500KB
    maxWidthOrHeight = 1200,    // Max dimension
  } = options;

  const compressionOptions = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg' as const,  // Convert to JPEG for smaller size
    initialQuality: 0.8,
  };

  try {
    console.log(`[Image Compression] Original: ${(file.size / 1024).toFixed(2)}KB, Type: ${file.type}`);
    
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log(`[Image Compression] Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB, Type: ${compressedFile.type}`);
    
    return compressedFile;
  } catch (error) {
    console.error('[Image Compression] Error:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Check apakah file adalah gambar yang valid
 */
export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Get preview URL untuk gambar
 */
export function getImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke preview URL untuk cleanup memory
 */
export function revokeImagePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
