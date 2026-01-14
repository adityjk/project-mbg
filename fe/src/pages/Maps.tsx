import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon not showing
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SppgLocations = [
  { id: 1, name: "SPPG Pusat Jakarta", lat: -6.2088, lng: 106.8456, desc: "Pusat Distribusi Utama" },
  { id: 2, name: "SPPG Bandung", lat: -6.9175, lng: 107.6191, desc: "Cabang Jawa Barat" },
  { id: 3, name: "SPPG Surabaya", lat: -7.2575, lng: 112.7521, desc: "Cabang Jawa Timur" },
];

const Maps = () => {
  return (
    <div className="p-4 h-[calc(100vh-64px)]">
      <h2 className="text-2xl font-bold mb-4 text-primary">Peta Lokasi SPPG</h2>
      <div className="h-full w-full rounded-xl overflow-hidden shadow-lg border border-base-300">
        <MapContainer center={[-6.2088, 106.8456]} zoom={10} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {SppgLocations.map(loc => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{loc.name}</h3>
                  <p>{loc.desc}</p>
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
