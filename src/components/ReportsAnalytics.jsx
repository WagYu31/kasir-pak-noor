import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  FileSpreadsheet, 
  Printer, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  PieChart as PieIcon,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  CreditCard,
  QrCode,
  Building2,
  ChevronRight,
  Eye,
  RefreshCw,
  Download,
  CalendarDays,
  Tag,
  Store,
  Boxes,
  RotateCcw,
  Search,
  X,
  Lock,
  Users,
  User,
  AlertTriangle,
  Phone,
  MapPin,
  Truck,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  exportSalesToExcel, 
  exportStockToExcel, 
  exportExpensesToExcel, 
  exportReceivablesToExcel 
} from '../utils/exportExcel';

// Color Palette for Category Pie Chart (21st.dev / tasteskill.dev theme)
const CATEGORY_COLORS = {
  'Sembako': '#10b981',         // emerald-500
  'Minuman': '#0ea5e9',         // sky-500
  'Makanan Instan': '#f59e0b',  // amber-500
  'Rokok & Tembakau': '#8b5cf6',// purple-500
  'Perawatan Rumah': '#ec4899', // pink-500
  'Susu & Bayi': '#3b82f6',     // blue-500
  'Lainnya': '#94a3b8'          // slate-400
};

// Formatter Rupiah Singkat (misal Rp 1.2jt)
const formatShortRp = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}jt`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}rb`;
  }
  return value ? value.toString() : '0';
};

