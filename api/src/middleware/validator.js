const { body, param, validationResult } = require('express-validator');

/**
 * Middleware that checks for validation errors and returns 400 with details.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validasi gagal',
      details: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// ========== AUTH VALIDATORS ==========

const validateRegister = [
  body('username')
    .trim().notEmpty().withMessage('Username wajib diisi')
    .isLength({ min: 3, max: 50 }).withMessage('Username harus 3-50 karakter')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username hanya boleh huruf, angka, dan underscore'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('school_name')
    .trim().notEmpty().withMessage('Nama sekolah wajib diisi')
    .isLength({ max: 200 }).withMessage('Nama sekolah maksimal 200 karakter'),
  handleValidation
];

const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  body('password').notEmpty().withMessage('Password wajib diisi'),
  handleValidation
];

const validateForgotPassword = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  handleValidation
];

const validateResetPassword = [
  body('username').trim().notEmpty().withMessage('Username wajib diisi'),
  body('token').trim().notEmpty().withMessage('Token wajib diisi'),
  body('newPassword')
    .notEmpty().withMessage('Password baru wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  handleValidation
];

// ========== MENU VALIDATORS ==========

const validateCreateMenu = [
  body('nama_menu').trim().notEmpty().withMessage('Nama menu wajib diisi'),
  body('kalori').optional().isFloat({ min: 0 }).withMessage('Kalori harus angka positif'),
  body('karbohidrat').optional().isFloat({ min: 0 }).withMessage('Karbohidrat harus angka positif'),
  body('protein').optional().isFloat({ min: 0 }).withMessage('Protein harus angka positif'),
  body('lemak').optional().isFloat({ min: 0 }).withMessage('Lemak harus angka positif'),
  body('serat').optional().isFloat({ min: 0 }).withMessage('Serat harus angka positif'),
  body('jumlah_porsi').optional().isInt({ min: 0 }).withMessage('Jumlah porsi harus angka positif'),
  handleValidation
];

// ========== REPORT VALIDATORS ==========

const validateCreateReport = [
  body('nama_pelapor').trim().notEmpty().withMessage('Nama pelapor wajib diisi'),
  body('asal_sekolah').trim().notEmpty().withMessage('Asal sekolah wajib diisi'),
  body('isi_laporan').trim().notEmpty().withMessage('Isi laporan wajib diisi'),
  body('kategori').optional().isIn(['umum', 'gizi', 'kebersihan', 'pelayanan']).withMessage('Kategori tidak valid'),
  handleValidation
];

const validateUpdateReport = [
  body('status').optional().isIn(['pending', 'diterima', 'ditolak']).withMessage('Status tidak valid'),
  body('progress').optional().isString(),
  handleValidation
];

// ========== SCHOOL VALIDATORS ==========

const validateCreateSchool = [
  body('nama_sekolah').trim().notEmpty().withMessage('Nama sekolah wajib diisi'),
  body('latitude').notEmpty().withMessage('Latitude wajib diisi').isFloat().withMessage('Latitude harus angka'),
  body('longitude').notEmpty().withMessage('Longitude wajib diisi').isFloat().withMessage('Longitude harus angka'),
  body('jumlah_siswa').optional().isInt({ min: 0 }).withMessage('Jumlah siswa harus angka positif'),
  body('tipe').optional().isIn(['sekolah', 'pesantren']).withMessage('Tipe tidak valid'),
  handleValidation
];

// ========== USER VALIDATORS ==========

const validateCreateUser = [
  body('username')
    .trim().notEmpty().withMessage('Username wajib diisi')
    .isLength({ min: 3, max: 50 }).withMessage('Username harus 3-50 karakter'),
  body('password')
    .notEmpty().withMessage('Password wajib diisi')
    .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('school_name').trim().notEmpty().withMessage('Nama sekolah wajib diisi'),
  body('role')
    .notEmpty().withMessage('Role wajib diisi')
    .isIn(['admin', 'user', 'petugas gizi', 'petugas pengaduan', 'super_admin']).withMessage('Role tidak valid'),
  handleValidation
];

// ========== TEAM VALIDATORS ==========

const validateCreateTeam = [
  body('nama').trim().notEmpty().withMessage('Nama wajib diisi'),
  body('jabatan').trim().notEmpty().withMessage('Jabatan wajib diisi'),
  body('email').optional({ values: 'null' }).isEmail().withMessage('Format email tidak valid'),
  body('urutan').optional().isInt({ min: 0 }).withMessage('Urutan harus angka positif'),
  handleValidation
];

// ========== PARAM VALIDATORS ==========

const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('ID tidak valid'),
  handleValidation
];

module.exports = {
  handleValidation,
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateCreateMenu,
  validateCreateReport,
  validateUpdateReport,
  validateCreateSchool,
  validateCreateUser,
  validateCreateTeam,
  validateIdParam
};
