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
  Users
} from 'lucide-react';
import { USER_ROLES } from './UserRoleModal';
import { INITIAL_USERS, INITIAL_TERMINALS } from '../data/mockData';

export default function LoginPage({ 
  onLoginSuccess, 
  users = INITIAL_USERS,
  terminals = INITIAL_TERMINALS
}) {
  const activeUsers = users.filter(u => u.status !== 'NONAKTIF');
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

  // Clock in login screen
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
  }, [authMethod, pinInput, selectedStaff, selectedTerminal, selectedWarehouse, startingCash]);

  const handleNumpadPress = (digit) => {
    if (pinInput.length >= 4) return;
    const nextPin = pinInput + digit;
    setPinInput(nextPin);
    setErrorMessage('');

    // Auto submit upon 4 digits
    if (nextPin.length === 4) {
      setTimeout(() => {
        verifyPin(nextPin);
      }, 150);
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
      setErrorMessage(`PIN salah untuk ${selectedStaff.name}! Coba gunakan PIN default (${selectedStaff.pin}).`);
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
      setErrorMessage('Kata sandi salah! Gunakan: password123');
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

  // Quick 1-click test login for any profile
  const handleQuickLogin = (user) => {
    onLoginSuccess({
      user: user,
      role: user.role,
      terminal: selectedTerminal,
      warehouse: selectedWarehouse,
      startingCash: Number(startingCash) || 300000
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* Top Simple Utility Bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight leading-tight">
                TOKO PAK NOOR
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                Sistem POS & Inventori Retail • Cabang Rungkut Utama
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Server Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: BRANDING & OPERATIONAL STATUS (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
                <Store className="w-3.5 h-3.5 text-emerald-700" />
                <span>Portal Autentikasi Kasir & Staf</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Masuk ke Terminal Toko Pak Noor
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                Silakan pilih akun staf dan masukkan PIN 4 digit untuk membuka register kasir, inventori multi-gudang, atau dashboard manajemen.
              </p>

              {/* Terminal & Warehouse Configuration */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Pengaturan Terminal & Gudang:
                </label>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between text-slate-500 text-[10.5px] font-medium mb-1">
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3.5 h-3.5 text-slate-600" />
                        <span>Terminal POS:</span>
                      </div>
                      {selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL' && (
                        <span className="text-[9px] font-black text-amber-800 bg-amber-100/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Terkunci Akun
                        </span>
                      )}
                    </div>
                    <select
                      value={selectedTerminal}
                      disabled={selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL'}
                      onChange={(e) => setSelectedTerminal(e.target.value)}
                      className={`w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg p-1.5 focus:outline-none focus:border-emerald-700 ${
                        selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL'
                          ? 'opacity-85 bg-slate-100/70 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                      title={
                        selectedStaff?.assignedTerminal && selectedStaff.assignedTerminal !== 'ALL'
                          ? `Akun ${selectedStaff.name} telah dikunci oleh Owner khusus untuk ${selectedStaff.assignedTerminal}`
                          : 'Pilih terminal mesin kasir'
                      }
                    >
                      {terminals.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name} • {t.location} ({t.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10.5px] font-medium mb-1">
                      <Warehouse className="w-3.5 h-3.5 text-slate-600" />
                      <span>Lokasi Gudang:</span>
                    </div>
                    <select
                      value={selectedWarehouse}
                      onChange={(e) => setSelectedWarehouse(e.target.value)}
                      className="w-full bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded-lg p-1.5 focus:outline-none focus:border-emerald-700 cursor-pointer"
                    >
                      <option value="WH-01">Toko Depan (WH-01)</option>
                      <option value="WH-02">Gudang Pusat DC (WH-02)</option>
                    </select>
                  </div>
                </div>

                {/* Starting Cash (Modal Awal Kasir) */}
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                  <div className="flex items-center justify-between text-slate-500 text-[10.5px] font-medium mb-1">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Modal Awal Kasir (Buka Shift):</span>
                    </span>
                    <span className="font-mono text-slate-400">Rp</span>
                  </div>
                  <input
                    type="number"
                    step="10000"
                    value={startingCash}
                    onChange={(e) => setStartingCash(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 rounded-lg p-1.5 focus:outline-none focus:border-emerald-700"
                    placeholder="300000"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Uang kembalian yang disiapkan di dalam laci kasir saat buka shift.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Masuk Cepat 1-Klik (Uji Coba Peran):
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition cursor-pointer active:scale-95 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                        {u.name}
                      </span>
                      <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-slate-200 text-slate-500">
                        PIN: {u.pin}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {u.roleTitle.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FAST PIN NUMPAD & PASSWORD FORM (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              
              {/* Method Toggle: Fast PIN vs Password */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('pin');
                      setErrorMessage('');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      authMethod === 'pin'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>PIN Cepat Kasir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('password');
                      setErrorMessage('');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      authMethod === 'password'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Email & Sandi</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Mode Kasir Layar Sentuh
                </span>
              </div>

              {/* Error Alert if any */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* TAB 1: PIN CEPAT KASIR (NUMPAD) */}
              {authMethod === 'pin' ? (
                <div>
                  
                  {/* Staff Profile Selection Pills */}
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Pilih Pengguna / Kasir:
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
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
                          className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-600/20 shadow-2xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs border ${user.avatarBg}`}>
                              {user.name.charAt(0)}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-extrabold text-slate-900 leading-snug">
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

                  {/* PIN Display Dots */}
                  <div className="flex flex-col items-center justify-center py-2 mb-4">
                    <span className="text-xs text-slate-500 font-medium mb-2.5">
                      Masukkan PIN 4-Digit untuk <strong className="text-slate-800">{selectedStaff.name}</strong>
                    </span>

                    <div className="flex items-center gap-3.5">
                      {[0, 1, 2, 3].map((idx) => {
                        const isFilled = pinInput.length > idx;
                        return (
                          <div
                            key={idx}
                            className={`w-4 h-4 rounded-full transition-all duration-150 ${
                              isFilled
                                ? 'bg-emerald-700 scale-125'
                                : 'bg-slate-200 border border-slate-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Tactile Onscreen Numpad for Touchscreen / Mouse */}
                  <div className="max-w-[280px] mx-auto grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleNumpadPress(digit)}
                        className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-900 font-mono font-bold text-lg flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleNumpadClear}
                      className="h-12 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100 border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center transition active:scale-95 cursor-pointer"
                      title="Hapus Semua"
                    >
                      CLEAR
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNumpadPress('0')}
                      className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-900 font-mono font-bold text-lg flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleNumpadDelete}
                      className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer"
                      title="Hapus Satu Digit"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ) : (
                /* TAB 2: EMAIL & PASSWORD FORM */
                <form onSubmit={handlePasswordLogin} className="space-y-4 max-w-md mx-auto pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Alamat Email Staf:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="contoh: kasir@tokopaknoor.com"
                        className="w-full bg-slate-50 text-slate-900 text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Kata Sandi:
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full bg-slate-50 text-slate-900 text-xs font-medium pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10.5px] text-slate-400 mt-1 block">
                      Default password akun demo: <strong>password123</strong>
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-98"
                    >
                      <span>Masuk ke Sistem</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi Sesi Kasir POS Aktif</span>
              </span>
              <span>PIN Default: <strong>1111 (Kasir)</strong> • <strong>1234 (Owner)</strong></span>
            </div>

          </div>

        </div>
      </main>

      {/* Footer System Credits */}
      <footer className="bg-white border-t border-slate-200 py-2.5 px-4 text-center text-xs text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} <strong>Toko Pak Noor</strong> — Sistem Manajemen Point of Sale & Inventori Retail Multi-Terminal v2.0
        </p>
      </footer>

    </div>
  );
}
