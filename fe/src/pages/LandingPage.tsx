import { Link } from 'react-router-dom';
import { MdPerson, MdAdminPanelSettings, MdFastfood, MdRestaurantMenu } from 'react-icons/md';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FBF8 0%, #E8F5E9 50%, #F0F7F0 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Logo & Title */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 12px 32px rgba(76, 175, 80, 0.3)'
        }}>
          <MdFastfood style={{ fontSize: '48px', color: 'white' }} />
        </div>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 700, 
          color: '#2E3A2F',
          marginBottom: '8px'
        }}>
          Makan Bergizi Gratis
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#6B7B6C',
          maxWidth: '400px'
        }}>
          Program nutrisi sehat untuk siswa-siswi Indonesia
        </p>
        <p style={{
          marginTop: '8px',
          fontSize: '14px',
          color: '#9CA99D'
        }}>
          SPPG Bandarharjo 2 • Semarang Utara
        </p>
      </div>

      {/* Role Selection */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '600px',
        width: '100%'
      }}>
        {/* User Card */}
        <Link 
          to="/user"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(76, 175, 80, 0.15)';
            e.currentTarget.style.borderColor = '#4CAF50';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MdPerson style={{ fontSize: '40px', color: '#4CAF50' }} />
            </div>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: '#2E3A2F',
              marginBottom: '8px'
            }}>
              Siswa / Guru
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6B7B6C',
              lineHeight: 1.6
            }}>
              Lihat menu hari ini dan buat laporan
            </p>
          </div>
        </Link>

        {/* Admin Card */}
        <Link 
          to="/admin"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
            border: '2px solid transparent',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 152, 0, 0.15)';
            e.currentTarget.style.borderColor = '#FF9800';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <MdAdminPanelSettings style={{ fontSize: '40px', color: '#FF9800' }} />
            </div>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: 600, 
              color: '#2E3A2F',
              marginBottom: '8px'
            }}>
              Admin
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6B7B6C',
              lineHeight: 1.6
            }}>
              Kelola menu dan laporan
            </p>
          </div>
        </Link>
      </div>

      {/* Today's Menu Quick Preview */}
      <div style={{
        marginTop: '48px',
        textAlign: 'center',
        padding: '20px 32px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <MdRestaurantMenu style={{ color: '#4CAF50' }} />
          <span style={{ color: '#6B7B6C', fontSize: '14px' }}>
            Lihat menu hari ini langsung di halaman siswa →
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '48px',
        textAlign: 'center',
        color: '#9CA99D',
        fontSize: '13px'
      }}>
        <p>© 2026 Badan Gizi Nasional • Program MBG</p>
      </div>
    </div>
  );
}
