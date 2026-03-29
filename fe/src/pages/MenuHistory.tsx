import { useEffect, useState } from 'react';
import { MdHistory, MdDelete, MdRestaurantMenu, MdCalendarToday, MdCheck, MdClose, MdExpandMore, MdExpandLess, MdEdit, MdSave, MdSpa } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';
import { useConfirmDialog } from '../components/ConfirmDialog';

// Expandable Description Component
const ExpandableDescription = ({ text, maxLength = 60 }: { text: string; maxLength?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate) {
    return <p className="text-muted-themed text-sm leading-relaxed">{text}</p>;
  }

  return (
    <div>
      <p className="text-muted-themed text-sm leading-relaxed">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-1 text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-0.5 transition-colors"
      >
        {isExpanded ? (
          <>
            <MdExpandLess size={16} />
            Tutup
          </>
        ) : (
          <>
            <MdExpandMore size={16} />
            Baca Selengkapnya
          </>
        )}
      </button>
    </div>
  );
};

export default function MenuHistory() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showConfirm, DialogComponent } = useConfirmDialog();

  // Edit state
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editForm, setEditForm] = useState({
    kalori: 0,
    protein: 0,
    karbohidrat: 0,
    lemak: 0,
    serat: 0,
    nama_menu: '',
    deskripsi: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuApi.getAll();
      setMenus(response.data);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setEditForm({
      kalori: menu.kalori,
      protein: menu.protein,
      karbohidrat: menu.karbohidrat,
      lemak: menu.lemak,
      serat: menu.serat,
      nama_menu: menu.nama_menu,
      deskripsi: menu.deskripsi || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingMenu) return;
    
    setSaving(true);
    try {
      await menuApi.update(editingMenu.id, editForm);
      setMenus(prev => prev.map(m => 
        m.id === editingMenu.id 
          ? { ...m, ...editForm }
          : m
      ));
      setSuccess('Nilai gizi berhasil diperbarui!');
      setEditingMenu(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to update menu:', err);
      setError('Gagal menyimpan perubahan');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    showConfirm({
      title: 'Hapus Menu',
      message: 'Apakah kamu yakin ingin menghapus menu ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Ya, Hapus',
      cancelText: 'Batal',
      type: 'danger',
      onConfirm: async () => {
        setDeleting(id);
        try {
          await menuApi.delete(id);
          setMenus(prev => prev.filter(m => m.id !== id));
          setSuccess('Menu berhasil dihapus!');
          setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
          console.error('Failed to delete menu:', error);
          setError('Gagal menghapus menu');
          setTimeout(() => setError(null), 3000);
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
       <div className="flex justify-center items-center h-[50vh]">
         <div className="loading loading-spinner loading-lg text-primary"></div>
       </div>
    );
  }

  return (
    <div className="fade-in space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-gradient-to-br from-base-100 to-base-200 p-8 rounded-3xl shadow-soft">
        <div>
           <div className="inline-flex items-center gap-2 bg-warning/10 text-warning font-bold px-3 py-1 rounded-full text-xs uppercase mb-3 border border-warning/20 tracking-wider">
             <MdHistory size={14} /> Arsip Data
           </div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-content mb-2 font-display uppercase tracking-wide">
            Riwayat Menu
          </h1>
          <p className="text-muted-themed font-medium">Daftar lengkap semua menu yang telah dianalisis AI.</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/40 font-mono text-sm font-bold text-secondary-content shadow-sm text-primary">
           TOTAL: {menus.length} MENU
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="text-center py-24 bg-base-100 rounded-3xl shadow-soft border border-neutral/50">
           <div className="bg-neutral/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
             <MdRestaurantMenu className="text-4xl text-muted-themed" />
           </div>
           <h2 className="text-2xl font-bold text-base-content mb-2 font-display">Riwayat Kosong</h2>
           <p className="text-muted-themed max-w-xs mx-auto">Belum ada data menu yang tersimpan. Mulai analisis menu baru untuk melihat riwayat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-base-100 rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-neutral/40 flex flex-col group overflow-hidden">
              
              {/* Image Header */}
              <div className="relative h-52 bg-neutral/10 overflow-hidden">
                {menu.foto_url ? (
                   <img 
                     src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                     alt={menu.nama_menu}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                   />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-themed bg-neutral/20">
                     <MdRestaurantMenu size={48} className="opacity-20" />
                   </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

                <div className="absolute top-4 right-4">
                   <div className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <span className="text-lg">{menu.kalori}</span> kkal
                   </div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-bold text-xl text-white font-display uppercase tracking-wide line-clamp-1 drop-shadow-md" title={menu.nama_menu}>
                    {menu.nama_menu}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/90 uppercase tracking-wider mt-1">
                     <MdCalendarToday size={12} />
                     {formatDate(menu.created_at)}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <ExpandableDescription text={menu.deskripsi || 'Tidak ada deskripsi tersedia.'} maxLength={80} />
                </div>

                {/* Nutrition Mini Grid - Updated to include Fiber/Serat */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                   <NutritionMini label="PRO" value={menu.protein} color="bg-blue-50 text-blue-600" />
                   <NutritionMini label="KAR" value={menu.karbohidrat} color="bg-orange-50 text-orange-600" />
                   <NutritionMini label="LEM" value={menu.lemak} color="bg-red-50 text-red-600" />
                   <NutritionMini label="SRT" value={menu.serat} icon={<MdSpa size={10} />} color="bg-green-50 text-green-600" />
                </div>

                <div className="pt-4 border-t border-neutral/50 flex items-center justify-between">
                   <div className="text-xs font-semibold text-muted-themed px-3 py-1.5 bg-neutral/50 rounded-lg">
                      {menu.jumlah_porsi} Porsi {menu.porsi}
                   </div>
                   
                   <div className="flex gap-2">
                     <button 
                       onClick={() => handleEdit(menu)}
                       className="w-8 h-8 flex items-center justify-center rounded-full text-muted-themed hover:text-primary hover:bg-primary/10 transition-all"
                       title="Edit Nilai Gizi"
                     >
                       <MdEdit size={16} />
                     </button>
                     <button 
                       onClick={() => handleDelete(menu.id)}
                       disabled={deleting === menu.id}
                       className="w-8 h-8 flex items-center justify-center rounded-full text-muted-themed hover:text-error hover:bg-error/10 transition-all"
                       title="Hapus Menu"
                     >
                       {deleting === menu.id ? <span className="loading loading-spinner loading-xs"></span> : <MdDelete size={18} />}
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingMenu && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-up">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-base-content font-display uppercase">Edit Nilai Gizi</h2>
                  <p className="text-sm text-muted-themed mt-1">{editingMenu.nama_menu}</p>
                </div>
                <button 
                  onClick={() => setEditingMenu(null)}
                  className="btn btn-sm btn-circle btn-ghost hover:bg-neutral"
                >
                  <MdClose size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content/70">Nama Menu</label>
                  <input
                    type="text"
                    className="input input-bordered border-neutral/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl bg-neutral/30 font-semibold"
                    value={editForm.nama_menu}
                    onChange={(e) => setEditForm({ ...editForm, nama_menu: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm text-base-content/70">Deskripsi</label>
                  <textarea
                    className="textarea textarea-bordered border-neutral/40 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl bg-neutral/30 h-24"
                    value={editForm.deskripsi}
                    onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                  />
                </div>

                <div className="divider text-xs font-bold text-muted-themed">NILAI GIZI</div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-muted-themed">Kalori (kkal)</label>
                    <input
                      type="number"
                      className="input input-bordered border-neutral/40 focus:border-primary rounded-xl"
                      value={editForm.kalori}
                      onChange={(e) => setEditForm({ ...editForm, kalori: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-muted-themed">Protein (g)</label>
                    <input
                      type="number"
                      className="input input-bordered border-neutral/40 focus:border-primary rounded-xl"
                      value={editForm.protein}
                      onChange={(e) => setEditForm({ ...editForm, protein: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-muted-themed">Karbohidrat (g)</label>
                    <input
                      type="number"
                      className="input input-bordered border-neutral/40 focus:border-primary rounded-xl"
                      value={editForm.karbohidrat}
                      onChange={(e) => setEditForm({ ...editForm, karbohidrat: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-xs uppercase text-muted-themed">Lemak (g)</label>
                    <input
                      type="number"
                      className="input input-bordered border-neutral/40 focus:border-primary rounded-xl"
                      value={editForm.lemak}
                      onChange={(e) => setEditForm({ ...editForm, lemak: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-control col-span-2">
                    <label className="label font-bold text-xs uppercase text-muted-themed">Serat (g)</label>
                    <input
                      type="number"
                      className="input input-bordered border-neutral/40 focus:border-primary rounded-xl w-full"
                      value={editForm.serat}
                      onChange={(e) => setEditForm({ ...editForm, serat: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setEditingMenu(null)}
                  className="btn flex-1 btn-ghost hover:bg-neutral rounded-xl font-bold text-muted-themed"
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="btn flex-1 btn-primary text-white rounded-xl shadow-soft hover:shadow-lg transition-all"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <MdSave size={18} /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {success && (
        <div className="fixed bottom-8 right-8 bg-success/10 border border-success/20 text-success px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in shadow-soft-lg z-50 backdrop-blur-md">
           <div className="bg-success text-white rounded-full p-1"><MdCheck size={16} /></div> {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 bg-error/10 border border-error/20 text-error px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in shadow-soft-lg z-50 backdrop-blur-md">
           <div className="bg-error text-white rounded-full p-1"><MdClose size={16} /></div> {error}
        </div>
      )}

      {/* Confirm Dialog */}
      {DialogComponent}
    </div>
  );
}

const NutritionMini = ({ label, value, color, icon }: any) => (
  <div className={`rounded-xl p-2.5 text-center transition-transform hover:-translate-y-1 duration-300 ${color}`}>
     <div className="font-bold text-sm mb-0.5">{value}</div>
     <div className="text-[10px] font-bold opacity-70 tracking-tight flex items-center justify-center gap-1">
       {icon} {label}
     </div>
  </div>
);

