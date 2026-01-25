import { useEffect, useState } from 'react';
import { MdHistory, MdDelete, MdRestaurantMenu, MdCalendarToday, MdCheck, MdClose } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';
import { useConfirmDialog } from '../components/ConfirmDialog';

export default function MenuHistory() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { showConfirm, DialogComponent } = useConfirmDialog();

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
         <div className="loading loading-bars loading-lg text-primary"></div>
       </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-base-100 p-6 rounded-[2rem] border-2 border-neutral shadow-neo">
        <div>
           <div className="inline-flex items-center gap-2 bg-warning/20 text-warning font-bold px-3 py-1 rounded-full text-xs uppercase mb-2 border border-warning/30">
             <MdHistory /> Arsip Data
           </div>
          <h1 className="text-3xl md:text-4xl font-black text-base-content">
            RIWAYAT MENU
          </h1>
          <p className="text-muted-themed font-medium mt-1">Daftar lengkap semua menu yang telah dianalisis AI.</p>
        </div>
        <div className="bg-base-200 px-4 py-2 rounded-xl border border-base-300 font-mono text-xs font-bold text-muted-themed">
           TOTAL: {menus.length} MENU
        </div>
      </div>

      {menus.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-[2rem] border-2 border-neutral border-dashed opacity-70">
           <MdRestaurantMenu className="text-6xl text-muted-themed mx-auto mb-4" />
           <h2 className="text-2xl font-black text-muted-themed">RIWAYAT KOSONG</h2>
           <p className="text-muted-themed">Belum ada data menu yang tersimpan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-base-100 rounded-3xl border-2 border-neutral shadow-neo overflow-hidden flex flex-col group hover:translate-y-1 hover:shadow-none transition-all duration-200">
              
              {/* Image Header */}
              <div className="relative h-48 bg-base-200 border-b-2 border-neutral overflow-hidden">
                {menu.foto_url ? (
                   <img 
                     src={menu.foto_url.startsWith('http') ? menu.foto_url : `http://localhost:5000${menu.foto_url}`} 
                     alt={menu.nama_menu}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                   />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-themed">
                     <MdRestaurantMenu size={48} />
                   </div>
                )}
                
                <div className="absolute top-3 right-3">
                   <span className="badge badge-sm bg-primary text-base-100 border-0 font-bold shadow-sm">
                      {menu.kalori} kkal
                   </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-themed uppercase tracking-wider mb-2">
                   <MdCalendarToday size={12} />
                   {formatDate(menu.created_at)}
                </div>

                <h3 className="font-black text-xl mb-2 line-clamp-1 text-base-content" title={menu.nama_menu}>
                  {menu.nama_menu}
                </h3>
                
                <p className="text-muted-themed text-sm line-clamp-2 mb-4 flex-1">
                  {menu.deskripsi || 'Tidak ada deskripsi tersedia.'}
                </p>

                {/* Nutrition Mini Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                   <NutritionMini label="PRO" value={menu.protein} color="bg-info/20 text-info" />
                   <NutritionMini label="KAR" value={menu.karbohidrat} color="bg-warning/20 text-warning" />
                   <NutritionMini label="LEM" value={menu.lemak} color="bg-error/20 text-error" />
                </div>

                <div className="pt-4 border-t-2 border-base-200 flex items-center justify-between">
                   <div className="text-xs font-bold text-muted-themed">
                      {menu.jumlah_porsi} Porsi {menu.porsi}
                   </div>
                   
                   <button 
                     onClick={() => handleDelete(menu.id)}
                     disabled={deleting === menu.id}
                     className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 hover:rotate-90 transition-transform"
                     title="Hapus Menu"
                   >
                     {deleting === menu.id ? <span className="loading loading-spinner loading-xs"></span> : <MdDelete size={20} />}
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast Notifications */}
      {success && (
        <div className="fixed bottom-8 right-8 bg-success text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdCheck className="text-base-100" size={24} /> {success}
        </div>
      )}
      {error && (
        <div className="fixed bottom-8 right-8 bg-error text-base-100 px-6 py-4 rounded-xl font-bold flex items-center gap-3 animate-bounce shadow-neo border-2 border-neutral z-50">
           <MdClose className="text-base-100" size={24} /> {error}
        </div>
      )}

      {/* Confirm Dialog */}
      {DialogComponent}
    </div>
  );
}

const NutritionMini = ({ label, value, color }: any) => (
  <div className={`rounded-lg p-2 text-center border border-neutral/10 ${color}`}>
     <div className="font-black text-sm">{value}g</div>
     <div className="text-[9px] font-bold opacity-60">{label}</div>
  </div>
);
