import { MdReport, MdCampaign, MdCheck } from 'react-icons/md';
import { useUserReport } from '../../hooks/useUserReport';
import UserReportForm from '../../components/UserLaporan/UserReportForm';
import MyReportList from '../../components/UserLaporan/MyReportList';

export default function UserLaporan() {
  const {
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
  } = useUserReport();

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-base-100 rounded-[2.5rem] border border-neutral/20 shadow-soft-lg animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce">
          <MdCheck className="text-5xl" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Laporan Diterima!</h1>
        <div className="bg-yellow-50 border border-yellow-200 px-6 py-3 rounded-xl mb-6 transform -rotate-2 shadow-sm">
             <p className="text-xs uppercase font-bold text-yellow-600 mb-1 tracking-widest">Tiket Laporan</p>
             <p className="text-3xl font-display font-bold tracking-widest text-base-content">#{ticketId}</p>
        </div>
        <p className="text-lg text-muted-themed font-medium mb-8 max-w-md leading-relaxed">
          Terima kasih atas laporanmu. Tim kami akan segera meninjau dan menindaklanjuti.
        </p>
        <button 
          className="btn btn-primary h-12 px-8 shadow-soft hover:shadow-soft-lg font-bold text-lg hover:-translate-y-1 transition-all rounded-xl text-white"
          onClick={resetSuccess}
        >
          Buat Laporan Baru
        </button>
      </div>
    );
  }

  // Check if restricted role (admin/petugas) - assuming logic from original file
  const isRestrictedRole = user?.role === 'admin' || user?.role === 'petugas gizi' || user?.role === 'petugas pengaduan';

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary to-accent/30 text-base-content p-8 rounded-[2.5rem] border border-neutral/10 shadow-soft overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <MdCampaign size={180} />
         </div>
         <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md text-base-content font-bold px-4 py-1 rounded-full text-xs uppercase mb-3 transform -rotate-1 shadow-sm border border-white/40">
               <MdReport className="text-primary" /> Suara Siswa
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 tracking-tight">Kotak Saran & Laporan</h1>
            <p className="font-medium text-lg opacity-80 max-w-xl">Punya keluhan soal makanan? Atau saran menu baru? Tulis di sini!</p>
         </div>
      </div>

      {isRestrictedRole ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-6 rounded-2xl shadow-sm flex gap-4 items-start" role="alert">
          <div className="bg-blue-100 p-2 rounded-full">
             <MdReport className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="font-bold text-lg mb-1">Informasi Akses</p>
            <p className="leading-relaxed">Anda login sebagai <span className="uppercase font-black badge badge-sm badge-info">{user.role}</span>. Formulir pelaporan hanya tersedia untuk akun User (Siswa/Guru).</p>
          </div>
        </div>
      ) : (
        <UserReportForm
          user={user}
          menus={menus}
          onSubmit={async (data) => {
             if (!data.nama_pelapor || !data.asal_sekolah || !data.isi_laporan) {
               setError('Semua field harus diisi');
               return false;
             }
             return submitReport(data);
          }}
          submitting={loading} 
          uploadingImage={uploadingImage}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          onRemoveImage={removeImage}
          error={error}
        />
      )}

      {/* Reports List */}
      <MyReportList reports={myReports} />
    </div>
  );
}
