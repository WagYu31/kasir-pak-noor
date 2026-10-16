import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Warehouse, 
  Package, 
  BarChart3, 
  Clock, 
  ShieldCheck, 
  Monitor, 
  HelpCircle,
  UserCheck, 
  Users,
  ChevronDown,
  Lock,
  LogOut,
  Settings,
  Receipt
} from 'lucide-react';
import { USER_ROLES } from './UserRoleModal';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  activeTerminal, 
  setActiveTerminal,
  activeWarehouse,
  setActiveWarehouse,
  shiftData,
  onOpenShiftModal,
  onOpenHelpModal,
  currentRole,
  setCurrentRole,
  onOpenUserRoleModal,
  onLogout,
  onOpenAccountManager,
  terminals,
  onOpenTerminalManager
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
  };

  const allNavItems = [
    { id: 'pos', label: 'Kasir POS', hotkey: 'F1', icon: Store },
    { id: 'inventory', label: 'Inventori & Mutasi', hotkey: 'F2', icon: Warehouse },
    { id: 'products', label: 'Master Produk', hotkey: 'F3', icon: Package },
    { id: 'reports', label: 'Laporan & Laba', hotkey: 'F4', icon: BarChart3 },
    { id: 'shift', label: 'Shift Kasir', hotkey: 'F5', icon: UserCheck },
  ];

  const roleObj = USER_ROLES[currentRole] || USER_ROLES.OWNER;
  const allowedNavItems = allNavItems.filter(item => roleObj.allowedTabs.includes(item.id));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 shadow-xs">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Warehouse Status */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs shrink-0 text-white font-bold">
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                TOKO PAK NOOR
                <span className="hidden sm:inline-flex text-[9.5px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Multi-Terminal
                </span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <span className="hidden lg:inline">Sistem POS Retail</span>
              <span className="hidden lg:inline text-slate-300">•</span>
              <span className="text-slate-700 flex items-center gap-1 font-semibold whitespace-nowrap">
                <Warehouse className="w-3 h-3 text-emerald-600" />
                {activeWarehouse === 'WH-01' ? 'Gudang Toko' : 'Gudang Pusat'}
              </span>
            </p>
          </div>
        </div>

        {/* Center: Dynamic Navigation Tabs according to Active User Role */}
        <nav className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar shrink">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'shift') {
                    onOpenShiftModal();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 outline-none whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="text-[11px] sm:text-xs">{item.label}</span>
                <span className={`hidden xl:inline-block kbd-badge ml-1 ${isActive ? 'bg-emerald-700 text-white border-emerald-800' : ''}`}>
                  {item.hotkey}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: User Role Switcher, Terminal, Shift Info, Clock */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Kelola Akun & Kasir Button (HANYA MUNCUL UNTUK OWNER) */}
          {currentRole === 'OWNER' && onOpenAccountManager && (
            <button
              onClick={onOpenAccountManager}
              className="hidden lg:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-800 transition cursor-pointer shadow-2xs"
              title="Kelola Akun Kasir, Staf, & Reset PIN (Wewenang Khusus Owner)"
            >
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Kelola Akun</span>
            </button>
          )}

          {/* Audit Transaksi Kasir Button (HANYA MUNCUL UNTUK OWNER) */}
          {currentRole === 'OWNER' && (
            <button
              onClick={() => setActiveTab('reports')}
              className={`hidden xl:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs ${
                activeTab === 'reports'
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
              }`}
              title="Audit Transaksi Kasir, Jam Transaksi, & Rincian Barang (Khusus Owner)"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-700" />
              <span>Audit Kasir</span>
            </button>
          )}

          {/* Active User Role Switcher Pill */}
          <button
            onClick={currentRole === 'OWNER' ? onOpenAccountManager : onOpenUserRoleModal}
            className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 sm:px-3 py-1 rounded-xl text-left transition shadow-xs group cursor-pointer"
            title={currentRole === 'OWNER' ? "Kelola Akun & Hak Akses (Owner)" : "Lihat Hak Akses Peran"}
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-xs shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                Peran:
              </div>
              <div className="text-[11px] sm:text-xs font-extrabold text-slate-800 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                <span>{roleObj.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
              </div>
            </div>
          </button>

          {/* Terminal Switcher & Hardware Manager */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={onOpenTerminalManager}
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-800 font-bold transition cursor-pointer"
              title="Kelola Mesin Kasir & Perangkat Keras POS"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-700" />
              <span>Terminal:</span>
            </button>
            <select
              value={activeTerminal}
              onChange={(e) => setActiveTerminal(e.target.value)}
              className="bg-transparent text-xs font-bold text-emerald-700 focus:outline-none cursor-pointer pr-1"
            >
              {terminals && terminals.length > 0 ? (
                terminals.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.status})</option>
                ))
              ) : (
                <>
                  <option value="Kasir 1">Kasir 1</option>
                  <option value="Kasir 2">Kasir 2</option>
                  <option value="Kasir 3">Kasir 3</option>
                </>
              )}
            </select>
            {onOpenTerminalManager && (
              <button
                type="button"
                onClick={onOpenTerminalManager}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
                title="Kelola Mesin Kasir & Hardware"
              >
                <Settings className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Active Shift Card */}
          <button 
            onClick={onOpenShiftModal}
            className="hidden lg:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-left transition cursor-pointer"
            title="Klik untuk detail kas kasir"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                {shiftData.cashier}
              </div>
              <div className="text-[9.5px] text-slate-500 font-medium">
                Shift Pagi • Rp {shiftData.startingCash.toLocaleString('id-ID')}
              </div>
            </div>
          </button>

          {/* Live Clock */}
          <div className="hidden 2xl:flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatTime(currentTime)}</span>
          </div>

          {/* Help Modal */}
          <button
            onClick={onOpenHelpModal}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
            title="Pintasan Keyboard (F1 - F12)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Lock Terminal / Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 transition cursor-pointer shadow-2xs group"
              title="Kunci POS / Keluar ke Halaman Login"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-600" />
              <span className="hidden xl:inline text-xs font-bold">Kunci POS</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
