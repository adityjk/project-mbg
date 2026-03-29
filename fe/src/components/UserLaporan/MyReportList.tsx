import { MdDescription } from 'react-icons/md';
import type { Report } from '../../types';

interface MyReportListProps {
  reports: Report[];
}

export default function MyReportList({ reports }: MyReportListProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-base-content border-b border-neutral/10 pb-2">
        <MdDescription className="text-primary" /> Riwayat Laporan Saya
      </h2>
      
      {reports.length === 0 ? (
        <div className="text-center p-8 bg-base-50 rounded-2xl border border-dashed border-neutral/30">
          <p className="text-muted-themed font-medium">Belum ada riwayat laporan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-2xl border border-neutral/20 shadow-sm hover:shadow-soft transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className={`badge border-0 ${
                    report.kategori === 'kualitas_makanan' ? 'bg-warning/10 text-warning-content' :
                    report.kategori === 'distribusi' ? 'bg-info/10 text-info-content' :
                    report.kategori === 'kebersihan' ? 'bg-error/10 text-error-content' :
                    'bg-base-200 text-base-content'
                  } font-bold text-xs uppercase tracking-wider`}>
                    {report.kategori ? report.kategori.replace('_', ' ') : 'UMUM'}
                  </span>
                  <span className="text-xs text-muted-themed font-medium">
                    {new Date(report.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
                <span className={`badge ${
                  report.status === 'diterima' ? 'bg-success/10 text-success' : 
                  report.status === 'ditolak' ? 'bg-error/10 text-error' : 
                  'bg-warning/10 text-warning'
                } font-bold border-0 text-xs uppercase`}>
                  {report.status}
                </span>
              </div>
              <p className="font-medium text-base-content leading-relaxed mb-1">"{report.isi_laporan}"</p>
              {report.progress && (
                <div className="mt-3 bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-sm text-blue-800">
                  <span className="font-bold flex items-center gap-1 mb-1 text-xs uppercase tracking-wider text-blue-600">
                     Respon Admin
                  </span>
                  {report.progress}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
