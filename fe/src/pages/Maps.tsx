import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MdArrowBack, MdDashboard } from 'react-icons/md';

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
  const [locations, setLocations] = useState<any[]>([]); // Using any for simplicity or import School type

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
      // Note: We need to import schoolApi and School type
      const response = await import('../services/api').then(m => m.schoolApi.getAll());
      setLocations(response.data);
    } catch (error) {
      console.error('Failed to fetch map locations:', error);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--bg-main)]">
      {/* Navigation Overlay */}
      <div className="absolute top-24 left-4 z-[1000] flex gap-2">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-3 bg-white/90 backdrop-blur shadow-xl rounded-2xl border border-white hover:bg-white transition-all hover:scale-105 active:scale-95 group"
        >
          <MdArrowBack className="text-xl text-green-600 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-gray-700 hidden sm:inline">Kembali ke Dashboard</span>
          <MdDashboard className="text-xl text-green-600 sm:hidden" />
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
              <Popup>
                <div className="text-center p-2 min-w-[150px]">
                  <h3 className={`font-bold border-b pb-1 mb-2 ${loc.tipe === 'sppg' ? 'text-green-700 border-green-100' : 'text-blue-700 border-blue-100'}`}>
                    {loc.nama_sekolah}
                  </h3>
                  {loc.tipe === 'sekolah' ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold">Sekolah Penerima</p>
                      <p className="text-lg font-bold text-blue-600">{loc.jumlah_siswa} Siswa</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{loc.alamat || 'Pusat Distribusi'}</p>
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
