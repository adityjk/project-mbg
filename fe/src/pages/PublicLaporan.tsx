import { useState, useRef, useEffect } from 'react';
import { MdReport, MdSend, MdCheck, MdPerson, MdSchool, MdDescription, MdHome, MdCampaign, MdImage, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { reportApi } from '../services/api';
import { compressImage, isValidImage, getImagePreviewUrl, revokeImagePreviewUrl } from '../utils/imageUtils';

export default function PublicLaporan() {
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    menu_id: ''
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
      setTicketId(res.data.id);
      setFormData({ 
          nama_pelapor: '', 
          asal_sekolah: '', 
          isi_laporan: '',
          menu_id: ''
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
      <div className="min-h-screen bg-bg-main font-sans selection:bg-black selection:text-white flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-neo p-8 text-center max-w-lg w-full animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-green-400 rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm animate-bounce mx-auto">
            <MdCheck className="text-5xl text-black" />
          </div>
          <h1 className="text-3xl font-black mb-2">LAPORAN DITERIMA!</h1>
          <div className="bg-yellow-100 border-2 border-black border-dashed p-4 rounded-xl mb-6">
             <p className="text-xs uppercase font-bold text-gray-500 mb-1">Tiket Laporan Anda</p>
             <p className="text-4xl font-black tracking-widest text-black">#{ticketId}</p>
          </div>
          <p className="text-lg text-gray-500 font-medium mb-8">
            Simpan nomor tiket ini untuk pantauan di masa depan (Fitur tracking akan segera hadir).
          </p>
          <div className="space-y-3">
             <button 
               className="btn w-full bg-black text-white hover:bg-neutral-800 border-2 border-transparent h-12 rounded-xl font-bold"
               onClick={() => setSuccess(false)}
             >
               BUAT LAPORAN BARU
             </button>
             <Link to="/" className="btn w-full btn-ghost border-2 border-black h-12 rounded-xl font-bold">
               KEMBALI KE BERANDA
             </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main font-sans selection:bg-black selection:text-white p-4 md:p-8">
      {/* Navbar Simple */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12">
         <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-neo-sm hover:scale-105 transition-transform">
            <MdHome size={24} />
            <span className="font-bold hidden md:inline">Kembali ke Beranda</span>
         </Link>
         <div className="font-black text-xl">MBG<span className="text-primary">.GO</span></div>
      </nav>

      <div className="max-w-2xl mx-auto space-y-8">
         {/* Header */}
         <div className="bg-accent text-black p-8 rounded-[2.5rem] border-2 border-black shadow-neo overflow-hidden relative">
            <div className="absolute top-0 right-[-10px] p-4 opacity-20 transform rotate-12">
               <MdCampaign size={180} />
            </div>
            <div className="relative z-10">
               <div className="inline-flex items-center gap-2 bg-black text-accent font-black px-4 py-1 rounded-full text-xs uppercase mb-3">
                  <MdReport /> Layanan Publik
               </div>
               <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">LAYANAN PENGADUAN</h1>
               <p className="font-bold text-lg opacity-80">
                  Layanan ini terbuka untuk masyarakat umum. Identitas pelapor akan kami jaga kerahasiaannya.
               </p>
            </div>
         </div>

         {/* Form */}
         <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-neo p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-1 gap-6">
                  {/* Nama */}
                  <div className="form-control">
                  <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                     <MdPerson size={18} /> Nama Pelapor (Boleh Samaran)
                  </label>
                  <input
                     type="text"
                     className="input border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal"
                     placeholder="Nama Anda..."
                     value={formData.nama_pelapor}
                     onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                  />
                  </div>

                  {/* Sekolah/Lokasi */}
                  <div className="form-control">
                  <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                     <MdSchool size={18} /> Lokasi / Sekolah Terkait
                  </label>
                  <input
                     type="text"
                     className="input border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal"
                     placeholder="Contoh: SD Negeri 1..."
                     value={formData.asal_sekolah}
                     onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                  />
                  </div>

                  {/* Laporan */}
                  <div className="form-control">
                  <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                     <MdDescription size={18} /> Detail Laporan
                  </label>
                  <textarea
                     className="textarea border-2 border-black rounded-xl min-h-[150px] font-medium text-lg leading-relaxed focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal placeholder:opacity-50"
                     placeholder="Ceritakan keluhan atau masukan Anda secara detail..."
                     value={formData.isi_laporan}
                     onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
                  />
                  </div>

                  {/* Image Upload */}
                  <div className="form-control">
                     <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                       <MdImage size={18} /> Foto Bukti (Opsional)
                     </label>
                     
                     {!imagePreview ? (
                       <div 
                         className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                         onClick={() => fileInputRef.current?.click()}
                       >
                         <MdImage size={48} className="mx-auto text-gray-400 mb-2" />
                         <p className="font-bold text-gray-500">Klik untuk upload gambar</p>
                         <p className="text-sm text-gray-400">JPG, PNG, atau WebP (Max 5MB)</p>
                       </div>
                     ) : (
                       <div className="relative">
                         <img 
                           src={imagePreview} 
                           alt="Preview" 
                           className="w-full max-h-64 object-cover rounded-xl border-2 border-black"
                         />
                         <button
                           type="button"
                           onClick={removeImage}
                           className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                         >
                           <MdClose size={20} />
                         </button>
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
                  <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                     ⚠️ {error}
                  </div>
               )}

               {/* Submit Button */}
               <button 
                  type="submit" 
                  disabled={submitting || uploadingImage}
                  className="w-full btn bg-black text-white hover:bg-neutral-800 border-2 border-transparent h-14 rounded-xl text-lg font-black shadow-neo-sm hover:shadow-none hover:scale-[0.99] transition-all flex items-center justify-center gap-2"
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
         </div>
      </div>
    </div>
  );
}
