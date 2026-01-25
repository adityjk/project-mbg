import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdRestaurantMenu, MdLocalFireDepartment, MdGrain, MdFitnessCenter, MdCalendarToday, MdFilterList, MdSearch, MdSchool, MdDateRange } from 'react-icons/md';
import { menuApi } from '../../services/api';
import type { Menu } from '../../types';

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariant = {
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
           <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
             <MdCalendarToday />
             <span>Riwayat Menu</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-base-content">
             Aktivitas <span className="text-primary">Makan Sehat</span>
           </h1>
           <p className="text-muted-themed mt-2 max-w-lg">
             Lihat kembali menu makanan bergizi yang telah disajikan di sekolahmu.
           </p>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div variants={itemVariant} className="bg-base-100 p-6 rounded-[2rem] border-2 border-neutral shadow-neo">
        <div className="flex items-center gap-2 mb-4 text-base-content font-black">
          <MdFilterList className="text-xl" />
          <h2>FILTER PENCARIAN</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
           {/* Filter Type Toggle */}
           <div className="md:col-span-3">
             <div className="join w-full border-2 border-neutral rounded-xl overflow-hidden p-1 bg-base-200">
               <button 
                 className={`join-item btn flex leading-none flex-1 border-0 ${filterType === 'date' ? 'bg-base-100 shadow-sm text-base-content' : 'bg-transparent text-muted-themed'}`}
                 onClick={() => { setFilterType('date'); setSelectedMonth(''); }}
               >
                 Harian
               </button>
               <button 
                 className={`join-item btn flex leading-none flex-1 border-0 ${filterType === 'month' ? 'bg-base-100 shadow-sm text-base-content' : 'bg-transparent text-muted-themed'}`}
                 onClick={() => { setFilterType('month'); setSelectedDate(''); }}
               >
                 Bulanan
               </button>
             </div>
           </div>

           {/* Date/Month Input */}
           <div className="md:col-span-3">
              {filterType === 'date' ? (
                <div className="relative">
                  <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed" />
                  <input 
                    type="date" 
                    className="input w-full pl-10 border-2 border-neutral focus:outline-none focus:border-primary rounded-xl font-bold text-base-content bg-base-100"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              ) : (
                <div className="relative">
                  <MdDateRange className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed" />
                  <input 
                    type="month" 
                    className="input w-full pl-10 border-2 border-neutral focus:outline-none focus:border-primary rounded-xl font-bold text-base-content bg-base-100"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  />
                </div>
              )}
           </div>

           {/* School Input */}
           <div className="md:col-span-4">
              <div className="relative">
                 <MdSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-themed" />
                 <input 
                   type="text" 
                   placeholder="Cari Nama Sekolah..." 
                   className="input w-full pl-10 border-2 border-neutral focus:outline-none focus:border-primary rounded-xl font-bold text-base-content bg-base-100"
                   value={selectedSchool}
                   onChange={(e) => setSelectedSchool(e.target.value)}
                 />
              </div>
           </div>

           {/* Search Button */}
           <div className="md:col-span-2">
              <button 
                onClick={fetchMenus}
                className="btn btn-primary w-full h-12 border-2 border-neutral text-base-100 font-bold rounded-xl hover:shadow-neo-sm shadow-neo transition-all active:translate-y-1 active:shadow-none"
              >
                <MdSearch size={24} />
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
           <motion.div variants={itemVariant} className="text-center py-20 bg-base-100 rounded-[2rem] border-2 border-base-300 border-dashed">
              <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MdRestaurantMenu className="text-4xl text-muted-themed" />
              </div>
              <h3 className="text-xl font-bold text-muted-themed">Tidak ada menu ditemukan</h3>
              <p className="text-sm text-muted-themed">Coba ubah filter tanggal atau lokasi sekolah.</p>
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
                  className="bg-base-100 rounded-3xl border-2 border-neutral shadow-sm hover:shadow-neo transition-all duration-300 overflow-hidden group flex flex-col"
                >
                   {/* Card Image */}
                   <div className="h-48 relative overflow-hidden bg-base-200">
                     {menu.foto_url ? (
                        <img 
                          src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                          alt={menu.nama_menu}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-themed">
                           <MdRestaurantMenu size={48} />
                        </div>
                     )}
                     <div className="absolute top-3 right-3 bg-base-100/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold border border-neutral/10 shadow-sm">
                        {new Date(menu.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                     </div>
                   </div>

                   {/* Card Content */}
                   <div className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-black text-xl text-base-content mb-2 leading-tight">{menu.nama_menu}</h3>
                        
                        {/* School Badge */}
                        {menu.location && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-themed mb-4 bg-base-200 w-fit px-2 py-1 rounded-md">
                             <MdSchool size={14} className="text-primary" />
                             {menu.location}
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-themed line-clamp-2 mb-4">
                           {menu.deskripsi || 'Menu sehat bergizi.'}
                        </p>
                      </div>

                      {/* Nutrition Footer */}
                      <div className="flex justify-between items-center pt-4 border-t-2 border-base-200">
                         <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-warning" title="Kalori"><MdLocalFireDepartment /> {menu.kalori}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-primary" title="Protein"><MdFitnessCenter /> {menu.protein}g</span>
                         </div>
                         <div className="badge badge-neutral text-xs text-base-100 font-bold">{menu.jumlah_porsi} Porsi</div>
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
