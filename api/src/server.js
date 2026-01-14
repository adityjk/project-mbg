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

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `menu-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Hanya file gambar yang diperbolehkan!'));
  }
});

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_mbg'
});

db.connect(err => {
  if (err) console.error("Database mati cek LAMPP kamu!", err.message);
  else console.log("Database nyala!");
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

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


// ==================== MENU ROUTES ====================

// Get all menus
app.get('/api/menus', (req, res) => {
  const sql = "SELECT * FROM menus ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
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
app.post('/api/menus', upload.single('image'), (req, res) => { // Modified to handle upload if needed directly or via JSON
    // Note: Previous implementation assumed JSON payload for 'foto_url' but multer was configured. 
    // The previous code didn't use 'upload.single' on this route.
    // If we want to support file upload on create menu, we should use multer.
    // BUT the original code: 
    // app.post('/api/menus', (req, res) => { ... req.body.foto_url ... })
    // implies separate upload for 'analyze' or maybe direct link. 
    // Let's keep it as is for now to avoid breaking existing flow unless requested.
    // Wait, check original file content for line 83. It didn't have upload.single. 
    // AND check /api/analyze-menu route. It returns 'imagePath'. Frontend might send this path.
    // So "foto_url" comes from analyed image or external.
  const {
    nama_menu, deskripsi, kalori, karbohidrat, protein,
    lemak, serat, porsi, jumlah_porsi, foto_url
  } = req.body;

  const sql = `INSERT INTO menus 
    (nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url], (err, result) => {
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

app.post('/api/analyze-menu', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Foto tidak ditemukan" });
    }

    const dataGizi = await analyzeImageGizi(req.file.path, req.file.mimetype);
    
    // Return relative path for frontend
    const relativePath = `/uploads/${req.file.filename}`;
    
    res.json({
      message: "Analisis berhasil",
      data: dataGizi,
      imagePath: relativePath
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== REPORTS ROUTES ====================

// Get all reports (Joined with Menus)
app.get('/api/reports', (req, res) => {
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

// Create new report
app.post('/api/reports', (req, res) => {
  const { nama_pelapor, asal_sekolah, isi_laporan, menu_id } = req.body;
  
  if (!nama_pelapor || !asal_sekolah || !isi_laporan) {
    return res.status(400).json({ error: "Semua field harus diisi" });
  }
  
  // menu_id can be null if it's a general report, but user asked for "report sesuai dengan menu"
  // so specific reports will have menu_id.
  
  const sql = "INSERT INTO reports (nama_pelapor, asal_sekolah, isi_laporan, menu_id) VALUES (?, ?, ?, ?)";
  db.query(sql, [nama_pelapor, asal_sekolah, isi_laporan, menu_id || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: "Laporan terkirim!", 
      id: result.insertId 
    });
  });
});

// Update report status (admin only)
app.patch('/api/reports/:id', verifyToken, (req, res) => { // Protected
  // Check if admin
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Hanya admin yang boleh mengubah status" });
  
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

// Delete report
app.delete('/api/reports/:id', verifyToken, (req, res) => { // Protected
   if (req.user.role !== 'admin') return res.status(403).json({ error: "Hanya admin yang boleh menghapus" });

  const sql = "DELETE FROM reports WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    res.json({ message: "Laporan berhasil dihapus" });
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
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
