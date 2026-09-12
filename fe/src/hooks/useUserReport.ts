import { useState, useEffect, useCallback, useRef } from 'react';
import { reportApi, menuApi } from '../services/api';
import { compressImage, isValidImage, getImagePreviewUrl, revokeImagePreviewUrl } from '../utils/imageUtils';
import type { Menu } from '../types';

export function useUserReport() {
  const [user, setUser] = useState<any>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [myReports, setMyReports] = useState<any[]>([]);

  // Image upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchMenus = useCallback(async () => {
    try {
      const res = await menuApi.getAll();
      if (mountedRef.current) setMenus(res.data);
    } catch (err) {
      console.error("Gagal load menu");
    }
  }, []);

  const fetchMyReports = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      const u = JSON.parse(storedUser);

      const res = await reportApi.getAll();
      const filtered = res.data.filter((r: any) => r.nama_pelapor === u.username);
      if (mountedRef.current) {
        setMyReports(filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      }
    } catch (err) {
      console.error("Gagal load reports");
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchMenus();
    fetchMyReports();
  }, [fetchMenus, fetchMyReports]);

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (imagePreview) revokeImagePreviewUrl(imagePreview);
    };
  }, [imagePreview]);

  const handleImageSelect = useCallback((file: File) => {
    if (!isValidImage(file)) {
      setError('Format gambar tidak valid. Gunakan JPG, PNG, atau WebP.');
      return false;
    }
    const previewUrl = getImagePreviewUrl(file);
    setImagePreview(previewUrl);
    setSelectedImage(file);
    setError(null);
    return true;
  }, []);

  const removeImage = useCallback(() => {
    if (imagePreview) revokeImagePreviewUrl(imagePreview);
    setSelectedImage(null);
    setImagePreview(null);
  }, [imagePreview]);

  const submitReport = useCallback(async (formData: any) => {
    setLoading(true);
    setError(null);
    try {
      let foto_bukti: string | undefined;

      if (selectedImage) {
        setUploadingImage(true);
        try {
          const compressedImage = await compressImage(selectedImage);
          const uploadRes = await reportApi.uploadImage(compressedImage);
          foto_bukti = uploadRes.imageUrl;
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          setError('Gagal upload gambar. Laporan akan dikirim tanpa gambar.');
        } finally {
          setUploadingImage(false);
        }
      }

      const res = await reportApi.create({
        ...formData,
        menu_id: formData.menu_id ? parseInt(formData.menu_id) : undefined,
        foto_bukti,
        kategori: formData.kategori
      });

      setSuccess(true);
      setTicketId(res.data.id.toString());
      removeImage();
      fetchMyReports();
      return true;
    } catch (err) {
      setError('Gagal mengirim laporan. Silakan coba lagi.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedImage, removeImage, fetchMyReports]);

  const resetSuccess = useCallback(() => {
    setSuccess(false);
    setTicketId(null);
  }, []);

  return {
    user,
    menus,
    myReports,
    loading,
    success,
    error,
    ticketId,
    uploadingImage,
    imagePreview,
    handleImageSelect,
    removeImage,
    submitReport,
    resetSuccess,
    setError
  };
}
