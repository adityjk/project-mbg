const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { analyzeImageGizi } = require('./services/aiServices');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara_mbg_2024';

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: "Akses ditolak, token tidak tersedia" });
  
  // Format: "Bearer <token>"
  const bearer = token.split(' ');
  const bearerToken = bearer[1];

  jwt.verify(bearerToken, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token tidak valid" });
    req.user = decoded;
    next();
  });
};

// Middleware that ensures the user is authenticated and has admin role
const requireAdmin = (req, res, next) => {
  // First run the token verification
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: "Hanya admin yang boleh mengakses" });
  });
};

// Ensure uploads directory exists
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage for Multer (Menu Images)
const menuStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mbg_menu_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
  },
});

// Cloudinary Storage for Report Images (with compression)
const reportStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mbg_report_images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
  },
});

const upload = multer({ storage: menuStorage });
const uploadReport = multer({ storage: reportStorage });

// Database connection (Ensure it supports external connections via env)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_mbg',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined // Support for Aiven/PlanetScale
});

db.connect(err => {
  if (err) console.error("Database Connection Failed:", err.message);
  else console.log("Database Connected!");
});

// Serve uploaded images statically (Fallback for local dev or older images, not needed for Cloudinary but kept for safety if needed, can likely be removed or kept as empty middleware if path doesn't exist)
// app.use('/uploads', express.static(uploadsDir)); // Removed as we use Cloudinary URLs now

// ==================== AUTH ROUTES ====================

// Register User
app.post('/api/register', async (req, res) => {
  const { username, password, school_name, name } = req.body; // 'name' mapped to username for simplicity or separate?
  // Requirement: "user registrasi berupa nama, nama sekolah, dan password"
  // Let's use 'username' as 'nama' for simplicity, or add 'full_name'.
  // Schema has 'username'. Let's assume 'nama' sent from FE maps to 'username'.
  
  if (!username || !password || !school_name) {
    return res.status(400).json({ error: "Nama, password, dan nama sekolah wajib diisi" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, school_name, role) VALUES (?, ?, ?, 'user')";
    
    db.query(sql, [username, hashedPassword, school_name], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username sudah terdaftar" });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "Registrasi berhasil, silakan login" });
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Username dan password wajib diisi" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Username atau password salah" });

    const user = results[0];
    
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Verifikasi gagal" });
      if (!isMatch) return res.status(401).json({ error: "Username atau password salah" });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role, school_name: user.school_name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: "Login berhasil",
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          school_name: user.school_name
        }
      });
    });
  });
});

// Middleware: Admin OR Petugas Gizi
const requireNutritionist = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'petugas gizi')) {
      return next();
    }
    return res.status(403).json({ error: "Akses ditolak. Khusus Petugas Gizi." });
  });
};

// Middleware: Admin OR Petugas Pengaduan
const requireComplaintOfficer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'petugas pengaduan')) {
      return next();
    }
    return res.status(403).json({ error: "Akses ditolak. Khusus Petugas Pengaduan." });
  });
};

// ==================== ADMIN ROUTES ====================

// Get all users (admin only)
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const sql = "SELECT id, username, school_name, role FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create User (Admin Only - can specify role)
app.post('/api/admin/users', requireAdmin, async (req, res) => {
  const { username, password, school_name, role } = req.body;
  
  if (!username || !password || !school_name || !role) {
    return res.status(400).json({ error: "Semua data wajib diisi" });
  }

  const validRoles = ['admin', 'user', 'petugas gizi', 'petugas pengaduan'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Role tidak valid" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, school_name, role) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [username, hashedPassword, school_name, role], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username sudah terdaftar" });
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: "User berhasil dibuat", id: result.insertId });
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete User (Admin Only)
app.delete('/api/admin/users/:id', requireAdmin, (req, res) => {
  // Prevent admin from deleting themselves check could be good, but simple delete for now
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  });
});


// ==================== MENU ROUTES ====================

