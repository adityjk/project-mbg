import { useEffect, useState } from 'react';
import { MdRestaurantMenu, MdLocalFireDepartment, MdGrain, MdFitnessCenter, MdWaterDrop, MdGrass, MdCalendarToday } from 'react-icons/md';
import { menuApi } from '../../services/api';
import type { Menu } from '../../types';

export default function MenuHariIni() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMenus();
  }, []);

  const fetchTodayMenus = async () => {
    try {
      const response = await menuApi.getAll();
      // Filter menus from today (or show all for demo)
      const today = new Date().toDateString();
      const todayMenus = response.data.filter(menu => 
        new Date(menu.created_at).toDateString() === today
      );
      // If no menus today, show the most recent ones
      setMenus(todayMenus.length > 0 ? todayMenus : response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Date Header */}
      <div style={{
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        borderRadius: '20px',
        padding: '32px',
        marginBottom: '32px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <MdCalendarToday style={{ color: 'var(--primary)' }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{formatDate()}</span>
        </div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 700, 
          color: 'var(--primary-dark)',
          marginBottom: '8px'
        }}>
          Menu Makan Bergizi Hari Ini
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Menu sehat dan bergizi untuk siswa-siswi
        </p>
      </div>

      {/* Menu Cards */}
      {menus.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px' }}>
          <MdRestaurantMenu style={{ fontSize: '80px', color: 'var(--text-muted)', marginBottom: '24px' }} />
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Belum Ada Menu Hari Ini</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Menu akan segera diupload oleh admin. Silakan cek kembali nanti.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {menus.map((menu) => (
            <div 
              key={menu.id} 
              className="card"
              style={{ 
                display: 'grid',
                gridTemplateColumns: menu.foto_url ? '300px 1fr' : '1fr',
                gap: '32px',
                overflow: 'hidden',
                padding: 0
              }}
            >
              {/* Image */}
              {menu.foto_url && (
                <div style={{
                  height: '280px',
                  backgroundImage: `url(http://localhost:5000${menu.foto_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} />
              )}
              
              {/* Content */}
              <div style={{ padding: '32px', paddingLeft: menu.foto_url ? 0 : '32px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <span className="badge badge-porsi" style={{ marginBottom: '8px' }}>
                    {menu.jumlah_porsi} Porsi {menu.porsi === 'besar' ? 'Besar' : 'Kecil'}
                  </span>
                  <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
                    {menu.nama_menu}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6 }}>
                    {menu.deskripsi || 'Menu makanan bergizi untuk mendukung pertumbuhan dan konsentrasi belajar siswa.'}
                  </p>
                </div>

                {/* Nutrition Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '12px',
                  marginTop: '24px'
                }}>
                  <div className="nutrition-item kalori">
                    <MdLocalFireDepartment style={{ fontSize: '24px', color: '#FF7043', marginBottom: '4px' }} />
                    <div className="nutrition-value">{menu.kalori}</div>
                    <div className="nutrition-label">Kalori</div>
                    <div className="nutrition-unit">kkal</div>
                  </div>
                  <div className="nutrition-item karbohidrat">
                    <MdGrain style={{ fontSize: '24px', color: '#FFB300', marginBottom: '4px' }} />
                    <div className="nutrition-value">{menu.karbohidrat}</div>
                    <div className="nutrition-label">Karbohidrat</div>
                    <div className="nutrition-unit">gram</div>
                  </div>
                  <div className="nutrition-item protein">
                    <MdFitnessCenter style={{ fontSize: '24px', color: '#5C6BC0', marginBottom: '4px' }} />
                    <div className="nutrition-value">{menu.protein}</div>
                    <div className="nutrition-label">Protein</div>
                    <div className="nutrition-unit">gram</div>
                  </div>
                  <div className="nutrition-item lemak">
                    <MdWaterDrop style={{ fontSize: '24px', color: '#EC407A', marginBottom: '4px' }} />
                    <div className="nutrition-value">{menu.lemak}</div>
                    <div className="nutrition-label">Lemak</div>
                    <div className="nutrition-unit">gram</div>
                  </div>
                  <div className="nutrition-item serat">
                    <MdGrass style={{ fontSize: '24px', color: '#66BB6A', marginBottom: '4px' }} />
                    <div className="nutrition-value">{menu.serat}</div>
                    <div className="nutrition-label">Serat</div>
                    <div className="nutrition-unit">gram</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div style={{
        marginTop: '32px',
        padding: '24px',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'white',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <MdLocalFireDepartment style={{ fontSize: '24px', color: 'var(--secondary)' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>Tentang Program MBG</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Program Makan Bergizi Gratis menyediakan makanan sehat dan bergizi untuk mendukung tumbuh kembang dan konsentrasi belajar siswa-siswi Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
