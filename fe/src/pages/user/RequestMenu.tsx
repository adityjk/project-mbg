import { useState } from 'react';
import { MdRequestPage, MdFastfood, MdCheck, MdAdd, MdRemove, MdMenuBook, MdRestaurant } from 'react-icons/md';

// Demo page - skeleton for future implementation
export default function RequestMenu() {
  const [requests, setRequests] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const popularSuggestions = [
    'Ayam Goreng',
    'Ikan Bakar',
    'Sayur Lodeh',
    'Tempe Goreng',
    'Soto Ayam',
    'Nasi Goreng',
    'Rendang',
    'Capcay'
  ];

  const handleAddRequest = () => {
    if (inputValue.trim() && !requests.includes(inputValue.trim())) {
      setRequests([...requests, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemoveRequest = (item: string) => {
    setRequests(requests.filter(r => r !== item));
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!requests.includes(suggestion)) {
      setRequests([...requests, suggestion]);
    }
  };

  const handleSubmit = () => {
    if (requests.length > 0) {
      // Demo: just show success
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-base-100 rounded-[2.5rem] border border-neutral/20 shadow-soft-lg animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce">
          <MdCheck className="text-5xl" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4 text-base-content">Request Tercatat!</h1>
        <p className="text-lg text-muted-themed font-medium mb-2 max-w-md leading-relaxed">
           Terima kasih! Wishlist menumu sudah kami simpan. Semoga segera tersedia ya! 😋
        </p>
        <span className="bg-neutral/10 text-neutral-content px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
           Mode Demo
        </span>
        <button 
          className="btn btn-primary h-12 px-8 rounded-xl shadow-soft hover:shadow-soft-lg text-white font-bold text-lg hover:-translate-y-1 transition-all"
          onClick={() => {
            setSubmitted(false);
            setRequests([]);
          }}
        >
          Request Menu Lain
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-primary text-white p-8 md:p-10 rounded-[2.5rem] shadow-soft-lg overflow-hidden relative group">
         <div className="absolute top-0 right-[-20px] p-4 opacity-10 transform rotate-12 group-hover:rotate-6 transition-transform duration-700">
            <MdMenuBook size={200} />
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white font-bold px-4 py-2 rounded-full text-xs uppercase mb-4 shadow-sm border border-white/20">
               <MdRequestPage /> Wishlist Menu
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 tracking-tight drop-shadow-md">Request Menu</h1>
            <p className="font-medium text-lg opacity-90 max-w-xl leading-relaxed">
               Lagi pengen makan apa? Kasih tau kami biar bisa dimasak minggu depan!
               <span className="block mt-2 text-xs font-bold bg-black/20 inline-block px-3 py-1 rounded-lg uppercase backdrop-blur-sm border border-white/10">🚧 Fitur Demo</span>
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Input */}
        <div className="bg-base-100 p-6 md:p-8 rounded-[2.5rem] border border-neutral/20 shadow-soft h-fit">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-base-content">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MdAdd size={24} />
             </div>
             Tambah Request
          </h2>
          
          {/* Input */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              className="input flex-1 border border-neutral/30 bg-base-50 rounded-xl h-12 font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-themed placeholder:font-normal"
              placeholder="Contoh: Sayur Asem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRequest()}
            />
            <button 
              className="btn btn-primary h-12 w-12 p-0 rounded-xl flex items-center justify-center shadow-soft hover:shadow-soft-lg text-white transition-transform hover:-translate-y-1 active:translate-y-0"
              onClick={handleAddRequest}
            >
              <MdAdd size={24} />
            </button>
          </div>

          {/* Popular Suggestions */}
          <div>
            <p className="text-xs font-bold text-muted-themed uppercase tracking-widest mb-4 flex items-center gap-2">
              <MdRestaurant className="text-primary" /> Pilihan Populer
            </p>
            <div className="flex flex-wrap gap-2">
              {popularSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                     px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                     ${requests.includes(suggestion) 
                        ? 'bg-secondary/20 border-secondary text-primary shadow-sm font-bold' 
                        : 'bg-base-50 border-neutral/20 text-muted-themed hover:bg-base-100 hover:border-primary/30 hover:text-primary hover:shadow-sm'
                     }
                  `}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Request List */}
        <div className="bg-base-100 p-6 md:p-8 rounded-[2.5rem] border border-neutral/20 shadow-soft flex flex-col h-full min-h-[400px]">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-base-content">
             <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <MdFastfood size={24} />
             </div>
             Wishlist Kamu 
             <span className="bg-base-200 text-base-content px-2.5 py-0.5 rounded-lg text-sm font-bold ml-auto">{requests.length} menu</span>
          </h2>
          
          {requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-40 py-10">
               <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                  <MdFastfood size={40} className="text-muted-themed" />
               </div>
               <p className="font-bold text-lg text-muted-themed">Belum Ada Request</p>
               <p className="text-sm text-muted-themed">Pilih menu di samping dulu ya!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {requests.map((request, idx) => (
                  <div 
                    key={`${request}-${idx}`}
                    className="bg-base-100 p-4 rounded-xl border border-neutral/20 shadow-sm flex justify-between items-center group hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <span className="font-bold text-base-content">{request}</span>
                    <button
                      onClick={() => handleRemoveRequest(request)}
                      className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 transition-colors"
                    >
                      <MdRemove size={20} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0 rounded-xl font-bold text-lg shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
              >
                Kirim Request Sekarang 🚀
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
