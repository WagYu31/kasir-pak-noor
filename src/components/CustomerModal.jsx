import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  X, 
  Search, 
  Phone, 
  MapPin, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle2, 
  Lock,
  Calendar,
  Building,
  ShieldAlert
} from 'lucide-react';

export default function CustomerModal({
  isOpen,
  onClose,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'new'
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Customer Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    tier: 'eceran',
    creditLimit: '1000000',
    notes: ''
  });

  if (!isOpen) return null;

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitNew = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama pelanggan wajib diisi!');
      return;
    }

    const newCust = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      name: formData.name.trim(),
      phone: formData.phone.trim() || '-',
      address: formData.address.trim() || 'Toko Depan',
      tier: formData.tier,
      creditLimit: parseInt(formData.creditLimit) || 0,
      currentDebt: 0,
      dueDate: null,
      status: 'ACTIVE',
      notes: formData.notes.trim() || 'Pelanggan baru dari kasir'
    };

    onAddCustomer(newCust);
    onSelectCustomer(newCust);
    setActiveTab('list');
    setFormData({
      name: '',
      phone: '',
      address: '',
      tier: 'eceran',
      creditLimit: '1000000',
      notes: ''
    });
    onClose();
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Manajemen Pelanggan & Limit Piutang</h3>
              <p className="text-xs text-slate-300">Pilih pelanggan transaksi atau registrasi pelanggan baru dari POS</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="bg-slate-100 px-5 pt-3 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'list' 
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-xs' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Daftar Pelanggan ({customers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition flex items-center gap-2 border-b-2 cursor-pointer ${
              activeTab === 'new' 
                ? 'bg-white text-emerald-800 border-emerald-600 shadow-xs' 
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Registrasi Pelanggan Baru</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Cari nama pelanggan, nomor telepon/WA, atau alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {/* Customer Cards List */}
              <div className="space-y-2.5">
                {filteredCustomers.map(cust => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  const isOverdue = cust.status === 'OVERDUE' || (cust.dueDate && new Date(cust.dueDate) < new Date());
                  const remainingCredit = Math.max(0, cust.creditLimit - cust.currentDebt);
                  const isLimitExceeded = cust.creditLimit > 0 && remainingCredit <= 0;

                  return (
                    <div 
                      key={cust.id}
                      onClick={() => {
                        onSelectCustomer(cust);
                        onClose();
                      }}
                      className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                        isSelected 
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 truncate">{cust.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              cust.tier === 'kontraktor' 
                                ? 'bg-purple-100 text-purple-800' 
                                : cust.tier === 'grosir' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-slate-100 text-slate-700'
                            }`}>
                              Tier: {cust.tier}
                            </span>
                            {isOverdue && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                                <Lock className="w-2.5 h-2.5" /> Overdue (Terkunci)
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {cust.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {cust.address}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {cust.creditLimit > 0 ? (
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase">Limit Piutang:</div>
                              <div className="font-mono text-xs font-bold text-slate-800">{formatRupiah(cust.creditLimit)}</div>
                              <div className="text-[10px] font-medium mt-0.5">
                                {isLimitExceeded ? (
                                  <span className="text-rose-600 font-bold">Limit Habis (Hutang: {formatRupiah(cust.currentDebt)})</span>
                                ) : (
                                  <span className="text-emerald-700 font-semibold">Sisa: {formatRupiah(remainingCredit)}</span>
                                )}
                              </div>
                              {cust.dueDate && (
                                <div className={`text-[10px] flex items-center justify-end gap-1 font-mono mt-0.5 ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                                  <Calendar className="w-2.5 h-2.5" /> Jatuh Tempo: {cust.dueDate}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Non-Kredit (Tunai)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Tab New Customer */
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Input Langsung dari Layar POS Kasir</p>
                  <p className="text-emerald-700">Pelanggan baru langsung terdaftar dan dapat langsung dipilih untuk transaksi atau pemberian fasilitas kredit/tempo.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Pelanggan / Toko / Perusahaan <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="Contoh: Toko Berkah Mandiri / Pak Haji Joko"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: 0812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Pengiriman / Domisili
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: Jl. Industri Cikande No. 40, Pasar Lama"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiering Harga Produk
                  </label>
                  <select 
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                  >
                    <option value="eceran">Eceran (Harga Normal Konsumen)</option>
                    <option value="grosir">Grosir (Toko Kelontong / Warung)</option>
                    <option value="kontraktor">Kontraktor / Proyek (Volume Besar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plafon Limit Piutang (Rp)
                  </label>
                  <input 
                    type="number"
                    step="100000"
                    placeholder="1000000"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-slate-900"
                  />
                  <span className="text-[10px] text-slate-400">Isi 0 jika hanya boleh transaksi tunai / lunas</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan / Syarat Khusus
                  </label>
                  <input 
                    type="text"
                    placeholder="Contoh: Tempo 14 hari, wajib tanda tangan BAST"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-300 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Simpan & Pilih Pelanggan Ini</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Pelanggan Aktif: <strong className="text-slate-800">{selectedCustomer?.name || 'Pelanggan Umum'}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
