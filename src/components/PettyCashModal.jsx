import React, { useState } from 'react';
import { 
  DollarSign, 
  X, 
  FileText, 
  Truck, 
  Car, 
  Package, 
  Coffee, 
  Wrench, 
  CheckCircle2, 
  Printer, 
  Clock, 
  User, 
  Monitor,
  AlertCircle
} from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

export default function PettyCashModal({
  isOpen,
  onClose,
  activeCashier,
  activeTerminal,
  onAddExpense,
  recentExpenses = []
}) {
  const [category, setCategory] = useState('Bensin & Operasional Armada');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [lastSubmittedExpense, setLastSubmittedExpense] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { label: 'Bensin & Operasional Armada', icon: Truck },
    { label: 'Retribusi & Parkir Pasar', icon: Car },
    { label: 'Ongkir & Ekspedisi Barang', icon: Package },
    { label: 'Upah Kuli Bongkar Muat', icon: Wrench },
    { label: 'Konsumsi & Galon Toko', icon: Coffee },
    { label: 'Perlengkapan Kasir (Kertas Struk, Solasi, dll)', icon: FileText },
    { label: 'Lain-Lain (Operasional Toko)', icon: DollarSign }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseInt(amount) || 0;
    if (numAmount <= 0) {
      alert('Nominal pengeluaran harus lebih besar dari 0!');
      return;
    }
    if (!description.trim()) {
      alert('Keterangan pengeluaran wajib diisi!');
      return;
    }

    const newExpense = {
      id: `EXP-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(100 + Math.random() * 900))}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB',
      category,
      description: description.trim(),
      amount: numAmount,
      cashierName: activeCashier || 'Kasir 1',
      terminal: activeTerminal || 'Kasir 1',
      paymentSource: 'Laci Kasir (Cash Drawer)',
      recipient: recipient.trim() || 'Penerima Tunai Langsung'
    };

    onAddExpense(newExpense);
    playSuccessSound();
    setLastSubmittedExpense(newExpense);
    setDescription('');
    setAmount('');
    setRecipient('');
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-amber-700 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-bold text-white shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Input Pengeluaran Kas Kecil (Petty Cash)</h3>
              <p className="text-xs text-amber-100">Catat biaya bensin, parkir, ekspedisi langsung dari laci kasir</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-amber-200 hover:text-white p-1.5 rounded-lg hover:bg-amber-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-5">

          {lastSubmittedExpense && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start justify-between gap-3 animate-in zoom-in-95">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-emerald-900">Pengeluaran Kas Kecil Berhasil Dicatat!</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Saldo kas laci otomatis terpotong <strong className="font-mono">{formatRupiah(lastSubmittedExpense.amount)}</strong> dan tercatat di Laporan Beban Toko.
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-emerald-800 font-medium">
                    <span>No: {lastSubmittedExpense.id}</span>
                    <span>•</span>
                    <span>{lastSubmittedExpense.time}</span>
                    <span>•</span>
                    <span>{lastSubmittedExpense.category}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Bukti Kas</span>
              </button>
            </div>
          )}

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Kasir: {activeCashier || 'Kasir 1'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Monitor className="w-3.5 h-3.5 text-slate-400" />
                  Terminal: {activeTerminal || 'Kasir 1'}
                </span>
              </div>
              <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                Sumber: Laci Kas (Cash Drawer)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Kategori Biaya Operasional <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map((c, i) => {
                  const Icon = c.icon;
                  const isSelected = category === c.label;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCategory(c.label)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-2xs ring-1 ring-amber-500' 
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-700' : 'text-slate-400'}`} />
                      <span className="truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nominal Pengeluaran (Rp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input 
                    type="number"
                    step="1000"
                    required
                    placeholder="Contoh: 35000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-extrabold text-slate-900"
                  />
                </div>
                {amount && (
                  <p className="text-[11px] text-amber-700 font-bold mt-1">
                    Terbilang: {formatRupiah(parseInt(amount) || 0)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Penerima Uang / Petugas
                </label>
                <input 
                  type="text"
                  placeholder="Contoh: Joko (Kurir) / Tukang Parkir / J&T"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keterangan & Rincian Pengeluaran <span className="text-rose-500">*</span>
              </label>
              <textarea 
                rows="2"
                required
                placeholder="Tuliskan tujuan pengeluaran, nomor plat armada, atau nomor resi paket..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              ></textarea>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Simpan Pengeluaran (Potong Saldo Kasir)</span>
              </button>
            </div>
          </form>

          {/* Riwayat Kas Kecil Hari Ini */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2 mb-3">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Daftar Kas Kecil Kasir Terakhir</span>
            </h4>
            
            <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {recentExpenses && recentExpenses.length > 0 ? (
                recentExpenses.map(exp => (
                  <div key={exp.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{exp.description}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-amber-800">{exp.category}</span>
                        <span>•</span>
                        <span>{exp.time}</span>
                        <span>•</span>
                        <span>Oleh: {exp.cashierName} ({exp.terminal})</span>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-rose-600 shrink-0">
                      -{formatRupiah(exp.amount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-3 text-center">Belum ada pengeluaran kas kecil yang dicatat hari ini.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Pengeluaran kas kecil akan otomatis tercatat pada Laporan Beban & Shift Kasir
          </span>
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
