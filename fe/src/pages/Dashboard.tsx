import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MdRestaurantMenu, 
  MdPeople, 
  MdPending,
  MdLocalFireDepartment,
  MdArrowForward,
  MdBolt
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
  show: { y: 0, opacity: 1, transition: { type: "spring", bounce: 0.4 } }
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
      <div className="flex justify-center items-center h-screen bg-base-100">
        <div className="loading loading-bars loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-8 min-h-screen bg-base-100 font-sans"
    >
      
      {/* 1. HERO BENTO GRID */}
      <section className="grid grid-cols-12 gap-6 min-h-[400px]">
        {/* Main Hero Block */}
        <motion.div 
          variants={itemVariant}
          className="col-span-12 lg:col-span-8 bg-primary text-base-100 p-8 md:p-12 rounded-[2rem] border-2 border-neutral shadow-neo relative overflow-hidden group"
        >
          <div className="relative z-10">
            <span className="font-mono text-secondary text-xs tracking-widest border border-secondary px-3 py-1 rounded-full uppercase">
              System Status: Online
            </span>
            <h1 className="text-5xl md:text-7xl font-black mt-6 leading-[0.9]">
              MAKAN <br/>
              <span className="text-secondary bg-base-100 text-primary px-2 italic transform -skew-x-6 inline-block">BERGIZI</span> <br/>
              GRATIS.
            </h1>
            <p className="mt-6 font-mono text-base-100/80 max-w-md text-sm md:text-base">
              Platform monitoring nutrisi siswa berbasis AI. 
              Upload foto, dapatkan data gizi instan.
            </p>
          </div>
          
          {/* Decorative Circle */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        </motion.div>

        {/* Quick Action Tile (Tilt Effect) */}
        <motion.div 
          variants={itemVariant}
          whileHover={{ scale: 1.02, rotate: -1 }}
          whileTap={{ scale: 0.95 }}
          className="col-span-12 md:col-span-6 lg:col-span-4 bg-secondary p-8 rounded-[2rem] border-2 border-neutral shadow-neo flex flex-col justify-between cursor-pointer group relative overflow-hidden"
        >
          <Link to="/admin/analyze" className="absolute inset-0 z-20"></Link>
          <div className="flex justify-between items-start z-10">
            <div className="bg-neutral/10 p-3 rounded-full">
              <MdBolt className="text-4xl text-neutral" />
            </div>
            <div className="bg-neutral text-base-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg group-hover:rotate-45 transition-transform duration-300">
              <MdArrowForward />
            </div>
          </div>
          <div className="z-10 mt-auto">
            <h2 className="text-4xl font-black text-neutral leading-none">
              SCAN <br/> MENU
            </h2>
            <p className="text-neutral/70 font-mono text-xs mt-3 uppercase tracking-wider border-t border-neutral/20 pt-3">
              AI Analysis • Camera Ready
            </p>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariant} className="col-span-6 lg:col-span-3 bg-base-100 p-6 rounded-3xl border-2 border-neutral shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          < MdRestaurantMenu className="text-3xl text-primary mb-2" />
          <div className="text-4xl font-black text-base-content">{stats?.totalMenus || 0}</div>
          <div className="font-mono text-xs text-muted-themed mt-1 uppercase">Total Menu</div>
        </motion.div>

        <motion.div variants={itemVariant} className="col-span-6 lg:col-span-3 bg-base-100 p-6 rounded-3xl border-2 border-neutral shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
          < MdPeople className="text-3xl text-accent mb-2" />
          <div className="text-4xl font-black text-base-content">{stats?.totalPorsi || 0}</div>
          <div className="font-mono text-xs text-muted-themed mt-1 uppercase">Total Porsi</div>
        </motion.div>
        
        <motion.div variants={itemVariant} className="col-span-12 lg:col-span-6 bg-base-300 p-6 rounded-3xl border-2 border-neutral shadow-neo text-base-content flex items-center justify-between">
           <div>
             <div className="flex items-center gap-2 mb-2 text-warning">
               <MdPending /> 
               <span className="font-mono text-xs uppercase">Laporan Masuk</span>
             </div>
             <div className="text-5xl font-black">{stats?.pendingReports || 0}</div>
             <div className="text-xs text-muted-themed mt-1">Perlu tinjauan admin</div>
           </div>
           <Link to="/admin/reports" className="btn btn-warning btn-sm rounded-full px-6 border-2 border-neutral shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              Review
           </Link>
        </motion.div>
      </section>

      {/* 2. RECENT MENUS & NUTRITION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Menu List */}
        <motion.div variants={itemVariant} className="space-y-4">
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-3xl font-black bg-base-100 text-base-content inline-block px-2 border-b-4 border-secondary transform -rotate-1">
              FRESH DROPS 🍱
            </h2>
            <Link to="/admin/history" className="font-mono text-primary hover:underline text-sm">view all history</Link>
          </div>

          {recentMenus.map((menu, idx) => (
             <motion.div 
               key={menu.id}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5 + (idx * 0.1) }}
               className="group flex items-center gap-4 bg-base-100 p-4 rounded-2xl border-2 border-transparent hover:border-neutral hover:shadow-neo transition-all duration-300 transform hover:-translate-y-1"
             >
                <div className="w-20 h-20 rounded-xl bg-base-200 overflow-hidden border border-neutral relative">
                   {menu.foto_url ? (
                      <img 
                        src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={menu.nama_menu}
                      />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-themed">
                        <MdRestaurantMenu size={24} />
                      </div>
                   )}
                </div>
                
                <div className="flex-1">
                   <h3 className="font-bold text-lg leading-tight text-base-content">{menu.nama_menu}</h3>
                   <div className="flex gap-2 mt-2">
                      <span className="badge badge-accent badge-outline font-mono text-xs font-bold bg-accent/10">
                        {menu.kalori} kkal
                      </span>
                      <span className="badge badge-primary badge-outline font-mono text-xs font-bold bg-primary/10">
                        {menu.protein}g prot
                      </span>
                   </div>
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-base-300 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-base-100 transition-colors text-muted-themed">
                   <MdArrowForward />
                </div>
             </motion.div>
          ))}
        </motion.div>

        {/* Nutrition Card - Visualized */}
        <motion.div variants={itemVariant}>
           <div className="bg-base-100 p-8 rounded-[2.5rem] border-2 border-neutral shadow-neo relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-base-content">
                <MdLocalFireDepartment size={150} />
              </div>
              
              <h2 className="text-3xl font-black mb-8 text-base-content">NUTRITION <br/> BREAKDOWN</h2>

              <div className="space-y-6">
                 {/* Kalori Bar */}
                 <div>
                    <div className="flex justify-between font-mono text-xs mb-2 text-base-content">
                       <span>AVG CALORIES</span>
                       <span className="font-bold">{Math.round(stats?.avgKalori || 0)} kkal</span>
                    </div>
                    <div className="h-4 w-full bg-base-200 rounded-full border border-neutral overflow-hidden relative">
                       <motion.div 
                          className="h-full bg-secondary stripes" // stripes class if needed or just color
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats?.avgKalori || 0) / 600 * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 0.8 }}
                       />
                    </div>
                 </div>

                 {/* Protein Bar */}
                 <div>
                    <div className="flex justify-between font-mono text-xs mb-2 text-base-content">
                       <span>AVG PROTEIN</span>
                       <span className="font-bold">{Math.round(stats?.avgProtein || 0)} g</span>
                    </div>
                    <div className="h-4 w-full bg-base-200 rounded-full border border-neutral overflow-hidden relative">
                       <motion.div 
                          className="h-full bg-primary" 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((stats?.avgProtein || 0) / 30 * 100, 100)}%` }}
                          transition={{ duration: 1.5, delay: 1 }}
                       />
                    </div>
                 </div>
              </div>

               <div className="mt-8 p-4 bg-base-200 rounded-xl text-xs font-mono text-muted-themed border border-dashed border-base-300">
                  Data rata-rata diambil dari {stats?.totalMenus} menu terakhir yang dianalisis oleh AI.
               </div>

           </div>
        </motion.div>

      </section>

    </motion.div>
  );
}