// Get all menus
// Get all menus (with filters)
app.get('/api/menus', (req, res) => {
  const { date, month, location } = req.query;
  let sql = "SELECT * FROM menus";
  const params = [];
  const conditions = [];

  if (date) {
    conditions.push("DATE(created_at) = ?");
    params.push(date);
  }

  if (month) {
    // month format: 'YYYY-MM' or just 'MM' (user passed 'MM'?)
    // safest is likely 'YYYY-MM'. Let's assume frontend sends YYYY-MM
    // or we use MONTH(created_at)
    conditions.push("DATE_FORMAT(created_at, '%Y-%m') = ?");
    params.push(month);
  }

  if (location) {
    conditions.push("(location = ? OR location = 'Semua Sekolah')");
    params.push(location);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  console.log('GET /api/menus Query:', { sql, params });

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get single menu by ID
app.get('/api/menus/:id', (req, res) => {
  const sql = "SELECT * FROM menus WHERE id = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json(results[0]);
  });
});

// Create new menu
// Create new menu
app.post('/api/menus', requireNutritionist, (req, res) => {
  const {
    nama_menu, deskripsi, kalori, karbohidrat, protein,
    lemak, serat, porsi, jumlah_porsi, foto_url, location
  } = req.body;

  const sql = `INSERT INTO menus 
    (nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url, location) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url, location], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: "Data Gizi berhasil disimpan", 
      id: result.insertId 
    });
  });
});

// Delete menu
app.delete('/api/menus/:id', (req, res) => {
  const sql = "DELETE FROM menus WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json({ message: "Menu berhasil dihapus" });
  });
});

// ==================== AI ANALYSIS ROUTE ====================

// Multer wrapper for error handling
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Multer Upload Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      return res.status(500).json({ error: "Gagal upload gambar: " + err.message });
    }
    next();
  });
};

app.post('/api/analyze-menu', uploadMiddleware, async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Foto tidak ditemukan" });
    }
    
    console.log('[DEBUG] Received file upload:', JSON.stringify(req.file, null, 2));

    const dataGizi = await analyzeImageGizi(req.file.path, req.file.mimetype);
    
    // Return Cloudinary URL for frontend
    const relativePath = req.file.path;
    
    res.json({
      message: "Analisis berhasil",
      data: dataGizi,
      imagePath: relativePath
    });
  } catch (error) {
    next(error);
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CRITICAL] Unhandled Server Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// ==================== REPORTS ROUTES ====================

// Get all reports (Complaint Officer Only)
app.get('/api/reports', requireComplaintOfficer, (req, res) => {
  // We want to see the menu_name if linked
  const sql = `
    SELECT r.*, m.nama_menu, m.foto_url 
    FROM reports r 
    LEFT JOIN menus m ON r.menu_id = m.id 
    ORDER BY r.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new report (Public/User) - with optional image
app.post('/api/reports', (req, res) => {
  const { nama_pelapor, asal_sekolah, isi_laporan, menu_id, foto_bukti, kategori } = req.body;
  
  if (!nama_pelapor || !asal_sekolah || !isi_laporan) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }
  
  // menu_id can be null if it's a general report, but user asked for "report sesuai dengan menu"
  // so specific reports will have menu_id.
  
  const sql = "INSERT INTO reports (nama_pelapor, asal_sekolah, isi_laporan, menu_id, foto_bukti, kategori) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nama_pelapor, asal_sekolah, isi_laporan, menu_id || null, foto_bukti || null, kategori || 'umum'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: "Laporan terkirim!", 
      id: result.insertId 
    });
  });
});

// Upload report image (Public)
const uploadReportMiddleware = (req, res, next) => {
  const uploadSingle = uploadReport.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Report Image Upload Error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      return res.status(500).json({ error: "Gagal upload gambar: " + err.message });
    }
    next();
  });
};

app.post('/api/reports/upload-image', uploadReportMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Gambar tidak ditemukan" });
  }
  
  console.log('[DEBUG] Report image uploaded:', req.file.path);
  
  res.json({
    message: "Upload berhasil",
    imageUrl: req.file.path
  });
});

// Update report status (Complaint Officer Only)
app.patch('/api/reports/:id', requireComplaintOfficer, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'diterima', 'ditolak'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Status tidak valid" });
  }
  
  const sql = "UPDATE reports SET status = ? WHERE id = ?";
  db.query(sql, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    res.json({ message: "Status laporan diperbarui" });
  });
});

// Delete report (Complaint Officer Only)
app.delete('/api/reports/:id', requireComplaintOfficer, (req, res) => {
  const sql = "DELETE FROM reports WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    res.json({ message: "Laporan berhasil dihapus" });
  });
});

// ==================== SCHOOLS ROUTES ====================

// Get all schools
app.get('/api/schools', (req, res) => {
  const sql = "SELECT * FROM schools ORDER BY tipe DESC, nama_sekolah ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Create new school (admin only)
app.post('/api/schools', requireAdmin, (req, res) => {
  const { nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe } = req.body;
  
  if (!nama_sekolah || !latitude || !longitude) {
    return res.status(400).json({ error: "Nama sekolah dan lokasi (lat/lng) wajib diisi" });
  }

  const sql = "INSERT INTO schools (nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [nama_sekolah, alamat, latitude, longitude, jumlah_siswa || 0, tipe || 'sekolah'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Data sekolah berhasil disimpan", id: result.insertId });
  });
});

// Update school (admin only)
app.put('/api/schools/:id', requireAdmin, (req, res) => {
  const { nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe } = req.body;
  
  const sql = "UPDATE schools SET nama_sekolah=?, alamat=?, latitude=?, longitude=?, jumlah_siswa=?, tipe=? WHERE id=?";
  db.query(sql, [nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data sekolah diperbarui" });
  });
});

// Delete school (admin only)
app.delete('/api/schools/:id', requireAdmin, (req, res) => {
  const sql = "DELETE FROM schools WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data sekolah dihapus" });
  });
});

// ==================== DASHBOARD STATS ====================

app.get('/api/stats', (req, res) => { // Maybe protect this too? Let's leave public for now or verifyToken if FE sends it.
  const queries = {
    totalMenus: "SELECT COUNT(*) as count FROM menus",
    totalReports: "SELECT COUNT(*) as count FROM reports",
    pendingReports: "SELECT COUNT(*) as count FROM reports WHERE status = 'pending'",
    avgKalori: "SELECT AVG(kalori) as avg FROM menus",
    avgProtein: "SELECT AVG(protein) as avg FROM menus",
    totalPorsi: "SELECT SUM(jumlah_porsi) as total FROM menus"
  };

  const results = {};
  let completed = 0;
  const totalQueries = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.query(sql, (err, result) => {
      if (err) {
        results[key] = 0;
      } else {
        results[key] = result[0].count || result[0].avg || result[0].total || 0;
      }
      completed++;
      if (completed === totalQueries) {
        res.json(results);
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
}

module.exports = app;
