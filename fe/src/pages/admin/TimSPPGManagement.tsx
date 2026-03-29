import { useState, useEffect, useRef } from 'react';
import { MdPeople, MdAdd, MdEdit, MdDelete, MdClose, MdEmail, MdPhone, MdCheck, MdVisibilityOff, MdCloudUpload, MdPhotoCamera } from 'react-icons/md';
import { timSppgApi } from '../../services/api';
import type { TimSPPG } from '../../types';

export default function TimSPPGManagement() {
  const [members, setMembers] = useState<TimSPPG[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TimSPPG | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    deskripsi: '',
    foto_url: '',
    email: '',
    telepon: '',
    urutan: 0,
    is_active: true
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await timSppgApi.getAllAdmin();
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    try {
      const response = await timSppgApi.uploadImage(file);
      setFormData({ ...formData, foto_url: response.data.imageUrl });
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await timSppgApi.update(editingMember.id, formData);
      } else {
        await timSppgApi.create(formData);
      }
      setModalOpen(false);
      setEditingMember(null);
      resetForm();
      fetchMembers();
    } catch (error) {
      alert('Gagal menyimpan data');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus anggota tim ini?')) return;
    try {
      await timSppgApi.delete(id);
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Gagal menghapus data');
    }
  };

  const resetForm = () => {
    setFormData({
      nama: '',
      jabatan: '',
      deskripsi: '',
      foto_url: '',
      email: '',
      telepon: '',
      urutan: 0,
      is_active: true
    });
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (member: TimSPPG) => {
    setEditingMember(member);
    setFormData({
      nama: member.nama,
      jabatan: member.jabatan,
      deskripsi: member.deskripsi || '',
      foto_url: member.foto_url || '',
      email: member.email || '',
      telepon: member.telepon || '',
      urutan: member.urutan,
      is_active: member.is_active
    });
    setModalOpen(true);
  };

  // Generate avatar URL from name
  const getAvatarUrl = (nama: string, foto_url: string | null) => {
    if (foto_url) return foto_url;
    const colors = ['10b981', '6366f1', 'f59e0b', 'ec4899', '8b5cf6', '14b8a6'];
    const colorIndex = nama.charCodeAt(0) % colors.length;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${colors[colorIndex]}&color=fff&size=200`;
  };

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
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs uppercase mb-2 border border-green-200">
            <MdPeople /> Tim SPPG
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-base-content">
            KELOLA TIM SPPG
          </h1>
          <p className="text-base-content/70 font-medium mt-1">Tambah, edit, atau hapus anggota Tim Satgas Pangan dan Gizi.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="btn btn-primary h-12 px-6 rounded-xl border-2 border-base-content/20 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] font-bold text-white flex items-center gap-2"
        >
          <MdAdd size={20} className="stroke-2" /> 
          TAMBAH ANGGOTA
        </button>
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="bg-base-100 rounded-[2rem] border-2 border-base-content/20 shadow-neo p-12 text-center">
          <div className="w-24 h-24 bg-base-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MdPeople size={48} className="text-base-content/30" />
          </div>
          <h3 className="font-black text-xl mb-2 text-base-content">Belum Ada Anggota Tim</h3>
          <p className="text-base-content/60 mb-4">Klik tombol "Tambah Anggota" untuk menambahkan anggota tim SPPG.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div 
            key={member.id} 
            className={`bg-base-100 rounded-3xl border-2 border-base-content/20 shadow-neo p-6 group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 ${!member.is_active ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="relative">
                <img 
                  src={getAvatarUrl(member.nama, member.foto_url)}
                  alt={member.nama}
                  className="w-16 h-16 rounded-full border-2 border-base-content/20 object-cover"
                />
                {!member.is_active && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center border-2 border-white">
                    <MdVisibilityOff size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-black px-3 py-1 rounded-full border-2 border-base-content/20 bg-primary/10 text-primary">
                  {member.jabatan}
                </span>
                {member.urutan > 0 && (
                  <span className="text-[10px] font-bold text-base-content/50">Urutan: {member.urutan}</span>
                )}
              </div>
            </div>
            
            <h3 className="font-black text-xl mb-2 text-base-content">{member.nama}</h3>
            
            {member.deskripsi && (
              <p className="text-sm text-base-content/70 mb-4 line-clamp-2">{member.deskripsi}</p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              {member.email && (
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <MdEmail className="text-base-content/50" />
                  <span className="truncate">{member.email}</span>
                </div>
              )}
              {member.telepon && (
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <MdPhone className="text-base-content/50" />
                  <span>{member.telepon}</span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                member.is_active 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-base-200 text-base-content/50'
              }`}>
                {member.is_active ? <><MdCheck size={14} /> Aktif</> : <><MdVisibilityOff size={14} /> Nonaktif</>}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => openEditModal(member)} 
                className="flex-1 btn btn-sm h-10 bg-base-100 border-2 border-base-content/20 font-bold hover:bg-yellow-300 hover:text-black flex items-center justify-center gap-2 text-base-content"
              >
                <MdEdit /> Edit
              </button>
              <button 
                onClick={() => handleDelete(member.id)} 
                className="btn btn-sm h-10 w-10 p-0 bg-base-100 border-2 border-base-content/20 text-error hover:bg-error hover:text-white flex items-center justify-center"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-base-100 rounded-[2rem] border-2 border-base-content/20 shadow-neo-lg w-full max-w-xl max-h-[90vh] overflow-y-auto overflow-x-hidden flex flex-col">
            <div className="p-6 border-b-2 border-base-content/10 bg-base-200/50 flex justify-between items-center sticky top-0 z-20 rounded-t-[2rem]">
              <h2 className="text-xl font-black text-base-content">{editingMember ? 'EDIT ANGGOTA' : 'TAMBAH ANGGOTA BARU'}</h2>
              <button 
                onClick={() => setModalOpen(false)} 
                className="w-10 h-10 rounded-full border-2 border-base-content/20 bg-base-100 hover:bg-error hover:text-white flex items-center justify-center transition-colors text-base-content"
              >
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <img 
                    src={getAvatarUrl(formData.nama || 'User', formData.foto_url || null)}
                    alt="Preview"
                    className="w-28 h-28 rounded-full border-4 border-base-content/20 object-cover"
                  />
                  {/* Upload overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {uploading ? (
                      <div className="loading loading-spinner loading-md text-white"></div>
                    ) : (
                      <>
                        <MdPhotoCamera size={24} className="text-white" />
                        <span className="text-white text-xs font-bold mt-1">Ganti Foto</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-3 btn btn-sm bg-base-100 border-2 border-base-content/20 font-bold hover:bg-primary hover:text-white flex items-center gap-2 text-base-content"
                >
                  <MdCloudUpload size={18} />
                  {uploading ? 'Mengupload...' : 'Upload Foto'}
                </button>
                <p className="text-xs text-base-content/50 mt-2">Format: JPG, PNG, WEBP (Maks. 5MB)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control col-span-2 md:col-span-1">
                  <label className="label font-bold text-sm text-base-content">Nama Lengkap*</label>
                  <input 
                    type="text" 
                    required 
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    placeholder="Nama anggota tim"
                    value={formData.nama}
                    onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  />
                </div>

                <div className="form-control col-span-2 md:col-span-1">
                  <label className="label font-bold text-sm text-base-content">Jabatan*</label>
                  <input 
                    type="text" 
                    required 
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    placeholder="Ketua, Sekretaris, dll."
                    value={formData.jabatan}
                    onChange={(e) => setFormData({...formData, jabatan: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label font-bold text-sm text-base-content">Deskripsi Tugas</label>
                <textarea 
                  className="textarea textarea-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl h-20 bg-base-100 text-base-content"
                  placeholder="Deskripsi tugas dan tanggung jawab..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Email</label>
                  <input 
                    type="email" 
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    placeholder="email@contoh.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Telepon</label>
                  <input 
                    type="tel" 
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    placeholder="08xx-xxxx-xxxx"
                    value={formData.telepon}
                    onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Urutan Tampil</label>
                  <input 
                    type="number" 
                    min="0"
                    className="input input-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    value={formData.urutan}
                    onChange={(e) => setFormData({...formData, urutan: parseInt(e.target.value) || 0})}
                  />
                  <label className="label"><span className="label-text-alt text-base-content/50">0 = paling atas</span></label>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content">Status</label>
                  <select 
                    className="select select-bordered w-full border-2 border-base-content/20 focus:outline-none focus:shadow-neo-sm rounded-xl bg-base-100 text-base-content"
                    value={formData.is_active ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, is_active: e.target.value === 'true'})}
                  >
                    <option value="true">Aktif (Tampil)</option>
                    <option value="false">Nonaktif (Disembunyikan)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn bg-base-200 border-2 border-base-content/20 hover:bg-base-300 font-bold rounded-xl h-12 text-base-content">BATAL</button>
                <button type="submit" disabled={uploading} className="flex-1 btn btn-primary border-2 border-base-content/20 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-none font-bold rounded-xl h-12 text-white disabled:opacity-50">SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
