import React, { useState, useEffect, useRef } from 'react';
import { MdPerson, MdSchool, MdDescription, MdRestaurantMenu, MdImage, MdSend, MdClose, MdEditDocument } from 'react-icons/md';
import type { Menu } from '../../types';

interface UserReportFormProps {
  user: any;
  menus: Menu[];
  onSubmit: (data: any) => Promise<boolean>;
  submitting: boolean;
  uploadingImage: boolean;
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
  onRemoveImage: () => void;
  error: string | null;
}

export default function UserReportForm({
  user,
  menus,
  onSubmit,
  submitting,
  uploadingImage,
  imagePreview,
  onImageSelect,
  onRemoveImage,
  error
}: UserReportFormProps) {
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    menu_id: '',
    kategori: 'umum'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nama_pelapor: user.username || '',
        asal_sekolah: user.school_name || '',
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pelapor || !formData.asal_sekolah || !formData.isi_laporan) {
       // Let parent handle or local validation? 
       // For now, let's just trigger submit and let parent or logic handle.
    }
    const success = await onSubmit(formData);
    if (success) {
      setFormData(prev => ({ ...prev, isi_laporan: '', menu_id: '', kategori: 'umum' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral/20 shadow-soft p-6 md:p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 border-b border-neutral/10 pb-4 text-base-content">
         <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MdEditDocument size={24} />
         </div>
         Isi Formulir Laporan
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Nama */}
           <div className="form-control">
             <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
               <MdPerson size={16} /> Nama Lengkap
             </label>
             <input
               type="text"
               className="input border border-neutral/30 rounded-xl h-12 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-themed/50 bg-base-50"
               placeholder="Masukkan nama lengkap kamu"
               value={formData.nama_pelapor}
               onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
               readOnly={!!user} 
             />
           </div>

           {/* Sekolah */}
           <div className="form-control">
             <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
               <MdSchool size={16} /> Asal Sekolah
             </label>
             <input
               type="text"
               className="input border border-neutral/30 rounded-xl h-12 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-themed/50 bg-base-50"
               placeholder="Contoh: SMP Negeri 1 Semarang"
               value={formData.asal_sekolah}
               onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
               readOnly={!!user}
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Kategori */}
           <div className="form-control">
             <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
               <MdDescription size={16} /> Kategori Laporan
             </label>
             <select
               className="select border border-neutral/30 rounded-xl h-12 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-base-50"
               value={formData.kategori}
               onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
             >
               <option value="umum">Umum</option>
               <option value="kualitas_makanan">Kualitas Makanan</option>
               <option value="distribusi">Distribusi / Porsi</option>
               <option value="kebersihan">Kebersihan</option>
               <option value="lainnya">Lainnya</option>
             </select>
           </div>

           {/* Menu Selection */}
           <div className="form-control">
              <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
                <MdRestaurantMenu size={16} /> Terkait Menu (Opsional)
              </label>
              <select
                className="select border border-neutral/30 rounded-xl h-12 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-base-50"
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
        </div>

        {/* Laporan */}
        <div className="form-control">
           <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
             <MdDescription size={16} /> Isi Laporan
           </label>
           <textarea
             className="textarea border border-neutral/30 rounded-xl min-h-[150px] font-medium text-base leading-relaxed focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-themed/50 bg-base-50"
             placeholder="Ceritakan detail keluhan atau masukanmu di sini..."
             value={formData.isi_laporan}
             onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
           />
        </div>

        {/* Image Upload */}
        <div className="form-control">
           <label className="label font-bold text-muted-themed text-xs uppercase tracking-wider flex items-center gap-2 mb-1">
             <MdImage size={16} /> Foto Bukti (Opsional)
           </label>
           
           {!imagePreview ? (
             <div 
               className="border-2 border-dashed border-neutral/20 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
               onClick={() => fileInputRef.current?.click()}
             >
               <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                   <MdImage size={32} className="text-muted-themed group-hover:text-primary transition-colors" />
               </div>
               <p className="font-bold text-base-content group-hover:text-primary transition-colors">Klik untuk upload gambar</p>
               <p className="text-xs text-muted-themed mt-1">JPG, PNG, atau WebP (Max 5MB)</p>
             </div>
           ) : (
             <div className="relative group rounded-xl overflow-hidden shadow-md">
               <img 
                 src={imagePreview} 
                 alt="Preview" 
                 className="w-full max-h-64 object-cover"
               />
               <button
                 type="button"
                 onClick={() => {
                   onRemoveImage();
                   if (fileInputRef.current) fileInputRef.current.value = '';
                 }}
                 className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-error transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
               >
                 <MdClose size={20} />
               </button>
             </div>
           )}
           
           <input
             ref={fileInputRef}
             type="file"
             accept="image/jpeg,image/png,image/webp"
             onChange={handleFileChange}
             className="hidden"
           />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-xl font-medium flex items-center gap-2 text-sm">
             <div className="w-5 h-5 rounded-full bg-error text-white flex items-center justify-center flex-shrink-0 text-xs">!</div>
             {error}
          </div>
        )}

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={submitting || uploadingImage}
          className="w-full btn btn-primary text-white border-0 h-14 rounded-xl text-lg font-bold shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          {submitting || uploadingImage ? (
             <>
               <span className="loading loading-spinner text-white"></span>
               {uploadingImage ? 'Mengupload gambar...' : 'Mengirim...'}
             </>
          ) : (
             <>
                <MdSend /> Kirim Laporan
             </>
          )}
        </button>
      </form>

      <p className="text-center text-[10px] font-bold text-muted-themed mt-6 uppercase tracking-widest opacity-60">
         Laporanmu aman & akan ditinjau oleh tim MBG
      </p>
    </div>
  );
}
