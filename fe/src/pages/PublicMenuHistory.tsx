import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdRestaurantMenu, MdCalendarMonth, MdLocalFireDepartment, MdEgg, MdExpandMore, MdExpandLess, MdSpa } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

// Expandable Description Component
const ExpandableDescription = ({ text, maxLength = 80 }: { text: string; maxLength?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-sm text-gray-600 leading-relaxed">{text}</p>;
  }

  return (
    <div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
      >
        {isExpanded ? (
          <>
            <MdExpandLess size={16} />
            Tutup
          </>
        ) : (
          <>
            <MdExpandMore size={16} />
            Baca Selengkapnya
          </>
        )}
      </button>
    </div>
  );
};

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

  const containerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, bounce: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-neutral font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      
      {/* Soft Gradient Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[80px] -translate-x-1/4 pointer-events-none"></div>

      {/* Navbar Simple */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6 relative z-50">
         <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-neutral/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <MdHome size={24} className="text-primary" />
            <span className="font-bold hidden md:inline text-base-content">Kembali ke Beranda</span>
         </Link>
         <div className="font-display font-bold text-xl text-base-content">MBG<span className="text-primary">.GO</span></div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 relative z-10 pb-20">
        
        {/* Header */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-base-100 text-base-content p-8 rounded-[2.5rem] border border-neutral/10 shadow-soft-lg overflow-hidden relative"
        >
          <div className="absolute top-[-20px] right-[-20px] p-4 opacity-5 pointer-events-none">
            <MdRestaurantMenu size={200} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-xs uppercase mb-4">
              <MdCalendarMonth /> Riwayat Menu
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 tracking-tight">Riwayat Menu MBG</h1>
            <p className="font-medium text-lg text-muted-themed max-w-2xl">
              Lihat daftar menu makanan bergizi yang telah disajikan untuk siswa/i di seluruh sekolah.
            </p>
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.1 }}
           className="bg-base-100 rounded-2xl border border-neutral/10 shadow-soft p-4 flex flex-wrap gap-4 items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
               <MdCalendarMonth size={20} />
            </div>
            <span className="font-bold text-base-content">Pilih Bulan:</span>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="select w-full md:w-auto min-w-[200px] h-12 rounded-xl border-neutral/20 bg-base-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-base-content font-bold"
          >
            {getMonthOptions().map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </motion.div>

        {/* Menu Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-dots loading-lg text-primary"></span>
          </div>
        ) : menus.length === 0 ? (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-base-50 rounded-[2.5rem] border border-neutral/10 border-dashed p-12 text-center"
          >
            <div className="w-20 h-20 bg-neutral/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <MdRestaurantMenu size={40} className="text-muted-themed" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2 text-base-content">Belum Ada Menu</h3>
            <p className="text-muted-themed font-medium max-w-md mx-auto">
              Tidak ada menu yang tersedia untuk bulan {selectedMonth}. Silakan pilih bulan lain.
            </p>
          </motion.div>
        ) : (
          <motion.div 
             variants={containerVariant}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {menus.map(menu => (
              <motion.div variants={itemVariant} key={menu.id} className="group">
                <div className="bg-base-100 rounded-[2rem] border border-neutral/10 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  {menu.foto_url ? (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={menu.foto_url} 
                        alt={menu.nama_menu}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                      <div className="absolute bottom-3 left-3 right-3">
                         <span className="bg-white/90 backdrop-blur-sm text-base-content px-3 py-1 rounded-lg text-xs font-bold shadow-sm inline-block">
                           {formatDate(menu.created_at)}
                         </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-32 bg-base-50 flex items-center justify-center border-b border-neutral/10">
                       <MdRestaurantMenu size={40} className="text-neutral/20" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div>
                      <h3 className="text-xl font-display font-bold text-base-content line-clamp-2">{menu.nama_menu}</h3>
                      {menu.location && (
                        <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1">📍 {menu.location}</p>
                      )}
                    </div>

                    {/* Nutrition Mini Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <div className="bg-orange-50 rounded-xl px-3 py-2 flex items-center gap-2">
                        <MdLocalFireDepartment className="text-orange-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-themed uppercase">Kalori</p>
                          <p className="font-bold text-xs text-base-content">{menu.kalori} kcal</p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl px-3 py-2 flex items-center gap-2">
                        <MdEgg className="text-blue-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-themed uppercase">Protein</p>
                          <p className="font-bold text-xs text-base-content">{menu.protein}g</p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-xl px-3 py-2 flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-200 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-700">L</div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-themed uppercase">Lemak</p>
                          <p className="font-bold text-xs text-base-content">{menu.lemak}g</p>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2">
                        <MdSpa className="text-green-500 shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-themed uppercase">Serat</p>
                          <p className="font-bold text-xs text-base-content">{menu.serat}g</p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {menu.deskripsi && (
                      <div className="pt-2 border-t border-neutral/10">
                        <ExpandableDescription text={menu.deskripsi} maxLength={80} />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
