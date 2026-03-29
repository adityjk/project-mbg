const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/stats', async (req, res) => {
  const queries = {
    totalMenus: "SELECT COUNT(*) as count FROM menus",
    totalReports: "SELECT COUNT(*) as count FROM reports",
    pendingReports: "SELECT COUNT(*) as count FROM reports WHERE status = 'pending'",
    avgKalori: "SELECT AVG(kalori) as avg_val FROM menus",
    avgProtein: "SELECT AVG(protein) as avg_val FROM menus",
    totalPorsi: "SELECT SUM(jumlah_porsi) as total FROM menus"
  };

  try {
    const results = {};
    
    for (const [key, sql] of Object.entries(queries)) {
      try {
        const [rows] = await db.execute(sql);
        const row = rows[0];
        results[key] = row.count !== undefined ? row.count : 
                       row.avg_val !== undefined ? (row.avg_val || 0) : 
                       row.total !== undefined ? (row.total || 0) : 0;
      } catch {
        results[key] = 0;
      }
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
