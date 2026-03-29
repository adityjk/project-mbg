import React from 'react';
import { MdCheck, MdClose, MdPending, MdPerson, MdSchool, MdNotes, MdEdit, MdDelete } from 'react-icons/md';
import type { Report } from '../../types';

interface ReportItemProps {
  report: Report;
  onStatusAction: (report: Report, action: Report['status']) => void;
  onDelete: (id: number) => void;
}

export default function ReportItem({ report, onStatusAction, onDelete }: ReportItemProps) {
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

  return (
    <div className="bg-base-100 rounded-2xl border-2 border-base-content/20 p-0 overflow-hidden hover:shadow-neo transition-shadow">
       <div className="flex flex-col md:flex-row">
          {/* Left: Meta Info */}
          <div className="bg-base-200 border-b-2 md:border-b-0 md:border-r-2 border-base-content/20 p-4 w-full md:w-64 flex-shrink-0 flex flex-col gap-3">
             {/* Ticket Number */}
             <div className="bg-primary/10 border-2 border-primary px-3 py-1.5 rounded-lg mb-1">
               <div className="font-mono font-black text-primary text-sm tracking-wider">
                 {report.ticket_number}
               </div>
             </div>
             
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-base-100 flex items-center justify-center font-bold text-xs">
                  <MdPerson />
                </div>
                <div className="font-bold text-sm truncate text-base-content">{report.nama_pelapor}</div>
             </div>
             <div className="flex items-center gap-2 text-base-content/70">
                <div className="w-8 h-8 rounded-full bg-base-100 border border-base-content/20 flex items-center justify-center font-bold text-xs">
                  <MdSchool />
                </div>
                <div className="text-xs font-mono font-bold truncate">{report.asal_sekolah}</div>
             </div>
             <div className="mt-auto pt-2 border-t border-base-content/10 text-[10px] font-mono text-base-content/60">
                {formatDate(report.created_at)}
             </div>
          </div>

          {/* Right: Content & Actions */}
          <div className="p-4 md:p-6 flex-1 flex flex-col">
             <div className="flex justify-between items-start mb-4">
                <div className="font-bold text-base-content/50 text-xs tracking-widest mb-1">ISI LAPORAN:</div>
                {getStatusBadge(report.status)}
             </div>
             
             <p className="text-lg font-medium leading-relaxed mb-4 font-handwriting text-base-content">
                "{report.isi_laporan}"
             </p>

             {/* Progress Notes */}
             {report.progress && (
               <div className="bg-info/10 border border-info/30 rounded-xl p-3 mb-4">
                 <div className="flex items-center gap-2 text-info font-bold text-xs mb-1">
                   <MdNotes size={14} /> CATATAN PROGRESS
                 </div>
                 <p className="text-sm text-base-content">{report.progress}</p>
               </div>
             )}

             {/* Kategori Badge */}
             {report.kategori && report.kategori !== 'umum' && (
               <div className="mb-4">
                 <span className={`badge badge-sm font-bold ${
                   report.kategori === 'kualitas_makanan' ? 'badge-warning' :
                   report.kategori === 'distribusi' ? 'badge-info' :
                   report.kategori === 'kebersihan' ? 'badge-error' :
                   'badge-ghost'
                 }`}>
                   {report.kategori.replace('_', ' ').toUpperCase()}
                 </span>
               </div>
             )}

             <div className="mt-auto flex justify-end gap-2 border-t border-base-content/10 pt-4">
                {report.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onStatusAction(report, 'diterima')}
                      className="btn btn-sm bg-success/20 text-success border border-success hover:bg-success hover:text-base-100"
                    >
                      <MdCheck /> TERIMA
                    </button>
                    <button 
                      onClick={() => onStatusAction(report, 'ditolak')}
                      className="btn btn-sm bg-error/20 text-error border border-error hover:bg-error hover:text-base-100"
                    >
                      <MdClose /> TOLAK
                    </button>
                  </>
                )}
                {report.status !== 'pending' && (
                  <button 
                    onClick={() => onStatusAction(report, report.status)}
                    className="btn btn-sm btn-ghost text-primary hover:bg-primary/10"
                  >
                    <MdEdit size={16} /> Edit Progress
                  </button>
                )}
                <button 
                  onClick={() => onDelete(report.id)}
                  className="btn btn-sm btn-ghost text-error hover:bg-error/10 ml-2"
                >
                  <MdDelete size={18} />
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
