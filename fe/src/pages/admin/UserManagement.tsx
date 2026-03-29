import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdVisibility, MdVisibilityOff, MdCheck, MdClose } from 'react-icons/md';
import { useConfirmDialog } from '../../components/ConfirmDialog';

/**
 * Admin page that lists all users.
 * It calls the protected endpoint /api/admin/users.
 */
export default function UserManagement() {
  const [users, setUsers] = useState<Array<{ id: number; username: string; school_name: string; role: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { showConfirm, DialogComponent } = useConfirmDialog();

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
      setTimeout(() => setError(null), 3000);
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
      setTimeout(() => setSuccess(null), 3000);
      setUsername('');
      setPassword('');
      setSchoolName('');
      setRole('user');
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat user');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteUser = (id: number) => {
    showConfirm({
      title: 'Hapus User',
      message: 'Apakah kamu yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: async () => {
        try {
          await axios.delete(`/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSuccess('User berhasil dihapus!');
          setTimeout(() => setSuccess(null), 3000);
          fetchUsers();
        } catch (err: any) {
          setError(err.response?.data?.error || 'Gagal menghapus user');
          setTimeout(() => setError(null), 3000);
        }
      },
    });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto fade-in">
      <h1 className="text-3xl font-black mb-8 text-base-content">KELOLA PENGGUNA</h1>
      
      {/* Create User Form */}
      <div className="bg-base-100 p-6 rounded-3xl border-4 border-neutral shadow-neo mb-8">
        <h2 className="text-xl font-bold mb-4 text-base-content">Tambah Pengguna Baru</h2>
        {/* Inline alerts removed in favor of Toasts, or keep if preferred? 
            Let's keep them hidden if using toasts, or just use toasts. 
            The requirement was specific about deletion notification, but usually unify UI.
            I will remove inline alerts to clean up and rely on Toasts. 
        */}
        
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-1 text-base-content">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-base-content">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary pr-10 bg-base-100 text-base-content"
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
            <label className="block font-bold mb-1 text-base-content">Nama Sekolah</label>
            <input 
              type="text" 
              value={schoolName}
              onChange={e => setSchoolName(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-1 text-base-content">Role</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full p-2 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary bg-base-100 text-base-content"
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
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
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

        {/* Mobile View (Cards) */}
        <div className="md:hidden p-4 space-y-4">
          {users.map((u) => (
            <div key={u.id} className="bg-base-200 p-4 rounded-xl border-2 border-neutral">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-lg leading-tight">{u.username}</div>
                  <div className="text-xs font-mono text-muted-themed mt-0.5">ID: #{u.id}</div>
                </div>
                <span className={`px-2 py-1 rounded-md border border-neutral text-[10px] font-black uppercase ${
                  u.role === 'admin' ? 'bg-secondary text-neutral' :
                  u.role === 'petugas gizi' ? 'bg-success text-white' :
                  u.role === 'petugas pengaduan' ? 'bg-accent text-white' :
                  'bg-base-300'
                }`}>
                  {u.role.replace('_', ' ')}
                </span>
              </div>
              
              <div className="text-sm mb-4">
                <span className="font-bold text-muted-themed block text-xs uppercase mb-1">Sekolah</span>
                {u.school_name}
              </div>

              <button 
                onClick={() => handleDeleteUser(u.id)}
                className="w-full bg-error text-white py-2 rounded-lg border-2 border-neutral font-bold text-sm flex items-center justify-center gap-2 active:bg-error/80"
              >
                Hapus User
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Notifications */}
      {success && (
        <div className="fixed bottom-8 right-8 bg-success text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdCheck className="text-base-100" size={24} /> {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 bg-error text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdClose className="text-base-100" size={24} /> {error}
        </div>
      )}

      {/* Confirm Dialog */}
      {DialogComponent}
    </div>
  );
}
