import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdRestaurantMenu, MdHome, MdArrowForward } from 'react-icons/md';
import ThemeToggle from '../../components/ThemeToggle';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const intendedRole = location.state?.role || 'user'; // Default to user if direct access

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login(formData);
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (['admin', 'petugas gizi', 'petugas pengaduan'].includes(user.role)) {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login gagal. Periksa username dan password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Soft Gradient Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

       {/* Navbar Simple */}
       <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
         <Link to="/" className="flex items-center gap-2 bg-base-100/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-sm hover:shadow-md transition-all text-base-content hover:-translate-y-0.5">
            <MdHome size={24} className="text-primary" />
            <span className="font-bold hidden md:inline">Kembali</span>
         </Link>
         <div className="flex items-center gap-4">
            <div className="font-display font-bold text-xl text-base-content">MBG<span className="text-primary">.GO</span></div>
            <ThemeToggle />
         </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="card w-full max-w-md bg-base-100 shadow-soft-lg rounded-[2.5rem] overflow-hidden relative z-10 border border-neutral/10"
      >
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-soft transition-transform hover:scale-105 ${intendedRole === 'admin' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'}`}>
              <MdRestaurantMenu className="text-5xl" />
            </div>
            <h2 className="text-3xl font-display font-bold text-base-content mb-2 tracking-tight">
                {intendedRole === 'admin' ? 'Login Admin' : 'Login Siswa'}
            </h2>
            <p className="text-muted-themed font-medium px-4">
              Selamat datang kembali! Silakan masuk untuk melanjutkan.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Username</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-themed group-focus-within:text-primary transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="Masukkan username" 
                  className="input w-full pl-12 pr-4 h-14 rounded-2xl border-transparent bg-base-200 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:font-normal text-base-content" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-base-content text-xs uppercase tracking-wider ml-1 mb-1.5 opacity-70">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-themed group-focus-within:text-primary transition-colors z-10" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password" 
                  className="input w-full pl-12 pr-12 h-14 rounded-2xl border-transparent bg-base-200 focus:bg-base-100 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium placeholder:font-normal text-base-content" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-themed hover:text-base-content transition-colors z-10 p-2 rounded-full hover:bg-base-200"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error/5 border border-error/20 text-error px-4 py-3 rounded-xl font-medium text-sm flex items-start gap-2"
              >
                <div className="mt-0.5">⚠️</div>
                <div>{error}</div>
              </motion.div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                className="btn w-full h-14 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white border-none rounded-2xl font-bold text-lg shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-dots text-white"></span>
                ) : (
                  <>Masuk Sekarang <MdArrowForward /></>
                )}
              </button>
            </div>

            <div className="text-center mt-4">
              <Link to="/forgot-password" className="text-sm font-bold text-muted-themed hover:text-primary transition-colors">
                Lupa Password?
              </Link>
            </div>
          </form>

          {intendedRole !== 'admin' && (
            <div className="text-center mt-8 pt-6 border-t border-dashed border-neutral/20">
                <p className="font-medium text-muted-themed text-sm">
                Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">Daftar Gratis</Link>
                </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
