import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MdMenu } from 'react-icons/md';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral flex font-sans text-base-content transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-72 min-h-screen relative p-4 lg:p-8 transition-all duration-300">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-white/80 backdrop-blur-sm border border-neutral/50 rounded-xl shadow-soft text-base-content hover:bg-white transition-all"
        >
          <MdMenu size={24} />
        </button>

        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
