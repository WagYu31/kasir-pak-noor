import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  X, 
  FlipHorizontal, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  VideoOff
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

// Audio feedback using Web Audio API (standard POS beep)
const playBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

export default function CameraBarcodeScannerModal({ 
  isOpen, 
  onClose, 
  onScanSuccess, 
  title = "Scan Barcode Menggunakan Kamera" 
}) {
  if (!isOpen) return null;

  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const scannerRef = useRef(null);

  useEffect(() => {
    let html5QrCode = null;

    const startScanner = async () => {
      try {
        setCameraError(null);
        setIsScanning(true);

        // Formats to support 1D Retail Barcodes & 2D QR Codes
        const formatsToSupport = [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.QR_CODE
        ];

        html5QrCode = new Html5Qrcode("camera-reader", {
          formatsToSupport,
          verbose: false
        });
        scannerRef.current = html5QrCode;

        const config = {
          fps: 20,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const width = Math.min(viewfinderWidth * 0.85, 340);
            const height = Math.min(viewfinderHeight * 0.65, 200);
            return { width, height };
          },
          aspectRatio: 1.333333
        };

        await html5QrCode.start(
          { facingMode: facingMode },
          config,
          (decodedText) => {
            playBeep();
            setLastScanned(decodedText);
            onScanSuccess(decodedText);
          },
          () => {
            // Frame scanning cycle, ignore normal non-detection frames
          }
        );
      } catch (err) {
        console.warn("Gagal membuka kamera:", err);
        setCameraError(err?.message || 'Izin kamera ditolak atau tidak ada kamera terpasang di perangkat ini.');
        setIsScanning(false);
      }
    };

    const timer = setTimeout(() => {
      startScanner();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
              scannerRef.current.clear();
            }).catch(() => {});
          }
        } catch (e) {}
      }
    };
  }, [facingMode]);

  const toggleFacingMode = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
      }).catch(() => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
      });
    } else {
      setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }
  };

  const handleSimulateScan = (code) => {
    playBeep();
    setLastScanned(code);
    onScanSuccess(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">Mendukung Kamera HP, Tablet, & Webcam Laptop</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleFacingMode}
              title="Ganti Kamera Depan/Belakang"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Area */}
        <div className="p-5 space-y-4">
          
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-4/3 flex items-center justify-center border-2 border-slate-200 shadow-inner">
            
            {/* HTML5 QR Code Mount Node */}
            <div id="camera-reader" className="w-full h-full object-cover"></div>

            {/* Target Laser Overlay Animation */}
            {isScanning && !cameraError && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-[85%] h-[65%] border-2 border-emerald-400/80 rounded-xl relative overflow-hidden shadow-2xl">
                  {/* Corner marks */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>
                  
                  {/* Animated laser line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400 animate-pulse"></div>
                </div>

                <span className="text-[11px] font-bold text-white bg-slate-900/80 px-3 py-1 rounded-full border border-white/20 mt-3 backdrop-blur-xs">
                  Arahkan garis kamera ke barcode kemasan barang
                </span>
              </div>
            )}

            {/* Camera Error Fallback */}
            {cameraError && (
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-slate-300 space-y-2.5">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <VideoOff className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white">Kamera Belum Aktif / Ditolak Izinnya</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                    Pastikan Anda mengizinkan (*Allow*) akses kamera di browser, atau gunakan tombol simulasi instan di bawah ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Coba Beralih Kamera</span>
                </button>
              </div>
            )}

          </div>

          {/* Feedback Hasil Scan Terakhir */}
          {lastScanned && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between shadow-xs animate-slide-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">Barcode Terdeteksi:</span>
                  <span className="font-mono text-xs font-extrabold text-slate-900">{lastScanned}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                Berhasil Di-scan
              </span>
            </div>
          )}

          {/* Quick Simulation Buttons (Bagi user yang test di laptop/PC tanpa webcam atau demo) */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Simulasi Tembak Barcode Cepat (Jika Tanpa Kamera Fisik):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: 'Sania 2L', code: '8991234001002' },
                { label: 'Indomie Goreng', code: '899886611003' },
                { label: 'Beras Ramos 5kg', code: '899554422001' },
                { label: 'Gulaku 1kg', code: '899223344002' },
                { label: 'Le Minerale 600ml', code: '899332211002' }
              ].map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSimulateScan(item.code)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                >
                  <span>{item.label}</span>
                  <span className="text-[9.5px] font-mono text-slate-400">({item.code.slice(-4)})</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[10.5px] text-slate-500">
            Kamera mendukung semua barcode 1D (EAN/UPC) & 2D (QR Code).
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-xs"
          >
            Selesai / Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