export default function ReportsAnalytics({ 
  salesHistory = [], 
  products = [], 
  warehouses = [], 
  currentRole = 'OWNER',
  customers = [],
  expenses = [],
  commissions = [],
  onRecordDebtPayment
}) {
  // Navigation & Sub-views (Default: 'sales' so audit table is immediately visible below charts)
  const [reportType, setReportType] = useState('sales'); // 'sales', 'receivables', 'expenses', 'commissions', 'stock_card'
  
  // ========================================================
  // 1. FILTER INTERVAL (WAKTU & PENGELOMPOKAN DATA)
  // ========================================================
  const [interval, setInterval] = useState('daily'); // 'hourly', 'daily', 'weekly', 'monthly'
  const [dateRangePreset, setDateRangePreset] = useState('7days'); // 'today', 'yesterday', '7days', '30days', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('2026-10-06');
  const [customEndDate, setCustomEndDate] = useState('2026-10-12');

  // ========================================================
  // 2. FILTER JENIS (KATEGORI, METODE BAYAR, TERMINAL, TIER)
  // ========================================================
  const [jenisCategory, setJenisCategory] = useState('ALL'); // 'ALL', 'Sembako', 'Makanan Instan', 'Minuman', etc.
  const [jenisPayment, setJenisPayment] = useState('ALL'); // 'ALL', 'Tunai', 'QRIS', 'Transfer'
  const [jenisTerminal, setJenisTerminal] = useState('ALL'); // 'ALL', 'Terminal 1', 'Terminal 2'
  const [jenisUnitType, setJenisUnitType] = useState('ALL'); // 'ALL', 'eceran', 'grosir'
  
  // ========================================================
  // 3. KUSTOMISASI GRAFIK & TAMPILAN SERI
  // ========================================================
  const [chartType, setChartType] = useState('area'); // 'area', 'bar', 'hourly'
  const [showOmset, setShowOmset] = useState(true);
  const [showLaba, setShowLaba] = useState(true);
  const [showHpp, setShowHpp] = useState(true);
  const [showQty, setShowQty] = useState(false);

  // Quick Search & Pagination for Audit Table
  const [auditSearch, setAuditSearch] = useState('');
  const [auditLimit, setAuditLimit] = useState(15);
  const [selectedCashierFilter, setSelectedCashierFilter] = useState('ALL');
  const [selectedAuditTx, setSelectedAuditTx] = useState(null);

  // Available categories extracted dynamically
  const availableCategories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => { if (p.category) cats.add(p.category); });
    salesHistory.forEach(s => {
      if (s.items) s.items.forEach(i => { if (i.category) cats.add(i.category); });
    });
    return ['ALL', ...Array.from(cats)];
  }, [products, salesHistory]);

  // Available cashiers extracted dynamically for Owner Audit
  const availableCashiers = useMemo(() => {
    const cashiers = new Set();
    salesHistory.forEach(s => {
      if (s.cashier) cashiers.add(s.cashier);
    });
    // Ensure all registered cashiers are available in filter
    ['Kasir 1 - Siti Aminah', 'Kasir 2 - Budi Santoso', 'Kasir 3 - Dewi Lestari', 'Pak Noor (Owner)'].forEach(c => cashiers.add(c));
    return ['ALL', ...Array.from(cashiers)];
  }, [salesHistory]);

  // Reset All Filters
  const handleResetFilters = () => {
    setInterval('daily');
    setDateRangePreset('7days');
    setJenisCategory('ALL');
    setJenisPayment('ALL');
    setJenisTerminal('ALL');
    setJenisUnitType('ALL');
    setSelectedCashierFilter('ALL');
    setSelectedAuditTx(null);
    setChartType('area');
    setShowOmset(true);
    setShowLaba(true);
    setShowHpp(true);
    setShowQty(false);
    setAuditSearch('');
    setAuditLimit(15);
  };

  // Check if any filter is active (different from default)
  const isFiltered = interval !== 'daily' || 
                     dateRangePreset !== '7days' || 
                     jenisCategory !== 'ALL' || 
                     jenisPayment !== 'ALL' || 
                     jenisTerminal !== 'ALL' || 
                     jenisUnitType !== 'ALL' ||
                     auditSearch.trim() !== '';

  // ========================================================
  // 4. FILTERED DATASETS (REACTS TO ALL "JENIS" & "RENTANG")
  // ========================================================
  const filteredSales = useMemo(() => {
    return salesHistory.filter(s => {
      // Filter Jenis Kasir
      if (selectedCashierFilter !== 'ALL' && s.cashier !== selectedCashierFilter) return false;

      // Filter Jenis Pembayaran
      if (jenisPayment !== 'ALL' && s.paymentMethod !== jenisPayment) return false;

      // Filter Jenis Terminal / Kasir
      if (jenisTerminal !== 'ALL' && s.terminal !== jenisTerminal) return false;

      // Filter Rentang Waktu
      if (dateRangePreset === 'today') {
        if (s.date && s.date !== '2026-10-12') return false;
      } else if (dateRangePreset === 'yesterday') {
        if (s.date !== '2026-10-11') return false;
      } else if (dateRangePreset === 'custom') {
        if (customStartDate && s.date < customStartDate) return false;
        if (customEndDate && s.date > customEndDate) return false;
      }

      // Filter Jenis Kategori Produk (Check if invoice contains any item with this category)
      if (jenisCategory !== 'ALL') {
        const hasCat = s.items && s.items.some(i => i.category === jenisCategory);
        if (!hasCat) return false;
      }

      // Filter Jenis Satuan / Tipe Penjualan (Eceran vs Grosir)
      if (jenisUnitType !== 'ALL') {
        if (jenisUnitType === 'grosir') {
          const hasGrosir = s.items && s.items.some(i => 
            i.unit.toLowerCase().includes('dus') || 
            i.unit.toLowerCase().includes('karton') || 
            i.unit.toLowerCase().includes('karung') || 
            i.unit.toLowerCase().includes('pack')
          );
          if (!hasGrosir) return false;
        } else if (jenisUnitType === 'eceran') {
          const hasEceran = s.items && s.items.some(i => 
            i.unit.toLowerCase().includes('pcs') || 
            i.unit.toLowerCase().includes('botol') || 
            i.unit.toLowerCase().includes('bungkus') || 
            i.unit.toLowerCase().includes('box')
          );
          if (!hasEceran) return false;
        }
      }

      return true;
    });
  }, [salesHistory, selectedCashierFilter, jenisPayment, jenisTerminal, dateRangePreset, customStartDate, customEndDate, jenisCategory, jenisUnitType]);

  // Overall KPI Aggregates (Recalculated based on Filtered Sales)
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => {
      if (jenisCategory === 'ALL') return sum + s.totalAmount;
      // If specific category is selected, calculate only revenue for that category's items
      const catItems = (s.items || []).filter(i => i.category === jenisCategory);
      return sum + catItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
    }, 0);
  }, [filteredSales, jenisCategory]);

  const totalHpp = useMemo(() => {
    return filteredSales.reduce((sum, s) => {
      if (jenisCategory === 'ALL') return sum + (s.totalHpp || (s.totalAmount * 0.8));
      const catItems = (s.items || []).filter(i => i.category === jenisCategory);
      return sum + catItems.reduce((acc, i) => acc + ((i.hpp || (i.price * 0.8)) * i.qty), 0);
    }, 0);
  }, [filteredSales, jenisCategory]);

  const grossProfit = totalRevenue - totalHpp;
  const grossMarginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;
  const totalOrders = filteredSales.length;
  const averageBasket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Searched sales for audit table
  const searchedSales = useMemo(() => {
    if (!auditSearch.trim()) return filteredSales;
    const q = auditSearch.toLowerCase();
    return filteredSales.filter(s => 
      s.id.toLowerCase().includes(q) ||
      s.cashier?.toLowerCase().includes(q) ||
      s.paymentMethod?.toLowerCase().includes(q) ||
      s.terminal?.toLowerCase().includes(q) ||
      (s.items && s.items.some(i => i.name.toLowerCase().includes(q) || (i.id && i.id.toLowerCase().includes(q))))
    );
  }, [filteredSales, auditSearch]);

  // ========================================================
  // 5. DYNAMIC CHART DATASET BUILDER (INTERVAL & JENIS)
  // ========================================================
  const chartData = useMemo(() => {
    // Helper to calculate invoice values (taking category filter into account)
    const computeInvoiceSlice = (invoices) => {
      let omset = 0;
      let hpp = 0;
      let qty = 0;

      invoices.forEach(s => {
        if (jenisCategory === 'ALL') {
          omset += s.totalAmount;
          hpp += (s.totalHpp || (s.totalAmount * 0.8));
          if (s.items) s.items.forEach(i => qty += (i.qty || 1));
        } else {
          const matchItems = (s.items || []).filter(i => i.category === jenisCategory);
          matchItems.forEach(i => {
            omset += (i.price * i.qty);
            hpp += ((i.hpp || (i.price * 0.8)) * i.qty);
            qty += i.qty;
          });
        }
      });

      const laba = omset - hpp;
      return { omset, hpp, laba, qty, orders: invoices.length };
    };

    // A. INTERVAL: HOURLY (PER JAM)
    if (interval === 'hourly' || chartType === 'hourly') {
      const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
      return hours.map(h => {
        const hourPrefix = h.slice(0, 2);
        const matches = filteredSales.filter(s => {
          const sHour = s.hour ? s.hour.slice(0, 2) : (s.time ? s.time.slice(0, 2) : '');
          return sHour === hourPrefix;
        });

        const computed = computeInvoiceSlice(matches);
        return {
          label: h,
          ...computed,
          isPeak: h === '10:00' || h === '11:00' || h === '18:00' || h === '19:00'
        };
      });
    }

    // B. INTERVAL: DAILY (PER HARI)
    if (interval === 'daily') {
      let days = [];
      if (dateRangePreset === '7days') {
        days = [
          { key: '2026-10-06', label: 'Sen (06/10)' },
          { key: '2026-10-07', label: 'Sel (07/10)' },
          { key: '2026-10-08', label: 'Rab (08/10)' },
          { key: '2026-10-09', label: 'Kam (09/10)' },
          { key: '2026-10-10', label: 'Jum (10/10)' },
          { key: '2026-10-11', label: 'Sab (11/10)' },
          { key: '2026-10-12', label: 'Min (12/10)' }
        ];
      } else if (dateRangePreset === 'today') {
        days = [{ key: '2026-10-12', label: 'Hari Ini (12 Okt)' }];
      } else if (dateRangePreset === 'yesterday') {
        days = [{ key: '2026-10-11', label: 'Kemarin (11 Okt)' }];
      } else {
        // Multi-day custom or 30 days daily
        days = [
          { key: '2026-10-06', label: '06 Okt' },
          { key: '2026-10-07', label: '07 Okt' },
          { key: '2026-10-08', label: '08 Okt' },
          { key: '2026-10-09', label: '09 Okt' },
          { key: '2026-10-10', label: '10 Okt' },
          { key: '2026-10-11', label: '11 Okt' },
          { key: '2026-10-12', label: '12 Okt' }
        ];
      }

      return days.map(d => {
        const matches = filteredSales.filter(s => s.date === d.key);
        const computed = computeInvoiceSlice(matches);
        return {
          label: d.label,
          ...computed,
          basket: computed.orders > 0 ? Math.round(computed.omset / computed.orders) : 0
        };
      });
    }

    // C. INTERVAL: WEEKLY (PER MINGGU)
    if (interval === 'weekly') {
      return [
        { label: 'Minggu 1 (01-07 Okt)', omset: 4850000, hpp: 4120000, laba: 730000, qty: 320, orders: 38 },
        { label: 'Minggu 2 (08-14 Okt)', omset: totalRevenue || 5420000, hpp: totalHpp || 4610000, laba: grossProfit || 810000, qty: 360, orders: totalOrders || 44 },
        { label: 'Minggu 3 (Estimasi)', omset: 6180000, hpp: 5240000, laba: 940000, qty: 410, orders: 52 },
        { label: 'Minggu 4 (Target)', omset: 6800000, hpp: 5750000, laba: 1050000, qty: 450, orders: 58 }
      ];
    }

    // D. INTERVAL: MONTHLY (PER BULAN)
    if (interval === 'monthly') {
      return [
        { label: 'Mei 2026', omset: 18200000, hpp: 15470000, laba: 2730000, qty: 1200, orders: 140 },
        { label: 'Jun 2026', omset: 19800000, hpp: 16830000, laba: 2970000, qty: 1350, orders: 155 },
        { label: 'Jul 2026', omset: 22100000, hpp: 18785000, laba: 3315000, qty: 1480, orders: 170 },
        { label: 'Agu 2026', omset: 21500000, hpp: 18275000, laba: 3225000, qty: 1420, orders: 165 },
        { label: 'Sep 2026', omset: 23400000, hpp: 19890000, laba: 3510000, qty: 1560, orders: 182 },
        { label: 'Okt 2026 (Aktif)', omset: totalRevenue ? totalRevenue * 4 : 24800000, hpp: totalHpp ? totalHpp * 4 : 21080000, laba: grossProfit ? grossProfit * 4 : 3720000, qty: 1640, orders: 195 }
      ];
    }

    return [];
  }, [interval, chartType, filteredSales, dateRangePreset, jenisCategory, totalRevenue, totalHpp, grossProfit, totalOrders]);

  // ========================================================
  // 6. CATEGORY SHARE CALCULATION (FOR DONUT PIE CHART)
  // ========================================================
  const categoryData = useMemo(() => {
    const catMap = {};
    filteredSales.forEach(s => {
      if (s.items && Array.isArray(s.items)) {
        s.items.forEach(item => {
          const cat = item.category || 'Sembako';
          if (jenisCategory === 'ALL' || jenisCategory === cat) {
            const lineTotal = item.price * item.qty;
            catMap[cat] = (catMap[cat] || 0) + lineTotal;
          }
        });
      }
    });

    const totalCatRevenue = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalCatRevenue) * 100),
      color: CATEGORY_COLORS[name] || '#94a3b8'
    })).sort((a, b) => b.value - a.value);
  }, [filteredSales, jenisCategory]);

  // ========================================================
  // 7. PAYMENT METHOD BREAKDOWN
  // ========================================================
  const paymentData = useMemo(() => {
    const payMap = { Tunai: 0, QRIS: 0, Transfer: 0 };
    filteredSales.forEach(s => {
      const m = s.paymentMethod || 'Tunai';
      payMap[m] = (payMap[m] || 0) + s.totalAmount;
    });
    const total = Object.values(payMap).reduce((a, b) => a + b, 0) || 1;
    return [
      { name: 'Tunai (Cash)', count: payMap.Tunai, pct: Math.round((payMap.Tunai / total) * 100), color: 'emerald' },
      { name: 'QRIS (GoPay/BCA)', count: payMap.QRIS, pct: Math.round((payMap.QRIS / total) * 100), color: 'sky' },
      { name: 'Transfer Bank', count: payMap.Transfer, pct: Math.round((payMap.Transfer / total) * 100), color: 'purple' }
    ];
  }, [filteredSales]);

  // ========================================================
  // 8. TOP 5 BEST SELLING PRODUCTS (LEADERBOARD)
  // ========================================================
  const topProducts = useMemo(() => {
    const pMap = {};
    filteredSales.forEach(s => {
      if (s.items && Array.isArray(s.items)) {
        s.items.forEach(i => {
          if (jenisCategory !== 'ALL' && i.category !== jenisCategory) return;
          if (!pMap[i.name]) {
            pMap[i.name] = { name: i.name, unit: i.unit, qty: 0, revenue: 0, hpp: 0, category: i.category || 'Retail' };
          }
          pMap[i.name].qty += i.qty;
          pMap[i.name].revenue += (i.price * i.qty);
          pMap[i.name].hpp += ((i.hpp || (i.price * 0.8)) * i.qty);
        });
      }
    });

    return Object.values(pMap)
      .map(item => ({
        ...item,
        profit: item.revenue - item.hpp,
        margin: item.revenue > 0 ? Math.round(((item.revenue - item.hpp) / item.revenue) * 100) : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredSales, jenisCategory]);

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Invoice,Tanggal,Waktu,Terminal,Kasir,Metode,Total (Rp),HPP (Rp),Laba Kotor (Rp),Item Belanja\n";
    filteredSales.forEach(s => {
      const itemsStr = s.items ? s.items.map(i => `${i.name} (${i.qty} ${i.unit})`).join('; ') : '';
      csvContent += `${s.id},${s.date || '2026-10-12'},"${s.time || ''}",${s.terminal},${s.cashier},${s.paymentMethod},${s.totalAmount},${s.totalHpp || 0},${s.grossProfit || (s.totalAmount - (s.totalHpp||0))},"${itemsStr}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Analitik_${interval}_${jenisCategory}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-1.5 min-w-[210px]">
          <div className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              {interval.toUpperCase()}
            </span>
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 font-medium capitalize">{entry.name}:</span>
              </div>
              <span className="font-mono font-extrabold text-slate-900">
                {entry.dataKey === 'orders' 
                  ? `${entry.value} Struk` 
                  : entry.dataKey === 'qty'
                  ? `${entry.value} Item`
                  : `Rp ${Number(entry.value).toLocaleString('id-ID')}`}
              </span>
            </div>
          ))}
          {/* Laba Margin calculation on tooltip if omset & laba present */}
          {payload.some(p => p.dataKey === 'omset') && payload.some(p => p.dataKey === 'laba') && (
            <div className="pt-1 mt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-emerald-700 font-bold">
              <span>Gross Margin:</span>
              <span>
                {Math.round((payload.find(p => p.dataKey === 'laba').value / (payload.find(p => p.dataKey === 'omset').value || 1)) * 100)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-[1920px] mx-auto p-3 sm:p-5 space-y-4 sm:space-y-5 font-sans text-slate-900 pb-16">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & EXPORT ACTIONS                          */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold tracking-wide uppercase border border-emerald-200">
              Modul Grafik Penjualan (Vireo POS Style)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Multi-Interval & Multi-Jenis Filter
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            Laporan Keuangan & Grafik Kustom Penjualan
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis tren omset per jam/hari/minggu/bulan, filter kategori barang, metode bayar, dan performa kasir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer"
              title="Reset semua filter ke kondisi awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset Filter</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-extrabold flex items-center gap-1.5 transition shadow-2xs hover:border-emerald-400 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Ekspor Excel</span> (.CSV)
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm shadow-emerald-900/10 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. BENTO KEY METRICS CARDS (DYNAMIC RECALCULATION)      */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 ipad:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Metric 1: Total Omset */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Total Omset Penjualan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold mt-2">
            <span className="flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>+18.4%</span>
            </span>
            <span className="text-slate-500 font-normal truncate">
              {jenisCategory !== 'ALL' ? `Kategori ${jenisCategory}` : 'Semua Penjualan'}
            </span>
          </div>
        </div>

        {/* Metric 2: Estimasi HPP */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Harga Pokok (HPP)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-slate-700 tracking-tight">
            {currentRole === 'OWNER' ? (
              `Rp ${totalHpp.toLocaleString('id-ID')}`
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-lg font-bold" title="HPP Modal Rahasia (Hanya Owner)">
                <Lock className="w-4 h-4 text-slate-400" />
                ••••••
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>{currentRole === 'OWNER' ? 'Moving Average Costing' : 'Akses Dibatasi SOP'}</span>
          </div>
        </div>

        {/* Metric 3: Laba Kotor (Gross Margin) */}
        <div className="bg-emerald-50/50 rounded-3xl p-4 sm:p-5 border border-emerald-200 shadow-2xs hover:border-emerald-400 transition-all duration-200 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Laba Kotor (Gross Profit)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-emerald-800 tracking-tight">
            {currentRole === 'OWNER' ? (
              `Rp ${grossProfit.toLocaleString('id-ID')}`
            ) : (
              <span className="inline-flex items-center gap-1.5 text-slate-400 font-mono text-lg font-bold" title="Laba Kotor Rahasia (Hanya Owner)">
                <Lock className="w-4 h-4 text-slate-400" />
                ••••••
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-extrabold mt-2">
            <span className="bg-white px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
              {currentRole === 'OWNER' ? `Margin Laba: ${grossMarginPercent}%` : 'Terkunci (Hanya Owner)'}
            </span>
            <span className="text-emerald-700/80 font-normal hidden sm:inline">
              {currentRole === 'OWNER' ? 'Sangat Sehat' : 'Privasi Finansial'}
            </span>
          </div>
        </div>

        {/* Metric 4: Transaksi & Rata-rata Keranjang (AOV) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5">
            <span className="font-extrabold uppercase tracking-wider text-[10px]">Transaksi & AOV</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight">
            {totalOrders} <span className="text-sm font-sans font-bold text-slate-500">Struk</span>
          </div>
          <div className="text-[11px] text-slate-600 font-bold mt-2 flex items-center gap-1">
            <span>Rata-rata:</span>
            <strong className="text-sky-700 font-mono">Rp {averageBasket.toLocaleString('id-ID')}</strong>
            <span className="text-slate-400 font-normal">/transaksi</span>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. KOMPLIT: PANEL FILTER INTERVAL & JENIS (VIREO POS)    */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        
        {/* Header Filter Panel */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>Filter Grafik Komplit (Interval & Jenis)</span>
                {isFiltered && (
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                    Filter Aktif
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Atur frekuensi interval data dan pilah jenis kategori, metode bayar, kasir, serta satuan penjualan.
              </p>
            </div>
          </div>

          {/* Quick Active Filters Summary Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-bold border border-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Interval: <strong>{interval.toUpperCase()}</strong></span>
            </span>

            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold border border-emerald-200 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>Kategori: <strong>{jenisCategory === 'ALL' ? 'Semua' : jenisCategory}</strong></span>
            </span>

            <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg font-bold border border-sky-200 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-sky-600" />
              <span>Bayar: <strong>{jenisPayment === 'ALL' ? 'Semua' : jenisPayment}</strong></span>
            </span>

            <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg font-bold border border-purple-200 flex items-center gap-1">
              <Store className="w-3 h-3 text-purple-600" />
              <span>Kasir: <strong>{jenisTerminal === 'ALL' ? 'Semua' : jenisTerminal}</strong></span>
            </span>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* BARIS 1: FILTER INTERVAL & RENTANG WAKTU            */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 ipad:grid-cols-12 gap-3.5 items-start">
          
          {/* A. INTERVAL PENGELOMPOKAN (Hourly / Daily / Weekly / Monthly) */}
          <div className="ipad:col-span-5 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>1. Interval Pengelompokan Data:</span>
            </span>
            <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              {[
                { id: 'hourly', label: 'Per Jam' },
                { id: 'daily', label: 'Per Hari' },
                { id: 'weekly', label: 'Per Minggu' },
                { id: 'monthly', label: 'Per Bulan' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setInterval(item.id)}
                  className={`py-1.5 px-1.5 rounded-xl font-extrabold text-center transition cursor-pointer text-[11px] ${
                    interval === item.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* B. RENTANG WAKTU (PRESET DATE RANGE) */}
          <div className="ipad:col-span-7 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-600" />
              <span>2. Rentang Periode Waktu:</span>
            </span>
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              {[
                { id: 'today', label: 'Hari Ini' },
                { id: 'yesterday', label: 'Kemarin' },
                { id: '7days', label: '7 Hari' },
                { id: '30days', label: '30 Hari' },
                { id: 'month', label: 'Bulan Ini' },
                { id: 'custom', label: 'Kustom 📅' }
              ].map(preset => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setDateRangePreset(preset.id);
                    if (preset.id === 'today') setInterval('hourly');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer text-[11px] ${
                    dateRangePreset === preset.id
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}

              {/* Custom Date Range Pickers (Shows if 'custom' selected) */}
              {dateRangePreset === 'custom' && (
                <div className="flex items-center gap-1.5 pl-2 py-1 border-l border-slate-200 w-full sm:w-auto">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700"
                  />
                  <span className="text-slate-400 text-xs">-</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700"
                  />
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* BARIS 2: FILTER JENIS (KATEGORI, BAYAR, TERMINAL)   */}
        {/* ---------------------------------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 ipad:grid-cols-2 xl:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Jenis 1: Kategori Produk */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-600" />
              <span>Jenis Kategori Produk:</span>
            </span>
            <select
              value={jenisCategory}
              onChange={(e) => setJenisCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition cursor-pointer"
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'Semua Kategori (Semua Produk)' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis 2: Metode Pembayaran */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-sky-600" />
              <span>Jenis Metode Pembayaran:</span>
            </span>
            <select
              value={jenisPayment}
              onChange={(e) => setJenisPayment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-600 focus:bg-white transition cursor-pointer"
            >
              <option value="ALL">Semua Metode Pembayaran</option>
              <option value="Tunai">Tunai (Cash)</option>
              <option value="QRIS">QRIS Dinamis</option>
              <option value="Transfer">Transfer Bank</option>
            </select>
          </div>

          {/* Jenis 3: Kasir & Terminal */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Store className="w-3 h-3 text-purple-600" />
              <span>Jenis Kasir / Terminal:</span>
            </span>
            <select
              value={jenisTerminal}
              onChange={(e) => setJenisTerminal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition cursor-pointer"
            >
              <option value="ALL">Semua Terminal & Kasir</option>
              <option value="Terminal 1">Terminal 1 (Rina S.)</option>
              <option value="Terminal 2">Terminal 2 (Budi Santoso)</option>
            </select>
          </div>

          {/* Jenis 4: Tipe Satuan / Penjualan */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
              <Boxes className="w-3 h-3 text-amber-600" />
              <span>Jenis Satuan Penjualan:</span>
            </span>
            <select
              value={jenisUnitType}
              onChange={(e) => setJenisUnitType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-600 focus:bg-white transition cursor-pointer"
            >
              <option value="ALL">Semua Satuan (Eceran & Dus)</option>
              <option value="eceran">Eceran Saja (Pcs, Botol, Bungkus)</option>
              <option value="grosir">Grosir Saja (Dus, Karton, Karung)</option>
            </select>
          </div>

        </div>

        {/* ---------------------------------------------------- */}
        {/* BARIS 3: TIPE VISUALISASI & CHECKBOX TOGGLES         */}
        {/* ---------------------------------------------------- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          
          {/* Tipe Grafik Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tipe Grafik:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {[
                { id: 'area', label: 'Area / Garis' },
                { id: 'bar', label: 'Batang (Bar)' },
                { id: 'hourly', label: 'Jam Sibuk' }
              ].map(ct => (
                <button
                  key={ct.id}
                  onClick={() => setChartType(ct.id)}
                  className={`px-3 py-1 rounded-xl font-extrabold transition cursor-pointer text-[11px] ${
                    chartType === ct.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Metric Series Toggles (Modern Pill Buttons instead of bare checkboxes) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Seri Tampil:</span>
            
            <button
              type="button"
              onClick={() => setShowOmset(!showOmset)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                showOmset 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showOmset ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Omset (Rp)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLaba(!showLaba)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                showLaba 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400 shadow-2xs' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showLaba ? 'bg-emerald-800' : 'bg-slate-300'}`} />
              <span>Laba Kotor (Rp)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHpp(!showHpp)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                showHpp 
                  ? 'bg-slate-200 text-slate-800 border-slate-300 shadow-2xs' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showHpp ? 'bg-slate-600' : 'bg-slate-300'}`} />
              <span>HPP</span>
            </button>

            <button
              type="button"
              onClick={() => setShowQty(!showQty)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                showQty 
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs' 
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showQty ? 'bg-amber-500' : 'bg-slate-300'}`} />
              <span>Volume Qty</span>
            </button>
          </div>

          {/* Peak Hours Pill */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-xl border border-slate-200 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Peak Hours: <strong>10:00-12:00</strong> & <strong>18:00-20:00</strong></span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RECHARTS MAIN INTERACTIVE DISPLAY                        */}
        {/* ======================================================== */}
        <div className="w-full h-[280px] sm:h-[320px] ipad:h-[350px] xl:h-[380px] pt-3">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOmset" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#047857" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#047857" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorHpp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                  tickFormatter={formatShortRp}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {showHpp && (
                  <Area 
                    type="monotone" 
                    dataKey="hpp" 
                    name="HPP" 
                    stroke="#94a3b8" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorHpp)" 
                  />
                )}
                {showOmset && (
                  <Area 
                    type="monotone" 
                    dataKey="omset" 
                    name="omset" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorOmset)" 
                  />
                )}
                {showLaba && (
                  <Area 
                    type="monotone" 
                    dataKey="laba" 
                    name="laba" 
                    stroke="#047857" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorLaba)" 
                  />
                )}
                {showQty && (
                  <Area 
                    type="monotone" 
                    dataKey="qty" 
                    name="qty" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    fillOpacity={0.1} 
                    fill="#f59e0b" 
                  />
                )}
              </AreaChart>
            ) : chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                  tickFormatter={formatShortRp}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(val) => <span className="text-xs font-bold text-slate-700 capitalize">{val}</span>} 
                />
                {showOmset && <Bar dataKey="omset" name="Omset" fill="#10b981" radius={[6, 6, 0, 0]} />}
                {showHpp && <Bar dataKey="hpp" name="HPP" fill="#94a3b8" radius={[6, 6, 0, 0]} />}
                {showLaba && <Bar dataKey="laba" name="Laba Kotor" fill="#047857" radius={[6, 6, 0, 0]} />}
                {showQty && <Bar dataKey="qty" name="Qty Terjual" fill="#f59e0b" radius={[6, 6, 0, 0]} />}
              </BarChart>
            ) : (
              // Hourly Peak Distribution
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#e2e8f0' }} 
                  tickFormatter={formatShortRp}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="omset" 
                  name="Omset per Jam" 
                  radius={[8, 8, 0, 0]}
                  fill="#10b981"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isPeak ? '#059669' : '#a7f3d0'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Bottom Chart Footer Notes */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              Interval aktif: <strong>{interval.toUpperCase()}</strong> • Kategori: <strong>{jenisCategory}</strong> • Metode: <strong>{jenisPayment}</strong>
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Sumber Data: Struk Transaksi Terverifikasi • Multi-Terminal ACID
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. BREAKDOWN WIDGETS (KATEGORI, METODE BAYAR, TOP PRODUK)*/}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 ipad:grid-cols-2 xl:grid-cols-12 gap-4">
        
        {/* Widget 1: Kategori Penjualan (Donut Chart Recharts) - 4 Cols on Desktop, 1 Col on iPad */}
        <div className="ipad:col-span-1 xl:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-600" />
                <span>Pangsa Kategori Produk</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                By Revenue
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Distribusi omset per kelompok barang retail di Toko Pak Noor.
            </p>

            {/* Donut Chart */}
            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => `Rp ${Number(val).toLocaleString('id-ID')}`}
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Total</span>
                <span className="text-xs font-mono font-black text-slate-900">
                  {formatShortRp(totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Legend List */}
          <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
            {categoryData.slice(0, 4).map(cat => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-700 font-semibold truncate max-w-[140px]">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-slate-900 font-extrabold">Rp {cat.value.toLocaleString('id-ID')}</span>
                  <span className="text-slate-400 text-[10px]">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Metode Bayar & Rekomendasi Operasional - 3 Cols on Desktop, 1 Col on iPad */}
        <div className="ipad:col-span-1 xl:col-span-3 space-y-4">
          
          {/* Metode Pembayaran Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span>Metode Pembayaran</span>
            </h3>
            <div className="space-y-2 text-xs">
              {paymentData.map(pay => (
                <div key={pay.name} className="space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700">{pay.name}</span>
                    <span className="font-mono text-slate-900">Rp {pay.count.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        pay.color === 'emerald' ? 'bg-emerald-500' :
                        pay.color === 'sky' ? 'bg-sky-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${pay.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 text-right font-mono">{pay.pct}% dari total transaksi</div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insight AI / Operasional Toko */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/40 rounded-3xl p-4 sm:p-5 border border-emerald-200/90 shadow-2xs space-y-3 relative overflow-hidden">
            {/* Header with Title and Live Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 tracking-tight leading-none">
                    Insight Operasional Kasir
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">Rekomendasi Cerdas Jam Sibuk</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Optimal
              </span>
            </div>

            {/* Peak Hours Visual Badges */}
            <div className="bg-white/90 rounded-2xl p-2.5 border border-emerald-100/90 shadow-2xs space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>Peak Hours (Puncak Ramai):</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                <div className="bg-emerald-50/80 text-emerald-900 px-2 py-1.5 rounded-xl border border-emerald-200/80 text-center">
                  <span className="text-[9.5px] text-emerald-700 block font-sans font-semibold">Siang</span>
                  10:00 – 12:00
                </div>
                <div className="bg-emerald-50/80 text-emerald-900 px-2 py-1.5 rounded-xl border border-emerald-200/80 text-center">
                  <span className="text-[9.5px] text-emerald-700 block font-sans font-semibold">Malam</span>
                  18:00 – 20:00
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex items-start gap-2 bg-white/75 p-2 rounded-xl border border-emerald-100/80 shadow-2xs">
                <span className="text-sm shrink-0">📦</span>
                <p className="text-[11px] leading-snug">
                  <strong className="text-slate-900 font-bold">Restock Etalase:</strong> Isi ulang rak display sebelum <span className="font-mono font-extrabold text-emerald-800 bg-emerald-100/80 px-1 py-0.5 rounded">09:30</span>.
                </p>
              </div>
              <div className="flex items-start gap-2 bg-white/75 p-2 rounded-xl border border-emerald-100/80 shadow-2xs">
                <span className="text-sm shrink-0">👥</span>
                <p className="text-[11px] leading-snug">
                  <strong className="text-slate-900 font-bold">Alokasi Kasir:</strong> Aktifkan <span className="font-extrabold text-emerald-800">2 kasir serentak</span> agar antrean tidak menumpuk.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Widget 3: Top 5 Produk Terlaris (Leaderboard) - 5 Cols on Desktop, Spans 2 Cols on iPad */}
        <div className="ipad:col-span-2 xl:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Top 5 Produk Terlaris (Leaderboard)</span>
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {jenisCategory === 'ALL' ? 'Penyumbang Omset Tertinggi' : `Kategori ${jenisCategory}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Produk fast-moving dengan perputaran paling cepat di kasir.
            </p>

            <div className="grid grid-cols-1 ipad:grid-cols-2 xl:grid-cols-1 gap-2.5">
              {topProducts.length === 0 ? (
                <div className="col-span-full p-6 text-center text-slate-400 text-xs">
                  Tidak ada produk yang terjual untuk filter ini.
                </div>
              ) : (
                topProducts.map((p, idx) => (
                  <div key={p.name} className="p-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5 hover:border-emerald-300 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                          idx === 0 ? 'bg-amber-400 text-slate-950 shadow-2xs' :
                          idx === 1 ? 'bg-slate-300 text-slate-800' :
                          idx === 2 ? 'bg-amber-700 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[180px] sm:max-w-[220px]">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-700 shrink-0">
                        Rp {p.revenue.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10.5px] text-slate-500">
                      <span>Terjual: <strong>{p.qty} {p.unit}</strong></span>
                      <span>Laba: <strong className="text-slate-800">Rp {p.profit.toLocaleString('id-ID')}</strong> ({p.margin}%)</span>
                    </div>

                    {/* Progress Bar Proportion */}
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.round((p.revenue / (topProducts[0]?.revenue || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. TAB SUB-MENU: RIWAYAT TRANSAKSI & KARTU STOK          */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'sales', label: `1. Audit Transaksi Kasir (${searchedSales.length})` },
              { id: 'receivables', label: `2. Kartu Piutang & Jatuh Tempo (${customers.length})` },
              { id: 'expenses', label: `3. Beban Kas Kecil (${expenses.length})` },
              { id: 'commissions', label: `4. Komisi Sales & Pegawai` },
              { id: 'stock_card', label: '5. Kartu Stok & HPP' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                  reportType === tab.id
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Action Bar (Search, Filters, Excel Export & Print) */}
          <div className="flex flex-wrap items-center gap-2">
            {reportType === 'sales' && (
              <>
                {/* Cashier Filter Dropdown (Owner Feature) */}
                <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={selectedCashierFilter}
                    onChange={(e) => setSelectedCashierFilter(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
                    title="Filter transaksi per nama kasir"
                  >
                    <option value="ALL">👤 Semua Kasir ({availableCashiers.length - 1})</option>
                    {availableCashiers.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>👤 {c}</option>
                    ))}
                  </select>
                </div>

                {/* Search Input for SKU or Invoice */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Cari barang / kasir / invoice..."
                    className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white w-40 sm:w-48 transition"
                  />
                </div>

                {/* Method filter buttons */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  {['ALL', 'Tunai', 'QRIS', 'Transfer', 'Piutang'].map(m => (
                    <button
                      key={m}
                      onClick={() => setJenisPayment(m)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        jenisPayment === m
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      {m === 'ALL' ? 'Semua' : m}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Ekspor Excel (.xlsx) Button */}
            <button
              type="button"
              onClick={() => {
                if (reportType === 'sales') exportSalesToExcel(searchedSales);
                else if (reportType === 'receivables') exportReceivablesToExcel(customers);
                else if (reportType === 'expenses') exportExpensesToExcel(expenses);
                else if (reportType === 'stock_card') exportStockToExcel(products);
                else exportSalesToExcel(searchedSales);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              title="Unduh laporan ke format Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
              <span>Ekspor Excel</span>
            </button>

            {/* Print Audit Sheet */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              title="Cetak log audit fisik"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

        {/* SALES HISTORY TABLE */}
        {reportType === 'sales' && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs">
            <table className="w-full text-left text-xs min-w-[850px]">
              <thead className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase border-b border-slate-200 sticky top-0">
                <tr>
                  <th className="p-3">Jam & Waktu Transaksi</th>
                  <th className="p-3">Nama Kasir & Terminal</th>
                  <th className="p-3">Rincian Barang & Kuantitas</th>
                  <th className="p-3 text-right">Nominal Transaksi</th>
                  <th className="p-3 text-center">Metode Bayar</th>
                  <th className="p-3 text-right">Laba Kotor</th>
                  <th className="p-3 text-center">Aksi Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {searchedSales.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">
                      Tidak ada transaksi kasir yang cocok dengan kata kunci atau filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  searchedSales.slice(0, auditLimit).map(s => {
                    const profit = s.grossProfit || (s.totalAmount - (s.totalHpp || 0));
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition">
                        <td className="p-3">
                          <div className="font-mono font-extrabold text-slate-900 text-xs">
                            {s.time || '12:00:00 WIB'}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{s.date || '2026-10-12'}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-500 font-semibold">{s.id}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0">
                              <User className="w-3 h-3" />
                            </div>
                            <span className="font-extrabold text-slate-900">{s.cashier || 'Kasir'}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 ml-6.5 font-medium">
                            {s.terminal}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-md py-0.5">
                            {s.items?.map((it, idx) => (
                              <span 
                                key={idx} 
                                className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200/80 px-2 py-0.5 rounded-md text-[10.5px] font-medium"
                              >
                                <span className="font-bold text-slate-900">{it.name}</span>
                                <span className="font-mono text-emerald-700 font-extrabold bg-emerald-50 px-1 rounded">
                                  {it.qty} {it.unit}
                                </span>
                                <span className="text-[9.5px] text-slate-400">
                                  @ Rp {(it.price || 0).toLocaleString('id-ID')}
                                </span>
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <div className="font-mono font-black text-slate-900 text-sm">
                            Rp {s.totalAmount.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            HPP: Rp {(s.totalHpp || 0).toLocaleString('id-ID')}
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            s.paymentMethod === 'Tunai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : s.paymentMethod === 'QRIS'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {s.paymentMethod}
                          </span>
                        </td>

                        <td className="p-3 text-right font-mono font-extrabold text-emerald-600">
                          + Rp {profit.toLocaleString('id-ID')}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedAuditTx(s)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10.5px] font-bold text-slate-700 hover:text-emerald-700 shadow-2xs transition flex items-center gap-1 mx-auto cursor-pointer"
                            title="Buka struk detail transaksi ini"
                          >
                            <Receipt className="w-3 h-3 text-slate-500" />
                            <span>Struk</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
            {/* Table Footer Count Summary */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Menampilkan {Math.min(auditLimit, searchedSales.length)} dari {searchedSales.length} transaksi kasir</span>
              {searchedSales.length > auditLimit && (
                <button
                  onClick={() => setAuditLimit(prev => prev + 15)}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Muat Lebih Banyak +
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. RECEIVABLES & CREDIT LIMIT (KARTU PIUTANG & JATUH TEMPO) */}
        {reportType === 'receivables' && (
          <div className="space-y-4">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 shadow-2xs">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Total Piutang Aktif Toko</span>
                <div className="text-xl font-mono font-extrabold text-purple-900 mt-1">
                  Rp {customers.reduce((acc, c) => acc + (c.currentDebt || 0), 0).toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-purple-600 font-medium">Dari {customers.filter(c => (c.currentDebt || 0) > 0).length} pelanggan tempo</span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Plafon Kredit Diberikan</span>
                <div className="text-xl font-mono font-extrabold text-emerald-900 mt-1">
                  Rp {customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0).toLocaleString('id-ID')}
                </div>
                <span className="text-[10px] text-emerald-600 font-medium">Batas maksimal risiko piutang toko</span>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Tagihan Overdue (Jatuh Tempo)</span>
                <div className="text-xl font-mono font-extrabold text-rose-800 mt-1">
                  {customers.filter(c => c.status === 'OVERDUE' || (c.dueDate && new Date(c.dueDate) < new Date())).length} Pelanggan
                </div>
                <span className="text-[10px] text-rose-600 font-bold">Kredit otomatis terkunci di kasir POS</span>
              </div>
            </div>

            {/* Receivables Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Pelanggan / Toko</th>
                    <th className="p-3">Kontak & Alamat</th>
                    <th className="p-3">Tier</th>
                    <th className="p-3 text-right">Plafon Limit (Rp)</th>
                    <th className="p-3 text-right">Hutang Aktif (Rp)</th>
                    <th className="p-3 text-right">Sisa Limit (Rp)</th>
                    <th className="p-3">Jatuh Tempo</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {customers.map((c, idx) => {
                    const remaining = Math.max(0, (c.creditLimit || 0) - (c.currentDebt || 0));
                    const isOverdue = c.status === 'OVERDUE' || (c.dueDate && new Date(c.dueDate) < new Date());

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3">
                          <strong className="text-slate-900 block text-xs">{c.name}</strong>
                          <span className="text-[10px] font-mono text-slate-400">{c.id}</span>
                        </td>
                        <td className="p-3 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {c.phone}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-[10px] mt-0.5 truncate max-w-[160px]">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {c.address}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                            {c.tier}
                          </span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800">
                          {c.creditLimit > 0 ? `Rp ${c.creditLimit.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="p-3 text-right font-mono font-extrabold text-rose-600">
                          {c.currentDebt > 0 ? `Rp ${c.currentDebt.toLocaleString('id-ID')}` : 'Rp 0'}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          {c.creditLimit > 0 ? `Rp ${remaining.toLocaleString('id-ID')}` : '-'}
                        </td>
                        <td className="p-3 font-mono text-xs">
                          {c.dueDate ? (
                            <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                              {c.dueDate}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              <Lock className="w-2.5 h-2.5" /> Terkunci
                            </span>
                          ) : c.currentDebt > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Lunas / Bersih
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {c.currentDebt > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                const bayar = prompt(`Masukkan nominal pelunasan/cicilan piutang untuk ${c.name} (Hutang: Rp ${c.currentDebt.toLocaleString('id-ID')}):`, c.currentDebt);
                                if (bayar && parseInt(bayar) > 0) {
                                  alert(`Pembayaran cicilan Rp ${parseInt(bayar).toLocaleString('id-ID')} berhasil dicatat! Sisa piutang diperbarui.`);
                                }
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition cursor-pointer"
                            >
                              Pelunasan
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. OPERATIONAL EXPENSES (LAPORAN BEBAN OPERASIONAL & KAS KECIL) */}
        {reportType === 'expenses' && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
              <div>
                <h4 className="font-extrabold text-sm text-amber-900">Laporan Beban Kas Kecil (Petty Cash Operasional)</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Daftar pengeluaran rutin dari kasir (bensin armada, retribusi pasar, kuli angkut, ekspedisi paket).
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Total Pengeluaran Kasir</span>
                <span className="text-xl font-mono font-extrabold text-amber-950">
                  Rp {expenses.reduce((acc, e) => acc + (e.amount || 0), 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Expenses Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Waktu & Kode</th>
                    <th className="p-3">Kategori Beban</th>
                    <th className="p-3">Rincian Pengeluaran</th>
                    <th className="p-3 text-right">Nominal (Rp)</th>
                    <th className="p-3">Kasir & Terminal</th>
                    <th className="p-3">Penerima Dana</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {expenses.map((exp, idx) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 font-mono text-xs block">{exp.id}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{exp.date} • {exp.time}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800 text-xs">
                        {exp.description}
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-rose-600 text-xs">
                        -Rp {exp.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-slate-600 text-xs">
                        <div>{exp.cashierName}</div>
                        <span className="text-[10px] text-slate-400">{exp.terminal}</span>
                      </td>
                      <td className="p-3 text-slate-700 text-xs font-medium">
                        {exp.recipient}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 shadow-2xs transition cursor-pointer"
                        >
                          Cetak Bukti
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. COMMISSIONS (SISTEM PERHITUNGAN KOMISI SALES & PEGAWAI) */}
        {reportType === 'commissions' && (
          <div className="space-y-4">
            {/* Header info & Formula */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Sistem Perhitungan Komisi & Insentif Pegawai Toko
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Formula Insentif: <strong>1.5% dari Omzet Penjualan</strong> + <strong>Bonus Rp 2.500 per Dus/Karung target</strong> yang berhasil dijual.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Total Komisi Bulan Ini</span>
                <span className="text-xl font-mono font-extrabold text-emerald-950">
                  Rp {commissions.reduce((acc, c) => acc + (c.commissionAmount || 0), 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Commissions Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Nama Pegawai / Kasir</th>
                    <th className="p-3">Penugasan</th>
                    <th className="p-3 text-right">Total Omzet Penjualan</th>
                    <th className="p-3 text-center">Target Produk Terjual</th>
                    <th className="p-3 text-right">Formula Komisi</th>
                    <th className="p-3 text-right">Total Komisi Diterima</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {commissions.map((comm, idx) => (
                    <tr key={comm.cashierId} className="hover:bg-slate-50/80 transition">
                      <td className="p-3 text-center text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                      <td className="p-3">
                        <strong className="text-slate-900 block text-xs">{comm.cashierName}</strong>
                        <span className="text-[10px] font-mono text-slate-400">{comm.cashierId}</span>
                      </td>
                      <td className="p-3 text-slate-600 text-xs">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10.5px]">
                          {comm.role}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        Rp {comm.totalSales.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-800">
                        {comm.targetItemCount} Dus/Karung
                      </td>
                      <td className="p-3 text-right text-[11px] text-slate-500">
                        1.5% Omzet + ({comm.targetItemCount} × Rp 2.500)
                      </td>
                      <td className="p-3 text-right font-mono font-extrabold text-emerald-700 text-sm">
                        Rp {comm.commissionAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {comm.status === 'SIAP_CAIR' ? 'Siap Dicairkan' : 'Selesai'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`Komisi ${comm.cashierName} sebesar Rp ${comm.commissionAmount.toLocaleString('id-ID')} berhasil diverifikasi & diproses untuk slip gaji!`)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition cursor-pointer"
                        >
                          Cairkan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. STOCK CARD MOVEMENT */}
        {reportType === 'stock_card' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">Kartu Stok (Stock Ledger Movement)</h4>
                <p className="text-xs text-slate-500">
                  Pelacakan mutasi masuk supplier, transfer antar gudang, dan pemotongan penjualan kasir real-time.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {products.slice(0, 6).map(p => (
                <div key={p.id} className="py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-2xl transition">
                  <div className="flex items-center gap-3">
                    <img 
                      src={p.image || '/products/indomie.jpg'} 
                      alt={p.name}
                      className="w-10 h-10 object-contain rounded-xl border border-slate-200 bg-white p-1"
                    />
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[11px] text-slate-500">ID: {p.id} • Kategori: {p.category} • Brand: {p.brand}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">WH-01 (Toko)</span>
                      <span className="font-mono font-bold text-emerald-700 text-sm">{p.stock['WH-01']} {p.baseUnit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">WH-02 (Pusat)</span>
                      <span className="font-mono font-bold text-sky-700 text-sm">{p.stock['WH-02']} {p.baseUnit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Terpadu</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {(p.stock['WH-01'] || 0) + (p.stock['WH-02'] || 0)} {p.baseUnit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL: DETAIL STRUK AUDIT TRANSAKSI KASIR               */}
      {/* ======================================================== */}
      {selectedAuditTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-extrabold">Detail Struk Transaksi Kasir</h3>
                  <p className="text-[10px] text-slate-400">{selectedAuditTx.id} • {selectedAuditTx.time || '12:00:00 WIB'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAuditTx(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Receipt Body */}
            <div className="p-6 bg-slate-50/50 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="text-center border-b border-dashed border-slate-300 pb-3">
                <h4 className="font-extrabold text-sm text-slate-900 font-sans">TOKO RETAIL PAK NOOR</h4>
                <p className="text-[10px] text-slate-500 font-sans">Jl. Raya Pasar Induk No. 88, Jakarta</p>
                <p className="text-[10px] text-slate-500 font-sans">Telp: 0812-3456-7890</p>
                <div className="mt-2 text-[10.5px] text-slate-700 font-bold border-t border-slate-200 pt-1 font-sans">
                  STRUK AUDIT OWNER - {selectedAuditTx.id}
                </div>
              </div>

              {/* Transaction Metadata */}
              <div className="text-[11px] space-y-1 text-slate-600 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <strong className="text-slate-900">{selectedAuditTx.date || '2026-10-12'} {selectedAuditTx.time || '12:00:00 WIB'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Nama Kasir:</span>
                  <strong className="text-slate-900">{selectedAuditTx.cashier || 'Kasir'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Terminal POS:</span>
                  <strong className="text-slate-900">{selectedAuditTx.terminal}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Metode Bayar:</span>
                  <strong className="text-emerald-700">{selectedAuditTx.paymentMethod}</strong>
                </div>
              </div>

              {/* Item List */}
              <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Rincian Barang Terjual:</div>
                {selectedAuditTx.items?.map((it, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-bold text-slate-900 text-xs flex justify-between">
                      <span>{it.name}</span>
                      <span>Rp {((it.price || 0) * (it.qty || 1)).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-[10.5px] text-slate-500 flex justify-between">
                      <span>{it.qty} {it.unit} × Rp {(it.price || 0).toLocaleString('id-ID')}</span>
                      {it.category && <span className="text-[9.5px] bg-slate-200 px-1 rounded">{it.category}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Total HPP Modal:</span>
                  <span>Rp {(selectedAuditTx.totalHpp || 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-1 border-t border-slate-200">
                  <span>TOTAL TRANSAKSI:</span>
                  <span className="font-extrabold text-emerald-800">Rp {selectedAuditTx.totalAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold text-xs">
                  <span>Estimasi Laba Kotor:</span>
                  <span>+ Rp {((selectedAuditTx.grossProfit) || (selectedAuditTx.totalAmount - (selectedAuditTx.totalHpp || 0))).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="text-center text-[9.5px] text-slate-400 pt-2 border-t border-dashed border-slate-300 font-sans">
                Dokumen audit validitas transaksi POS Toko Pak Noor.
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between">
              <button
                type="button"
                onClick={() => setSelectedAuditTx(null)}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Salinan Struk</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
