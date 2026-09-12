import axios from 'axios';
import type { Menu, Report, DashboardStats, AnalyzeResponse, School, TimSPPG } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

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
  (error) => Promise.reject(error)
);

// Handle expired/unauthorized tokens globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Shared multipart upload helper
async function uploadFile<T>(url: string, file: File, fieldName = 'image'): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);
  return api.post<T>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
}

// Menu API
export const menuApi = {
  getAll: (params?: { date?: string; month?: string; location?: string }) => api.get<Menu[]>('/menus', { params }),
  getById: (id: number) => api.get<Menu>(`/menus/${id}`),
  create: (data: Partial<Menu>) => api.post<{ message: string; id: number }>('/menus', data),
  update: (id: number, data: Partial<Menu>) => api.put<{ message: string }>(`/menus/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/menus/${id}`),
  analyze: (imageFile: File) => uploadFile<AnalyzeResponse>('/menus/analyze-menu', imageFile),
};

// Report API
export const reportApi = {
  getAll: (search?: string) => api.get<Report[]>('/reports', { params: search ? { search } : {} }),
  create: (data: Omit<Report, 'id' | 'status' | 'created_at' | 'nama_menu' | 'foto_url' | 'ticket_number'>) =>
    api.post<{ message: string; id: number }>('/reports', data),
  updateStatus: (id: number, status: Report['status'], progress?: string) =>
    api.patch<{ message: string }>(`/reports/${id}`, { status, progress }),
  delete: (id: number) => api.delete<{ message: string }>(`/reports/${id}`),
  uploadImage: (imageFile: File) =>
    uploadFile<{ message: string; imageUrl: string }>('/reports/upload-image', imageFile),
};

// Stats API
export const statsApi = {
  getDashboard: () => api.get<DashboardStats>('/stats'),
};

// Auth API
export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/login', data),
  register: (data: { username: string; password: string; school_name: string }) => api.post('/register', data),
};

// User Management API (admin only)
export const userApi = {
  getAll: () => api.get<Array<{ id: number; username: string; school_name: string; role: string }>>('/admin/users'),
  create: (data: { username: string; password: string; school_name: string; role: string }) =>
    api.post<{ message: string; id: number }>('/admin/users', data),
  delete: (id: number) => api.delete<{ message: string }>(`/admin/users/${id}`),
};

// School API
export const schoolApi = {
  getAll: () => api.get<School[]>('/schools'),
  create: (data: Omit<School, 'id' | 'created_at'>) => api.post<{ message: string; id: number }>('/schools', data),
  update: (id: number, data: Partial<School>) => api.put<{ message: string }>(`/schools/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/schools/${id}`),
};

// Tim SPPG API
export const timSppgApi = {
  // Public endpoint (only active members)
  getAll: () => api.get<TimSPPG[]>('/tim-sppg'),
  // Admin endpoints
  getAllAdmin: () => api.get<TimSPPG[]>('/admin/tim-sppg'),
  create: (data: Omit<TimSPPG, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<{ message: string; id: number }>('/admin/tim-sppg', data),
  update: (id: number, data: Partial<TimSPPG>) =>
    api.put<{ message: string }>(`/admin/tim-sppg/${id}`, data),
  delete: (id: number) => api.delete<{ message: string }>(`/admin/tim-sppg/${id}`),
  uploadImage: (imageFile: File) =>
    uploadFile<{ message: string; imageUrl: string }>('/admin/tim-sppg/upload-image', imageFile),
};

export default api;
