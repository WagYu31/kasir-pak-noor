import React, { useState } from 'react';
import { 
  Monitor, 
  Printer, 
  Lock, 
  Barcode, 
  Wifi, 
  Tv, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Play, 
  Volume2, 
  Layers, 
  Store,
  Clock,
  User,
  Power
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function TerminalManagerModal({
  isOpen,
  onClose,
  terminals,
  setTerminals,
  activeTerminal,
  setActiveTerminal,
  currentRole,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'test' | 'hardware'
  const [editingTerminal, setEditingTerminal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [testLog, setTestLog] = useState('');
  const [drawerKickNotice, setDrawerKickNotice] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    deviceType: 'All-in-One POS Touchscreen 15"',
    ipAddress: '',
    status: 'ONLINE',
    location: '',
    printerModel: 'Epson TM-T82X Thermal 80mm',
    printerPort: 'USB',
    autoCut: true,
    drawerModel: 'SecureBox RJ11 Solenoid 24V',
    scannerModel: 'Honeywell Voyager 1400g 2D/1D',
    customerDisplay: 'VFD 2x20 Alphanumeric Display'
  });

  if (!isOpen) return null;

  const isOwnerOrSupervisor = currentRole === 'OWNER' || currentRole === 'KEPALA_TOKO';
  const isCashierLocked = currentRole === 'KASIR' && currentUser?.assignedTerminal && currentUser.assignedTerminal !== 'ALL';

  const handleOpenAdd = () => {
    setEditingTerminal(null);
    const nextNumber = terminals.length + 1;
    setFormData({
      name: `Kasir ${nextNumber}`,
      label: `Kasir ${nextNumber} (Counter Baru)`,
      deviceType: 'All-in-One POS Touchscreen 15"',
      ipAddress: `192.168.1.10${nextNumber}`,
      status: 'ONLINE',
      location: `Counter 0${nextNumber}`,
      printerModel: 'Epson TM-T82X Thermal 80mm',
      printerPort: 'USB',
      autoCut: true,
      drawerModel: 'SecureBox RJ11 Solenoid 24V',
      scannerModel: 'Honeywell Voyager 1400g 2D/1D',
      customerDisplay: 'VFD 2x20 Alphanumeric Display'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTerminal(t.id);
    setFormData({
      name: t.name,
      label: t.label,
      deviceType: t.deviceType,
      ipAddress: t.ipAddress,
      status: t.status,
      location: t.location,
      printerModel: t.hardware?.printer?.model || 'Epson TM-T82X Thermal 80mm',
      printerPort: t.hardware?.printer?.port || 'USB',
      autoCut: t.hardware?.printer?.autoCut ?? true,
      drawerModel: t.hardware?.drawer?.model || 'SecureBox RJ11 Solenoid 24V',
      scannerModel: t.hardware?.scanner?.model || 'Honeywell Voyager 1400g 2D/1D',
      customerDisplay: t.hardware?.customerDisplay?.model || 'VFD 2x20 Alphanumeric Display'
    });
    setIsFormOpen(true);
  };

  const handleDeleteTerminal = (id) => {
    if (terminals.length <= 1) {
      alert('Minimal harus ada 1 mesin kasir terdaftar!');
      return;
    }
    const target = terminals.find(t => t.id === id);
    if (confirm(`Hapus konfigurasi mesin kasir "${target?.name}"?`)) {
      setTerminals(prev => prev.filter(t => t.id !== id));
      if (activeTerminal === target?.name) {
        setActiveTerminal(terminals.find(t => t.id !== id)?.name || 'Kasir 1');
      }
    }
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingTerminal) {
      setTerminals(prev => prev.map(t => {
        if (t.id === editingTerminal) {
          return {
            ...t,
            name: formData.name.trim(),
            label: formData.label.trim() || formData.name.trim(),
            deviceType: formData.deviceType,
            ipAddress: formData.ipAddress.trim(),
            status: formData.status,
            location: formData.location.trim(),
            hardware: {
              printer: { model: formData.printerModel, port: formData.printerPort, autoCut: formData.autoCut, status: 'CONNECTED' },
              drawer: { model: formData.drawerModel, autoKickOnCash: true, status: 'CONNECTED' },
              scanner: { model: formData.scannerModel, type: 'USB HID', status: 'CONNECTED' },
              customerDisplay: { model: formData.customerDisplay, status: 'CONNECTED' }
            }
          };
        }
        return t;
      }));
    } else {
      const newId = `TRM-0${terminals.length + 1}`;
      const newTerminal = {
        id: newId,
        name: formData.name.trim(),
        label: formData.label.trim() || formData.name.trim(),
        deviceType: formData.deviceType,
        ipAddress: formData.ipAddress.trim() || '192.168.1.109',
        status: formData.status,
        currentCashier: '-',
        location: formData.location.trim() || 'Counter Kasir',
        hardware: {
          printer: { model: formData.printerModel, port: formData.printerPort, autoCut: formData.autoCut, status: 'CONNECTED' },
          drawer: { model: formData.drawerModel, autoKickOnCash: true, status: 'CONNECTED' },
          scanner: { model: formData.scannerModel, type: 'USB HID', status: 'CONNECTED' },
          customerDisplay: { model: formData.customerDisplay, status: 'CONNECTED' }
        },
        todaySales: 0,
        todayTransactions: 0
      };
      setTerminals(prev => [...prev, newTerminal]);
    }
    setIsFormOpen(false);
  };

  // Hardware Test Actions
  const testPrinter = (t) => {
    soundFX.playBeep();
    setTestLog(`[${new Date().toLocaleTimeString()}] TEST CETAK STRUK: Mengirim feed self-test ke ${t.hardware?.printer?.model} (${t.hardware?.printer?.port}). Hasil: Normal, Auto-Cutter OK.`);
  };

  const testDrawer = (t) => {
    soundFX.playCashRegister();
    setDrawerKickNotice(true);
    setTestLog(`[${new Date().toLocaleTimeString()}] TEST LACI KASIR: Pulsa Solenoid 24V dikirim ke ${t.hardware?.drawer?.model}. Status: Laci Terbuka.`);
    setTimeout(() => setDrawerKickNotice(false), 3000);
  };

  const testScanner = () => {
    soundFX.playBeep();
    setTestLog(`[${new Date().toLocaleTimeString()}] TEST BARCODE SCANNER: Beep audio normal. Decoder USB HID aktif.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-2xs font-bold">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Manajemen Mesin Kasir (Terminal POS & Hardware)
                </h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {terminals.length} Mesin Terdaftar
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi printer thermal struk, laci kasir (cash drawer), scanner barcode, dan status counter.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Action Buttons */}
        <div className="p-3 sm:p-4 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Daftar Mesin Kasir ({terminals.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'test'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Diagnostik & Uji Perangkat</span>
            </button>
          </div>

          {isOwnerOrSupervisor && activeTab === 'list' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Mesin Kasir Baru</span>
            </button>
          )}
        </div>

        {/* Drawer Kick Simulation Banner */}
        {drawerKickNotice && (
          <div className="mx-4 mt-3 bg-amber-50 text-amber-900 border border-amber-300 px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-between animate-bounce">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700" />
              [TEST SUKSES] Laci Kasir Terbuka (Solenoid Kick 24V Triggered)
            </span>
            <span className="font-mono text-[10px] text-amber-700">Port RJ11 Normal</span>
          </div>
        )}

        {/* Informative notice for restricted cashiers */}
        {isCashierLocked && (
          <div className="mx-4 sm:mx-5 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2 font-medium">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Akun Anda (<strong>{currentUser?.name}</strong>) terikat khusus pada <strong>{currentUser?.assignedTerminal}</strong> oleh Owner untuk menjaga akurasi setoran laci kasir.</span>
            </div>
          </div>
        )}

        {/* TAB 1: DAFTAR MESIN KASIR */}
        {activeTab === 'list' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terminals.map((t) => {
                const isCurrentActive = activeTerminal === t.name;
                const isOnline = t.status === 'ONLINE';

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                      isCurrentActive
                        ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${
                            isCurrentActive 
                              ? 'bg-emerald-700 text-white border-emerald-800' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            <Monitor className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-sm text-slate-900">
                                {t.name}
                              </h3>
                              {isCurrentActive && (
                                <span className="text-[9.5px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Mesin Komputer Ini
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-slate-500 font-medium">
                              {t.location}
                            </span>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                          isOnline
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                          <span>{t.status}</span>
                        </span>
                      </div>

                      {/* Device Specs & IP */}
                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                            Tipe Perangkat:
                          </span>
                          <span className="font-bold text-slate-800 text-[11px] block truncate">
                            {t.deviceType}
                          </span>
                        </div>

                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">
                            IP Jaringan LAN:
                          </span>
                          <span className="font-mono font-bold text-slate-700 text-[11px] block">
                            {t.ipAddress}
                          </span>
                        </div>
                      </div>

                      {/* Hardware Badges */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10.5px]">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium" title={t.hardware?.printer?.model}>
                          <Printer className="w-3 h-3 text-slate-500" />
                          <span>Thermal {t.hardware?.printer?.port || 'USB'}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium" title={t.hardware?.drawer?.model}>
                          <Lock className="w-3 h-3 text-slate-500" />
                          <span>Laci RJ11</span>
                        </span>

                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium" title={t.hardware?.scanner?.model}>
                          <Barcode className="w-3 h-3 text-slate-500" />
                          <span>Scanner</span>
                        </span>
                      </div>

                      {/* Shift & Sales Performance */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Kasir: <strong className="text-slate-800">{t.currentCashier}</strong></span>
                        <span>Omzet: <strong className="text-emerald-700 font-mono font-bold">Rp {t.todaySales.toLocaleString('id-ID')}</strong> ({t.todayTransactions} trx)</span>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {isCashierLocked && t.name !== currentUser.assignedTerminal ? (
                        <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg" title="Hubungi Owner/Supervisor jika ingin rolling meja kasir">
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>Terkunci (Hanya {currentUser.assignedTerminal})</span>
                        </div>
                      ) : !isCurrentActive ? (
                        <button
                          type="button"
                          onClick={() => setActiveTerminal(t.name)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Gunakan Mesin Ini</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Aktif di Perangkat Ini</span>
                        </span>
                      )}

                      {isOwnerOrSupervisor && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(t)}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer shadow-2xs"
                            title="Edit Konfigurasi Hardware Mesin"
                          >
                            <Edit2 className="w-3 h-3 text-slate-500" />
                            <span>Edit</span>
                          </button>

                          {terminals.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteTerminal(t.id)}
                              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                              title="Hapus Mesin Kasir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: DIAGNOSTIK & UJI PERANGKAT (HARDWARE TESTS) */}
        {activeTab === 'test' && (
          <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-1">
                Uji Perangkat Keras Terminal Aktif: {activeTerminal}
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Tekan tombol tes di bawah untuk memverifikasi respon fisik perangkat kasir (printer struk, solenoid laci, speaker beep).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const activeObj = terminals.find(t => t.name === activeTerminal) || terminals[0];
                    testPrinter(activeObj);
                  }}
                  className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Printer className="w-5 h-5 text-emerald-700" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Test 1</span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">
                    Cetak Self-Test Printer
                  </strong>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Kirim test feed & auto-cutter
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const activeObj = terminals.find(t => t.name === activeTerminal) || terminals[0];
                    testDrawer(activeObj);
                  }}
                  className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Test 2</span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 group-hover:text-amber-800">
                    Buka Laci Kasir (F10)
                  </strong>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Trigger sinyal 24V Solenoid RJ11
                  </span>
                </button>

                <button
                  type="button"
                  onClick={testScanner}
                  className="p-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer active:scale-98 shadow-2xs group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Test 3</span>
                  </div>
                  <strong className="text-xs font-bold text-slate-900 group-hover:text-blue-800">
                    Test Beep Scanner
                  </strong>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Verifikasi audio decoder scanner
                  </span>
                </button>
              </div>
            </div>

            {/* Test Activity Terminal Output Box */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                <span className="text-[10.5px] font-bold text-emerald-400 tracking-wider">
                  LOG STATUS HARDWARE DIAGNOSTIK
                </span>
                <span className="text-[10px] text-slate-400">Siap Menerima Perintah</span>
              </div>
              <p className="text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[50px]">
                {testLog || `Pilih salah satu tombol tes perangkat di atas untuk menguji hardware terminal ${activeTerminal}.`}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-emerald-700" />
            <span>Terminal aktif saat ini: <strong className="text-slate-900 font-bold">{activeTerminal}</strong></span>
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

      {/* FORM TAMBAH / EDIT MESIN KASIR */}
      {isFormOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  {editingTerminal ? 'Edit Konfigurasi Mesin Kasir' : 'Tambah Mesin Kasir / Terminal Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Konfigurasikan identitas dan periferal hardware terminal POS.
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

            <form onSubmit={handleSaveForm} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nama Terminal: *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="misal: Kasir 1"
                    className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Alamat IP Jaringan:
                  </label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    placeholder="192.168.1.101"
                    className="w-full bg-slate-50 text-slate-900 font-mono text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Label & Lokasi Counter:
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Counter 01 (Depan Pintu Masuk)"
                  className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tipe Perangkat Hardware:
                  </label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="All-in-One POS Touchscreen 15&quot;">All-in-One POS Touchscreen 15&quot;</option>
                    <option value="PC Desktop POS + Monitor 18.5&quot;">PC Desktop POS + Monitor</option>
                    <option value="Apple iPad 10.9&quot; / Android Tablet">Apple iPad / Android Tablet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Status Operasional:
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                  >
                    <option value="ONLINE">ONLINE (Aktif)</option>
                    <option value="STANDBY">STANDBY (Cadangan)</option>
                    <option value="MAINTENANCE">MAINTENANCE (Servis)</option>
                  </select>
                </div>
              </div>

              {/* Hardware Peripheral Fields */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                  Periferal Terhubung:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Printer Struk Thermal:
                    </label>
                    <input
                      type="text"
                      value={formData.printerModel}
                      onChange={(e) => setFormData({ ...formData, printerModel: e.target.value })}
                      placeholder="Epson TM-T82X 80mm"
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Port Printer:
                    </label>
                    <select
                      value={formData.printerPort}
                      onChange={(e) => setFormData({ ...formData, printerPort: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                    >
                      <option value="USB">USB Cable</option>
                      <option value="LAN Network">LAN Network (IP)</option>
                      <option value="Bluetooth">Bluetooth Wireless</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Laci Kasir (Cash Drawer):
                    </label>
                    <input
                      type="text"
                      value={formData.drawerModel}
                      onChange={(e) => setFormData({ ...formData, drawerModel: e.target.value })}
                      placeholder="SecureBox RJ11 24V"
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Barcode Scanner:
                    </label>
                    <input
                      type="text"
                      value={formData.scannerModel}
                      onChange={(e) => setFormData({ ...formData, scannerModel: e.target.value })}
                      placeholder="Honeywell Voyager 1400g"
                      className="w-full bg-slate-50 text-slate-900 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>
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
                  Simpan Mesin Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
