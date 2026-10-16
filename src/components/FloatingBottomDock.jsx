import React from 'react';
import { 
  Store, 
  Warehouse, 
  Package, 
  BarChart3, 
  UserCheck, 
  Palette, 
  Lock, 
  Monitor,
  Settings,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { USER_ROLES } from './UserRoleModal';

export default function FloatingBottomDock({
  activeTab,
  setActiveTab,
  currentRole,
  onLogout,
  onOpenHelpModal,
  onOpenTerminalManager,
  activeTerminal
}) {
  const { activeTheme, openThemeModal } = useTheme();
  const roleObj = USER_ROLES[currentRole] || USER_ROLES.OWNER;

  const navItems = [
    { id: 'pos', label: 'Kasir POS', hotkey: 'F1', icon: Store },
    { id: 'inventory', label: 'Inventori', hotkey: 'F2', icon: Warehouse },
    { id: 'products', label: 'Master Produk', hotkey: 'F3', icon: Package },
    { id: 'reports', label: 'Laporan & Laba', hotkey: 'F4', icon: BarChart3 },
    { id: 'shift', label: 'Shift Kasir', hotkey: 'F5', icon: UserCheck },
  ].filter(item => roleObj.allowedTabs.includes(item.id));

  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 select-none animate-bounce-subtle">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-2xl px-2 py-1.5 flex items-center gap-1.5 ring-1 ring-black/5">
        
        {/* Main Navigation Items */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`relative px-3 py-2 rounded-xl flex items-center gap-2 font-bold text-xs transition-all duration-200 cursor-pointer group ${
                isActive
                  ? `bg-gradient-to-r ${activeTheme.gradient} text-white shadow-md shadow-emerald-600/25 scale-[1.03]`
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-105'
              }`}
              title={`${item.label} [${item.hotkey}]`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline font-bold whitespace-nowrap">{item.label}</span>
              <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                isActive ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {item.hotkey}
              </span>
            </button>
          );
        })}

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-0.5" />

        {/* Quick Tools in Dock */}
        <button
          type="button"
          onClick={openThemeModal}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105 cursor-pointer relative group"
          title="Kustomisasi Tema & Layout"
        >
          <Palette className="w-4 h-4 text-emerald-600" />
          <span className="sr-only">Tema & Layout</span>
        </button>

        {onOpenTerminalManager && (
          <button
            type="button"
            onClick={onOpenTerminalManager}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105 cursor-pointer"
            title={`Mesin Kasir: ${activeTerminal}`}
          >
            <Monitor className="w-4 h-4 text-slate-500" />
            <span className="sr-only">Terminal</span>
          </button>
        )}

        {onOpenHelpModal && (
          <button
            type="button"
            onClick={onOpenHelpModal}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition hover:scale-105 cursor-pointer"
            title="Bantuan Pintasan Keyboard"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span className="sr-only">Bantuan</span>
          </button>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition hover:scale-105 cursor-pointer"
          title="Kunci Kasir"
        >
          <Lock className="w-4 h-4" />
          <span className="sr-only">Kunci Kasir</span>
        </button>

      </div>
    </div>
  );
}
