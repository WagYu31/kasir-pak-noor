import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coins, 
  QrCode, 
  Building2, 
  Check, 
  ArrowRight, 
  Receipt, 
  CreditCard,
  User,
  AlertCircle,
  Clock,
  Lock,
  Calendar,
  AlertTriangle,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DynamicQRISModal from './DynamicQRISModal';

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  cart, 
  totalAmount, 
  onPaymentSuccess,
  activeTerminal,
  shiftData,
  customers = [],
  selectedCustomer,
  onOpenCustomerModal
}) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('Tunai'); // Tunai, QRIS, Transfer, Piutang, DP
  const [cashGiven, setCashGiven] = useState(totalAmount);
  const [dpAmount, setDpAmount] = useState(Math.round(totalAmount * 0.3)); // Default DP 30%
  const [tempoDays, setTempoDays] = useState(14); // 7, 14, 30
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDynamicQRISOpen, setIsDynamicQRISOpen] = useState(false);

  // Suggested Cash Amounts
  const cashSuggestions = [
    totalAmount,
    Math.ceil(totalAmount / 50000) * 50000,
    Math.ceil(totalAmount / 100000) * 100000,
    500000
  ].filter((val, idx, self) => val >= totalAmount && self.indexOf(val) === idx);

  const change = Math.max(0, cashGiven - totalAmount);
  const isCashInsufficient = paymentMethod === 'Tunai' && cashGiven < totalAmount;

  // Credit Limit Calculations
  const currentCust = selectedCustomer || customers[0] || { name: 'Pelanggan Umum', creditLimit: 0, currentDebt: 0 };
  const hasNoCreditFacility = currentCust.creditLimit <= 0;
  const isOverdue = currentCust.status === 'OVERDUE' || (currentCust.dueDate && new Date(currentCust.dueDate) < new Date());
  
  const remainingCredit = Math.max(0, (currentCust.creditLimit || 0) - (currentCust.currentDebt || 0));
  
  const newDebt = paymentMethod === 'DP' 
    ? Math.max(0, totalAmount - (parseInt(dpAmount) || 0))
    : totalAmount;

  const isCreditExceeded = (paymentMethod === 'Piutang' || paymentMethod === 'DP') && (newDebt > remainingCredit);
  const isCreditBlocked = (paymentMethod === 'Piutang' || paymentMethod === 'DP') && (hasNoCreditFacility || isOverdue || isCreditExceeded);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleConfirm = () => {
    if (isCashInsufficient) return;
    if (isCreditBlocked) {
      alert('Transaksi kredit tidak dapat diproses karena limit terlampaui atau pelanggan berstatus Overdue!');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':') + ' WIB';
      const dateStr = now.toISOString().slice(0, 10);

      // Calculate Due Date for Piutang / DP
      const dueD = new Date();
      dueD.setDate(dueD.getDate() + tempoDays);
      const calculatedDueDate = dueD.toISOString().slice(0, 10);

      const transactionData = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        date: dateStr,
        hour: now.getHours().toString().padStart(2, '0') + ':00',
        time: timeStr,
        terminal: activeTerminal,
        cashier: shiftData.cashier,
        customer: currentCust.name,
        customerId: currentCust.id,
        paymentMethod,
        items: cart,
        itemsCount: cart.length,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        tax: cart.reduce((sum, item) => sum + ((item.price * item.qty) * (item.tax || 0)), 0),
        totalAmount,
        cashGiven: paymentMethod === 'Tunai' ? cashGiven : totalAmount,
        change: paymentMethod === 'Tunai' ? change : 0,
        dpAmount: paymentMethod === 'DP' ? parseInt(dpAmount) || 0 : 0,
        remainingDebt: paymentMethod === 'Piutang' ? totalAmount : (paymentMethod === 'DP' ? newDebt : 0),
        dueDate: (paymentMethod === 'Piutang' || paymentMethod === 'DP') ? calculatedDueDate : null,
        totalHpp: cart.reduce((sum, item) => sum + (item.hpp * item.qty), 0),
        grossProfit: totalAmount - cart.reduce((sum, item) => sum + (item.hpp * item.qty), 0)
      };

      setIsProcessing(false);
      onPaymentSuccess(transactionData);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up max-h-[95vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Konfirmasi & Otorisasi Pembayaran</h3>
              <p className="text-[11px] text-slate-500 font-medium">Terminal: {activeTerminal} • Kasir: {shiftData.cashier}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Total Tagihan Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Tagihan:</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-0.5">
                {formatRupiah(totalAmount)}
              </div>
              <div className="text-[10.5px] text-slate-500 mt-0.5">
                {cart.reduce((s, i) => s + i.qty, 0)} unit fisik dalam keranjang
              </div>
            </div>

            {/* Pelanggan Picker Pill */}
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Pelanggan Transaksi:</div>
              <button
                type="button"
                onClick={onOpenCustomerModal}
                className="mt-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[140px] truncate">{currentCust.name}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded-xs">Ganti</span>
              </button>
            </div>
          </div>

          {/* Payment Method Switcher (Multipilihan: Tunai, QRIS, Transfer, Piutang, DP) */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Pilih Metode Pembayaran:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { id: 'Tunai', label: 'Tunai', icon: Coins, desc: 'Laci Kasir' },
                { id: 'QRIS', label: 'QRIS', icon: QrCode, desc: 'Scan Instan' },
                { id: 'Transfer', label: 'Transfer', icon: Building2, desc: 'BCA / Mandiri' },
                { id: 'Piutang', label: 'Piutang', icon: Clock, desc: 'Tempo / Kredit' },
                { id: 'DP', label: 'DP + Tempo', icon: CreditCard, desc: 'Uang Muka' },
              ].map(m => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs ring-1 ring-emerald-500 font-extrabold'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-bold'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs leading-tight">{m.label}</span>
                    <span className="text-[9px] text-slate-400 font-normal leading-none">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Method Form */}
          {paymentMethod === 'Tunai' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 block mb-1">
                  Nominal Uang Tunai Diterima (Rp):
                </label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full bg-white text-slate-900 font-mono font-bold text-base px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {cashSuggestions.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCashGiven(val)}
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition cursor-pointer ${
                      cashGiven === val
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val === totalAmount ? 'Uang Pas' : `Rp ${val.toLocaleString('id-ID')}`}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Kembalian:</span>
                <span className={`text-base font-mono font-extrabold ${
                  isCashInsufficient ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {isCashInsufficient ? 'Uang Kurang!' : formatRupiah(change)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'QRIS' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 mb-2">
                <div className="w-28 h-28 bg-white rounded flex flex-col items-center justify-center p-2 relative border border-slate-200">
                  <QrCode className="w-20 h-20 text-slate-900" />
                  <span className="text-[7.5px] font-mono text-emerald-700 font-bold mt-1">QRIS NATIONAL</span>
                </div>
              </div>
              <span className="text-xs font-bold text-slate-900">NMID: ID1020260088910</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Toko Pak Noor (Semua e-Wallet & Mobile Banking)</p>
              
              <button
                type="button"
                onClick={() => setIsDynamicQRISOpen(true)}
                className="mt-3 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Buka Layar QRIS Dinamis (Live Scanner)</span>
              </button>
            </div>
          )}

          {paymentMethod === 'Transfer' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Bank Central Asia (BCA):</span>
                <span className="font-mono font-bold text-slate-900">882-019-4451 (Noor H.)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Bank Mandiri:</span>
                <span className="font-mono font-bold text-slate-900">137-00-192837-1 (Noor H.)</span>
              </div>
            </div>
          )}

          {/* Form Piutang (Kredit) & DP (Uang Muka) */}
          {(paymentMethod === 'Piutang' || paymentMethod === 'DP') && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              
              {/* Customer Credit Status Banner */}
              <div className="bg-white border rounded-xl p-3 text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    {currentCust.name}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isOverdue ? 'Status: Overdue' : 'Status: Aktif'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Plafon Kredit:</span>
                    <strong className="font-mono text-slate-800">{formatRupiah(currentCust.creditLimit || 0)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hutang Saat Ini:</span>
                    <strong className="font-mono text-rose-600">{formatRupiah(currentCust.currentDebt || 0)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sisa Limit:</span>
                    <strong className={`font-mono ${remainingCredit <= 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {formatRupiah(remainingCredit)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Credit Limit / Overdue Alert Box */}
              {hasNoCreditFacility && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
                  <Lock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Akses Kredit Terkunci!</strong>
                    <span>Pelanggan ini belum memiliki fasilitas kredit (Plafon Rp 0). Silakan pilih pelanggan terdaftar atau hubungi Owner untuk buka limit.</span>
                  </div>
                </div>
              )}

              {isOverdue && (
                <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">KASIR TERKUNCI: Pelanggan Memiliki Tagihan Jatuh Tempo!</strong>
                    <span>Sesuai SOP, transaksi kredit ditolak otomatis sampai tagihan sebelumnya (Jatuh tempo: {currentCust.dueDate}) dilunasi.</span>
                  </div>
                </div>
              )}

              {isCreditExceeded && !hasNoCreditFacility && !isOverdue && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Peringatan: Melebihi Sisa Limit Piutang!</strong>
                    <span>
                      Total piutang baru ({formatRupiah(newDebt)}) melebihi sisa plafon kredit pelanggan ({formatRupiah(remainingCredit)}). Harap tingkatkan DP atau hubungi Owner.
                    </span>
                  </div>
                </div>
              )}

              {/* DP Input if DP method */}
              {paymentMethod === 'DP' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                      Uang Muka / DP Dibayar (Rp):
                    </label>
                    <input 
                      type="number"
                      step="10000"
                      value={dpAmount}
                      onChange={(e) => setDpAmount(Number(e.target.value))}
                      className="w-full bg-white text-slate-900 font-mono font-bold text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                      Sisa Piutang Tempo:
                    </label>
                    <div className="px-3 py-2 bg-slate-100 rounded-lg text-xs font-mono font-bold text-rose-700 border border-slate-200">
                      {formatRupiah(newDebt)}
                    </div>
                  </div>
                </div>
              )}

              {/* Tempo Terms Selection */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                  Jangka Waktu Tempo Pembayaran:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, label: '7 Hari (1 Minggu)' },
                    { days: 14, label: '14 Hari (2 Minggu)' },
                    { days: 30, label: '30 Hari (1 Bulan)' },
                  ].map(t => (
                    <button
                      key={t.days}
                      type="button"
                      onClick={() => setTempoDays(t.days)}
                      className={`p-2 rounded-lg border text-xs font-bold text-center transition cursor-pointer ${
                        tempoDays === t.days 
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 font-medium">
            {paymentMethod === 'Piutang' || paymentMethod === 'DP' ? (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Tempo: {tempoDays} Hari
              </span>
            ) : (
              <span>Metode: <strong>{paymentMethod}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              Batal
            </button>
            
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isCashInsufficient || isCreditBlocked || isProcessing}
              className={`px-5 py-2.5 rounded-xl text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition cursor-pointer ${
                isCreditBlocked 
                  ? 'bg-rose-600 hover:bg-rose-700 opacity-60 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/10'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isProcessing ? (
                <span>Memproses Transaksi...</span>
              ) : isCreditBlocked ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Kredit Ditolak (Terkunci)</span>
                </>
              ) : (
                <>
                  <span>Selesaikan Transaksi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic QRIS Modal Popup */}
      <DynamicQRISModal
        isOpen={isDynamicQRISOpen}
        onClose={() => setIsDynamicQRISOpen(false)}
        amount={totalAmount}
        merchantName="TOKO PAK NOOR (KASIR)"
        onPaymentSuccess={() => {
          setIsDynamicQRISOpen(false);
          handleConfirm();
        }}
      />
    </div>
  );
}
