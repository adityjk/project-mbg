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

/**
 * Resolve media URL from relative path.
 * Handles Cloudinary full URLs (https://...) and relative /uploads/ paths.
 * Falls back to VITE_API_URL env var, not hardcoded localhost.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  const base = import.meta.env.VITE_API_URL || '/api';
  // strip leading slash from url if base already ends with /
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
}

/**
 * Generate avatar URL from name using ui-avatars.com
 * Falls back to avatar URL if provided
 */
export function getAvatarUrl(nama: string, foto_url: string | null): string {
  if (foto_url) return foto_url;
  const colors = ['10b981', '6366f1', 'f59e0b', 'ec4899', '8b5cf6', '14b8a6'];
  const colorIndex = nama.charCodeAt(0) % colors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${colors[colorIndex]}&color=fff&size=200`;
}

export const REPORT_CATEGORIES = [
  { value: 'umum', label: 'Umum' },
  { value: 'kualitas_makanan', label: 'Kualitas Makanan' },
  { value: 'distribusi', label: 'Distribusi' },
  { value: 'kebersihan', label: 'Kebersihan' },
  { value: 'lainnya', label: 'Lainnya' },
] as const;
