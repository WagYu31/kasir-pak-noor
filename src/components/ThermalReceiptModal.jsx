import React from 'react';
import { Printer, Check, X, Download, Share2 } from 'lucide-react';

export default function ThermalReceiptModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up">
        
        {/* Modal Top Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">Struk Kasir (ESC/POS 80mm)</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="p-4 bg-slate-100 flex justify-center overflow-y-auto max-h-[70vh]">
          
          <div 
            id="thermal-receipt"
            className="w-full max-w-[280px] bg-white text-slate-900 p-4 rounded-md shadow-md font-mono text-[11px] leading-tight select-none border-t-4 border-dashed border-slate-300"
          >
            {/* Store Header */}
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <h2 className="text-sm font-extrabold tracking-tight">TOKO RETAIL PAK NOOR</h2>
              <p className="text-[9.5px] text-slate-600">Jl. Pemuda No. 42, Pasar Baru</p>
              <p className="text-[9.5px] text-slate-600">Telp: 0812-3456-7890</p>
            </div>

            {/* Transaction Metadata */}
            <div className="py-2 border-b border-dashed border-slate-300 text-[10px] space-y-0.5 text-slate-700">
              <div className="flex justify-between">
                <span>No: {transaction.id}</span>
                <span>{transaction.terminal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tgl: {transaction.date}</span>
                <span>Kasir: {transaction.cashier}</span>
              </div>
              <div className="flex justify-between">
                <span>Plg: {transaction.customer}</span>
                <span>Bayar: {transaction.paymentMethod}</span>
              </div>
            </div>

            {/* Items List */}
            <div className="py-2 border-b border-dashed border-slate-300 space-y-1.5">
              {transaction.items.map((item, idx) => (
                <div key={idx}>
                  <div className="font-bold truncate text-slate-900">{item.name}</div>
                  <div className="flex justify-between text-[10px] text-slate-600">
                    <span>
                      {item.qty} {item.unit} x {item.price.toLocaleString('id-ID')}
                    </span>
                    <span className="font-bold text-slate-900">
                      {(item.price * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="py-2 border-b border-dashed border-slate-300 text-[10px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {transaction.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {transaction.tax > 0 && (
                <div className="flex justify-between">
                  <span>PPN 11%:</span>
                  <span>Rp {transaction.tax.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-slate-300 text-slate-900">
                <span>TOTAL:</span>
                <span>Rp {transaction.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span>Bayar ({transaction.paymentMethod}):</span>
                <span>Rp {transaction.cashGiven.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900">
                <span>Kembalian:</span>
                <span>Rp {transaction.change.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 text-center text-[9px] space-y-0.5 text-slate-500">
              <p className="font-bold text-slate-800">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
              <p>Barang yang sudah dibeli tidak dapat ditukar</p>
              <p className="text-[8px] text-slate-400 mt-1">Dicetak oleh Sistem POS Pak Noor v1.0</p>
            </div>

          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 transition shadow-xs"
          >
            Tutup
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs shadow-emerald-900/10 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Struk</span>
          </button>
        </div>

      </div>
    </div>
  );
}
