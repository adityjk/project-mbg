import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { FaUser, FaSchool, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdPersonAdd, MdHome, MdArrowForward } from 'react-icons/md';
import ThemeToggle from '../../components/ThemeToggle';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    school_name: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak sama');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await authApi.register({
        username: formData.username,
        school_name: formData.school_name,
        password: formData.password
      });
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mendaftar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans selection:bg-black selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
      
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary rounded-full blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

       {/* Navbar Simple */}
       <nav className="absolute top-0 left-0 w-full p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
         <Link to="/" className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border-2 border-neutral shadow-neo-sm hover:scale-105 transition-transform">
            <MdHome size={24} />
            <span className="font-bold hidden md:inline">Kembali</span>
         </Link>
         <div className="flex items-center gap-4">
             <div className="font-black text-xl text-neutral">MBG<span className="text-primary">.GO</span></div>
             <ThemeToggle />
         </div>
      </nav>

      <div className="card w-full max-w-md bg-base-100 border-2 border-neutral shadow-neo rounded-[2.5rem] overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
             <div className="w-24 h-24 bg-accent text-neutral rounded-full flex items-center justify-center mx-auto mb-6 shadow-neo-sm border-2 border-neutral">
               <MdPersonAdd className="text-5xl" />
             </div>
             <h2 className="text-4xl font-black text-neutral mb-2 uppercase tracking-tight">REGISTRASI</h2>
             <p className="font-bold text-gray-500">Gabung untuk akses menu & laporan</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label font-bold text-neutral text-sm uppercase tracking-wider ml-1 mb-1">Nama Lengkap</label>
              <div className="relative group">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neutral transition-colors z-10" />
                <input 
                  type="text" 
                  placeholder="Contoh: Budi Santoso" 
                  className="input w-full pl-12 pr-4 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-neutral text-sm uppercase tracking-wider ml-1 mb-1">Nama Sekolah</label>
              <div className="relative group">
                 <FaSchool className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neutral transition-colors z-10" />
                 <input 
                   type="text" 
                   placeholder="Contoh: SPP Siwalan" 
                   className="input w-full pl-12 pr-4 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal" 
                   value={formData.school_name}
                   onChange={e => setFormData({...formData, school_name: e.target.value})}
                   required
                 />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-neutral text-sm uppercase tracking-wider ml-1 mb-1">Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neutral transition-colors z-10" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Buat password aman" 
                  className="input w-full pl-12 pr-12 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neutral transition-colors z-10"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label className="label font-bold text-neutral text-sm uppercase tracking-wider ml-1 mb-1">Konfirmasi Password</label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neutral transition-colors z-10" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password" 
                  className="input w-full pl-12 pr-12 h-12 rounded-xl border-2 border-neutral bg-base-100 focus:shadow-neo-sm focus:outline-none transition-all font-bold placeholder:font-normal" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
                 <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neutral transition-colors z-10"
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl font-bold flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" className="btn w-full h-14 bg-black text-white hover:bg-neutral-800 border-2 border-transparent rounded-xl font-black text-lg shadow-neo-sm hover:shadow-none hover:scale-[0.99] transition-all flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner text-white"></span>
              ) : (
                <>DAFTAR SEKARANG <MdArrowForward /></>
              )}
            </button>
          </form>

          <div className="text-center mt-8 pt-6 border-t-2 border-dashed border-gray-200">
            <p className="font-bold text-gray-500">
              Sudah punya akun? <Link to="/login" className="text-neutral underline decoration-2 decoration-accent underline-offset-4 hover:decoration-black transition-all">Login disini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
