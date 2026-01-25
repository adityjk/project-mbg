import { Link } from 'react-router-dom';
import { MdHome, MdPeople, MdEmail, MdPhone } from 'react-icons/md';
import Footer from '../components/Footer';

// Data dummy tim SPPG - bisa diganti nanti
const teamMembers = [
  {
    id: 1,
    nama: 'Budi Santoso',
    jabatan: 'Ketua SPPG',
    foto: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=10b981&color=fff&size=200',
    deskripsi: 'Bertanggung jawab atas koordinasi keseluruhan program MBG di wilayah Siwalan.'
  },
  {
    id: 2,
    nama: 'Siti Aminah',
    jabatan: 'Sekretaris',
    foto: 'https://ui-avatars.com/api/?name=Siti+Aminah&background=6366f1&color=fff&size=200',
    deskripsi: 'Mengelola administrasi dan dokumentasi program.'
  },
  {
    id: 3,
    nama: 'Ahmad Rizki',
    jabatan: 'Koordinator Gizi',
    foto: 'https://ui-avatars.com/api/?name=Ahmad+Rizki&background=f59e0b&color=fff&size=200',
    deskripsi: 'Mengawasi kualitas gizi dan nutrisi makanan yang disajikan.'
  },
  {
    id: 4,
    nama: 'Dewi Putri',
    jabatan: 'Koordinator Distribusi',
    foto: 'https://ui-avatars.com/api/?name=Dewi+Putri&background=ec4899&color=fff&size=200',
    deskripsi: 'Mengatur jadwal dan logistik distribusi makanan ke sekolah.'
  },
  {
    id: 5,
    nama: 'Hendra Wijaya',
    jabatan: 'Petugas Pengaduan',
    foto: 'https://ui-avatars.com/api/?name=Hendra+Wijaya&background=8b5cf6&color=fff&size=200',
    deskripsi: 'Menangani laporan dan keluhan dari masyarakat.'
  },
  {
    id: 6,
    nama: 'Rina Wati',
    jabatan: 'Anggota',
    foto: 'https://ui-avatars.com/api/?name=Rina+Wati&background=14b8a6&color=fff&size=200',
    deskripsi: 'Membantu operasional harian program MBG.'
  }
];

export default function TimSPPG() {
  return (
    <div className="min-h-screen bg-bg-main font-sans selection:bg-black selection:text-white">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-4 md:p-6">
         <Link to="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-black shadow-neo-sm hover:scale-105 transition-transform">
            <MdHome size={24} />
            <span className="font-bold hidden md:inline">Kembali ke Beranda</span>
         </Link>
         <div className="font-black text-xl">MBG<span className="text-primary">.GO</span></div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="bg-success text-black p-8 rounded-[2.5rem] border-2 border-black shadow-neo overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MdPeople size={180} />
          </div>
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-black text-success font-black px-4 py-1 rounded-full text-xs uppercase mb-3">
              <MdPeople /> Tim Kami
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">TIM SPPG SIWALAN</h1>
            <p className="font-bold text-lg opacity-80">
              Satgas Pangan dan Gizi yang bertugas memastikan program MBG berjalan dengan baik
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member.id} className="group relative">
              <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-2 translate-y-2"></div>
              <div className="relative bg-white rounded-[2rem] border-2 border-black overflow-hidden hover:-translate-y-1 transition-transform">
                {/* Photo */}
                <div className="h-48 overflow-hidden border-b-2 border-black bg-gray-100 flex items-center justify-center">
                  <img 
                    src={member.foto} 
                    alt={member.nama}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Content */}
                <div className="p-5 text-center space-y-3">
                  <div>
                    <h3 className="text-xl font-black">{member.nama}</h3>
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mt-1">
                      {member.jabatan}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{member.deskripsi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-neo p-8">
          <h2 className="text-2xl font-black mb-6 text-center">HUBUNGI KAMI</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border-2 border-black">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white">
                <MdEmail size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Email</p>
                <p className="font-bold">sppg.siwalan@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border-2 border-black">
              <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-white">
                <MdPhone size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Telepon</p>
                <p className="font-bold">(021) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
