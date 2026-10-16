import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Split, 
  UserCheck, 
  ShoppingBag, 
  RotateCcw, 
  Camera, 
  ArrowRight, 
  Layers, 
  X,
  Package,
  Users,
  DollarSign,
  Printer,
  Sparkles,
  Utensils,
  Coffee,
  Heart,
  Flame,
  Zap
} from 'lucide-react';
import UploadProductImageModal from './UploadProductImageModal';
import { useTheme } from '../context/ThemeContext';

// High-fidelity fallback mapping to local authentic product packaging images
const DEFAULT_PRODUCT_IMAGES = {
  'PRD-001': '/products/sania.jpg',
  'PRD-002': '/products/indomie.jpg',
  'PRD-003': '/products/beras.jpg',
  'PRD-004': '/products/gulaku.jpg',
  'PRD-005': '/products/le_minerale.jpg',
  'PRD-006': '/products/kapal_api.jpg',
  'PRD-007': '/products/rinso.jpg',
  'PRD-008': '/products/ultra_milk.jpg',
  'PRD-009': '/products/dancow.jpg',
  'PRD-010': '/products/sampoerna.jpg',
};

// 21st.dev Distinct Category Styling Dictionary (High-Contrast, Anti-Ngantuk)
const CATEGORY_CONFIG = {
  'Semua': {
    badge: 'bg-slate-100 text-slate-800 border-slate-200/80',
    activeTab: 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md shadow-slate-900/25',
    accentBorder: 'hover:border-slate-300',
    glow: 'from-slate-500/10 via-transparent to-transparent',
    icon: Layers,
    dot: 'bg-slate-500',
  },
  'Sembako': {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30',
    accentBorder: 'hover:border-emerald-400 group-hover:shadow-emerald-500/10',
    glow: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    icon: ShoppingBag,
    dot: 'bg-emerald-500',
  },
  'Makanan Instan': {
    badge: 'bg-amber-50 text-amber-800 border-amber-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white shadow-md shadow-amber-500/30',
    accentBorder: 'hover:border-amber-400 group-hover:shadow-amber-500/10',
    glow: 'from-amber-500/15 via-orange-500/5 to-transparent',
    icon: Utensils,
    dot: 'bg-amber-500',
  },
  'Minuman': {
    badge: 'bg-sky-50 text-sky-800 border-sky-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/30',
    accentBorder: 'hover:border-sky-400 group-hover:shadow-sky-500/10',
    glow: 'from-sky-500/15 via-blue-500/5 to-transparent',
    icon: Coffee,
    dot: 'bg-sky-500',
  },
  'Perawatan Rumah': {
    badge: 'bg-purple-50 text-purple-800 border-purple-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30',
    accentBorder: 'hover:border-purple-400 group-hover:shadow-purple-500/10',
    glow: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    icon: Sparkles,
    dot: 'bg-purple-500',
  },
  'Susu & Bayi': {
    badge: 'bg-blue-50 text-blue-800 border-blue-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-600/30',
    accentBorder: 'hover:border-indigo-400 group-hover:shadow-indigo-500/10',
    glow: 'from-blue-500/15 via-indigo-500/5 to-transparent',
    icon: Heart,
    dot: 'bg-blue-500',
  },
  'Rokok & Tembakau': {
    badge: 'bg-rose-50 text-rose-800 border-rose-200/90 font-bold',
    activeTab: 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 text-white shadow-md shadow-rose-600/30',
    accentBorder: 'hover:border-rose-400 group-hover:shadow-rose-500/10',
    glow: 'from-rose-500/15 via-red-500/5 to-transparent',
    icon: Flame,
    dot: 'bg-rose-500',
  }
};

