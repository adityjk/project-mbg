import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdRestaurantMenu, 
  MdHistory, 
  MdReport, 
  MdLogout,
  MdClose,
  MdMap,
  MdGroup,
  MdPeople,
} from 'react-icons/md';
import ThemeToggle from '../ThemeToggle';

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  let menuItems = [
    { path: '/user', icon: MdDashboard, label: 'Dashboard' },
    { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' },
  ];

  if (user.role === 'admin') {
    menuItems = [
      { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
      { path: '/admin/users', icon: MdGroup, label: 'Kelola User' },
      { path: '/admin/history', icon: MdHistory, label: 'Riwayat Menu' },
      { path: '/admin/reports', icon: MdReport, label: 'Laporan' },
      { path: '/admin/schools', icon: MdMap, label: 'Data Sekolah' },
      { path: '/admin/tim-sppg', icon: MdPeople, label: 'Tim SPPG' },
      { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' },
    ];
  } else if (user.role === 'petugas gizi') {
    menuItems = [
      { path: '/admin', icon: MdDashboard, label: 'Dashboard' }, 
      { path: '/admin/analyze', icon: MdRestaurantMenu, label: 'Analisis Menu' },
      { path: '/admin/history', icon: MdHistory, label: 'Riwayat Menu' },
      { path: '/admin/schools', icon: MdMap, label: 'Data Sekolah' },
      { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' },
    ];
  } else if (user.role === 'petugas pengaduan') {
    menuItems = [
      { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
      { path: '/admin/reports', icon: MdReport, label: 'Laporan' },
    ];
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-base-100/95 backdrop-blur-md border-r border-neutral/50 shadow-soft-lg
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary font-display flex items-center gap-1">
              MBG <span className="text-base-content text-lg font-normal opacity-60">Admin</span>
            </h1>
            <p className="text-xs font-medium text-muted-themed tracking-widest uppercase mt-1">Control Panel</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 text-muted-themed hover:text-primary transition-colors">
              <MdClose size={24} />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="mx-6 p-4 rounded-2xl bg-gradient-to-r from-base-200 to-base-100 border border-neutral/50 mb-4 shadow-sm">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shadow-inner">
                 {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                 <div className="font-bold text-sm truncate text-base-content">{user.name || 'Admin'}</div>
                 <div className="text-[10px] font-bold text-muted-themed bg-neutral/50 px-2 py-0.5 rounded-full inline-block mt-0.5 uppercase tracking-wide">{user.role || 'Superuser'}</div>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose?.()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group
                  ${isActive 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-themed hover:bg-base-200 hover:text-base-content'
                  }
                `}
              >
                <item.icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="tracking-wide text-sm">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>}
              </Link>
            );
          })}
        </nav>

        {/* Footer with Theme Toggle */}
        <div className="p-6 border-t border-neutral/50 bg-base-100/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-muted-themed uppercase tracking-wider">Appearance</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all duration-200 shadow-sm hover:shadow-md font-bold text-sm"
          >
            <MdLogout size={18} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
