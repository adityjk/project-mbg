const jwt = require('jsonwebtoken');
require('dotenv').config();

// SECURITY: No fallback — JWT_SECRET must be set in .env
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in environment variables.');
  process.exit(1);
}

const DEMO_MODE = process.env.DEMO_MODE === 'true';
const DEMO_USER = { id: 0, username: 'demo', role: 'super_admin', school_name: null };

const injectDemoUser = (req, res, next) => {
  req.user = DEMO_USER;
  next();
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) {
    if (DEMO_MODE) return injectDemoUser(req, res, next);
    return res.status(403).json({ error: "Akses ditolak, token tidak tersedia" });
  }

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    if (DEMO_MODE) return injectDemoUser(req, res, next);
    return res.status(401).json({ error: "Format token tidak valid" });
  }

  try {
    const decoded = jwt.verify(parts[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (DEMO_MODE) return injectDemoUser(req, res, next);
    return res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa" });
  }
};

/**
 * Generic role-checking middleware factory.
 * Usage: requireRole('admin', 'super_admin')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user && roles.includes(req.user.role)) {
        return next();
      }
      return res.status(403).json({ 
        error: `Akses ditolak. Hanya ${roles.join(', ')} yang boleh mengakses.` 
      });
    });
  };
};

// Backwards-compatible aliases using requireRole
const requireAdmin = requireRole('admin', 'super_admin');
const requireNutritionist = requireRole('petugas gizi', 'super_admin');
const requireComplaintOfficer = requireRole('admin', 'petugas pengaduan', 'super_admin');

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireNutritionist,
  requireComplaintOfficer,
  JWT_SECRET
};
