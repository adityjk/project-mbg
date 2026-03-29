// Menu types based on database schema
export interface Menu {
  id: number;
  nama_menu: string;
  deskripsi: string;
  kalori: number;
  karbohidrat: number;
  protein: number;
  lemak: number;
  serat: number;
  porsi: 'besar' | 'kecil';
  jumlah_porsi: number;
  foto_url: string | null;
  location?: string | null;
  created_at: string;
}

export interface School {
  id: number;
  nama_sekolah: string;
  alamat: string;
  latitude: number;
  longitude: number;
  jumlah_siswa: number;
  tipe: 'sekolah' | 'sppg';
  created_at: string;
}

// Report types based on database schema
export interface Report {
  id: number;
  nama_pelapor: string;
  asal_sekolah: string;
  isi_laporan: string;
  menu_id?: number;
  nama_menu?: string;
  foto_url?: string;
  foto_bukti?: string;
  kategori?: 'umum' | 'kualitas_makanan' | 'distribusi' | 'kebersihan' | 'lainnya';
  progress?: string; // Catatan progress penanganan laporan
  status: 'pending' | 'diterima' | 'ditolak';
  ticket_number: string; // e.g., "MBG-000009"
  created_at: string;
}

// Tim SPPG types
export interface TimSPPG {
  id: number;
  nama: string;
  jabatan: string;
  deskripsi: string | null;
  foto_url: string | null;
  email: string | null;
  telepon: string | null;
  urutan: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Stats from dashboard
export interface DashboardStats {
  totalMenus: number;
  totalReports: number;
  pendingReports: number;
  avgKalori: number;
  avgProtein: number;
  totalPorsi: number;
}

// API Response types
export interface AnalyzeResponse {
  message: string;
  data: Omit<Menu, 'id' | 'created_at' | 'foto_url'>;
  imagePath: string;
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
}
