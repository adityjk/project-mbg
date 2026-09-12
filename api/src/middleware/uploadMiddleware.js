// Shared multer upload wrapper
// Handles multer errors consistently across all routes
const uploadMiddleware = (multerInstance) => (req, res, next) => {
  const uploadSingle = multerInstance.single('image');
  uploadSingle(req, res, (err) => {
    if (err) {
      console.error('[CRITICAL] Multer Upload Error:', err.message);
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ error: "Gagal upload gambar: " + err.message });
    }
    next();
  });
};

module.exports = { uploadMiddleware };