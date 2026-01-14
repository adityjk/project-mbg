import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdRestaurantMenu, 
  MdHistory, 
  MdReport,
  MdFastfood,
  MdArrowBack,
  MdMap,
  MdLogout
} from 'react-icons/md';

const navItems = [
  { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
  { path: '/admin/analyze', icon: MdRestaurantMenu, label: 'Analisis Menu' },
  { path: '/admin/history', icon: MdHistory, label: 'Riwayat Menu' },
  { path: '/admin/reports', icon: MdReport, label: 'Laporan' },
  { path: '/maps', icon: MdMap, label: 'Peta SPPG' }, // Shared map
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="sidebar flex flex-col h-full">
      {/* Back to Landing */}
      <Link 
        to="/" 
        className="nav-item" 
        style={{ marginBottom: '8px', color: 'var(--text-muted)' }}
      >
        <MdArrowBack className="nav-item-icon" />
        <span>Kembali</span>
      </Link>

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <MdFastfood />
        </div>
        <div>
          <h1>MBG Admin</h1>
          <p>Panel Pengelola</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="nav-item-icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-base-300">
         <button onClick={handleLogout} className="flex items-center gap-3 text-error w-full p-2 hover:bg-base-200 rounded-lg transition-all">
            <MdLogout className="text-xl" />
            <span className="font-medium">Logout</span>
         </button>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '16px', 
        fontSize: '12px', 
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <p>© 2026 MBG</p>
        <p>SPPG Bandarharjo 2</p>
      </div>
    </aside>
  );
}


