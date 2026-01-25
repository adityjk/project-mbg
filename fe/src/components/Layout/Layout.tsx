import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { MdMenu } from 'react-icons/md';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base-100 flex font-sans text-base-content transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-72 min-h-screen relative p-4 lg:p-8 transition-all duration-300">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 right-4 z-40 p-3 bg-base-100 border-2 border-neutral rounded-lg shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all text-base-content"
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
