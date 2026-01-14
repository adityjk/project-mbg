import { useState, useRef, useCallback } from 'react';
import { MdCloudUpload, MdImage, MdCheck, MdSave, MdRefresh } from 'react-icons/md';
import { menuApi } from '../services/api';
import type { Menu } from '../types';

export default function AnalyzeMenu() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Omit<Menu, 'id' | 'created_at'> | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(null);
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
    setError(null);
    setSuccess(null);
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

    try {
      const response = await menuApi.analyze(selectedFile);
      setResult(response.data.data as Omit<Menu, 'id' | 'created_at'>);
      setImagePath(response.data.imagePath);
      setSuccess('Analisis berhasil!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || 'Gagal menganalisis gambar');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;

    setSaving(true);
    setError(null);

    try {
      await menuApi.create({
        ...result,
        foto_url: imagePath || undefined
      });
      setSuccess('Menu berhasil disimpan ke database!');
      // Reset form
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
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <MdImage style={{ color: 'var(--primary)' }} />
          Analisis Menu
        </h1>
        <p className="page-subtitle">Upload foto menu untuk menganalisis kandungan gizi</p>
      </div>

      <div className="grid-2">
        {/* Upload Section */}
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Upload Foto Menu</h2>
          
          {!preview ? (
            <div 
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <MdCloudUpload className="upload-icon" />
              <p className="upload-text">Klik atau drag foto di sini</p>
              <p className="upload-subtext">Mendukung JPG, PNG, WEBP (max 10MB)</p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <img 
                src={preview} 
                alt="Preview" 
                className="image-preview"
                style={{ marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                      Menganalisis...
                    </>
                  ) : (
                    <>
                      <MdImage />
                      Analisis dengan AI
                    </>
                  )}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={handleReset}
                >
                  <MdRefresh />
                  Ganti Foto
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>

        {/* Result Section */}
        <div className="card">
          <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>Hasil Analisis</h2>
          
          {!result ? (
            <div className="empty-state">
              <MdImage className="empty-icon" />
              <p className="empty-title">Belum ada hasil</p>
              <p className="empty-text">Upload dan analisis foto menu terlebih dahulu</p>
            </div>
          ) : (
            <div className="analysis-result">
              <h3 className="analysis-title">{result.nama_menu}</h3>
              <p className="analysis-desc">{result.deskripsi}</p>
              
              <div className="nutrition-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="nutrition-item kalori">
                  <div className="nutrition-value">{result.kalori}</div>
                  <div className="nutrition-label">Kalori</div>
                  <div className="nutrition-unit">kkal</div>
                </div>
                <div className="nutrition-item karbohidrat">
                  <div className="nutrition-value">{result.karbohidrat}</div>
                  <div className="nutrition-label">Karbohidrat</div>
                  <div className="nutrition-unit">gram</div>
                </div>
                <div className="nutrition-item protein">
                  <div className="nutrition-value">{result.protein}</div>
                  <div className="nutrition-label">Protein</div>
                  <div className="nutrition-unit">gram</div>
                </div>
                <div className="nutrition-item lemak">
                  <div className="nutrition-value">{result.lemak}</div>
                  <div className="nutrition-label">Lemak</div>
                  <div className="nutrition-unit">gram</div>
                </div>
                <div className="nutrition-item serat">
                  <div className="nutrition-value">{result.serat}</div>
                  <div className="nutrition-label">Serat</div>
                  <div className="nutrition-unit">gram</div>
                </div>
                <div className="nutrition-item" style={{ background: 'var(--bg-card)' }}>
                  <div className="nutrition-value">{result.jumlah_porsi}</div>
                  <div className="nutrition-label">Jumlah Porsi</div>
                  <div className="nutrition-unit">{result.porsi}</div>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ width: '100%', marginTop: '24px' }}
              >
                {saving ? (
                  <>
                    <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <MdSave />
                    Simpan ke Database
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {error && (
        <div className="toast toast-error">
          <span style={{ color: 'var(--error)' }}>⚠</span>
          {error}
        </div>
      )}
      {success && (
        <div className="toast toast-success">
          <MdCheck style={{ color: 'var(--success)' }} />
          {success}
        </div>
      )}
    </div>
  );
}
