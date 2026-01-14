import { useState, useEffect } from 'react';
import { MdReport, MdSend, MdCheck, MdPerson, MdSchool, MdDescription, MdRestaurantMenu } from 'react-icons/md';
import { reportApi } from '../../services/api';
import axios from 'axios';

interface Menu {
  id: number;
  nama_menu: string;
}

export default function UserLaporan() {
  const [user, setUser] = useState<any>(null);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [formData, setFormData] = useState({
    nama_pelapor: '',
    asal_sekolah: '',
    isi_laporan: '',
    menu_id: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const u = JSON.parse(storedUser);
        setUser(u);
        setFormData(prev => ({
            ...prev,
            nama_pelapor: u.username || '', // Assuming username is name
            asal_sekolah: u.school_name || ''
        }));
    }

    // Fetch menus
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/menus');
        setMenus(res.data);
    } catch (err) {
        console.error("Gagal load menu");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama_pelapor || !formData.asal_sekolah || !formData.isi_laporan) {
      setError('Semua field harus diisi');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await reportApi.create({
          ...formData,
          menu_id: formData.menu_id ? parseInt(formData.menu_id) : undefined
      });
      setSuccess(true);
      setFormData({ 
          nama_pelapor: user?.username || '', 
          asal_sekolah: user?.school_name || '', 
          isi_laporan: '',
          menu_id: ''
      });
    } catch (err) {
      setError('Gagal mengirim laporan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fade-in" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          <MdCheck style={{ fontSize: '48px', color: 'var(--primary)' }} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
          Laporan Terkirim!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px', maxWidth: '400px' }}>
          Terima kasih atas laporanmu. Tim kami akan segera meninjau dan menindaklanjuti.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => setSuccess(false)}
        >
          Buat Laporan Baru
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <MdReport style={{ fontSize: '48px', color: 'var(--secondary)', marginBottom: '12px' }} />
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 700, 
          color: 'var(--secondary-dark)',
          marginBottom: '8px'
        }}>
          Form Laporan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Laporkan keluhan atau masukan terkait program makan bergizi
        </p>
      </div>

      {/* Form */}
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdPerson style={{ color: 'var(--primary)' }} />
              Nama Lengkap
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Masukkan nama lengkap kamu"
              value={formData.nama_pelapor}
              onChange={(e) => setFormData({ ...formData, nama_pelapor: e.target.value })}
              readOnly={!!user} // Read only if logged in
            />
          </div>

          {/* Sekolah */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdSchool style={{ color: 'var(--primary)' }} />
              Asal Sekolah
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: SMP Negeri 1 Semarang"
              value={formData.asal_sekolah}
              onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
              readOnly={!!user}
            />
          </div>

          {/* Menu Selection */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdRestaurantMenu style={{ color: 'var(--primary)' }} />
              Terkait Menu (Opsional)
            </label>
            <select
              className="form-input"
              value={formData.menu_id}
              onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
            >
                <option value="">-- Pilih Menu (Jika ada keluhan spesifik) --</option>
                {menus.map(menu => (
                    <option key={menu.id} value={menu.id}>
                        {menu.nama_menu}
                    </option>
                ))}
            </select>
          </div>

          {/* Laporan */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MdDescription style={{ color: 'var(--primary)' }} />
              Isi Laporan
            </label>
            <textarea
              className="form-input form-textarea"
              placeholder="Tuliskan laporan, keluhan, atau masukan kamu tentang program makan bergizi..."
              value={formData.isi_laporan}
              onChange={(e) => setFormData({ ...formData, isi_laporan: e.target.value })}
              style={{ minHeight: '150px' }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '12px 16px',
              background: '#FFEBEE',
              borderRadius: '8px',
              color: 'var(--error)',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%' }}
          >
            {submitting ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                Mengirim Laporan...
              </>
            ) : (
              <>
                <MdSend />
                Kirim Laporan
              </>
            )}
          </button>
        </form>

        {/* Privacy Note */}
        <p style={{ 
          fontSize: '13px', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: '20px'
        }}>
          Laporan kamu akan ditinjau oleh tim pengelola program MBG
        </p>
      </div>
    </div>
  );
}
