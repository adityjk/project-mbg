import { useState, useEffect, useCallback, useRef } from 'react';
import { reportApi } from '../services/api';
import type { Report } from '../types';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
    };
  }, []);

  const showSuccess = useCallback((msg: string) => {
    setSuccess(msg);
    const t = setTimeout(() => setSuccess(null), 3000);
    timerRef.current.push(t);
  }, []);

  const showError = useCallback((msg: string) => {
    setError(msg);
    const t = setTimeout(() => setError(null), 3000);
    timerRef.current.push(t);
  }, []);

  const fetchReports = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const response = await reportApi.getAll(search);
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      showError('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Debounced search - re-fetch when search query changes
  useEffect(() => {
    if (searchQuery === '') {
      // When search is cleared, refetch all reports
      fetchReports();
      return;
    }
    
    const timeoutId = setTimeout(() => {
      fetchReports(searchQuery);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchReports]);

  const createReport = useCallback(async (data: Omit<Report, 'id' | 'status' | 'created_at' | 'ticket_number'>) => {
    try {
      await reportApi.create(data);
      showSuccess('Laporan berhasil dikirim!');
      fetchReports(searchQuery || undefined);
      return true;
    } catch (err) {
      showError('Gagal mengirim laporan');
      return false;
    }
  }, [fetchReports, searchQuery, showSuccess, showError]);

  const updateStatus = useCallback(async (id: number, status: Report['status'], progress?: string) => {
    try {
      await reportApi.updateStatus(id, status, progress);
      // Use functional setState to avoid stale closure over reports
      setReports(prev => prev.map(r => r.id === id ? { ...r, status, progress: progress || r.progress } : r));
      showSuccess('Status laporan diperbarui!');
      return true;
    } catch (err) {
      console.error('Failed to update status:', err);
      showError('Gagal mengupdate status');
      return false;
    }
  }, [showSuccess, showError]);

  const deleteReport = useCallback(async (id: number) => {
    try {
      await reportApi.delete(id);
      setReports(prev => prev.filter(r => r.id !== id));
      showSuccess('Laporan berhasil dihapus!');
      return true;
    } catch (err) {
      console.error('Failed to delete report:', err);
      showError('Gagal menghapus laporan');
      return false;
    }
  }, [showSuccess, showError]);

  const triggerSearch = useCallback(() => {
    fetchReports(searchQuery || undefined);
  }, [fetchReports, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    error,
    success,
    searchQuery,
    setSearchQuery,
    triggerSearch,
    clearSearch,
    fetchReports,
    createReport,
    updateStatus,
    deleteReport
  };
}
