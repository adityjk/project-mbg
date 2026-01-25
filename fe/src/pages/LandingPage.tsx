import { Link, useNavigate } from 'react-router-dom';
import { MdRestaurantMenu, MdAdminPanelSettings, MdArrowForward, MdSchool, MdLocalDining, MdDashboard, MdLogout, MdCampaign, MdPeople, MdHistory } from 'react-icons/md';
import ThemeToggle from '../components/ThemeToggle';
import Footer from '../components/Footer';

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
        alert(`Anda sedang login sebagai ${user.role}. Silakan logout untuk masuk sebagai ${role}.`);
      }
    } else {
      navigate('/login', { state: { role } });
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans selection:bg-primary selection:text-base-100 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary rounded-full blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary rounded-full blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full p-4 md:p-6 z-50 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
         <div className="flex items-center gap-2 bg-base-100 px-4 py-2 rounded-xl border-2 border-neutral shadow-neo-sm transform hover:scale-105 transition-transform cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-base-100">
               <MdLocalDining size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-base-content">MBG<span className="text-primary">.GO</span></span>
         </div>

         <div className="flex items-center gap-4">
             <ThemeToggle />
             
             {/* Auth Status */}
             {token && (
                <div className="flex gap-2">
                   <button 
                      onClick={() => navigate(user.role === 'admin' ? '/admin' : '/user')}
                      className="bg-base-100 border-2 border-neutral px-4 py-2 rounded-xl font-bold hover:bg-base-200 flex items-center gap-2 shadow-neo-sm text-base-content transition-colors"
                   >
                      <MdDashboard /> <span className="hidden md:inline">Dashboard</span>
                   </button>
                   <button 
                      onClick={handleLogout}
                      className="bg-error text-white border-2 border-neutral px-4 py-2 rounded-xl font-bold hover:opacity-90 flex items-center gap-2 shadow-neo-sm transition-opacity"
                   >
                      <MdLogout />
                   </button>
                </div>
             )}
         </div>
      </nav>

      {/* Hero Content */}
      <div className="min-h-screen flex flex-col justify-center items-center relative z-10 p-4 pt-24">
        
        {/* Main Title Badge */}
        <div className="animate-bounce-slow mb-6">
           <span className="badge-themed border-2 px-4 py-2 rounded-full font-black text-sm uppercase tracking-widest">
              🚀 Program Nasional 2026
           </span>
        </div>

        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
           <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-base-content mb-6 drop-shadow-sm">
              MAKAN <span className="text-base-100 inline-block transform -rotate-2 bg-primary px-4">BERGIZI</span><br/> 
              <span className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter text-base-content mb-6 drop-shadow-sm">GRATIS</span>
           </h1>
           <p className="text-xl md:text-2xl font-bold text-muted-themed max-w-2xl mx-auto leading-relaxed">
              Platform digital pemantauan nutrisi dan distribusi makanan untuk generasi emas Indonesia.
           </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl px-4">
           
           {/* Student Card */}
           <div onClick={() => handleCardClick('/user', 'user')} className="group relative cursor-pointer">
              <div className="absolute inset-0 card-shadow-bg rounded-[2.5rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
              <div className="relative bg-base-100 rounded-[2.5rem] border-4 border-neutral p-8 flex flex-col items-center text-center h-full hover:-translate-y-1 transition-transform overflow-hidden">
                 <div className="absolute top-0 right-0 bg-secondary text-neutral font-black text-xs px-3 py-1 border-l-2 border-b-2 border-neutral rounded-bl-xl">
                    SISWA / GURU
                 </div>
                 <div className="w-24 h-24 icon-circle-themed rounded-full border-2 border-neutral flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdSchool size={48} className="text-success" />
                 </div>
                 <h2 className="text-2xl font-black mb-2 text-base-content">MASUK SEBAGAI SISWA</h2>
                 <p className="text-muted-themed font-medium mb-6">Lihat menu hari ini, cek nutrisi, dan kirim laporan.</p>
                 <div className="mt-auto flex items-center gap-2 font-black underline decoration-4 decoration-primary underline-offset-4 group-hover:decoration-secondary transition-colors text-base-content">
                    AKSES SEKARANG <MdArrowForward />
                 </div>
              </div>
           </div>

           {/* Admin Card */}
           <div onClick={() => handleCardClick('/admin', 'admin')} className="group relative cursor-pointer">
              <div className="absolute inset-0 card-shadow-bg rounded-[2.5rem] translate-x-3 translate-y-3 transition-transform group-hover:translate-x-4 group-hover:translate-y-4"></div>
              <div className="relative admin-card-themed rounded-[2.5rem] border-4 border-neutral p-8 flex flex-col items-center text-center h-full hover:-translate-y-1 transition-transform overflow-hidden">
                 <div className="absolute top-0 right-0 bg-base-100 text-base-content font-black text-xs px-3 py-1 border-l-2 border-b-2 border-neutral rounded-bl-xl">
                    ADMIN ONLY
                 </div>
                 <div className="w-24 h-24 bg-base-100 rounded-full border-2 border-neutral flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdAdminPanelSettings size={48} className="text-primary" />
                 </div>
                 <h2 className="text-2xl font-black mb-2 text-base-content">LOGIN STAFF / ADMIN</h2>
                 <p className="text-muted-themed font-medium mb-6">Kelola menu, analisis AI, dan manajemen sekolah.</p>
                 <div className="mt-auto bg-base-100 text-base-content px-6 py-2 rounded-xl font-black border-2 border-neutral group-hover:bg-primary group-hover:text-base-100 group-hover:border-primary transition-colors">
                    LOGIN SYSTEM
                 </div>
              </div>
           </div>
        </div>

        {/* Public Report Button */}
        <div className="mt-12 w-full max-w-3xl px-4">
            <Link to="/aduan" className="group block relative">
              <div className="absolute inset-0 card-shadow-bg rounded-[2rem] translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3"></div>
              <div className="relative bg-accent dark:bg-base-100 rounded-[2rem] border-4 border-neutral p-6 flex items-center justify-between hover:-translate-y-1 transition-transform overflow-hidden">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-base-100 rounded-full border-2 border-neutral flex items-center justify-center shrink-0">
                       <MdCampaign size={32} className="text-accent" />
                    </div>
                    <div className="text-left">
                       <h3 className="text-xl font-black text-base-100 dark:text-base-content">LAYANAN PENGADUAN PUBLIK</h3>
                       <p className="font-bold text-base-100/70 dark:text-base-content/70 text-sm">Laporkan masalah tanpa perlu login (Anonim)</p>
                    </div>
                 </div>
                 <div className="bg-base-100 text-accent dark:bg-neutral p-3 rounded-full group-hover:scale-110 transition-transform">
                    <MdArrowForward size={24} />
                 </div>
              </div>
            </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-8 w-full max-w-3xl px-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Riwayat Menu */}
            <Link to="/menu-history" className="group relative">
              <div className="absolute inset-0 card-shadow-bg rounded-2xl translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="relative bg-base-100 rounded-2xl border-2 border-neutral p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                 <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MdHistory size={24} className="text-primary" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-black text-base-content">RIWAYAT MENU</h3>
                    <p className="text-xs text-muted-themed">Lihat menu MBG yang sudah disajikan</p>
                 </div>
                 <MdArrowForward size={20} className="text-primary" />
              </div>
            </Link>

            {/* Tim SPPG */}
            <Link to="/tim-sppg" className="group relative">
              <div className="absolute inset-0 card-shadow-bg rounded-2xl translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              <div className="relative bg-base-100 rounded-2xl border-2 border-neutral p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                 <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center shrink-0">
                    <MdPeople size={24} className="text-success" />
                 </div>
                 <div className="flex-1">
                    <h3 className="font-black text-base-content">TIM SPPG</h3>
                    <p className="text-xs text-muted-themed">Kenali tim Satgas Pangan Gizi</p>
                 </div>
                 <MdArrowForward size={20} className="text-success" />
              </div>
            </Link>
        </div>

      </div>

      {/* Marquee Background */}
      <div className="absolute bottom-[300px] w-full overflow-hidden border-t-2 border-neutral bg-primary py-2 rotate-1 scale-105 opacity-10 pointer-events-none">
         <div className="whitespace-nowrap animate-marquee font-black text-6xl text-base-100 uppercase tracking-widest">
            MAKAN SEHAT • HIDUP KUAT • GENERASI EMAS • INDONESIA MAJU • MAKAN SEHAT • HIDUP KUAT • GENERASI EMAS •
         </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

