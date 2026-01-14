import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MdRestaurantMenu, 
  MdPeople, 
  MdPending,
  MdLocalFireDepartment,
  MdArrowForward
} from 'react-icons/md';
import { statsApi, menuApi } from '../services/api';
import type { DashboardStats, Menu } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMenus, setRecentMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, menusRes] = await Promise.all([
          statsApi.getDashboard(),
          menuApi.getAll()
        ]);
        setStats(statsRes.data);
        setRecentMenus(menusRes.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <MdLocalFireDepartment style={{ color: 'var(--secondary)' }} />
          Dashboard
        </h1>
        <p className="page-subtitle">Selamat datang di Program Makan Bergizi Gratis</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="stat-card">
          <div className="stat-icon green">
            <MdRestaurantMenu />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalMenus || 0}</h3>
            <p>Total Menu</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <MdLocalFireDepartment />
          </div>
          <div className="stat-content">
            <h3>{Math.round(stats?.avgKalori || 0)}</h3>
            <p>Rata-rata Kalori</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <MdPeople />
          </div>
          <div className="stat-content">
            <h3>{stats?.totalPorsi || 0}</h3>
            <p>Total Porsi</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <MdPending />
          </div>
          <div className="stat-content">
            <h3>{stats?.pendingReports || 0}</h3>
            <p>Laporan Pending</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Menus */}
      <div className="grid-2">
        {/* Quick Actions */}
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Aksi Cepat</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/analyze" className="btn btn-primary" style={{ justifyContent: 'space-between' }}>
              <span>Analisis Menu Baru</span>
              <MdArrowForward />
            </Link>
            <Link to="/reports" className="btn btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span>Lihat Laporan</span>
              <MdArrowForward />
            </Link>
            <Link to="/history" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
              <span>Riwayat Menu</span>
              <MdArrowForward />
            </Link>
          </div>
        </div>

        {/* Recent Menus */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px' }}>Menu Terbaru</h2>
            <Link to="/history" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none' }}>
              Lihat Semua →
            </Link>
          </div>
          
          {recentMenus.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px' }}>
              <MdRestaurantMenu className="empty-icon" />
              <p className="empty-title">Belum ada menu</p>
              <p className="empty-text">Mulai dengan menganalisis foto menu</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentMenus.map((menu) => (
                <div 
                  key={menu.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--bg-main)',
                    borderRadius: '12px'
                  }}
                >
                  <div 
                    style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '8px',
                      background: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      overflow: 'hidden'
                    }}
                  >
                    {menu.foto_url ? (
                      <img 
                        src={`http://localhost:5000${menu.foto_url}`} 
                        alt={menu.nama_menu}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <MdRestaurantMenu />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{menu.nama_menu}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {menu.kalori} kkal • {menu.protein}g protein
                    </div>
                  </div>
                  <span className="badge badge-porsi">{menu.porsi}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nutrition Overview */}
      <div className="card" style={{ marginTop: '24px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Rata-rata Nutrisi</h2>
        <div className="nutrition-grid">
          <div className="nutrition-item kalori">
            <div className="nutrition-value">{Math.round(stats?.avgKalori || 0)}</div>
            <div className="nutrition-label">Kalori</div>
            <div className="nutrition-unit">kkal</div>
          </div>
          <div className="nutrition-item karbohidrat">
            <div className="nutrition-value">-</div>
            <div className="nutrition-label">Karbohidrat</div>
            <div className="nutrition-unit">gram</div>
          </div>
          <div className="nutrition-item protein">
            <div className="nutrition-value">{Math.round(stats?.avgProtein || 0)}</div>
            <div className="nutrition-label">Protein</div>
            <div className="nutrition-unit">gram</div>
          </div>
          <div className="nutrition-item lemak">
            <div className="nutrition-value">-</div>
            <div className="nutrition-label">Lemak</div>
            <div className="nutrition-unit">gram</div>
          </div>
          <div className="nutrition-item serat">
            <div className="nutrition-value">-</div>
            <div className="nutrition-label">Serat</div>
            <div className="nutrition-unit">gram</div>
          </div>
        </div>
      </div>
    </div>
  );
}
