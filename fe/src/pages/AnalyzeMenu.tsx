import { useState, useRef, useCallback, useEffect } from 'react';
import { MdCloudUpload, MdImage, MdCheck, MdSave, MdRefresh, MdAutoAwesome, MdErrorOutline } from 'react-icons/md';
import { menuApi, schoolApi } from '../services/api';
import type { Menu, School } from '../types';

export default function AnalyzeMenu() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Omit<Menu, 'id' | 'created_at'> | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [schools, setSchools] = useState<School[]>([]); // New State
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Hanya file gambar yang diperbolehkan');
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setImagePath(null);
    setLocation('');
    setError(null);
    setSuccess(null);
    setSuccess(null);
  }, []);

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await schoolApi.getAll();
        setSchools(res.data);
      } catch (err) {
        console.error('Failed to fetch schools:', err);
      }
    };
    fetchSchools();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError(null);

    // Simulate "Processing" steps for better UX
    try {
      const response = await menuApi.analyze(selectedFile);
      setResult(response.data.data as Omit<Menu, 'id' | 'created_at'>);
      setImagePath(response.data.imagePath);
      // setSuccess('Analisis berhasil!'); // Don't show success toast here, let result speak
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || 'Gagal menganalisis gambar');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    if (!location.trim()) {
      setError('Mohon isi nama sekolah penerima');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await menuApi.create({
        ...result,
        foto_url: imagePath || undefined,
        location: location 
      });
      setSuccess('Menu berhasil disimpan ke database!');
      
      // Reset form nicely
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        setImagePath(null);
        setSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setImagePath(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="fade-in space-y-8">
      {/* Header */}
      <div className="bg-primary text-base-100 p-6 md:p-8 rounded-[2rem] border-2 border-neutral shadow-neo flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 bg-neutral/20 px-4 py-1.5 rounded-full mb-4 border border-base-100/20">
             <MdAutoAwesome className="text-secondary animate-pulse" />
             <span className="font-mono text-xs font-bold uppercase tracking-wider">AI Powered Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-none">
            UPLOAD & <br/> ANALYZE
          </h1>
          <p className="mt-4 font-mono text-sm opacity-80 max-w-lg">
             Upload foto menu makananmu, biarkan AI kami menghitung nutrisinya dalam hitungan detik.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-20 rotate-12">
           <MdImage size={240} className="text-secondary" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Upload & Preview */}
        <div className="space-y-6">
          <div className="bg-base-100 p-6 rounded-[2rem] border-2 border-neutral shadow-neo">
             <div className="flex justify-between items-center mb-6 border-b-2 border-neutral/10 pb-4">
               <h2 className="text-xl font-black flex items-center gap-2 text-base-content">
                 <span className="bg-primary text-base-100 w-8 h-8 rounded-lg flex items-center justify-center text-sm">01</span>
                 UPLOAD FOTO
               </h2>
               {preview && (
                 <button onClick={handleReset} className="text-xs font-bold underline hover:text-error text-muted-themed">RESET</button>
               )}
             </div>

             {!preview ? (
                <div 
                  className={`
                    border-4 border-dashed rounded-3xl h-[300px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                    ${isDragging 
                       ? 'border-primary bg-primary/5 scale-[1.02]' 
                       : 'border-base-300 hover:border-neutral hover:bg-base-200'
                    }
                  `}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-primary text-base-100' : 'bg-base-200 text-muted-themed'}`}>
                    <MdCloudUpload size={48} />
                  </div>
                  <p className="font-black text-lg text-base-content">SERET FOTO KE SINI</p>
                  <p className="font-mono text-xs text-muted-themed mt-2">atau klik untuk jelajah file</p>
                </div>
             ) : (
                <div className="relative group rounded-3xl overflow-hidden border-2 border-neutral bg-base-200 h-[300px]">
                   <img src={preview} alt="Upload Preview" className="w-full h-full object-cover" />
                   
                   {!analyzing && !result && (
                     <div className="absolute inset-0 bg-neutral/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handleReset} className="btn bg-base-100 text-base-content border-2 border-base-100 hover:border-error hover:text-error">
                           <MdRefresh className="mr-2" /> Ganti Foto
                        </button>
                     </div>
                   )}

                   {analyzing && (
                      <div className="absolute inset-0 bg-neutral/60 flex flex-col items-center justify-center text-base-100 backdrop-blur-sm">
                         <div className="loading loading-infinity loading-lg text-secondary mb-4 scale-150"></div>
                         <p className="font-black text-xl animate-pulse">MENGANALISIS...</p>
                         <p className="font-mono text-xs mt-2 opacity-80">Sedang mengidentifikasi makanan</p>
                      </div>
                   )}
                </div>
             )}
             
             <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
             />

             {!analyzing && !result && preview && (
                <button 
                  onClick={handleAnalyze}
                  className="w-full mt-6 btn btn-primary h-14 text-base-100 text-lg border-2 border-neutral shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-xl"
                >
                  <MdAutoAwesome className="mr-2 animate-bounce" />
                  ANALISIS SEKARANG
                </button>
             )}
          </div>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="space-y-6">
           <div className={`bg-base-100 p-6 rounded-[2rem] border-2 border-neutral shadow-neo h-full flex flex-col ${!result ? 'justify-center items-center text-center bg-base-200/50' : ''}`}>
             
             {!result ? (
               <div className="py-12 px-6">
                  <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-base-300 border-dashed">
                     <MdAutoAwesome size={40} className="text-muted-themed" />
                  </div>
                  <h3 className="text-2xl font-black text-muted-themed mb-2">MENUNGGU HASIL</h3>
                  <p className="font-mono text-sm text-muted-themed max-w-xs mx-auto">
                    Hasil analisis nutrisi lengkap akan muncul di sini setelah AI selesai bekerja.
                  </p>
               </div>
             ) : (
               <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b-2 border-dashed border-base-300">
                     <div>
                        <div className="inline-block bg-secondary px-3 py-1 rounded-lg border-2 border-neutral font-bold text-xs mb-2 shadow-sm text-neutral">
                           CONFIDENCE SCORE: 98%
                        </div>
                        <h2 className="text-3xl font-black text-base-content leading-tight">{result.nama_menu}</h2>
                     </div>
                     <div className="bg-success/20 text-success p-2 rounded-full border-2 border-success">
                       <MdCheck size={24} />
                     </div>
                  </div>

                  <p className="text-base-content/80 mb-8 font-medium leading-relaxed bg-info/10 p-4 rounded-xl border border-info/20">
                    {result.deskripsi || 'Deskripsi menu tidak tersedia.'}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                     <ResultCard label="Kalori" value={result.kalori} unit="kkal" color="bg-warning/20 border-warning/30 text-warning" />
                     <ResultCard label="Protein" value={result.protein} unit="gram" color="bg-info/20 border-info/30 text-info" />
                     <ResultCard label="Karbo" value={result.karbohidrat} unit="gram" color="bg-accent/20 border-accent/30 text-accent" />
                     <ResultCard label="Lemak" value={result.lemak} unit="gram" color="bg-error/20 border-error/30 text-error" />
                     <ResultCard label="Serat" value={result.serat} unit="gram" color="bg-success/20 border-success/30 text-success" />
                     <div className="bg-base-200 border-2 border-base-300 rounded-xl p-4 flex flex-col justify-center items-center">
                        <span className="text-3xl font-black text-base-content">{result.jumlah_porsi}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-themed tracking-wider">Porsi {result.porsi}</span>
                     </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-bold text-muted-themed uppercase mb-2">SEKOLAH PENERIMA</label>
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-neutral focus:outline-none focus:ring-2 focus:ring-primary font-bold bg-base-100"
                    >
                      <option value="">-- Pilih Sekolah --</option>
                      <option value="Semua Sekolah" className="font-black text-primary">-- SEMUA SEKOLAH --</option>
                      {schools.map(school => (
                        <option key={school.id} value={school.nama_sekolah}>
                          {school.nama_sekolah}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full btn btn-secondary h-16 text-neutral font-black text-lg border-2 border-neutral shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] rounded-xl flex items-center justify-center gap-2 group"
                  >
                    {saving ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <MdSave className="text-2xl group-hover:scale-110 transition-transform" />
                        SIMPAN KE DATABASE
                      </>
                    )}
                  </button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Floating Alerts */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {error && (
          <div className="bg-error text-base-100 p-4 rounded-xl border-2 border-neutral shadow-neo-sm animate-bounce flex items-center gap-3 font-bold max-w-sm">
             <MdErrorOutline size={24} />
             {error}
          </div>
        )}
        {success && (
          <div className="bg-success text-base-100 p-4 rounded-xl border-2 border-neutral shadow-neo-sm animate-pulse flex items-center gap-3 font-bold max-w-sm">
             <MdCheck size={24} />
             {success}
          </div>
        )}
      </div>

    </div>
  );
}

const ResultCard = ({ label, value, unit, color }: any) => (
  <div className={`border-2 rounded-xl p-4 flex flex-col items-center justify-center ${color}`}>
     <span className="text-2xl md:text-3xl font-black">{value || 0}</span>
     <span className="text-[10px] uppercase font-bold opacity-70 mt-1">{label} ({unit})</span>
  </div>
);
