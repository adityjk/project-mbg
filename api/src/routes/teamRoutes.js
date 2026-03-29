const express = require('express');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/upload');
const { validateCreateTeam, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// ========== PUBLIC ROUTES ==========

// Get all active team members (public)
router.get('/tim-sppg', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM tim_sppg WHERE is_active = 1 ORDER BY urutan ASC, created_at DESC");
    res.json(rows);
  } catch (err) {
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
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create team member
const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('foto');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Team Image Upload Error:', err.message);
      return res.status(500).json({ error: "Gagal upload foto: " + err.message });
    }
    next();
  });
};

router.post('/admin/tim-sppg', requireAdmin, uploadMiddleware, validateCreateTeam, async (req, res) => {
  const { nama, jabatan, deskripsi, email, telepon, urutan, is_active } = req.body;

  const foto_url = req.file ? req.file.path : null;

  const sql = `INSERT INTO tim_sppg (nama, jabatan, deskripsi, foto_url, email, telepon, urutan, is_active) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  try {
    const [result] = await db.execute(sql, [
      nama, jabatan, deskripsi || null, foto_url, 
      email || null, telepon || null, urutan || 0, 
      is_active !== undefined ? is_active : 1
    ]);
    res.status(201).json({ message: "Anggota tim berhasil ditambahkan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Update team member
router.put('/admin/tim-sppg/:id', requireAdmin, validateIdParam, uploadMiddleware, async (req, res) => {
  const { nama, jabatan, deskripsi, email, telepon, urutan, is_active } = req.body;

  const updates = [];
  const params = [];
  
  if (nama) { updates.push('nama = ?'); params.push(nama); }
  if (jabatan) { updates.push('jabatan = ?'); params.push(jabatan); }
  if (deskripsi !== undefined) { updates.push('deskripsi = ?'); params.push(deskripsi); }
  if (email !== undefined) { updates.push('email = ?'); params.push(email); }
  if (telepon !== undefined) { updates.push('telepon = ?'); params.push(telepon); }
  if (urutan !== undefined) { updates.push('urutan = ?'); params.push(urutan); }
  if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active); }
  
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
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete team member
router.delete('/admin/tim-sppg/:id', requireAdmin, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM tim_sppg WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Anggota tim berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
