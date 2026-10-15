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
  AlertCircle
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
  shiftData
}) {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState('Tunai'); // Tunai, QRIS, Transfer
  const [cashGiven, setCashGiven] = useState(totalAmount);
  const [customerName, setCustomerName] = useState('Pelanggan Umum');
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

  const handleConfirm = () => {
    if (isCashInsufficient) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Confetti burst for rewarding micro-interaction
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':') + ' WIB';
      const dateStr = now.toISOString().slice(0, 10);

      const transactionData = {
        id: `INV-${Date.now().toString().slice(-6)}`,
        date: dateStr,
        hour: now.getHours().toString().padStart(2, '0') + ':00',
        time: timeStr,
        terminal: activeTerminal,
        cashier: shiftData.cashier,
        customer: customerName,
        paymentMethod,
        items: cart,
        itemsCount: cart.length,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        tax: cart.reduce((sum, item) => sum + ((item.price * item.qty) * (item.tax || 0)), 0),
        totalAmount,
        cashGiven: paymentMethod === 'Tunai' ? cashGiven : totalAmount,
        change: paymentMethod === 'Tunai' ? change : 0,
        totalHpp: cart.reduce((sum, item) => sum + (item.hpp * item.qty), 0),
        grossProfit: totalAmount - cart.reduce((sum, item) => sum + (item.hpp * item.qty), 0)
      };

      setIsProcessing(false);
      onPaymentSuccess(transactionData);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Konfirmasi Pembayaran</h3>
              <p className="text-[11px] text-slate-500 font-medium">Terminal: {activeTerminal} • Kasir: {shiftData.cashier}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Total Tagihan Banner */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Yang Harus Dibayar:</span>
            <div className="text-2xl font-mono font-extrabold text-emerald-700 mt-0.5">
              Rp {totalAmount.toLocaleString('id-ID')}
            </div>
            <div className="text-[10.5px] text-slate-500 mt-1">
              {cart.reduce((s, i) => s + i.qty, 0)} item dalam keranjang
            </div>
          </div>

          {/* Payment Method Switcher */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Metode Pembayaran:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Tunai', label: 'Uang Tunai', icon: Coins },
                { id: 'QRIS', label: 'QRIS Statis/Dinamis', icon: QrCode },
                { id: 'Transfer', label: 'Transfer Bank', icon: Building2 },
              ].map(m => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-center transition ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] font-bold">{m.label}</span>
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
                  Nominal Uang Diterima (Rp):
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
                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition ${
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
                  {isCashInsufficient ? 'Uang Kurang!' : `Rp ${change.toLocaleString('id-ID')}`}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'QRIS' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-xl shadow-xs border border-slate-200 mb-2">
                {/* Simulated QR Code */}
                <div className="w-32 h-32 bg-white rounded flex flex-col items-center justify-center p-2 relative border border-slate-200">
                  <QrCode className="w-24 h-24 text-slate-900" />
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
                <span>Buka Layar QRIS Dinamis (Gaya Layar POS di Video)</span>
              </button>
            </div>
          )}

          {paymentMethod === 'Transfer' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Bank BCA:</span>
                <span className="font-mono font-bold text-slate-900">882-019-4451 (Noor H.)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Bank Mandiri:</span>
                <span className="font-mono font-bold text-slate-900">137-00-192837-1 (Noor H.)</span>
              </div>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-600 block mb-1 uppercase tracking-wide">
              Nama Pelanggan (Opsional):
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Pak Budi / Member Grosir"
              className="w-full bg-white text-slate-900 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-xs"
          >
            Batal
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isCashInsufficient || isProcessing}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs shadow-emerald-900/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span>Memproses Transaksi...</span>
            ) : (
              <>
                <span>Selesaikan Transaksi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Dynamic QRIS Modal Popup (Gaya Video WhatsApp) */}
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
