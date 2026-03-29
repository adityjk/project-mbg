import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdLock, MdArrowBack, MdCheck, MdVisibility, MdVisibilityOff, MdVpnKey } from 'react-icons/md';
import api from '../../services/api';
import { motion } from 'framer-motion';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Password konfirmasi tidak cocok');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      await api.post('/reset-password', {
        username: formData.username,
        token: formData.token,
        newPassword: formData.newPassword
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat mereset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral font-sans p-4 relative overflow-hidden">
      
      {/* Soft Background */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/5 via-neutral to-warning/5 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-base-100 rounded-[2.5rem] shadow-soft-lg p-8 md:p-10 border border-neutral/10">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-primary/20">
                  <MdLock className="text-primary text-4xl" />
                </div>
                <h1 className="text-2xl font-display font-bold text-base-content mb-2">Reset Password</h1>
                <p className="text-muted-themed font-medium text-sm px-4">
                  Masukkan token yang Anda terima dan buat password baru yang aman.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Username</label>
                  <input
                    type="text"
                    className="input w-full h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-base-content px-5"
                    placeholder="Masukkan username Anda"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Token Reset</label>
                  <div className="relative">
                    <MdVpnKey className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-themed" />
                    <input
                      type="text"
                      className="input w-full pl-12 h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono font-bold tracking-widest text-center text-lg text-primary placeholder:font-sans placeholder:tracking-normal placeholder:font-normal placeholder:text-muted-themed placeholder:text-base"
                      placeholder="Contoh: 123456"
                      maxLength={6}
                      value={formData.token}
                      onChange={(e) => setFormData({ ...formData, token: e.target.value.replace(/\D/g, '') })}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Password Baru</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input w-full pr-12 h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-base-content px-5"
                      placeholder="Minimal 6 karakter"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-themed hover:text-primary transition-colors hover:bg-base-200 rounded-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Konfirmasi Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input w-full h-14 rounded-2xl border-transparent bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-base-content px-5"
                    placeholder="Ulangi password baru"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error/5 border border-error/20 text-error px-4 py-3 rounded-xl font-medium text-sm flex items-start gap-2"
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white border-none rounded-2xl font-bold text-lg shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all"
                >
                  {loading ? (
                    <span className="loading loading-dots"></span>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-success/20"
              >
                <MdCheck className="text-success text-5xl" />
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-base-content mb-2">Password Direset!</h2>
              <p className="text-muted-themed font-medium text-sm mb-6 px-4">
                Password Anda berhasil diperbarui. Anda akan dialihkan ke halaman login sejenak lagi...
              </p>
              <div className="loading loading-spinner loading-md text-primary"></div>
            </div>
          )}

          <div className="mt-8 text-center pt-6 border-t border-dashed border-neutral/20">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-muted-themed hover:text-primary transition-colors hover:underline">
              <MdArrowBack /> Kembali ke Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
