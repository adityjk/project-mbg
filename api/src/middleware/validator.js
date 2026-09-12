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
  body('nama_menu').trim().notEmpty().withMessage('Nama menu wajib diisi').isLength({ max: 200 }).withMessage('Nama menu maksimal 200 karakter'),
  body('deskripsi').optional().isString().withMessage('Deskripsi harus teks'),
  body('kalori').optional().isFloat({ min: 0 }).withMessage('Kalori harus angka positif'),
  body('karbohidrat').optional().isFloat({ min: 0 }).withMessage('Karbohidrat harus angka positif'),
  body('protein').optional().isFloat({ min: 0 }).withMessage('Protein harus angka positif'),
  body('lemak').optional().isFloat({ min: 0 }).withMessage('Lemak harus angka positif'),
  body('serat').optional().isFloat({ min: 0 }).withMessage('Serat harus angka positif'),
  body('jumlah_porsi').optional().isInt({ min: 0 }).withMessage('Jumlah porsi harus angka positif'),
  body('porsi').optional().isIn(['besar', 'kecil']).withMessage('Porsi tidak valid'),
  handleValidation
];

const validateUpdateMenu = [
  body('nama_menu').optional().trim().notEmpty().withMessage('Nama menu tidak boleh kosong').isLength({ max: 200 }),
  body('deskripsi').optional({ values: 'null' }).isString(),
  body('kalori').optional({ values: 'null' }).isFloat({ min: 0 }).withMessage('Kalori harus angka positif'),
  body('karbohidrat').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('protein').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('lemak').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('serat').optional({ values: 'null' }).isFloat({ min: 0 }),
  body('jumlah_porsi').optional({ values: 'null' }).isInt({ min: 0 }),
  body('porsi').optional().isIn(['besar', 'kecil']).withMessage('Porsi tidak valid'),
  body('location').optional({ values: 'null' }).isString(),
  handleValidation
];

// ========== REPORT VALIDATORS ==========

const validateCreateReport = [
  body('nama_pelapor').trim().notEmpty().withMessage('Nama pelapor wajib diisi'),
  body('asal_sekolah').trim().notEmpty().withMessage('Asal sekolah wajib diisi'),
  body('isi_laporan').trim().notEmpty().withMessage('Isi laporan wajib diisi'),
  body('menu_id').optional({ values: 'null' }).isInt({ min: 1 }).withMessage('ID menu tidak valid'),
  body('kategori').optional().isIn(['umum', 'kualitas_makanan', 'distribusi', 'kebersihan', 'lainnya']).withMessage('Kategori tidak valid'),
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

const validateUpdateSchool = [
  body('nama_sekolah').optional().trim().notEmpty().withMessage('Nama sekolah tidak boleh kosong'),
  body('latitude').optional().isFloat().withMessage('Latitude harus angka'),
  body('longitude').optional().isFloat().withMessage('Longitude harus angka'),
  body('jumlah_siswa').optional({ values: 'null' }).isInt({ min: 0 }).withMessage('Jumlah siswa harus angka positif'),
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
  body('deskripsi').optional({ values: 'null' }).isString(),
  body('email').optional({ values: 'null' }).isEmail().withMessage('Format email tidak valid'),
  body('telepon').optional({ values: 'null' }).isString(),
  body('urutan').optional().isInt({ min: 0 }).withMessage('Urutan harus angka positif'),
  body('is_active').optional().isBoolean().withMessage('Status harus boolean'),
  handleValidation
];

const validateUpdateTeam = [
  body('nama').optional().trim().notEmpty().withMessage('Nama tidak boleh kosong'),
  body('jabatan').optional().trim().notEmpty().withMessage('Jabatan tidak boleh kosong'),
  body('deskripsi').optional({ values: 'null' }).isString(),
  body('email').optional({ values: 'null' }).isEmail().withMessage('Format email tidak valid'),
  body('telepon').optional({ values: 'null' }).isString(),
  body('urutan').optional({ values: 'null' }).isInt({ min: 0 }).withMessage('Urutan harus angka positif'),
  body('is_active').optional().isBoolean().withMessage('Status harus boolean'),
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
  validateUpdateMenu,
  validateCreateReport,
  validateUpdateReport,
  validateCreateSchool,
  validateUpdateSchool,
  validateCreateUser,
  validateCreateTeam,
  validateUpdateTeam,
  validateIdParam
};
