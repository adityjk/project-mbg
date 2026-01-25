import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

/**
 * Admin page that lists all users.
 * It calls the protected endpoint /api/admin/users.
 */
export default function UserManagement() {
  const [users, setUsers] = useState<Array<{ id: number; username: string; school_name: string; role: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [role, setRole] = useState('user');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal memuat data pengguna');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('/api/admin/users', {
        username,
        password,
        school_name: schoolName,
        role
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('User berhasil dibuat!');
      setUsername('');
      setPassword('');
      setSchoolName('');
      setRole('user');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menghapus user');
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-secondary">KELOLA PENGGUNA</h1>
      
      {/* Create User Form */}
      <div className="bg-base-100 p-6 rounded-3xl border-4 border-neutral shadow-neo mb-8">
        <h2 className="text-xl font-bold mb-4">Tambah Pengguna Baru</h2>
        {error && <div className="bg-error text-white p-3 rounded-xl border-2 border-neutral mb-4 font-bold">{error}</div>}
        {success && <div className="bg-success text-white p-3 rounded-xl border-2 border-neutral mb-4 font-bold">{success}</div>}
        
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-primary transition-colors"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block font-bold mb-1">Nama Sekolah</label>
            <input 
              type="text" 
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Role</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option value="user">User (Siswa/Guru)</option>
              <option value="petugas gizi">Petugas Gizi</option>
              <option value="petugas pengaduan">Petugas Pengaduan</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-primary text-base-100 font-bold py-2 px-6 rounded-xl border-2 border-neutral hover:shadow-neo-sm transition-all shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none w-full md:w-auto">
              + Tambah Pengguna
            </button>
          </div>
        </form>
      </div>

      <div className="bg-base-100 rounded-3xl border-4 border-neutral shadow-neo overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-base-200 border-b-4 border-neutral text-base-content">
              <tr>
                <th className="p-4 font-black">ID</th>
                <th className="p-4 font-black">Username</th>
                <th className="p-4 font-black">Sekolah</th>
                <th className="p-4 font-black">Role</th>
                <th className="p-4 font-black">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-base-200 transition-colors">
                  <td className="p-4 font-bold">#{u.id}</td>
                  <td className="p-4 font-medium">{u.username}</td>
                  <td className="p-4 font-medium">{u.school_name}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg border-2 border-neutral text-xs font-black uppercase ${
                      u.role === 'admin' ? 'bg-secondary text-neutral' :
                      u.role === 'petugas gizi' ? 'bg-success text-white' :
                      u.role === 'petugas pengaduan' ? 'bg-accent text-white' :
                      'bg-base-300'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="bg-error text-white px-3 py-1 rounded-lg border-2 border-neutral font-bold text-sm hover:scale-105 transition-transform"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
