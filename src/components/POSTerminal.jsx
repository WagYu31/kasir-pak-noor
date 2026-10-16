import React, { useState, useEffect, useRef } from 'react';
import { 
  Barcode, 
  Search, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  PauseCircle, 
  RotateCcw, 
  Tag, 
  Zap, 
  Printer, 
  UserCheck, 
  Sparkles, 
  Monitor, 
  Delete, 
  ArrowDown, 
  ArrowUp,
  Percent,
  CheckCircle2,
  Lock,
  ChevronRight,
  Camera,
  LayoutGrid,
  Keyboard,
  Split,
  Store,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import CameraBarcodeScannerModal from './CameraBarcodeScannerModal';
import TouchscreenPOSView from './TouchscreenPOSView';
import SplitBillModal from './SplitBillModal';
import CustomerModal from './CustomerModal';
import PettyCashModal from './PettyCashModal';
import DraftPickingListModal from './DraftPickingListModal';

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

// Barcode to image fallback mapping
const BARCODE_IMAGE_MAP = {
  '8991234001001': '/products/sania.jpg',
  '8991234001002': '/products/sania.jpg',
  '899886611001': '/products/indomie.jpg',
  '899886611002': '/products/indomie.jpg',
  '899886611003': '/products/indomie.jpg',
  '899554422001': '/products/beras.jpg',
  '899223344002': '/products/gulaku.jpg',
  '899332211002': '/products/le_minerale.jpg',
  '899443322002': '/products/kapal_api.jpg',
  '899776655002': '/products/rinso.jpg',
  '899665544002': '/products/ultra_milk.jpg',
  '899998877002': '/products/dancow.jpg',
  '899112233002': '/products/sampoerna.jpg',
};

// Category Badges & Color Theme Config
const CATEGORY_CHIPS = {
  'Sembako': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Makanan': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Makanan Instan': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Minuman': { bg: 'bg-sky-50', text: 'text-sky-800', border: 'border-sky-200' },
  'Rokok & Tembakau': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Perawatan Rumah': { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200' },
  'Susu & Bayi': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'Umum': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' }
};

