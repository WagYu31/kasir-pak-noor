import React from 'react';
import { Monitor, X, ShoppingBag, QrCode, Sparkles, Store } from 'lucide-react';

export default function CustomerDisplayModal({ isOpen, onClose, cart, totalAmount, activeQueue, lastScannedItem }) {
  if (!isOpen) return null;

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-2xl text-slate-900">
        
        {/* Top Header for Customer */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">TOKO RETAIL PAK NOOR</h2>
              <p className="text-xs text-slate-500 font-medium">Layar Tampilan Pelanggan (Customer Facing Screen)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              {activeQueue} Aktif
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
              title="Tutup Layar Pelanggan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dual Pane Display: Left Items & Right Total */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[460px] bg-white">
          
          {/* Left: Scanned Items List (7 cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 p-4">
            
            {/* Last Scanned Item Live Banner (Alfamart signature) */}
            {lastScannedItem && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl mb-3 flex items-center justify-between shadow-xs animate-slide-up">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Item Terakhir Di-Scan:</span>
                  <div className="font-extrabold text-sm text-slate-900">{lastScannedItem.name}</div>
                  <div className="text-xs text-slate-500 font-mono">
                    {lastScannedItem.qty} {lastScannedItem.unit} @ Rp {lastScannedItem.price.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    Rp {(lastScannedItem.price * lastScannedItem.qty).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            )}

            {/* Scrollable List of Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                  <ShoppingBag className="w-12 h-12 mb-2 stroke-1" />
                  <p className="text-sm font-bold text-slate-600">Selamat Berbelanja di Toko Pak Noor</p>
                  <p className="text-xs text-slate-400">Barang yang di-scan kasir akan langsung tampil di sini.</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold font-mono flex items-center justify-center text-[11px] border border-slate-200">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                        <div className="text-slate-500 text-[11px]">
                          {item.qty} {item.unit} x Rp {item.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono font-extrabold text-emerald-700 text-sm">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-500 font-medium">
              <span>Total Kuantitas: <strong className="text-slate-900">{totalItems} Item</strong></span>
              <span>Harga sudah termasuk PPN 11%</span>
            </div>

          </div>

          {/* Right: Giant LED Total & QRIS Ready (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between gap-4">
            
            {/* Giant Total LED Box */}
            <div className="bg-emerald-600 text-white p-6 rounded-2xl border border-emerald-500 text-center shadow-lg shadow-emerald-900/10">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-100 block mb-1">
                TOTAL YANG HARUS DIBAYAR
              </span>
              <div className="text-4xl font-extrabold font-mono text-white tracking-tight">
                Rp {totalAmount.toLocaleString('id-ID')}
              </div>
              <span className="text-xs text-emerald-100 block mt-2">
                Silakan lakukan pembayaran ke kasir
              </span>
            </div>

            {/* Minimarket Retail Promo Banner */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-800 uppercase block tracking-wider text-[10px]">
                  Promo Tebus Murah Hari Ini!
                </span>
                <p className="text-amber-900 mt-0.5">
                  Belanja minimal Rp 50.000, tebus <strong>Minyak Sania 2L</strong> hanya Rp 32.000!
                </p>
              </div>
            </div>

            {/* QRIS Quick Display */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Metode Non-Tunai:</span>
                <div className="text-xs font-bold text-slate-900 mt-0.5">Scan QRIS Semua Bank / e-Wallet</div>
                <div className="text-[10.5px] text-emerald-700 font-mono mt-0.5">GoPay • OVO • DANA • BCA • Mandiri</div>
              </div>
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 border border-slate-200 shadow-xs">
                <QrCode className="w-10 h-10 text-slate-900" />
              </div>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-200 text-center text-xs text-slate-500">
          Terima kasih telah berbelanja di Toko Retail Pak Noor • Layanan Konsumen: 0812-3456-7890
        </div>

      </div>
    </div>
  );
}
