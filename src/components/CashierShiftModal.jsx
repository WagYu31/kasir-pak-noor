import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  UserCheck, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertCircle, 
  Printer, 
  Lock,
  CheckCircle2
} from 'lucide-react';

export default function CashierShiftModal({ 
  isOpen, 
  onClose, 
  shiftData, 
  setShiftData, 
  salesHistory 
}) {
  if (!isOpen) return null;

  const [physicalCashInput, setPhysicalCashInput] = useState('');
  const [pettyCashNote, setPettyCashNote] = useState('');
  const [pettyCashAmount, setPettyCashAmount] = useState('');
  const [pettyType, setPettyType] = useState('IN'); // 'IN' or 'OUT'
  const [isClosed, setIsClosed] = useState(false);

  const [validationError, setValidationError] = useState('');
  const [showPrintSlip, setShowPrintSlip] = useState(false);

  // Calculate Cash Sales from current shift
  const cashSalesTotal = salesHistory
    .filter(s => s.paymentMethod === 'Tunai')
    .reduce((sum, s) => sum + s.totalAmount, 0);

  // Cash In / Cash Out
  const netPettyCash = shiftData.cashLogs?.reduce((sum, log) => {
    return log.type === 'IN' ? sum + log.amount : sum - log.amount;
  }, 0) || 0;

  // Expected Cash in Drawer
  const expectedCashInDrawer = shiftData.startingCash + cashSalesTotal + netPettyCash;
  const cashDifference = physicalCashInput !== '' ? Number(physicalCashInput) - expectedCashInDrawer : 0;

  const handleAddPettyCash = (e) => {
    e.preventDefault();
    const amount = Number(pettyCashAmount);
    if (!amount || amount <= 0) return;

    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: pettyType,
      amount,
      note: pettyCashNote || (pettyType === 'IN' ? 'Kas Masuk Tambahan' : 'Biaya Operasional Toko')
    };

    setShiftData(prev => ({
      ...prev,
      cashLogs: [...(prev.cashLogs || []), newLog]
    }));

    setPettyCashAmount('');
    setPettyCashNote('');
  };

  const handleCloseShift = () => {
    if (!physicalCashInput) {
      setValidationError('Harap masukkan nominal fisik uang kasir sebelum menutup shift!');
      return;
    }
    setValidationError('');
    setIsClosed(true);

    // Save closing audit data to shiftData
    setShiftData(prev => ({
      ...prev,
      isClosed: true,
      closeTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      expectedCash: expectedCashInDrawer,
      physicalCash: Number(physicalCashInput),
      difference: cashDifference
    }));
  };

  const handleStartNewShift = () => {
    const nextCashier = shiftData.cashier === 'Rina S.' ? 'Budi Santoso' : 'Rina S.';
    const nextShiftName = shiftData.cashier === 'Rina S.' ? 'Shift Sore' : 'Shift Pagi';
    
    setShiftData({
      cashier: nextCashier,
      shiftName: nextShiftName,
      openTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      startingCash: 300000,
      cashLogs: []
    });
    setPhysicalCashInput('');
    setIsClosed(false);
    setShowPrintSlip(false);
    setValidationError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Manajemen Shift & Audit Kas Kasir</h3>
              <p className="text-[11px] text-slate-500">
                Kasir: <strong>{shiftData.cashier}</strong> • Buka: {shiftData.openTime} {shiftData.isClosed && <span className="text-rose-600 font-bold">(Shift Ditutup)</span>}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs pr-2">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Modal Awal Kas:</span>
              <span className="font-mono text-base font-extrabold text-slate-900">
                Rp {shiftData.startingCash.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Penjualan Tunai:</span>
              <span className="font-mono text-base font-extrabold text-emerald-700">
                + Rp {cashSalesTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Expected Cash Banner */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              Total Uang Kas Seharusnya di Laci (Cash Drawer):
            </span>
            <div className="text-2xl font-mono font-extrabold text-slate-900">
              Rp {expectedCashInDrawer.toLocaleString('id-ID')}
            </div>
            <span className="text-[10.5px] text-slate-500 block mt-1">
              (Modal Awal + Penjualan Tunai ± Catatan Kas Toko)
            </span>
          </div>

          {/* Form Petty Cash (Kas Masuk / Kas Keluar) */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wide">
              Catat Kas Masuk / Kas Keluar Toko (Petty Cash):
            </span>
            <form onSubmit={handleAddPettyCash} className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPettyType('IN')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition cursor-pointer ${
                    pettyType === 'IN' 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" /> Kas Masuk
                </button>
                <button
                  type="button"
                  onClick={() => setPettyType('OUT')}
                  className={`flex-1 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 border transition cursor-pointer ${
                    pettyType === 'OUT' 
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" /> Kas Keluar
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Nominal (Rp)"
                  value={pettyCashAmount}
                  onChange={(e) => setPettyCashAmount(e.target.value)}
                  className="bg-white text-slate-900 font-mono p-2 rounded-xl border border-slate-300 shadow-xs"
                />
                <input
                  type="text"
                  placeholder="Keterangan (misal: Beli Galon)"
                  value={pettyCashNote}
                  onChange={(e) => setPettyCashNote(e.target.value)}
                  className="bg-white text-slate-900 p-2 rounded-xl border border-slate-300 shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl border border-slate-200 transition shadow-xs cursor-pointer"
              >
                + Tambah Catatan Kas
              </button>
            </form>

            {/* Cash Log list */}
            {shiftData.cashLogs?.length > 0 && (
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400">Riwayat Kas Shift Ini:</div>
                {shiftData.cashLogs.map(log => (
                  <div key={log.id} className="flex justify-between items-center text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80">
                    <span className="font-medium">{log.time} - {log.note}</span>
                    <span className={`font-mono font-bold ${log.type === 'IN' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {log.type === 'IN' ? '+' : '-'} Rp {log.amount.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tutup Shift & Rekonsiliasi Kasir */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2.5">
            <span className="text-[10.5px] font-bold text-slate-700 block uppercase tracking-wide">
              Rekonsiliasi Tutup Shift Kasir:
            </span>
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">
                Hitung Fisik Uang di Laci Kasir (Rp):
              </label>
              <input
                type="number"
                placeholder="Masukkan nominal uang di laci (Rp)..."
                value={physicalCashInput}
                disabled={isClosed}
                onChange={(e) => {
                  setPhysicalCashInput(e.target.value);
                  if (validationError) setValidationError('');
                }}
                className={`w-full bg-white font-mono text-base font-extrabold text-slate-900 p-2.5 rounded-xl border shadow-xs ${
                  validationError ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-300 focus:border-emerald-500'
                }`}
              />
              {validationError && (
                <div className="mt-1 text-rose-600 text-[11px] font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>

            {physicalCashInput !== '' && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">Status Selisih Kas:</span>
                  <span className={`font-mono font-extrabold text-sm ${
                    cashDifference === 0 
                      ? 'text-emerald-700' 
                      : cashDifference > 0 
                      ? 'text-sky-700' 
                      : 'text-rose-600'
                  }`}>
                    {cashDifference === 0 
                      ? 'PAS (Sesuai 100%)' 
                      : cashDifference > 0 
                      ? `Kelebihan (+ Rp ${cashDifference.toLocaleString('id-ID')})` 
                      : `Selisih Kurang (- Rp ${Math.abs(cashDifference).toLocaleString('id-ID')})`}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500">
                  {cashDifference === 0 
                    ? '✓ Uang fisik di laci cocok 100% dengan total transaksi sistem.' 
                    : cashDifference > 0 
                    ? '⚠️ Terdapat kelebihan uang kas fisik. Cek apakah ada transaksi tunai tanpa cetak struk.' 
                    : '⚠️ Uang kas fisik kurang. Kasir wajib mengonfirmasi selisih kepada supervisor.'}
                </p>
              </div>
            )}
          </div>

          {/* Sukses Tutup Shift & Tombol Cetak / Buka Shift Baru */}
          {isClosed && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-3 shadow-2xs">
              <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Shift Berhasil Ditutup & Tercatat</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                Laporan rekonsiliasi kasir telah disimpan. Anda dapat mencetak slip audit untuk diserahkan bersama amplop kas laci.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Slip Rekonsiliasi Kasir</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartNewShift}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <span>Buka Shift Baru (Ganti Kasir)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-xs cursor-pointer"
          >
            Tutup Jendela
          </button>
          
          <button
            onClick={handleCloseShift}
            disabled={isClosed}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs shadow-rose-900/10 transition disabled:opacity-40 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isClosed ? 'Shift Telah Ditutup' : 'Tutup Shift Kasir'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
