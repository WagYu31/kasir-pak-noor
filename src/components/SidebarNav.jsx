import React from 'react';
import { 
  Store, 
  Warehouse, 
  Package, 
  BarChart3, 
  UserCheck, 
  Users, 
  Settings, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  ShieldCheck, 
  HelpCircle,
  Palette,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { USER_ROLES } from './UserRoleModal';
import { useTheme } from '../context/ThemeContext';

export default function SidebarNav({
  activeTab,
  setActiveTab,
  activeTerminal,
  setActiveTerminal,
  terminals,
  onOpenTerminalManager,
  activeWarehouse,
  setActiveWarehouse,
  shiftData,
  onOpenShiftModal,
  onOpenHelpModal,
  currentRole,
  onOpenUserRoleModal,
  onOpenAccountManager,
  onLogout,
  isMobileOpen = false,
  onCloseMobile
}) {
  const { 
    activeTheme, 
    navLayout,
    setNavLayout,
    sidebarCollapsed, 
    toggleSidebar, 
    openThemeModal 
  } = useTheme();

  const isRail = navLayout === 'rail';
  const isCollapsed = isRail || sidebarCollapsed;

  const roleObj = USER_ROLES[currentRole] || USER_ROLES.OWNER;

  const navItems = [
    { id: 'pos', label: 'Kasir POS', hotkey: 'F1', icon: Store },
    { id: 'inventory', label: 'Inventori & Mutasi', hotkey: 'F2', icon: Warehouse },
    { id: 'products', label: 'Master Produk', hotkey: 'F3', icon: Package },
    { id: 'reports', label: 'Laporan & Laba', hotkey: 'F4', icon: BarChart3 },
    { id: 'shift', label: 'Shift Kasir', hotkey: 'F5', icon: UserCheck },
  ].filter(item => roleObj.allowedTabs.includes(item.id));

  const handleNavClick = (id) => {
    if (id === 'shift') {
      onOpenShiftModal();
    } else {
      setActiveTab(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  const handleToggleExpand = () => {
    if (isRail) {
      setNavLayout('sidebar');
    } else {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay (< 1024px) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      <aside 
        className={`bg-white border-r border-slate-200/90 flex flex-col justify-between transition-all duration-300 select-none shadow-2xl lg:shadow-xs z-50
          fixed inset-y-0 left-0 lg:static lg:z-40 h-full max-h-screen shrink-0 overflow-hidden
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}
        `}
      >
        {/* Top Section: Logo & Toggle Button */}
        <div className={`shrink-0 border-b border-slate-100 flex items-center transition-all ${
          isCollapsed && !isMobileOpen 
            ? 'flex-col gap-2 py-3 px-2 justify-center' 
            : 'p-3 justify-between'
        }`}>
          <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed && !isMobileOpen ? 'justify-center' : ''}`}>
            <button 
              type="button"
              onClick={() => { if (isCollapsed) handleToggleExpand(); }}
              className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeTheme.gradient} text-white flex items-center justify-center shadow-sm shrink-0 font-bold transition active:scale-95 ${
                isCollapsed ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              }`}
              title={isCollapsed ? "Klik untuk memperluas sidebar" : "Toko Pak Noor - POS Retail"}
            >
              <Store className="w-5 h-5" />
            </button>

            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1 animate-fade-in">
                <h1 className="text-xs font-black text-slate-900 tracking-tight leading-none truncate">
                  TOKO PAK NOOR
                </h1>
                <p className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Multi-Terminal POS</span>
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close Button (< 1024px) */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-90 cursor-pointer shrink-0"
            title="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={handleToggleExpand}
            className={`hidden lg:flex rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 items-center justify-center transition active:scale-90 cursor-pointer shrink-0 shadow-2xs ${
              isCollapsed ? 'w-8 h-8 mt-0.5' : 'w-7 h-7'
            }`}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

      {/* Middle Section: Warehouse & Main Navigation Menu */}
      <div className={`flex-1 min-h-0 overflow-y-auto space-y-2.5 ${isCollapsed && !isMobileOpen ? 'p-2' : 'p-2.5'}`}>
        
        {/* Active Warehouse Tag */}
        {!isCollapsed || isMobileOpen ? (
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1.5">
              <Warehouse className="w-3.5 h-3.5 text-slate-400" />
              <span>Gudang:</span>
            </span>
            <span className="font-extrabold text-slate-800 text-[11px]">
              {activeWarehouse === 'WH-01' ? 'Toko (Depan)' : 'Pusat (DC)'}
            </span>
          </div>
        ) : (
          <div className="flex justify-center group relative" title={`Gudang: ${activeWarehouse === 'WH-01' ? 'Toko (Depan)' : 'Pusat (DC)'}`}>
            <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs">
              <Warehouse className="w-4 h-4" />
            </span>
            <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 translate-x-1 group-hover:translate-x-0">
              <span>Gudang: {activeWarehouse === 'WH-01' ? 'Toko (Depan)' : 'Pusat (DC)'}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1 flex flex-col items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center transition-all cursor-pointer relative group ${
                  isCollapsed && !isMobileOpen
                    ? `w-11 h-11 justify-center rounded-xl ${
                        isActive
                          ? `bg-gradient-to-tr ${activeTheme.gradient} text-white shadow-md active:scale-95`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
                      }`
                    : `w-full gap-3 py-2 px-2.5 rounded-xl font-bold text-xs ${
                        isActive
                          ? `bg-gradient-to-r ${activeTheme.gradient} text-white shadow-sm`
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                }`}
                title={isCollapsed && !isMobileOpen ? `${item.label} [${item.hotkey}]` : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                
                {(!isCollapsed || isMobileOpen) && (
                  <span className="flex-1 text-left truncate font-bold text-xs">
                    {item.label}
                  </span>
                )}

                {(!isCollapsed || isMobileOpen) && (
                  <kbd className={`kbd-badge text-[9px] ${
                    isActive ? 'bg-white/20 text-white border-transparent' : ''
                  }`}>
                    {item.hotkey}
                  </kbd>
                )}

                {/* Floating Modern Hover Tooltip in Collapsed Rail Mode */}
                {isCollapsed && !isMobileOpen && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-white/10 px-1 py-0.2 rounded">
                      {item.hotkey}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <hr className="border-slate-100 my-1" />

        {/* Special Management Shortcuts */}
        <div className="space-y-1 flex flex-col items-center">
          {/* Theme & Customizer Button */}
          <button
            type="button"
            onClick={() => {
              openThemeModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex items-center transition-all cursor-pointer relative group ${
              isCollapsed && !isMobileOpen
                ? 'w-11 h-11 justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
                : 'w-full gap-3 py-2 px-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isCollapsed && !isMobileOpen ? 'Ganti Tema / Layout' : undefined}
          >
            <div className="relative flex items-center justify-center">
              <Palette className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
              <span 
                className="w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-white"
                style={{ backgroundColor: activeTheme.primaryHex }}
              />
            </div>
            {(!isCollapsed || isMobileOpen) && <span className="font-bold text-xs">Ganti Tema / Layout</span>}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                <span>Ganti Tema / Layout</span>
              </div>
            )}
          </button>

          {/* Kelola Akun (Owner Only) */}
          {currentRole === 'OWNER' && onOpenAccountManager && (
            <button
              type="button"
              onClick={() => {
                onOpenAccountManager();
                if (onCloseMobile) onCloseMobile();
              }}
              className={`flex items-center transition-all cursor-pointer relative group ${
                isCollapsed && !isMobileOpen
                  ? 'w-11 h-11 justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
                  : 'w-full gap-3 p-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isCollapsed && !isMobileOpen ? 'Kelola Akun Kasir & PIN' : undefined}
            >
              <Users className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
              {(!isCollapsed || isMobileOpen) && <span className="font-bold text-xs">Kelola Akun</span>}

              {isCollapsed && !isMobileOpen && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                  <span>Kelola Akun Kasir</span>
                </div>
              )}
            </button>
          )}

          {/* Bantuan Pintasan [?] */}
          <button
            type="button"
            onClick={() => {
              onOpenHelpModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`flex items-center transition-all cursor-pointer relative group ${
              isCollapsed && !isMobileOpen
                ? 'w-11 h-11 justify-center rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
                : 'w-full gap-3 p-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title={isCollapsed && !isMobileOpen ? 'Bantuan Pintasan' : undefined}
          >
            <HelpCircle className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
            {(!isCollapsed || isMobileOpen) && <span className="font-bold text-xs">Bantuan Pintasan</span>}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                <span>Bantuan Pintasan</span>
              </div>
            )}
          </button>
        </div>

      </div>

      {/* Bottom Section: Active Cashier & Terminal Status */}
      <div className={`shrink-0 border-t border-slate-100 bg-slate-50/70 transition-all ${
        isCollapsed && !isMobileOpen
          ? 'p-2 flex flex-col items-center gap-2'
          : 'p-2.5 space-y-2'
      }`}>
        
        {/* Terminal Pill */}
        <button
          type="button"
          onClick={() => {
            onOpenTerminalManager();
            if (onCloseMobile) onCloseMobile();
          }}
          className={`transition cursor-pointer shadow-2xs group relative ${
            isCollapsed && !isMobileOpen
              ? 'w-10 h-10 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 flex items-center justify-center active:scale-95'
              : 'w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left'
          }`}
          title={isCollapsed && !isMobileOpen ? `${activeTerminal} (ONLINE) • Kelola Terminal` : "Kelola & Tambah Mesin Kasir / Hardware POS"}
        >
          {isCollapsed && !isMobileOpen ? (
            <>
              <Monitor className="w-4 h-4 text-slate-600 group-hover:text-slate-900" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -top-0.5 -right-0.5 animate-pulse" />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                <span>{activeTerminal} (ONLINE)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-extrabold text-[11px] text-slate-800 truncate">
                  {activeTerminal} (ONLINE)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/90 px-1.5 py-0.5 rounded-lg group-hover:bg-emerald-100 transition">
                <Settings className="w-3 h-3 text-emerald-600" />
                <span>Kelola</span>
              </div>
            </>
          )}
        </button>

        {/* User Role Card & Logout */}
        <div className={`flex items-center transition-all ${
          isCollapsed && !isMobileOpen 
            ? 'flex-col gap-2' 
            : 'justify-between gap-1.5'
        }`}>
          <button
            type="button"
            onClick={() => {
              onOpenUserRoleModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className={`transition cursor-pointer group relative ${
              isCollapsed && !isMobileOpen
                ? 'w-10 h-10 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-extrabold text-xs flex items-center justify-center shadow-2xs active:scale-95'
                : 'flex-1 flex items-center gap-2 p-1.5 rounded-xl hover:bg-white text-left min-w-0'
            }`}
            title={isCollapsed && !isMobileOpen ? `${roleObj.name} (${shiftData.cashier})` : "Ganti Peran Hak Akses (RBAC)"}
          >
            <div className={`rounded-lg bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center shrink-0 ${
              isCollapsed && !isMobileOpen ? 'w-full h-full text-sm' : 'w-7 h-7 text-xs'
            }`}>
              {roleObj.name[0]}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-[11px] text-slate-900 truncate">
                  {roleObj.name}
                </div>
                <div className="text-[9.5px] text-slate-400 truncate">
                  {shiftData.cashier}
                </div>
              </div>
            )}

            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                <span>{roleObj.name} • {shiftData.cashier}</span>
              </div>
            )}
          </button>

          {/* Lock POS Button */}
          <button
            type="button"
            onClick={onLogout}
            className={`rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-2xs shrink-0 group relative ${
              isCollapsed && !isMobileOpen ? 'w-10 h-10' : 'w-8 h-8'
            }`}
            title="Kunci POS / Ganti Kasir"
          >
            <Lock className="w-4 h-4" />
            {isCollapsed && !isMobileOpen && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 z-50 flex items-center gap-1.5 translate-x-1 group-hover:translate-x-0">
                <span>Kunci Kasir</span>
              </div>
            )}
          </button>
        </div>

      </div>

    </aside>
    </>
  );
}
