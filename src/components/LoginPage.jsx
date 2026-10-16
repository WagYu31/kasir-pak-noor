import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Warehouse, 
  Monitor, 
  Lock, 
  KeyRound, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Delete,
  UserCheck,
  Users,
  Printer,
  Barcode,
  Coins,
  DollarSign,
  CreditCard,
  Check,
  ChevronDown,
  Search,
  Sparkles,
  Cpu,
  Zap,
  SlidersHorizontal,
  Layers,
  FileText,
  X,
  Radio,
  Fingerprint
} from 'lucide-react';
import { USER_ROLES } from './UserRoleModal';
import { INITIAL_USERS, INITIAL_TERMINALS } from '../data/mockData';

export default function LoginPage({ 
  onLoginSuccess, 
  users = INITIAL_USERS,
  terminals = INITIAL_TERMINALS
}) {
  const activeUsers = users.filter(u => u.status !== 'NONAKTIF');
  
  // Production vs Demo Mode Toggle (Defaults to Production so client sees the real version!)
  const [isProductionMode, setIsProductionMode] = useState(true);
  
  const [authMethod, setAuthMethod] = useState('pin'); // 'pin' | 'password'
  const [selectedStaff, setSelectedStaff] = useState(activeUsers[2] || activeUsers[0] || users[0]);
  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState(activeUsers[2]?.email || 'kasir@tokopaknoor.com');
  const [passwordInput, setPasswordInput] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState(terminals[0]?.name || 'Kasir 1');
  const [selectedWarehouse, setSelectedWarehouse] = useState('WH-01');
  const [startingCash, setStartingCash] = useState(300000);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Staff Selection Modal for Production Mode
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync selectedTerminal if selectedStaff is locked to a specific terminal
  useEffect(() => {
    if (selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL') {
      setSelectedTerminal(selectedStaff.assignedTerminal);
    }
  }, [selectedStaff]);

  // Keyboard numeric listener for PIN input
  useEffect(() => {
    if (authMethod !== 'pin') return;

    const handleKeyDown = (e) => {
      // Don't capture keyboard if staff search modal is open
      if (isStaffModalOpen) return;

      if (e.key >= '0' && e.key <= '9') {
        if (pinInput.length < 4) {
          handleNumpadPress(e.key);
        }
      } else if (e.key === 'Backspace') {
        handleNumpadDelete();
      } else if (e.key === 'Escape') {
        handleNumpadClear();
      } else if (e.key === 'Enter') {
        if (pinInput.length === 4) {
          verifyPin(pinInput);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authMethod, pinInput, selectedStaff, selectedTerminal, selectedWarehouse, startingCash, isStaffModalOpen]);

  const handleNumpadPress = (digit) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setErrorMessage('');

    // Auto submit upon 4 digits
    if (nextPin.length === 4) {
      setTimeout(() => {
        verifyPin(nextPin);
      }, 180);
    }
  };

  const handleNumpadDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleNumpadClear = () => {
    setPinInput('');
    setErrorMessage('');
  };

  const verifyPin = (pinToTest) => {
    if (selectedStaff.pin === pinToTest) {
      onLoginSuccess({
        user: selectedStaff,
        role: selectedStaff.role,
        terminal: selectedTerminal,
        warehouse: selectedWarehouse,
        startingCash: Number(startingCash) || 300000
      });
    } else {
      setErrorMessage(`PIN salah untuk ${selectedStaff.name}! Silakan masukkan PIN yang tepat.`);
      setPinInput('');
    }
  };

  const handlePasswordLogin = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const foundUser = users.find(
      u => u.email.toLowerCase() === emailInput.trim().toLowerCase()
    );

    if (!foundUser) {
      setErrorMessage('Email tidak terdaftar dalam sistem!');
      return;
    }

    if (passwordInput !== 'password123' && passwordInput !== foundUser.pin) {
      setErrorMessage('Kata sandi salah! Silakan coba lagi.');
      return;
    }

    onLoginSuccess({
      user: foundUser,
      role: foundUser.role,
      terminal: selectedTerminal,
      warehouse: selectedWarehouse,
      startingCash: Number(startingCash) || 300000
    });
  };

  // Quick 1-click test login for demo
  const handleQuickLogin = (user) => {
    onLoginSuccess({
      user: user,
      role: user.role,
      terminal: selectedTerminal,
      warehouse: selectedWarehouse,
      startingCash: Number(startingCash) || 300000
    });
  };

  const handleAddFloatCash = (amount) => {
    setStartingCash(prev => Math.max(0, (Number(prev) || 0) + amount));
  };

  const filteredStaffList = activeUsers.filter(u => 
    u.name.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
    u.roleTitle.toLowerCase().includes(staffSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-emerald-50/20 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-800 relative overflow-hidden font-sans">
      
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Enterprise Navigation & Status Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-3 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-600/20 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
                  TOKO PAK NOOR
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200/80 hidden sm:inline-block">
                  Enterprise POS v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
                <span>Cabang Rungkut Utama</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-semibold">{selectedTerminal}</span>
              </p>
            </div>
          </div>

          {/* Right Live Indicators & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Clock & Date */}
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span className="capitalize">{currentTime.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              <span className="text-slate-300">•</span>
              <span className="font-mono font-bold text-slate-900">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB</span>
            </div>

            {/* Server Online Badge */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Server Online</span>
              <span className="text-[10px] text-emerald-600/80 font-mono font-normal hidden lg:inline">(14ms)</span>
            </div>

            {/* MODE SWITCHER PILL (PRODUCTION VS DEMO) */}
            <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 flex items-center shadow-2xs">
              <button
                type="button"
                onClick={() => setIsProductionMode(true)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  isProductionMode 
                    ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilan mode produksi asli tanpa alat uji coba"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mode Produksi</span>
              </button>

              <button
                type="button"
                onClick={() => setIsProductionMode(false)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  !isProductionMode 
                    ? 'bg-white text-indigo-800 shadow-xs border border-slate-200/80' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Tampilkan pintasan demo 1-klik untuk presentasi"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mode Demo</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: TERMINAL HARDWARE & SHIFT CASHIER GATEWAY   */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-sm relative overflow-hidden">
            
            {/* Subtle Accent Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/10 via-transparent to-transparent pointer-events-none rounded-bl-full" />

            <div className="relative z-10 space-y-5">
              
              {/* Portal Header Badge & Title */}
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2.5 shadow-2xs">
                  <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Stasiun Kasir & Hardware POS</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  Terminal Kasir Toko Pak Noor
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                  Konfigurasi stasiun kasir aktif, alokasi gudang toko, dan perhitungan modal awal pembukaan laci kasir (shift register).
                </p>
              </div>

              {/* Hardware Peripherals Live Status Indicators */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  Status Perangkat Kasir Terkoneksi:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex flex-col items-center gap-1 shadow-2xs">
                    <Barcode className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-bold text-slate-800">Scanner USB</span>
                    <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 rounded-full">Ready</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex flex-col items-center gap-1 shadow-2xs">
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-800">Thermal 80mm</span>
                    <span className="text-[9px] text-blue-700 font-extrabold bg-blue-50 px-1.5 rounded-full">Siap Cetak</span>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200/80 flex flex-col items-center gap-1 shadow-2xs">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span className="text-[10px] font-bold text-slate-800">Laci Kasir</span>
                    <span className="text-[9px] text-amber-800 font-extrabold bg-amber-50 px-1.5 rounded-full">RJ-11 Auto</span>
                  </div>
                </div>
              </div>

              {/* Operational Configuration: Terminal & Warehouse */}
              <div className="space-y-3 pt-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
                  Pengaturan Stasiun & Gudang:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Terminal Selector */}
                  <div className="bg-slate-50/90 border border-slate-200/90 p-3 rounded-2xl hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-slate-500 text-[10.5px] font-bold mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-600" />
                        <span>Terminal Stasiun:</span>
                      </div>
                      {selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL' && (
                        <span className="text-[9px] font-black text-amber-800 bg-amber-100/90 px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Terkunci
                        </span>
                      )}
                    </div>
                    <select
                      value={selectedTerminal}
                      disabled={selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL'}
                      onChange={(e) => setSelectedTerminal(e.target.value)}
                      className={`w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2 focus:outline-none focus:border-emerald-600 shadow-2xs ${
                        selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL'
                          ? 'opacity-85 bg-slate-100 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      {terminals.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} • {t.location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Warehouse Selector */}
                  <div className="bg-slate-50/90 border border-slate-200/90 p-3 rounded-2xl hover:border-slate-300 transition">
                    <div className="flex items-center justify-between text-slate-500 text-[10.5px] font-bold mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-slate-600" />
                        <span>Lokasi Gudang:</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                        10 SKU
                      </span>
                    </div>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2 focus:outline-none focus:border-emerald-600 cursor-pointer shadow-2xs"
                    >
                      <option value="WH-01">Toko Depan (WH-01)</option>
                      <option value="WH-02">Gudang Pusat DC (WH-02)</option>
                    </select>
                  </div>
                </div>

                {/* Starting Cash Float with Quick Increment Chips */}
                <div className="bg-slate-50/90 border border-slate-200/90 p-3.5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-slate-600 text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      <span>Modal Awal Laci Kasir (Float Cash):</span>
                    </span>
                    <span className="font-mono text-emerald-700 text-xs font-black">
                      Rp {Number(startingCash).toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                      Rp
                    </span>
                    <input
                      type="number"
                      step="10000"
                      value={startingCash}
                      onChange={(e) => setStartingCash(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-sm font-mono font-black text-slate-900 rounded-xl pl-10 pr-3 py-2 focus:outline-none focus:border-emerald-600 shadow-2xs"
                      placeholder="300000"
                    />
                  </div>

                  {/* Quick Increment Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold mr-1">Cepat:</span>
                    {[
                      { label: '+50rb', val: 50000 },
                      { label: '+100rb', val: 100000 },
                      { label: '+200rb', val: 200000 },
                      { label: 'Set 300rb', val: 300000, isSet: true },
                      { label: 'Set 500rb', val: 500000, isSet: true },
                    ].map(chip => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => chip.isSet ? setStartingCash(chip.val) : handleAddFloatCash(chip.val)}
                        className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 text-[10px] font-bold transition active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-normal">
                    Uang fisik pecahan kecil yang disiapkan di dalam laci kasir saat pembukaan register toko.
                  </p>
                </div>

              </div>

            </div>

            {/* Shift SOP & Checklist Card (Shown in Production Mode) */}
            {isProductionMode && (
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-800 block">
                      Shift Pagi / Utama (07:00 - 15:00)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      SOP Kasir: Hitung modal awal & periksa kertas struk thermal.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick 1-Click Demo Profiles (Shown ONLY when Demo Mode is Active) */}
            {!isProductionMode && (
              <div className="mt-5 pt-4 border-t border-slate-100 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/70">
                    ⚡ Mode Demo 1-Klik (Uji Coba Cepat Peran):
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-medium">Bisa Dimatikan</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activeUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="px-2.5 py-2 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition cursor-pointer active:scale-95 group shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-800">
                          {u.name}
                        </span>
                        <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-600 font-bold">
                          {u.pin}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                        {u.roleTitle.split('(')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: CASHIER PIN ENTRY & SECURITY NUMPAD        */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between shadow-sm relative">
            <div>
              
              {/* Method Toggle: Fast PIN vs Password */}
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-5">
                <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('pin');
                      setErrorMessage('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                      authMethod === 'pin'
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-4 h-4 text-emerald-600" />
                    <span>PIN Cepat Kasir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('password');
                      setErrorMessage('');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition cursor-pointer ${
                      authMethod === 'password'
                        ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span>Email & Sandi</span>
                  </button>
                </div>

                <span className="text-[11px] font-bold text-slate-400 hidden sm:flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                  <span>Autentikasi Terenkripsi</span>
                </span>
              </div>

              {/* Error Alert Message */}
              {errorMessage && (
                <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-shake shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ==================================================== */}
              {/* TAB 1: PIN CEPAT KASIR (TACTILE TOUCHSCREEN NUMPAD) */}
              {/* ==================================================== */}
              {authMethod === 'pin' ? (
                <div>
                  
                  {/* IN PRODUCTION MODE: Ultra-Clean Active Operator Card with Switcher */}
                  {isProductionMode ? (
                    <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/60 via-teal-50/30 to-white border border-emerald-200/80 flex items-center justify-between shadow-2xs">
                      
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base border-2 shadow-xs shrink-0 ${selectedStaff.avatarBg}`}>
                          {selectedStaff.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                            Operator Kasir Terpilih:
                          </span>
                          <h3 className="font-black text-sm text-slate-900 truncate">
                            {selectedStaff.name}
                          </h3>
                          <div className="text-[10.5px] text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
                            <span>{selectedStaff.roleTitle.split('(')[0]}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700 font-bold">Shift Aktif</span>
                          </div>
                        </div>
                      </div>

                      {/* Ganti Kasir Button (Opens Selection Modal) */}
                      <button
                        type="button"
                        onClick={() => {
                          setStaffSearchQuery('');
                          setIsStaffModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs shrink-0"
                        title="Ganti akun operator kasir"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ganti Kasir</span>
                      </button>

                    </div>
                  ) : (
                    /* IN DEMO MODE: Show Staff Cards Grid */
                    <div className="mb-5 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                          Pilih Pengguna / Kasir:
                        </label>
                        <span className="text-[10px] text-slate-400 font-bold">Mode Demo</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {activeUsers.map((user) => {
                          const isSelected = selectedStaff.id === user.id;
                          return (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => {
                                setSelectedStaff(user);
                                setPinInput('');
                                setErrorMessage('');
                              }}
                              className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-95 shadow-2xs ${
                                isSelected
                                  ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/20'
                                  : 'bg-white hover:bg-slate-50 border-slate-200/90'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border ${user.avatarBg}`}>
                                  {user.name.charAt(0)}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                )}
                              </div>
                              <div>
                                <div className="text-xs font-black text-slate-900 leading-snug truncate">
                                  {user.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {user.roleTitle.split('(')[0]}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* PIN Display Area (Glowing Digit Circles) */}
                  <div className="flex flex-col items-center justify-center py-2 mb-3">
                    <span className="text-xs text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-slate-400" />
                      <span>Masukkan PIN 4-Digit untuk <strong className="text-slate-900 font-black">{selectedStaff.name}</strong></span>
                    </span>

                    <div className="flex items-center gap-3.5">
                      {[0, 1, 2, 3].map((idx) => {
                        const isFilled = pinInput.length > idx;
                        return (
                          <div
                            key={idx}
                            className={`w-4 h-4 rounded-full transition-all duration-200 ${
                              isFilled
                                ? 'bg-emerald-600 ring-4 ring-emerald-500/25 scale-125'
                                : 'bg-slate-100 border-2 border-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Enterprise Tactile Touchscreen Numpad with Letters (Apple/Toast Style) */}
                  <div className="max-w-[310px] mx-auto grid grid-cols-3 gap-2.5">
                    {[
                      { num: '1', sub: ' ' },
                      { num: '2', sub: 'ABC' },
                      { num: '3', sub: 'DEF' },
                      { num: '4', sub: 'GHI' },
                      { num: '5', sub: 'JKL' },
                      { num: '6', sub: 'MNO' },
                      { num: '7', sub: 'PQRS' },
                      { num: '8', sub: 'TUV' },
                      { num: '9', sub: 'WXYZ' },
                    ].map((btn) => (
                      <button
                        key={btn.num}
                        type="button"
                        onClick={() => handleNumpadPress(btn.num)}
                        className="h-13 rounded-2xl bg-white hover:bg-slate-50 active:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 text-slate-900 flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs group"
                      >
                        <span className="font-mono font-black text-lg leading-none group-hover:text-emerald-700">
                          {btn.num}
                        </span>
                        {btn.sub.trim() && (
                          <span className="text-[8.5px] font-extrabold text-slate-400 tracking-wider mt-0.5">
                            {btn.sub}
                          </span>
                        )}
                      </button>
                    ))}

                    {/* Clear Button */}
                    <button
                      type="button"
                      onClick={handleNumpadClear}
                      className="h-13 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100 border border-slate-200/90 text-slate-500 font-extrabold text-xs flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
                      title="Hapus Semua Digit (Esc)"
                    >
                      CLEAR
                    </button>

                    {/* 0 Button */}
                    <button
                      type="button"
                      onClick={() => handleNumpadPress('0')}
                      className="h-13 rounded-2xl bg-white hover:bg-slate-50 active:bg-emerald-50 border border-slate-200/90 hover:border-emerald-300 text-slate-900 flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer shadow-2xs hover:shadow-xs group"
                    >
                      <span className="font-mono font-black text-lg leading-none group-hover:text-emerald-700">
                        0
                      </span>
                      <span className="text-[8.5px] font-extrabold text-slate-400 tracking-wider mt-0.5">
                        +
                      </span>
                    </button>

                    {/* Backspace Button */}
                    <button
                      type="button"
                      onClick={handleNumpadDelete}
                      className="h-13 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
                      title="Hapus Satu Digit (Backspace)"
                    >
                      <Delete className="w-5 h-5" />
                    </button>
                  </div>

                </div>
              ) : (
                /* ==================================================== */
                /* TAB 2: EMAIL & PASSWORD FORM (SUPERVISOR / OWNER)    */
                /* ==================================================== */
                <form onSubmit={handlePasswordLogin} className="space-y-4 max-w-md mx-auto pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Alamat Email Staf:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="kasir@tokopaknoor.com"
                        className="w-full bg-slate-50 text-slate-900 text-xs font-semibold pl-10 pr-3.5 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Kata Sandi:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full bg-slate-50 text-slate-900 text-xs font-semibold pl-10 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                    >
                      <span>Masuk ke Sistem POS</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Bottom Security Assurance Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enkripsi Sesi Kasir POS Aktif (TLS 1.3)</span>
              </span>
              <span>
                {isProductionMode ? (
                  <span className="font-semibold text-slate-500">Lupa PIN? Hubungi Supervisor</span>
                ) : (
                  <span>PIN Default: <strong>1111 (Kasir)</strong> • <strong>1234 (Owner)</strong></span>
                )}
              </span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer System Credits */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 py-2.5 px-4 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} <strong>Toko Pak Noor</strong> — Sistem Manajemen Point of Sale & Inventori Retail Multi-Terminal v2.0
        </p>
      </footer>

      {/* ======================================================== */}
      {/* OPERATOR SELECTION MODAL (GANTI KASIR)                   */}
      {/* ======================================================== */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    Pilih Operator / Kasir Aktif
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Tentukan akun staf yang akan membuka shift kasir ini
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                placeholder="Cari nama staf atau peran..."
                className="w-full bg-slate-50 text-xs font-medium pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                autoFocus
              />
            </div>

            {/* Staff List */}
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
              {filteredStaffList.map((user) => {
                const isSelected = selectedStaff.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedStaff(user);
                      setPinInput('');
                      setErrorMessage('');
                      setIsStaffModalOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-2xs' 
                        : 'bg-white hover:bg-slate-50 border-slate-200/90'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border ${user.avatarBg}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-xs text-slate-900 truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {user.roleTitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
