import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdRestaurantMenu, 
  MdPeople, 
  MdPending,
  MdLocalFireDepartment,
  MdArrowForward,
  MdBolt,
  MdTrendingUp
} from 'react-icons/md';
import { statsApi, menuApi } from '../services/api';
import type { DashboardStats, Menu } from '../types';

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

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMenus, setRecentMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, menusRes] = await Promise.all([
          statsApi.getDashboard(),
          menuApi.getAll()
        ]);
        setStats(statsRes.data);
        setRecentMenus(menusRes.data.slice(0, 3)); // Show top 3
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 min-h-screen font-sans max-w-7xl mx-auto"
    >
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-12 gap-6 min-h-[380px]">
        {/* Main Hero Block */}
        <motion.div 
          variants={itemVariant}
          className="col-span-12 lg:col-span-8 bg-gradient-to-br from-primary to-accent text-white p-8 md:p-12 rounded-[2.5rem] shadow-soft-lg relative overflow-hidden group border border-white/20"
        >
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                System Online
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mt-6 leading-tight drop-shadow-sm">
                Makan <span className="italic font-light opacity-90">Bergizi</span> <br/>
                Gratis.
              </h1>
              <p className="mt-4 text-white/90 max-w-md text-sm md:text-base font-medium leading-relaxed">
                Platform monitoring nutrisi siswa berbasis AI. 
                Upload foto menu makanan untuk analisis gizi instan dan akurat.
              </p>
            </div>
            
            <div className="mt-8">
               <button className="btn btn-ghost bg-white/20 hover:bg-white/30 text-white border-none rounded-full px-6 gap-2 backdrop-blur-sm">
                 Pelajari Lebih Lanjut <MdArrowForward />
               </button>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-black opacity-5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
        </motion.div>

        {/* Quick Action Tile */}
        <motion.div 
          variants={itemVariant}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 bg-base-100 p-8 rounded-[2.5rem] shadow-soft border border-neutral/50 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <Link to="/admin/analyze" className="absolute inset-0 z-20"></Link>
          <div className="flex justify-between items-start z-10">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <MdBolt className="text-3xl" />
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral/50 flex items-center justify-center text-base-content group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <MdArrowForward size={20} />
            </div>
          </div>
          
          <div className="z-10 mt-auto">
            <h2 className="text-3xl font-display font-bold text-base-content leading-none mb-2">
              Scan <br/> Menu
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-themed uppercase tracking-wider">
               <span className="w-8 h-px bg-primary"></span>
               AI Powered Analysis
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-primary/5 to-accent/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariant} className="col-span-6 lg:col-span-3 card-soft p-6 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
             <MdRestaurantMenu className="text-2xl" />
          </div>
          <div className="text-3xl font-bold font-display text-base-content">{stats?.totalMenus || 0}</div>
          <div className="text-xs font-bold text-muted-themed uppercase tracking-wide">Total Menu</div>
        </motion.div>

        <motion.div variants={itemVariant} className="col-span-6 lg:col-span-3 card-soft p-6 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
             <MdPeople className="text-2xl" />
          </div>
          <div className="text-3xl font-bold font-display text-base-content">{stats?.totalPorsi || 0}</div>
          <div className="text-xs font-bold text-muted-themed uppercase tracking-wide">Total Porsi</div>
        </motion.div>
        
        <motion.div variants={itemVariant} className="col-span-12 lg:col-span-6 bg-base-100 p-6 rounded-[2rem] border border-neutral/50 shadow-soft flex items-center justify-between relative overflow-hidden">
           <div className="relative z-10 pl-2">
             <div className="flex items-center gap-2 mb-1 text-warning">
               <MdPending /> 
               <span className="font-bold text-xs uppercase tracking-wider">Status Laporan</span>
             </div>
             <div className="text-4xl font-display font-bold text-base-content mb-1">{stats?.pendingReports || 0}</div>
             <div className="text-xs text-muted-themed">Laporan menunggu tinjauan</div>
           </div>
           
           <div className="relative z-10">
              <Link to="/admin/reports" className="btn btn-sm rounded-full px-6 bg-warning/10 text-warning hover:bg-warning hover:text-white border-0 font-bold transition-all shadow-sm">
                  Review
              </Link>
           </div>
           
           <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-warning/5 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Menu List */}
        <motion.div variants={itemVariant} className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
               <h2 className="text-2xl font-display font-bold text-base-content">Menu Terbaru</h2>
               <p className="text-sm text-muted-themed">Update menu makan bergizi terkini</p>
            </div>
            <Link to="/admin/history" className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1 transition-colors">
              Lihat Semua <MdArrowForward size={14} />
            </Link>
          </div>

          <div className="space-y-4">
            {recentMenus.map((menu, idx) => (
               <motion.div 
                 key={menu.id}
                 initial={{ x: -20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 transition={{ delay: 0.5 + (idx * 0.1) }}
                 className="group flex items-center gap-5 p-4 bg-base-100 rounded-3xl border border-neutral/40 hover:border-primary/20 hover:shadow-soft-lg transition-all duration-300"
               >
                  <div className="w-20 h-20 rounded-2xl bg-base-200 overflow-hidden relative shadow-inner">
                     {menu.foto_url ? (
                        <img 
                          src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          alt={menu.nama_menu}
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-themed bg-neutral/30">
                          <MdRestaurantMenu size={24} className="opacity-50" />
                        </div>
                     )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-lg text-base-content truncate">{menu.nama_menu}</h3>
                     <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold">
                          {menu.kalori} kkal
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">
                          {menu.protein}g prot
                        </span>
                     </div>
                  </div>

                  <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300 text-primary">
                     <MdArrowForward size={24} />
                  </div>
               </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nutrition Card - Visualized */}
        <motion.div variants={itemVariant}>
           <div className="bg-base-100 p-8 rounded-[2.5rem] shadow-soft border border-neutral/50 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-base-content pointer-events-none">
                <MdLocalFireDepartment size={200} />
              </div>
              
              <div className="relative z-10 mb-8">
                 <div className="inline-flex items-center gap-2 text-primary bg-primary/5 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    <MdTrendingUp /> Analyst Insight
                 </div>
                 <h2 className="text-3xl font-display font-bold text-base-content">Statistik <br/> Nutrisi</h2>
              </div>

              <div className="space-y-8 flex-1">
                 {/* Kalori Bar */}
                 <div>
                    <div className="flex justify-between text-sm mb-2 text-base-content font-medium">
                       <span>Rata-rata Kalori</span>
                       <span className="font-bold text-primary">{Math.round(stats?.avgKalori || 0)} <span className="text-xs text-muted-themed font-normal">kkal</span></span>
                    </div>
                    <div className="h-3 w-full bg-base-200 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-sm" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats?.avgKalori || 0) / 600 * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                       />
                    </div>
                 </div>

                 {/* Protein Bar */}
                 <div>
                    <div className="flex justify-between text-sm mb-2 text-base-content font-medium">
                       <span>Rata-rata Protein</span>
                       <span className="font-bold text-info">{Math.round(stats?.avgProtein || 0)} <span className="text-xs text-muted-themed font-normal">g</span></span>
                    </div>
                    <div className="h-3 w-full bg-base-200 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-sm" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats?.avgProtein || 0) / 30 * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 1 }}
                       />
                    </div>
                 </div>
              </div>

               <div className="mt-8 pt-6 border-t border-neutral/50">
                  <p className="text-xs text-muted-themed leading-relaxed">
                     * Data rata-rata dihitung berdasarkan <strong>{stats?.totalMenus} menu</strong> makanan yang telah dianalisis oleh AI dalam 30 hari terakhir.
                  </p>
               </div>
           </div>
        </motion.div>

      </section>

    </motion.div>
  );
}
