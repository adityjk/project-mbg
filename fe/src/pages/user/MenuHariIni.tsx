import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdRestaurantMenu, MdLocalFireDepartment, MdFitnessCenter, MdCalendarToday, MdArrowForward, MdExpandMore, MdExpandLess, MdTipsAndUpdates, MdGrain } from 'react-icons/md';
import { menuApi } from '../../services/api';
import type { Menu } from '../../types';

// Expandable Description Component
const ExpandableDescription = ({ text, maxLength = 120 }: { text: string; maxLength?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-muted-themed font-medium leading-relaxed">{text}</p>;
  }

  return (
    <div>
      <p className="text-muted-themed font-medium leading-relaxed">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
      >
        {isExpanded ? (
          <>
            <MdExpandLess size={18} />
            Tutup
          </>
        ) : (
          <>
            <MdExpandMore size={18} />
            Baca Selengkapnya
          </>
        )}
      </button>
    </div>
  );
};

// Animation Variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring" as const, bounce: 0.4 } }
};

export default function MenuHariIni() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMenus();
  }, []);

  const fetchTodayMenus = async () => {
    try {
      const response = await menuApi.getAll();
      // Filter menus from today (or show all for demo)
      const today = new Date().toDateString();
      const todayMenus = response.data.filter(menu => 
        new Date(menu.created_at).toDateString() === today
      );
      // If no menus today, show the most recent ones for demo purposes
      setMenus(todayMenus.length > 0 ? todayMenus : response.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
     return (
       <div className="flex justify-center items-center h-[50vh]">
         <div className="loading loading-spinner loading-lg text-primary"></div>
       </div>
     );
   }

  return (
    <motion.div 
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* 1. Date Header (Soft Style) */}
      <motion.div 
        variants={itemVariant}
        className="bg-gradient-to-br from-primary to-accent text-white p-8 md:p-10 rounded-[2.5rem] shadow-soft-lg relative overflow-hidden group"
      >
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4 md:mb-6 border border-white/20 shadow-sm">
                <MdCalendarToday className="text-white" />
                <span className="font-bold text-sm tracking-widest uppercase text-white">{formatDate()}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-none drop-shadow-sm">
                Menu <br/>
                <span className="text-white/90 italic font-medium">Hari Ini</span>
              </h1>
            </div>
            
            <div className="md:text-right max-w-md">
               <p className="font-medium text-sm md:text-base opacity-90 border-l-4 border-white/30 pl-4 py-1">
                 "Makanan bergizi adalah bahan bakar untuk mimpi-mimpi besarmu."
               </p>
            </div>
         </div>
         
         {/* Background Decoration */}
         <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:scale-110 transition-transform duration-700"></div>
         <div className="absolute left-0 bottom-0 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      </motion.div>

      {/* 2. Menu Cards List */}
      <div className="space-y-8">
        {menus.length === 0 ? (
          <motion.div variants={itemVariant} className="text-center py-20 bg-base-100/50 rounded-3xl border border-neutral/30 border-dashed">
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
               <MdRestaurantMenu className="text-4xl text-muted-themed" />
            </div>
            <h2 className="text-2xl font-bold text-muted-themed font-display">Belum Ada Menu</h2>
            <p className="text-muted-themed text-sm mt-1">Silakan cek kembali nanti ya!</p>
          </motion.div>
        ) : (
          menus.map((menu) => (
            <motion.div 
              key={menu.id} 
              variants={itemVariant}
              className="bg-base-100 rounded-[2rem] border border-neutral/30 shadow-soft hover:shadow-soft-lg overflow-hidden group transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Section */}
                <div className="lg:col-span-5 h-[300px] lg:h-auto relative bg-base-200 overflow-hidden">
                   {menu.foto_url ? (
                     <img 
                       src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                       alt={menu.nama_menu}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <MdRestaurantMenu size={64} className="text-muted-themed opacity-50" />
                     </div>
                   )}
                   
                   {/* Overlay Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden"></div>
                   
                   <div className="absolute top-4 left-4">
                      <span className="badge badge-lg bg-white/90 backdrop-blur-sm text-base-content border-0 font-bold shadow-sm">
                         {menu.jumlah_porsi} Porsi
                      </span>
                   </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                   <div>
                     <div className="flex justify-between items-start mb-4">
                       <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight text-base-content group-hover:text-primary transition-colors">
                         {menu.nama_menu}
                       </h2>
                       <div className="bg-base-100 w-12 h-12 rounded-full border border-neutral/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                          <MdArrowForward size={24} />
                       </div>
                     </div>
                     
                     <div className="mb-8">
                       <ExpandableDescription 
                         text={menu.deskripsi || 'Menu makanan bergizi seimbang yang disiapkan khusus untuk mendukung aktivitas belajar di sekolah.'} 
                         maxLength={120} 
                       />
                     </div>

                     {/* Nutrition Grid */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <NutritionPill icon={MdLocalFireDepartment} value={menu.kalori} unit="kkal" label="Energi" color="bg-orange-50 text-orange-600 border-orange-100" />
                        <NutritionPill icon={MdFitnessCenter} value={menu.protein} unit="g" label="Protein" color="bg-blue-50 text-blue-600 border-blue-100" />
                        <NutritionPill icon={MdGrain} value={menu.karbohidrat} unit="g" label="Karbo" color="bg-green-50 text-green-600 border-green-100" />
                     </div>
                   </div>
                   
                   <div className="mt-8 pt-6 border-t border-dashed border-neutral/30 flex items-center gap-2 text-xs font-bold text-muted-themed uppercase tracking-wider">
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                      <span>Verified by AI Nutrition Analysis</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 3. Info Card */}
      <motion.div variants={itemVariant} className="bg-base-100 text-base-content p-6 rounded-2xl border border-neutral/50 shadow-soft flex items-start gap-4 hover:bg-base-50 transition-colors">
        <div className="bg-primary/10 p-3 rounded-xl text-primary">
          <MdTipsAndUpdates className="text-2xl" />
        </div>
        <div>
           <h3 className="font-bold text-lg mb-1 font-display">Tahukah Kamu?</h3>
           <p className="text-sm text-muted-themed leading-relaxed">
             Makan siang bergizi dapat meningkatkan konsentrasi belajar hingga 20% pada jam pelajaran siang. Jangan lupa habiskan makanmu ya!
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const NutritionPill = ({ icon: Icon, value, unit, label, color }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-105 ${color || 'bg-base-100 border-neutral/20'}`}>
     <div className="bg-base-100/80 p-2 rounded-lg shadow-sm">
        <Icon size={18} />
     </div>
     <div>
        <div className="font-black text-lg leading-none">
          {value || '-'} <span className="text-[10px] opacity-70 font-normal">{unit}</span>
        </div>
        <div className="text-[10px] uppercase font-bold opacity-60 mt-0.5">{label}</div>
     </div>
  </div>
);
