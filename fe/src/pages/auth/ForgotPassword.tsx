import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMail, MdArrowBack, MdCheck, MdVpnKey } from 'react-icons/md';
import api from '../../services/api';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/forgot-password', { username });
      setSuccess(true);
      // In dev mode, the token will be returned
      if (response.data.token) {
        setToken(response.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Terjadi kesalahan saat memproses permintaan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral font-sans p-4 relative overflow-hidden">
      
      {/* Soft Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-warning/5 via-neutral to-primary/5 pointer-events-none"></div>

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
                <div className="w-20 h-20 mx-auto bg-warning/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-warning/20">
                  <MdVpnKey className="text-warning text-4xl" />
                </div>
                <h1 className="text-2xl font-display font-bold text-base-content mb-2">Lupa Password?</h1>
                <p className="text-muted-themed font-medium text-sm px-4">
                  Jangan khawatir. Masukkan username Anda untuk mendapatkan token reset password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Username</label>
                  <div className="relative">
                    <MdMail className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50" />
                    <input
                      type="text"
                      className="input w-full pl-12 h-14 rounded-2xl border-transparent bg-base-200 focus:bg-base-100 focus:ring-2 focus:ring-warning/20 focus:border-warning/50 transition-all font-medium text-base-content"
                      placeholder="Masukkan username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
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
                  className="btn w-full h-14 bg-gradient-to-r from-warning to-orange-400 hover:from-warning/90 hover:to-orange-500 text-white border-none rounded-2xl font-bold text-lg shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all"
                >
                  {loading ? (
                    <span className="loading loading-dots"></span>
                  ) : (
                    'Minta Token Reset'
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-success/20"
              >
                <MdCheck className="text-success text-5xl" />
              </motion.div>
              <h2 className="text-2xl font-display font-bold text-base-content mb-2">Token Terkirim!</h2>
              <p className="text-base-content/70 font-medium text-sm mb-8 px-2">
                {token 
                  ? 'Gunakan token di bawah ini untuk mereset password Anda:' 
                  : 'Silakan hubungi admin sekolah Anda untuk mendapatkan token reset password.'}
              </p>
              
              {token && (
                <div className="bg-base-200 rounded-2xl p-6 mb-8 border border-neutral/10 border-dashed">
                  <div className="text-xs font-bold text-base-content/50 uppercase tracking-wider mb-2">TOKEN RESET ANDA</div>
                  <div className="text-4xl font-black font-mono tracking-widest text-primary select-all cursor-pointer hover:text-primary/80 transition-colors">
                    {token}
                  </div>
                  <div className="text-xs font-medium text-error mt-3 bg-error/5 inline-block px-3 py-1 rounded-full">
                    ⚠️ Token berlaku selama 1 jam
                  </div>
                </div>
              )}

              <Link to="/reset-password" className="btn w-full h-14 bg-primary text-white border-none rounded-2xl font-bold text-lg shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all">
                Lanjut ke Reset Password
              </Link>
            </div>
          )}

          <div className="mt-8 text-center pt-6 border-t border-dashed border-neutral/20">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-base-content/70 hover:text-primary transition-colors hover:underline">
              <MdArrowBack /> Kembali ke Halaman Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
