import React from 'react';
import type { Report } from '../../types';
import ReportItem from './ReportItem';

interface ReportListProps {
  reports: Report[];
  activeTab: 'pending' | 'history';
  onStatusAction: (report: Report, action: Report['status']) => void;
  onDelete: (id: number) => void;
}

export default function ReportList({ reports, activeTab, onStatusAction, onDelete }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-20">
         <div className="text-6xl mb-4">📭</div>
         <p className="font-bold text-muted-themed">
           {activeTab === 'pending' ? 'TIDAK ADA LAPORAN MASUK' : 'BELUM ADA RIWAYAT LAPORAN'}
         </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reports.map((report) => (
        <ReportItem 
          key={report.id} 
          report={report} 
          onStatusAction={onStatusAction} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
}
