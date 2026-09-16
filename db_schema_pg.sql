-- =============================================
-- MBG (Makan Bergizi Gratis) — PostgreSQL Schema
-- Root of truth: db_schema_pg.sql
-- Used by: docker-entrypoint-initdb.d AND setup_db.js
-- Run in a Postgres DB (e.g. Neon / Supabase / local container)
-- =============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'user', 'petugas gizi', 'petugas pengaduan', 'super_admin')),
  school_name VARCHAR(255),
  reset_token VARCHAR(10),
  reset_token_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS schools (
  id SERIAL PRIMARY KEY,
  nama_sekolah VARCHAR(255) NOT NULL,
  alamat TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  jumlah_siswa INT DEFAULT 0,
  tipe VARCHAR(50) DEFAULT 'sekolah',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MENUS TABLE
CREATE TABLE IF NOT EXISTS menus (
  id SERIAL PRIMARY KEY,
  nama_menu VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kalori FLOAT DEFAULT 0,
  karbohidrat FLOAT DEFAULT 0,
  protein FLOAT DEFAULT 0,
  lemak FLOAT DEFAULT 0,
  serat FLOAT DEFAULT 0,
  porsi VARCHAR(100),
  jumlah_porsi INT DEFAULT 0,
  foto_url TEXT,
  location VARCHAR(255) DEFAULT 'Semua Sekolah',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  nama_pelapor VARCHAR(255) NOT NULL,
  asal_sekolah VARCHAR(255) NOT NULL,
  isi_laporan TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'diterima', 'ditolak')),
  progress TEXT,
  menu_id INT REFERENCES menus(id) ON DELETE SET NULL,
  foto_bukti TEXT,
  kategori VARCHAR(100) DEFAULT 'umum',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TIM SPPG TABLE
CREATE TABLE IF NOT EXISTS tim_sppg (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT,
  email VARCHAR(255),
  telepon VARCHAR(50),
  urutan INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);