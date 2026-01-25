import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdRestaurantMenu, MdCalendarMonth, MdLocalFireDepartment, MdEgg } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';
import Footer from '../components/Footer';

export default function PublicMenuHistory() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchMenus();
  }, [selectedMonth]);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await menuApi.getAll({ month: selectedMonth });
      setMenus(res.data);
    } catch (err) {
      console.error('Gagal load menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Generate month options (last 12 months)
  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-bg-main font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
         <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-neo-sm hover:scale-105 transition-transform">
            <MdHome size={24} />
            <span className="font-bold hidden md:inline">Kembali ke Beranda</span>
         </Link>
         <div className="font-black text-xl">MBG<span className="text-primary">.GO</span></div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-primary text-black p-8 rounded-[2.5rem] border-2 border-black shadow-neo overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MdRestaurantMenu size={180} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-black text-primary font-black px-4 py-1 rounded-full text-xs uppercase mb-3">
              <MdCalendarMonth /> Riwayat Menu
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">RIWAYAT MENU MBG</h1>
            <p className="font-bold text-lg opacity-80">
              Lihat daftar menu makanan bergizi yang telah disajikan
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-neo-sm p-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <MdCalendarMonth size={24} className="text-primary" />
            <span className="font-bold">Pilih Bulan:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="select border-2 border-black rounded-xl h-12 font-bold min-w-[200px]"
          >
            {getMonthOptions().map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Menu Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : menus.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-neo p-12 text-center">
            <MdRestaurantMenu size={80} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-black mb-2">Belum Ada Menu</h3>
            <p className="text-gray-500 font-medium">
              Tidak ada menu yang tersedia untuk bulan ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map(menu => (
              <div key={menu.id} className="group relative">
                <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-2 translate-y-2"></div>
                <div className="relative bg-white rounded-[2rem] border-2 border-black overflow-hidden hover:-translate-y-1 transition-transform">
                  {/* Image */}
                  {menu.foto_url && (
                    <div className="h-48 overflow-hidden border-b-2 border-black">
                      <img 
                        src={menu.foto_url} 
                        alt={menu.nama_menu}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        {formatDate(menu.created_at)}
                      </p>
                      <h3 className="text-xl font-black">{menu.nama_menu}</h3>
                      {menu.location && (
                        <p className="text-sm font-medium text-gray-500 mt-1">📍 {menu.location}</p>
                      )}
                    </div>

                    {/* Nutrition Info */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-orange-100 rounded-xl px-3 py-2 flex items-center gap-2">
                        <MdLocalFireDepartment className="text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Kalori</p>
                          <p className="font-black text-sm">{menu.kalori} kcal</p>
                        </div>
                      </div>
                      <div className="bg-blue-100 rounded-xl px-3 py-2 flex items-center gap-2">
                        <MdEgg className="text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Protein</p>
                          <p className="font-black text-sm">{menu.protein}g</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {menu.deskripsi && (
                      <p className="text-sm text-gray-600 line-clamp-2">{menu.deskripsi}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
