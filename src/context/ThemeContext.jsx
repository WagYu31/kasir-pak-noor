import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Pak Noor',
    description: 'Warna hijau retail toko segar khas Toko Pak Noor',
    primaryHex: '#059669',
    secondaryHex: '#14b8a6',
    gradient: 'from-emerald-600 via-emerald-600 to-teal-500',
    gradientHover: 'hover:from-emerald-500 hover:to-teal-400',
    primaryBg: 'bg-emerald-600',
    primaryText: 'text-emerald-700',
    accentBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderFocus: 'focus:border-emerald-600 focus:ring-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.4)',
    iconColor: 'text-emerald-600',
  },
  blue: {
    id: 'blue',
    name: 'Sapphire Enterprise',
    description: 'Nuansa biru modern korporat & enterprise POS',
    primaryHex: '#2563eb',
    secondaryHex: '#4f46e5',
    gradient: 'from-blue-600 via-blue-600 to-indigo-600',
    gradientHover: 'hover:from-blue-500 hover:to-indigo-500',
    primaryBg: 'bg-blue-600',
    primaryText: 'text-blue-700',
    accentBadge: 'bg-blue-50 text-blue-800 border-blue-200',
    borderFocus: 'focus:border-blue-600 focus:ring-blue-500/20',
    glow: 'rgba(37, 99, 235, 0.4)',
    iconColor: 'text-blue-600',
  },
  purple: {
    id: 'purple',
    name: 'Cyber Violet',
    description: 'Nuansa ungu royal premium ala butik modern',
    primaryHex: '#7c3aed',
    secondaryHex: '#9333ea',
    gradient: 'from-purple-600 via-purple-600 to-indigo-600',
    gradientHover: 'hover:from-purple-500 hover:to-indigo-500',
    primaryBg: 'bg-purple-600',
    primaryText: 'text-purple-700',
    accentBadge: 'bg-purple-50 text-purple-800 border-purple-200',
    borderFocus: 'focus:border-purple-600 focus:ring-purple-500/20',
    glow: 'rgba(124, 58, 237, 0.4)',
    iconColor: 'text-purple-600',
  },
  amber: {
    id: 'amber',
    name: 'Sunset Amber',
    description: 'Warna oranye hangat & energik minimarket',
    primaryHex: '#d97706',
    secondaryHex: '#ea580c',
    gradient: 'from-amber-500 via-amber-600 to-orange-500',
    gradientHover: 'hover:from-amber-400 hover:to-orange-400',
    primaryBg: 'bg-amber-600',
    primaryText: 'text-amber-700',
    accentBadge: 'bg-amber-50 text-amber-800 border-amber-200',
    borderFocus: 'focus:border-amber-600 focus:ring-amber-500/20',
    glow: 'rgba(217, 119, 6, 0.4)',
    iconColor: 'text-amber-600',
  },
  rose: {
    id: 'rose',
    name: 'Ruby Crimson',
    description: 'Warna merah bold tegas supermarket modern',
    primaryHex: '#e11d48',
    secondaryHex: '#dc2626',
    gradient: 'from-rose-600 via-rose-600 to-red-600',
    gradientHover: 'hover:from-rose-500 hover:to-red-500',
    primaryBg: 'bg-rose-600',
    primaryText: 'text-rose-700',
    accentBadge: 'bg-rose-50 text-rose-800 border-rose-200',
    borderFocus: 'focus:border-rose-600 focus:ring-rose-500/20',
    glow: 'rgba(225, 29, 72, 0.4)',
    iconColor: 'text-rose-600',
  },
  dark: {
    id: 'dark',
    name: 'Midnight Dark (Shift Malam)',
    description: 'Mode gelap kontras tinggi anti silau & mata tidak lelah',
    isDark: true,
    primaryHex: '#10b981',
    secondaryHex: '#06b6d4',
    gradient: 'from-slate-800 via-slate-900 to-slate-950',
    gradientHover: 'hover:from-slate-700 hover:to-slate-900',
    primaryBg: 'bg-slate-800',
    primaryText: 'text-emerald-400',
    accentBadge: 'bg-slate-800 text-emerald-400 border-slate-700',
    borderFocus: 'focus:border-emerald-500 focus:ring-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.5)',
    iconColor: 'text-emerald-400',
  }
};

const STORAGE_KEY = 'pos_pak_noor_preferences_v1';

const DEFAULT_PREFERENCES = {
  theme: 'emerald',
  navLayout: 'topbar', // 'topbar' or 'sidebar'
  cartPosition: 'left', // 'left' or 'right'
  cardDensity: 'comfortable', // 'comfortable' or 'compact'
  sidebarCollapsed: false,
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PREFERENCES;
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Could not save theme preferences to localStorage', e);
    }
  }, [preferences]);

  // Apply dark mode class to document if dark theme
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  const updatePreference = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const setTheme = (themeId) => updatePreference('theme', themeId);
  const setNavLayout = (layout) => updatePreference('navLayout', layout);
  const setCartPosition = (pos) => updatePreference('cartPosition', pos);
  const setCardDensity = (density) => updatePreference('cardDensity', density);
  const toggleSidebar = () => updatePreference('sidebarCollapsed', !preferences.sidebarCollapsed);
  
  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const activeTheme = THEMES[preferences.theme] || THEMES.emerald;

  return (
    <ThemeContext.Provider value={{
      preferences,
      activeTheme,
      themeId: preferences.theme,
      navLayout: preferences.navLayout,
      cartPosition: preferences.cartPosition,
      cardDensity: preferences.cardDensity,
      sidebarCollapsed: preferences.sidebarCollapsed,
      setTheme,
      setNavLayout,
      setCartPosition,
      setCardDensity,
      toggleSidebar,
      resetToDefaults,
      isThemeModalOpen,
      setIsThemeModalOpen,
      openThemeModal: () => setIsThemeModalOpen(true),
      closeThemeModal: () => setIsThemeModalOpen(false)
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
