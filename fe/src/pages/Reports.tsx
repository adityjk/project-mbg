import { useState } from 'react';
import { MdCampaign, MdClose, MdSearch } from 'react-icons/md';
import { useReports } from '../hooks/useReports';
import type { Report } from '../types';
import { useConfirmDialog } from '../components/ConfirmDialog';
import ReportForm from '../components/Reports/ReportForm';
import ReportList from '../components/Reports/ReportList';
import ProgressModal from '../components/Reports/ProgressModal';

export default function Reports() {
  const { reports, loading, error, success, searchQuery, setSearchQuery, triggerSearch, clearSearch, createReport, updateStatus, deleteReport } = useReports();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [progressModal, setProgressModal] = useState<{ report: Report; action: Report['status'] } | null>(null);
  
  const { showConfirm, DialogComponent } = useConfirmDialog();

  const filteredReports = reports.filter(report => {
    if (activeTab === 'pending') return report.status === 'pending';
    if (activeTab === 'history') return report.status !== 'pending';
    return true;
  });

  const handleDelete = (id: number) => {
    showConfirm({
      title: 'Hapus Laporan',
      message: 'Apakah kamu yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: () => deleteReport(id),
    });
  };

  const openProgressModal = (report: Report, action: Report['status']) => {
    setProgressModal({ report, action });
  };

  const handleProgressSubmit = async (id: number, status: Report['status'], note: string) => {
    await updateStatus(id, status, note);
    setProgressModal(null);
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

      {success && (
        <div className="fixed bottom-8 right-8 bg-success text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 bg-error text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           {error}
        </div>
      )}

      {/* Report Form */}
      {showForm && (
        <ReportForm 
          onSubmit={async (data) => {
            const success = await createReport(data);
            if (success) setShowForm(false);
            return success;
          }} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      {/* Search Input */}
      <div className="bg-base-100 p-4 rounded-2xl border-2 border-neutral shadow-neo-sm">
        <div className="relative">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/50" size={22} />
          <input
            type="text"
            placeholder="Cari berdasarkan nomor ticket (MBG-XXXXXX), nama, sekolah, atau isi laporan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                triggerSearch();
              }
            }}
            className="input input-bordered w-full pl-12 pr-12 h-12 rounded-xl border-2 border-neutral/30 focus:border-primary focus:outline-none font-medium bg-base-100 text-base-content placeholder:text-neutral/40"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle text-neutral/50 hover:text-error"
            >
              <MdClose size={18} />
            </button>
          )}
        </div>
        {searchQuery ? (
          <div className="mt-2 text-sm text-muted-themed">
            Menampilkan hasil untuk: <span className="font-bold text-primary">"{searchQuery}"</span>
            <span className="ml-2">({reports.length} laporan ditemukan)</span>
          </div>
        ) : (
          <div className="mt-2 text-xs text-neutral/40">
            Tekan Enter untuk mencari
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b-2 border-neutral/20 pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-2 font-black uppercase text-sm tracking-widest transition-all ${
            activeTab === 'pending' 
            ? 'text-primary border-b-4 border-primary' 
            : 'text-neutral/50 hover:text-neutral'
          }`}
        >
          Laporan Masuk 
          {reports.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 bg-error text-white text-[10px] px-2 py-0.5 rounded-full">
              {reports.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-2 font-black uppercase text-sm tracking-widest transition-all ${
            activeTab === 'history' 
            ? 'text-primary border-b-4 border-primary' 
            : 'text-neutral/50 hover:text-neutral'
          }`}
        >
          Riwayat Laporan
        </button>
      </div>

      {/* Reports List */}
      <ReportList 
        reports={filteredReports} 
        activeTab={activeTab} 
        onStatusAction={openProgressModal} 
        onDelete={handleDelete} 
      />

      {/* Progress Modal */}
      {progressModal && (
        <ProgressModal 
          report={progressModal.report} 
          action={progressModal.action} 
          onClose={() => setProgressModal(null)} 
          onSubmit={handleProgressSubmit} 
        />
      )}

      {/* Confirm Dialog */}
      {DialogComponent}
    </div>
  );
}
