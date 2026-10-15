import * as XLSX from 'xlsx';

/**
 * Utility function to download an array of objects as an Excel (.xlsx) file
 */
export function downloadExcel(data, fileName = 'laporan.xlsx', sheetName = 'Data') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Auto-fit column widths
    const maxProps = Object.keys(data[0] || {});
    worksheet['!cols'] = maxProps.map(key => ({
      wch: Math.max(key.length, 14)
    }));

    XLSX.writeFile(workbook, fileName);
    return true;
  } catch (err) {
    console.error('Error generating Excel file:', err);
    alert('Gagal membuat file Excel: ' + err.message);
    return false;
  }
}

/**
 * Export Sales & Cashier Audit Log to Excel
 */
export function exportSalesToExcel(salesHistory, fileName = 'Laporan_Penjualan_Audit_Kasir.xlsx') {
  const formatted = salesHistory.map((s, idx) => ({
    'No': idx + 1,
    'No Invoice': s.id,
    'Tanggal': s.dateStr || s.date || '2026-10-15',
    'Jam Transaksi': s.time,
    'Nama Kasir': s.cashier,
    'Terminal POS': s.terminal || 'Kasir 1',
    'Nama Pelanggan': s.customer || 'Pelanggan Umum',
    'Metode Pembayaran': s.paymentMethod,
    'Total Transaksi (Rp)': s.total,
    'Laba Kotor (Rp)': s.profit || 0,
    'Rincian Barang': (s.items || []).map(i => `${i.name} (${i.qty} ${i.selectedUnit || 'Pcs'})`).join('; ')
  }));

  return downloadExcel(formatted, fileName, 'Penjualan');
}

/**
 * Export Inventory & Stock Opname to Excel
 */
export function exportStockToExcel(products, fileName = 'Laporan_Stok_Opname_Gudang.xlsx') {
  const formatted = products.map((p, idx) => ({
    'No': idx + 1,
    'Kode SKU': p.id,
    'Nama Produk': p.name,
    'Kategori': p.category,
    'Brand': p.brand,
    'Satuan Dasar': p.baseUnit,
    'Stok Toko (WH-01)': p.stock['WH-01'] || 0,
    'Stok DC Pusat (WH-02)': p.stock['WH-02'] || 0,
    'Total Stok Fisik': (p.stock['WH-01'] || 0) + (p.stock['WH-02'] || 0),
    'Lokasi Rak Toko': typeof p.rack === 'object' ? (p.rack['WH-01'] || '-') : p.rack,
    'Lokasi Pallet DC': typeof p.rack === 'object' ? (p.rack['WH-02'] || '-') : '-',
    'Batas Min Stok': p.minStock,
    'Batch & No Lot': p.batchNo || '-',
    'Tanggal Kadaluarsa': p.expiryDate || '-',
    'HPP Modal (Rp)': p.units?.[0]?.hpp || 0,
    'Harga Eceran (Rp)': p.units?.[0]?.prices?.eceran || 0,
    'Harga Grosir (Rp)': p.units?.[0]?.prices?.grosir1 || 0
  }));

  return downloadExcel(formatted, fileName, 'Stok_Gudang');
}

/**
 * Export Operational Expenses (Kas Kecil) to Excel
 */
export function exportExpensesToExcel(expenses, fileName = 'Laporan_Beban_Kas_Kecil.xlsx') {
  const formatted = expenses.map((e, idx) => ({
    'No': idx + 1,
    'Kode Pengeluaran': e.id,
    'Tanggal': e.date,
    'Jam': e.time,
    'Kategori Beban': e.category,
    'Keterangan': e.description,
    'Nominal (Rp)': e.amount,
    'Kasir': e.cashierName,
    'Terminal': e.terminal,
    'Penerima': e.recipient,
    'Sumber Dana': e.paymentSource
  }));

  return downloadExcel(formatted, fileName, 'Beban_Kas_Kecil');
}

/**
 * Export Accounts Receivable (Kartu Piutang & Limit Kredit) to Excel
 */
export function exportReceivablesToExcel(customers, fileName = 'Laporan_Kartu_Piutang_Pelanggan.xlsx') {
  const formatted = customers.map((c, idx) => {
    const sisaLimit = Math.max(0, (c.creditLimit || 0) - (c.currentDebt || 0));
    return {
      'No': idx + 1,
      'ID Pelanggan': c.id,
      'Nama Pelanggan / Toko': c.name,
      'No WhatsApp / Telp': c.phone,
      'Alamat': c.address,
      'Tier Harga': c.tier,
      'Plafon Limit Kredit (Rp)': c.creditLimit,
      'Total Piutang Aktif (Rp)': c.currentDebt,
      'Sisa Plafon Kredit (Rp)': sisaLimit,
      'Tanggal Jatuh Tempo': c.dueDate || '-',
      'Status Piutang': c.status,
      'Catatan': c.notes || '-'
    };
  });

  return downloadExcel(formatted, fileName, 'Kartu_Piutang');
}
