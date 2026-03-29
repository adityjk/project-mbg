const express = require('express');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const { validateCreateSchool, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// Get all schools
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM schools ORDER BY tipe DESC, nama_sekolah ASC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create new school (admin only)
router.post('/', requireAdmin, validateCreateSchool, async (req, res) => {
  const { nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe } = req.body;

  try {
    const sql = "INSERT INTO schools (nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.execute(sql, [nama_sekolah, alamat, latitude, longitude, jumlah_siswa || 0, tipe || 'sekolah']);
    res.status(201).json({ message: "Data sekolah berhasil disimpan", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Update school (admin only)
router.put('/:id', requireAdmin, validateIdParam, async (req, res) => {
  const { nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe } = req.body;
  
  try {
    const sql = "UPDATE schools SET nama_sekolah=?, alamat=?, latitude=?, longitude=?, jumlah_siswa=?, tipe=? WHERE id=?";
    const [result] = await db.execute(sql, [nama_sekolah, alamat, latitude, longitude, jumlah_siswa, tipe, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data sekolah diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete school (admin only)
router.delete('/:id', requireAdmin, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM schools WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data sekolah dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
