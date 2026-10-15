import React, { useState } from 'react';
import { 
  X, 
  Split, 
  ArrowLeftRight, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Users, 
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export default function SplitBillModal({ 
  isOpen, 
  onClose, 
  cart, 
  totalAmount, 
  onProceedSplitBill 
}) {
  if (!isOpen) return null;

  const [splitMode, setSplitMode] = useState('by_item'); // 'by_item' | 'by_amount'
  
  // State for Split by Amount
  const [personCount, setPersonCount] = useState(2);
  const amountPerPerson = Math.ceil(totalAmount / personCount);

  // State for Split by Item
  // bill1 has remaining items, bill2 has moved items
  const [bill1Items, setBill1Items] = useState(
    cart.map(item => ({ ...item, qty: item.qty }))
  );
  const [bill2Items, setBill2Items] = useState([]);

  // Calculate totals for Bill 1 & Bill 2
  const bill1Total = bill1Items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const bill2Total = bill2Items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Move 1 qty from Bill 1 to Bill 2
  const moveItemToBill2 = (itemIndex) => {
    const item = bill1Items[itemIndex];
    if (!item || item.qty <= 0) return;

    // Decrement or remove from Bill 1
    let newBill1;
    if (item.qty === 1) {
      newBill1 = bill1Items.filter((_, idx) => idx !== itemIndex);
    } else {
      newBill1 = bill1Items.map((it, idx) => idx === itemIndex ? { ...it, qty: it.qty - 1 } : it);
    }
    setBill1Items(newBill1);

    // Add or increment in Bill 2
    const existingIndexInBill2 = bill2Items.findIndex(it => it.cartId === item.cartId);
    if (existingIndexInBill2 >= 0) {
      setBill2Items(bill2Items.map((it, idx) => 
        idx === existingIndexInBill2 ? { ...it, qty: it.qty + 1 } : it
      ));
    } else {
      setBill2Items([...bill2Items, { ...item, qty: 1 }]);
    }
  };

  // Move 1 qty back from Bill 2 to Bill 1
  const moveItemToBill1 = (itemIndex) => {
    const item = bill2Items[itemIndex];
    if (!item || item.qty <= 0) return;

    // Decrement or remove from Bill 2
    let newBill2;
    if (item.qty === 1) {
      newBill2 = bill2Items.filter((_, idx) => idx !== itemIndex);
    } else {
      newBill2 = bill2Items.map((it, idx) => idx === itemIndex ? { ...it, qty: it.qty - 1 } : it);
    }
    setBill2Items(newBill2);

    // Add or increment in Bill 1
    const existingIndexInBill1 = bill1Items.findIndex(it => it.cartId === item.cartId);
    if (existingIndexInBill1 >= 0) {
      setBill1Items(bill1Items.map((it, idx) => 
        idx === existingIndexInBill1 ? { ...it, qty: it.qty + 1 } : it
      ));
    } else {
      setBill1Items([...bill1Items, { ...item, qty: 1 }]);
    }
  };

  // Handle proceed payment for one of the split bills
  const handlePayBill = (billType) => {
    if (splitMode === 'by_amount') {
      onProceedSplitBill({
        type: 'by_amount',
        personIndex: 1,
        totalPersons: personCount,
        amountToPay: amountPerPerson,
        items: cart
      });
    } else {
      const selectedItems = billType === 'bill1' ? bill1Items : bill2Items;
      const amountToPay = billType === 'bill1' ? bill1Total : bill2Total;
      const remainingItems = billType === 'bill1' ? bill2Items : bill1Items;

      if (selectedItems.length === 0) return;

      onProceedSplitBill({
        type: 'by_item',
        billName: billType === 'bill1' ? 'Tagihan 1' : 'Tagihan 2',
        amountToPay,
        items: selectedItems,
        remainingItems
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-2xl animate-slide-up max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Split Bill (Pisah Tagihan)</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                  Fitur Touchscreen POS
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Pisahkan tagihan rombongan pelanggan secara fleksibel per barang atau bagi rata nominal.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Split By Item vs Split By Amount */}
        <div className="px-6 pt-4 bg-white flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setSplitMode('by_item')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition ${
              splitMode === 'by_item'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Split by Item (Pisah per Barang / Pesanan)</span>
          </button>

          <button
            onClick={() => setSplitMode('by_amount')}
            className={`pb-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition ${
              splitMode === 'by_amount'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Split by Amount (Bagi Rata Nominal)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          
          {/* MODE 1: SPLIT BY ITEM (IDENTIK DENGAN VIDEO WHATSAPP) */}
          {splitMode === 'by_item' && (
            <div className="space-y-4">
              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
                <ArrowLeftRight className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Tap tombol panah <strong>[Geser →]</strong> untuk memindahkan item belanjaan dari <strong>Tagihan 1</strong> ke <strong>Tagihan 2</strong>.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                
                {/* BILL 1 BOX */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center">
                        1
                      </span>
                      <span className="font-extrabold text-slate-800 text-sm">Tagihan 1 (Pelanggan A)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {bill1Items.reduce((sum, it) => sum + it.qty, 0)} item
                    </span>
                  </div>

                  {/* List of items in Bill 1 */}
                  <div className="flex-1 overflow-y-auto max-h-[260px] space-y-2 pr-1">
                    {bill1Items.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-medium">
                        Semua item telah dipindahkan ke Tagihan 2
                      </div>
                    ) : (
                      bill1Items.map((item, idx) => (
                        <div 
                          key={item.cartId || idx}
                          className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/80 flex items-center justify-between text-xs gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">{item.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {item.qty}x @ Rp {item.price.toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-slate-900">
                              Rp {(item.price * item.qty).toLocaleString('id-ID')}
                            </div>
                            <button
                              type="button"
                              onClick={() => moveItemToBill2(idx)}
                              className="mt-1 px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold flex items-center gap-1 transition ml-auto"
                              title="Pindahkan 1 item ke Tagihan 2"
                            >
                              <span>Pindah</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Bill 1 Footer & Total */}
                  <div className="pt-3 border-t border-slate-200 mt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500">Subtotal Tagihan 1:</span>
                      <span className="text-lg font-mono font-black text-emerald-700">
                        Rp {bill1Total.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePayBill('bill1')}
                      disabled={bill1Items.length === 0}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Bayar Tagihan 1 (Rp {bill1Total.toLocaleString('id-ID')})</span>
                    </button>
                  </div>
                </div>

                {/* BILL 2 BOX */}
                <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 flex flex-col shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center">
                        2
                      </span>
                      <span className="font-extrabold text-slate-800 text-sm">Tagihan 2 (Pelanggan B)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">
                      {bill2Items.reduce((sum, it) => sum + it.qty, 0)} item
                    </span>
                  </div>

                  {/* List of items in Bill 2 */}
                  <div className="flex-1 overflow-y-auto max-h-[260px] space-y-2 pr-1">
                    {bill2Items.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-medium">
                        Belum ada item dipindahkan ke sini. Tap tombol [Pindah →] pada Tagihan 1.
                      </div>
                    ) : (
                      bill2Items.map((item, idx) => (
                        <div 
                          key={item.cartId || idx}
                          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center justify-between text-xs gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-slate-900 truncate">{item.name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {item.qty}x @ Rp {item.price.toLocaleString('id-ID')}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="font-mono font-bold text-slate-900">
                              Rp {(item.price * item.qty).toLocaleString('id-ID')}
                            </div>
                            <button
                              type="button"
                              onClick={() => moveItemToBill1(idx)}
                              className="mt-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-[10px] font-bold flex items-center gap-1 transition ml-auto"
                              title="Kembalikan ke Tagihan 1"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Kembali</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Bill 2 Footer & Total */}
                  <div className="pt-3 border-t border-slate-200 mt-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500">Subtotal Tagihan 2:</span>
                      <span className="text-lg font-mono font-black text-blue-700">
                        Rp {bill2Total.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePayBill('bill2')}
                      disabled={bill2Items.length === 0}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Bayar Tagihan 2 (Rp {bill2Total.toLocaleString('id-ID')})</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MODE 2: SPLIT BY AMOUNT (BAGI RATA) */}
          {splitMode === 'by_amount' && (
            <div className="max-w-md mx-auto space-y-5 py-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="text-center pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Tagihan Keseluruhan:</span>
                  <div className="text-2xl font-mono font-black text-slate-900 mt-1">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">
                    Bagi Rata ke Berapa Orang:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[2, 3, 4, 5].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPersonCount(num)}
                        className={`py-2 rounded-xl text-xs font-extrabold border transition ${
                          personCount === num
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {num} Orang
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center">
                  <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">
                    Nominal Tiap Orang:
                  </span>
                  <div className="text-3xl font-mono font-black text-emerald-700">
                    Rp {amountPerPerson.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-emerald-600 mt-1 block">
                    (Total: {personCount} x Rp {amountPerPerson.toLocaleString('id-ID')})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handlePayBill('by_amount')}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proses Bayar Bagian 1 (Rp {amountPerPerson.toLocaleString('id-ID')})</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>Total Pesanan Semula: <strong className="text-slate-800 font-mono">Rp {totalAmount.toLocaleString('id-ID')}</strong></span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition"
          >
            Tutup / Batal
          </button>
        </div>

      </div>
    </div>
  );
}
