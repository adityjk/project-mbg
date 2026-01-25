import { Link } from 'react-router-dom';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { FaInstagram } from 'react-icons/fa';

// Data dummy - bisa diganti nanti
const sppgInfo = {
  nama: 'SPPG Siwalan',
  instagram: '@sppgsiwalan',
  instagramUrl: 'https://www.instagram.com/sppgsiwalan/',
  alamat: 'Jl. Medoho I No. 20, Gayamsari, Kota Semarang Yayasan Cahaya Srikandi Harapan Bangsa',
  telepon: '(021) 123-4567',
  email: 'sppg.siwalan@gmail.com'
};

export default function Footer() {
  return (
    <footer className="bg-neutral text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black">
                M
              </div>
              <span className="font-black text-2xl">MBG<span className="text-primary">.GO</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform digital pemantauan nutrisi dan distribusi makanan untuk program Makan Bergizi Gratis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-black text-lg">LINK CEPAT</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/menu-history" className="text-gray-400 hover:text-primary transition-colors font-medium">
                  Riwayat Menu
                </Link>
              </li>
              <li>
                <Link to="/tim-sppg" className="text-gray-400 hover:text-primary transition-colors font-medium">
                  Tim SPPG
                </Link>
              </li>
              <li>
                <Link to="/aduan" className="text-gray-400 hover:text-primary transition-colors font-medium">
                  Layanan Pengaduan
                </Link>
              </li>
              <li>
                <Link to="/maps" className="text-gray-400 hover:text-primary transition-colors font-medium">
                  Peta Distribusi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-black text-lg">{sppgInfo.nama.toUpperCase()}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MdLocationOn className="text-primary mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-400 text-sm">{sppgInfo.alamat}</span>
              </li>
              <li className="flex items-center gap-3">
                <MdPhone className="text-primary flex-shrink-0" size={20} />
                <span className="text-gray-400 text-sm">{sppgInfo.telepon}</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="text-primary flex-shrink-0" size={20} />
                <span className="text-gray-400 text-sm">{sppgInfo.email}</span>
              </li>
              <li>
                <a 
                  href={sppgInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary transition-colors"
                >
                  <FaInstagram className="text-pink-500 flex-shrink-0" size={20} />
                  <span className="text-gray-400 text-sm font-medium">{sppgInfo.instagram}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 <span className="font-bold text-primary">{sppgInfo.nama}</span> • Program Makan Bergizi Gratis
          </p>
          <p className="text-gray-600 text-xs">
            Badan Gizi Nasional • Indonesia Maju
          </p>
        </div>
      </div>
    </footer>
  );
}
