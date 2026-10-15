import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Check, 
  Store, 
  Warehouse, 
  Package, 
  BarChart3, 
  UserCheck, 
  X, 
  Lock, 
  KeyRound,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';

export const USER_ROLES = {
  OWNER: {
    id: 'OWNER',
    name: 'Pak Noor',
    roleTitle: 'Owner (Pemilik Bisnis)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Akses penuh tanpa batas (Super Admin) ke seluruh fitur, finansial, HPP modal, dan multi-cabang.',
    allowedTabs: ['pos', 'inventory', 'products', 'reports', 'shift'],
    permissions: [
      'Akses POS Kasir & Seluruh Terminal',
      'Akses Multi-Gudang (Toko & DC)',
      'Edit Master Produk, HPP Modal & Harga',
      'Laporan Laba/Rugi & Analitik Finansial',
      'Audit Shift & Keuangan Kasir',
      'Manajemen Hak Akses & PIN Supervisor'
    ]
  },
  KEPALA_TOKO: {
    id: 'KEPALA_TOKO',
    name: 'Bambang S.',
    roleTitle: 'Kepala Toko / Supervisor',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Mengawasi operasional harian toko, otorisasi void kasir, stock opname fisik toko, dan setoran kasir.',
    allowedTabs: ['pos', 'inventory', 'products', 'reports', 'shift'],
    permissions: [
      'Akses POS Kasir & Otorisasi Void/Diskon',
      'Inventori Toko & Stock Opname Toko (WH-01)',
      'Lihat Master Produk (Tanpa Edit HPP Rahasia)',
      'Laporan Omzet Penjualan Toko Harian',
      'Audit Setoran & Rekonsiliasi Kasir'
    ]
  },
  KASIR: {
    id: 'KASIR',
    name: 'Rina S.',
    roleTitle: 'Kasir Toko (Frontliner)',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Fokus melayani pelanggan, scanning barcode kilat, transaksi pembayaran, dan tutup shift kasir.',
    allowedTabs: ['pos', 'shift'],
    permissions: [
      'Akses POS Kasir (Scan, Hold, Multiplier, Bayar)',
      'Buka / Tutup Shift Kasir Sendiri',
      'Cetak & Reprint Struk Belanja Pelanggan',
      'Layar Pelanggan (Customer Display)',
      '🔒 Menu Finansial & Gudang DC Dibatasi',
      '🔒 Void Memerlukan PIN Supervisor'
    ]
  },
  GUDANG_DC: {
    id: 'GUDANG_DC',
    name: 'Agus P.',
    roleTitle: 'Staf Logistik & Gudang DC',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Mengelola penerimaan supplier, muat armada mobil box antar-gudang, penataan rak pallet, dan label rak.',
    allowedTabs: ['inventory', 'products'],
    permissions: [
      'Penerimaan Barang Supplier (LPB Inbound)',
      'Surat Jalan Mutasi Antar-Gudang (Armada Box)',
      'Peta Planogram & Tata Letak Rak Gudang',
      'Stock Opname Fisik & BAST Gudang DC',
      'Cetak Label Rak Minimarket (Shelf Tags)',
      '🔒 Menu POS Kasir & Laporan Keuangan Dibatasi'
    ]
  }
};

export default function UserRoleModal({ 
  isOpen, 
  onClose, 
  currentRole, 
  onSelectRole 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                Manajemen Peran & Hak Akses Pengguna (RBAC)
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  4 Peran Retail Aktif
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap pengguna memiliki menu dan hak akses berbeda sesuai SOP retail Alfamart / Indomaret.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 4 Role Cards */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {Object.values(USER_ROLES).map((role) => {
              const isActive = currentRole === role.id;

              return (
                <div 
                  key={role.id}
                  onClick={() => {
                    onSelectRole(role.id);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                    isActive 
                      ? 'bg-emerald-50/50 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  {/* Top: Name & Role Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block mb-1 ${role.badgeColor}`}>
                          {role.roleTitle}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900">{role.name}</h3>
                      </div>
                      {isActive ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" /> Sedang Aktif
                        </span>
                      ) : (
                        <button className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-0.5">
                          Pilih Profil <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                      {role.description}
                    </p>

                    {/* Visible Menus for this role */}
                    <div className="border-t border-slate-100 pt-2 mb-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Menu Yang Terbuka:</span>
                      <div className="flex flex-wrap gap-1">
                        {role.allowedTabs.includes('pos') && (
                          <span className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Kasir POS [F1]
                          </span>
                        )}
                        {role.allowedTabs.includes('inventory') && (
                          <span className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Inventori & Mutasi [F2]
                          </span>
                        )}
                        {role.allowedTabs.includes('products') && (
                          <span className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Master Produk [F3]
                          </span>
                        )}
                        {role.allowedTabs.includes('reports') && (
                          <span className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Laporan & Laba [F4]
                          </span>
                        )}
                        {role.allowedTabs.includes('shift') && (
                          <span className="text-[10.5px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Shift Kasir [F5]
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Permissions Bullet Points */}
                  <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px] text-slate-600">
                    {role.permissions.map((perm, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                        <span>{perm}</span>
                      </div>
                    ))}
                  </div>

                  {/* Select button if not active */}
                  {!isActive && (
                    <button 
                      onClick={() => onSelectRole(role.id)}
                      className="mt-3 w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition"
                    >
                      Beralih ke Peran {role.name}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>SOP Toko:</strong> Otorisasi void, diskon manual kasir, dan penyesuaian opname memerlukan PIN Supervisor (Default: <code className="font-mono font-bold text-slate-800">1234</code>).
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              PIN Proteksi Aktif
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Tutup & Simpan Pilihan
          </button>
        </div>

      </div>
    </div>
  );
}
