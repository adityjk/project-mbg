import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdRestaurantMenu, MdLocalFireDepartment, MdFitnessCenter, MdCalendarToday, MdFilterList, MdSearch, MdSchool, MdDateRange } from 'react-icons/md';
import { menuApi } from '../../services/api';
import type { Menu } from '../../types';

// Animation Variants
const containerVariant: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant: any = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } }
};

export default function HistorySiswa() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterType, setFilterType] = useState<'date' | 'month'>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType === 'date' && selectedDate) params.date = selectedDate;
      if (filterType === 'month' && selectedMonth) params.month = selectedMonth;
      if (selectedSchool) params.location = selectedSchool;

      const response = await menuApi.getAll(params);
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <motion.div 
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariant} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
             <MdCalendarToday />
             <span>Riwayat Menu</span>
           </div>
           <h1 className="text-3xl md:text-5xl font-display font-bold text-base-content leading-tight">
             Aktivitas <span className="text-primary relative inline-block">
               Makan Sehat
               <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10 skew-x-12 transform"></span>
             </span>
           </h1>
           <p className="text-muted-themed mt-3 max-w-lg text-lg">
             Lihat kembali menu makanan bergizi yang telah disajikan di sekolahmu.
           </p>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div variants={itemVariant} className="bg-base-100 p-6 rounded-[2rem] border border-neutral/30 shadow-soft">
        <div className="flex items-center gap-2 mb-6 text-base-content font-bold font-display uppercase tracking-wider text-sm border-b border-neutral/10 pb-2">
          <MdFilterList className="text-lg text-primary" />
          <h2>Filter Pencarian</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Filter Type Toggle */}
           <div className="md:col-span-3">
             <div className="join w-full border border-neutral/30 rounded-xl overflow-hidden p-1 bg-base-100 shadow-inner">
               <button 
                 className={`join-item btn btn-sm flex leading-none flex-1 border-0 rounded-lg transition-all ${filterType === 'date' ? 'bg-base-100 shadow-sm text-primary font-bold' : 'bg-transparent text-muted-themed hover:bg-base-200'}`}
                 onClick={() => { setFilterType('date'); setSelectedMonth(''); }}
               >
                 Harian
               </button>
               <button 
                 className={`join-item btn btn-sm flex leading-none flex-1 border-0 rounded-lg transition-all ${filterType === 'month' ? 'bg-base-100 shadow-sm text-primary font-bold' : 'bg-transparent text-muted-themed hover:bg-base-200'}`}
                 onClick={() => { setFilterType('month'); setSelectedDate(''); }}
               >
                 Bulanan
               </button>
             </div>
           </div>

           {/* Date/Month Input */}
           <div className="md:col-span-3">
              {filterType === 'date' ? (
                <div className="relative group">
                  <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed group-hover:text-primary transition-colors" />
                  <input 
                    type="date" 
                    className="input w-full pl-10 border border-neutral/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-medium text-base-content bg-base-50 transition-all hover:bg-base-100"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="relative group">
                  <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed group-hover:text-primary transition-colors" />
                  <input 
                    type="month" 
                    className="input w-full pl-10 border border-neutral/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-medium text-base-content bg-base-50 transition-all hover:bg-base-100"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
              )}
           </div>

           {/* School Input */}
           <div className="md:col-span-4">
              <div className="relative group">
                 <MdSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed group-hover:text-primary transition-colors" />
                 <input 
                   type="text" 
                   placeholder="Cari Nama Sekolah..." 
                   className="input w-full pl-10 border border-neutral/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl font-medium text-base-content bg-base-50 transition-all hover:bg-white"
                   value={selectedSchool}
                   onChange={(e) => setSelectedSchool(e.target.value)}
                 />
              </div>
           </div>

           {/* Search Button */}
           <div className="md:col-span-2">
              <button 
                onClick={fetchMenus}
                className="btn btn-primary w-full h-12 border-none shadow-soft hover:shadow-soft-lg transition-all transform hover:-translate-y-1 active:translate-y-0 rounded-xl text-white font-bold tracking-wide"
              >
                <MdSearch size={20} />
                CARI
              </button>
           </div>
        </div>
      </motion.div>

      {/* Results List */}
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="loading loading-dots loading-lg text-primary"></div>
           </div>
        ) : menus.length === 0 ? (
           <motion.div variants={itemVariant} className="text-center py-20 bg-base-100/50 rounded-[2rem] border border-neutral/30 border-dashed">
              <div className="w-20 h-20 bg-base-200/50 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-themed">
                 <MdRestaurantMenu className="text-4xl opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-muted-themed font-display">Tidak ada menu ditemukan</h3>
              <p className="text-sm text-muted-themed mt-1">Coba ubah filter tanggal atau lokasi sekolah.</p>
           </motion.div>
        ) : (
           <motion.div 
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             variants={containerVariant}
             initial="hidden"
             animate="show"
           >
             {menus.map((menu) => (
                <motion.div 
                  key={menu.id} 
                  variants={itemVariant}
                  className="bg-base-100 rounded-3xl border border-neutral/30 shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-1"
                >
                   {/* Card Image */}
                   <div className="h-56 relative overflow-hidden bg-base-200">
                     {menu.foto_url ? (
                        <img 
                          src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                          alt={menu.nama_menu}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-themed bg-neutral/10">
                           <MdRestaurantMenu size={48} className="opacity-30" />
                        </div>
                     )}
                     
                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                     <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
                        {new Date(menu.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </div>
                     
                     <div className="absolute bottom-3 left-4 right-4">
                        <div className="flex justify-between items-end">
                          <h3 className="font-display font-bold text-xl text-white leading-tight drop-shadow-md line-clamp-2">{menu.nama_menu}</h3>
                        </div>
                     </div>
                   </div>

                   {/* Card Content */}
                   <div className="p-5 flex-1 flex flex-col bg-base-100">
                      <div className="flex-1">
                        {/* School Badge */}
                        {menu.location && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-themed mb-3 bg-base-100 w-fit px-2 py-1 rounded-md border border-neutral/20">
                             <MdSchool size={14} className="text-primary" />
                             {menu.location}
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-themed line-clamp-3 mb-4 leading-relaxed">
                           {menu.deskripsi || 'Menu sehat bergizi seimbang untuk siswa.'}
                        </p>
                      </div>

                      {/* Nutrition Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-neutral/10 mt-auto">
                         <div className="flex gap-3">
                            <div className="flex items-center gap-1" title="Kalori">
                               <div className="w-6 h-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                  <MdLocalFireDepartment size={12} />
                               </div>
                               <span className="text-xs font-bold text-base-content">{menu.kalori}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Protein">
                               <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                  <MdFitnessCenter size={12} />
                               </div>
                               <span className="text-xs font-bold text-base-content">{menu.protein}g</span>
                            </div>
                         </div>
                         <div className="badge badge-sm badge-neutral/10 text-xs font-bold text-base-content border-0">{menu.jumlah_porsi} Porsi</div>
                      </div>
                   </div>
                </motion.div>
             ))}
           </motion.div>
        )}
      </div>

    </motion.div>
  );
}
