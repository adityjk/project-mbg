const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { requireAdmin } = require('../middleware/authMiddleware');
const { validateCreateUser, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// Get all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, username, school_name, role FROM users");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create User (Admin Only - can specify role)
router.post('/', requireAdmin, validateCreateUser, async (req, res) => {
  const { username, password, school_name, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, school_name, role) VALUES (?, ?, ?, ?)";
    
    const [result] = await db.execute(sql, [username, hashedPassword, school_name, role]);
    res.status(201).json({ message: "User berhasil dibuat", id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username sudah terdaftar" });
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete User (Admin Only)
router.delete('/:id', requireAdmin, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "User tidak ditemukan" });
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
