import { useEffect, useState } from 'react';
import { MdCheck, MdClose, MdPending, MdDelete, MdCampaign, MdSchool, MdPerson } from 'react-icons/md';
import { reportApi } from '../services/api';
import type { Report } from '../types';
import { useConfirmDialog } from '../components/ConfirmDialog';

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: ''
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showConfirm, DialogComponent } = useConfirmDialog();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportApi.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
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
      await reportApi.create(formData);
      setSuccess('Laporan berhasil dikirim!');
      setFormData({ nama_pelapor: '', asal_sekolah: '', isi_laporan: '' });
      setShowForm(false);
      fetchReports();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Gagal mengirim laporan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: number, status: Report['status']) => {
    try {
      await reportApi.updateStatus(id, status);
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = (id: number) => {
    showConfirm({
      title: 'Hapus Laporan',
      message: 'Apakah kamu yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: async () => {
        try {
          await reportApi.delete(id);
          setReports(prev => prev.filter(r => r.id !== id));
          setSuccess('Laporan berhasil dihapus!');
          setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
          console.error('Failed to delete report:', error);
          setError('Gagal menghapus laporan');
          setTimeout(() => setError(null), 3000);
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'pending': 
         return (
            <div className="bg-warning/20 text-warning border-2 border-warning px-3 py-1 rounded-full font-black text-xs uppercase flex items-center gap-1">
               <MdPending /> MENUNGGU
            </div>
         );
      case 'diterima': 
         return (
            <div className="bg-success/20 text-success border-2 border-success px-3 py-1 rounded-full font-black text-xs uppercase flex items-center gap-1 transform -rotate-2">
               <MdCheck /> DITERIMA
            </div>
         );
      case 'ditolak': 
         return (
            <div className="bg-error/20 text-error border-2 border-error px-3 py-1 rounded-full font-black text-xs uppercase flex items-center gap-1 transform rotate-2">
               <MdClose /> DITOLAK
            </div>
         );
    }
  };

  if (loading) {
    return (
       <div className="flex justify-center items-center h-[50vh]">
         <div className="loading loading-bars loading-lg text-primary"></div>
       </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-base-100 p-6 rounded-[2rem] border-2 border-neutral shadow-neo">
        <div>
           <div className="inline-flex items-center gap-2 bg-error/10 text-error font-bold px-3 py-1 rounded-full text-xs uppercase mb-2 border border-error/20">
             <MdCampaign /> Suara Komunitas
           </div>
          <h1 className="text-3xl md:text-4xl font-black text-base-content">
             LAPORAN & ADUAN
          </h1>
          <p className="text-muted-themed font-medium mt-1">Daftar laporan masuk dari siswa, guru, dan masyarakat.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className={`btn h-12 px-6 rounded-xl border-2 border-neutral shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold flex items-center gap-2 ${showForm ? 'bg-base-300 text-base-content' : 'btn-secondary text-neutral'}`}
        >
          {showForm ? <MdClose size={20} /> : <MdCampaign size={20} />}
          {showForm ? 'BATAL' : 'BUAT LAPORAN'}
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-secondary/10 p-6 md:p-8 rounded-[2.5rem] border-2 border-neutral border-dashed animate-in fade-in slide-in-from-top-5">
          <div className="bg-base-100 p-6 rounded-3xl border-2 border-neutral shadow-neo max-w-2xl mx-auto relative">
             <h2 className="text-xl font-black mb-6 text-center text-base-content">📝 FORMULIR PENGADUAN</h2>
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
                   />
                 </div>
               </div>
               <div className="form-control">
                 <label className="label font-bold text-sm text-base-content">Isi Laporan / Keluhan</label>
                 <textarea
                   className="textarea textarea-bordered border-2 border-neutral rounded-xl focus:shadow-neo-sm focus:outline-none h-32 bg-base-100 text-base-content"
                   placeholder="Jelaskan detail laporan..."
                   value={formData.isi_laporan}
                   onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
                 />
               </div>
               <button 
                 type="submit" 
                 disabled={submitting}
                 className="w-full btn btn-primary border-2 border-neutral shadow-neo-sm hover:shadow-none rounded-xl font-bold h-12 mt-4 text-base-100"
               >
                 {submitting ? 'MENGIRIM...' : 'KIRIM LAPORAN SEKARANG'}
               </button>
             </form>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="grid grid-cols-1 gap-4">
        {reports.length === 0 ? (
          <div className="text-center py-20">
             <div className="text-6xl mb-4">📭</div>
             <p className="font-bold text-muted-themed">TIDAK ADA LAPORAN MASUK</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-base-100 rounded-2xl border-2 border-neutral p-0 overflow-hidden hover:shadow-neo transition-shadow">
               <div className="flex flex-col md:flex-row">
                  {/* Left: Meta Info */}
                  <div className="bg-base-200 border-b-2 md:border-b-0 md:border-r-2 border-neutral p-4 w-full md:w-64 flex-shrink-0 flex flex-col gap-3">
                     <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-base-100 flex items-center justify-center font-bold text-xs">
                          <MdPerson />
                        </div>
                        <div className="font-bold text-sm truncate text-base-content">{report.nama_pelapor}</div>
                     </div>
                     <div className="flex items-center gap-2 text-muted-themed">
                        <div className="w-8 h-8 rounded-full bg-base-100 border border-neutral flex items-center justify-center font-bold text-xs">
                          <MdSchool />
                        </div>
                        <div className="text-xs font-mono font-bold truncate">{report.asal_sekolah}</div>
                     </div>
                     <div className="mt-auto pt-2 border-t border-base-300 text-[10px] font-mono text-muted-themed">
                        {formatDate(report.created_at)}
                     </div>
                  </div>

                  {/* Right: Content & Actions */}
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-muted-themed text-xs tracking-widest mb-1">ISI LAPORAN:</div>
                        {getStatusBadge(report.status)}
                     </div>
                     
                     <p className="text-lg font-medium leading-relaxed mb-6 font-handwriting text-base-content">
                        "{report.isi_laporan}"
                     </p>

                     <div className="mt-auto flex justify-end gap-2 border-t border-base-200 pt-4">
                        {report.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(report.id, 'diterima')}
                              className="btn btn-sm bg-success/20 text-success border border-success hover:bg-success hover:text-base-100"
                            >
                              <MdCheck /> TERIMA
                            </button>
                            <button 
                              onClick={() => handleStatusChange(report.id, 'ditolak')}
                              className="btn btn-sm bg-error/20 text-error border border-error hover:bg-error hover:text-base-100"
                            >
                              <MdClose /> TOLAK
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(report.id)}
                          className="btn btn-sm btn-ghost text-error hover:bg-error/10 ml-2"
                        >
                          <MdDelete size={18} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Toast Notifications */}
      {success && (
        <div className="fixed bottom-8 right-8 bg-success text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdCheck className="text-base-100" size={24} /> {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 bg-error text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdClose className="text-base-100" size={24} /> {error}
        </div>
      )}

      {/* Confirm Dialog */}
      {DialogComponent}
    </div>
  );
}
