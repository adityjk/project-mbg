const express = require('express');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/upload');
const { validateCreateTeam, validateUpdateTeam, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// Coerce is_active input (boolean | 1/0 | 'true'/'1') to a PG boolean
const toBool = (v) => v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';

// ========== PUBLIC ROUTES ==========

// Get all active team members (public)
router.get('/tim-sppg', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM tim_sppg WHERE is_active = TRUE ORDER BY urutan ASC, created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error('Get public team members error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// ========== ADMIN ROUTES ==========

// Get all team members (admin - includes inactive)
router.get('/admin/tim-sppg', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM tim_sppg ORDER BY urutan ASC, created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error('Get admin team members error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create team member
const { uploadMiddleware } = require('../middleware/uploadMiddleware');

router.post('/admin/tim-sppg', requireAdmin, uploadMiddleware(upload), validateCreateTeam, async (req, res) => {
  const { nama, jabatan, deskripsi, email, telepon, urutan, is_active } = req.body;

  const foto_url = req.file ? req.file.path : null;

  const sql = `INSERT INTO tim_sppg (nama, jabatan, deskripsi, foto_url, email, telepon, urutan, is_active) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  try {
    const [result] = await db.execute(sql, [
      nama, jabatan, deskripsi || null, foto_url, 
      email || null, telepon || null, urutan || 0, 
      is_active !== undefined ? toBool(is_active) : true
    ]);
    res.status(201).json({ message: "Anggota tim berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    console.error('Create team member error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Update team member
router.put('/admin/tim-sppg/:id', requireAdmin, validateIdParam, validateUpdateTeam, uploadMiddleware(upload), async (req, res) => {
  const { nama, jabatan, deskripsi, email, telepon, urutan, is_active } = req.body;

  const updates = [];
  const params = [];
  
  if (nama) { updates.push('nama = ?'); params.push(nama); }
  if (jabatan) { updates.push('jabatan = ?'); params.push(jabatan); }
  if (deskripsi !== undefined) { updates.push('deskripsi = ?'); params.push(deskripsi); }
  if (email !== undefined) { updates.push('email = ?'); params.push(email); }
  if (telepon !== undefined) { updates.push('telepon = ?'); params.push(telepon); }
  if (urutan !== undefined) { updates.push('urutan = ?'); params.push(urutan); }
  if (is_active !== undefined) { updates.push('is_active = ?'); params.push(toBool(is_active)); }
  
  if (req.file) {
    updates.push('foto_url = ?');
    params.push(req.file.path);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "Tidak ada data yang diupdate" });
  }

  params.push(req.params.id);
  const sql = `UPDATE tim_sppg SET ${updates.join(', ')} WHERE id = ?`;

  try {
    const [result] = await db.execute(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data anggota tim berhasil diperbarui" });
  } catch (err) {
    console.error('Update team member error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Upload team member photo (used by frontend before create/update)
router.post('/admin/tim-sppg/upload-image', requireAdmin, (req, res, next) => {
  const uploadSingle = upload.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Team Image Upload Error:', err.message);
      return res.status(500).json({ error: "Gagal upload gambar: " + err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Gambar tidak ditemukan" });
    }
    res.json({ message: "Upload berhasil", imageUrl: req.file.path });
  });
});

// Delete team member
router.delete('/admin/tim-sppg/:id', requireAdmin, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM tim_sppg WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Anggota tim berhasil dihapus" });
  } catch (err) {
    console.error('Delete team member error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
