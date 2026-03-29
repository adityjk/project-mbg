import React, { useState } from 'react';
import type { Report } from '../../types';

interface ReportFormProps {
  onSubmit: (data: any) => Promise<boolean>;
  onCancel: () => void;
  submitting?: boolean;
}

export default function ReportForm({ onSubmit, onCancel, submitting = false }: ReportFormProps) {
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    kategori: 'umum'
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pelapor || !formData.asal_sekolah || !formData.isi_laporan) {
      setError('Semua field harus diisi');
      return;
    }
    setError(null);
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ nama_pelapor: '', asal_sekolah: '', isi_laporan: '' });
    }
  };

  return (
    <div className="bg-secondary/10 p-6 md:p-8 rounded-[2.5rem] border-2 border-neutral border-dashed animate-in fade-in slide-in-from-top-5">
      <div className="bg-base-100 p-6 rounded-3xl border-2 border-neutral shadow-neo max-w-2xl mx-auto relative">
         <h2 className="text-xl font-black mb-6 text-center text-base-content">📝 FORMULIR PENGADUAN</h2>
         {error && <div className="alert alert-error mb-4">{error}</div>}
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="form-control">
               <label className="label font-bold text-sm text-base-content">Nama Pelapor</label>
               <input
                 type="text"
                 className="input input-bordered border-2 border-neutral rounded-xl focus:shadow-neo-sm focus:outline-none bg-base-100 text-base-content"
                 placeholder="John Doe"
                 value={formData.nama_pelapor}
                 onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                 disabled={submitting}
               />
             </div>
             <div className="form-control">
               <label className="label font-bold text-sm text-base-content">Asal Sekolah</label>
               <input
                 type="text"
                 className="input input-bordered border-2 border-neutral rounded-xl focus:shadow-neo-sm focus:outline-none bg-base-100 text-base-content"
                 placeholder="SDN 1 Contoh"
                 value={formData.asal_sekolah}
                 onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                 disabled={submitting}
               />
             </div>
           </div>
            <div className="form-control">
             <label className="label font-bold text-sm text-base-content">Kategori Laporan</label>
             <select
               className="select select-bordered border-2 border-neutral rounded-xl focus:shadow-neo-sm focus:outline-none bg-base-100 text-base-content"
               value={formData.kategori}
               onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
               disabled={submitting}
             >
               <option value="umum">Umum</option>
               <option value="kualitas_makanan">Kualitas Makanan</option>
               <option value="distribusi">Distribusi / Porsi</option>
               <option value="kebersihan">Kebersihan</option>
               <option value="lainnya">Lainnya</option>
             </select>
           </div>
           <div className="form-control">
             <label className="label font-bold text-sm text-base-content">Isi Laporan / Keluhan</label>
             <textarea
               className="textarea textarea-bordered border-2 border-neutral rounded-xl focus:shadow-neo-sm focus:outline-none h-32 bg-base-100 text-base-content"
               placeholder="Jelaskan detail laporan..."
               value={formData.isi_laporan}
               onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
               disabled={submitting}
             />
           </div>
           <div className="flex gap-2">
            <button 
                  type="button" 
                  onClick={onCancel}
                  disabled={submitting}
                  className="flex-1 btn btn-ghost border-2 border-neutral rounded-xl font-bold h-12 mt-4"
                >
                  BATAL
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 btn btn-primary border-2 border-neutral shadow-neo-sm hover:shadow-none rounded-xl font-bold h-12 mt-4 text-base-100"
            >
              {submitting ? 'MENGIRIM...' : 'KIRIM LAPORAN'}
            </button>
           </div>
         </form>
      </div>
    </div>
  );
}
