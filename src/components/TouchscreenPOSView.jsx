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
  Store,
  Layers,
  CheckCircle2,
  X,
  Package,
  Users,
  DollarSign,
  Printer
} from 'lucide-react';
import UploadProductImageModal from './UploadProductImageModal';

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
    <div className="grid grid-cols-1 ipad:grid-cols-12 gap-4 items-start animate-fade-in">
      
      {/* ======================================================== */}
      {/* LEFT PANEL: AUTHENTIC RETAIL CASHIER REGISTER (CART)     */}
      {/* ======================================================== */}
      <div className="ipad:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[590px] ipad:h-[calc(100vh-185px)] min-h-[530px] max-h-[780px] overflow-hidden">
        
        {/* Clean Corporate Header: Antrean Switcher & Tier Controls */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold tracking-wider uppercase text-slate-800 block">
                Pesanan Kasir
              </span>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {cart.length === 0 ? 'Keranjang Kosong' : `${cart.length} Jenis Produk (${totalItems} item)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Queue Switcher Pills Q1-Q3 */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
              {['Antrean 1', 'Antrean 2', 'Antrean 3'].map(q => {
                const count = cartQueue[q]?.length || 0;
                const isSelected = activeQueue === q;
                return (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setActiveQueue(q)}
                    className={`px-2 py-1 rounded text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                    title={`Buka ${q}`}
                  >
                    <span>{q.replace('Antrean ', 'Q')}</span>
                    {count > 0 && (
                      <span className={`text-[9px] px-1 py-0.2 rounded-full font-mono font-bold ${
                        isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Price Tier Segmented Control */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px]">
              {['eceran', 'grosir1', 'member'].map(tier => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPriceTier(tier)}
                  className={`px-2 py-1 rounded font-bold uppercase transition cursor-pointer ${
                    priceTier === tier
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
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
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 transition cursor-pointer truncate max-w-[210px]"
            title="Pilih Pelanggan / Limit Piutang"
          >
            <Users className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{selectedCustomer?.name || 'Pelanggan Umum'}</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            {cart.length > 0 && onOpenPickingList && (
              <button
                type="button"
                onClick={onOpenPickingList}
                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 transition flex items-center gap-1 cursor-pointer"
                title="Cetak Struk Draf / Lembar Picking Gudang"
              >
                <Printer className="w-3 h-3 text-amber-600" />
                <span>Draf Picking</span>
              </button>
            )}

            {onOpenPettyCash && (
              <button
                type="button"
                onClick={onOpenPettyCash}
                className="px-2 py-1 bg-white hover:bg-amber-50 border border-amber-300 rounded-lg text-[11px] font-bold text-amber-900 transition flex items-center gap-1 cursor-pointer"
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
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-emerald-900 flex items-center justify-between text-xs shrink-0 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-emerald-700 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-3 h-3" />
              </span>
              <span>Member: <strong className="text-slate-900 font-extrabold">{activeMember.name}</strong></span>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
              {activeMember.tier} • {activeMember.points} Poin
            </span>
          </div>
        )}

        {/* Cart Item List (Scrollable Receipt Lines) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            /* EMPTY STATE */
            <div className="h-full flex flex-col justify-between py-6 px-4">
              
              <div className="my-auto flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>

                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
                  Keranjang Masih Kosong
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[260px] leading-relaxed">
                  Pilih produk dari katalog di sebelah kanan untuk menambahkan belanjaan ke kasir.
                </p>

                {/* Popular Quick-Add Chips */}
                <div className="mt-5 w-full max-w-sm">
                  <div className="flex items-center justify-center gap-1.5 mb-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5 text-slate-500" />
                    <span>Produk Cepat Tambah:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {popularShortcuts.map((p) => {
                      const primaryUnit = p.units[0];
                      const price = primaryUnit.prices[priceTier] || primaryUnit.prices.eceran;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addItemToCart(p, primaryUnit.unit, 1)}
                          className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all active:scale-95 group/chip flex items-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <img 
                            src={p.image || DEFAULT_PRODUCT_IMAGES[p.id]} 
                            alt={p.name}
                            className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-[11px] font-bold text-slate-800 truncate group-hover/chip:text-emerald-800">
                              {p.name.split(' ').slice(0, 2).join(' ')}
                            </div>
                            <div className="text-[10px] font-mono font-bold text-emerald-700">
                              Rp {price.toLocaleString('id-ID')}
                            </div>
                          </div>
                          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover/chip:text-emerald-700 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Keyboard Shortcuts Helper */}
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 flex items-center justify-around text-[10px] text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[9px] font-bold text-slate-700 shadow-2xs">F1</kbd>
                  <span>Cari PLU</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[9px] font-bold text-slate-700 shadow-2xs">F8</kbd>
                  <span>Layar Pelanggan</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[9px] font-bold text-slate-700 shadow-2xs">F9</kbd>
                  <span>Bayar</span>
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
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex items-center justify-between gap-2.5 text-xs shadow-2xs group"
                >
                  {/* Thumbnail & Product Details */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 flex items-center justify-center">
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
                      <div className="font-bold text-slate-900 truncate text-xs">
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
                  <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateRowQty(idx, Math.max(1, item.qty - 1))}
                      className="w-6 h-6 rounded bg-white hover:bg-slate-100 text-slate-700 hover:text-rose-600 font-bold flex items-center justify-center transition border border-slate-200 shadow-2xs active:scale-90 cursor-pointer"
                      title="Kurangi kuantitas"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono font-bold text-slate-900 text-xs">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateRowQty(idx, item.qty + 1)}
                      className="w-6 h-6 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center transition shadow-2xs active:scale-90 cursor-pointer"
                      title="Tambah kuantitas"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal & Trash Button */}
                  <div className="text-right shrink-0 min-w-[70px]">
                    <div className="font-mono font-bold text-slate-900 text-xs">
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

        {/* Real Retail Bill Summary & Action Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2 rounded-b-2xl">
          
          {/* Subtotal & Tax Lines */}
          <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>Subtotal ({totalItems} item):</span>
            <span className="font-mono font-bold text-slate-800">
              Rp {subtotal.toLocaleString('id-ID')}
            </span>
          </div>

          {totalTax > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>PPN 11%:</span>
              <span className="font-mono font-bold text-slate-700">
                +Rp {totalTax.toLocaleString('id-ID')}
              </span>
            </div>
          )}

          {/* Clean High-Contrast Retail Total Display Card */}
          <div className="p-3 rounded-xl bg-white border border-slate-300 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                Total Tagihan:
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 tracking-tight">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Split Bill Button */}
            <button
              type="button"
              onClick={onOpenSplitBill}
              disabled={cart.length === 0}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              title="Pisahkan tagihan rombongan (Split Bill)"
            >
              <Split className="w-3.5 h-3.5 text-slate-600" />
              <span>Split Bill</span>
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={clearCart}
              disabled={cart.length === 0}
              className="col-span-1 py-3 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>

            <button
              type="button"
              onClick={() => onCheckout(cart, totalAmount, activeQueue)}
              disabled={cart.length === 0}
              className={`col-span-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                cart.length === 0
                  ? 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>BAYAR (F9)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT PANEL: PRODUCT CATALOG (RETAIL TOUCHSCREEN POS)    */}
      {/* ======================================================== */}
      <div className="ipad:col-span-7 flex flex-col gap-3 h-auto ipad:h-[calc(100vh-185px)] min-h-[530px] max-h-[780px]">
        
        {/* Top Control Bar: Search & Category Filter */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3 shrink-0">
          
          {/* Search Input with Camera & PLU Shortcuts */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk (nama, brand, atau barcode)..."
              className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 font-medium text-xs pl-10 pr-24 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 transition placeholder:text-slate-400"
            />
            
            {/* Quick Actions inside Search Bar */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-6 h-6 rounded bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {onOpenScanner && (
                <button
                  type="button"
                  onClick={onOpenScanner}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-bold flex items-center gap-1 transition active:scale-95 shadow-2xs cursor-pointer"
                  title="Scan barcode menggunakan kamera / webcam"
                >
                  <Camera className="w-3 h-3 text-slate-600" />
                  <span className="hidden sm:inline">Kamera</span>
                </button>
              )}

              {onOpenSearchModal && (
                <button
                  type="button"
                  onClick={onOpenSearchModal}
                  className="px-2 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-bold font-mono flex items-center gap-1 transition active:scale-95 cursor-pointer"
                  title="Pencarian Detail PLU [F1]"
                >
                  F1
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Clean Text with Count Badges, NO EMOJIS) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => {
              const count = cat === 'Semua' 
                ? products.length 
                : products.filter(p => p.category === cat).length;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Product Grid: Clean Retail Cards */}
        <div className="grid grid-cols-2 ipad:grid-cols-2 ipad-pro:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-3.5 flex-1 overflow-y-auto pr-1 pb-8 content-start">
          {filteredProducts.map(product => {
            const currentStock = product.stock[activeWarehouse] || 0;
            const primaryUnit = product.units[0];
            const secondaryUnits = product.units.slice(1);

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
                className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-600 p-3 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group overflow-hidden min-h-[385px] max-h-[410px] relative"
              >
                
                {/* Header Card: Category & Brand */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 truncate">
                    {product.category}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {product.brand}
                  </span>
                </div>

                {/* Packaging Image Frame with Hover Quick Action & Edit Button */}
                <div className="relative h-40 shrink-0 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden mb-2 group/img">
                  <img 
                    src={imageSrc} 
                    alt={product.name}
                    className="w-full h-full object-contain group-hover/img:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PRODUCT_IMAGES[product.id] || '/products/indomie.jpg';
                    }}
                  />

                  {/* Tap Image to Quick Add Primary Unit */}
                  <button
                    type="button"
                    onClick={() => addItemToCart(product, primaryUnit.unit, 1)}
                    className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    title={`Klik untuk tambah 1 ${primaryUnit.unit}`}
                  >
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm flex items-center gap-1 active:scale-95 transition-all">
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ {primaryUnit.unit}</span>
                    </span>
                  </button>

                  {/* Edit / Change Image Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingImageProduct(product);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center shadow-2xs transition active:scale-90"
                    title="Upload / Ganti Gambar Produk"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Name & Live Stock Indicator */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug line-clamp-2 min-h-[34px] group-hover:text-emerald-800 transition-colors">
                    {product.name}
                  </h4>
                  
                  {/* Stock Status Bar */}
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className={`w-2 h-2 rounded-full ${
                        isStockSafe ? 'bg-emerald-600' : isStockLow ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                      <span>{isStockEmpty ? 'Habis' : 'Stok Toko:'}</span>
                    </span>
                    <strong className="text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded font-mono font-bold text-[10.5px]">
                      {currentStock} {product.baseUnit}
                    </strong>
                  </div>
                </div>

                {/* Tactile Unit Buttons (Clean Solid Retail Look) */}
                <div className="pt-2.5 mt-2 border-t border-slate-100 space-y-1.5">
                  
                  {/* Primary Retail Unit Button (Solid Emerald) */}
                  <button
                    type="button"
                    onClick={() => addItemToCart(product, primaryUnit.unit, 1)}
                    className="w-full py-2 px-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-between transition cursor-pointer active:scale-[0.98] shadow-2xs"
                  >
                    <span className="text-[11px]">
                      {primaryUnit.unit}:
                    </span>
                    <div className="flex items-center gap-1 font-mono font-bold">
                      <span>Rp {getPrice(primaryUnit).toLocaleString('id-ID')}</span>
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  {/* Secondary Units / Bulk Acceleration Row */}
                  {secondaryUnits.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      {secondaryUnits.map((u) => {
                        const cleanUnit = secondaryUnits.length > 1 
                          ? u.unit.replace(/\s*\(\d+\)/, '') 
                          : (u.unit.includes('(') ? u.unit : `${u.unit} (${u.multiplier}x)`);
                        return (
                          <button
                            key={u.unit}
                            type="button"
                            onClick={() => addItemToCart(product, u.unit, 1)}
                            className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-[10.5px] font-bold flex items-center justify-between transition cursor-pointer active:scale-[0.98]"
                            title={`Tambah 1 ${u.unit} (${u.multiplier}x)`}
                          >
                            <span className="truncate">{cleanUnit}:</span>
                            <span className="font-mono font-bold ml-1 whitespace-nowrap text-[10px]">
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
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-[0.98] cursor-pointer"
                        title="Tambah 5 unit sekaligus"
                      >
                        <span>+ 5 {primaryUnit.unit}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => addItemToCart(product, primaryUnit.unit, 10)}
                        className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition active:scale-[0.98] cursor-pointer"
                        title="Tambah 10 unit sekaligus"
                      >
                        <span>+ 10 {primaryUnit.unit}</span>
                      </button>
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Upload / Ganti Gambar Modal */}
      <UploadProductImageModal
        isOpen={Boolean(editingImageProduct)}
        onClose={() => setEditingImageProduct(null)}
        product={editingImageProduct}
        onSaveImage={handleSaveProductImage}
      />

    </div>
  );
}
