import axios from 'axios';
import type { Menu, Report, DashboardStats, AnalyzeResponse } from '../types';

// Hardcoded to /api to ensure proxy is used during debugging
const API_BASE = '/api'; // import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Menu API
export const menuApi = {
  getAll: (params?: { date?: string; month?: string; location?: string }) => api.get<Menu[]>('/menus', { params }),
  getById: (id: number) => api.get<Menu>(`/menus/${id}`),
  create: (data: Partial<Menu>) => api.post<{ message: string; id: number }>('/menus', data),
  update: (id: number, data: Partial<Menu>) => api.put<{ message: string }>(`/menus/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/menus/${id}`),
  analyze: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post<AnalyzeResponse>('/menus/analyze-menu', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Report API
export const reportApi = {
  getAll: (search?: string) => api.get<Report[]>('/reports', { params: search ? { search } : {} }),
  create: (data: Omit<Report, 'id' | 'status' | 'created_at' | 'nama_menu' | 'foto_url' | 'ticket_number'>) =>
    api.post<{ message: string; id: number }>('/reports', data),
  updateStatus: (id: number, status: Report['status'], progress?: string) =>
    api.patch<{ message: string }>(`/reports/${id}`, { status, progress }),
  delete: (id: number) => api.delete<{ message: string }>(`/reports/${id}`),
  uploadImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post<{ message: string; imageUrl: string }>('/reports/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get<DashboardStats>('/stats'),
};

// Auth API
export const authApi = {
  login: (data: any) => api.post('/login', data),
  register: (data: any) => api.post('/register', data),
};

// School API
export const schoolApi = {
  getAll: () => api.get<import('../types').School[]>('/schools'),
  create: (data: Omit<import('../types').School, 'id' | 'created_at'>) => api.post<{ message: string; id: number }>('/schools', data),
  update: (id: number, data: Partial<import('../types').School>) => api.put<{ message: string }>(`/schools/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/schools/${id}`),
};

// Tim SPPG API
export const timSppgApi = {
  // Public endpoint (hanya anggota aktif)
  getAll: () => api.get<import('../types').TimSPPG[]>('/tim-sppg'),
  // Admin endpoints
  getAllAdmin: () => api.get<import('../types').TimSPPG[]>('/admin/tim-sppg'),
  getById: (id: number) => api.get<import('../types').TimSPPG>(`/admin/tim-sppg/${id}`),
  create: (data: Omit<import('../types').TimSPPG, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<{ message: string; id: number }>('/admin/tim-sppg', data),
  update: (id: number, data: Partial<import('../types').TimSPPG>) => 
    api.put<{ message: string }>(`/admin/tim-sppg/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/admin/tim-sppg/${id}`),
  uploadImage: (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return api.post<{ message: string; imageUrl: string }>('/admin/tim-sppg/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
