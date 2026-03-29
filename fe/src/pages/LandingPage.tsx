import { Link, useNavigate } from 'react-router-dom';
import { MdRestaurantMenu, MdAdminPanelSettings, MdArrowForward, MdSchool, MdLocalDining, MdDashboard, MdLogout, MdCampaign, MdPeople, MdHistory, MdCheckCircle } from 'react-icons/md';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleCardClick = (path: string, role: string) => {
    if (token && user.role) {
      if (user.role === role || user.role === 'admin') {
        navigate(path);
      } else {
        // Soft alert replacement (could be a toast in real app)
        alert(`Anda sedang login sebagai ${user.role}. Silakan logout untuk masuk sebagai ${role}.`);
      }
    } else {
      navigate('/login', { state: { role } });
    }
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, bounce: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-neutral font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden transition-colors duration-300">
      
      {/* Soft Gradient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-secondary/20 to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 transition-all duration-300 backdrop-blur-sm bg-base-100/50 border-b border-white/10 supports-[backdrop-filter]:bg-base-100/20">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
             <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-xl flex items-center justify-center text-white shadow-soft">
                   <MdLocalDining size={24} />
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-base-content">MBG<span className="text-primary">.GO</span></span>
             </div>

             <div className="flex items-center gap-4">
                 <ThemeToggle />
                 
                 {/* Auth Status */}
                 {token ? (
                    <div className="flex gap-3">
                       <button 
                          onClick={() => navigate(user.role === 'admin' ? '/admin' : '/user')}
                          className="btn btn-primary btn-sm md:btn-md rounded-xl shadow-soft hover:shadow-soft-lg text-white font-bold px-6"
                       >
                          <MdDashboard /> <span className="hidden md:inline">Dashboard</span>
                       </button>
                       <button 
                          onClick={handleLogout}
                          className="btn btn-ghost btn-sm md:btn-md rounded-xl text-error hover:bg-error/10"
                       >
                          <MdLogout size={20} />
                       </button>
                    </div>
                 ) : (
                    <Link to="/login" className="btn btn-primary rounded-xl shadow-soft hover:shadow-soft-lg text-white font-bold px-6">
                       Masuk
                    </Link>
                 )}
             </div>
         </div>
      </nav>

      {/* Hero Content */}
      <motion.div 
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="min-h-screen flex flex-col justify-center items-center relative z-10 p-4 pt-32 pb-20"
      >
        
        {/* Main Title Badge */}
        <motion.div variants={itemVariant} className="mb-8">
           <span className="bg-base-100/80 backdrop-blur-md px-4 py-2 md:px-5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-widest text-primary shadow-sm border border-white/50 inline-block max-w-full truncate md:overflow-visible md:whitespace-normal">
              🚀 Program Nasional Makan Bergizi Gratis 2026
           </span>
        </motion.div>

        <motion.div variants={itemVariant} className="text-center max-w-5xl mx-auto mb-16 space-y-6">
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight text-base-content drop-shadow-sm">
              MAKAN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">BERGIZI</span><br/> 
              <span className="text-base-content/90">GRATIS</span>
           </h1>
           <p className="text-xl md:text-2xl font-medium text-muted-themed max-w-2xl mx-auto leading-relaxed">
              Platform digital pemantauan nutrisi dan distribusi makanan untuk mewujudkan generasi emas Indonesia yang sehat dan cerdas.
           </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-4">
           
           {/* Student Card */}
           <motion.div variants={itemVariant} onClick={() => handleCardClick('/user', 'user')} className="group cursor-pointer">
              <div className="relative bg-base-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center h-full border border-neutral/10 shadow-soft hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-300">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdSchool size={40} className="text-green-600" />
                 </div>
                 <h2 className="text-2xl font-display font-bold mb-3 text-base-content">Siswa & Guru</h2>
                 <p className="text-muted-themed px-4 mb-8 leading-relaxed">Lihat menu harian, cek kandungan nutrisi, dan kirim laporan penerimaan makanan.</p>
                 <div className="mt-auto inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                    <span>Akses Siswa</span> <MdArrowForward />
                 </div>
              </div>
           </motion.div>

           {/* Admin Card */}
           <motion.div variants={itemVariant} onClick={() => handleCardClick('/admin', 'admin')} className="group cursor-pointer">
              <div className="relative bg-base-100 rounded-[2.5rem] p-8 md:p-10 flex flex-col items-center text-center h-full border border-neutral/10 shadow-soft hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-300">
                 <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdAdminPanelSettings size={40} className="text-blue-600" />
                 </div>
                 <h2 className="text-2xl font-display font-bold mb-3 text-base-content">Staf & Admin</h2>
                 <p className="text-muted-themed px-4 mb-8 leading-relaxed">Kelola distribusi menu, analisis nutrisi dengan AI, dan manajemen sekolah.</p>
                 <div className="mt-auto inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                    <span>Login Staf</span> <MdArrowForward />
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Public Report Banner */}
        <motion.div variants={itemVariant} className="mt-12 w-full max-w-4xl px-4">
            <Link to="/aduan" className="group block">
              <div className="relative bg-gradient-to-r from-base-content to-neutral-800 text-base-100 rounded-[2rem] p-8 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                 
                 {/* Decorative circles */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <div className="flex items-center gap-6 relative z-10 mb-6 md:mb-0 text-center md:text-left">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                       <MdCampaign size={32} className="text-white" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-display font-bold mb-1">Punya Keluhan?</h3>
                       <p className="opacity-80 font-medium max-w-md">Sampaikan masalah distribusi atau kualitas makanan secara anonim.</p>
                    </div>
                 </div>
                 <div className="bg-base-100 text-base-content px-6 py-3 rounded-xl font-bold flex items-center gap-2 group-hover:scale-105 transition-transform shadow-sm">
                    Lapor Sekarang <MdArrowForward />
                 </div>
              </div>
            </Link>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div variants={itemVariant} className="mt-8 w-full max-w-4xl px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Riwayat Menu */}
            <Link to="/menu-history" className="bg-base-100 rounded-3xl p-6 border border-neutral/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex items-center gap-4 group">
                 <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MdHistory size={24} className="text-orange-600 group-hover:text-white" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-base-content group-hover:text-primary transition-colors">Riwayat Menu</h3>
                    <p className="text-xs text-muted-themed">Arsip menu makanan</p>
                 </div>
                 <MdArrowForward className="text-neutral/30 group-hover:text-primary transition-colors" />
            </Link>

            {/* Tim SPPG */}
            <Link to="/tim-sppg" className="bg-base-100 rounded-3xl p-6 border border-neutral/10 shadow-sm hover:shadow-md hover:border-success/20 transition-all flex items-center gap-4 group">
                 <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MdPeople size={24} className="text-green-600 group-hover:text-white" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-bold text-base-content group-hover:text-green-600 transition-colors">Tim SPPG</h3>
                    <p className="text-xs text-muted-themed">Satgas Pangan Gizi</p>
                 </div>
                 <MdArrowForward className="text-neutral/30 group-hover:text-green-600 transition-colors" />
            </Link>
        </motion.div>

      </motion.div>
      
      {/* Footer */}
      <div className="relative z-10">
         <Footer />
      </div>
    </div>
  );
}

