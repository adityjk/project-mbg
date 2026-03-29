import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MdArrowBack } from 'react-icons/md';

// Fix for default marker icon not showing
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Maps = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [locations, setLocations] = useState<any[]>([]); 

  const handleBack = () => {
    if (!token) {
      navigate('/');
    } else {
      navigate(user.role === 'admin' ? '/admin' : '/user');
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      // Import dynamically or assume api is available
      const response = await import('../services/api').then(m => m.schoolApi.getAll());
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to fetch map locations:', error);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-neutral font-sans">
      {/* Navigation Overlay */}
      <div className="absolute top-6 left-6 z-[1000]">
        <button 
          onClick={handleBack}
          className="flex items-center gap-3 px-5 py-3 bg-white/90 backdrop-blur-md shadow-soft hover:shadow-soft-lg rounded-2xl border border-white/50 hover:bg-white transition-all hover:-translate-y-0.5 group"
        >
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
             <MdArrowBack className="text-lg text-primary group-hover:text-white" />
          </div>
          <div className="flex flex-col items-start">
             <span className="text-xs font-bold text-muted-themed uppercase tracking-wider">KEMBALI KE</span>
             <span className="font-display font-bold text-base-content group-hover:text-primary transition-colors">Dashboard</span>
          </div>
        </button>
      </div>

      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[-6.8925, 109.6125]} 
          zoom={14} 
          scrollWheelZoom={true} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locations.map(loc => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup className="custom-popup">
                <div className="text-center p-2 min-w-[180px]">
                  <h3 className={`font-display font-bold border-b pb-2 mb-2 text-lg ${loc.tipe === 'sppg' ? 'text-success border-success/20' : 'text-primary border-primary/20'}`}>
                    {loc.nama_sekolah}
                  </h3>
                  {loc.tipe === 'sekolah' ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-bold text-muted-themed uppercase">Sekolah Penerima</p>
                      <p className="text-xl font-black text-base-content">{loc.jumlah_siswa} <span className="text-sm font-medium text-muted-themed">Siswa</span></p>
                    </div>
                  ) : (
                    <div>
                         <p className="text-xs font-bold text-muted-themed uppercase mb-1">{loc.alamat || 'Pusat Distribusi'}</p>
                         <span className="badge badge-success badge-sm">Sentra Produksi</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Maps;
