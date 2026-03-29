import { useState, useEffect } from 'react';
import { MdSchool, MdAdd, MdEdit, MdDelete, MdPlace, MdLocalShipping, MdMap, MdClose } from 'react-icons/md';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { schoolApi } from '../../services/api';
import type { School } from '../../types';

// Fix Leaflet icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position} icon={DefaultIcon} />
  ) : null;
}

export default function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama_sekolah: '',
    alamat: '',
    jumlah_siswa: 0,
    tipe: 'sekolah' as 'sekolah' | 'sppg',
    latitude: -6.8925,
    longitude: 109.6125
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await schoolApi.getAll();
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSchool) {
        await schoolApi.update(editingSchool.id, formData);
      } else {
        await schoolApi.create(formData);
      }
      setModalOpen(false);
      setEditingSchool(null);
      fetchSchools();
    } catch (error) {
      alert('Gagal menyimpan data');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data ini?')) return;
    try {
      await schoolApi.delete(id);
      setSchools(schools.filter(s => s.id !== id));
    } catch (error) {
       console.error('Failed to delete school:', error);
       alert('Gagal menghapus data');
    }
  };

  const openAddModal = () => {
    setEditingSchool(null);
    setFormData({
      nama_sekolah: '',
      alamat: '',
      jumlah_siswa: 0,
      tipe: 'sekolah',
      latitude: -6.8925,
      longitude: 109.6125
    });
    setModalOpen(true);
  };

  const openEditModal = (school: School) => {
    setEditingSchool(school);
    setFormData({
      nama_sekolah: school.nama_sekolah,
      alamat: school.alamat,
      jumlah_siswa: school.jumlah_siswa,
      tipe: school.tipe,
      latitude: school.latitude,
      longitude: school.longitude,
    });
    setModalOpen(true);
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  if (loading) return (
     <div className="flex justify-center items-center h-[50vh]">
         <div className="loading loading-bars loading-lg text-primary"></div>
     </div>
  );

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-base-100 p-6 rounded-[2rem] border-2 border-base-content/20 shadow-neo">
        <div>
           <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs uppercase mb-2 border border-blue-200">
             <MdMap /> Manajemen Data
           </div>
          <h1 className="text-3xl md:text-4xl font-black text-base-content">
            SEKOLAH & SPPG
          </h1>
          <p className="text-base-content/70 font-medium mt-1">Kelola titik distribusi dan penerima manfaat MBG.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={openAddModal}
            className="btn btn-primary h-12 px-6 rounded-xl border-2 border-base-content/20 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-white flex items-center gap-2"
          >
            <MdAdd size={20} className="stroke-2" /> 
            TAMBAH DATA
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div key={school.id} className="bg-base-100 rounded-3xl border-2 border-base-content/20 shadow-neo p-6 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-12 h-12 rounded-xl border-2 border-base-content/20 flex items-center justify-center text-2xl ${
                  school.tipe === 'sppg' ? 'bg-green-400 text-black' : 'bg-blue-400 text-white'
               }`}>
                 {school.tipe === 'sppg' ? <MdLocalShipping /> : <MdSchool />}
               </div>
               <span className={`text-xs font-black px-3 py-1 rounded-full border-2 border-base-content/10 uppercase ${
                  school.tipe === 'sppg' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
               }`}>
                  {school.tipe}
               </span>
            </div>
            
            <h3 className="font-black text-xl mb-2 line-clamp-1 text-base-content" title={school.nama_sekolah}>{school.nama_sekolah}</h3>
            <div className="flex items-start gap-2 text-sm text-base-content/70 mb-4 h-10 line-clamp-2">
               <MdPlace className="flex-shrink-0 mt-0.5 text-base-content/40" />
               {school.alamat}
            </div>

            <div className="bg-base-200 rounded-xl p-3 border border-base-content/10 mb-4 grid grid-cols-2 gap-2">
               <div>
                  <div className="text-[10px] uppercase font-bold text-base-content/50">Total Siswa</div>
                  <div className="font-black text-lg text-base-content">{school.jumlah_siswa}</div>
               </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-base-content/50">Koordinat</div>
                  <div className="font-mono text-xs text-base-content/80">
                    {Number(school.latitude || 0).toFixed(3)}, {Number(school.longitude || 0).toFixed(3)}
                  </div>
               </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(school)} 
                  className="flex-1 btn btn-sm h-10 bg-base-100 border-2 border-base-content/20 font-bold hover:bg-yellow-300 hover:text-black flex items-center justify-center gap-2 text-base-content"
                >
                  <MdEdit /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(school.id)} 
                  className="btn btn-sm h-10 w-10 p-0 bg-base-100 border-2 border-base-content/20 text-error hover:bg-error hover:text-white flex items-center justify-center"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-base-100 rounded-[2rem] border-2 border-base-content/20 shadow-neo-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
            <div className="p-6 border-b-2 border-base-content/10 bg-base-200/50 flex justify-between items-center sticky top-0 z-20 rounded-t-[2rem]">
              <h2 className="text-xl font-black text-base-content">{editingSchool ? 'EDIT DATA' : 'TAMBAH DATA BARU'}</h2>
              <button 
                onClick={() => setModalOpen(false)} 
                className="w-10 h-10 rounded-full border-2 border-base-content/20 bg-base-100 hover:bg-error hover:text-white flex items-center justify-center transition-colors text-base-content"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Form Inputs */}
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Tipe Lokasi</label>
                  <select 
                    className="select select-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    value={formData.tipe}
                    onChange={(e) => setFormData({...formData, tipe: e.target.value as any})}
                  >
                    <option value="sekolah">Sekolah Penerima</option>
                    <option value="sppg">SPPG (Pusat Distribusi)</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Nama {formData.tipe === 'sekolah' ? 'Sekolah' : 'Unit'}</label>
                  <input 
                    type="text" 
                    required 
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    placeholder="Contoh: SDN 1 Siwalan"
                    value={formData.nama_sekolah}
                    onChange={(e) => setFormData({...formData, nama_sekolah: e.target.value})}
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Alamat Lengkap</label>
                  <textarea 
                    required 
                    className="textarea textarea-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl h-24 bg-base-100 text-base-content"
                    placeholder="Jalan..."
                    value={formData.alamat}
                    onChange={(e) => setFormData({...formData, alamat: e.target.value})}
                  />
                </div>

                {formData.tipe === 'sekolah' && (
                  <div className="form-control">
                    <label className="label font-bold text-sm text-base-content">Jumlah Siswa / Porsi</label>
                    <input 
                      type="number" 
                      className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                      value={formData.jumlah_siswa}
                      onChange={(e) => setFormData({...formData, jumlah_siswa: parseInt(e.target.value) || 0})}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="form-control">
                      <label className="label text-xs font-bold text-base-content/50">LATITUDE</label>
                      <input type="text" readOnly value={formData.latitude} className="input input-sm bg-base-200 border-2 border-base-content/10 rounded-lg font-mono text-xs text-base-content"/>
                   </div>
                   <div className="form-control">
                      <label className="label text-xs font-bold text-base-content/50">LONGITUDE</label>
                      <input type="text" readOnly value={formData.longitude} className="input input-sm bg-base-200 border-2 border-base-content/10 rounded-lg font-mono text-xs text-base-content"/>
                   </div>
                </div>

                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn bg-base-200 border-2 border-base-content/20 hover:bg-base-300 font-bold rounded-xl h-12 text-base-content">BATAL</button>
                   <button type="submit" className="flex-1 btn btn-primary border-2 border-base-content/20 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-none font-bold rounded-xl h-12 text-white">SIMPAN</button>
                </div>
              </div>

              {/* Right Column: Interactive Map Picker */}
              <div className="h-[400px] rounded-2xl overflow-hidden shadow-inner border-2 border-base-content/20 relative bg-base-200">
                <MapContainer 
                  center={[formData.latitude, formData.longitude]} 
                  zoom={15} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationPicker 
                    position={[formData.latitude, formData.longitude]} 
                    setPosition={(pos) => setFormData({...formData, latitude: pos[0], longitude: pos[1]})} 
                  />
                </MapContainer>
                <div className="absolute bottom-4 left-4 right-4 bg-base-100/90 backdrop-blur border border-base-content/20 p-3 rounded-xl text-xs text-center font-bold z-[1000] shadow-sm text-base-content">
                   KLIK PETA UNTUK MENANDAI LOKASI
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
