import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Link, 
  Image as ImageIcon, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function UploadProductImageModal({
  isOpen,
  onClose,
  product,
  onSaveImage
}) {
  if (!isOpen || !product) return null;

  const [imageUrl, setImageUrl] = useState(product.image || '');
  const [activeTab, setActiveTab] = useState('url'); // 'url' | 'upload' | 'preset'
  const [previewError, setPreviewError] = useState(false);

  // Ready-to-use authentic retail presets
  const presets = [
    { label: 'Sania 2L', url: '/products/sania.jpg' },
    { label: 'Indomie Goreng', url: '/products/indomie.jpg' },
    { label: 'Beras Ramos 5kg', url: '/products/beras.jpg' },
    { label: 'Gulaku 1kg', url: '/products/gulaku.jpg' },
    { label: 'Le Minerale 600ml', url: '/products/le_minerale.jpg' },
    { label: 'Kopi Kapal Api', url: '/products/kapal_api.jpg' },
    { label: 'Rinso Anti Noda', url: '/products/rinso.jpg' },
    { label: 'Ultra Milk 1L', url: '/products/ultra_milk.jpg' },
    { label: 'Dancow 1+ Madu', url: '/products/dancow.jpg' },
    { label: 'Sampoerna A Mild', url: '/products/sampoerna.jpg' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!imageUrl) return;
    onSaveImage(product.id, imageUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Ganti / Upload Gambar Produk
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {product.name} ({product.brand})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-white text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'url'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Link Gambar Google</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File (HP/Laptop)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 border-b-2 transition ${
              activeTab === 'preset'
                ? 'border-blue-600 text-blue-600 bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Retail Asli</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* TAB 1: PASTE URL DARI GOOGLE */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Tempel URL Gambar Produk dari Google / Web:
                </label>
                <div className="relative">
                  <Link className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setPreviewError(false);
                    }}
                    placeholder="Contoh: https://images.google.com/.../sania.jpg"
                    className="w-full bg-slate-50 text-slate-900 font-mono text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed">
                💡 <em>Tip:</em> Cari gambar produk di Google Images, klik kanan pada gambar lalu pilih <strong>"Copy image address"</strong> (Salin tautan gambar) dan tempel di atas.
              </p>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE DARI PERANGKAT */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-700 block">
                Pilih Foto dari Galeri HP atau Komputer:
              </label>
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
                <FolderOpen className="w-8 h-8 text-blue-500 mb-2 stroke-1" />
                <span className="text-xs font-bold text-slate-700">Klik untuk upload file foto</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mendukung JPG, PNG, WEBP</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          )}

          {/* TAB 3: PRESETS RETAIL */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Pilih Gambar Kemasan Resmi Toko Retail:
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {presets.map(p => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(p.url);
                      setPreviewError(false);
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition ${
                      imageUrl === p.url
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200" />
                    <span className="text-xs font-bold truncate">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* REALTIME IMAGE PREVIEW */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
              {imageUrl && !previewError ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                Pratinjau Tampilan (Live Preview)
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 truncate mt-0.5">
                {product.name}
              </h4>
              <p className="text-[10.5px] text-slate-500 font-mono truncate">
                {imageUrl || 'Belum ada gambar'}
              </p>
              {previewError && (
                <span className="text-[10px] text-rose-600 font-bold block mt-1">
                  ⚠️ Gambar tidak dapat dimuat dari tautan tersebut.
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-bold transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!imageUrl || previewError}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan & Terapkan Gambar</span>
          </button>
        </div>

      </div>
    </div>
  );
}
