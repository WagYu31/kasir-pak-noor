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
  Store
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import CameraBarcodeScannerModal from './CameraBarcodeScannerModal';
import TouchscreenPOSView from './TouchscreenPOSView';
import SplitBillModal from './SplitBillModal';

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
  setLastScannedItem
}) {
  // Barcode / Scanner state
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Antrean / Hold Orders
  const [cartQueue, setCartQueue] = useState({
    'Antrean 1': [],
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
        const newItem = {
          id: `${product.id}-${unitObj.unit}-${Date.now()}`,
          productId: product.id,
          name: product.name,
          image: product.image,
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

      {/* POS LAYOUT MODE SWITCHER (CLEAN CORPORATE RETAIL BAR) */}
      <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
            <Store className="w-4 h-4 text-emerald-700" />
            <span>Mode Tampilan:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setPosViewMode('retail')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                posViewMode === 'retail'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-slate-600" />
              <span>Retail (Barcode & Keyboard)</span>
            </button>

            <button
              type="button"
              onClick={() => setPosViewMode('touchscreen')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                posViewMode === 'touchscreen'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            title="Pisahkan tagihan rombongan (Split Bill)"
          >
            <Split className="w-3.5 h-3.5 text-slate-600" />
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

        {/* GIANT TOTAL LED BOX (Clean Crisp Light Look) (4 cols) */}
        <div className="lg:col-span-4 bg-white border-2 border-emerald-500 rounded-2xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-widest text-slate-500 text-[10px]">
              TOTAL BELANJA (Rp)
            </span>
            <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {totalItems} ITEM
            </span>
          </div>

          <div className="text-3xl xl:text-4xl font-mono font-black text-emerald-700 tracking-tight my-1">
            Rp {totalAmount.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
            <span>Antrean: <strong className="text-slate-800">{activeQueue}</strong></span>
            <span>Tier: <strong className="text-emerald-700 uppercase font-bold">{priceTier}</strong></span>
          </div>
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
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden min-h-[520px]">
          
          {/* Antrean Switcher Bar */}
          <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Antrean Transaksi:</span>
              {['Antrean 1', 'Antrean 2', 'Antrean 3'].map(q => {
                const count = cartQueue[q]?.length || 0;
                const isSelected = activeQueue === q;
                return (
                  <button
                    key={q}
                    onClick={() => setActiveQueue(q)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <span>{q}</span>
                    {count > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Gunakan tombol <kbd className="kbd-badge">↑</kbd> <kbd className="kbd-badge">↓</kbd> untuk memilih baris</span>
            </div>
          </div>

          {/* Table of Scanned Items */}
          <div className="flex-1 overflow-y-auto max-h-[460px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200 z-10">
                <tr>
                  <th className="p-2.5 w-10 text-center">No</th>
                  <th className="p-2.5">PLU / Barcode</th>
                  <th className="p-2.5">Nama Barang</th>
                  <th className="p-2.5 text-center">Satuan (F3)</th>
                  <th className="p-2.5 text-center">Qty (F2)</th>
                  <th className="p-2.5 text-right">Harga (Rp)</th>
                  <th className="p-2.5 text-right">Diskon</th>
                  <th className="p-2.5 text-right">Subtotal (Rp)</th>
                  <th className="p-2.5 w-10 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-20 text-center text-slate-400 font-sans">
                      <Barcode className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                      <div className="text-sm font-bold text-slate-600">Belum Ada Barang Di-Scan</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Arahkan scanner barcode atau ketik PLU barang pada input di atas.
                      </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item, idx) => {
                    const isSelected = selectedRowIndex === idx;
                    const rowTotal = item.price * item.qty;
                    return (
                      <tr 
                        key={item.id}
                        onClick={() => setSelectedRowIndex(idx)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-emerald-50/80 border-l-4 border-emerald-600 text-slate-900 font-bold' 
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <td className="p-2.5 text-center text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 text-[11px] text-slate-500">{item.barcode}</td>
                        <td className="p-2.5 font-sans font-bold text-slate-900">
                          {item.name}
                          {item.tax > 0 && <span className="text-[9px] text-blue-600 ml-1.5">[PPN]</span>}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); toggleRowUnit(idx); }}
                            className="bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-slate-200 px-2 py-0.5 rounded text-[10.5px] font-bold"
                            title="Tekan F3 untuk ganti satuan"
                          >
                            {item.unit} {item.multiplier > 1 && `(${item.multiplier}x)`}
                          </button>
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            <button
                              onClick={(e) => { e.stopPropagation(); updateRowQty(idx, item.qty - 1); }}
                              className="text-slate-500 hover:text-slate-900 px-1 font-bold"
                            >
                              -
                            </button>
                            <span className="font-extrabold text-slate-900 px-1">{item.qty}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateRowQty(idx, item.qty + 1); }}
                              className="text-slate-500 hover:text-slate-900 px-1 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono text-slate-800">
                          {item.price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 text-right text-amber-700 font-mono font-bold">
                          {item.discount > 0 ? `-${(item.discount * item.qty).toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="p-2.5 text-right font-mono font-extrabold text-emerald-700 text-sm">
                          {rowTotal.toLocaleString('id-ID')}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); removeRow(idx); }}
                            className="text-slate-400 hover:text-rose-600 transition"
                            title="Void baris ini (F7)"
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

          {/* Ledger Bottom Summary Bar */}
          <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
            <div className="text-slate-600 flex items-center gap-4">
              <span>Item: <strong className="text-slate-900">{totalItems} Pcs</strong></span>
              <span>Subtotal: <strong className="text-slate-900">Rp {subtotal.toLocaleString('id-ID')}</strong></span>
              {totalTax > 0 && (
                <span>PPN 11%: <strong className="text-blue-700">+Rp {totalTax.toLocaleString('id-ID')}</strong></span>
              )}
            </div>

            <div className="text-right">
              <span className="text-slate-500 mr-2 font-bold">TOTAL AKHIR:</span>
              <span className="text-lg font-black text-emerald-700">
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

    </div>
  );
}
