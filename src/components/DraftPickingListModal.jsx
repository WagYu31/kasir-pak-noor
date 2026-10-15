import React from 'react';
import { 
  Printer, 
  X, 
  FileText, 
  Clock, 
  User, 
  CheckSquare, 
  MapPin, 
  Building,
  PackageCheck,
  AlertCircle
} from 'lucide-react';

export default function DraftPickingListModal({
  isOpen,
  onClose,
  draftData,
  activeTerminal,
  activeCashier
}) {
  if (!isOpen || !draftData) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const totalQty = (draftData.items || []).reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Struk Draf / Lembar Instruksi Picking Gudang</h3>
              <p className="text-[11px] text-amber-200">Nota Bill Sementara (Hold Transaction) untuk staf penyiapan barang</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar (Top) */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between no-print text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Status: <strong>HOLD BILL (Belum Bayar)</strong></span>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Picking List</span>
          </button>
        </div>

        {/* Paper Simulation */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
          <div className="bg-white border border-slate-300 rounded-sm p-6 shadow-md w-full max-w-[380px] font-mono text-xs text-slate-800 printable-receipt">
            
            {/* Store & Document Header */}
            <div className="text-center border-b-2 border-dashed border-slate-400 pb-3 mb-3">
              <h2 className="font-extrabold text-sm tracking-wide text-slate-900">TOKO PAK NOOR</h2>
              <p className="text-[10px] text-slate-500">Sistem POS & Inventori Retail Modern</p>
              <div className="mt-2 inline-block bg-slate-900 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                LEMBAR PICKING / BILL DRAFT
              </div>
              <p className="text-[10px] text-amber-700 font-bold mt-1">*** BUKAN BUKTI PEMBAYARAN SAH ***</p>
            </div>

            {/* Metadata Info */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Draft:</span>
                <span className="font-bold text-slate-900">{draftData.draftId || `DRF-${Date.now().toString().slice(-6)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Simpan:</span>
                <span>{draftData.time || new Date().toLocaleTimeString('id-ID')} WIB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir / Terminal:</span>
                <span>{draftData.cashier || activeCashier} ({activeTerminal})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-bold text-slate-900">{draftData.customer?.name || draftData.customer || 'Pelanggan Umum'}</span>
              </div>
            </div>

            {/* Picking Instructions Header */}
            <div className="py-2.5 border-b border-slate-300 font-sans">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>INSTRUKSI AMBIL BARANG (STAF GUDANG):</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Centang kotak setelah barang selesai diambil dari rak fisik.</p>
            </div>

            {/* Item List with Rack Location */}
            <div className="divide-y divide-dashed divide-slate-200 py-2">
              {(draftData.items || []).map((item, idx) => (
                <div key={idx} className="py-2 flex items-start gap-2">
                  <div className="w-4 h-4 border-2 border-slate-400 rounded-xs shrink-0 mt-0.5 flex items-center justify-center"></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 truncate">
                      {idx + 1}. {item.name}
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.2 rounded-xs">
                        Qty: {item.qty} {item.selectedUnit || 'Pcs'}
                      </span>
                      <span className="text-slate-600 font-medium">
                        @{formatRupiah(item.price)}
                      </span>
                    </div>
                    {item.rack && (
                      <div className="text-[10px] text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Lokasi: {typeof item.rack === 'object' ? (item.rack['WH-01'] || item.rack['WH-02']) : item.rack}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Totals */}
            <div className="border-t-2 border-dashed border-slate-400 pt-3 mt-2 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Total Item / Qty Fisik:</span>
                <span>{draftData.items?.length || 0} SKU ({totalQty} Unit)</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1">
                <span>Estimasi Tagihan:</span>
                <span>{formatRupiah(draftData.total || 0)}</span>
              </div>
            </div>

            {/* Checkoff Signature Box */}
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-center text-[10px] font-sans">
              <div>
                <p className="text-slate-500">Staf Picker / Gudang:</p>
                <div className="h-10 border-b border-dotted border-slate-400 mt-2"></div>
                <p className="text-slate-400 mt-0.5">(Nama Jelas)</p>
              </div>
              <div>
                <p className="text-slate-500">Pengecekan Kasir:</p>
                <div className="h-10 border-b border-dotted border-slate-400 mt-2"></div>
                <p className="text-slate-400 mt-0.5">(Finalisasi Bill)</p>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-4 text-center text-[9px] text-slate-400 font-sans border-t border-slate-100 pt-2">
              Serahkan lembar ini ke kasir untuk proses pembayaran & cetak struk resmi.
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between no-print text-xs">
          <span className="text-slate-500">Bill tersimpan aman di antrean gantung POS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
