const express = require('express');
const db = require('../config/db');
const { requireComplaintOfficer } = require('../middleware/authMiddleware');
const { uploadReport } = require('../config/upload');
const { validateCreateReport, validateUpdateReport, validateIdParam } = require('../middleware/validator');

const router = express.Router();

// Helper: Format ticket number as MBG-XXXXXX (6-digit padded ID)
const formatTicketNumber = (id) => `MBG-${String(id).padStart(6, '0')}`;

// Get all reports - with search support
router.get('/', async (req, res) => {
  const { search } = req.query;
  
  let sql = `
    SELECT 
      r.id,
      r.nama_pelapor,
      r.asal_sekolah,
      r.isi_laporan,
      r.status AS status,
      r.progress,
      r.menu_id,
      r.foto_bukti,
      r.kategori,
      r.created_at,
      m.nama_menu, 
      m.foto_url 
    FROM reports r 
    LEFT JOIN menus m ON r.menu_id = m.id
  `;
  
  const params = [];
  
  if (search && search.trim()) {
    const searchTerm = `%${search.trim()}%`;
    sql += ` WHERE (
      r.nama_pelapor LIKE ? OR 
      r.asal_sekolah LIKE ? OR 
      r.isi_laporan LIKE ? OR
      CONCAT('MBG-', LPAD(r.id, 6, '0')) LIKE ?
    )`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  sql += ` ORDER BY r.created_at DESC`;
  
  try {
    const [rows] = await db.execute(sql, params);
    const resultsWithTicket = rows.map(report => ({
      ...report,
      ticket_number: formatTicketNumber(report.id)
    }));
    res.json(resultsWithTicket);
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Create new report (Public/User)
router.post('/', validateCreateReport, async (req, res) => {
  const { nama_pelapor, asal_sekolah, isi_laporan, menu_id, foto_bukti, kategori } = req.body;
  
  const sql = "INSERT INTO reports (nama_pelapor, asal_sekolah, isi_laporan, menu_id, foto_bukti, kategori) VALUES (?, ?, ?, ?, ?, ?)";
  
  try {
    const [result] = await db.execute(sql, [nama_pelapor, asal_sekolah, isi_laporan, menu_id || null, foto_bukti || null, kategori || 'umum']);
    res.status(201).json({ 
      message: "Laporan terkirim!", 
      id: result.insertId 
    });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Upload report image (Public)
const uploadReportMiddleware = (req, res, next) => {
  const uploadSingle = uploadReport.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Report Image Upload Error:', err.message);
      return res.status(500).json({ error: "Gagal upload gambar: " + err.message });
    }
    next();
  });
};

router.post('/upload-image', uploadReportMiddleware, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Gambar tidak ditemukan" });
  }
  
  res.json({
    message: "Upload berhasil",
    imageUrl: req.file.path
  });
});

// Update report status (Complaint Officer Only)
router.patch('/:id', requireComplaintOfficer, validateIdParam, validateUpdateReport, async (req, res) => {
  const { status, progress } = req.body;
  
  const updates = [];
  const params = [];
  
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }
  if (progress !== undefined) {
    updates.push('progress = ?');
    params.push(progress);
  }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: "Tidak ada data yang diupdate" });
  }
  
  params.push(req.params.id);
  const sql = `UPDATE reports SET ${updates.join(', ')} WHERE id = ?`;
  
  try {
    const [result] = await db.execute(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    res.json({ message: "Laporan berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Delete report (Complaint Officer Only)
router.delete('/:id', requireComplaintOfficer, validateIdParam, async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM reports WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Laporan tidak ditemukan" });
    res.json({ message: "Laporan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
