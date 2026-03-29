-- =============================================
-- MBG (Makan Bergizi Gratis) — MySQL Schema
-- Run: mysql -u root db_mbg < db_schema_mysql.sql
-- =============================================

CREATE DATABASE IF NOT EXISTS db_mbg;
USE db_mbg;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'petugas gizi', 'petugas pengaduan', 'super_admin') NOT NULL DEFAULT 'user',
  school_name VARCHAR(255),
  reset_token VARCHAR(10) DEFAULT NULL,
  reset_token_expiry DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SCHOOLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_sekolah VARCHAR(255) NOT NULL,
  alamat TEXT,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  jumlah_siswa INT DEFAULT 0,
  tipe VARCHAR(50) DEFAULT 'sekolah',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- MENUS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- REPORTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pelapor VARCHAR(255) NOT NULL,
  asal_sekolah VARCHAR(255) NOT NULL,
  isi_laporan TEXT NOT NULL,
  status ENUM('pending', 'diterima', 'ditolak') DEFAULT 'pending',
  progress TEXT,
  menu_id INT DEFAULT NULL,
  foto_bukti TEXT,
  kategori VARCHAR(100) DEFAULT 'umum',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TIM SPPG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tim_sppg (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  foto_url TEXT,
  email VARCHAR(255),
  telepon VARCHAR(50),
  urutan INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
