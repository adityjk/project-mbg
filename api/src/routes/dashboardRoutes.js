const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/stats', async (req, res) => {
  // Single round-trip instead of 6 sequential queries
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM menus) AS totalMenus,
      (SELECT COUNT(*) FROM reports) AS totalReports,
      (SELECT COUNT(*) FROM reports WHERE status = 'pending') AS pendingReports,
      (SELECT COALESCE(AVG(kalori), 0) FROM menus) AS avgKalori,
      (SELECT COALESCE(AVG(protein), 0) FROM menus) AS avgProtein,
      (SELECT COALESCE(SUM(jumlah_porsi), 0) FROM menus) AS totalPorsi
  `;

  try {
    const [rows] = await db.execute(sql);
    const row = rows[0];

    res.json({
      totalMenus: Number(row.totalMenus) || 0,
      totalReports: Number(row.totalReports) || 0,
      pendingReports: Number(row.pendingReports) || 0,
      avgKalori: Number(row.avgKalori) || 0,
      avgProtein: Number(row.avgProtein) || 0,
      totalPorsi: Number(row.totalPorsi) || 0
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
