import React, { useState, useMemo } from 'react';
import { 
  Warehouse, 
  ArrowRightLeft, 
  ClipboardCheck, 
  AlertTriangle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  FileText, 
  Search, 
  Filter, 
  Boxes, 
  FileCheck, 
  RotateCcw, 
  DollarSign, 
  Calendar, 
  Printer, 
  X, 
  AlertCircle,
  ShieldCheck,
  Building2,
  ChevronRight,
  TrendingDown,
  Tag,
  Barcode,
  MapPin,
  Eye,
  Layers,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Edit2,
  Trash2,
  Lock,
  QrCode,
  FileSpreadsheet
} from 'lucide-react';
import { soundFX } from '../utils/audio';
import { INITIAL_RACKS } from '../data/mockData';
import { exportStockToExcel } from '../utils/exportExcel';

export default function InventoryManager({ 
  products, 
  setProducts, 
  warehouses, 
  transfers, 
  setTransfers,
  inboundPOs = [],
  setInboundPOs,
  returns = [],
  setReturns,
  salesHistory = [],
  onViewTransactionAudit,
  currentRole = 'OWNER'
}) {
  // Navigation: 6 Core WMS Workflows
  // 'stock', 'planogram', 'inbound', 'transfers', 'opname', 'returns', 'shelftags'
  const [activeSubTab, setActiveSubTab] = useState('stock'); 
  const [selectedWarehouseFilter, setSelectedWarehouseFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'FEFO', 'LOW_STOCK', 'HIGH_SHRINKAGE', 'DC_CARTON'
  const [selectedRackZone, setSelectedRackZone] = useState('ALL');

  // Inbound PO State
  const [localInbounds, setLocalInbounds] = useState(inboundPOs.length > 0 ? inboundPOs : [
    {
      id: 'PO-202610-001',
      doNumber: 'DO-IND-882910',
      supplier: 'PT Indomarco Adi Prima',
      date: '2026-10-11 14:20',
      destWarehouse: 'WH-02',
      destWarehouseName: 'Gudang Pusat (DC)',
      receiver: 'Agus P.',
      totalInvoice: 4400000,
      status: 'RECEIVED',
      items: [
        { productId: 'PRD-002', name: 'Indomie Goreng Spesial 85g', unit: 'Karton', qty: 40, hpp: 110000, subtotal: 4400000 }
      ]
    },
    {
      id: 'PO-202610-002',
      doNumber: 'SJ-WLM-192837',
      supplier: 'PT Berkah Pangan Mandiri',
      date: '2026-10-12 10:15',
      destWarehouse: 'WH-02',
      destWarehouseName: 'Gudang Pusat (DC)',
      receiver: 'Agus P.',
      totalInvoice: 3840000,
      status: 'WAITING_RECEIVE',
      items: [
        { productId: 'PRD-001', name: 'Minyak Goreng Sania 2L', unit: 'Dus', qty: 20, hpp: 192000, subtotal: 3840000 }
      ]
    }
  ]);

  // Returns State
  const [localReturns, setLocalReturns] = useState(returns.length > 0 ? returns : [
    {
      id: 'RET-202610-01',
      date: '2026-10-10',
      supplier: 'PT Ultrajaya Milk Industry',
      productName: 'Susu UHT Ultra Milk Cokelat 1L',
      qty: 3,
      unit: 'Pcs',
      type: 'BKL (Kemasan Bocor/Penyok)',
      reason: 'Kemasan penyok bocor saat pengiriman distributor',
      totalClaim: 49500,
      status: 'DIPROSES_SUPPLIER'
    }
  ]);

  // Barcode Verification Scanner Simulator for Inbound
  const [scannedBarcodes, setScannedBarcodes] = useState({});
  const [activeScanningPO, setActiveScanningPO] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Stock Opname State
  const [opnameMode, setOpnameMode] = useState('ALL'); // 'ALL' vs 'HIGH_SHRINKAGE'
  const [opnameAudit, setOpnameAudit] = useState({});
  const [opnameReasons, setOpnameReasons] = useState({});

  // Shelf Tag Generator State
  const [selectedTagProducts, setSelectedTagProducts] = useState(products.map(p => p.id));
  const [tagPrintFormat, setTagPrintFormat] = useState('70x35'); // 70x35mm standard

  // Modal States
  const [isInboundModalOpen, setIsInboundModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isKoliMode, setIsKoliMode] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // Rack Management States (Peta Planogram)
  const [racks, setRacks] = useState(INITIAL_RACKS);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [editingRackId, setEditingRackId] = useState(null);
  const [rackFormData, setRackFormData] = useState({
    code: 'Rak E-01..02',
    zone: 'Lorong E (Snack & Biskuit)',
    warehouse: 'WH-01',
    category: 'Makanan Instan',
    capacity: 80,
    cctv: false,
    note: 'Display aneka biskuit kaleng & wafer'
  });

  // Relokasi Barang ke Rak State
  const [isRelocateModalOpen, setIsRelocateModalOpen] = useState(false);
  const [relocateProduct, setRelocateProduct] = useState(products[0] || null);
  const [targetRackToko, setTargetRackToko] = useState(products[0]?.rack ? products[0].rack['WH-01'] : 'Rak A-02 (Sembako)');
  const [targetRackDC, setTargetRackDC] = useState(products[0]?.rack ? products[0].rack['WH-02'] : 'Pallet P-01 (DC)');

  // Print Barcode Label Tiang Rak State
  const [isShelfBarcodeModalOpen, setIsShelfBarcodeModalOpen] = useState(false);

  // Stock Opname: Lacak Penjualan Kasir untuk SKU Ini
  const [skuSalesAuditModal, setSkuSalesAuditModal] = useState(null);

  // Forms
  const [inboundForm, setInboundForm] = useState({
    supplier: 'PT Indomarco Adi Prima',
    doNumber: '',
    productId: products[0]?.id || '',
    unitName: products[0]?.units[0]?.unit || 'Dus',
    qty: 10,
    destWarehouse: 'WH-02',
    batchNo: `BCH-${Date.now().toString().slice(-4)}`,
    expiryDate: '2027-12-31'
  });

  const [transferForm, setTransferForm] = useState({
    from: 'WH-02',
    to: 'WH-01',
    productId: products[0]?.id || '',
    unitName: products[0]?.units[0]?.unit || 'Dus',
    qty: 5,
    driver: 'Joko W. (Mobil Box B 9120 KSR)',
    notes: 'Pengisian stok display toko reguler'
  });

  const [returnForm, setReturnForm] = useState({
    productId: products[0]?.id || '',
    qty: 1,
    unitName: 'Pcs',
    type: 'BRP (Barang Rusak Pabrik)',
    reason: 'Kemasan rusak / penyok bocor',
    supplier: products[0]?.supplier || ''
  });

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4500);
  };

  // Helper: Days until expiry
  const getDaysUntilExpiry = (expiryDateStr) => {
    if (!expiryDateStr) return 999;
    const now = new Date('2026-10-12');
    const exp = new Date(expiryDateStr);
    const diffTime = exp - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Executive Calculations
  const { totalValuation, valToko, valDC, totalStockPcs, fefoAlertCount, lowStockCount, inTransitCount, totalShrinkageLoss } = useMemo(() => {
    let totVal = 0;
    let vToko = 0;
    let vDC = 0;
    let totPcs = 0;
    let fefoCount = 0;
    let lowCount = 0;

    products.forEach(p => {
      const stockToko = p.stock['WH-01'] || 0;
      const stockDC = p.stock['WH-02'] || 0;
      const baseHpp = p.units.find(u => u.multiplier === 1)?.hpp || (p.units[0].hpp / p.units[0].multiplier);

      vToko += stockToko * baseHpp;
      vDC += stockDC * baseHpp;
      totVal += (stockToko + stockDC) * baseHpp;
      totPcs += (stockToko + stockDC);

      if (stockToko <= p.minStock) lowCount++;
      const days = getDaysUntilExpiry(p.expiryDate);
      if (days <= 60) fefoCount++;
    });

    const inTransit = transfers.filter(t => t.status === 'IN-TRANSIT').length;

    // Calculate Shrinkage Loss in Opname
    let shrinkageLoss = 0;
    products.forEach(p => {
      const sys = p.stock['WH-01'] || 0;
      const phys = opnameAudit[`${p.id}-WH-01`] !== undefined ? opnameAudit[`${p.id}-WH-01`] : sys;
      const diff = phys - sys;
      if (diff < 0) {
        const baseHpp = p.units.find(u => u.multiplier === 1)?.hpp || 20000;
        shrinkageLoss += Math.abs(diff) * baseHpp;
      }
    });

    return {
      totalValuation: totVal,
      valToko: vToko,
      valDC: vDC,
      totalStockPcs: totPcs,
      fefoAlertCount: fefoCount,
      lowStockCount: lowCount,
      inTransitCount: inTransit,
      totalShrinkageLoss: shrinkageLoss
    };
  }, [products, transfers, opnameAudit]);

  // Filter products for stock table & planogram
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(q) || 
                          p.brand.toLowerCase().includes(q) || 
                          p.category.toLowerCase().includes(q) ||
                          (p.rack && (p.rack['WH-01']?.toLowerCase().includes(q) || p.rack['WH-02']?.toLowerCase().includes(q)));
      
      if (!matchSearch) return false;

      // Filter Mode
      if (filterMode === 'FEFO') {
        const days = getDaysUntilExpiry(p.expiryDate);
        if (days > 60) return false;
      } else if (filterMode === 'LOW_STOCK') {
        const stockToko = p.stock['WH-01'] || 0;
        if (stockToko > p.minStock) return false;
      } else if (filterMode === 'HIGH_SHRINKAGE') {
        if (!p.isHighShrinkage) return false;
      } else if (filterMode === 'DC_CARTON') {
        const stockDC = p.stock['WH-02'] || 0;
        if (stockDC <= 0) return false;
      }

      // Rack Zone Filter
      if (selectedRackZone !== 'ALL') {
        const rToko = p.rack ? p.rack['WH-01'] : '';
        const rDC = p.rack ? p.rack['WH-02'] : '';
        if (!rToko.includes(selectedRackZone) && !rDC.includes(selectedRackZone)) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, filterMode, selectedRackZone]);

  // Handle Verify PO Inbound
  const handleVerifyInbound = (poId) => {
    const po = localInbounds.find(p => p.id === poId);
    if (!po || po.status === 'RECEIVED') return;

    po.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      const unitObj = product?.units.find(u => u.unit === item.unit);
      const totalPcs = item.qty * (unitObj?.multiplier || 1);

      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          return {
            ...p,
            stock: {
              ...p.stock,
              [po.destWarehouse]: (p.stock[po.destWarehouse] || 0) + totalPcs
            }
          };
        }
        return p;
      }));
    });

    setLocalInbounds(prev => prev.map(p => p.id === poId ? { ...p, status: 'RECEIVED' } : p));
    showToast(`Verifikasi LPB ${po.doNumber} selesai. Stok telah ditambahkan ke ${po.destWarehouseName}`);
  };

  // Handle Create Transfer Mutasi
  const handleCreateTransfer = (e) => {
    e.preventDefault();
    if (transferForm.from === transferForm.to) {
      alert('Gudang asal dan tujuan tidak boleh sama!');
      return;
    }

    const product = products.find(p => p.id === transferForm.productId);
    const unitObj = product?.units.find(u => u.unit === transferForm.unitName) || product?.units[0];
    const totalPcsToTransfer = transferForm.qty * (unitObj?.multiplier || 1);

    const originStock = product?.stock[transferForm.from] || 0;
    if (totalPcsToTransfer > originStock) {
      alert(`Stok di gudang asal tidak mencukupi! Sisa stok: ${originStock} ${product?.baseUnit}`);
      return;
    }

    const newTransfer = {
      id: `SJ-MUTASI-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      from: transferForm.from,
      to: transferForm.to,
      fromName: warehouses.find(w => w.id === transferForm.from)?.name || transferForm.from,
      toName: warehouses.find(w => w.id === transferForm.to)?.name || transferForm.to,
      driver: transferForm.driver,
      dispatcher: 'Supervisor DC',
      receiver: 'Menunggu Penerimaan Toko',
      itemsCount: 1,
      totalPcs: totalPcsToTransfer,
      status: 'IN-TRANSIT',
      step: 3, // 1: Draft, 2: Loading, 3: In-Transit, 4: Received
      notes: transferForm.notes || 'Pengiriman stok display toko reguler',
      details: {
        productName: product?.name,
        qty: transferForm.qty,
        unit: transferForm.unitName,
        totalPcs: totalPcsToTransfer
      }
    };

    // Deduct stock from origin warehouse immediately
    setProducts(prev => prev.map(p => {
      if (p.id === transferForm.productId) {
        return {
          ...p,
          stock: {
            ...p.stock,
            [transferForm.from]: Math.max(0, (p.stock[transferForm.from] || 0) - totalPcsToTransfer)
          }
        };
      }
      return p;
    }));

    setTransfers(prev => [newTransfer, ...prev]);
    setIsTransferModalOpen(false);
    
    // Switch to transfers subtab so user directly sees the generated Surat Jalan!
    setActiveSubTab('transfers');
    
    // Play audio confirmation
    soundFX.playBeep();

    // Auto-open Document Preview for official Surat Jalan
    setPreviewDocument({
      title: 'SURAT JALAN PENGIRIMAN MUTASI ANTAR-GUDANG',
      docNo: newTransfer.id,
      refNo: `ARMADA: ${newTransfer.driver}`,
      date: newTransfer.date,
      entity: `${newTransfer.fromName} ➔ ${newTransfer.toName}`,
      items: [
        {
          name: product?.name,
          qty: transferForm.qty,
          unit: transferForm.unitName,
          subtotal: (product?.units.find(u => u.unit === transferForm.unitName)?.prices?.eceran || 0) * transferForm.qty
        }
      ]
    });

    showToast(`Surat Jalan ${newTransfer.id} berhasil diterbitkan. Status In-Transit via ${transferForm.driver}.`);
  };

  // Handle Save / Add / Edit Rack
  const handleSaveRack = (e) => {
    e.preventDefault();
    if (editingRackId) {
      setRacks(prev => prev.map(r => r.id === editingRackId ? { ...r, ...rackFormData } : r));
      showToast(`Data Rak ${rackFormData.code} berhasil diperbarui.`);
    } else {
      const newRack = {
        id: `RK-${Date.now().toString().slice(-4)}`,
        ...rackFormData
      };
      setRacks(prev => [...prev, newRack]);
      showToast(`Rak Baru ${rackFormData.code} berhasil ditambahkan ke ${rackFormData.warehouse === 'WH-01' ? 'Toko' : 'Gudang DC'}.`);
    }
    setIsRackModalOpen(false);
    soundFX.playBeep();
  };

  const handleDeleteRack = (rackId) => {
    const r = racks.find(x => x.id === rackId);
    if (confirm(`Apakah Anda yakin ingin menghapus rak ${r?.code}?`)) {
      setRacks(prev => prev.filter(x => x.id !== rackId));
      showToast(`Rak ${r?.code} telah dihapus.`);
    }
  };

  // Handle Save SKU Relocation to Rack
  const handleSaveRelocate = (e) => {
    e.preventDefault();
    if (!relocateProduct) return;

    setProducts(prev => prev.map(p => {
      if (p.id === relocateProduct.id) {
        return {
          ...p,
          rack: {
            'WH-01': targetRackToko,
            'WH-02': targetRackDC
          }
        };
      }
      return p;
    }));

    showToast(`Lokasi rak untuk ${relocateProduct.name} berhasil diubah ke [${targetRackToko}] & [${targetRackDC}].`);
    setIsRelocateModalOpen(false);
    soundFX.playBeep();
  };

  // Handle Receive Transfer at Store
  const handleReceiveTransfer = (transferId) => {
    const trf = transfers.find(t => t.id === transferId);
    if (!trf || trf.status === 'RECEIVED') return;

    if (trf.details?.productName) {
      const product = products.find(p => p.name === trf.details.productName);
      if (product) {
        setProducts(prev => prev.map(p => {
          if (p.id === product.id) {
            return {
              ...p,
              stock: {
                ...p.stock,
                [trf.to]: (p.stock[trf.to] || 0) + trf.details.totalPcs
              }
            };
          }
          return p;
        }));
      }
    }

    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'RECEIVED', step: 4, receiver: 'Bambang S. (Kepala Toko)' } : t));
    showToast(`Surat Jalan ${trf.id} selesai dibongkar. Stok fisik telah ditambahkan ke ${trf.toName}`);
  };

  // Handle Save Opname
  const handleSaveOpname = (productId, warehouseId, physicalQtyPcs) => {
    const product = products.find(p => p.id === productId);
    const reason = opnameReasons[`${productId}-${warehouseId}`] || 'Sesuai Fisik';

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stock: {
            ...p.stock,
            [warehouseId]: physicalQtyPcs
          }
        };
      }
      return p;
    }));

    showToast(`Audit Opname Disimpan: ${product.name} disesuaikan ke ${physicalQtyPcs} ${product.baseUnit} (Alasan: ${reason})`);
  };

  // Handle Create Return
  const handleCreateReturn = (e) => {
    e.preventDefault();
    const product = products.find(p => p.id === returnForm.productId);
    const unitHpp = product?.units.find(u => u.multiplier === 1)?.hpp || 20000;
    const totalClaim = returnForm.qty * unitHpp;

    const newReturn = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      supplier: returnForm.supplier || product?.supplier,
      productName: product?.name,
      qty: returnForm.qty,
      unit: returnForm.unitName,
      type: returnForm.type,
      reason: returnForm.reason,
      totalClaim,
      status: 'DIPROSES_SUPPLIER'
    };

    // Deduct stock from WH-01
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return {
          ...p,
          stock: {
            ...p.stock,
            'WH-01': Math.max(0, (p.stock['WH-01'] || 0) - returnForm.qty)
          }
        };
      }
      return p;
    }));

    setLocalReturns(prev => [newReturn, ...prev]);
    setIsReturnModalOpen(false);
    showToast(`Klaim retur ${newReturn.id} (${product.name}) diterbitkan ke ${newReturn.supplier}`);
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 space-y-4 pb-24">
      
      {/* ============================================================== */}
      {/* 1. EXECUTIVE WMS DASHBOARD BENTO CARDS                         */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* 1. EXECUTIVE WMS DASHBOARD BENTO CARDS                         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Total Valuation with breakdown */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Valuasi Total Aset Stok</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-slate-900">
            Rp {Math.round(totalValuation).toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span>Toko: <strong className="text-cyan-700">Rp {Math.round(valToko).toLocaleString('id-ID')}</strong></span>
            <span>DC: <strong className="text-blue-700">Rp {Math.round(valDC).toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {/* Metric 2: Total Fisik */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Total Unit Fisik</span>
            <Boxes className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-700">
            {totalStockPcs.toLocaleString('id-ID')} <span className="text-sm font-sans font-medium text-slate-500">Pcs</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {products.length} SKU Aktif di 2 Gudang
          </div>
        </div>

        {/* Metric 3: FEFO Expiry Alert (First Expired First Out) */}
        <button 
          onClick={() => {
            setActiveSubTab('stock');
            setFilterMode(filterMode === 'FEFO' ? 'ALL' : 'FEFO');
          }}
          className={`rounded-2xl p-4 border text-left transition shadow-xs ${
            fefoAlertCount > 0 
              ? 'border-rose-300 bg-rose-50/70 hover:bg-rose-50 ring-1 ring-rose-200' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">FEFO Alert (&lt; 60 Hari)</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-rose-700">
            {fefoAlertCount} SKU Kritis
          </div>
          <div className="text-[10.5px] text-rose-600 font-medium mt-1 flex items-center justify-between">
            <span>Perlu Retur / Diskon Segera</span>
            <span className="text-[9px] bg-rose-100 px-1.5 py-0.5 rounded text-rose-700 font-bold">Klik Filter</span>
          </div>
        </button>

        {/* Metric 4: Reorder Min Stock Alert */}
        <button
          onClick={() => {
            setActiveSubTab('stock');
            setFilterMode(filterMode === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK');
          }}
          className={`rounded-2xl p-4 border text-left transition shadow-xs ${
            lowStockCount > 0 
              ? 'border-amber-300 bg-amber-50/70 hover:bg-amber-50' 
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Stok Kritis (&lt; Min)</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-amber-700">
            {lowStockCount} SKU Menipis
          </div>
          <div className="text-[10.5px] text-amber-700 font-medium mt-1 flex items-center justify-between">
            <span>Segera Restock dari DC</span>
            <span className="text-[9px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-800 font-bold">Klik Filter</span>
          </div>
        </button>

        {/* Metric 5: Mobil Box In-Transit */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Mutasi Mobil Box</span>
            <Truck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-indigo-700">
            {inTransitCount} Armada
          </div>
          <div className="text-[10.5px] text-slate-500 font-medium mt-1">
            Gudang Pusat → Gudang Toko
          </div>
        </div>

      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. NAVIGATION BAR: 6 CORE WMS MODULES                          */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl p-2 flex flex-wrap items-center justify-between gap-3 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'stock', label: '1. Stok & Rak FIFO', icon: Warehouse },
            { id: 'planogram', label: '2. Peta Planogram Rak', icon: MapPin },
            { id: 'inbound', label: '3. Penerimaan Supplier (LPB)', icon: FileCheck },
            { id: 'transfers', label: '4. Mutasi & Surat Jalan', icon: ArrowRightLeft },
            { id: 'opname', label: '5. Stock Opname & BAST', icon: ClipboardCheck },
            { id: 'returns', label: '6. Retur Bad Stock (BS)', icon: RotateCcw },
            { id: 'shelftags', label: '🏷️ Cetak Label Rak', icon: Tag },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportStockToExcel(products, 'Laporan_Inventori_Stok_Gudang.xlsx')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title="Ekspor seluruh data stok dan valuasi ke format Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>
          {activeSubTab === 'inbound' && (
            <button
              onClick={() => setIsInboundModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input LPB / PO Masuk</span>
            </button>
          )}

          {activeSubTab === 'transfers' && (
            <button
              onClick={() => setIsTransferModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Terbitkan Surat Jalan</span>
            </button>
          )}

          {activeSubTab === 'returns' && (
            <button
              onClick={() => setIsReturnModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ajukan Retur Supplier</span>
            </button>
          )}

          {activeSubTab === 'shelftags' && (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak {selectedTagProducts.length} Label Rak</span>
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: STOK, LOKASI RAK & FIFO BATCH TRACKING                   */}
      {/* ============================================================== */}
      {activeSubTab === 'stock' && (
        <div className="space-y-3">
          
          {/* Controls: Search, Quick Filters & Warehouse Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU, Barcode, Nama Produk, atau Lokasi Rak..."
                className="w-full bg-white text-slate-900 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-xs placeholder:text-slate-400"
              />
            </div>

            {/* Quick Filter Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'ALL', label: 'Semua Produk' },
                { id: 'FEFO', label: '🚨 FEFO (<60 Hari)', count: fefoAlertCount, color: 'text-rose-600 border-rose-200' },
                { id: 'LOW_STOCK', label: '⚠️ Stok Menipis', count: lowStockCount, color: 'text-amber-600 border-amber-200' },
                { id: 'HIGH_SHRINKAGE', label: '💎 Rawan Hilang (Rokok/Susu)' },
                { id: 'DC_CARTON', label: '📦 Stok DC' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 shadow-xs ${
                    filterMode === f.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{f.label}</span>
                  {f.count !== undefined && f.count > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Warehouse Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold uppercase text-[10px]">Filter Gudang:</span>
              <button
                onClick={() => setSelectedWarehouseFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition shadow-xs ${
                  selectedWarehouseFilter === 'ALL'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Semua
              </button>
              {warehouses.map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWarehouseFilter(w.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition shadow-xs ${
                    selectedWarehouseFilter === w.id
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {w.code}
                </button>
              ))}
            </div>
          </div>

          {/* Master Warehouse Inventory Table */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">SKU & Nama Barang</th>
                  <th className="p-3">Lokasi Rak Toko / DC</th>
                  <th className="p-3">Batch & Expired (FEFO)</th>
                  <th className="p-3 text-right">WH-01 (Toko)</th>
                  <th className="p-3 text-right">WH-02 (DC Pusat)</th>
                  <th className="p-3 text-right">Total Stok Fisik</th>
                  <th className="p-3 text-right">Valuasi Aset</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(p => {
                  const stockToko = p.stock['WH-01'] || 0;
                  const stockPusat = p.stock['WH-02'] || 0;
                  const total = stockToko + stockPusat;
                  const baseHpp = p.units.find(u => u.multiplier === 1)?.hpp || (p.units[0].hpp / p.units[0].multiplier);
                  const totalAssetVal = total * baseHpp;
                  const isLow = stockToko <= p.minStock;
                  const daysExp = getDaysUntilExpiry(p.expiryDate);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                          {p.isHighShrinkage && (
                            <span className="text-[9px] bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 rounded font-extrabold">
                              Rawan Hilang
                            </span>
                          )}
                        </div>
                        <div className="text-[10.5px] text-slate-500">
                          {p.brand} • <span className="font-mono text-emerald-700 font-semibold">{p.id}</span> • {p.category}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Toko:</span>
                            <span className="font-mono text-cyan-800 font-bold">{p.rack ? p.rack['WH-01'] : 'Rak Display A'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">DC:</span>
                            <span className="font-mono text-blue-800">{p.rack ? p.rack['WH-02'] : 'Pallet P-01'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div className="text-slate-800 font-medium">{p.batchNo || 'BCH-2609'}</div>
                        <div className="text-[10px] mt-0.5">
                          {daysExp <= 30 ? (
                            <span className="bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold inline-flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" /> Exp: {p.expiryDate} ({daysExp} hari!)
                            </span>
                          ) : daysExp <= 90 ? (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded font-bold">
                              Exp: {p.expiryDate} ({daysExp} hari)
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">
                              Exp: {p.expiryDate || '2027-12-31'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">
                        {stockToko} {p.baseUnit}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">
                        {stockPusat} {p.baseUnit}
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-emerald-700">
                        {total} {p.baseUnit}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        Rp {Math.round(totalAssetVal).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Min Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Optimal
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setTransferForm({
                                from: 'WH-02',
                                to: 'WH-01',
                                productId: p.id,
                                unitName: p.units[0].unit,
                                qty: 2,
                                driver: 'Joko W. (Mobil Box B 9120 KSR)',
                                notes: `Restock segera ${p.name}`
                              });
                              setIsTransferModalOpen(true);
                            }}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 hover:text-emerald-700 rounded text-[10.5px] font-bold border border-slate-200 shadow-xs transition"
                            title="Buat Mutasi dari DC ke Toko"
                          >
                            Transfer ke Toko
                          </button>
                          
                          {daysExp <= 60 && (
                            <button
                              onClick={() => {
                                setReturnForm({
                                  productId: p.id,
                                  qty: Math.min(5, p.stock['WH-01'] || 1),
                                  unitName: p.baseUnit,
                                  type: 'BKE (Barang Kadaluarsa / FEFO)',
                                  reason: `Mendekati masa expired (${daysExp} hari tersisa)`,
                                  supplier: p.supplier
                                });
                                setIsReturnModalOpen(true);
                              }}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10.5px] font-bold border border-rose-200 transition"
                              title="Retur Produk Mendekati Expired"
                            >
                              Retur FEFO
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PETA PLANOGRAM & MANAJEMEN RAK GUDANG                    */}
      {/* ============================================================== */}
      {activeSubTab === 'planogram' && (
        <div className="space-y-4">
          {/* Header & Action Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Peta Planogram & Tata Letak Rak (Store Shelves & DC Pallets)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual layout minimarket & gudang logistik. Kelola kapasitas rak, relokasi SKU, dan cetak label barcode tiang rak.
                </p>
              </div>

              {/* Action Buttons for Rack Management */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingRackId(null);
                    setRackFormData({
                      code: `Rak ${String.fromCharCode(65 + Math.min(25, racks.filter(r => r.warehouse === 'WH-01').length))}-01..02`,
                      zone: 'Lorong Baru (Display)',
                      warehouse: 'WH-01',
                      category: 'Makanan Instan',
                      capacity: 50,
                      cctv: false,
                      note: 'Display gondola minimarket'
                    });
                    setIsRackModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="Tambah rak display gondola atau pallet baru"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah / Kelola Rak</span>
                </button>

                <button
                  onClick={() => {
                    const firstProd = products[0] || null;
                    setRelocateProduct(firstProd);
                    setTargetRackToko(firstProd?.rack ? firstProd.rack['WH-01'] : 'Rak A-02 (Sembako)');
                    setTargetRackDC(firstProd?.rack ? firstProd.rack['WH-02'] : 'Pallet P-01 (DC)');
                    setIsRelocateModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="Atur penempatan produk ke rak toko atau pallet DC"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>📦 Relokasi Barang ke Rak</span>
                </button>

                <button
                  onClick={() => setIsShelfBarcodeModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  title="Cetak label barcode untuk ditempel di tiang lorong rak"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🏷️ Cetak Barcode Tiang Rak</span>
                </button>
              </div>
            </div>

            {/* Filter Zona Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Filter Zona:</span>
              <button
                onClick={() => setSelectedRackZone('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  selectedRackZone === 'ALL'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua Zona ({racks.length} Rak)
              </button>
              {['Rak A', 'Rak B', 'Chiller', 'Rak D', 'Etalase Kasir', 'Pallet', 'Brankas'].map(zone => (
                <button
                  key={zone}
                  onClick={() => setSelectedRackZone(zone)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                    selectedRackZone === zone
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Visual Floor Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* AREA TOKO DEPAN (FRONT STORE - WH-01) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> AREA DISPLAY TOKO DEPAN (WH-01)
                </span>
                <span className="text-[10px] text-slate-500">
                  Total {racks.filter(r => r.warehouse === 'WH-01').length} Zona Display & Gondola
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {racks
                  .filter(r => r.warehouse === 'WH-01')
                  .map(rack => {
                    const isSelected = selectedRackZone !== 'ALL' && (rack.zone.includes(selectedRackZone) || rack.code.includes(selectedRackZone));
                    // Products in this rack
                    const prodsInRack = products.filter(p => p.rack && p.rack['WH-01'] && (p.rack['WH-01'].toLowerCase().includes(rack.code.toLowerCase()) || p.rack['WH-01'].toLowerCase().includes(rack.zone.split(' ')[0].toLowerCase())));

                    return (
                      <div
                        key={rack.id}
                        onClick={() => setSelectedRackZone(isSelected ? 'ALL' : rack.zone.split(' ')[0])}
                        className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between group ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                            : rack.cctv
                            ? 'bg-purple-50/40 border-purple-200 hover:border-purple-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                            <span className="truncate pr-1">{rack.zone}</span>
                            <span className="text-[10px] text-emerald-700 font-mono font-bold shrink-0">{rack.code}</span>
                          </div>
                          
                          <p className="text-[10.5px] text-slate-500 line-clamp-2">
                            {prodsInRack.length > 0 
                              ? prodsInRack.map(p => p.name).join(', ')
                              : rack.note || 'Belum ada produk di rak ini'}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/70 text-[10px] space-y-1.5">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Kapasitas: <strong>{rack.capacity}%</strong></span>
                            <span className="text-emerald-700 font-bold">{prodsInRack.length} SKU</span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${rack.capacity > 85 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${rack.capacity}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {rack.cctv ? (
                              <span className="text-[9px] text-purple-700 font-bold flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-purple-600" /> Pengawasan CCTV
                              </span>
                            ) : (
                              <span className="text-[9px] text-slate-400">{rack.category}</span>
                            )}

                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditRack(rack);
                                }}
                                className="p-1 hover:bg-white rounded text-slate-500 hover:text-emerald-700 transition"
                                title="Edit data rak"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const defaultP = prodsInRack[0] || products[0];
                                  setRelocateProduct(defaultP);
                                  setTargetRackToko(rack.code);
                                  setIsRelocateModalOpen(true);
                                }}
                                className="p-1 hover:bg-white rounded text-slate-500 hover:text-amber-700 transition"
                                title="Isi / relokasi barang ke rak ini"
                              >
                                <Boxes className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* GUDANG PUSAT / DC PALLETS (WH-02) */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-xs text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5" /> GUDANG PUSAT / DC (WH-02)
                </span>
                <span className="text-[10px] text-slate-500">
                  {racks.filter(r => r.warehouse === 'WH-02').length} Pallet & Brankas
                </span>
              </div>

              <div className="space-y-2.5">
                {racks
                  .filter(r => r.warehouse === 'WH-02')
                  .map(pallet => {
                    const isSelected = selectedRackZone !== 'ALL' && (pallet.zone.includes(selectedRackZone) || pallet.code.includes(selectedRackZone));
                    return (
                      <div
                        key={pallet.id}
                        onClick={() => setSelectedRackZone(isSelected ? 'ALL' : pallet.code)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition group ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 block">{pallet.zone}</span>
                            {pallet.cctv && <Lock className="w-3 h-3 text-purple-600" />}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono font-bold text-blue-700">{pallet.code}</span>
                          <p className="text-[10px] text-slate-400 truncate">{pallet.note || pallet.category}</p>
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-blue-700 font-extrabold block">{pallet.capacity}%</span>
                            <span className="text-[9px] text-slate-400">Kapasitas</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditRack(pallet);
                            }}
                            className="p-1 hover:bg-white rounded text-slate-400 hover:text-blue-700 transition"
                            title="Edit data pallet"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>

          {/* Filtered Products from Selected Zone */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-emerald-600" />
                Daftar SKU Pada Zona Terpilih: <span className="text-emerald-700 font-bold">{selectedRackZone === 'ALL' ? 'Semua Rak' : selectedRackZone}</span>
              </h4>
              <span className="text-xs text-slate-500">{filteredProducts.length} Produk Ditemukan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs hover:border-slate-300 transition">
                  <div className="flex-1 pr-2">
                    <h5 className="font-bold text-slate-900 text-xs">{p.name}</h5>
                    <div className="text-[10px] text-slate-500 space-y-0.5 mt-0.5">
                      <p>Rak Toko: <strong className="text-emerald-700 font-mono">{p.rack ? p.rack['WH-01'] : 'Rak Display'}</strong></p>
                      <p>Pallet DC: <strong className="text-blue-700 font-mono">{p.rack ? p.rack['WH-02'] : 'Pallet DC'}</strong></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-extrabold text-sm text-slate-900">{p.stock['WH-01'] || 0}</span>
                    <span className="text-[10px] text-slate-500 block">{p.baseUnit} di Toko</span>
                    <button
                      type="button"
                      onClick={() => {
                        setRelocateProduct(p);
                        setTargetRackToko(p.rack ? p.rack['WH-01'] : 'Rak A-02 (Sembako)');
                        setTargetRackDC(p.rack ? p.rack['WH-02'] : 'Pallet P-01 (DC)');
                        setIsRelocateModalOpen(true);
                      }}
                      className="mt-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline block cursor-pointer"
                    >
                      Pindah Rak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: PENERIMAAN BARANG SUPPLIER (PO INBOUND / LPB)           */}
      {/* ============================================================== */}
      {activeSubTab === 'inbound' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Penerimaan Barang Supplier (Good Receipt Note / LPB)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan Surat Jalan supplier, verifikasi kuantitas karton/dus dengan barcode scanner, dan penerbitan LPB.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {localInbounds.map(po => {
              const isReceived = po.status === 'RECEIVED';
              return (
                <div 
                  key={po.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{po.id}</span>
                      <span className="text-[11px] text-slate-500 font-mono">No. DO: <strong>{po.doNumber}</strong></span>
                      <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${
                        isReceived 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                      }`}>
                        {isReceived ? 'SELESAI DITERIMA' : 'MENUNGGU VERIFIKASI FISIK'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-medium">
                      Supplier: <strong className="text-slate-900">{po.supplier}</strong> • Masuk ke: <strong className="text-emerald-700">{po.destWarehouseName}</strong>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Rincian: {po.items.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Nilai Faktur:</span>
                      <span className="font-mono font-extrabold text-emerald-700 text-sm">
                        Rp {po.totalInvoice.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {!isReceived ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveScanningPO(po);
                            setBarcodeInput('');
                          }}
                          className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                        >
                          <Barcode className="w-4 h-4 text-emerald-600" />
                          <span>Scan Barcode Karton</span>
                        </button>

                        <button
                          onClick={() => handleVerifyInbound(po.id)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verifikasi & Tambah Stok</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setPreviewDocument({
                            title: 'LAPORAN PENERIMAAN BARANG (LPB / GRN)',
                            docNo: po.id,
                            refNo: po.doNumber,
                            entity: po.supplier,
                            date: po.date,
                            dest: po.destWarehouseName,
                            items: po.items,
                            total: po.totalInvoice
                          });
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cetak Dokumen LPB</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barcode Scanner Modal Simulator */}
          {activeScanningPO && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Barcode className="w-4 h-4 text-emerald-600" /> Barcode Verification Scanner ({activeScanningPO.id})
                  </span>
                  <button onClick={() => setActiveScanningPO(null)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold block">Scan Barcode Karton / SKU:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Scan atau ketik barcode..."
                      className="flex-1 bg-white text-slate-900 font-mono text-xs px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => {
                        const count = (scannedBarcodes[activeScanningPO.id] || 0) + 1;
                        setScannedBarcodes({ ...scannedBarcodes, [activeScanningPO.id]: count });
                        showToast(`Barcode diverifikasi! Total scanned: ${count} Karton`);
                        setBarcodeInput('');
                      }}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Scan
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="text-slate-700 font-semibold">Progress Verifikasi:</div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700">Target PO: <strong>{activeScanningPO.items[0]?.qty} Karton</strong></span>
                    <span className="text-emerald-700 font-mono font-bold">
                      Fisik Terhitung: {scannedBarcodes[activeScanningPO.id] || activeScanningPO.items[0]?.qty} Karton
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveScanningPO(null)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    Selesai Scan & Cocokkan
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: MUTASI & SURAT JALAN ANTAR-GUDANG                         */}
      {/* ============================================================== */}
      {activeSubTab === 'transfers' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                Surat Jalan Mutasi Antar-Gudang (Inter-Warehouse Stock Transfer)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Alur pengiriman resmi dari Gudang Pusat (DC) ke Gudang Toko dengan pelacakan status armada Mobil Box.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {transfers.map(trf => {
              const isReceived = trf.status === 'RECEIVED';
              return (
                <div 
                  key={trf.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-extrabold text-slate-900">{trf.id}</span>
                        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${
                          isReceived 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {isReceived ? 'DITERIMA DI TOKO' : 'DALAM PERJALANAN (IN-TRANSIT)'}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">Tgl Pengiriman: {trf.date}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-mono font-extrabold text-slate-900">{trf.totalPcs} Pcs</span>
                      <p className="text-[10px] text-slate-500">Total Muatan</p>
                    </div>
                  </div>

                  {/* Stepper Status Workflow */}
                  <div className="grid grid-cols-4 gap-1 text-center text-[9px] pt-1 pb-1">
                    {['1. Draft Order', '2. Muat Truk', '3. Di Jalan', '4. Diterima'].map((st, sidx) => {
                      const currentStep = trf.step || (isReceived ? 4 : 3);
                      const isDone = currentStep >= sidx + 1;
                      return (
                        <div 
                          key={st} 
                          className={`py-1 rounded font-bold transition ${
                            isDone 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {st}
                        </div>
                      );
                    })}
                  </div>

                  {/* Route & Driver details */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-slate-600">
                        <span className="text-[9px] uppercase font-bold block text-slate-400">Asal:</span>
                        <strong className="text-slate-900">{trf.fromName}</strong>
                      </div>
                      <Truck className={`w-4 h-4 ${isReceived ? 'text-emerald-600' : 'text-cyan-600'}`} />
                      <div className="text-right text-slate-600">
                        <span className="text-[9px] uppercase font-bold block text-slate-400">Tujuan:</span>
                        <strong className="text-emerald-700">{trf.toName}</strong>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                      <span>Armada: <strong className="text-slate-900">{trf.driver || 'Mobil Box Toko'}</strong></span>
                      <span>Penerima: <strong className="text-slate-900">{trf.receiver}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setPreviewDocument({
                          title: 'SURAT JALAN PENGIRIMAN MUTASI BARANG',
                          docNo: trf.id,
                          refNo: 'ARMADA-BOX-9120',
                          entity: `${trf.fromName} → ${trf.toName}`,
                          date: trf.date,
                          dest: trf.toName,
                          items: [
                            {
                              name: trf.details?.productName || 'Paket Barang Retail Toko',
                              qty: trf.details?.qty || trf.totalPcs,
                              unit: trf.details?.unit || 'Pcs',
                              subtotal: trf.totalPcs * 25000
                            }
                          ],
                          total: trf.totalPcs * 25000
                        });
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cetak Surat Jalan</span>
                    </button>

                    {!isReceived && (
                      <button
                        onClick={() => handleReceiveTransfer(trf.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Terima Barang di Toko</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: STOCK OPNAME & AUDIT SELISIH (BAST)                      */}
      {/* ============================================================== */}
      {activeSubTab === 'opname' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                Audit Stock Opname Fisik & Berita Acara Selisih (BAST)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hitung kuantitas fisik di rak toko, tentukan alasan selisih (rusak, hilang, pencatatan), dan terbitkan Berita Acara.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setOpnameMode('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition ${opnameMode === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Grand Opname (Semua)
                </button>
                <button
                  onClick={() => setOpnameMode('HIGH_SHRINKAGE')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition ${opnameMode === 'HIGH_SHRINKAGE' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Opname Harian (Rawan Hilang)
                </button>
              </div>

              <button
                onClick={() => {
                  setPreviewDocument({
                    title: 'BERITA ACARA AUDIT STOCK OPNAME (BAST)',
                    docNo: 'BAST-OPN-' + new Date().toISOString().slice(0, 10),
                    refNo: 'AUDIT-PERIODIK-X',
                    entity: 'Toko Pak Noor (Area Toko Depan)',
                    date: new Date().toLocaleString('id-ID'),
                    dest: 'Gudang Toko (WH-01)',
                    items: products.map(p => {
                      const sys = p.stock['WH-01'] || 0;
                      const phys = opnameAudit[`${p.id}-WH-01`] !== undefined ? opnameAudit[`${p.id}-WH-01`] : sys;
                      return {
                        name: p.name,
                        qty: phys,
                        unit: p.baseUnit,
                        subtotal: phys * (p.units.find(u => u.multiplier === 1)?.hpp || 20000)
                      };
                    }),
                    total: totalValuation
                  });
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 shadow-xs transition"
              >
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>Cetak Berita Acara (BAST)</span>
              </button>
            </div>
          </div>

          {/* Shrinkage Loss Banner */}
          {totalShrinkageLoss > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Estimasi Kerugian Selisih Minus (Shrinkage Loss Toko):</span>
              </div>
              <span className="font-mono font-extrabold text-rose-700 text-sm">
                - Rp {Math.round(totalShrinkageLoss).toLocaleString('id-ID')}
              </span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Produk & Lokasi Rak</th>
                  <th className="p-3 text-right">Stok Sistem</th>
                  <th className="p-3 text-right">Stok Fisik Real</th>
                  <th className="p-3 text-right">Selisih</th>
                  <th className="p-3">Alasan / Catatan Selisih</th>
                  <th className="p-3 text-center">Aksi Penyesuaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products
                  .filter(p => opnameMode === 'ALL' || p.isHighShrinkage)
                  .map(p => {
                    const systemQty = p.stock['WH-01'] || 0;
                    const physicalInput = opnameAudit[`${p.id}-WH-01`] !== undefined ? opnameAudit[`${p.id}-WH-01`] : systemQty;
                    const diff = physicalInput - systemQty;
                    const currentReason = opnameReasons[`${p.id}-WH-01`] || 'Sesuai Fisik';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {p.name}
                            {p.isHighShrinkage && (
                              <span className="text-[9px] bg-purple-50 text-purple-700 border border-purple-200 px-1 py-0.5 rounded font-extrabold">
                                Rawan Hilang
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-slate-500 font-mono">
                            {p.rack ? p.rack['WH-01'] : 'Rak A'} • {p.id}
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800">
                          {systemQty} {p.baseUnit}
                        </td>
                        <td className="p-3 text-right">
                          <input
                            type="number"
                            value={physicalInput}
                            onChange={(e) => setOpnameAudit(prev => ({ ...prev, [`${p.id}-WH-01`]: Number(e.target.value) }))}
                            className="w-24 text-right bg-white font-mono font-extrabold text-slate-900 px-2 py-1 rounded border border-slate-200 focus:border-emerald-500"
                          />
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold">
                          <span className={diff < 0 ? 'text-rose-600' : diff > 0 ? 'text-emerald-600' : 'text-slate-400'}>
                            {diff > 0 ? `+${diff}` : diff} {p.baseUnit}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={currentReason}
                            onChange={(e) => setOpnameReasons(prev => ({ ...prev, [`${p.id}-WH-01`]: e.target.value }))}
                            className="bg-white text-slate-800 text-[11px] p-1.5 rounded border border-slate-200 focus:outline-none"
                          >
                            <option value="Sesuai Fisik">Sesuai Fisik</option>
                            <option value="Barang Hilang / Susut">Barang Hilang / Susut Toko</option>
                            <option value="Barang Rusak (Bad Stock)">Barang Rusak (Bad Stock)</option>
                            <option value="Selisih Input Kasir">Selisih Input Kasir</option>
                            <option value="Bonus / Sample Supplier">Bonus / Sample Supplier</option>
                          </select>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSaveOpname(p.id, 'WH-01', physicalInput)}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded text-[10.5px] font-bold shadow-xs transition cursor-pointer"
                            >
                              Simpan
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkuSalesAuditModal(p)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[10.5px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Lacak riwayat jam transaksi dan kasir yang menjual produk ini untuk audit selisih fisik"
                            >
                              <Search className="w-3 h-3 text-amber-600" />
                              <span>Lacak Kasir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: RETUR BARANG RUSAK / BAD STOCK KE SUPPLIER               */}
      {/* ============================================================== */}
      {activeSubTab === 'returns' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                Manajemen Retur Barang Rusak / Kadaluarsa (Bad Stock Supplier)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Klaim pengembalian produk rusak atau kadaluarsa (BRP, BKE, BKL) ke distributor untuk ganti barang / potong faktur.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {localReturns.map(ret => (
              <div 
                key={ret.id}
                className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-rose-700">{ret.id}</span>
                    <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                      {ret.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{ret.productName}</h4>
                  <p className="text-[11px] text-slate-500">Supplier: <strong className="text-slate-800">{ret.supplier}</strong></p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tipe Retur:</span>
                    <span className="font-bold text-slate-900">{ret.type || 'BRP (Barang Rusak Pabrik)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jumlah Retur:</span>
                    <span className="font-mono font-bold text-slate-900">{ret.qty} {ret.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alasan:</span>
                    <span className="text-rose-700 font-semibold">{ret.reason}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-500">Estimasi Nilai Klaim:</span>
                    <span className="font-mono font-extrabold text-emerald-700">Rp {ret.totalClaim.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Diajukan pada: {ret.date}</span>
                  <button
                    onClick={() => {
                      setPreviewDocument({
                        title: 'SURAT PENGANTAR RETUR SUPPLIER (SPRS)',
                        docNo: ret.id,
                        refNo: 'KLAIM-BADSTOCK',
                        entity: ret.supplier,
                        date: ret.date,
                        dest: ret.supplier,
                        items: [
                          { name: ret.productName, qty: ret.qty, unit: ret.unit, subtotal: ret.totalClaim }
                        ],
                        total: ret.totalClaim
                      });
                    }}
                    className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Surat Retur
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 7: CETAK LABEL RAK MINIMARKET (SHELF PRICE TAGS)            */}
      {/* ============================================================== */}
      {activeSubTab === 'shelftags' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                Generator Cetak Label Harga Rak (Shelf Price Tags)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Desain label rak standar minimarket (70 x 35 mm) lengkap dengan Barcode, PLU, Lokasi Rak, dan Harga Eceran/Member.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTagProducts(products.map(p => p.id))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition shadow-xs"
              >
                Pilih Semua SKU
              </button>
              <button
                onClick={() => setSelectedTagProducts([])}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition shadow-xs"
              >
                Batal Pilih
              </button>
            </div>
          </div>

          {/* Grid Preview of Shelf Price Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map(p => {
              const isSelected = selectedTagProducts.includes(p.id);
              const baseUnitObj = p.units.find(u => u.multiplier === 1) || p.units[0];
              const rackLocation = p.rack ? p.rack['WH-01'] : 'R-01-A';

              return (
                <div 
                  key={p.id}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedTagProducts(selectedTagProducts.filter(id => id !== p.id));
                    } else {
                      setSelectedTagProducts([...selectedTagProducts, p.id]);
                    }
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition select-none ${
                    isSelected 
                      ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-300 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Retail Minimarket Shelf Tag Appearance */}
                  <div className="bg-amber-100/90 text-slate-900 p-2.5 rounded-lg border-2 border-dashed border-amber-300 font-sans space-y-1">
                    <div className="flex items-center justify-between text-[8px] font-bold tracking-wider uppercase border-b border-amber-300 pb-0.5 text-amber-950">
                      <span>TOKO PAK NOOR</span>
                      <span className="font-mono text-cyan-900">{rackLocation}</span>
                    </div>

                    <div className="font-extrabold text-[11px] leading-tight line-clamp-1 text-slate-950">
                      {p.name}
                    </div>

                    <div className="flex items-baseline justify-between pt-0.5">
                      <div>
                        <span className="text-[7.5px] uppercase font-bold text-slate-600 block">HARGA ECERAN</span>
                        <div className="font-mono font-extrabold text-base text-red-700 leading-none">
                          Rp {baseUnitObj.prices?.eceran?.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[7.5px] uppercase font-bold text-slate-600 block">MEMBER/GROSIR</span>
                        <div className="font-mono font-bold text-xs text-blue-900 leading-none">
                          Rp {baseUnitObj.prices?.member?.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-amber-200 flex items-center justify-between text-[7px] text-slate-600 font-mono">
                      <span>PLU: {p.id}</span>
                      <span>BC: {baseUnitObj.barcode?.slice(-6) || '889012'}</span>
                      <span>12-OCT-26</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10.5px]">
                    <span className="text-slate-500">Satuan: <strong className="text-slate-800">{baseUnitObj.unit}</strong></span>
                    <span className={isSelected ? 'text-amber-700 font-bold' : 'text-slate-400'}>
                      {isSelected ? '✓ Terpilih Cetak' : 'Lewati'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: INPUT PENERIMAAN BARANG SUPPLIER (PO INBOUND)           */}
      {/* ============================================================== */}
      {isInboundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 p-5 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              Penerimaan Barang Masuk dari Supplier (PO Inbound)
            </h3>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const product = products.find(prod => prod.id === inboundForm.productId);
                const unitObj = product?.units.find(u => u.unit === inboundForm.unitName) || product?.units[0];
                const totalInvoice = inboundForm.qty * (unitObj?.hpp || 100000);

                const newPO = {
                  id: `PO-${Date.now().toString().slice(-4)}`,
                  doNumber: inboundForm.doNumber || `SJ-${Date.now().toString().slice(-6)}`,
                  supplier: inboundForm.supplier,
                  date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  destWarehouse: inboundForm.destWarehouse,
                  destWarehouseName: warehouses.find(w => w.id === inboundForm.destWarehouse)?.name || 'Gudang Pusat',
                  receiver: 'Agus P.',
                  totalInvoice,
                  status: 'WAITING_RECEIVE',
                  items: [
                    { productId: product.id, name: product.name, unit: inboundForm.unitName, qty: inboundForm.qty, hpp: unitObj.hpp, subtotal: totalInvoice }
                  ]
                };

                setLocalInbounds(prev => [newPO, ...prev]);
                setIsInboundModalOpen(false);
                showToast(`PO ${newPO.id} berhasil dicatat. Lakukan verifikasi fisik barang saat truk tiba.`);
              }} 
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Supplier:</label>
                  <select
                    value={inboundForm.supplier}
                    onChange={(e) => setInboundForm({ ...inboundForm, supplier: e.target.value })}
                    className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  >
                    <option value="PT Indomarco Adi Prima">PT Indomarco Adi Prima</option>
                    <option value="PT Berkah Pangan Mandiri">PT Berkah Pangan Mandiri</option>
                    <option value="PT Unilever Indonesia Tbk">PT Unilever Indonesia Tbk</option>
                    <option value="PT Santos Jaya Abadi">PT Santos Jaya Abadi</option>
                    <option value="PT Nestle Indonesia">PT Nestle Indonesia</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">No. Surat Jalan Supplier:</label>
                  <input
                    type="text"
                    required
                    value={inboundForm.doNumber}
                    onChange={(e) => setInboundForm({ ...inboundForm, doNumber: e.target.value })}
                    placeholder="Contoh: SJ-DO-88910"
                    className="w-full bg-white text-slate-900 font-mono font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pilih Produk Yang Diterima:</label>
                <select
                  value={inboundForm.productId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const p = products.find(prod => prod.id === pid);
                    setInboundForm({
                      ...inboundForm,
                      productId: pid,
                      unitName: p?.units[0]?.unit || ''
                    });
                  }}
                  className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Satuan Terima:</label>
                  <select
                    value={inboundForm.unitName}
                    onChange={(e) => setInboundForm({ ...inboundForm, unitName: e.target.value })}
                    className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  >
                    {products.find(p => p.id === inboundForm.productId)?.units.map(u => (
                      <option key={u.unit} value={u.unit}>{u.unit} ({u.multiplier}x)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Jumlah (Qty):</label>
                  <input
                    type="number"
                    min="1"
                    value={inboundForm.qty}
                    onChange={(e) => setInboundForm({ ...inboundForm, qty: Number(e.target.value) })}
                    className="w-full bg-white text-slate-900 font-mono font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gudang Penerima:</label>
                  <select
                    value={inboundForm.destWarehouse}
                    onChange={(e) => setInboundForm({ ...inboundForm, destWarehouse: e.target.value })}
                    className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  >
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.code} - {w.name.split(' ')[0]}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">No. Batch Produksi:</label>
                  <input
                    type="text"
                    value={inboundForm.batchNo}
                    onChange={(e) => setInboundForm({ ...inboundForm, batchNo: e.target.value })}
                    className="w-full bg-white text-slate-900 font-mono p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal Kadaluarsa (Exp):</label>
                  <input
                    type="date"
                    value={inboundForm.expiryDate}
                    onChange={(e) => setInboundForm({ ...inboundForm, expiryDate: e.target.value })}
                    className="w-full bg-white text-slate-900 font-mono p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInboundModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition"
                >
                  Catat Surat Jalan Inbound
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: BUAT SURAT JALAN MUTASI                                 */}
      {/* ============================================================== */}
      {isTransferModalOpen && (() => {
        const currentProduct = products.find(p => p.id === transferForm.productId) || products[0];
        const currentUnit = currentProduct?.units.find(u => u.unit === transferForm.unitName) || currentProduct?.units[0];
        const totalPcsTransfer = (transferForm.qty || 0) * (currentUnit?.multiplier || 1);
        const stockInOrigin = currentProduct?.stock[transferForm.from] || 0;
        const isInsufficient = totalPcsTransfer > stockInOrigin;
        const isSameWarehouse = transferForm.from === transferForm.to;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  Penerbitan Surat Jalan Mutasi Antar-Gudang
                </h3>
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSameWarehouse && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Gudang Asal dan Gudang Tujuan tidak boleh sama! Pilih gudang yang berbeda.</span>
                </div>
              )}

              {isInsufficient && !isSameWarehouse && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>Stok di gudang asal tidak mencukupi! Tersedia hanya {stockInOrigin} {currentProduct?.baseUnit}.</span>
                </div>
              )}

              <form onSubmit={handleCreateTransfer} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Dari Gudang Asal:</label>
                    <select
                      value={transferForm.from}
                      onChange={(e) => {
                        const newFrom = e.target.value;
                        const newTo = newFrom === transferForm.to 
                          ? (warehouses.find(w => w.id !== newFrom)?.id || 'WH-01') 
                          : transferForm.to;
                        setTransferForm({ ...transferForm, from: newFrom, to: newTo });
                      }}
                      className="w-full bg-slate-50 text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tujuan Gudang:</label>
                    <select
                      value={transferForm.to}
                      onChange={(e) => {
                        const newTo = e.target.value;
                        const newFrom = newTo === transferForm.from 
                          ? (warehouses.find(w => w.id !== newTo)?.id || 'WH-02') 
                          : transferForm.from;
                        setTransferForm({ ...transferForm, to: newTo, from: newFrom });
                      }}
                      className="w-full bg-slate-50 text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id} disabled={w.id === transferForm.from}>
                          {w.name} {w.id === transferForm.from ? '(Asal)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pilih Produk Yang Dimutasi:</label>
                  <select
                    value={transferForm.productId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      const p = products.find(prod => prod.id === pid);
                      setTransferForm({
                        ...transferForm,
                        productId: pid,
                        unitName: p?.units[0]?.unit || 'Pcs'
                      });
                    }}
                    className="w-full bg-slate-50 text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} • (Tersedia: {p.stock[transferForm.from] || 0} {p.baseUnit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Satuan Pengiriman:</label>
                    <select
                      value={transferForm.unitName}
                      onChange={(e) => setTransferForm({ ...transferForm, unitName: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      {currentProduct?.units.map(u => (
                        <option key={u.unit} value={u.unit}>{u.unit} ({u.multiplier}x {currentProduct.baseUnit})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Jumlah (Qty):</label>
                    <input
                      type="number"
                      min="1"
                      value={transferForm.qty}
                      onChange={(e) => setTransferForm({ ...transferForm, qty: Math.max(1, Number(e.target.value)) })}
                      className="w-full bg-white text-slate-900 font-mono font-extrabold text-sm p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Live Stock Calculation Card */}
                <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                  <div>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Stok Gudang Asal:</span>
                    <span className="font-mono font-extrabold text-slate-900 text-sm">
                      {stockInOrigin} {currentProduct?.baseUnit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block">Total Unit Yang Dimutasi:</span>
                    <span className="font-mono font-extrabold text-emerald-800 text-sm">
                      {totalPcsTransfer} {currentProduct?.baseUnit}
                    </span>
                    <span className="text-[10px] text-slate-500 block">({transferForm.qty} {transferForm.unitName})</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Armada / Driver Pengangkut:</label>
                  <input
                    type="text"
                    required
                    value={transferForm.driver}
                    onChange={(e) => setTransferForm({ ...transferForm, driver: e.target.value })}
                    placeholder="Contoh: Joko W. (Mobil Box B 9120 KSR)"
                    className="w-full bg-slate-50 text-slate-900 font-medium p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-bold transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSameWarehouse || isInsufficient || transferForm.qty <= 0}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Terbitkan Surat Jalan (In-Transit)</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* MODAL: AJUKAN RETUR SUPPLIER                                    */}
      {/* ============================================================== */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-5 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              Klaim Retur Barang Bad Stock ke Supplier
            </h3>

            <form onSubmit={handleCreateReturn} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pilih Produk:</label>
                <select
                  value={returnForm.productId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    const p = products.find(prod => prod.id === pid);
                    setReturnForm({
                      ...returnForm,
                      productId: pid,
                      unitName: p?.baseUnit || 'Pcs',
                      supplier: p?.supplier || ''
                    });
                  }}
                  className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Toko: {p.stock['WH-01'] || 0} {p.baseUnit})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Klasifikasi Retur:</label>
                <select
                  value={returnForm.type}
                  onChange={(e) => setReturnForm({ ...returnForm, type: e.target.value })}
                  className="w-full bg-white text-slate-900 font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                >
                  <option value="BRP (Barang Rusak Pabrik)">BRP (Barang Rusak Pabrik / Cacat Segel)</option>
                  <option value="BKE (Barang Kadaluarsa / FEFO)">BKE (Barang Kadaluarsa / Expired FEFO)</option>
                  <option value="BKL (Kemasan Bocor/Penyok)">BKL (Barang Kirim Luar / Kemasan Bocor)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Jumlah (Qty Pcs):</label>
                  <input
                    type="number"
                    min="1"
                    value={returnForm.qty}
                    onChange={(e) => setReturnForm({ ...returnForm, qty: Number(e.target.value) })}
                    className="w-full bg-white text-slate-900 font-mono font-bold p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier Tujuan:</label>
                  <input
                    type="text"
                    readOnly
                    value={returnForm.supplier}
                    className="w-full bg-slate-100 text-slate-600 font-medium p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Catatan Kerusakan:</label>
                <input
                  type="text"
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  className="w-full bg-white text-slate-900 p-2 rounded-lg border border-slate-200 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 font-medium transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs transition"
                >
                  Terbitkan Nota Retur Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PRINT PREVIEW DOKUMEN RESMI (SURAT JALAN / LPB / BAST)  */}
      {/* ============================================================== */}
      {previewDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Dokumen Resmi Gudang Retail
              </span>
              <button onClick={() => setPreviewDocument(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 bg-white text-black font-sans text-xs space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="border-b-2 border-black pb-2 text-center">
                <h2 className="text-base font-extrabold uppercase tracking-tight">TOKO RETAIL PAK NOOR</h2>
                <p className="text-[10px] text-gray-600">SISTEM MANAJEMEN INVENTORI & LOGISTIK GUDANG</p>
                <h3 className="text-xs font-bold uppercase mt-2 text-emerald-800">{previewDocument.title}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px] border-b pb-2">
                <div>
                  <p>No. Dokumen: <strong>{previewDocument.docNo}</strong></p>
                  <p>Referensi/DO: <strong>{previewDocument.refNo}</strong></p>
                </div>
                <div className="text-right">
                  <p>Tanggal: <strong>{previewDocument.date}</strong></p>
                  <p>Tujuan/Pihak: <strong>{previewDocument.entity}</strong></p>
                </div>
              </div>

              {/* Packing Koli Mode Toggle */}
              <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-lg no-print">
                <span className="text-[10.5px] font-bold text-slate-700">Format Cetak Dokumen:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setIsKoliMode(false)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      !isKoliMode ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Rincian SKU
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsKoliMode(true)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isKoliMode ? 'bg-emerald-700 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Boxes className="w-3 h-3" />
                    <span>📦 Packing Koli (Kardus Ringkas)</span>
                  </button>
                </div>
              </div>

              {isKoliMode ? (
                <div className="border border-slate-300 rounded p-3 space-y-2 bg-slate-50/50">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="font-bold text-[11px] uppercase text-emerald-900">
                      LEMBAR PACKING LIST KOLI / KARDUS EKSPEDISI
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      Total: 2 Koli (Dus Segel)
                    </span>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>📦 KOLI #1 (DUS-A): Paket Sembako & Minuman</span>
                      <span className="font-mono">1 Koli / Dus Segel</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Muatan gabungan: Minyak Goreng Sania 2L, Beras Ramos 5kg, Gulaku 1kg, Susu Ultra (Estimasi Berat Kotor: 14.5 kg)
                    </p>
                    <div className="text-[9.5px] text-emerald-700 font-bold">Status Segel: Lolos QC Gudang Pengirim ✓</div>
                  </div>

                  <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>📦 KOLI #2 (DUS-B): Paket Makanan & Mie Instan</span>
                      <span className="font-mono">1 Koli / Dus Segel</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      Muatan gabungan: Indomie Goreng Spesial, Kopi Kapal Api, Deterjen Rinso (Estimasi Berat Kotor: 8.2 kg)
                    </p>
                    <div className="text-[9.5px] text-emerald-700 font-bold">Status Segel: Lolos QC Gudang Pengirim ✓</div>
                  </div>

                  <div className="pt-1.5 flex justify-between font-bold text-[11px] border-t border-slate-200">
                    <span>Total Ringkas Ekspedisi Armada:</span>
                    <span className="font-mono text-emerald-800">2 Koli / Kardus (22.7 kg)</span>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left text-[10.5px] border border-gray-300">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="p-1.5">Nama Barang</th>
                      <th className="p-1.5 text-center">Kuantitas</th>
                      <th className="p-1.5 text-right">Nilai Estimasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewDocument.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-1.5 font-medium">{it.name}</td>
                        <td className="p-1.5 text-center font-bold">{it.qty} {it.unit}</td>
                        <td className="p-1.5 text-right font-mono">Rp {(it.subtotal || 0).toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="grid grid-cols-2 gap-6 pt-6 text-center text-[10px]">
                <div>
                  <p>Petugas Pengirim / Pemeriksa,</p>
                  <div className="h-12"></div>
                  <p className="border-t border-black font-bold pt-1">( Supervisor Logistik DC )</p>
                </div>
                <div>
                  <p>Petugas Penerima Toko,</p>
                  <div className="h-12"></div>
                  <p className="border-t border-black font-bold pt-1">( Kepala Toko Pak Noor )</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => setPreviewDocument(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL: MASTER MANAJEMEN RAK & PALLET                           */}
      {/* ============================================================== */}
      {isRackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold">{editingRackId ? 'Edit Data Rak / Pallet' : 'Tambah Rak / Pallet Baru'}</h3>
                  <p className="text-[10.5px] text-slate-400">Atur kode rak, zona lorong, kapasitas, dan pengawasan CCTV</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsRackModalOpen(false); setEditingRackId(null); }} 
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Form Section */}
              <form onSubmit={handleSaveRack} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kode Rak / Pallet:</label>
                    <input
                      type="text"
                      required
                      value={rackFormData.code}
                      onChange={(e) => setRackFormData({ ...rackFormData, code: e.target.value })}
                      placeholder="Contoh: Rak E-01..02 atau Pallet P-06"
                      className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nama Lorong / Zona Rak:</label>
                    <input
                      type="text"
                      required
                      value={rackFormData.zone}
                      onChange={(e) => setRackFormData({ ...rackFormData, zone: e.target.value })}
                      placeholder="Contoh: Lorong E (Snack & Biskuit)"
                      className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Gudang / Lokasi:</label>
                    <select
                      value={rackFormData.warehouse}
                      onChange={(e) => setRackFormData({ ...rackFormData, warehouse: e.target.value })}
                      className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="WH-01">Toko Depan (WH-01) - Display Gondola</option>
                      <option value="WH-02">Gudang Pusat / DC (WH-02) - Area Pallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Kategori Produk Dominan:</label>
                    <select
                      value={rackFormData.category}
                      onChange={(e) => setRackFormData({ ...rackFormData, category: e.target.value })}
                      className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="Sembako">Sembako</option>
                      <option value="Makanan Instan">Makanan Instan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Perawatan Rumah">Perawatan Rumah</option>
                      <option value="Rokok & Tembakau">Rokok & Tembakau</option>
                      <option value="Susu & Bayi">Susu & Bayi</option>
                      <option value="Umum / Campuran">Umum / Campuran</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Kapasitas Terisi:</label>
                      <span className="font-mono font-extrabold text-emerald-700">{rackFormData.capacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={rackFormData.capacity}
                      onChange={(e) => setRackFormData({ ...rackFormData, capacity: Number(e.target.value) })}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      id="cctvCheck"
                      checked={rackFormData.cctv}
                      onChange={(e) => setRackFormData({ ...rackFormData, cctv: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                    <label htmlFor="cctvCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Area Pengawasan Khusus (CCTV / Kunci Brankas)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Catatan / Deskripsi Rak:</label>
                  <input
                    type="text"
                    value={rackFormData.note}
                    onChange={(e) => setRackFormData({ ...rackFormData, note: e.target.value })}
                    placeholder="Contoh: Baris depan lorong utama, rak kaca etalase berlampu"
                    className="w-full bg-white text-slate-900 p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {editingRackId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRackId(null);
                        setRackFormData({ code: '', zone: '', warehouse: 'WH-01', category: 'Sembako', capacity: 60, cctv: false, note: '' });
                      }}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-bold"
                    >
                      Batal Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{editingRackId ? 'Simpan Perubahan Rak' : 'Simpan Rak Baru'}</span>
                  </button>
                </div>
              </form>

              {/* Existing Racks Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Warehouse className="w-3.5 h-3.5 text-emerald-600" />
                  Daftar Rak & Pallet Aktif ({racks.length})
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[9.5px]">
                      <tr>
                        <th className="p-2.5">Kode & Zona</th>
                        <th className="p-2.5">Lokasi</th>
                        <th className="p-2.5">Kategori</th>
                        <th className="p-2.5 text-right">Kapasitas</th>
                        <th className="p-2.5 text-center">Keamanan</th>
                        <th className="p-2.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {racks.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition">
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 block">{r.zone}</span>
                            <span className="font-mono text-emerald-700 font-bold text-[10px]">{r.code}</span>
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.warehouse === 'WH-01' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                              {r.warehouse === 'WH-01' ? 'Toko (WH-01)' : 'DC (WH-02)'}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{r.category}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-800">{r.capacity}%</td>
                          <td className="p-2.5 text-center">
                            {r.cctv ? (
                              <span className="text-purple-700 font-bold flex items-center justify-center gap-1 text-[10px]">
                                <ShieldCheck className="w-3 h-3 text-purple-600" /> CCTV
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Standar</span>
                            )}
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRack(r)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-emerald-700 transition"
                                title="Edit rak ini"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteRack(r.id)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-rose-600 transition"
                                title="Hapus rak ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => { setIsRackModalOpen(false); setEditingRackId(null); }}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs transition cursor-pointer"
              >
                Selesai / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: RELOKASI POSISI RAK PRODUK (STORE & DC)                 */}
      {/* ============================================================== */}
      {isRelocateModalOpen && relocateProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 bg-amber-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-sm font-extrabold">Atur & Relokasi Posisi Rak Produk</h3>
                  <p className="text-[10.5px] text-amber-100">Pindahkan letak display toko atau penataan pallet DC</p>
                </div>
              </div>
              <button onClick={() => setIsRelocateModalOpen(false)} className="text-white hover:text-amber-100 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRelocation} className="p-5 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pilih Produk:</label>
                <select
                  value={relocateProduct.id}
                  onChange={(e) => {
                    const prod = products.find(p => p.id === e.target.value);
                    if (prod) {
                      setRelocateProduct(prod);
                      setTargetRackToko(prod.rack ? prod.rack['WH-01'] : 'Rak A-02 (Sembako)');
                      setTargetRackDC(prod.rack ? prod.rack['WH-02'] : 'Pallet P-01 (DC)');
                    }
                  }}
                  className="w-full bg-slate-50 text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                  ))}
                </select>
              </div>

              {/* Current vs New comparison */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Posisi Rak Saat Ini:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Toko Depan (WH-01):</span>
                    <strong className="text-emerald-700 font-mono">{relocateProduct.rack ? relocateProduct.rack['WH-01'] : 'Belum Ditentukan'}</strong>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Gudang DC (WH-02):</span>
                    <strong className="text-blue-700 font-mono">{relocateProduct.rack ? relocateProduct.rack['WH-02'] : 'Belum Ditentukan'}</strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Rak Toko Depan (WH-01):</label>
                  <select
                    value={targetRackToko}
                    onChange={(e) => setTargetRackToko(e.target.value)}
                    className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    {racks.filter(r => r.warehouse === 'WH-01').map(r => (
                      <option key={r.id} value={`${r.code} (${r.category})`}>
                        {r.code} - {r.zone}
                      </option>
                    ))}
                    <option value="Etalase Kasir Belakang (RKK-01)">Etalase Kasir Belakang (RKK-01)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Pallet Gudang DC (WH-02):</label>
                  <select
                    value={targetRackDC}
                    onChange={(e) => setTargetRackDC(e.target.value)}
                    className="w-full bg-white text-slate-900 font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    {racks.filter(r => r.warehouse === 'WH-02').map(r => (
                      <option key={r.id} value={`${r.code} (DC)`}>
                        {r.code} - {r.zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRelocateModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simpan Posisi Rak Baru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: CETAK LABEL BARCODE TIANG RAK (SHELF POLE TAGS)         */}
      {/* ============================================================== */}
      {isShelfBarcodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold">Cetak Label Barcode Tiang Rak & Pallet</h3>
                  <p className="text-[10.5px] text-slate-400">Barcode fisik untuk ditempel pada tiang lorong gondola / pallet minimarket</p>
                </div>
              </div>
              <button onClick={() => setIsShelfBarcodeModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <span>Total <strong>{racks.length} Label Rak</strong> siap dicetak untuk scanning barcode scanner saat audit fisik / stock opname.</span>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Semua Label</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {racks.map(rack => (
                  <div key={rack.id} className="border-2 border-dashed border-slate-300 p-3.5 rounded-xl bg-white space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                        <span className="text-[9.5px] font-extrabold tracking-wider text-slate-900">TOKO PAK NOOR</span>
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 rounded">{rack.warehouse}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{rack.zone}</h4>
                      <p className="text-[10px] text-slate-500 font-mono font-bold">{rack.code}</p>
                    </div>

                    <div className="text-center py-2 bg-slate-50 rounded-lg border border-slate-200 my-1">
                      <div className="font-mono font-black text-sm tracking-widest text-slate-900">
                        *{rack.code.replace(/[^A-Z0-9]/gi, '')}*
                      </div>
                      <div className="flex justify-center gap-0.5 mt-1 h-6">
                        {[4, 2, 6, 2, 8, 3, 5, 2, 7, 4, 3, 6, 2, 5].map((h, i) => (
                          <span key={i} className="bg-slate-900 w-1" style={{ height: `${h * 3}px` }}></span>
                        ))}
                      </div>
                      <span className="text-[8.5px] text-slate-400 block mt-1 uppercase font-bold">SCAN SAAT AUDIT OPNAME</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Kategori: {rack.category}</span>
                      <span>Kapasitas: {rack.capacity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => setIsShelfBarcodeModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Label Rak Fisik</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: AUDIT TRANSAKSI PENJUALAN KASIR PER SKU (STOK OPNAME)   */}
      {/* ============================================================== */}
      {skuSalesAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                    Investigasi Transaksi Kasir: {skuSalesAuditModal.name}
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    Lacak kasir mana yang menjual barang ini, jam transaksi, dan nominal untuk verifikasi selisih stok opname
                  </p>
                </div>
              </div>
              <button onClick={() => setSkuSalesAuditModal(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product & Variance Strip */}
            {(() => {
              const sys = skuSalesAuditModal.stock['WH-01'] || 0;
              const phys = opnameAudit[`${skuSalesAuditModal.id}-WH-01`] !== undefined ? opnameAudit[`${skuSalesAuditModal.id}-WH-01`] : sys;
              const diff = phys - sys;

              // Filter transactions that sold this SKU
              const skuSales = salesHistory.filter(s => 
                s.items && s.items.some(i => 
                  i.name.toLowerCase().includes(skuSalesAuditModal.name.toLowerCase()) || 
                  i.id === skuSalesAuditModal.id
                )
              );

              return (
                <div className="p-5 overflow-y-auto space-y-4 text-xs">
                  {/* Summary Variance Card */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Stok Sistem:</span>
                      <strong className="font-mono text-sm text-slate-900">{sys} {skuSalesAuditModal.baseUnit}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Stok Fisik Real:</span>
                      <strong className="font-mono text-sm text-slate-900">{phys} {skuSalesAuditModal.baseUnit}</strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Selisih Opname:</span>
                      <strong className={`font-mono text-sm ${diff < 0 ? 'text-rose-600' : diff > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {diff > 0 ? `+${diff}` : diff} {skuSalesAuditModal.baseUnit}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Terjual Kasir:</span>
                      <strong className="font-mono text-sm text-emerald-700">
                        {skuSales.reduce((acc, s) => {
                          const item = s.items.find(i => i.name.toLowerCase().includes(skuSalesAuditModal.name.toLowerCase()));
                          return acc + (item ? item.qty : 0);
                        }, 0)} Unit
                      </strong>
                    </div>
                  </div>

                  {/* Transaction Log Table */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Riwayat Transaksi Kasir Produk Ini ({skuSales.length} Transaksi)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Diurutkan waktu terbaru</span>
                    </h4>

                    {skuSales.length === 0 ? (
                      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 space-y-1">
                        <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                        <p className="font-bold text-slate-800">Belum ada transaksi kasir untuk SKU ini di sistem.</p>
                        <p className="text-[11px] text-slate-500">
                          Jika fisik barang berkurang, selisih kemungkinan disebabkan oleh susut toko, barang rusak belum dicatat, atau pencurian.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200">
                            <tr>
                              <th className="p-2.5">Jam & Tanggal</th>
                              <th className="p-2.5">Kasir & Mesin</th>
                              <th className="p-2.5">Qty Terjual</th>
                              <th className="p-2.5 text-right">Nominal Struk</th>
                              <th className="p-2.5 text-center">Bayar</th>
                              <th className="p-2.5">No. Invoice</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {skuSales.map(s => {
                              const matchItem = s.items.find(i => i.name.toLowerCase().includes(skuSalesAuditModal.name.toLowerCase()));
                              return (
                                <tr key={s.id} className="hover:bg-slate-50/80 transition">
                                  <td className="p-2.5">
                                    <div className="font-mono font-extrabold text-slate-900 text-xs">{s.time || '12:00:00 WIB'}</div>
                                    <div className="text-[10px] text-slate-400">{s.date || '2026-10-12'}</div>
                                  </td>
                                  <td className="p-2.5">
                                    <div className="font-bold text-slate-800">{s.cashier}</div>
                                    <div className="text-[10px] text-slate-500">{s.terminal}</div>
                                  </td>
                                  <td className="p-2.5">
                                    <span className="font-mono font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                      {matchItem ? `${matchItem.qty} ${matchItem.unit}` : '1 Pcs'}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                                    Rp {s.totalAmount.toLocaleString('id-ID')}
                                  </td>
                                  <td className="p-2.5 text-center">
                                    <span className="text-[9.5px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                      {s.paymentMethod}
                                    </span>
                                  </td>
                                  <td className="p-2.5 font-mono text-[10px] text-slate-500">
                                    {s.id}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                    <span>Butuh melihat seluruh transaksi kasir tanpa batasan SKU?</span>
                    {onViewTransactionAudit && (
                      <button
                        type="button"
                        onClick={() => {
                          setSkuSalesAuditModal(null);
                          onViewTransactionAudit();
                        }}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                      >
                        Buka Menu Owner (Audit Kasir) →
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSkuSalesAuditModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
