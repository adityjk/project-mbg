import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdHome, MdPeople, MdEmail, MdPhone } from 'react-icons/md';
import Footer from '../components/Footer';
import { timSppgApi } from '../services/api';
import type { TimSPPG } from '../types';
import { motion } from 'framer-motion';

export default function TimSPPGPublic() {
  const [teamMembers, setTeamMembers] = useState<TimSPPG[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await timSppgApi.getAll();
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch team:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar URL from name
  const getAvatarUrl = (nama: string, foto_url: string | null) => {
    if (foto_url) return foto_url;
    const colors = ['10b981', '6366f1', 'f59e0b', 'ec4899', '8b5cf6', '14b8a6'];
    const colorIndex = nama.charCodeAt(0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${colors[colorIndex]}&color=fff&size=200`;
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
    <div className="min-h-screen bg-neutral font-sans selection:bg-success/20 selection:text-success relative overflow-hidden">
      
      {/* Soft Gradient Background */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-success/5 rounded-full blur-[100px] -translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

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
            <MdPeople size={200} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success font-bold px-4 py-1.5 rounded-full text-xs uppercase mb-4">
              <MdPeople /> Tim Kami
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 tracking-tight">TIM SPPG SIWALAN</h1>
            <p className="font-medium text-lg text-muted-themed max-w-2xl">
              Satuan Tugas Pangan dan Gizi yang berdedikasi memastikan program MBG berjalan lancar dan tepat sasaran.
            </p>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <span className="loading loading-dots loading-lg text-success"></span>
          </div>
        )}

        {/* Empty State */}
        {!loading && teamMembers.length === 0 && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="bg-base-50 rounded-[2.5rem] border border-neutral/10 border-dashed p-12 text-center"
          >
            <div className="w-24 h-24 bg-neutral/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MdPeople size={48} className="text-muted-themed" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2 text-base-content">Data Tim Belum Tersedia</h3>
            <p className="text-muted-themed font-medium px-4">Informasi anggota tim SPPG sedang dipersiapkan dan akan segera hadir.</p>
          </motion.div>
        )}

        {/* Team Grid */}
        {!loading && teamMembers.length > 0 && (
          <motion.div 
             variants={containerVariant}
             initial="hidden"
             animate="show"
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map(member => (
              <motion.div variants={itemVariant} key={member.id} className="group">
                <div className="bg-base-100 rounded-[2rem] border border-neutral/10 shadow-soft hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                  {/* Photo Background */}
                  <div className="h-32 bg-gradient-to-br from-success/5 to-primary/5 border-b border-neutral/5"></div>
                  
                  <div className="px-6 pb-8 relative">
                     {/* Avatar */}
                     <div className="w-24 h-24 rounded-[2rem] border-4 border-base-100 shadow-soft bg-base-100 -mt-12 mb-4 overflow-hidden mx-auto group-hover:scale-105 transition-transform duration-300">
                        <img 
                          src={getAvatarUrl(member.nama, member.foto_url)} 
                          alt={member.nama}
                          className="w-full h-full object-cover"
                        />
                     </div>

                     {/* Content */}
                     <div className="text-center space-y-3">
                        <div>
                          <h3 className="text-xl font-display font-bold text-base-content">{member.nama}</h3>
                          <span className="inline-block bg-success/10 text-success px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase tracking-wide">
                            {member.jabatan}
                          </span>
                        </div>
                        {member.deskripsi && (
                          <p className="text-sm text-muted-themed leading-relaxed">{member.deskripsi}</p>
                        )}
                        
                        {/* Social/Contact Placeholder (Optional) */}
                        <div className="pt-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {/* Add social buttons here if needed */}
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="bg-base-100 rounded-[2.5rem] border border-neutral/10 shadow-soft p-8 md:p-10"
        >
          <div className="text-center mb-8">
             <h2 className="text-2xl font-display font-bold mb-2">Hubungi Kami</h2>
             <p className="text-muted-themed font-medium text-sm">Punya pertanyaan seputar program gizi? Jangan ragu untuk menghubungi tim kami.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 bg-base-50 rounded-2xl p-4 border border-neutral/10 hover:border-primary/20 hover:bg-white hover:shadow-soft transition-all group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <MdEmail size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-themed uppercase">Email</p>
                <p className="font-bold text-base-content group-hover:text-primary transition-colors">sppg.siwalan@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-base-50 rounded-2xl p-4 border border-neutral/10 hover:border-success/20 hover:bg-white hover:shadow-soft transition-all group">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center text-success group-hover:bg-success group-hover:text-white transition-colors">
                <MdPhone size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-themed uppercase">Telepon / WhatsApp</p>
                <p className="font-bold text-base-content group-hover:text-success transition-colors">(021) 123-4567</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
