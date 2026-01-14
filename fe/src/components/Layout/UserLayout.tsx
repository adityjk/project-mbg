import { Outlet, Link, useLocation } from 'react-router-dom';
import { MdFastfood, MdRestaurantMenu, MdReport, MdRequestPage, MdArrowBack } from 'react-icons/md';

export default function UserLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/user', icon: MdRestaurantMenu, label: 'Menu Hari Ini' },
    { path: '/user/laporan', icon: MdReport, label: 'Buat Laporan' },
    { path: '/user/request', icon: MdRequestPage, label: 'Request Menu' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
        padding: '16px 24px',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/" style={{ color: 'white', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <MdArrowBack style={{ fontSize: '20px' }} />
            </Link>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MdFastfood style={{ fontSize: '24px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Makan Bergizi Gratis</h1>
              <p style={{ fontSize: '12px', opacity: 0.9, margin: 0 }}>SPPG Bandarharjo 2</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s ease'
                }}
              >
                <item.icon />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: '13px',
        borderTop: '1px solid #E8F0E8'
      }}>
        <p>© 2026 Badan Gizi Nasional • Lumbung Sekolah Anak Bangsa</p>
      </footer>
    </div>
  );
}
