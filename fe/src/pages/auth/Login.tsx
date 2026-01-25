import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authApi } from '../../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdRestaurantMenu, MdHome, MdArrowForward } from 'react-icons/md';
import ThemeToggle from '../../components/ThemeToggle';

// Force Update
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
    <div className="min-h-screen bg-base-100 font-sans selection:bg-primary selection:text-base-100 relative overflow-hidden flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

       {/* Navbar Simple */}
       <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
         <Link to="/" className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border-2 border-neutral shadow-neo-sm hover:scale-105 transition-transform text-base-content">
            <MdHome size={24} />
            <span className="font-bold hidden md:inline">Kembali</span>
         </Link>
         <div className="flex items-center gap-4">
            <div className="font-black text-xl text-base-content">MBG<span className="text-primary">.GO</span></div>
            <ThemeToggle />
         </div>
      </nav>

      <div className="card w-full max-w-md bg-base-100 border-2 border-neutral shadow-neo rounded-[2.5rem] overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neo-sm border-2 border-neutral ${intendedRole === 'admin' ? 'bg-warning' : 'bg-primary'}`}>
              <MdRestaurantMenu className="text-5xl text-base-100" />
            </div>
            <h2 className="text-4xl font-black text-base-content mb-2 uppercase tracking-tight">
                {intendedRole === 'admin' ? 'ADMIN LOGIN' : 'LOGIN AREA'}
            </h2>
            <p className="font-bold text-muted-themed">Silakan masuk untuk melanjutkan akses.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label font-bold text-base-content text-sm uppercase tracking-wider ml-1 mb-1">Username</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-themed group-focus-within:text-base-content transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="Masukkan username Anda" 
                  className="input w-full pl-12 pr-4 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal text-base-content" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-base-content text-sm uppercase tracking-wider ml-1 mb-1">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-themed group-focus-within:text-base-content transition-colors z-10" />
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda" 
                  className="input w-full pl-12 pr-12 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal text-base-content" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-themed hover:text-base-content transition-colors z-10"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-error/10 border-2 border-error text-error px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn w-full h-14 bg-primary text-base-100 hover:bg-primary/90 border-2 border-neutral rounded-xl font-black text-lg shadow-neo-sm hover:shadow-none hover:scale-[0.99] transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner text-base-100"></span>
              ) : (
                <>MASUK SEKARANG <MdArrowForward /></>
              )}
            </button>
          </form>

          {intendedRole !== 'admin' && (
            <div className="text-center mt-8 pt-6 border-t-2 border-dashed border-base-300">
                <p className="font-bold text-muted-themed">
                Belum punya akun? <Link to="/register" className="text-base-content underline decoration-2 decoration-primary underline-offset-4 hover:decoration-secondary transition-all">Daftar Gratis</Link>
                </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs font-bold text-muted-themed uppercase tracking-widest">
            © 2026 Badan Gizi Nasional
      </div>
    </div>
  );
};

export default Login;
