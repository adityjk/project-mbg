import { useEffect, useState } from 'react';
import { MdReport, MdCheck, MdClose, MdPending, MdDelete, MdSend } from 'react-icons/md';
import { reportApi } from '../services/api';
import type { Report } from '../types';

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

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus laporan ini?')) return;
    
    try {
      await reportApi.delete(id);
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
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

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending': return <MdPending style={{ color: 'var(--warning)' }} />;
      case 'diterima': return <MdCheck style={{ color: 'var(--success)' }} />;
      case 'ditolak': return <MdClose style={{ color: 'var(--error)' }} />;
    }
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">
            <MdReport style={{ color: 'var(--secondary)' }} />
            Laporan
          </h1>
          <p className="page-subtitle">Kelola laporan dari siswa dan guru</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : 'Buat Laporan'}
        </button>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Form Laporan Baru</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nama Pelapor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama_pelapor}
                  onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Asal Sekolah</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Masukkan nama sekolah"
                  value={formData.asal_sekolah}
                  onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Isi Laporan</label>
              <textarea
                className="form-input form-textarea"
                placeholder="Tuliskan laporan atau keluhan Anda..."
                value={formData.isi_laporan}
                onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <MdSend />
                  Kirim Laporan
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <MdReport className="empty-icon" />
            <p className="empty-title">Belum ada laporan</p>
            <p className="empty-text">Semua laporan dari siswa akan muncul di sini</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reports.map((report) => (
            <div key={report.id} className={`report-card ${report.status}`}>
              <div className="report-header">
                <div>
                  <div className="report-user">{report.nama_pelapor}</div>
                  <div className="report-school">{report.asal_sekolah}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`status-badge status-${report.status}`}>
                    {getStatusIcon(report.status)}
                    <span style={{ marginLeft: '4px' }}>
                      {report.status === 'pending' ? 'Menunggu' : 
                       report.status === 'diterima' ? 'Diterima' : 'Ditolak'}
                    </span>
                  </span>
                </div>
              </div>
              
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {report.isi_laporan}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #E8F0E8'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {formatDate(report.created_at)}
                </span>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {report.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleStatusChange(report.id, 'diterima')}
                      >
                        <MdCheck /> Terima
                      </button>
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleStatusChange(report.id, 'ditolak')}
                        style={{ borderColor: 'var(--error)', color: 'var(--error)' }}
                      >
                        <MdClose /> Tolak
                      </button>
                    </>
                  )}
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(report.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      {error && (
        <div className="toast toast-error">
          <span style={{ color: 'var(--error)' }}>⚠</span>
          {error}
        </div>
      )}
      {success && (
        <div className="toast toast-success">
          <MdCheck style={{ color: 'var(--success)' }} />
          {success}
        </div>
      )}
    </div>
  );
}
