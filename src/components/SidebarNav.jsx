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
  Sparkles
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
  onLogout
}) {
  const { 
    activeTheme, 
    navLayout,
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

  return (
    <aside 
      className={`bg-white border-r border-slate-200/90 flex flex-col justify-between transition-all duration-300 z-40 shrink-0 select-none shadow-xs ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Section: Logo & Toggle Button */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeTheme.gradient} text-white flex items-center justify-center shadow-sm shrink-0 font-bold`}>
            <Store className="w-5 h-5" />
          </div>

          {!isCollapsed && (
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

        {/* Collapse / Expand Toggle Button (Hidden in Rail mode) */}
        {!isRail && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition active:scale-90 cursor-pointer shrink-0"
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Middle Section: Warehouse & Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
        
        {/* Active Warehouse Tag */}
        {!isCollapsed ? (
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
          <div className="flex justify-center" title={`Gudang: ${activeWarehouse === 'WH-01' ? 'Toko (Depan)' : 'Pusat (DC)'}`}>
            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Warehouse className="w-4 h-4" />
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'shift') {
                    onOpenShiftModal();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer relative group ${
                  isActive
                    ? `bg-gradient-to-r ${activeTheme.gradient} text-white shadow-sm`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={isCollapsed ? `${item.label} [${item.hotkey}]` : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                
                {!isCollapsed && (
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                )}

                {!isCollapsed && (
                  <kbd className={`kbd-badge text-[9px] ${
                    isActive ? 'bg-black/20 text-white border-transparent' : ''
                  }`}>
                    {item.hotkey}
                  </kbd>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <hr className="border-slate-100" />

        {/* Special Management Shortcuts */}
        <div className="space-y-1">
          {/* Theme & Customizer Button */}
          <button
            type="button"
            onClick={openThemeModal}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Kustomisasi Tema Warna & Layout"
          >
            <div className="relative">
              <Palette className="w-4 h-4 text-slate-600" />
              <span 
                className="w-1.5 h-1.5 rounded-full absolute -top-0.5 -right-0.5"
                style={{ backgroundColor: activeTheme.primaryHex }}
              />
            </div>
            {!isCollapsed && <span>Ganti Tema / Layout</span>}
          </button>

          {/* Kelola Akun (Owner Only) */}
          {currentRole === 'OWNER' && onOpenAccountManager && (
            <button
              type="button"
              onClick={onOpenAccountManager}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              title="Kelola Akun Kasir & PIN"
            >
              <Users className="w-4 h-4 text-slate-600" />
              {!isCollapsed && <span>Kelola Akun</span>}
            </button>
          )}

          {/* Bantuan Pintasan [?] */}
          <button
            type="button"
            onClick={onOpenHelpModal}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            title="Daftar Pintasan Keyboard & Bantuan"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
            {!isCollapsed && <span>Bantuan Pintasan</span>}
          </button>
        </div>

      </div>

      {/* Bottom Section: Active Cashier & Terminal Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2">
        
        {/* Terminal Pill */}
        <button
          type="button"
          onClick={onOpenTerminalManager}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-left transition cursor-pointer shadow-2xs group"
          title="Kelola & Tambah Mesin Kasir / Hardware POS"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {!isCollapsed && (
              <span className="font-extrabold text-[11px] text-slate-800 truncate">
                {activeTerminal} (ONLINE)
              </span>
            )}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/90 px-1.5 py-0.5 rounded-lg group-hover:bg-emerald-100 transition">
              <Settings className="w-3 h-3 text-emerald-600" />
              <span>Kelola</span>
            </div>
          )}
        </button>

        {/* User Role Card & Logout */}
        <div className="flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={onOpenUserRoleModal}
            className="flex-1 flex items-center gap-2 p-1.5 rounded-xl hover:bg-white transition cursor-pointer text-left min-w-0"
            title="Ganti Peran Hak Akses (RBAC)"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
              {roleObj.name[0]}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-[11px] text-slate-900 truncate">
                  {roleObj.name}
                </div>
                <div className="text-[9.5px] text-slate-400 truncate">
                  {shiftData.cashier}
                </div>
              </div>
            )}
          </button>

          {/* Lock POS Button */}
          <button
            type="button"
            onClick={onLogout}
            className="w-8 h-8 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-2xs shrink-0"
            title="Kunci POS / Ganti Kasir"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </aside>
  );
}
