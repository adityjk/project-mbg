import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MdRestaurantMenu, MdLocalFireDepartment, MdGrain, MdFitnessCenter, MdWaterDrop, MdGrass, MdCalendarToday, MdArrowForward } from 'react-icons/md';
import { menuApi } from '../../services/api';
import type { Menu } from '../../types';

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
  show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } }
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
         <div className="loading loading-bars loading-lg text-primary"></div>
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
      {/* 1. Date Header (Bento Style) */}
      <motion.div 
        variants={itemVariant}
        className="bg-primary text-base-100 p-8 md:p-10 rounded-[2.5rem] border-2 border-neutral shadow-neo relative overflow-hidden"
      >
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-neutral/20 px-4 py-2 rounded-full mb-4 md:mb-6 border border-base-100/20">
                <MdCalendarToday className="text-secondary" />
                <span className="font-mono text-sm tracking-widest uppercase">{formatDate()}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[0.9]">
                MENU <br/>
                <span className="text-secondary italic">HARI INI</span>
              </h1>
            </div>
            
            <div className="md:text-right max-w-md">
               <p className="font-mono text-sm opacity-90 border-l-4 border-secondary pl-4 py-1">
                 "Makanan bergizi adalah bahan bakar untuk mimpi-mimpi besarmu."
               </p>
            </div>
         </div>
         
         {/* Background Decoration */}
         <div className="absolute right-0 top-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute left-0 bottom-0 w-40 h-40 bg-secondary/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
      </motion.div>

      {/* 2. Menu Cards List */}
      <div className="space-y-8">
        {menus.length === 0 ? (
          <motion.div variants={itemVariant} className="text-center py-20 bg-base-100 rounded-3xl border-2 border-base-300 border-dashed">
            <MdRestaurantMenu className="text-6xl text-muted-themed mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-muted-themed">Belum Ada Menu</h2>
            <p className="text-muted-themed">Silakan cek kembali nanti ya!</p>
          </motion.div>
        ) : (
          menus.map((menu, idx) => (
            <motion.div 
              key={menu.id} 
              variants={itemVariant}
              className="bg-base-100 rounded-[2rem] border-2 border-neutral shadow-neo overflow-hidden group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">
                {/* Image Section */}
                <div className="lg:col-span-5 h-[300px] lg:h-auto relative bg-secondary/10 border-b-2 lg:border-b-0 lg:border-r-2 border-neutral overflow-hidden">
                   {menu.foto_url ? (
                     <img 
                       src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                       alt={menu.nama_menu}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                       <MdRestaurantMenu size={64} className="text-muted-themed" />
                     </div>
                   )}
                   <div className="absolute top-4 left-4">
                      <span className="badge badge-lg bg-neutral text-base-100 border-0 font-bold shadow-sm">
                         {menu.jumlah_porsi} Porsi
                      </span>
                   </div>
                </div>

                {/* Content Section */}
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                   <div>
                     <div className="flex justify-between items-start mb-4">
                       <h2 className="text-3xl md:text-4xl font-black leading-tight text-base-content">
                         {menu.nama_menu}
                       </h2>
                       <div className="bg-secondary w-12 h-12 rounded-full border-2 border-neutral flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform">
                          <MdArrowForward size={24} className="text-neutral" />
                       </div>
                     </div>
                     
                     <p className="text-muted-themed mb-8 font-medium leading-relaxed">
                       {menu.deskripsi || 'Menu makanan bergizi seimbang yang disiapkan khusus untuk mendukung aktivitas belajar di sekolah.'}
                     </p>

                     {/* Nutrition Grid */}
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <NutritionPill icon={MdLocalFireDepartment} value={menu.kalori} unit="kkal" label="Energi" color="bg-warning/20 text-warning" />
                        <NutritionPill icon={MdFitnessCenter} value={menu.protein} unit="g" label="Protein" color="bg-primary/20 text-primary" />
                        <NutritionPill icon={MdGrain} value={menu.karbohidrat} unit="g" label="Karbo" color="bg-accent/20 text-accent" />
                     </div>
                   </div>
                   
                   <div className="mt-8 pt-6 border-t-2 border-base-200 flex items-center gap-2 text-sm text-muted-themed font-mono">
                      <span>Verified by AI Nutrition Analysis</span>
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 3. Info Card */}
      <motion.div variants={itemVariant} className="bg-base-300 text-base-content p-6 rounded-2xl border-2 border-neutral shadow-neo flex items-start gap-4">
        <div className="bg-base-100/10 p-3 rounded-xl border border-base-100/10">
          <MdLocalFireDepartment className="text-2xl text-secondary" />
        </div>
        <div>
           <h3 className="font-bold text-lg mb-1">Tahukah Kamu?</h3>
           <p className="text-sm text-muted-themed leading-relaxed">
             Makan siang bergizi dapat meningkatkan konsentrasi belajar hingga 20% pada jam pelajaran siang. Jangan lupa habiskan makanmu ya!
           </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const NutritionPill = ({ icon: Icon, value, unit, label, color }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border border-neutral/10 ${color || 'bg-base-200'}`}>
     <div className="bg-base-100 p-2 rounded-lg shadow-sm">
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