export default function POSTerminal({ 
  products, 
  setProducts,
  activeWarehouse, 
  priceTier, 
  setPriceTier, 
  onCheckout,
  lastTransaction,
  onReprintLast,
  onOpenCustomerDisplay,
  lastScannedItem,
  setLastScannedItem,
  currentRole,
  activeTerminal = 'Kasir 1',
  shiftData = { cashier: 'Kasir 1' },
  customers = [],
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  expenses = [],
  onAddExpense
}) {
  // Barcode / Scanner state
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Antrean / Hold Orders (Pre-populated with active retail items for vibrant live presentation)
  const [cartQueue, setCartQueue] = useState({
    'Antrean 1': [
      {
        id: 'PRD-003-Zak (5kg)-init',
        productId: 'PRD-003',
        name: 'Beras Premium Ramos 5kg',
        category: 'Sembako',
        image: '/products/beras.jpg',
        unit: 'Zak (5kg)',
        multiplier: 1,
        barcode: '899554422001',
        baseUnit: 'Zak',
        price: 76000,
        normalPrice: 76000,
        discount: 0,
        hpp: 67000,
        qty: 4,
        tax: 0
      },
      {
        id: 'PRD-002-Pcs-init',
        productId: 'PRD-002',
        name: 'Indomie Goreng Spesial 85g',
        category: 'Makanan Instan',
        image: '/products/indomie.jpg',
        unit: 'Pcs',
        multiplier: 1,
        barcode: '899886611003',
        baseUnit: 'Pcs',
        price: 3500,
        normalPrice: 3500,
        discount: 0,
        hpp: 2800,
        qty: 3,
        tax: 0
      },
      {
        id: 'PRD-001-Pcs-init',
        productId: 'PRD-001',
        name: 'Minyak Goreng Sania 2L',
        category: 'Sembako',
        image: '/products/sania.jpg',
        unit: 'Pcs',
        multiplier: 1,
        barcode: '8991234001002',
        baseUnit: 'Pcs',
        price: 37000,
        normalPrice: 37000,
        discount: 0,
        hpp: 33000,
        qty: 2,
        tax: 0.11
      },
      {
        id: 'PRD-005-Botol-init',
        productId: 'PRD-005',
        name: 'Air Mineral Le Minerale 600ml',
        category: 'Minuman',
        image: '/products/le_minerale.jpg',
        unit: 'Botol',
        multiplier: 1,
        barcode: '899332211002',
        baseUnit: 'Botol',
        price: 3500,
        normalPrice: 3500,
        discount: 0,
        hpp: 2600,
        qty: 1,
        tax: 0.11
      }
    ],
    'Antrean 2': [],
    'Antrean 3': []
  });
  const [activeQueue, setActiveQueue] = useState('Antrean 1');
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  // Member System (Alfamart / Indomaret style)
  const [memberPhone, setMemberPhone] = useState('');
  const [activeMember, setActiveMember] = useState(null);

  // PLU / Product Search Modal (F1)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('');

  // Cash Drawer Notification simulation (F10)
  const [drawerOpenNotice, setDrawerOpenNotice] = useState(false);

  // Camera Barcode Scanner Modal State
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);

  // Tebus Murah Claimed State
  const [tebusMurahClaimed, setTebusMurahClaimed] = useState(false);

  // Dual POS View Mode: 'retail' (Barcode & Keyboard) vs 'touchscreen' (Visual Grid gaya video)
  const [posViewMode, setPosViewMode] = useState('retail');
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);
  const [isDraftPickingListOpen, setIsDraftPickingListOpen] = useState(false);

  const barcodeInputRef = useRef(null);
  const cart = cartQueue[activeQueue] || [];

  const handleProceedSplitBill = (splitResult) => {
    setIsSplitBillOpen(false);
    if (splitResult.type === 'by_amount') {
      onCheckout(cart, splitResult.amountToPay, `${activeQueue} (Bagi ${splitResult.totalPersons} Orang)`);
    } else {
      // by item: update cart with remaining items, checkout selected items
      setCartQueue(prev => ({
        ...prev,
        [activeQueue]: splitResult.remainingItems
      }));
      onCheckout(splitResult.items, splitResult.amountToPay, `${activeQueue} (${splitResult.billName})`);
    }
  };

  // Focus barcode input permanently for high-speed cashier operation
  useEffect(() => {
    if (barcodeInputRef.current && !isSearchModalOpen) {
      barcodeInputRef.current.focus();
    }
  }, [cart, activeQueue, isSearchModalOpen]);

  // Keyboard shortcut listener (F1 - F12)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // F1: Search PLU Modal
      if (e.key === 'F1') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      // F2: Focus change Qty on selected row
      else if (e.key === 'F2') {
        e.preventDefault();
        if (cart[selectedRowIndex]) {
          const newQty = prompt('Masukkan Kuantitas Baru:', cart[selectedRowIndex].qty);
          if (newQty && !isNaN(newQty) && Number(newQty) > 0) {
            updateRowQty(selectedRowIndex, Number(newQty));
          }
        }
      }
      // F3: Toggle Unit of selected row
      else if (e.key === 'F3') {
        e.preventDefault();
        toggleRowUnit(selectedRowIndex);
      }
      // F5: Switch Queue (Hold/Recall)
      else if (e.key === 'F5') {
        e.preventDefault();
        const nextQueue = activeQueue === 'Antrean 1' ? 'Antrean 2' : activeQueue === 'Antrean 2' ? 'Antrean 3' : 'Antrean 1';
        setActiveQueue(nextQueue);
      }
      // F7 or Delete: Delete selected row
      else if (e.key === 'F7' || (e.key === 'Delete' && !isSearchModalOpen)) {
        e.preventDefault();
        if (cart[selectedRowIndex]) {
          removeRow(selectedRowIndex);
        }
      }
      // F8: Customer Display
      else if (e.key === 'F8') {
        e.preventDefault();
        onOpenCustomerDisplay();
      }
      // F9: Checkout
      else if (e.key === 'F9') {
        e.preventDefault();
        if (cart.length > 0) {
          soundFX.playCashRegister();
          onCheckout(cart, totalAmount, activeQueue);
        } else {
          soundFX.playError();
        }
      }
      // F10: Cash Drawer Simulation
      else if (e.key === 'F10') {
        e.preventDefault();
        soundFX.playCashRegister();
        triggerCashDrawer();
      }
      // F11: Reprint last
      else if (e.key === 'F11') {
        e.preventDefault();
        if (lastTransaction) onReprintLast();
      }
      // Arrow Up / Down in Table
      else if (e.key === 'ArrowUp' && !isSearchModalOpen) {
        e.preventDefault();
        setSelectedRowIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown' && !isSearchModalOpen) {
        e.preventDefault();
        setSelectedRowIndex(prev => Math.min(cart.length - 1, prev + 1));
      }
      // ESC: Clear Cart
      else if (e.key === 'Escape') {
        if (isSearchModalOpen) {
          setIsSearchModalOpen(false);
        } else if (cart.length > 0 && confirm('Void / Batalkan transaksi antrean ini?')) {
          clearCart();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, selectedRowIndex, activeQueue, isSearchModalOpen, lastTransaction]);

  // Trigger cash drawer animation
  const triggerCashDrawer = () => {
    setDrawerOpenNotice(true);
    setTimeout(() => setDrawerOpenNotice(false), 2500);
  };

  // Process Barcode Input (supports multiplier: e.g. "3*8991234001001")
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const raw = barcodeInput.trim();
    if (!raw) return;

    let multiplier = 1;
    let code = raw;

    // Support Minimarket Multiplier prefix syntax: "5*BARCODE"
    if (raw.includes('*')) {
      const parts = raw.split('*');
      const parsedMul = parseInt(parts[0], 10);
      if (!isNaN(parsedMul) && parsedMul > 0) {
        multiplier = parsedMul;
        code = parts[1].trim();
      }
    }

    // Find Product & matching unit
    let foundProduct = null;
    let matchedUnit = null;

    for (const p of products) {
      const u = p.units.find(unit => unit.barcode === code);
      if (u) {
        foundProduct = p;
        matchedUnit = u;
        break;
      }
    }

    if (foundProduct && matchedUnit) {
      addItemToCart(foundProduct, matchedUnit.unit, multiplier);
      setBarcodeInput('');
    } else {
      // Try search by name if not exact barcode
      const searchMatches = products.filter(p => p.name.toLowerCase().includes(code.toLowerCase()));
      if (searchMatches.length === 1) {
        const p = searchMatches[0];
        addItemToCart(p, p.units[0].unit, multiplier);
        setBarcodeInput('');
      } else {
        soundFX.playError();
        alert(`Barcode / PLU "${code}" tidak ditemukan dalam sistem!`);
      }
    }
  };

  // Handle Barcode Scanned via Camera / Webcam
  const handleCameraScanSuccess = (scannedCode) => {
    const raw = scannedCode.trim();
    if (!raw) return;

    let multiplier = 1;
    let code = raw;

    if (raw.includes('*')) {
      const parts = raw.split('*');
      const parsedMul = parseInt(parts[0], 10);
      if (!isNaN(parsedMul) && parsedMul > 0) {
        multiplier = parsedMul;
        code = parts[1].trim();
      }
    }

    let foundProduct = null;
    let matchedUnit = null;

    for (const p of products) {
      const u = p.units.find(unit => unit.barcode === code);
      if (u) {
        foundProduct = p;
        matchedUnit = u;
        break;
      }
    }

    if (foundProduct && matchedUnit) {
      addItemToCart(foundProduct, matchedUnit.unit, multiplier);
      soundFX.playBeep();
      setIsCameraScannerOpen(false);
    } else {
      soundFX.playError();
      alert(`Barcode [${code}] dari kamera tidak terdaftar dalam katalog!`);
    }
  };

  // Add Item to Cart
  const addItemToCart = (product, unitName, qtyToAdd = 1) => {
    const unitObj = product.units.find(u => u.unit === unitName) || product.units[0];
    const unitPrice = activeMember 
      ? (unitObj.prices.member || unitObj.prices.eceran)
      : (unitObj.prices[priceTier] || unitObj.prices.eceran);

    const currentStock = product.stock[activeWarehouse] || 0;
    const requiredPcs = qtyToAdd * unitObj.multiplier;
    const existingPcsInCart = cart
      .filter(i => i.productId === product.id)
      .reduce((sum, i) => sum + (i.qty * i.multiplier), 0);

    if (existingPcsInCart + requiredPcs > currentStock) {
      soundFX.playError();
      alert(`Stok tidak mencukupi! Sisa stok di ${activeWarehouse}: ${currentStock} ${product.baseUnit}`);
      return;
    }

    // Authentic Scanner Beep!
    soundFX.playBeep();

    setCartQueue(prev => {
      const currentList = prev[activeQueue];
      const existingIdx = currentList.findIndex(i => i.productId === product.id && i.unit === unitObj.unit);

      let updatedList;
      if (existingIdx >= 0) {
        updatedList = [...currentList];
        updatedList[existingIdx].qty += qtyToAdd;
        setSelectedRowIndex(existingIdx);
      } else {
        const resolvedImage = product.image 
          || DEFAULT_PRODUCT_IMAGES[product.id] 
          || BARCODE_IMAGE_MAP[unitObj.barcode] 
          || '/products/indomie.jpg';

        const newItem = {
          id: `${product.id}-${unitObj.unit}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          category: product.category || 'Umum',
          brand: product.brand || '',
          image: resolvedImage,
          unit: unitObj.unit,
          multiplier: unitObj.multiplier,
          barcode: unitObj.barcode,
          baseUnit: product.baseUnit,
          price: unitPrice,
          normalPrice: unitObj.prices.eceran,
          discount: activeMember ? (unitObj.prices.eceran - unitPrice) : 0,
          hpp: unitObj.hpp,
          qty: qtyToAdd,
          tax: product.tax || 0
        };
        updatedList = [...currentList, newItem];
        setSelectedRowIndex(updatedList.length - 1);
      }

      // Update last scanned item for live banner & customer display
      setLastScannedItem({
        name: product.name,
        unit: unitObj.unit,
        price: unitPrice,
        qty: qtyToAdd
      });

      return { ...prev, [activeQueue]: updatedList };
    });
  };

  // Update specific row quantity
  const updateRowQty = (rowIndex, newQty) => {
    if (newQty <= 0) {
      removeRow(rowIndex);
      return;
    }
    setCartQueue(prev => {
      const currentList = [...prev[activeQueue]];
      if (currentList[rowIndex]) {
        currentList[rowIndex].qty = newQty;
      }
      return { ...prev, [activeQueue]: currentList };
    });
  };

  // Toggle unit on row (e.g. Dus -> Pcs)
  const toggleRowUnit = (rowIndex) => {
    const item = cart[rowIndex];
    if (!item) return;
    const product = products.find(p => p.id === item.productId);
    if (!product || product.units.length <= 1) return;

    const currentUnitIdx = product.units.findIndex(u => u.unit === item.unit);
    const nextUnitIdx = (currentUnitIdx + 1) % product.units.length;
    const nextUnitObj = product.units[nextUnitIdx];
    const newPrice = activeMember 
      ? (nextUnitObj.prices.member || nextUnitObj.prices.eceran)
      : (nextUnitObj.prices[priceTier] || nextUnitObj.prices.eceran);

    setCartQueue(prev => {
      const currentList = [...prev[activeQueue]];
      currentList[rowIndex] = {
        ...item,
        unit: nextUnitObj.unit,
        multiplier: nextUnitObj.multiplier,
        barcode: nextUnitObj.barcode,
        price: newPrice,
        hpp: nextUnitObj.hpp
      };
      return { ...prev, [activeQueue]: currentList };
    });
  };

  // Remove row
  const removeRow = (rowIndex) => {
    setCartQueue(prev => {
      const updated = prev[activeQueue].filter((_, idx) => idx !== rowIndex);
      return { ...prev, [activeQueue]: updated };
    });
    setSelectedRowIndex(prev => Math.max(0, prev - 1));
  };

  // Clear cart
  const clearCart = () => {
    setCartQueue(prev => ({ ...prev, [activeQueue]: [] }));
    setTebusMurahClaimed(false);
  };

  // Member Authentication (Indomaret Poinku / Alfagift style)
  const handleCheckMember = (e) => {
    e.preventDefault();
    if (!memberPhone.trim()) return;

    if (memberPhone.startsWith('08') || memberPhone.length >= 4) {
      setActiveMember({
        phone: memberPhone,
        name: memberPhone === '08123456789' ? 'Bpk. Hendra S.' : 'Member Loyal Pak Noor',
        points: 4850,
        tier: 'Gold Member'
      });
      setPriceTier('member');
      soundFX.playBeep();
      alert(`Member Teridentifikasi: ${memberPhone === '08123456789' ? 'Bpk. Hendra S.' : 'Member Loyal Pak Noor'}\nTier: Gold Member (Harga Member Aktif Otomatis!)`);
    }
  };

  // Claim Tebus Murah (Alfamart/Indomaret signature)
  const handleClaimTebusMurah = () => {
    const sania = products.find(p => p.id === 'PRD-001');
    if (!sania) return;

    // Add 1 Pcs Sania at discount price Rp 32.000
    addItemToCart(sania, 'Pcs', 1);
    setTebusMurahClaimed(true);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalTax = cart.reduce((sum, item) => sum + ((item.price * item.qty) * (item.tax || 0)), 0);
  const totalAmount = subtotal + totalTax;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // PWP / Tebus Murah threshold (Belanja > 50.000)
  const isEligibleTebusMurah = totalAmount >= 50000 && !tebusMurahClaimed;

  return (
    <div className="max-w-[1920px] mx-auto p-3.5 space-y-3">
      
      {/* CASH DRAWER OPEN ALERT BANNER */}
      {drawerOpenNotice && (
        <div className="bg-amber-50 text-amber-900 border border-amber-300 px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-between shadow-sm animate-bounce">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-700" /> [SIMULASI F10] LACI KASIR TERBUKA (CASH DRAWER OPEN)
          </span>
          <span className="font-mono text-[11px] text-amber-800">Status: Solenoid Kick 24V Triggered</span>
        </div>
      )}

      {/* POS LAYOUT MODE SWITCHER (21ST.DEV SEGMENTED CONTROL) */}
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Store className="w-3.5 h-3.5" />
            </div>
            <span>Mode Tampilan:</span>
          </div>

          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setPosViewMode('retail')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                posViewMode === 'retail'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-500" />
              <span>Retail (Barcode & Keyboard)</span>
            </button>

            <button
              type="button"
              onClick={() => setPosViewMode('touchscreen')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                posViewMode === 'touchscreen'
                  ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Touchscreen Visual (Tablet / POS)</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSplitBillOpen(true)}
            disabled={cart.length === 0}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Pisahkan tagihan rombongan (Split Bill)"
          >
            <Split className="w-3.5 h-3.5 text-slate-500" />
            <span>Split Bill (Pisah Tagihan)</span>
          </button>
        </div>
      </div>

      {posViewMode === 'touchscreen' ? (
        <TouchscreenPOSView
          products={products}
          setProducts={setProducts}
          activeWarehouse={activeWarehouse}
          cart={cart}
          addItemToCart={addItemToCart}
          updateRowQty={updateRowQty}
          removeRow={removeRow}
          clearCart={clearCart}
          priceTier={priceTier}
          setPriceTier={setPriceTier}
          activeQueue={activeQueue}
          setActiveQueue={setActiveQueue}
          cartQueue={cartQueue}
          activeMember={activeMember}
          setActiveMember={setActiveMember}
          onOpenSplitBill={() => setIsSplitBillOpen(true)}
          onCheckout={onCheckout}
          totalAmount={totalAmount}
          totalItems={totalItems}
          subtotal={subtotal}
          totalTax={totalTax}
          onOpenScanner={() => setIsCameraScannerOpen(true)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
          selectedCustomer={selectedCustomer}
          onOpenPettyCash={() => setIsPettyCashModalOpen(true)}
          onOpenPickingList={() => setIsDraftPickingListOpen(true)}
        />
      ) : (
        <>
          {/* TOP SCANNER & LIVE SCAN BANNER (Clean Light Theme) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* Scanner Form & Quick Input (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-mono font-extrabold text-emerald-800 tracking-wider">
                READY SCANNER BARCODE / PLU
              </span>
            </div>
            
            {/* Quick Multiplier format info */}
            <span className="text-[10.5px] text-slate-600 font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
              Format Kuantitas: <strong>[Qty]*[Barcode]</strong> (Contoh: <strong>3*8991234001001</strong>)
            </span>
          </div>

          <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-6 h-6 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan Barcode atau masukkan Kode PLU barang..."
                className="w-full bg-slate-50 text-slate-900 font-mono font-extrabold text-base pl-11 pr-24 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-xs rounded-lg shadow-sm transition"
              >
                ENTER ↵
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              title="Cari PLU Barang [F1]"
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>Cari [F1]</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraScannerOpen(true)}
              className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              title="Scan Barcode Menggunakan Kamera Laptop / HP"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Scan Kamera</span>
            </button>
          </form>

          {/* Quick Demo Barcodes */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Demo Barcode:
            </span>
            <button
              type="button"
              onClick={() => addItemToCart(products[0], 'Dus', 1)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono transition"
            >
              Sania Dus (8991234001001)
            </button>
            <button
              type="button"
              onClick={() => addItemToCart(products[1], 'Pack (10)', 2)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono transition"
            >
              Indomie 2xPack (899886611002)
            </button>
            <button
              type="button"
              onClick={() => addItemToCart(products[2], 'Karung', 1)}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-mono transition"
            >
              Beras 5kg (899554422001)
            </button>
          </div>
        </div>

        {/* GIANT TOTAL LED BOX (Executive Dual Emerald Gradient & Ambient Glow) (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-emerald-700/20 border border-emerald-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between text-xs relative z-10">
            <span className="font-extrabold uppercase tracking-widest text-emerald-200 text-[10.5px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              TOTAL BELANJA (RP)
            </span>
            <span className="font-mono text-xs font-black text-white bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/20">
              {totalItems} ITEM
            </span>
          </div>

          <div className="text-3xl xl:text-4xl font-mono font-black text-white tracking-tight my-2 drop-shadow-sm relative z-10">
            Rp {totalAmount.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center justify-between text-xs text-emerald-100 pt-2 border-t border-white/15 relative z-10">
            <span className="flex items-center gap-1">
              <span className="text-emerald-300 font-medium">Antrean:</span>
              <strong className="text-white font-bold bg-white/15 px-2 py-0.5 rounded-md">{activeQueue}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-emerald-300 font-medium">Tier:</span>
              <strong className="text-emerald-200 uppercase font-black bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-400/30">{priceTier}</strong>
            </span>
          </div>
        </div>

      </div>

      {/* CUSTOMER SELECTOR & PETTY CASH SHORTCUT BAR */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/80 border border-slate-200 p-2.5 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCustomerModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition cursor-pointer"
            title="Kelola & Pilih Pelanggan (Limit Piutang & Jatuh Tempo)"
          >
            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span>Pelanggan: <strong className="text-emerald-800">{selectedCustomer?.name || 'Pelanggan Umum'}</strong></span>
            {selectedCustomer?.creditLimit > 0 ? (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                (selectedCustomer.status === 'OVERDUE' || (selectedCustomer.dueDate && new Date(selectedCustomer.dueDate) < new Date()))
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {selectedCustomer.status === 'OVERDUE' ? '⚠️ Overdue (Kredit Terkunci)' : `Plafon: Rp ${selectedCustomer.creditLimit.toLocaleString('id-ID')}`}
              </span>
            ) : (
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Tunai</span>
            )}
            <span className="text-[10px] text-emerald-700 underline font-bold ml-1">+ Ganti / Daftar</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPettyCashModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 shadow-2xs transition cursor-pointer"
            title="Input Kas Kecil (Bensin armada, parkir, ongkir ekspedisi langsung dari kasir)"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>💸 Kas Kecil (Bensin/Parkir)</span>
          </button>
        </div>
      </div>

      {/* MEMBER & TEBUS MURAH RETAIL PROMO STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Member Input Bar */}
        <div className="md:col-span-6 bg-white border border-slate-200 p-2.5 rounded-xl flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 flex-1">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            {activeMember ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-emerald-800">{activeMember.name}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-bold">
                  {activeMember.tier} ({activeMember.points} Poin)
                </span>
                <button 
                  onClick={() => { setActiveMember(null); setPriceTier('eceran'); }}
                  className="text-[10px] text-rose-600 hover:underline ml-2 font-bold"
                >
                  Logout Member
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckMember} className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Input No. HP Member (cth: 08123456789)..."
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="bg-slate-50 text-xs text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-300 w-full focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shrink-0 shadow-xs"
                >
                  Cek Member
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Promo Tebus Murah (Alfamart signature PWP) */}
        <div className="md:col-span-6 bg-amber-50/70 border border-amber-200 p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <div>
              <span className="font-extrabold text-amber-900 text-[11px] block">
                PROMO TEBUS MURAH (PWP):
              </span>
              <span className="text-[10.5px] text-amber-800">
                {totalAmount >= 50000 
                  ? 'Selamat! Belanja > Rp 50.000 berhak tebus Minyak Sania 2L seharga Rp 32.000!'
                  : `Tambah belanja Rp ${(50000 - totalAmount).toLocaleString('id-ID')} lagi untuk tebus murah!`}
              </span>
            </div>
          </div>

          {isEligibleTebusMurah && (
            <button
              onClick={handleClaimTebusMurah}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10.5px] rounded-lg shrink-0 shadow-xs"
            >
              Klaim Tebus Murah
            </button>
          )}
        </div>

      </div>

      {/* MAIN TRANSACTION LEDGER (Clean Table) & RIGHT FUNCTIONAL KEYPAD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        
        {/* LEFT PANE: High-Speed Cashier Ledger Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden min-h-[520px]">
          
          {/* Antrean Switcher Bar */}
          <div className="bg-gradient-to-r from-slate-50 via-slate-100/60 to-slate-50 px-4 py-3 border-b border-slate-200/90 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>Antrean Transaksi:</span>
              </span>
              <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl border border-slate-300/70">
                {['Antrean 1', 'Antrean 2', 'Antrean 3'].map(q => {
                  const count = cartQueue[q]?.length || 0;
                  const isSelected = activeQueue === q;
                  return (
                    <button
                      key={q}
                      onClick={() => setActiveQueue(q)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 scale-[1.02]'
                          : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      <span>{q}</span>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsDraftPickingListOpen(true)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition shadow-2xs cursor-pointer active:scale-95"
                  title="Cetak Struk Draf / Lembar Instruksi Picking Gudang untuk staf penyiapan barang"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cetak Draf (Picking List)</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span>Navigasi: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px]">↓</kbd></span>
              </div>
            </div>
          </div>

          {/* Table of Scanned Items with Product Images & Category Badges */}
          <div className="flex-1 overflow-y-auto max-h-[460px]">
            <table className="w-full text-left text-xs font-sans">
              <thead className="sticky top-0 bg-gradient-to-r from-slate-50 via-slate-100/80 to-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider border-b border-slate-200/90 z-10 shadow-2xs">
                <tr>
                  <th className="py-3 px-2 w-10 text-center">No</th>
                  <th className="py-3 px-2 w-16 text-center">Foto</th>
                  <th className="py-3 px-3">Nama & Kategori Barang</th>
                  <th className="py-3 px-2">PLU / Barcode</th>
                  <th className="py-3 px-2 text-center">Satuan (F3)</th>
                  <th className="py-3 px-2 text-center">Qty (F2)</th>
                  <th className="py-3 px-2 text-right">Harga (Rp)</th>
                  <th className="py-3 px-2 text-right">Diskon</th>
                  <th className="py-3 px-3 text-right">Subtotal (Rp)</th>
                  <th className="py-3 px-2 w-12 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-20 text-center text-slate-400 font-sans">
                      <Barcode className="w-12 h-12 mx-auto text-slate-300 mb-2 stroke-1" />
                      <div className="text-sm font-extrabold text-slate-600">Belum Ada Barang Di-Scan</div>
                      <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        Arahkan scanner barcode, klik demo barcode di atas, atau ketik kode PLU barang.
                      </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => {
                    const isSelected = selectedRowIndex === idx;
                    const rowTotal = item.price * item.qty;
                    const itemImage = item.image 
                      || DEFAULT_PRODUCT_IMAGES[item.productId] 
                      || BARCODE_IMAGE_MAP[item.barcode] 
                      || products?.find(p => p.id === item.productId)?.image 
                      || '/products/indomie.jpg';
                    const catChip = CATEGORY_CHIPS[item.category] || CATEGORY_CHIPS['Umum'];

                    return (
                      <tr 
                        key={item.id}
                        onClick={() => setSelectedRowIndex(idx)}
                        className={`group cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-emerald-50/80 border-l-4 border-emerald-600' 
                            : 'hover:bg-slate-50/90 text-slate-800'
                        }`}
                      >
                        {/* No */}
                        <td className="py-2.5 px-2 text-center">
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center mx-auto text-[11px] font-mono font-bold ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>

                        {/* Foto Produk Squircle */}
                        <td className="py-2.5 px-2 text-center">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs overflow-hidden p-1 flex items-center justify-center shrink-0 mx-auto group-hover:scale-105 transition-transform">
                            <img 
                              src={itemImage} 
                              alt={item.name} 
                              className="w-full h-full object-contain"
                              onError={(e) => { e.target.src = '/products/indomie.jpg'; }}
                            />
                          </div>
                        </td>

                        {/* Nama Barang, Category Badge & PPN Pill */}
                        <td className="py-2.5 px-3">
                          <div className="flex flex-col gap-1 min-w-[150px]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-sans font-black text-slate-900 text-xs leading-tight">
                                {item.name}
                              </span>
                              {item.tax > 0 && (
                                <span className="text-[9px] font-black text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.2 rounded-md">
                                  PPN 11%
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border ${catChip.bg} ${catChip.text} ${catChip.border}`}>
                                {item.category || 'Retail'}
                              </span>
                              {item.brand && (
                                <span className="text-[9.5px] text-slate-400 font-medium">
                                  {item.brand}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* PLU / Barcode */}
                        <td className="py-2.5 px-2">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-100/90 px-2 py-1 rounded-lg border border-slate-200">
                            <Barcode className="w-3 h-3 text-slate-400" />
                            <span>{item.barcode}</span>
                          </span>
                        </td>

                        {/* Satuan (F3) */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleRowUnit(idx); }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold shadow-2xs transition active:scale-95 cursor-pointer whitespace-nowrap"
                            title="Tekan F3 untuk ganti satuan (Eceran / Karton)"
                          >
                            {item.unit} {item.multiplier > 1 && <span className="text-emerald-600 font-normal">({item.multiplier}x)</span>}
                          </button>
                        </td>

                        {/* Qty (F2) Stepper */}
                        <td className="py-2.5 px-2 text-center">
                          <div className="inline-flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200 shadow-2xs">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); updateRowQty(idx, item.qty - 1); }}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition shadow-2xs active:scale-90 cursor-pointer text-xs"
                              title="Kurangi Qty"
                            >
                              -
                            </button>
                            <span className="font-mono font-black text-slate-900 px-2 text-xs">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); updateRowQty(idx, item.qty + 1); }}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-slate-700 font-black flex items-center justify-center transition shadow-2xs active:scale-90 cursor-pointer text-xs"
                              title="Tambah Qty"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Harga (Rp) */}
                        <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-800 text-xs">
                          {item.price.toLocaleString('id-ID')}
                        </td>

                        {/* Diskon */}
                        <td className="py-2.5 px-2 text-right">
                          {item.discount > 0 ? (
                            <span className="font-mono text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                              -{(item.discount * item.qty).toLocaleString('id-ID')}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-mono">-</span>
                          )}
                        </td>

                        {/* Subtotal (Rp) */}
                        <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-sm tracking-tight">
                          Rp {rowTotal.toLocaleString('id-ID')}
                        </td>

                        {/* Aksi */}
                        <td className="py-2.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeRow(idx); }}
                            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 flex items-center justify-center transition shadow-2xs mx-auto cursor-pointer"
                            title="Hapus / Void baris ini (F7)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Ledger Bottom Summary Bar with High-Contrast Highlights */}
          <div className="bg-gradient-to-r from-slate-50 via-slate-100/70 to-slate-50 p-3.5 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="text-slate-700 flex flex-wrap items-center gap-3">
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                Total Item: <strong className="text-slate-900 font-black">{totalItems} Pcs</strong>
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                Subtotal: <strong className="text-slate-900 font-black">Rp {subtotal.toLocaleString('id-ID')}</strong>
              </span>
              {totalTax > 0 && (
                <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200 shadow-2xs">
                  PPN 11%: <strong className="text-sky-900 font-black">+Rp {totalTax.toLocaleString('id-ID')}</strong>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-extrabold uppercase text-[11px] tracking-wider">TOTAL AKHIR:</span>
              <span className="text-lg sm:text-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-700 px-3.5 py-1 rounded-xl shadow-xs border border-emerald-500/40">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT PANE: Alfamart / Indomaret Function Keypad & Actions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          
          {/* Main Action: BAYAR / CHECKOUT (F9) */}
          <button
            onClick={() => onCheckout(cart, totalAmount, activeQueue)}
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <CreditCard className="w-5 h-5" />
            <span>BAYAR / CHECKOUT [F9]</span>
          </button>

          {/* 12-Button POS Functional Hotkey Pad */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
              Papan Tombol Fungsi Kasir (Function Pad):
            </span>

            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-blue-700">F1</span>
                <span className="text-[10.5px]">Cari PLU</span>
              </button>

              <button
                onClick={() => {
                  if (cart[selectedRowIndex]) {
                    const newQty = prompt('Masukkan Qty:', cart[selectedRowIndex].qty);
                    if (newQty && !isNaN(newQty)) updateRowQty(selectedRowIndex, Number(newQty));
                  }
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-blue-700">F2</span>
                <span className="text-[10.5px]">Ubah Qty</span>
              </button>

              <button
                onClick={() => toggleRowUnit(selectedRowIndex)}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-blue-700">F3</span>
                <span className="text-[10.5px]">Ganti Satuan</span>
              </button>

              <button
                onClick={() => {
                  const nextQueue = activeQueue === 'Antrean 1' ? 'Antrean 2' : activeQueue === 'Antrean 2' ? 'Antrean 3' : 'Antrean 1';
                  setActiveQueue(nextQueue);
                }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-amber-700">F5</span>
                <span className="text-[10.5px]">Hold Antrean</span>
              </button>

              <button
                onClick={() => removeRow(selectedRowIndex)}
                disabled={cart.length === 0}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 flex flex-col items-center gap-1 transition disabled:opacity-30 shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-rose-700">F7</span>
                <span className="text-[10.5px]">Void Baris</span>
              </button>

              <button
                onClick={onOpenCustomerDisplay}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-emerald-700">F8</span>
                <span className="text-[10.5px]">Layar Pembeli</span>
              </button>

              <button
                onClick={triggerCashDrawer}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-amber-700">F10</span>
                <span className="text-[10.5px]">Buka Laci</span>
              </button>

              <button
                onClick={onReprintLast}
                disabled={!lastTransaction}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex flex-col items-center gap-1 transition disabled:opacity-30 shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-blue-700">F11</span>
                <span className="text-[10.5px]">Reprint Struk</span>
              </button>

              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 flex flex-col items-center gap-1 transition disabled:opacity-30 shadow-2xs"
              >
                <span className="kbd-badge text-[9px] text-rose-700">ESC</span>
                <span className="text-[10.5px]">Batal Semua</span>
              </button>
            </div>
          </div>

          {/* Quick Price Tier Radio buttons */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <span className="font-extrabold text-slate-500 uppercase text-[10px]">Level Harga:</span>
            <div className="flex gap-1">
              {['eceran', 'grosir1', 'grosir2', 'member'].map(t => (
                <button
                  key={t}
                  onClick={() => setPriceTier(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                    priceTier === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'grosir1' ? 'G1' : t === 'grosir2' ? 'G2' : t}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
      </>
      )}

      {/* PLU / PRODUCT SEARCH MODAL (F1) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 p-5 shadow-2xl flex flex-col max-h-[80vh]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Cari PLU / Katalog Barang [F1]</h3>
              </div>
              <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded font-bold text-xs"
              >
                ESC
              </button>
            </div>

            <input
              type="text"
              autoFocus
              value={modalSearchQuery}
              onChange={(e) => setModalSearchQuery(e.target.value)}
              placeholder="Ketik nama produk, brand, barcode, atau supplier..."
              className="w-full bg-slate-50 text-slate-900 font-bold p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 mb-3 text-xs"
            />

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
              {products
                .filter(p => {
                  const q = modalSearchQuery.toLowerCase();
                  return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.units.some(u => u.barcode.includes(q));
                })
                .map(p => (
                  <div 
                    key={p.id}
                    className="py-2.5 px-3 hover:bg-slate-50 rounded-xl flex items-center justify-between transition cursor-pointer"
                    onClick={() => {
                      addItemToCart(p, p.units[0].unit, 1);
                      setIsSearchModalOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[10.5px] text-slate-500">
                        {p.brand} • Stok di {activeWarehouse}: <strong className="text-emerald-700">{p.stock[activeWarehouse]} {p.baseUnit}</strong>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-extrabold text-emerald-700 text-sm">
                        Rp {p.units[0].prices[priceTier]?.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        + Tambah ke Kasir
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* CAMERA BARCODE SCANNER MODAL */}
      <CameraBarcodeScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={handleCameraScanSuccess}
        title="Scan Barcode Kasir via Kamera / HP"
      />

      {/* SPLIT BILL MODAL (GAYA VIDEO WHATSAPP) */}
      <SplitBillModal
        isOpen={isSplitBillOpen}
        onClose={() => setIsSplitBillOpen(false)}
        cart={cart}
        totalAmount={totalAmount}
        onProceedSplitBill={handleProceedSplitBill}
      />

      {/* CUSTOMER MANAGEMENT & CREDIT LIMIT MODAL */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customers={customers}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={onSelectCustomer}
        onAddCustomer={onAddCustomer}
      />

      {/* PETTY CASH / BIAYA KASIR MODAL */}
      <PettyCashModal
        isOpen={isPettyCashModalOpen}
        onClose={() => setIsPettyCashModalOpen(false)}
        activeCashier={shiftData?.cashier || 'Kasir 1'}
        activeTerminal={activeTerminal}
        onAddExpense={onAddExpense}
        recentExpenses={expenses}
      />

      {/* DRAFT PICKING LIST MODAL (HOLD BILL) */}
      <DraftPickingListModal
        isOpen={isDraftPickingListOpen}
        onClose={() => setIsDraftPickingListOpen(false)}
        draftData={{
          draftId: `DRF-${activeQueue.replace(/\s+/g, '')}-${Date.now().toString().slice(-4)}`,
          customer: selectedCustomer || 'Pelanggan Umum',
          items: cart,
          total: totalAmount,
          time: new Date().toLocaleTimeString('id-ID') + ' WIB',
          cashier: shiftData?.cashier || 'Kasir 1'
        }}
        activeTerminal={activeTerminal}
        activeCashier={shiftData?.cashier || 'Kasir 1'}
      />

    </div>
  );
}
