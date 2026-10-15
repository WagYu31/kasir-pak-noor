import React from 'react';
import { X, Keyboard, Zap, ShieldCheck } from 'lucide-react';

export default function HelpHotkeyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const hotkeys = [
    { key: 'F1', desc: 'Buka Tab Kasir POS' },
    { key: 'F2', desc: 'Buka Tab Inventori & Mutasi 2 Gudang' },
    { key: 'F3', desc: 'Buka Tab Master Data Produk & Satuan' },
    { key: 'F4', desc: 'Buka Tab Laporan Laba Kotor & Analitik' },
    { key: 'F5', desc: 'Buka Manajemen Shift Kasir & Audit Laci' },
    { key: 'F8', desc: 'Simpan Antrean Sementara (Hold / Switch Queue)' },
    { key: 'F9', desc: 'Buka Dialog Pembayaran (Checkout)' },
    { key: 'ESC', desc: 'Batalkan / Kosongkan Keranjang Belanja / Tutup Modal' },
    { key: 'Enter', desc: 'Submit Barcode Scanner Otomatis' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-5 shadow-2xl animate-slide-up">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Panduan Hotkey Kasir Cepat</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {hotkeys.map(h => (
            <div key={h.key} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-700 font-medium">{h.desc}</span>
              <span className="kbd-badge text-emerald-800 bg-white border-slate-300 font-bold px-2 py-0.5 shadow-xs">
                {h.key}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Sistem mendukung navigasi <strong>Keyboard-First</strong> standar mesin kasir retail untuk kecepatan transaksi tanpa perlu menyentuh mouse.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-200 text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs shadow-emerald-900/10"
          >
            Mengerti & Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
