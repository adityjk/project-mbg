import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/login', formData);
      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6 text-primary">Login MBG</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Masukkan username" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
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
                  placeholder="Masukkan password" 
                  className="input input-bordered w-full pl-10" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            {error && <p className="text-error text-sm text-center">{error}</p>}

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Belum punya akun? <Link to="/register" className="link link-primary">Daftar disini</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
