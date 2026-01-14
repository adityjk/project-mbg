import axios from 'axios';
import type { Menu, Report, DashboardStats, AnalyzeResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menu API
export const menuApi = {
  getAll: () => api.get<Menu[]>('/menus'),
  getById: (id: number) => api.get<Menu>(`/menus/${id}`),
  create: (data: Partial<Menu>) => api.post<{ message: string; id: number }>('/menus', data),
  delete: (id: number) => api.delete<{ message: string }>(`/menus/${id}`),
  analyze: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post<AnalyzeResponse>('/analyze-menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Report API
export const reportApi = {
  getAll: () => api.get<Report[]>('/reports'),
  create: (data: Omit<Report, 'id' | 'status' | 'created_at' | 'nama_menu' | 'foto_url'>) =>
    api.post<{ message: string; id: number }>('/reports', data),
  updateStatus: (id: number, status: Report['status']) =>
    api.patch<{ message: string }>(`/reports/${id}`, { status }),
  delete: (id: number) => api.delete<{ message: string }>(`/reports/${id}`),
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get<DashboardStats>('/stats'),
};

export default api;
