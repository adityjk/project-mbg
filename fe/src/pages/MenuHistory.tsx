import { useEffect, useState } from 'react';
import { MdHistory, MdDelete, MdRestaurantMenu } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';

export default function MenuHistory() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuApi.getAll();
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus menu ini?')) return;
    
    setDeleting(id);
    try {
      await menuApi.delete(id);
      setMenus(menus.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete menu:', error);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <MdHistory style={{ color: 'var(--accent)' }} />
          Riwayat Menu
        </h1>
        <p className="page-subtitle">Daftar semua menu yang sudah dianalisis</p>
      </div>

      {menus.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <MdRestaurantMenu className="empty-icon" />
            <p className="empty-title">Belum ada riwayat menu</p>
            <p className="empty-text">Mulai dengan menganalisis foto menu baru</p>
          </div>
        </div>
      ) : (
        <div className="grid-3">
          {menus.map((menu) => (
            <div key={menu.id} className="menu-card">
              <div 
                className="menu-card-image"
                style={{
                  backgroundImage: menu.foto_url 
                    ? `url(http://localhost:5000${menu.foto_url})` 
                    : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {!menu.foto_url && (
                  <MdRestaurantMenu style={{ fontSize: '48px', color: 'var(--primary-light)' }} />
                )}
              </div>
              
              <div className="menu-card-content">
                <h3 className="menu-card-title">{menu.nama_menu}</h3>
                <p className="menu-card-desc">{menu.deskripsi || 'Tidak ada deskripsi'}</p>
                
                <div className="menu-card-badges">
                  <span className="badge badge-kalori">{menu.kalori} kkal</span>
                  <span className="badge badge-protein">{menu.protein}g protein</span>
                  <span className="badge badge-porsi">{menu.jumlah_porsi} porsi {menu.porsi}</span>
                </div>

                {/* Nutrition Details */}
                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Karbohidrat:</span>
                      <span style={{ marginLeft: '4px', fontWeight: 600 }}>{menu.karbohidrat}g</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Lemak:</span>
                      <span style={{ marginLeft: '4px', fontWeight: 600 }}>{menu.lemak}g</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Serat:</span>
                      <span style={{ marginLeft: '4px', fontWeight: 600 }}>{menu.serat}g</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)' }}>Protein:</span>
                      <span style={{ marginLeft: '4px', fontWeight: 600 }}>{menu.protein}g</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ 
                  marginTop: '16px', 
                  paddingTop: '12px', 
                  borderTop: '1px solid #E8F0E8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {formatDate(menu.created_at)}
                  </span>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(menu.id)}
                    disabled={deleting === menu.id}
                  >
                    {deleting === menu.id ? '...' : <MdDelete />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
