-- Database Schema for MBG App (PostgreSQL Version)
-- Run this SQL in your Vercel Postgres / Neon Query Editor

-- 1. Table: menus
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  nama_menu VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kalori FLOAT,
  karbohidrat FLOAT,
  protein FLOAT,
  lemak FLOAT,
  serat FLOAT,
  porsi VARCHAR(20) CHECK (porsi IN ('besar', 'kecil')),
  jumlah_porsi INT,
  foto_url VARCHAR(255),
  location VARCHAR(255) DEFAULT 'Semua Sekolah',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: reports
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  nama_pelapor VARCHAR(255) NOT NULL,
  asal_sekolah VARCHAR(255) NOT NULL,
  isi_laporan TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'diterima', 'ditolak')),
  progress TEXT DEFAULT NULL,
  menu_id INT DEFAULT NULL,
  foto_bukti VARCHAR(512) DEFAULT NULL,
  kategori VARCHAR(50) DEFAULT 'umum' CHECK (kategori IN ('umum', 'kualitas_makanan', 'distribusi', 'kebersihan', 'lainnya')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- 3. Table: users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'super_admin', 'user', 'petugas gizi', 'petugas pengaduan')),
  school_name VARCHAR(255),
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expiry TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: tim_sppg (Tim Satgas Pangan dan Gizi)
CREATE TABLE IF NOT EXISTS tim_sppg (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  foto_url VARCHAR(512),
  email VARCHAR(255),
  telepon VARCHAR(50),
  urutan INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function and Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tim_sppg_updated_at
BEFORE UPDATE ON tim_sppg
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
