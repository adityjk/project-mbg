import { Outlet, Link, useLocation } from 'react-router-dom';
import { MdFastfood, MdRestaurantMenu, MdReport, MdRequestPage, MdArrowBack, MdMap } from 'react-icons/md';
import ThemeToggle from '../ThemeToggle';

export default function UserLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/user', icon: MdRestaurantMenu, label: 'Menu' },
    { path: '/user/history', icon: MdFastfood, label: 'Riwayat' },
    { path: '/user/laporan', icon: MdReport, label: 'Laporan' },
    { path: '/user/request', icon: MdRequestPage, label: 'Request' },
    { path: '/maps', icon: MdMap, label: 'Maps' },
  ];

  return (
    <div className="min-h-screen bg-base-100 flex flex-col font-sans transition-colors duration-300">
      {/* Neo-Brutalist Header */}
      <header className="sticky top-0 z-[100] bg-primary border-b-2 border-neutral text-base-100 shadow-neo-sm">
        <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-base-100 text-base-content border-2 border-neutral rounded-lg hover:shadow-neo-sm transition-all active:translate-y-1 active:shadow-none">
              <MdArrowBack className="text-xl" />
            </Link>
            
            <div className="flex items-center gap-2">
               <div className="w-10 h-10 bg-secondary border-2 border-neutral rounded-full flex items-center justify-center text-neutral">
                 <MdFastfood className="text-2xl" />
               </div>
               <div>
                  <h1 className="text-xl font-black italic tracking-tighter">MBG<span className="text-secondary">APP</span></h1>
               </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-3 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border-2 transition-all font-bold text-sm ${
                  location.pathname === item.path 
                  ? 'bg-secondary text-neutral border-neutral shadow-[2px_2px_0px_var(--shadow-color)]' 
                  : 'bg-base-100/10 text-base-100 border-transparent hover:bg-base-100 hover:text-primary hover:border-neutral'
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-8 mb-20 md:mb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Floating Capsule) */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-base-300 text-base-content border-2 border-neutral rounded-full px-6 py-4 flex justify-between items-center z-[100] shadow-neo-lg">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              location.pathname === item.path 
              ? 'text-primary scale-110' 
              : 'text-muted-themed hover:text-base-content'
            }`}
          >
            <item.icon className="text-2xl" />
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </div>
  );
}
