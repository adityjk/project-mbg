-- Database Schema for MBG App
-- Copy and run this SQL in your TiDB Cloud Query Editor

-- 1. Table: menus
CREATE TABLE IF NOT EXISTS menus (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_menu VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kalori FLOAT,
  karbohidrat FLOAT,
  protein FLOAT,
  lemak FLOAT,
  serat FLOAT,
  porsi ENUM('besar', 'kecil'),
  jumlah_porsi INT,
  foto_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: reports
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_pelapor VARCHAR(255) NOT NULL,
  asal_sekolah VARCHAR(255) NOT NULL,
  isi_laporan TEXT NOT NULL,
  status ENUM('pending', 'diterima', 'ditolak') DEFAULT 'pending',
  menu_id INT DEFAULT NULL,
  foto_bukti VARCHAR(512) DEFAULT NULL,
  kategori ENUM('umum', 'kualitas_makanan', 'distribusi', 'kebersihan', 'lainnya') DEFAULT 'umum',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- 3. Table: users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  school_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Seed a default admin user? 
-- It's better to Register via the App to get the correct password hash.
