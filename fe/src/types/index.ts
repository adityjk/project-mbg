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
  status: 'pending' | 'diterima' | 'ditolak';
  created_at: string;
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
