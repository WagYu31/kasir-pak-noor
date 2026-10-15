import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportProductsExcelModal({
  isOpen,
  onClose,
  onImportSuccess
}) {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Generate & Download Template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Kode SKU': 'PRD-011',
        'Nama Produk': 'Tepung Terigu Segitiga Biru 1kg',
        'Kategori': 'Sembako',
        'Brand': 'Bogasari',
        'Supplier': 'PT Indofood Sukses Makmur',
        'Satuan Dasar': 'Pcs',
        'Batas Min Stok': 20,
        'Barcode Pcs': '8991234011001',
        'Harga Modal HPP': 11000,
        'Harga Jual Eceran': 13500,
        'Harga Jual Grosir': 12500,
        'Stok Toko WH-01': 24,
        'Stok DC WH-02': 100,
        'Lokasi Rak Toko': 'Rak A-03 (Tepung)'
      },
      {
        'Kode SKU': 'PRD-012',
        'Nama Produk': 'Kecap Manis Bango 520ml',
        'Kategori': 'Sembako',
        'Brand': 'Unilever',
        'Supplier': 'PT Unilever Indonesia',
        'Satuan Dasar': 'Pouch',
        'Batas Min Stok': 15,
        'Barcode Pcs': '8991234012001',
        'Harga Modal HPP': 21000,
        'Harga Jual Eceran': 24500,
        'Harga Jual Grosir': 23000,
        'Stok Toko WH-01': 18,
        'Stok DC WH-02': 60,
        'Lokasi Rak Toko': 'Rak A-02 (Bumbu)'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Master_Barang');
    XLSX.writeFile(wb, 'Template_Import_Master_Produk_Pak_Noor.xlsx');
  };

  // Handle File Upload & Parse
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setErrorMsg('');
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          setErrorMsg('File Excel kosong atau format tidak sesuai!');
          return;
        }

        // Map Raw Columns to System Product Structure
        const parsed = rawJson.map((row, idx) => ({
          id: row['Kode SKU'] || `PRD-${Date.now().toString().slice(-4)}${idx}`,
          name: row['Nama Produk'] || 'Produk Tanpa Nama',
          category: row['Kategori'] || 'Sembako',
          brand: row['Brand'] || 'Umum',
          supplier: row['Supplier'] || 'Supplier Lokal',
          baseUnit: row['Satuan Dasar'] || 'Pcs',
          minStock: parseInt(row['Batas Min Stok']) || 10,
          tax: 0,
          rack: {
            'WH-01': row['Lokasi Rak Toko'] || 'Rak General',
            'WH-02': 'Pallet DC'
          },
          units: [
            {
              unit: row['Satuan Dasar'] || 'Pcs',
              multiplier: 1,
              barcode: String(row['Barcode Pcs'] || `899${Date.now()}${idx}`),
              prices: {
                eceran: parseInt(row['Harga Jual Eceran']) || 10000,
                grosir1: parseInt(row['Harga Jual Grosir']) || 9500,
                grosir2: parseInt(row['Harga Jual Grosir']) || 9500,
                member: parseInt(row['Harga Jual Eceran']) || 10000
              },
              hpp: parseInt(row['Harga Modal HPP']) || 8000
            }
          ],
          stock: {
            'WH-01': parseInt(row['Stok Toko WH-01']) || 0,
            'WH-02': parseInt(row['Stok DC WH-02']) || 0
          }
        }));

        setPreviewData(parsed);
      } catch (err) {
        console.error(err);
        setErrorMsg('Gagal membaca file Excel. Pastikan file valid .xlsx atau .csv');
      }
    };
    reader.readAsBinaryString(selected);
  };

  const handleConfirmImport = () => {
    if (previewData.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      onImportSuccess(previewData);
      setIsProcessing(false);
      onClose();
      alert(`Berhasil mengimpor ${previewData.length} data produk ke Master Database Toko Pak Noor!`);
    }, 400);
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Impor Database Master Produk Massal</h3>
              <p className="text-xs text-slate-300">Unggah ratusan SKU dari spreadsheet Excel (.xlsx / .csv)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
          
          {/* Step 1: Download Template */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Langkah 1</span>
              <h4 className="font-extrabold text-xs text-slate-800 mt-0.5">Unduh Template Format Standar Excel</h4>
              <p className="text-xs text-slate-500 mt-0.5">Gunakan format kolom yang sesuai agar data SKU terbaca sempurna oleh sistem.</p>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Template (.xlsx)</span>
            </button>
          </div>

          {/* Step 2: Upload File */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Langkah 2</span>
            <h4 className="font-extrabold text-xs text-slate-800 mt-0.5 mb-2">Unggah File Spreadsheet</h4>
            
            <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50/50 hover:bg-emerald-50/20 group">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-600 transition mb-2" />
              <span className="text-xs font-bold text-slate-700">
                {file ? file.name : 'Klik untuk memilih file Excel atau seret file ke sini'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5">Mendukung format .xlsx, .xls, .csv</span>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>

            {errorMsg && (
              <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Step 3: Data Preview */}
          {previewData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-extrabold text-xs text-slate-800">
                    Pratinjau Data ({previewData.length} Produk Ditemukan)
                  </h4>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Format Valid
                </span>
              </div>

              <div className="overflow-x-auto max-h-56 border border-slate-100 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="p-2">Kode SKU</th>
                      <th className="p-2">Nama Barang</th>
                      <th className="p-2">Kategori</th>
                      <th className="p-2">Satuan</th>
                      <th className="p-2 text-right">HPP</th>
                      <th className="p-2 text-right">Harga Jual</th>
                      <th className="p-2 text-center">Stok Toko</th>
                      <th className="p-2 text-center">Stok DC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {previewData.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2 font-mono text-[11px] text-slate-500">{item.id}</td>
                        <td className="p-2 font-bold text-slate-900">{item.name}</td>
                        <td className="p-2 text-slate-600">{item.category}</td>
                        <td className="p-2 text-slate-600">{item.baseUnit}</td>
                        <td className="p-2 text-right font-mono">{formatRupiah(item.units[0].hpp)}</td>
                        <td className="p-2 text-right font-mono font-bold text-emerald-700">
                          {formatRupiah(item.units[0].prices.eceran)}
                        </td>
                        <td className="p-2 text-center font-mono font-bold text-slate-800">{item.stock['WH-01']}</td>
                        <td className="p-2 text-center font-mono font-bold text-slate-800">{item.stock['WH-02']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={previewData.length === 0 || isProcessing}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <span>Mengimpor Data...</span>
            ) : (
              <>
                <span>Proses & Masukkan ke Master Data ({previewData.length} SKU)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
