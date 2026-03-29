import { useState, useRef, useEffect } from 'react';
import { MdReport, MdSend, MdCheck, MdPerson, MdSchool, MdDescription, MdHome, MdCampaign, MdImage, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { reportApi } from '../services/api';
import { compressImage, isValidImage, getImagePreviewUrl, revokeImagePreviewUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';

export default function PublicLaporan() {
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    menu_id: '',
    kategori: 'umum' as 'umum' | 'kualitas_makanan' | 'distribusi' | 'kebersihan' | 'lainnya'
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreviewUrl(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImage(file)) {
      setError('Format gambar tidak valid. Gunakan JPG, PNG, atau WebP.');
      return;
    }

    // Show preview immediately
    const previewUrl = getImagePreviewUrl(file);
    setImagePreview(previewUrl);
    setSelectedImage(file);
    setError(null);
  };

  const removeImage = () => {
    if (imagePreview) {
      revokeImagePreviewUrl(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_pelapor || !formData.asal_sekolah || !formData.isi_laporan) {
      setError('Semua field harus diisi');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let foto_bukti: string | undefined;

      // Upload image first if selected
      if (selectedImage) {
        setUploadingImage(true);
        try {
          // Compress image before upload
          const compressedImage = await compressImage(selectedImage);
          const uploadRes = await reportApi.uploadImage(compressedImage);
          foto_bukti = uploadRes.data.imageUrl;
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          // Continue without image if upload fails
        } finally {
          setUploadingImage(false);
        }
      }

      const res = await reportApi.create({
          ...formData,
          menu_id: undefined,
          foto_bukti
      });
      
      setSuccess(true);
      setTicketId(String(res.data.id));
      setFormData({ 
          nama_pelapor: '', 
          asal_sekolah: '', 
          isi_laporan: '',
          menu_id: '',
          kategori: 'umum'
      });
      removeImage();
    } catch (err) {
      setError('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-neutral font-sans selection:bg-primary/20 selection:text-primary flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] border border-neutral/10 shadow-soft-lg p-8 md:p-12 text-center max-w-lg w-full"
        >
          <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-soft mx-auto">
            <MdCheck className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-base-content mb-2">Laporan Diterima!</h1>
          
          <div className="bg-orange-50 border border-orange-100 border-dashed p-6 rounded-2xl mb-8">
             <p className="text-xs uppercase font-bold text-orange-600/70 mb-2 tracking-wider">Tiket Laporan Anda</p>
             <p className="text-4xl font-display font-bold tracking-widest text-primary">#{ticketId}</p>
          </div>
          
          <p className="text-muted-themed font-medium mb-8 px-4">
            Terima kasih telah berpartisipasi. Simpan nomor tiket ini untuk memantau status laporan Anda.
          </p>
          
          <div className="space-y-3">
             <button 
               className="btn w-full bg-primary hover:bg-primary/90 text-white border-none h-14 rounded-2xl font-bold text-lg shadow-soft hover:shadow-soft-lg transition-all"
               onClick={() => setSuccess(false)}
             >
               Buat Laporan Baru
             </button>
             <Link to="/" className="btn w-full btn-ghost hover:bg-base-200 h-14 rounded-2xl font-bold text-muted-themed">
               Kembali ke Beranda
             </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral font-sans selection:bg-primary/20 selection:text-primary p-4 md:p-8">
      {/* Navbar Simple */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12 relative z-50">
         <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <MdHome size={24} className="text-primary" />
            <span className="font-bold hidden md:inline text-base-content">Kembali ke Beranda</span>
         </Link>
         <div className="font-display font-bold text-xl text-base-content">MBG<span className="text-primary">.GO</span></div>
      </nav>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10 pb-20">
         {/* Decoration */}
         <div className="absolute top-0 right-[-10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
         <div className="absolute bottom-0 left-[-10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>

         {/* Header */}
         <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-br from-primary to-orange-600 text-white p-8 md:p-10 rounded-[2.5rem] shadow-soft-lg relative overflow-hidden"
         >
            <div className="absolute top-[-20px] right-[-20px] p-4 opacity-10 transform rotate-12">
               <MdCampaign size={200} />
            </div>
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4 border border-white/20">
                  <MdReport /> Layanan Publik
               </div>
               <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 tracking-tight">Layanan Pengaduan</h1>
               <p className="font-medium text-lg opacity-90 max-w-lg leading-relaxed">
                  Sampaikan keluhan atau masukan Anda terkait program Makan Bergizi Gratis. Identitas pelapor aman dan terjaga (Anonim).
               </p>
            </div>
         </motion.div>

         {/* Form */}
         <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 rounded-[2.5rem] border border-neutral/10 shadow-soft-lg p-6 md:p-10"
         >
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 gap-6">
                  {/* Nama */}
                  <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider flex items-center gap-2 mb-1 opacity-70">
                     <MdPerson size={16} /> Nama Pelapor (Boleh Samaran)
                  </label>
                  <input
                     type="text"
                     className="input w-full h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-base-content px-5 placeholder:font-normal"
                     placeholder="Nama Anda..."
                     value={formData.nama_pelapor}
                     onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                  />
                  </div>

                  {/* Sekolah/Lokasi */}
                  <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider flex items-center gap-2 mb-1 opacity-70">
                     <MdSchool size={16} /> Lokasi / Sekolah Terkait
                  </label>
                  <input
                     type="text"
                     className="input w-full h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-base-content px-5 placeholder:font-normal"
                     placeholder="Contoh: SD Negeri 1..."
                     value={formData.asal_sekolah}
                     onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                  />
                  </div>

                  {/* Kategori Laporan */}
                  <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider flex items-center gap-2 mb-1 opacity-70">
                     <MdReport size={16} /> Kategori Laporan
                  </label>
                  <select
                     className="select w-full h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-bold text-base-content px-5"
                     value={formData.kategori}
                     onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  >
                     <option value="umum">Umum</option>
                     <option value="kualitas_makanan">Kualitas Makanan</option>
                     <option value="distribusi">Distribusi / Pengiriman</option>
                     <option value="kebersihan">Kebersihan</option>
                     <option value="lainnya">Lainnya</option>
                  </select>
                  </div>

                  {/* Laporan */}
                  <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider flex items-center gap-2 mb-1 opacity-70">
                     <MdDescription size={16} /> Detail Laporan
                  </label>
                  <textarea
                     className="textarea w-full min-h-[150px] rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-base-content p-5 text-lg leading-relaxed placeholder:font-normal"
                     placeholder="Ceritakan keluhan atau masukan Anda secara detail..."
                     value={formData.isi_laporan}
                     onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
                  />
                  </div>

                  {/* Image Upload */}
                  <div className="form-control">
                     <label className="label font-bold text-base-content text-xs uppercase tracking-wider flex items-center gap-2 mb-1 opacity-70">
                       <MdImage size={16} /> Foto Bukti (Opsional)
                     </label>
                     
                     {!imagePreview ? (
                       <div 
                         className="border-2 border-dashed border-base-300 rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                         onClick={() => fileInputRef.current?.click()}
                       >
                         <div className="w-16 h-16 bg-base-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <MdImage size={32} className="text-muted-themed group-hover:text-primary transition-colors" />
                         </div>
                         <p className="font-bold text-base-content">Klik untuk upload gambar</p>
                         <p className="text-xs text-muted-themed mt-1">JPG, PNG, atau WebP (Max 5MB)</p>
                       </div>
                     ) : (
                       <div className="relative group">
                         <img 
                           src={imagePreview} 
                           alt="Preview" 
                           className="w-full max-h-80 object-cover rounded-2xl shadow-sm"
                         />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <button
                                type="button"
                                onClick={removeImage}
                                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                            >
                                <MdClose size={24} />
                            </button>
                         </div>
                       </div>
                     )}
                     
                     <input
                       ref={fileInputRef}
                       type="file"
                       accept="image/jpeg,image/png,image/webp"
                       onChange={handleImageSelect}
                       className="hidden"
                     />
                  </div>
               </div>

               {/* Error Message */}
               {error && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-error/5 border border-error/20 text-error px-4 py-3 rounded-xl font-medium text-sm flex items-start gap-2"
                  >
                     <span>⚠️</span>
                     <span>{error}</span>
                  </motion.div>
               )}

               {/* Submit Button */}
               <button 
                  type="submit" 
                  disabled={submitting || uploadingImage}
                  className="w-full btn bg-black hover:bg-neutral-800 text-white border-none h-16 rounded-2xl text-xl font-bold shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
               >
                  {submitting || uploadingImage ? (
                     <>
                       <span className="loading loading-spinner text-white"></span>
                       {uploadingImage ? 'Mengupload gambar...' : 'Mengirim...'}
                     </>
                  ) : (
                     <>
                        <MdSend /> KIRIM PENGADUAN
                     </>
                  )}
               </button>
            </form>
         </motion.div>
      </div>
    </div>
  );
}
