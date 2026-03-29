import React, { useState, useEffect } from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import type { Report } from '../../types';

interface ProgressModalProps {
  report: Report;
  action: Report['status'];
  onClose: () => void;
  onSubmit: (id: number, status: Report['status'], note: string) => Promise<void>;
}

export default function ProgressModal({ report, action, onClose, onSubmit }: ProgressModalProps) {
  const [progressNote, setProgressNote] = useState(report.progress || '');

  const handleSubmit = async () => {
    await onSubmit(report.id, action, progressNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-3xl border-2 border-neutral shadow-neo max-w-md w-full animate-in zoom-in-95">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-black text-base-content">
                {action === 'diterima' ? 'Terima Laporan' : 
                 action === 'ditolak' ? 'Tolak Laporan' : 'Edit Progress'}
              </h2>
              <p className="text-sm text-muted-themed">Dari: {report.nama_pelapor}</p>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <MdClose size={20} />
            </button>
          </div>

          <div className="form-control">
            <label className="label font-bold text-sm">Catatan Progress (opsional)</label>
            <textarea
              className="textarea textarea-bordered border-2 border-neutral rounded-xl h-28"
              placeholder="Tambahkan catatan penanganan laporan..."
              value={progressNote}
              onChange={(e) => setProgressNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              onClick={onClose}
              className="btn flex-1 btn-ghost border-2 border-neutral rounded-xl"
            >
              Batal
            </button>
            <button 
              onClick={handleSubmit}
              className={`btn flex-1 border-2 border-neutral shadow-neo-sm rounded-xl ${
                action === 'diterima' ? 'btn-success' :
                action === 'ditolak' ? 'btn-error' : 'btn-primary'
              }`}
            >
              {action === 'diterima' ? <><MdCheck size={18} /> Terima</> :
               action === 'ditolak' ? <><MdClose size={18} /> Tolak</> : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
