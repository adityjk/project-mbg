import { useState, useEffect, useCallback } from 'react';
import { reportApi } from '../services/api';
import type { Report } from '../types';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      const response = await reportApi.getAll(search);
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Gagal memuat laporan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Debounced search - re-fetch when search query changes
  // Using 800ms debounce to avoid too frequent reloads while typing
  useEffect(() => {
    // Don't trigger on initial empty query
    if (searchQuery === '') return;
    
    const timeoutId = setTimeout(() => {
      fetchReports(searchQuery);
    }, 800); // 800ms debounce - waits until user stops typing

    return () => clearTimeout(timeoutId);
  }, [searchQuery, fetchReports]);

  const createReport = async (data: Omit<Report, 'id' | 'status' | 'created_at' | 'ticket_number'>) => {
    try {
      await reportApi.create(data);
      setSuccess('Laporan berhasil dikirim!');
      fetchReports(searchQuery || undefined);
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      setError('Gagal mengirim laporan');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const updateStatus = async (id: number, status: Report['status'], progress?: string) => {
    try {
      await reportApi.updateStatus(id, status, progress);
      setReports(reports.map(r => r.id === id ? { ...r, status, progress: progress || r.progress } : r));
      setSuccess('Status laporan diperbarui!');
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Gagal mengupdate status');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  const deleteReport = async (id: number) => {
    try {
      await reportApi.delete(id);
      setReports(prev => prev.filter(r => r.id !== id));
      setSuccess('Laporan berhasil dihapus!');
      setTimeout(() => setSuccess(null), 3000);
      return true;
    } catch (err) {
      console.error('Failed to delete report:', err);
      setError('Gagal menghapus laporan');
      setTimeout(() => setError(null), 3000);
      return false;
    }
  };

  // Manual search trigger (for Enter key press)
  const triggerSearch = () => {
    fetchReports(searchQuery || undefined);
  };

  // Clear search and reload all
  const clearSearch = () => {
    setSearchQuery('');
    fetchReports();
  };

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
