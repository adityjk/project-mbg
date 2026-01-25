import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdRestaurantMenu, 
  MdHistory, 
  MdReport, 
  MdLogout,
  MdClose,
  MdMap,
  MdGroup
} from 'react-icons/md';
import ThemeToggle from '../ThemeToggle';

const navItems = [
  { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: MdGroup, label: 'Kelola User' },
  { path: '/admin/analyze', icon: MdRestaurantMenu, label: 'Analisis Menu' },
  { path: '/admin/history', icon: MdHistory, label: 'Riwayat Menu' },
  { path: '/admin/reports', icon: MdReport, label: 'Laporan' },
  { path: '/admin/schools', icon: MdMap, label: 'Data Sekolah' },
  { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' },
];

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
    menuItems = navItems;
  } else if (user.role === 'petugas gizi') {
    menuItems = [
      { path: '/admin', icon: MdDashboard, label: 'Dashboard' }, // Or separate dashboard? Reusing admin layout but maybe different stats?
      { path: '/admin/analyze', icon: MdRestaurantMenu, label: 'Analisis Menu' },
      { path: '/admin/history', icon: MdHistory, label: 'Riwayat Menu' },
      { path: '/admin/schools', icon: MdMap, label: 'Data Sekolah' }, // View only (backend protects edit/delete)
      { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' },
    ];
  } else if (user.role === 'petugas pengaduan') {
    menuItems = [
      { path: '/admin', icon: MdDashboard, label: 'Dashboard' },
      { path: '/admin/reports', icon: MdReport, label: 'Laporan' },
      // { path: '/maps', icon: MdMap, label: 'Lokasi SPPG' }, // Optional
    ];
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-neutral/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-72 bg-base-100 border-r-2 border-neutral
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="p-6 border-b-2 border-neutral flex items-center justify-between bg-secondary">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-neutral">MBG<span className="text-base-100 bg-neutral px-1 ml-1 transform rotate-3 inline-block">ADMIN</span></h1>
            <p className="text-xs font-mono font-bold mt-1 opacity-70 text-neutral">CONTROL PANEL</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-neutral hover:text-base-100 rounded-full transition-colors border-2 border-transparent hover:border-neutral">
              <MdClose size={24} />
            </button>
          )}
        </div>

        {/* User Info */}
        <div className="p-6 border-b-2 border-neutral bg-base-200">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-neutral bg-primary flex items-center justify-center text-base-100 font-black text-xl shadow-neo-sm">
                 {user.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                 <div className="font-bold text-lg leading-none text-base-content">{user.name || 'Admin'}</div>
                 <div className="text-xs font-mono text-muted-themed bg-base-300 px-2 py-0.5 rounded-full inline-block mt-1 border border-neutral">{user.role || 'Superuser'}</div>
              </div>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onClose?.()}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-bold
                  ${isActive 
                    ? 'bg-primary text-base-100 border-neutral shadow-neo-sm translate-x-1 translate-y-1' 
                    : 'bg-base-100 text-base-content border-transparent hover:border-neutral hover:bg-base-200'
                  }
                `}
              >
                <item.icon size={22} className={isActive ? 'text-secondary' : 'text-muted-themed'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer with Theme Toggle */}
        <div className="p-4 border-t-2 border-neutral bg-base-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-muted-themed">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-neutral bg-base-100 hover:bg-error hover:text-base-100 hover:border-error transition-all shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none font-bold text-base-content"
          >
            <MdLogout size={20} />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
