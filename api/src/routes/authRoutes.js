const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } = require('../middleware/validator');

const router = express.Router();

// Register User
router.post('/register', authLimiter, validateRegister, async (req, res) => {
  const { username, password, school_name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password, school_name, role) VALUES (?, ?, ?, 'user')";
    
    const [result] = await db.execute(sql, [username, hashedPassword, school_name]);
    res.status(201).json({ message: "Registrasi berhasil, silakan login" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "Username sudah terdaftar" });
    console.error('Register error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Login
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(401).json({ error: "Username atau password salah" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Forgot Password
router.post('/forgot-password', authLimiter, validateForgotPassword, async (req, res) => {
  const { username } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) {
      return res.json({ message: "Jika username terdaftar, token reset akan dibuat." });
    }

    const user = rows[0];
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3600000);
    
    await db.execute("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?", [token, expiry, user.id]);
    
    res.json({ 
      message: "Token reset berhasil dibuat. Hubungi admin untuk mendapatkan token.",
      ...(process.env.NODE_ENV !== 'production' && { token })
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Reset Password
router.post('/reset-password', authLimiter, validateResetPassword, async (req, res) => {
  const { username, token, newPassword } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ? AND reset_token = ?", [username, token]);
    if (rows.length === 0) {
      return res.status(400).json({ error: "Token tidak valid" });
    }

    const user = rows[0];
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res.status(400).json({ error: "Token sudah kadaluarsa" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?", [hashedPassword, user.id]);
    
    res.json({ message: "Password berhasil direset. Silakan login dengan password baru." });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
