import React from 'react';
import { 
  Palette, 
  Layout, 
  Columns, 
  Sliders, 
  Check, 
  RotateCcw, 
  X, 
  Sparkles, 
  Monitor, 
  PanelLeft, 
  PanelTop, 
  PanelBottom,
  Tablet,
  Smartphone,
  Maximize2, 
  Minimize2,
  Moon,
  Sun,
  LayoutGrid
} from 'lucide-react';
import { useTheme, THEMES } from '../context/ThemeContext';

export default function ThemeSettingsModal({ isOpen, onClose }) {
  const {
    themeId,
    setTheme,
    navLayout,
    setNavLayout,
    cartPosition,
    setCartPosition,
    cardDensity,
    setCardDensity,
    resetToDefaults,
    activeTheme
  } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${activeTheme.gradient} text-white flex items-center justify-center shadow-md`}>
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Kustomisasi Tema & Tata Letak
                <span className="text-[10.5px] px-2 py-0.5 rounded-full font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  21st.dev Customizer
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Pilih dari 12 palet warna toko, 4 gaya navigasi menu, dan tata letak layar kasir yang paling ergonomis.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition active:scale-90 cursor-pointer shadow-2xs"
            title="Tutup [ESC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable Settings Sections) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-7">

          {/* SECTION 1: PILIHAN TEMA WARNA (12 PALET) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-500" />
                <span>1. Tema Warna Aksen Aplikasi (12 Pilihan Palet)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Aktif: <strong className="text-slate-800">{activeTheme.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {Object.values(THEMES).map((th) => {
                const isSelected = themeId === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/90 shadow-md ring-2 ring-slate-900/10 scale-[1.01]'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-4 h-4 rounded-full shadow-inner border border-white"
                          style={{ backgroundColor: th.primaryHex }}
                        />
                        <span 
                          className="w-3 h-3 rounded-full opacity-70"
                          style={{ backgroundColor: th.secondaryHex }}
                        />
                      </div>

                      {th.isDark && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-900 text-slate-200">
                          DARK
                        </span>
                      )}

                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-200 group-hover:border-slate-300" />
                      )}
                    </div>

                    <div className="font-extrabold text-xs text-slate-900 truncate">
                      {th.name}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
                      {th.description}
                    </p>

                    {/* Gradient strip preview */}
                    <div className={`mt-2.5 h-1.5 w-full rounded-full bg-gradient-to-r ${th.gradient}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: GAYA NAVIGASI (4 GAYA NAVIGASI) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                <Layout className="w-4 h-4 text-slate-500" />
                <span>2. Gaya Navigasi Menu (4 Mode Tampilan)</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Pilih tata letak bilah navigasi menu utama
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Option 1: Topbar Header */}
              <button
                type="button"
                onClick={() => setNavLayout('topbar')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  navLayout === 'topbar'
                    ? 'border-slate-900 bg-slate-50/90 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <PanelTop className="w-4 h-4 text-slate-700" />
                    <span className="font-extrabold text-xs text-slate-900">Bilah Horizontal Atas (Header Klasik)</span>
                  </div>
                  {navLayout === 'topbar' ? (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      Standar POS
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-normal mb-3">
                  Menu tab horizontal di bagian atas layar. Standar ritel minimarket, sangat cepat dan hemat ruang samping.
                </p>

                {/* Wireframe Mockup */}
                <div className="w-full h-14 rounded-xl bg-slate-100 border border-slate-200 p-1 flex flex-col gap-1 shadow-inner">
                  <div className="h-3.5 w-full bg-slate-300 rounded flex items-center px-1.5 gap-1.5">
                    <div className="h-1.5 w-5 bg-emerald-500 rounded" />
                    <div className="h-1.5 w-8 bg-slate-400 rounded" />
                    <div className="h-1.5 w-8 bg-slate-400 rounded" />
                    <div className="h-1.5 w-8 bg-slate-400 rounded" />
                  </div>
                  <div className="flex-1 bg-white rounded border border-slate-200 flex gap-1 p-1">
                    <div className="w-1/3 bg-emerald-50 border border-emerald-200/50 rounded flex items-center justify-center text-[7px] font-bold text-emerald-700">Nota Kasir</div>
                    <div className="w-2/3 bg-slate-100 rounded flex items-center justify-center text-[7px] text-slate-400">Katalog Produk</div>
                  </div>
                </div>
              </button>

              {/* Option 2: Sidebar Modern */}
              <button
                type="button"
                onClick={() => setNavLayout('sidebar')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  navLayout === 'sidebar'
                    ? 'border-slate-900 bg-slate-50/90 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <PanelLeft className="w-4 h-4 text-slate-700" />
                    <span className="font-extrabold text-xs text-slate-900">Sidebar Vertikal Modern</span>
                  </div>
                  {navLayout === 'sidebar' ? (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      Enterprise
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-normal mb-3">
                  Bilah menu di samping kiri bergaya dashboard enterprise modern. Menu lengkap, rapi & dapat diciutkan.
                </p>

                {/* Wireframe Mockup */}
                <div className="w-full h-14 rounded-xl bg-slate-100 border border-slate-200 p-1 flex gap-1 shadow-inner">
                  <div className="w-14 bg-slate-300 rounded flex flex-col gap-1 p-1">
                    <div className="h-1.5 w-full bg-emerald-500 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-400 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-400 rounded" />
                    <div className="h-1.5 w-3/4 bg-slate-400 rounded" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="h-2.5 w-full bg-white rounded border border-slate-200" />
                    <div className="flex-1 bg-white rounded border border-slate-200 flex gap-1 p-0.5">
                      <div className="w-1/3 bg-emerald-50 rounded" />
                      <div className="w-2/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 3: Compact Rail (Icon Only) */}
              <button
                type="button"
                onClick={() => setNavLayout('rail')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  navLayout === 'rail'
                    ? 'border-slate-900 bg-slate-50/90 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-slate-700" />
                    <span className="font-extrabold text-xs text-slate-900">Bilah Ramping Ikon Saja (Compact Rail)</span>
                  </div>
                  {navLayout === 'rail' ? (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      Ultra-Hemat Layar
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-normal mb-3">
                  Bilah navigasi ikon ramping 68px di sisi kiri. Memberikan 95% ruang layar lega untuk kasir & katalog produk.
                </p>

                {/* Wireframe Mockup */}
                <div className="w-full h-14 rounded-xl bg-slate-100 border border-slate-200 p-1 flex gap-1 shadow-inner">
                  <div className="w-5 bg-slate-300 rounded flex flex-col items-center gap-1 py-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="h-2.5 w-full bg-white rounded border border-slate-200" />
                    <div className="flex-1 bg-white rounded border border-slate-200 flex gap-1 p-0.5">
                      <div className="w-1/3 bg-emerald-50 rounded" />
                      <div className="w-2/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </button>

              {/* Option 4: Floating Bottom Dock */}
              <button
                type="button"
                onClick={() => setNavLayout('dock')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  navLayout === 'dock'
                    ? 'border-slate-900 bg-slate-50/90 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Tablet className="w-4 h-4 text-slate-700" />
                    <span className="font-extrabold text-xs text-slate-900">Dock Bawah Melayang (Floating Dock / Tablet)</span>
                  </div>
                  {navLayout === 'dock' ? (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                      Modern & Tablet
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-normal mb-3">
                  Menu kapsul melayang di bagian bawah layar ala iPad & macOS. Sangat ergonomis dan nyaman untuk layar sentuh / POS modern.
                </p>

                {/* Wireframe Mockup */}
                <div className="w-full h-14 rounded-xl bg-slate-100 border border-slate-200 p-1 flex flex-col justify-between relative shadow-inner">
                  <div className="h-2.5 w-full bg-white rounded border border-slate-200" />
                  <div className="h-6 w-full bg-white rounded border border-slate-200 flex gap-1 p-0.5">
                    <div className="w-1/3 bg-emerald-50 rounded" />
                    <div className="w-2/3 bg-slate-100 rounded" />
                  </div>
                  {/* Floating Dock Capsule in Mockup */}
                  <div className="w-24 h-3 bg-slate-900 rounded-full mx-auto flex items-center justify-center gap-1 shadow-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* SECTION 3: TATA LETAK KASIR POS (POS CART POSITION) */}
          <div>
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2 mb-3">
              <Columns className="w-4 h-4 text-slate-500" />
              <span>3. Posisi Keranjang Belanja Kasir</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cart on Left */}
              <button
                type="button"
                onClick={() => setCartPosition('left')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  cartPosition === 'left'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-slate-900">Keranjang KIRI, Katalog KANAN</span>
                  {cartPosition === 'left' && (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500 mb-2">
                  Standar POS minimarket Indonesia. Kasir fokus nota di sebelah kiri.
                </p>
                <div className="h-8 w-full rounded-lg bg-slate-100 border border-slate-200 p-1 flex gap-1">
                  <div className="w-5/12 bg-emerald-500/30 border border-emerald-400/50 rounded flex items-center justify-center text-[8px] font-bold text-emerald-800">
                    Kasir (Nota)
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold">
                    Katalog Produk
                  </div>
                </div>
              </button>

              {/* Cart on Right */}
              <button
                type="button"
                onClick={() => setCartPosition('right')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  cartPosition === 'right'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-extrabold text-xs text-slate-900">Katalog KIRI, Keranjang KANAN</span>
                  {cartPosition === 'right' && (
                    <span className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500 mb-2">
                  Gaya tablet iPad / Square POS modern. Mudah bagi kasir tangan kanan.
                </p>
                <div className="h-8 w-full rounded-lg bg-slate-100 border border-slate-200 p-1 flex gap-1">
                  <div className="flex-1 bg-white border border-slate-200 rounded flex items-center justify-center text-[8px] text-slate-400 font-bold">
                    Katalog Produk
                  </div>
                  <div className="w-5/12 bg-emerald-500/30 border border-emerald-400/50 rounded flex items-center justify-center text-[8px] font-bold text-emerald-800">
                    Kasir (Nota)
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 4: KERAPATAN KARTU (CARD DENSITY) */}
          <div>
            <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2 mb-3">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>4. Kerapatan Kartu Produk (Grid Density)</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCardDensity('comfortable')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  cardDensity === 'comfortable'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-slate-900">Nyaman (Standard)</span>
                  {cardDensity === 'comfortable' && (
                    <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Gambar besar, tombol lega & mudah ditekan pada layar sentuh.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCardDensity('compact')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  cardDensity === 'compact'
                    ? 'border-slate-900 bg-slate-50/80 shadow-md ring-2 ring-slate-900/10'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-slate-900">Kompak & Padat</span>
                  {cardDensity === 'compact' && (
                    <Check className="w-3.5 h-3.5 text-slate-900 stroke-[3]" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-500">
                  Kartu lebih ringkas agar memuat lebih banyak barang tanpa scroll.
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
            title="Kembalikan ke pengaturan standar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standar</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl bg-gradient-to-r ${activeTheme.gradient} text-white font-extrabold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer`}
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Terapkan & Simpan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
