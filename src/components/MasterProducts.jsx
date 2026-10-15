import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Barcode, 
  Layers, 
  Tag, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronRight, 
  ShieldAlert, 
  Building, 
  Zap, 
  CheckCircle2, 
  X, 
  Camera, 
  Lock,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import CameraBarcodeScannerModal from './CameraBarcodeScannerModal';
import ImportProductsExcelModal from './ImportProductsExcelModal';
import { exportStockToExcel } from '../utils/exportExcel';

export default function MasterProducts({ products, setProducts, currentRole = 'OWNER' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [cameraScanTarget, setCameraScanTarget] = useState(null); // 'pcs' | 'dus' | null

  // Form for New Product
  const [form, setForm] = useState({
    name: '',
    category: 'Sembako',
    brand: '',
    supplier: '',
    image: '',
    baseUnit: 'Pcs',
    minStock: 20,
    tax: 0,
    barcodePcs: '',
    barcodeDus: '',
    hppPcs: 10000,
    priceEceran: 12500,
    priceGrosir1: 11500,
    priceMember: 12000,
    multiplierDus: 12,
    initialStockToko: 24,
    initialStockDC: 120
  });

  const categories = ['Semua', 'Sembako', 'Minuman', 'Makanan Instan', 'Perawatan Rumah'];

  const handleQuickScanPcs = () => {
    const randomEan = '899' + Math.floor(1000000000 + Math.random() * 9000000000);
    setForm(prev => ({ ...prev, barcodePcs: randomEan }));
  };

  const handleQuickScanDus = () => {
    const randomItf = '1899' + Math.floor(1000000000 + Math.random() * 9000000000);
    setForm(prev => ({ ...prev, barcodeDus: randomItf }));
  };

  const filtered = products.filter(p => {
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.units.some(u => u.barcode.includes(q));
    return matchesCat && matchesSearch;
  });

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const barcodePcs = form.barcodePcs || ('899' + Math.floor(1000000000 + Math.random() * 9000000000));
    const barcodeDus = form.barcodeDus || ('1899' + Math.floor(1000000000 + Math.random() * 9000000000));

    const newProduct = {
      id: `PRD-${(products.length + 1).toString().padStart(3, '0')}`,
      name: form.name,
      category: form.category,
      brand: form.brand || 'Umum',
      supplier: form.supplier || 'Distributor Lokal',
      image: form.image || '/products/indomie.jpg',
      baseUnit: form.baseUnit,
      minStock: form.minStock,
      tax: form.tax,
      units: [
        {
          unit: 'Dus',
          multiplier: form.multiplierDus,
          barcode: barcodeDus,
          prices: { 
            eceran: form.priceEceran * form.multiplierDus * 0.95, 
            grosir1: form.priceGrosir1 * form.multiplierDus, 
            grosir2: form.priceGrosir1 * form.multiplierDus * 0.98, 
            member: form.priceMember * form.multiplierDus * 0.97 
          },
          hpp: form.hppPcs * form.multiplierDus
        },
        {
          unit: 'Pcs',
          multiplier: 1,
          barcode: barcodePcs,
          prices: { 
            eceran: form.priceEceran, 
            grosir1: form.priceGrosir1, 
            grosir2: form.priceGrosir1 * 0.98, 
            member: form.priceMember 
          },
          hpp: form.hppPcs
        }
      ],
      stock: {
        'WH-01': Number(form.initialStockToko) || 0,
        'WH-02': Number(form.initialStockDC) || 0
      }
    };

    setProducts(prev => [newProduct, ...prev]);
    setIsAddModalOpen(false);
    setForm({
      name: '',
      category: 'Sembako',
      brand: '',
      supplier: '',
      baseUnit: 'Pcs',
      minStock: 20,
      tax: 0,
      barcodePcs: '',
      barcodeDus: '',
      hppPcs: 10000,
      priceEceran: 12500,
      priceGrosir1: 11500,
      priceMember: 12000,
      multiplierDus: 12,
      initialStockToko: 24,
      initialStockDC: 120
    });
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            Master Data Produk & Multi-Satuan Berjenjang
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengaturan hirarki satuan (Dus = Box = Pcs), barcode unik per satuan, dan tingkatan harga jual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportStockToExcel(products, 'Katalog_Master_Produk_Pak_Noor.xlsx')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Download katalog price list produk ke format Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Unggah master produk massal dari file Excel (.xlsx / .csv)"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Impor Excel Massal</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari barcode, nama produk, atau brand..."
            className="w-full bg-white text-slate-900 text-xs pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 shadow-xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition shadow-xs ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List with Multi-Units View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map(p => (
          <div 
            key={p.id}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {p.id} • {p.category}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1.5">{p.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Brand: {p.brand} • Supplier: {p.supplier}</p>
                </div>
              </div>

              {/* Units Breakdown Table */}
              <div className="mt-3 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-100 text-[9.5px] font-bold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2">Satuan & Konversi</th>
                      <th className="p-2">Barcode</th>
                      <th className="p-2 text-right">HPP</th>
                      <th className="p-2 text-right">Eceran</th>
                      <th className="p-2 text-right">Grosir 1</th>
                      <th className="p-2 text-right">Member</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 font-mono">
                    {p.units.map(u => (
                      <tr key={u.unit} className="hover:bg-white/80 transition">
                        <td className="p-2 font-sans font-bold text-slate-900">
                          {u.unit} {u.multiplier > 1 && <span className="text-slate-500 font-normal">({u.multiplier}x)</span>}
                        </td>
                        <td className="p-2 text-slate-500 text-[10px]">{u.barcode}</td>
                        <td className="p-2 text-right text-slate-500">
                          {currentRole === 'OWNER' ? (
                            `Rp ${u.hpp.toLocaleString('id-ID')}`
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]" title="HPP Rahasia (Hanya Owner)">
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                              ••••••
                            </span>
                          )}
                        </td>
                        <td className="p-2 text-right text-emerald-700 font-bold">Rp {u.prices.eceran.toLocaleString('id-ID')}</td>
                        <td className="p-2 text-right text-cyan-700 font-bold">Rp {u.prices.grosir1.toLocaleString('id-ID')}</td>
                        <td className="p-2 text-right text-amber-700 font-bold">Rp {u.prices.member.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Min. Stock: <strong className="text-slate-800">{p.minStock} {p.baseUnit}</strong></span>
              <span>Pajak PPN: <strong className="text-slate-800">{p.tax > 0 ? '11%' : 'Bebas PPN'}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD PRODUCT MODAL WITH REAL-TIME BARCODE SCANNING */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Tambah Produk & Scan Barcode Kemasan</h3>
                  <p className="text-[11px] text-slate-500">Mendukung tembak scanner USB/Wireless atau generate barcode toko otomatis.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              {/* Seksi 1: Identitas Produk */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wide block">
                  1. Informasi Dasar Produk:
                </span>
                
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Produk Lengkap:</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Contoh: Susu Indomilk Kental Manis 370g"
                    className="w-full bg-white text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kategori:</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-white text-slate-900 p-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                    >
                      {categories.filter(c => c !== 'Semua').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Brand / Merek:</label>
                    <input
                      type="text"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      placeholder="Contoh: Indomilk"
                      className="w-full bg-white text-slate-900 p-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier / Distributor:</label>
                    <input
                      type="text"
                      value={form.supplier}
                      onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                      placeholder="Contoh: PT Indolakto"
                      className="w-full bg-white text-slate-900 p-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* URL Gambar Produk (Google Images / Foto) */}
                <div className="pt-2">
                  <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                    Link Foto Produk (Google Images / URL):
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Tempel link foto produk dari Google (contoh: https://.../produk.jpg)"
                      className="flex-1 bg-white text-slate-900 text-xs p-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs font-mono"
                    />
                    {form.image && (
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 p-0.5 shadow-xs">
                        <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seksi 2: Scan Barcode Kemasan Langsung */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Barcode className="w-4 h-4 text-emerald-600" />
                    2. Scan Barcode Kemasan (Pcs & Karton / Dus):
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Scanner Ready (Plug & Play)
                  </span>
                </div>

                <p className="text-[11px] text-slate-600">
                  Tembakkan scanner barcode langsung ke kemasan barang. Sistem akan otomatis menangkap nomor barcode EAN-13 / ITF-14 seketika.
                </p>

                {/* Input Barcode Pcs */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">
                      Barcode Satuan Eceran (Pcs / Botol / Bungkus):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCameraScanTarget('pcs')}
                        className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-100 transition shadow-xs"
                      >
                        <Camera className="w-3 h-3 text-emerald-600" /> Scan Kamera (Pcs)
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickScanPcs}
                        className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-700 transition"
                      >
                        <Zap className="w-3 h-3" /> Tembak Scanner Demo (Pcs)
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={form.barcodePcs}
                      onChange={(e) => setForm({ ...form, barcodePcs: e.target.value })}
                      placeholder="Klik di sini lalu tembak scanner (contoh: 8992761100912)"
                      className="w-full bg-white text-slate-900 font-mono font-bold text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* Input Barcode Karton / Dus */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase">
                      Barcode Karton / Dus Kemasan Pabrik (Opsional):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCameraScanTarget('dus')}
                        className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-300 text-[10px] font-bold flex items-center gap-1 hover:bg-sky-100 transition shadow-xs"
                      >
                        <Camera className="w-3 h-3 text-sky-600" /> Scan Kamera (Dus)
                      </button>
                      <button
                        type="button"
                        onClick={handleQuickScanDus}
                        className="px-2 py-0.5 rounded bg-sky-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-sky-700 transition"
                      >
                        <Zap className="w-3 h-3" /> Tembak Scanner Demo (Dus)
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 relative">
                      <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={form.barcodeDus}
                        onChange={(e) => setForm({ ...form, barcodeDus: e.target.value })}
                        placeholder="Scan barcode kardus luar..."
                        className="w-full bg-white text-slate-900 font-mono font-bold text-sm pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={form.multiplierDus}
                        onChange={(e) => setForm({ ...form, multiplierDus: Number(e.target.value) })}
                        placeholder="Isi per dus (pcs)"
                        title="Isi satuan dasar per dus"
                        className="w-full bg-white text-slate-900 font-mono text-xs px-2.5 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seksi 3: Harga & Modal (HPP) */}
              <div className="space-y-2">
                <span className="text-[10.5px] font-bold text-slate-700 uppercase tracking-wide block">
                  3. Modal (HPP) & Penetapan Harga Jual Berjenjang:
                </span>
                
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[9.5px] font-bold text-slate-500 uppercase block mb-1">
                      HPP Modal (Rp): {currentRole !== 'OWNER' && <span className="text-[8.5px] text-amber-600 font-bold">(Hanya Owner)</span>}
                    </label>
                    {currentRole === 'OWNER' ? (
                      <input
                        type="number"
                        value={form.hppPcs}
                        onChange={(e) => setForm({ ...form, hppPcs: Number(e.target.value) })}
                        className="w-full bg-white text-slate-900 font-mono text-xs p-2 rounded-lg border border-slate-300 focus:border-emerald-500 shadow-xs font-bold"
                      />
                    ) : (
                      <input
                        type="text"
                        disabled
                        value="•••••• (Terkunci)"
                        className="w-full bg-slate-100 text-slate-400 font-mono text-xs p-2 rounded-lg border border-slate-200 cursor-not-allowed select-none font-bold"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[9.5px] font-bold text-emerald-700 uppercase block mb-1">Harga Eceran (Rp):</label>
                    <input
                      type="number"
                      value={form.priceEceran}
                      onChange={(e) => setForm({ ...form, priceEceran: Number(e.target.value) })}
                      className="w-full bg-white text-emerald-800 font-mono text-xs p-2 rounded-lg border border-emerald-300 focus:border-emerald-500 shadow-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-bold text-sky-700 uppercase block mb-1">Harga Grosir (Rp):</label>
                    <input
                      type="number"
                      value={form.priceGrosir1}
                      onChange={(e) => setForm({ ...form, priceGrosir1: Number(e.target.value) })}
                      className="w-full bg-white text-sky-800 font-mono text-xs p-2 rounded-lg border border-sky-300 focus:border-sky-500 shadow-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-bold text-amber-700 uppercase block mb-1">Harga Member (Rp):</label>
                    <input
                      type="number"
                      value={form.priceMember}
                      onChange={(e) => setForm({ ...form, priceMember: Number(e.target.value) })}
                      className="w-full bg-white text-amber-800 font-mono text-xs p-2 rounded-lg border border-amber-300 focus:border-amber-500 shadow-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 4: Alokasi Stok Awal */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-700 uppercase block mb-1.5">
                  4. Alokasi Stok Fisik Awal (Satuan Pcs):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium">WH-01 (Toko Depan):</span>
                    <input
                      type="number"
                      value={form.initialStockToko}
                      onChange={(e) => setForm({ ...form, initialStockToko: e.target.value })}
                      className="w-20 font-mono font-bold text-right p-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-600 font-medium">WH-02 (DC / Gudang Pusat):</span>
                    <input
                      type="number"
                      value={form.initialStockDC}
                      onChange={(e) => setForm({ ...form, initialStockDC: e.target.value })}
                      className="w-20 font-mono font-bold text-right p-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-bold transition rounded-xl bg-white border border-slate-200 hover:bg-slate-100 shadow-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold flex items-center gap-1.5 shadow-xs shadow-emerald-900/10 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Produk ke Database</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Scanner Barcode Kamera */}
      <CameraBarcodeScannerModal
        isOpen={Boolean(cameraScanTarget)}
        onClose={() => setCameraScanTarget(null)}
        title={cameraScanTarget === 'dus' ? 'Scan Barcode Dus / Karton via Kamera' : 'Scan Barcode Satuan Eceran (Pcs) via Kamera'}
        onScanSuccess={(decodedText) => {
          if (cameraScanTarget === 'dus') {
            setForm(prev => ({ ...prev, barcodeDus: decodedText }));
          } else {
            setForm(prev => ({ ...prev, barcodePcs: decodedText }));
          }
          setCameraScanTarget(null);
        }}
      />

      {/* Modal Import Excel Massal */}
      <ImportProductsExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(newProds) => {
          setProducts(prev => [...newProds, ...prev]);
        }}
      />

    </div>
  );
}
