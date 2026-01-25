import { useState, useEffect, useRef } from 'react';
import { MdReport, MdSend, MdCheck, MdPerson, MdSchool, MdDescription, MdRestaurantMenu, MdCampaign, MdImage, MdClose } from 'react-icons/md';
import { reportApi, menuApi } from '../../services/api';
import { compressImage, isValidImage, getImagePreviewUrl, revokeImagePreviewUrl } from '../../utils/imageUtils';

interface Menu {
  id: number;
  nama_menu: string;
}

export default function UserLaporan() {
  const [user, setUser] = useState<any>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    menu_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        setFormData(prev => ({
            ...prev,
            nama_pelapor: u.username || '', 
            asal_sekolah: u.school_name || ''
        }));
    }
    fetchMenus();
  }, []);

  // Cleanup image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreviewUrl(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchMenus = async () => {
    try {
        const res = await menuApi.getAll();
        setMenus(res.data);
    } catch (err) {
        console.error("Gagal load menu");
    }
  };

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
          setError('Gagal upload gambar. Laporan akan dikirim tanpa gambar.');
        } finally {
          setUploadingImage(false);
        }
      }

      const res = await reportApi.create({
          ...formData,
          menu_id: formData.menu_id ? parseInt(formData.menu_id) : undefined,
          foto_bukti
      });
      setSuccess(true);
      setTicketId(res.data.id);
      setFormData({ 
          nama_pelapor: user?.username || '', 
          asal_sekolah: user?.school_name || '', 
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-[2.5rem] border-2 border-black shadow-neo animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-green-400 rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm animate-bounce">
          <MdCheck className="text-5xl text-black" />
        </div>
        <h1 className="text-3xl font-black mb-2">LAPORAN DITERIMA!</h1>
        <div className="bg-yellow-100 border-2 border-black border-dashed px-6 py-3 rounded-xl mb-6 transform -rotate-2">
             <p className="text-xs uppercase font-bold text-gray-500 mb-1">Tiket Laporan</p>
             <p className="text-3xl font-black tracking-widest text-black">#{ticketId}</p>
        </div>
        <p className="text-lg text-gray-500 font-medium mb-8 max-w-md">
          Terima kasih atas laporanmu. Tim kami akan segera meninjau dan menindaklanjuti.
        </p>
        <button 
          className="btn btn-primary h-12 px-8 text-black border-2 border-black shadow-neo font-bold text-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          onClick={() => setSuccess(false)}
        >
          BUAT LAPORAN BARU
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="bg-secondary text-black p-8 rounded-[2.5rem] border-2 border-black shadow-neo overflow-hidden relative">
         <div className="absolute top-0 right-0 p-4 opacity-10">
            <MdCampaign size={150} />
         </div>
         <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-black text-secondary font-black px-4 py-1 rounded-full text-xs uppercase mb-3 transform -rotate-1">
               <MdReport /> Suara Siswa
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">KOTAK SARAN & LAPORAN</h1>
            <p className="font-bold text-lg opacity-80">Punya keluhan soal makanan? Atau saran menu baru? Tulis di sini!</p>
         </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-neo p-6 md:p-8 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2 border-b-2 border-black pb-4">
           📝 ISI FORMULIR
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Nama */}
             <div className="form-control">
               <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                 <MdPerson size={18} /> Nama Lengkap
               </label>
               <input
                 type="text"
                 className="input border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal"
                 placeholder="Masukkan nama lengkap kamu"
                 value={formData.nama_pelapor}
                 onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                 readOnly={!!user} 
               />
             </div>

             {/* Sekolah */}
             <div className="form-control">
               <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
                 <MdSchool size={18} /> Asal Sekolah
               </label>
               <input
                 type="text"
                 className="input border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal"
                 placeholder="Contoh: SMP Negeri 1 Semarang"
                 value={formData.asal_sekolah}
                 onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                 readOnly={!!user}
               />
             </div>
          </div>

          {/* Menu Selection */}
          <div className="form-control">
             <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
               <div className="bg-primary text-white p-1 rounded border border-black"><MdRestaurantMenu /></div>
               Terkait Menu (Opsional)
             </label>
             <select
               className="select border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all"
               value={formData.menu_id}
               onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
             >
                 <option value="">-- Pilih Menu (Jika ada keluhan spesifik) --</option>
                 {menus.map(menu => (
                     <option key={menu.id} value={menu.id}>
                         {menu.nama_menu}
                     </option>
                 ))}
             </select>
          </div>

          {/* Laporan */}
          <div className="form-control">
             <label className="label font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
               <MdDescription size={18} /> Isi Laporan
             </label>
             <textarea
               className="textarea border-2 border-black rounded-xl min-h-[150px] font-medium text-lg leading-relaxed focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal placeholder:opacity-50"
               placeholder="Ceritakan detail keluhan atau masukanmu di sini..."
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
                  <MdSend /> KIRIM LAPORAN
               </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-bold text-gray-400 mt-6 uppercase tracking-widest">
           Laporanmu aman & akan ditinjau oleh tim MBG
        </p>
      </div>
    </div>
  );
}
