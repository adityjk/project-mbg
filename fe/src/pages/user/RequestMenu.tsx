import { useState } from 'react';
import { MdRequestPage, MdFastfood, MdCheck, MdAdd, MdRemove, MdMenuBook } from 'react-icons/md';

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-[2.5rem] border-2 border-black shadow-neo animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-accent rounded-full border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm animate-bounce">
          <MdFastfood className="text-5xl text-black" />
        </div>
        <h1 className="text-3xl font-black mb-4">REQUEST TERCATAT!</h1>
        <p className="text-lg text-gray-500 font-medium mb-2 max-w-md">
           Terima kasih! Wishlist menumu sudah kami simpan. Semoga segera tersedia ya! 😋
        </p>
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border border-gray-400 mb-8">
           MODE DEMO
        </span>
        <button 
          className="btn btn-primary h-12 px-8 text-black border-2 border-black shadow-neo font-bold text-lg hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          onClick={() => {
            setSubmitted(false);
            setRequests([]);
          }}
        >
          REQUEST MENU LAIN
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="bg-accent text-black p-8 rounded-[2.5rem] border-2 border-black shadow-neo overflow-hidden relative">
         <div className="absolute top-0 right-[-20px] p-4 opacity-20 transform rotate-12">
            <MdMenuBook size={180} />
         </div>
         <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-black text-accent font-black px-4 py-1 rounded-full text-xs uppercase mb-3 text-white">
               <MdRequestPage /> Wishlist Menu
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">REQUEST MENU</h1>
            <p className="font-bold text-lg opacity-80 max-w-xl">
               Lagi pengen makan apa? Kasih tau kami biar bisa dimasak minggu depan!
               <span className="block mt-2 text-xs font-black bg-white/30 inline-block px-2 py-1 rounded uppercase border border-black/20">🚧 Fitur Demo</span>
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Input */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border-2 border-black shadow-neo h-fit">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
             ➕ TAMBAH REQUEST
          </h2>
          
          {/* Input */}
          <div className="flex gap-2 mb-8">
            <input
              type="text"
              className="input flex-1 border-2 border-black rounded-xl h-12 font-bold focus:shadow-neo-sm focus:outline-none transition-all placeholder:font-normal placeholder:opacity-50"
              placeholder="Contoh: Sayur Asem..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddRequest()}
            />
            <button 
              className="btn btn-primary h-12 w-12 p-0 rounded-xl border-2 border-black flex items-center justify-center shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
              onClick={handleAddRequest}
            >
              <MdAdd size={24} />
            </button>
          </div>

          {/* Popular Suggestions */}
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              🔥 PILIHAN POPULER
            </p>
            <div className="flex flex-wrap gap-3">
              {popularSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`
                     px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200
                     ${requests.includes(suggestion) 
                        ? 'bg-secondary border-black text-black shadow-neo-sm' 
                        : 'bg-white border-gray-200 text-gray-500 hover:border-black hover:text-black'
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
        <div className="bg-neutral text-white p-6 md:p-8 rounded-[2.5rem] border-2 border-black shadow-neo flex flex-col h-full min-h-[400px]">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-white">
             🛒 WISHLIST KAMU <span className="bg-primary text-black px-2 rounded-lg text-lg border border-black">{requests.length}</span>
          </h2>
          
          {requests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 py-10">
               <MdFastfood size={80} className="mb-4" />
               <p className="font-bold text-xl">BELUM ADA REQUEST</p>
               <p>Pilih menu di samping dulu ya!</p>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 mb-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {requests.map((request, idx) => (
                  <div 
                    key={`${request}-${idx}`}
                    className="bg-white text-black p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_#333] flex justify-between items-center group hover:translate-x-1 transition-transform"
                  >
                    <span className="font-bold text-lg">{request}</span>
                    <button
                      onClick={() => handleRemoveRequest(request)}
                      className="btn btn-sm btn-circle btn-ghost text-red-500 hover:bg-red-100 hover:rotate-90 transition-transform"
                    >
                      <MdRemove size={24} />
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn w-full h-14 bg-primary text-black border-2 border-black rounded-xl font-black text-xl shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                onClick={handleSubmit}
              >
                KIRIM REQUEST SEKARANG 🚀
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
