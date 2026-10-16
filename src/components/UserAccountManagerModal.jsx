import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  KeyRound, 
  Lock, 
  Check, 
  X, 
  Search, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  ChevronRight,
  Store,
  Warehouse,
  CheckCircle2,
  RefreshCw,
  Monitor
} from 'lucide-react';
import { USER_ROLES } from './UserRoleModal';

export default function UserAccountManagerModal({ 
  isOpen, 
  onClose, 
  users, 
  setUsers, 
  currentRole, 
  onSelectRole,
  onOpenTerminalManager
}) {
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'roles'
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Add / Edit Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null); // null means adding new
  const [formData, setFormData] = useState({
    name: '',
    role: 'KASIR',
    pin: '',
    email: '',
    password: 'password123',
    phone: '',
    status: 'AKTIF',
    assignedTerminal: 'ALL'
  });
  const [showPin, setShowPin] = useState({});
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  // Strict RBAC Guard: Only Owner can manage accounts & reset PINs
  if (currentRole !== 'OWNER') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">Akses Terbatas (Khusus Owner)</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
            Hanya <strong>Owner (Pemilik Bisnis - Pak Noor)</strong> yang memiliki wewenang untuk menambah kasir, mengelola akun staf, dan melihat/mereset PIN.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    );
  }

  // Filter users by search
  const filteredUsers = users.filter(u => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || 
           u.email.toLowerCase().includes(q) || 
           u.role.toLowerCase().includes(q) ||
           (u.phone && u.phone.includes(q));
  });

  const handleOpenAdd = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      role: 'KASIR',
      pin: '',
      email: '',
      password: 'password123',
      phone: '',
      status: 'AKTIF',
      assignedTerminal: 'ALL'
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      role: user.role,
      pin: user.pin,
      email: user.email,
      password: user.password || 'password123',
      phone: user.phone || '',
      status: user.status || 'AKTIF',
      assignedTerminal: user.assignedTerminal || 'ALL'
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (userId === 'OWNER') {
      alert('Akun Utama Owner (Pak Noor) tidak dapat dihapus!');
      return;
    }
    const targetUser = users.find(u => u.id === userId);
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${targetUser?.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleToggleStatus = (userId) => {
    if (userId === 'OWNER') {
      alert('Akun Utama Owner harus selalu aktif!');
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'AKTIF' ? 'NONAKTIF' : 'AKTIF';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!formData.name.trim()) {
      setFormError('Nama lengkap staf kasir wajib diisi!');
      return;
    }

    if (!formData.pin || formData.pin.length !== 4 || isNaN(formData.pin)) {
      setFormError('PIN kasir harus tepat 4 digit angka (misal: 1234)!');
      return;
    }

    // Role styling
    let avatarBg = 'bg-amber-100 text-amber-800 border-amber-300';
    let roleTitle = 'Kasir Toko (Frontliner)';
    let description = 'Transaksi kasir POS & buka/tutup shift kasir';

    if (formData.role === 'OWNER') {
      avatarBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      roleTitle = 'Owner (Pemilik Bisnis)';
      description = 'Akses penuh ke seluruh modul, omzet finansial, master produk & HPP modal';
    } else if (formData.role === 'KEPALA_TOKO') {
      avatarBg = 'bg-blue-100 text-blue-800 border-blue-300';
      roleTitle = 'Kepala Toko / Supervisor';
      description = 'Otorisasi void kasir, stock opname fisik toko & audit setoran kasir';
    } else if (formData.role === 'GUDANG_DC') {
      avatarBg = 'bg-purple-100 text-purple-800 border-purple-300';
      roleTitle = 'Staf Logistik & Gudang DC';
      description = 'Penerimaan barang supplier, mutasi armada box & planogram rak';
    }

    if (editingUserId) {
      // Update existing user
      setUsers(prev => prev.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: formData.name.trim(),
            role: formData.role,
            roleTitle: roleTitle,
            description: description,
            pin: formData.pin,
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim(),
            status: formData.status,
            assignedTerminal: formData.assignedTerminal || 'ALL',
            avatarBg: avatarBg
          };
        }
        return u;
      }));
    } else {
      // Add new user
      const newId = 'USR-' + Date.now().toString().slice(-4);
      const newUser = {
        id: newId,
        name: formData.name.trim(),
        role: formData.role,
        roleTitle: roleTitle,
        description: description,
        pin: formData.pin,
        email: formData.email.trim() || `kasir${newId.toLowerCase()}@tokopaknoor.com`,
        password: formData.password || 'password123',
        phone: formData.phone.trim() || '0812-0000-' + Math.floor(1000 + Math.random() * 9000),
        status: formData.status || 'AKTIF',
        assignedTerminal: formData.assignedTerminal || 'ALL',
        avatarBg: avatarBg
      };
      setUsers(prev => [...prev, newUser]);
    }

    setIsFormOpen(false);
  };

  const toggleShowPin = (id) => {
    setShowPin(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-2xs font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Manajemen Akun & Hak Akses Kasir
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {users.length} Akun Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola daftar kasir, reset PIN 4-digit, atur wewenang supervisor, dan pantau status staf toko.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector & Action Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('accounts')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'accounts'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Daftar Akun & Kasir ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roles')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roles'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Matriks Hak Akses (RBAC)</span>
            </button>

            {onOpenTerminalManager && (
              <button
                type="button"
                onClick={onOpenTerminalManager}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-200/60 transition flex items-center gap-1.5 cursor-pointer"
                title="Buka Manajemen Mesin Kasir, Tambah Mesin Baru & Setting Hardware"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-700" />
                <span>Mesin Kasir (Terminal)</span>
              </button>
            )}
          </div>

          {activeTab === 'accounts' && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, email, peran..."
                  className="bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 w-44 sm:w-56"
                />
              </div>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Akun Baru</span>
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: Daftar Akun Staf & Kasir */}
        {activeTab === 'accounts' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredUsers.map((user) => {
                const isOwner = user.role === 'OWNER';
                const isViewingPin = showPin[user.id];
                const isActiveRole = currentRole === user.role;

                return (
                  <div
                    key={user.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 shadow-2xs transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Avatar, Name, Role Badge, Status */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${user.avatarBg}`}>
                            {user.name.charAt(0)}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                                {user.name}
                              </h3>
                              {isActiveRole && (
                                <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Sedang Aktif
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              {user.roleTitle || user.role}
                            </span>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(user.id)}
                          className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border cursor-pointer transition ${
                            user.status === 'AKTIF'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Klik untuk ubah status akun"
                        >
                          {user.status || 'AKTIF'}
                        </button>
                      </div>

                      {/* Detail Grid */}
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                            PIN Kasir (4 Digit):
                          </span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-extrabold text-slate-800 text-xs">
                              {isViewingPin ? user.pin : '••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleShowPin(user.id)}
                              className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                              title={isViewingPin ? "Sembunyikan PIN" : "Lihat PIN"}
                            >
                              {isViewingPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                            No. WhatsApp / HP:
                          </span>
                          <span className="font-mono font-semibold text-slate-700 text-xs truncate block">
                            {user.phone || '0812-3456-7890'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 font-mono truncate">
                        Email: <strong className="text-slate-700 font-sans">{user.email || 'kasir@tokopaknoor.com'}</strong>
                      </div>

                      {/* Terminal Authorization Badge */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          <span>Izin Mesin Kasir:</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          user.assignedTerminal && user.assignedTerminal !== 'ALL'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {user.assignedTerminal && user.assignedTerminal !== 'ALL'
                            ? `🔒 Khusus ${user.assignedTerminal}`
                            : '🌐 Bebas (Semua Mesin)'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRole(user.role);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Masuk sebagai peran pengguna ini"
                      >
                        <UserCheck className="w-3 h-3 text-emerald-700" />
                        <span>Beralih Peran</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                          title="Edit Akun & Ubah PIN"
                        >
                          <Edit2 className="w-3 h-3 text-slate-500" />
                          <span>Edit / PIN</span>
                        </button>

                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                            title="Hapus Akun Staf"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Tidak ada akun yang sesuai dengan pencarian "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Matriks Hak Akses (RBAC) */}
        {activeTab === 'roles' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {Object.values(USER_ROLES).map((role) => {
                const isActive = currentRole === role.id;
                return (
                  <div
                    key={role.id}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isActive 
                        ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500/20' 
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block ${role.badgeColor}`}>
                          {role.roleTitle}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                            <Check className="w-3 h-3" /> Sedang Aktif
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 mb-1">{role.name}</h3>
                      <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                        {role.description}
                      </p>

                      <div className="border-t border-slate-100 pt-2 mb-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Menu Yang Terbuka:</span>
                        <div className="flex flex-wrap gap-1">
                          {role.allowedTabs.map(tab => (
                            <span key={tab} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                              {tab}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-2 space-y-1 text-xs text-slate-600">
                        {role.permissions.map((perm, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
                            <span>{perm}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => {
                          onSelectRole(role.id);
                          onClose();
                        }}
                        className="mt-3 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold text-center transition cursor-pointer"
                      >
                        Beralih ke Peran {role.name}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-emerald-700" />
            <span>Setiap akun memiliki PIN unik untuk login kasir cepat & otorisasi shift.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-xs cursor-pointer"
          >
            Selesai
          </button>
        </div>

      </div>

      {/* MODAL FORM: TAMBAH / EDIT AKUN */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingUserId ? 'Edit Akun Staf & PIN Kasir' : 'Tambah Akun Kasir / Staf Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Data ini disinkronkan langsung ke layar login kasir.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap Kasir / Staf: *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="contoh: Dewi Lestari"
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Peran / Hak Akses: *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="KASIR">Kasir Toko (Frontliner)</option>
                    <option value="KEPALA_TOKO">Kepala Toko / Supervisor</option>
                    <option value="GUDANG_DC">Staf Gudang DC</option>
                    <option value="OWNER">Owner (Pemilik Bisnis)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PIN Kasir (4-Digit Angka): *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                    placeholder="misal: 3344"
                    className="w-full bg-slate-50 text-slate-900 font-mono text-xs font-black tracking-widest px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    No. WhatsApp / HP:
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Status Akun:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="AKTIF">AKTIF</option>
                    <option value="NONAKTIF">NONAKTIF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Login (Opsional):
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="dewi@tokopaknoor.com"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kata Sandi Login:
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="password123"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    Otorisasi Mesin Kasir (Terminal POS):
                  </label>
                  {onOpenTerminalManager && (
                    <button
                      type="button"
                      onClick={onOpenTerminalManager}
                      className="text-[10.5px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
                      title="Tambah mesin kasir baru di sistem"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Tambah Mesin Kasir</span>
                    </button>
                  )}
                </div>
                <select
                  value={formData.assignedTerminal || 'ALL'}
                  onChange={(e) => setFormData({ ...formData, assignedTerminal: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 cursor-pointer"
                >
                  <option value="ALL">Semua Mesin Kasir (Bebas / Floating & Rolling)</option>
                  <option value="Kasir 1">🔒 Terkunci di Kasir 1 (Counter Utama 01)</option>
                  <option value="Kasir 2">🔒 Terkunci di Kasir 2 (Counter Express 02)</option>
                  <option value="Kasir 3">🔒 Terkunci di Kasir 3 (Counter Cadangan 03)</option>
                  <option value="Tablet Toko">🔒 Terkunci di Tablet Toko (Mobile)</option>
                </select>
                <p className="text-[10.5px] text-slate-500 mt-1 leading-normal">
                  Jika dikunci ke mesin tertentu, kasir tidak dapat login atau bertransaksi di mesin lain untuk mencegah selisih uang fisik laci kasir (drawer).
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-2xs cursor-pointer"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
