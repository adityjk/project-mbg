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

export default api;
