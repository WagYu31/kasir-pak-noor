import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export default function DynamicQRISModal({ 
  isOpen, 
  onClose, 
  amount, 
  merchantName = "TOKO PAK NOOR",
  invoiceId = `INV-${Date.now().toString().slice(-6)}`,
  onPaymentSuccess
}) {
  if (!isOpen) return null;

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulatePaid = () => {
    setIsSimulatingSuccess(true);
    setTimeout(() => {
      setIsSimulatingSuccess(false);
      onPaymentSuccess();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up text-center">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
              Scan QR Code
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QRIS Body */}
        <div className="p-6 space-y-4 flex flex-col items-center">
          
          {/* Official QRIS Header Badge */}
          <div className="flex items-center gap-2 justify-center">
            <div className="bg-rose-600 text-white font-black text-xs px-2.5 py-0.5 rounded tracking-wider shadow-2xs">
              QRIS
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Pembayaran Digital Nasional
            </span>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">{merchantName}</h4>
            <div className="text-[10.5px] font-mono text-slate-400">NMID: ID1020088920192 • {invoiceId}</div>
          </div>

          {/* Amount Box */}
          <div className="bg-emerald-50 border border-emerald-200 px-5 py-2 rounded-2xl w-full">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Tagihan:</span>
            <div className="text-2xl font-mono font-black text-emerald-800">
              Rp {amount.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Dynamic QR Display with Corner Target Lines */}
          <div className="relative p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-inner flex flex-col items-center">
            {/* SVG Realistis QR Code with Center QRIS Logo */}
            <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
              {/* Corner position markers */}
              <rect x="5" y="5" width="24" height="24" rx="3" fill="#0f172a" />
              <rect x="8" y="8" width="18" height="18" rx="2" fill="white" />
              <rect x="11" y="11" width="12" height="12" rx="1.5" fill="#0f172a" />

              <rect x="71" y="5" width="24" height="24" rx="3" fill="#0f172a" />
              <rect x="74" y="8" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="11" width="12" height="12" rx="1.5" fill="#0f172a" />

              <rect x="5" y="71" width="24" height="24" rx="3" fill="#0f172a" />
              <rect x="8" y="74" width="18" height="18" rx="2" fill="white" />
              <rect x="11" y="77" width="12" height="12" rx="1.5" fill="#0f172a" />

              {/* Data pixel matrix pattern */}
              <g fill="#0f172a">
                <rect x="35" y="8" width="5" height="5" />
                <rect x="45" y="8" width="5" height="5" />
                <rect x="55" y="8" width="5" height="5" />
                <rect x="35" y="18" width="5" height="5" />
                <rect x="50" y="18" width="5" height="5" />
                <rect x="60" y="18" width="5" height="5" />
                
                <rect x="8" y="35" width="5" height="5" />
                <rect x="18" y="35" width="5" height="5" />
                <rect x="8" y="50" width="5" height="5" />
                <rect x="23" y="50" width="5" height="5" />

                <rect x="35" y="35" width="5" height="5" />
                <rect x="60" y="35" width="5" height="5" />
                <rect x="75" y="35" width="5" height="5" />
                <rect x="85" y="40" width="5" height="5" />
                <rect x="75" y="50" width="5" height="5" />

                <rect x="35" y="75" width="5" height="5" />
                <rect x="45" y="75" width="5" height="5" />
                <rect x="60" y="75" width="5" height="5" />
                <rect x="75" y="75" width="5" height="5" />
                <rect x="85" y="75" width="5" height="5" />
                <rect x="45" y="85" width="5" height="5" />
                <rect x="60" y="85" width="5" height="5" />
                <rect x="70" y="85" width="5" height="5" />
              </g>

              {/* Center Logo */}
              <circle cx="50" cy="50" r="12" fill="white" stroke="#0f172a" strokeWidth="1.5" />
              <text x="50" y="53" textAnchor="middle" fill="#dc2626" fontSize="7" fontWeight="900" fontFamily="sans-serif">
                QRIS
              </text>
            </svg>

            {/* Countdown Badge */}
            <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-mono font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Sisa Waktu: {formattedTime}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Buka aplikasi <strong>BCA, Mandiri, BRI, GoPay, OVO, Dana, ShopeePay</strong> lalu scan QR di atas.
          </p>

          {/* Quick Simulation / Cashier Action */}
          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              onClick={handleSimulatePaid}
              disabled={isSimulatingSuccess}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              {isSimulatingSuccess ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Notifikasi Bank...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi: Pembayaran Pelanggan Berhasil ✓</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print QRIS ke Kertas Struk Kasir</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
