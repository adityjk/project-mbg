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
    <div className="min-h-screen bg-neutral flex flex-col font-sans transition-colors duration-300">
      {/* Soft Modern Header */}
      <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-neutral/50 shadow-soft">
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 text-muted-themed hover:text-primary hover:bg-primary/5 rounded-full transition-all">
              <MdArrowBack className="text-xl" />
            </Link>
            
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                 <MdFastfood className="text-xl" />
               </div>
               <div>
                  <h1 className="text-xl font-bold font-display tracking-wide text-base-content">MBG<span className="text-primary">APP</span></h1>
               </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all font-medium text-sm border border-transparent ${
                  location.pathname === item.path 
                  ? 'bg-primary/10 text-primary border-primary/10 shadow-sm' 
                  : 'text-muted-themed hover:text-base-content hover:bg-neutral/50'
                }`}
              >
                <item.icon className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="ml-2 pl-2 border-l border-neutral">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 mb-24 md:mb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Soft Floating Bar */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl px-2 py-3 flex justify-around items-center z-[100] shadow-soft-lg">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 relative ${
              location.pathname === item.path 
              ? 'text-primary' 
              : 'text-muted-themed hover:text-base-content'
            }`}
          >
            <item.icon className={`text-2xl transition-transform ${location.pathname === item.path ? 'scale-110' : ''}`} />
            {location.pathname === item.path && (
               <span className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></span>
            )}
          </Link>
        ))}
        <div className="w-px h-8 bg-neutral/50 mx-1"></div>
        <div className="scale-75">
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
