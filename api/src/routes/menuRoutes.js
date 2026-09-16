const express = require('express');
const db = require('../config/db');
const { requireNutritionist } = require('../middleware/authMiddleware');
const { upload } = require('../config/upload');
const { analyzeImageGizi } = require('../services/aiServices');
const { validateCreateMenu, validateUpdateMenu, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// Get all menus (with filters)
router.get('/', async (req, res) => {
  const { date, month, location } = req.query;
  let sql = "SELECT * FROM menus";
  const params = [];
  const conditions = [];

  if (date) {
    conditions.push("created_at::date = ?");
    params.push(date);
  }

  if (month) {
    conditions.push("TO_CHAR(created_at, 'YYYY-MM') = ?");
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

  try {
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Get menus error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Get single menu by ID
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM menus WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json(rows[0]);
  } catch (err) {
    console.error('Get menu error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create new menu
router.post('/', requireNutritionist, validateCreateMenu, async (req, res) => {
  const {
    nama_menu, deskripsi, kalori, karbohidrat, protein,
    lemak, serat, porsi, jumlah_porsi, foto_url, location
  } = req.body;

  const sql = `INSERT INTO menus 
    (nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url, location) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.execute(sql, [nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, foto_url, location]);
    res.status(201).json({ 
      message: "Data Gizi berhasil disimpan", 
      id: result.insertId 
    });
  } catch (err) {
    console.error('Create menu error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete menu
router.delete('/:id', requireNutritionist, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM menus WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json({ message: "Menu berhasil dihapus" });
  } catch (err) {
    console.error('Delete menu error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Update menu nutrition values
router.put('/:id', requireNutritionist, validateIdParam, validateUpdateMenu, async (req, res) => {
  const { nama_menu, deskripsi, kalori, karbohidrat, protein, lemak, serat, porsi, jumlah_porsi, location } = req.body;
  
  const sql = `UPDATE menus SET 
    nama_menu = COALESCE(?, nama_menu),
    deskripsi = COALESCE(?, deskripsi),
    kalori = COALESCE(?, kalori),
    karbohidrat = COALESCE(?, karbohidrat),
    protein = COALESCE(?, protein),
    lemak = COALESCE(?, lemak),
    serat = COALESCE(?, serat),
    porsi = COALESCE(?, porsi),
    jumlah_porsi = COALESCE(?, jumlah_porsi),
    location = COALESCE(?, location)
    WHERE id = ?`;
  
  try {
    const [result] = await db.execute(sql, [nama_menu ?? null, deskripsi ?? null, kalori ?? null, karbohidrat ?? null, protein ?? null, lemak ?? null, serat ?? null, porsi ?? null, jumlah_porsi ?? null, location ?? null, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Menu tidak ditemukan" });
    res.json({ message: "Data menu berhasil diperbarui" });
  } catch (err) {
    console.error('Update menu error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// AI Analysis Route
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

router.post('/analyze-menu', uploadMiddleware(upload), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Foto tidak ditemukan" });
    }
    
    const dataGizi = await analyzeImageGizi(req.file.path, req.file.mimetype);
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

module.exports = router;
