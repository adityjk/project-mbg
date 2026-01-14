import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaSchool, FaLock } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    school_name: '',
    password: '',
    confirmPassword: ''
  });
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
      await axios.post('http://localhost:5000/api/register', {
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6 text-primary">Daftar Akun</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Lengkap</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Masukkan nama lengkap" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nama Sekolah</span>
              </label>
              <div className="relative">
                <FaSchool className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Masukkan nama sekolah" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.school_name}
                  onChange={e => setFormData({...formData, school_name: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Buat password" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Konfirmasi Password</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Ulangi password" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            {error && <p className="text-error text-sm text-center">{error}</p>}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Sudah punya akun? <Link to="/login" className="link link-primary">Login disini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