export default function TouchscreenPOSView({
  products,
  setProducts,
  activeWarehouse,
  cart,
  addItemToCart,
  updateRowQty,
  removeRow,
  clearCart,
  priceTier,
  setPriceTier,
  activeQueue,
  setActiveQueue,
  cartQueue,
  activeMember,
  setActiveMember,
  onOpenSplitBill,
  onCheckout,
  totalAmount,
  totalItems,
  subtotal,
  totalTax,
  onOpenScanner,
  onOpenSearchModal,
  onOpenCustomerModal,
  selectedCustomer,
  onOpenPettyCash,
  onOpenPickingList
}) {
  const { activeTheme, cartPosition, cardDensity } = useTheme();
  const isCartRight = cartPosition === 'right';
  const isCompact = cardDensity === 'compact';

  // Responsive View Tab for Tablet Portrait & Mobile screens (< 1024px)
  const [mobileViewTab, setMobileViewTab] = useState('catalog'); // 'catalog' or 'cart'

  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Upload / Edit Product Image Modal
  const [editingImageProduct, setEditingImageProduct] = useState(null);

  const categories = [
    'Semua', 
    'Sembako', 
    'Makanan Instan', 
    'Minuman', 
    'Perawatan Rumah', 
    'Susu & Bayi', 
    'Rokok & Tembakau'
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    
    const matchesSearch = p.name.toLowerCase().includes(q) || 
                          p.brand.toLowerCase().includes(q) || 
                          p.units.some(u => u.barcode.includes(q));
    return matchesCat && matchesSearch;
  });

  const handleSaveProductImage = (productId, newImageUrl) => {
    if (setProducts) {
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === productId ? { ...p, image: newImageUrl } : p)
      );
    }
  };

  // Quick popular products for 1-tap empty cart shortcuts
  const popularShortcuts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-3 animate-fade-in pb-14 lg:pb-0">
      
      {/* ======================================================== */}
      {/* MOBILE & TABLET PORTRAIT VIEW SWITCHER (< 1024px)        */}
      {/* ======================================================== */}
      <div className="lg:hidden flex items-center bg-slate-200/90 p-1 rounded-2xl shadow-inner shrink-0">
        <button
          type="button"
          onClick={() => setMobileViewTab('catalog')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mobileViewTab === 'catalog'
              ? 'bg-white text-slate-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-emerald-600" />
          <span>Katalog Produk</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileViewTab('cart')}
          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
            mobileViewTab === 'cart'
              ? 'bg-white text-slate-900 shadow-sm font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>Keranjang Nota</span>
          {cart.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-mono font-bold ml-1 shadow-2xs">
              {totalItems} item
            </span>
          )}
        </button>
      </div>

      {/* Main Container: On Desktop (>= 1024px) it is a 12-column grid side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* ======================================================== */}
        {/* LEFT/RIGHT PANEL: RETAIL CASHIER REGISTER (CART)         */}
        {/* ======================================================== */}
        <div className={`
          ${mobileViewTab === 'cart' ? 'flex' : 'hidden'} lg:flex
          lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex-col
          h-[calc(100vh-210px)] min-h-[500px] lg:h-[calc(100vh-190px)] overflow-hidden
          ${isCartRight ? 'lg:order-2' : 'lg:order-1'}
        `}>
          
          {/* Mobile Back-to-Catalog Banner */}
          <div className="lg:hidden px-3.5 py-2 bg-emerald-50/90 border-b border-emerald-100 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Meninjau Nota ({totalItems} item)</span>
            </div>
            <button
              type="button"
              onClick={() => setMobileViewTab('catalog')}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1 cursor-pointer transition active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Tambah Produk</span>
            </button>
          </div>
        
        {/* Clean Corporate Header: Antrean Switcher & Tier Controls */}
        <div className="p-3.5 sm:p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeTheme.gradient} text-white flex items-center justify-center shadow-xs`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-slate-900 block">
                Pesanan Kasir
              </span>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {cart.length === 0 ? 'Keranjang Kosong' : `${cart.length} Jenis Produk (${totalItems} item)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Queue Switcher Pills Q1-Q3 */}
            <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
              {['Antrean 1', 'Antrean 2', 'Antrean 3'].map(q => {
                const count = cartQueue[q]?.length || 0;
                const isSelected = activeQueue === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setActiveQueue(q)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-r ${activeTheme.gradient} text-white shadow-xs`
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={`Buka ${q}`}
                  >
                    <span>{q.replace('Antrean ', 'Q')}</span>
                    {count > 0 && (
                      <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                        isSelected ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Price Tier Segmented Control (Light & Crisp macOS / POS Style) */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/80 text-[10px]">
              {['eceran', 'grosir1', 'member'].map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPriceTier(tier)}
                  className={`px-2.5 py-1 rounded-lg font-black uppercase transition cursor-pointer ${
                    priceTier === tier
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={`Ganti tingkat harga: ${tier}`}
                >
                  {tier === 'grosir1' ? 'Grosir' : tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pelanggan & Kas Kecil Strip */}
        <div className="px-3.5 py-2 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between text-xs gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCustomerModal}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition cursor-pointer truncate flex-1 min-w-0 max-w-sm shadow-2xs"
            title="Pilih Pelanggan / Limit Piutang"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{selectedCustomer?.name || 'Pelanggan Umum (Walk-in)'}</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {cart.length > 0 && onOpenPickingList && (
              <button
                type="button"
                onClick={onOpenPickingList}
                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-[11px] font-bold text-indigo-900 transition flex items-center gap-1 cursor-pointer"
                title="Cetak Struk Draf / Lembar Picking Gudang"
              >
                <Printer className="w-3 h-3 text-indigo-600" />
                <span>Draf Picking</span>
              </button>
            )}

            {onOpenPettyCash && (
              <button
                type="button"
                onClick={onOpenPettyCash}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300/80 rounded-xl text-[11px] font-bold text-amber-900 transition flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Input Kas Kecil (Bensin/Parkir)"
              >
                <DollarSign className="w-3 h-3 text-amber-600" />
                <span>Kas Kecil</span>
              </button>
            )}
          </div>
        </div>

        {/* Member Strip if active */}
        {activeMember && (
          <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100 text-emerald-900 flex items-center justify-between text-xs shrink-0 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-3 h-3" />
              </span>
              <span>Member: <strong className="text-slate-900 font-extrabold">{activeMember.name}</strong></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
              {activeMember.tier} • {activeMember.points} Poin
            </span>
          </div>
        )}

        {/* Cart Item List (Scrollable Receipt Lines) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            /* EMPTY STATE: 21ST.DEV ENERGETIC & MOTIVATING */
            <div className="h-full flex flex-col justify-between py-4 px-3 sm:px-4">
              
              <div className="my-auto flex flex-col items-center text-center">
                
                {/* Concentric Icon Halo */}
                <div className="relative mb-3 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 shadow-inner">
                    <ShoppingBag className="w-8 h-8 stroke-[1.75]" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  <span>Siap Menerima Transaksi</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                  Keranjang Masih Kosong
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[270px] leading-relaxed">
                  Pilih produk dari katalog di sebelah kanan untuk menambahkan belanjaan ke kasir.
                </p>

                {/* Popular Quick-Add Chips */}
                <div className="mt-5 w-full max-w-sm">
                  <div className="flex items-center justify-between mb-2 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span className="flex items-center gap-1.5 text-slate-600 font-extrabold">
                      <Package className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Produk Cepat Tambah</span>
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-normal">1-Tap</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {popularShortcuts.map((p) => {
                      const primaryUnit = p.units.find(u => u.multiplier === 1) || p.units[0];
                      const price = primaryUnit.prices[priceTier] || primaryUnit.prices.eceran;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addItemToCart(p, primaryUnit.unit, 1)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-300 text-left transition-all active:scale-95 group/chip flex items-center gap-2 cursor-pointer shadow-2xs hover:shadow-xs"
                        >
                          <img 
                            src={p.image || DEFAULT_PRODUCT_IMAGES[p.id]} 
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-slate-800 truncate group-hover/chip:text-emerald-700">
                              {p.name.split(' ').slice(0, 2).join(' ')}
                            </div>
                            <div className="text-[10px] font-mono font-extrabold text-emerald-600">
                              Rp {price.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-md bg-slate-100 group-hover/chip:bg-emerald-600 group-hover/chip:text-white text-slate-400 flex items-center justify-center transition-colors shrink-0">
                            <Plus className="w-3 h-3" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Keyboard Shortcuts Helper */}
              <div className="bg-slate-50/80 rounded-xl p-2 border border-slate-200/80 flex items-center justify-around text-[10.5px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <kbd className="kbd-badge">F1</kbd>
                  <span className="text-slate-600 font-semibold">Cari PLU</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <kbd className="kbd-badge">F8</kbd>
                  <span className="text-slate-600 font-semibold">Layar Pelanggan</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5">
                  <kbd className="kbd-badge">F9</kbd>
                  <span className="text-slate-600 font-semibold">Bayar</span>
                </span>
              </div>

            </div>
          ) : (
            /* POPULATED CART ITEMS */
            cart.map((item, idx) => {
              const imageSrc = item.image || DEFAULT_PRODUCT_IMAGES[item.productId] || '/products/indomie.jpg';
              return (
                <div 
                  key={item.id || idx}
                  className="p-2.5 rounded-2xl bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 transition-all flex items-center justify-between gap-2.5 text-xs shadow-2xs group"
                >
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/90 p-1 shrink-0 flex items-center justify-center">
                      <img 
                        src={imageSrc} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PRODUCT_IMAGES[item.productId] || '/products/indomie.jpg';
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-extrabold text-slate-900 truncate text-xs" title={item.name}>
                        {item.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-1.5 py-0.2 rounded border border-slate-200">
                          {item.unit}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          @ Rp {item.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ergonomic Stepper */}
                  <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateRowQty(idx, Math.max(1, item.qty - 1))}
                      className="w-6 h-6 rounded-md bg-white hover:bg-slate-100 text-slate-700 hover:text-rose-600 font-bold flex items-center justify-center transition border border-slate-200 shadow-2xs active:scale-90 cursor-pointer"
                      title="Kurangi kuantitas"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-extrabold text-slate-900 text-xs">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRowQty(idx, item.qty + 1)}
                      className="w-6 h-6 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center transition shadow-2xs active:scale-90 cursor-pointer"
                      title="Tambah kuantitas"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal & Trash Button */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <div className="font-mono font-extrabold text-slate-900 text-xs">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="text-[10px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-0.5 ml-auto mt-0.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Real Retail Bill Summary & Action Footer (Clean, Bright & High-Clarity) */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-slate-200/90 shrink-0 space-y-2.5 rounded-b-2xl shadow-xs">
          
          {/* Subtotal & Tax Lines */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
            <span className="text-slate-500 font-medium">Subtotal ({totalItems} item):</span>
            <span className="font-mono font-bold text-slate-800 text-sm">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          {totalTax > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium px-1">
              <span className="text-slate-500 font-medium">PPN 11%:</span>
              <span className="font-mono font-bold text-slate-700">
                +Rp {totalTax.toLocaleString('id-ID')}
              </span>
            </div>
          )}

          {/* PREMIUM LIGHT TOTAL TAGIHAN CARD (CERAH & ELEGAN - TANPA WARNA GELAP) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50/60 border-2 border-emerald-500/25 flex items-center justify-between shadow-2xs relative overflow-hidden group">
            {/* Ambient soft light glow circles */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-20 h-20 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/80">
                  Total Tagihan
                </span>
                {totalTax > 0 && (
                  <span className="text-[9.5px] font-bold text-slate-400 font-mono">
                    (Inc. PPN)
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-base font-extrabold text-slate-500 font-mono">Rp</span>
                <span className="text-2xl sm:text-3xl font-mono font-black text-slate-900 tracking-tight">
                  {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Split Bill Button (Light & High-Contrast Style) */}
            <button
              type="button"
              onClick={onOpenSplitBill}
              disabled={cart.length === 0}
              className="relative z-10 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/90 hover:border-slate-300 font-extrabold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs hover:shadow-xs"
              title="Pisahkan tagihan rombongan (Split Bill)"
            >
              <div className="w-5 h-5 rounded-lg bg-indigo-50 border border-indigo-200/70 flex items-center justify-center text-indigo-600 shrink-0">
                <Split className="w-3 h-3" />
              </div>
              <span>Split Bill</span>
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-0.5">
            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="col-span-1 py-3.5 rounded-xl bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200/90 hover:border-rose-200 font-extrabold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>

            <button
              type="button"
              onClick={() => onCheckout(cart, totalAmount, activeQueue)}
              disabled={cart.length === 0}
              className={`col-span-2 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer relative overflow-hidden group/pay ${
                cart.length === 0
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : `bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.gradientHover} text-white shadow-lg shadow-emerald-600/20 active:scale-[0.98]`
              }`}
            >
              {cart.length > 0 && (
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
              )}
              <CreditCard className="w-4 h-4" />
              <span className="tracking-wide">BAYAR (F9)</span>
              <ArrowRight className="w-4 h-4 group-hover/pay:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT/LEFT PANEL: PRODUCT CATALOG (RETAIL TOUCHSCREEN)   */}
      {/* ======================================================== */}
      <div className={`
        ${mobileViewTab === 'catalog' ? 'flex' : 'hidden'} lg:flex
        lg:col-span-7 flex-col gap-3 h-auto lg:h-[calc(100vh-190px)] min-h-[500px]
        ${isCartRight ? 'lg:order-1' : 'lg:order-2'}
      `}>
        
        {/* Top Control Bar: Search & Category Filter */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm space-y-2.5 shrink-0">
          
          {/* Search Input with Camera & PLU Shortcuts */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk (nama, brand, atau barcode)..."
              className="w-full bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white text-slate-900 font-medium text-xs pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition placeholder:text-slate-400"
            />
            
            {/* Quick Actions inside Search Bar */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenScanner && (
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-bold flex items-center gap-1.5 transition active:scale-95 shadow-2xs cursor-pointer"
                  title="Scan barcode menggunakan kamera / webcam"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Kamera</span>
                </button>
              )}

              {onOpenSearchModal && (
                <button
                  type="button"
                  onClick={onOpenSearchModal}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10.5px] font-bold font-mono flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-2xs"
                  title="Pencarian Detail PLU [F1]"
                >
                  F1
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (21st.dev Style with Dynamic Category Color Badges & Icons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {categories.map(cat => {
              const count = cat === 'Semua' 
                ? products.length 
                : products.filter(p => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              const catCfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['Semua'];
              const IconComponent = catCfg.icon || Layers;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? `${catCfg.activeTab}`
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Product Grid: 21st.dev Upgraded Cards with Category Aesthetics & Density */}
        <div className={`grid ${
          isCompact 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'
        } gap-3 flex-1 overflow-y-auto pr-1 pb-16 content-start`}>
          {filteredProducts.map(product => {
            const currentStock = product.stock[activeWarehouse] || 0;
            
            // Dynamic resolver for primary retail vs bulk unit based on price tier
            const getEffectiveUnits = (prod) => {
              const baseUnitObj = prod.units.find(u => u.multiplier === 1) || prod.units[0];
              const bulkUnits = prod.units.filter(u => u.multiplier > 1);

              if (priceTier === 'grosir1' || priceTier === 'grosir2') {
                // Mode Grosir: Utamakan unit partai/grosir (Karton, Dus, Slop) jika tersedia
                const bulkPrimary = bulkUnits.length > 0 ? bulkUnits[bulkUnits.length - 1] : baseUnitObj;
                const secondaries = prod.units.filter(u => u !== bulkPrimary);
                return { primaryUnit: bulkPrimary, secondaryUnits: secondaries };
              } else {
                // Mode Eceran (atau Member): Utamakan Satuan Eceran (Pcs, Botol, Bungkus, Kotak, Zak 5kg)
                return { primaryUnit: baseUnitObj, secondaryUnits: bulkUnits };
              }
            };

            const { primaryUnit, secondaryUnits } = getEffectiveUnits(product);
            const catCfg = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG['Semua'];

            // Get active price based on priceTier
            const getPrice = (unitObj) => {
              if (!unitObj) return 0;
              return unitObj.prices[priceTier] || unitObj.prices.eceran;
            };

            const imageSrc = product.image || DEFAULT_PRODUCT_IMAGES[product.id] || '/products/indomie.jpg';

            // Stock health status
            const isStockSafe = currentStock > 20;
            const isStockLow = currentStock > 0 && currentStock <= 20;
            const isStockEmpty = currentStock === 0;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border border-slate-200/90 ${catCfg.accentBorder} ${
                  isCompact ? 'p-2.5 min-h-[320px]' : 'p-3 min-h-[370px]'
                } h-full flex flex-col justify-between shadow-2xs hover:shadow-xl transition-all duration-300 group overflow-hidden relative glow-card-hover`}
              >
                {/* Subtle Ambient Color Glow at Top-Right of Card */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${catCfg.glow} pointer-events-none rounded-bl-full transition-opacity group-hover:opacity-100 opacity-60`} />

                {/* Header Card: Category with dot & Brand */}
                <div className="flex items-center justify-between gap-1 mb-1.5 relative z-10 min-w-0">
                  <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-lg border flex items-center gap-1 ${catCfg.badge} min-w-0 shadow-2xs truncate`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${catCfg.dot} shrink-0`} />
                    <span className="truncate">{product.category}</span>
                  </span>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors shrink-0 max-w-[45%] truncate text-right">
                    {product.brand}
                  </span>
                </div>

                {/* Packaging Image Frame with Smooth Scale, Quick-Add Overlay & Edit Button */}
                <div className={`relative ${isCompact ? 'h-28' : 'h-36'} shrink-0 rounded-xl bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60 border border-slate-100 p-2 flex items-center justify-center overflow-hidden mb-2 group/img z-10`}>
                  <img 
                    src={imageSrc} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/img:scale-108 transition-transform duration-300 ease-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PRODUCT_IMAGES[product.id] || '/products/indomie.jpg';
                    }}
                  />

                  {/* Tap Image to Quick Add Primary Unit */}
                  <button
                    type="button"
                    onClick={() => addItemToCart(product, primaryUnit.unit, 1)}
                    className="absolute inset-0 bg-slate-900/25 backdrop-blur-[2px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title={`Klik untuk tambah 1 ${primaryUnit.unit}`}
                  >
                    <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 active:scale-95 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ 1 {primaryUnit.unit}</span>
                    </span>
                  </button>

                  {/* Edit / Change Image Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImageProduct(product);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/80 hover:bg-white text-slate-500 hover:text-slate-900 border border-slate-200/70 backdrop-blur-md flex items-center justify-center shadow-xs transition-all active:scale-90 cursor-pointer"
                    title="Upload / Ganti Gambar Produk"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Name & Live Pulsing Stock Indicator */}
                <div className="flex-1 min-w-0 z-10">
                  <h4 className={`font-extrabold text-slate-900 ${
                    isCompact ? 'text-xs min-h-[20px] line-clamp-1' : 'text-xs sm:text-[13px] min-h-[32px] line-clamp-2'
                  } leading-snug group-hover:text-emerald-700 transition-colors`}>
                    {product.name}
                  </h4>
                  
                  {/* Stock Status Bar with Pulsing Radar Dot */}
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className="relative flex h-2 w-2">
                        {isStockSafe && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          isStockSafe 
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' 
                            : isStockLow 
                            ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]' 
                            : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                        }`} />
                      </span>
                      <span className="font-medium text-slate-500 text-[10.5px]">
                        {isStockEmpty ? 'Stok Habis' : 'Stok Toko:'}
                      </span>
                    </span>
                    <strong className="text-slate-700 bg-slate-100/90 border border-slate-200/70 px-1.5 py-0.2 rounded-md font-mono font-bold text-[10px]">
                      {currentStock} {product.baseUnit}
                    </strong>
                  </div>
                </div>

                {/* Tactile Unit Buttons (21st.dev High-Energy Gradient CTA) */}
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-1.5 z-10">
                  
                  {/* Primary Retail Unit Button (Gradient Pill with Monospace Price) */}
                  <button
                    type="button"
                    onClick={() => addItemToCart(product, primaryUnit.unit, 1)}
                    className={`w-full py-2 px-2.5 bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.gradientHover} text-white rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md group/btn`}
                  >
                    <span className="text-[10.5px] bg-black/20 text-white font-extrabold px-2 py-0.5 rounded-lg border border-white/20 flex items-center gap-1">
                      {primaryUnit.unit}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono font-black text-[12px] tracking-tight">
                      <span>Rp {getPrice(primaryUnit).toLocaleString('id-ID')}</span>
                      <Plus className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform duration-200" />
                    </div>
                  </button>

                  {/* Secondary Units / Bulk Acceleration Section (Fully Responsive Stack) */}
                  {secondaryUnits.length > 0 ? (
                    <div className={secondaryUnits.length > 1 ? "flex flex-col gap-1" : "flex items-center"}>
                      {secondaryUnits.map((u) => {
                        const cleanUnit = u.unit.replace(/\s*\(\d+\)/, '');
                        return (
                          <button
                            key={u.unit}
                            type="button"
                            onClick={() => addItemToCart(product, u.unit, 1)}
                            className="w-full py-1 px-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200/90 hover:border-emerald-300 rounded-xl text-[10px] sm:text-[10.5px] font-bold flex items-center justify-between transition-all cursor-pointer active:scale-[0.98] shadow-2xs group/sec"
                            title={`Tambah 1 ${u.unit} (${u.multiplier}x)`}
                          >
                            <span className="flex items-center gap-1 min-w-0">
                              <Plus className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span className="font-extrabold text-slate-700 truncate">{cleanUnit}</span>
                              <span className="text-[9px] text-slate-400 font-mono shrink-0">({u.multiplier}x)</span>
                            </span>
                            <span className="font-mono font-black text-emerald-700 text-[10.5px] shrink-0 ml-1">
                              Rp {getPrice(u).toLocaleString('id-ID')}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Balanced filler for single unit products (e.g. Beras 5kg) */
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => addItemToCart(product, primaryUnit.unit, 5)}
                        className="flex-1 py-1 px-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 hover:border-emerald-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
                        title="Tambah 5 unit sekaligus"
                      >
                        <Plus className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono font-bold">5 {primaryUnit.unit.replace(/\s*\(.*?\)/, '')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => addItemToCart(product, primaryUnit.unit, 10)}
                        className="flex-1 py-1 px-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/90 hover:border-emerald-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.98] cursor-pointer shadow-2xs"
                        title="Tambah 10 unit sekaligus"
                      >
                        <Plus className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-mono font-bold">10 {primaryUnit.unit.replace(/\s*\(.*?\)/, '')}</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Floating Bottom Quick Checkout Bar on Mobile/Tablet when in Catalog */}
      {mobileViewTab === 'catalog' && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-4 inset-x-3 sm:inset-x-4 z-40 animate-slide-up">
          <div className="bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${activeTheme.gradient} text-white flex items-center justify-center font-bold shadow-xs shrink-0`}>
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block leading-tight">
                  {totalItems} Item • Subtotal
                </span>
                <div className="font-mono font-black text-slate-900 text-sm truncate">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileViewTab('cart')}
              className={`px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r ${activeTheme.gradient} text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0`}
            >
              <span>Lihat Nota & Bayar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload / Ganti Gambar Modal */}
      <UploadProductImageModal
        isOpen={Boolean(editingImageProduct)}
        onClose={() => setEditingImageProduct(null)}
        product={editingImageProduct}
        onSaveImage={handleSaveProductImage}
      />

      </div>
    </div>
  );
}
