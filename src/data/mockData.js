export const INITIAL_WAREHOUSES = [
  { 
    id: 'WH-01', 
    name: 'Gudang Toko (Area Depan & Display)', 
    code: 'G-TOKO', 
    address: 'Jl. Pemuda No. 42 (Lantai 1)', 
    pic: 'Bambang S. (Kepala Toko)',
    capacity: '85% Terisi' 
  },
  { 
    id: 'WH-02', 
    name: 'Gudang Pusat / DC (Penyimpanan Cadangan)', 
    code: 'G-PUSAT', 
    address: 'Jl. Industri No. 12 (Blok B - DC)', 
    pic: 'Agus P. (Supervisor DC)',
    capacity: '62% Terisi' 
  },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-001',
    name: 'Minyak Goreng Sania 2L',
    category: 'Sembako',
    brand: 'Wilmar',
    image: '/products/sania.jpg',
    supplier: 'PT Berkah Pangan Mandiri',
    tax: 0.11,
    minStock: 20,
    baseUnit: 'Pcs',
    rack: { 'WH-01': 'Rak A-02 (Sembako)', 'WH-02': 'Pallet P-01 (DC)' },
    batchNo: 'SN-2609-B1',
    expiryDate: '2027-11-20',
    units: [
      {
        unit: 'Dus',
        multiplier: 6,
        barcode: '8991234001001',
        prices: { eceran: 215000, grosir1: 208000, grosir2: 204000, member: 205000 },
        hpp: 192000
      },
      {
        unit: 'Pcs',
        multiplier: 1,
        barcode: '8991234001002',
        prices: { eceran: 37000, grosir1: 35500, grosir2: 34500, member: 35000 },
        hpp: 32000
      }
    ],
    stock: {
      'WH-01': 48,  // 8 Dus in Pcs
      'WH-02': 180  // 30 Dus in Pcs
    }
  },
  {
    id: 'PRD-002',
    name: 'Indomie Goreng Spesial 85g',
    category: 'Makanan Instan',
    brand: 'Indofood',
    image: '/products/indomie.jpg',
    supplier: 'PT Indomarco Adi Prima',
    tax: 0,
    minStock: 100,
    baseUnit: 'Pcs',
    rack: { 'WH-01': 'Rak B-01 (Mie)', 'WH-02': 'Pallet P-03 (DC)' },
    batchNo: 'IDM-2608-F4',
    expiryDate: '2027-06-15',
    units: [
      {
        unit: 'Karton',
        multiplier: 40,
        barcode: '899886611001',
        prices: { eceran: 128000, grosir1: 122000, grosir2: 119000, member: 120000 },
        hpp: 110000
      },
      {
        unit: 'Pack (10)',
        multiplier: 10,
        barcode: '899886611002',
        prices: { eceran: 33000, grosir1: 31500, grosir2: 30500, member: 31000 },
        hpp: 28000
      },
      {
        unit: 'Pcs',
        multiplier: 1,
        barcode: '899886611003',
        prices: { eceran: 3500, grosir1: 3200, grosir2: 3100, member: 3150 },
        hpp: 2750
      }
    ],
    stock: {
      'WH-01': 240, // 6 Karton
      'WH-02': 1200 // 30 Karton
    }
  },
  {
    id: 'PRD-003',
    name: 'Beras Premium Ramos 5kg',
    category: 'Sembako',
    brand: 'Top Koki',
    image: '/products/beras.jpg',
    supplier: 'PT Beras Nusantara Jaya',
    tax: 0,
    minStock: 15,
    baseUnit: 'Karung',
    rack: { 'WH-01': 'Rak A-01 (Beras)', 'WH-02': 'Pallet P-05 (DC)' },
    batchNo: 'BRS-2610-A1',
    expiryDate: '2027-10-01',
    units: [
      {
        unit: 'Karung',
        multiplier: 1,
        barcode: '899554422001',
        prices: { eceran: 76000, grosir1: 73000, grosir2: 71000, member: 72000 },
        hpp: 67000
      }
    ],
    stock: {
      'WH-01': 24,
      'WH-02': 150
    }
  },
  {
    id: 'PRD-004',
    name: 'Gula Pasir Putih Gulaku 1kg',
    category: 'Sembako',
    brand: 'Gulaku',
    image: '/products/gulaku.jpg',
    supplier: 'PT Berkah Pangan Mandiri',
    tax: 0,
    minStock: 30,
    baseUnit: 'Pcs',
    rack: { 'WH-01': 'Rak A-03 (Gula)', 'WH-02': 'Pallet P-02 (DC)' },
    batchNo: 'GLK-2609-C3',
    expiryDate: '2028-01-10',
    units: [
      {
        unit: 'Dus (24)',
        multiplier: 24,
        barcode: '899223344001',
        prices: { eceran: 420000, grosir1: 408000, grosir2: 400000, member: 404000 },
        hpp: 384000
      },
      {
        unit: 'Pcs',
        multiplier: 1,
        barcode: '899223344002',
        prices: { eceran: 18000, grosir1: 17200, grosir2: 16800, member: 17000 },
        hpp: 16000
      }
    ],
    stock: {
      'WH-01': 52,
      'WH-02': 240
    }
  },
  {
    id: 'PRD-005',
    name: 'Air Mineral Le Minerale 600ml',
    category: 'Minuman',
    brand: 'Mayora',
    image: '/products/le_minerale.jpg',
    supplier: 'PT Tirta Fresindo Jaya',
    tax: 0.11,
    minStock: 24,
    baseUnit: 'Botol',
    rack: { 'WH-01': 'Chiller 01 & Rak C', 'WH-02': 'Pallet P-08 (DC)' },
    batchNo: 'LMN-2609-D2',
    expiryDate: '2027-09-30',
    units: [
      {
        unit: 'Dus (24)',
        multiplier: 24,
        barcode: '899332211001',
        prices: { eceran: 74000, grosir1: 70000, grosir2: 67000, member: 68500 },
        hpp: 62000
      },
      {
        unit: 'Botol',
        multiplier: 1,
        barcode: '899332211002',
        prices: { eceran: 3500, grosir1: 3100, grosir2: 2900, member: 3000 },
        hpp: 2600
      }
    ],
    stock: {
      'WH-01': 96,
      'WH-02': 480
    }
  },
  {
    id: 'PRD-006',
    name: 'Kopi Kapal Api Spesial Mix 10x24g',
    category: 'Minuman',
    brand: 'Kapal Api',
    image: '/products/kapal_api.jpg',
    supplier: 'PT Santos Jaya Abadi',
    tax: 0.11,
    minStock: 20,
    baseUnit: 'Renceng',
    rack: { 'WH-01': 'Rak C-02 (Kopi)', 'WH-02': 'Pallet P-06 (DC)' },
    batchNo: 'KPA-2607-G1',
    expiryDate: '2027-07-22',
    units: [
      {
        unit: 'Karton (12)',
        multiplier: 12,
        barcode: '899445566001',
        prices: { eceran: 175000, grosir1: 168000, grosir2: 164000, member: 165000 },
        hpp: 154000
      },
      {
        unit: 'Renceng',
        multiplier: 1,
        barcode: '899445566002',
        prices: { eceran: 15500, grosir1: 14500, grosir2: 14000, member: 14200 },
        hpp: 12900
      }
    ],
    stock: {
      'WH-01': 36,
      'WH-02': 180
    }
  },
  {
    id: 'PRD-007',
    name: 'Deterjen Rinso Anti Noda 770g',
    category: 'Perawatan Rumah',
    brand: 'Unilever',
    image: '/products/rinso.jpg',
    supplier: 'PT Unilever Indonesia Tbk',
    tax: 0.11,
    minStock: 15,
    baseUnit: 'Pcs',
    rack: { 'WH-01': 'Rak D-01 (Sabun)', 'WH-02': 'Pallet P-09 (DC)' },
    batchNo: 'RNS-2608-K3',
    expiryDate: '2028-05-18',
    units: [
      {
        unit: 'Dus (12)',
        multiplier: 12,
        barcode: '899667788001',
        prices: { eceran: 285000, grosir1: 275000, grosir2: 270000, member: 272000 },
        hpp: 252000
      },
      {
        unit: 'Pcs',
        multiplier: 1,
        barcode: '899667788002',
        prices: { eceran: 25000, grosir1: 23800, grosir2: 23000, member: 23500 },
        hpp: 21000
      }
    ],
    stock: {
      'WH-01': 18,
      'WH-02': 72
    }
  },
  {
    id: 'PRD-008',
    name: 'Susu UHT Ultra Milk Cokelat 1L',
    category: 'Minuman',
    brand: 'Ultrajaya',
    image: '/products/ultra_milk.jpg',
    supplier: 'PT Ultrajaya Milk Industry',
    tax: 0.11,
    minStock: 12,
    baseUnit: 'Pcs',
    rack: { 'WH-01': 'Chiller 02 & Rak C', 'WH-02': 'Pallet P-04 (DC)' },
    batchNo: 'UM-2609-M8',
    expiryDate: '2027-04-12',
    units: [
      {
        unit: 'Karton (12)',
        multiplier: 12,
        barcode: '899778899001',
        prices: { eceran: 228000, grosir1: 220000, grosir2: 216000, member: 217000 },
        hpp: 198000
      },
      {
        unit: 'Pcs',
        multiplier: 1,
        barcode: '899778899002',
        prices: { eceran: 20000, grosir1: 19000, grosir2: 18500, member: 18800 },
        hpp: 16500
      }
    ],
    stock: {
      'WH-01': 14,
      'WH-02': 96
    }
  },
  {
    id: 'PRD-009',
    name: 'Susu Bubuk Dancow 1+ Madu 800g',
    category: 'Susu & Bayi',
    brand: 'Nestle',
    image: '/products/dancow.jpg',
    supplier: 'PT Nestle Indonesia',
    tax: 0.11,
    minStock: 10,
    baseUnit: 'Box',
    rack: { 'WH-01': 'Rak A-04 (Susu Bubuk)', 'WH-02': 'Pallet P-07 (DC)' },
    batchNo: 'DCW-2601-N2',
    expiryDate: '2026-11-05', // FEFO: Less than 30 days!
    isHighShrinkage: true,
    units: [
      {
        unit: 'Karton (12)',
        multiplier: 12,
        barcode: '899881122001',
        prices: { eceran: 1140000, grosir1: 1110000, grosir2: 1090000, member: 1100000 },
        hpp: 1020000
      },
      {
        unit: 'Box',
        multiplier: 1,
        barcode: '899881122002',
        prices: { eceran: 98000, grosir1: 94500, grosir2: 92000, member: 93500 },
        hpp: 85000
      }
    ],
    stock: {
      'WH-01': 8,
      'WH-02': 48
    }
  },
  {
    id: 'PRD-010',
    name: 'Rokok Sampoerna A Mild 16',
    category: 'Rokok & Tembakau',
    brand: 'Sampoerna',
    image: '/products/sampoerna.jpg',
    supplier: 'PT HM Sampoerna Tbk',
    tax: 0,
    minStock: 25,
    baseUnit: 'Bungkus',
    rack: { 'WH-01': 'Etalase Kasir Belakang (RKK-01)', 'WH-02': 'Brankas DC Khusus (SEC-01)' },
    batchNo: 'SMP-2609-S7',
    expiryDate: '2027-12-31',
    isHighShrinkage: true,
    units: [
      {
        unit: 'Slop (10)',
        multiplier: 10,
        barcode: '899990900101',
        prices: { eceran: 345000, grosir1: 340000, grosir2: 338000, member: 339000 },
        hpp: 325000
      },
      {
        unit: 'Bungkus',
        multiplier: 1,
        barcode: '899990900102',
        prices: { eceran: 35000, grosir1: 34500, grosir2: 34000, member: 34200 },
        hpp: 32500
      }
    ],
    stock: {
      'WH-01': 22,
      'WH-02': 200
    }
  }
];

// Inbound Supplier PO (Penerimaan Barang dari Distributor)
export const INITIAL_INBOUND_POS = [
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
];

// Inter-warehouse Transfers (Mutasi Stok Gudang)
export const INITIAL_TRANSFERS = [
  {
    id: 'SJ-MUTASI-001',
    date: '2026-10-12 09:15',
    from: 'WH-02',
    to: 'WH-01',
    fromName: 'Gudang Pusat (DC)',
    toName: 'Gudang Toko (Area Depan)',
    driver: 'Joko W. (Mobil Box B 9120 KSR)',
    dispatcher: 'Agus P.',
    receiver: 'Bambang S.',
    itemsCount: 3,
    totalPcs: 140,
    status: 'RECEIVED',
    notes: 'Pengisian stok display kasir pagi hari'
  },
  {
    id: 'SJ-MUTASI-002',
    date: '2026-10-12 11:00',
    from: 'WH-02',
    to: 'WH-01',
    fromName: 'Gudang Pusat (DC)',
    toName: 'Gudang Toko (Area Depan)',
    driver: 'Joko W. (Mobil Box B 9120 KSR)',
    dispatcher: 'Agus P.',
    receiver: 'Menunggu Toko',
    itemsCount: 2,
    totalPcs: 80,
    status: 'IN-TRANSIT',
    notes: 'Restock mendadak minyak goreng & indomie jam sibuk'
  }
];

// Retur Barang Bad Stock / Rusak (Return to Supplier)
export const INITIAL_RETURNS = [
  {
    id: 'RET-202610-01',
    date: '2026-10-10',
    supplier: 'PT Ultrajaya Milk Industry',
    productName: 'Susu UHT Ultra Milk Cokelat 1L',
    qty: 3,
    unit: 'Pcs',
    reason: 'Kemasan penyok bocor saat pengiriman supplier',
    totalClaim: 49500,
    status: 'DIPROSES_SUPPLIER'
  }
];

// Sales History (Realistis untuk Analitik Grafik Harian & Per Jam ala Vireo POS)
export const INITIAL_SALES_HISTORY = [
  // HARI INI: 2026-10-12
  {
    id: 'INV-20261012-0081',
    date: '2026-10-12',
    hour: '10:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '10:45 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 4,
    totalAmount: 184500,
    totalHpp: 153000,
    grossProfit: 31500,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Pcs', qty: 2, price: 37000, hpp: 32000 },
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 1, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Pack (10)', qty: 1, price: 33000, hpp: 28000 },
      { name: 'Air Mineral Le Minerale 600ml', category: 'Minuman', unit: 'Botol', qty: 1, price: 3500, hpp: 2600 }
    ]
  },
  {
    id: 'INV-20261012-0082',
    date: '2026-10-12',
    hour: '11:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '11:15 WIB',
    paymentMethod: 'QRIS',
    itemsCount: 2,
    totalAmount: 248000,
    totalHpp: 219750,
    grossProfit: 28250,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Dus', qty: 1, price: 215000, hpp: 192000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Pack (10)', qty: 1, price: 33000, hpp: 28000 }
    ]
  },
  {
    id: 'INV-20261012-0083',
    date: '2026-10-12',
    hour: '12:00',
    terminal: 'Terminal 2',
    cashier: 'Budi Santoso',
    warehouse: 'WH-01',
    time: '12:30 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 3,
    totalAmount: 145000,
    totalHpp: 122000,
    grossProfit: 23000,
    items: [
      { name: 'Susu UHT Ultra Milk Cokelat 1L', category: 'Minuman', unit: 'Pcs', qty: 3, price: 18500, hpp: 15500 },
      { name: 'Rokok Sampoerna A Mild 16', category: 'Rokok & Tembakau', unit: 'Bungkus', qty: 2, price: 34500, hpp: 31000 },
      { name: 'Air Mineral Le Minerale 600ml', category: 'Minuman', unit: 'Botol', qty: 3, price: 3500, hpp: 2600 }
    ]
  },
  {
    id: 'INV-20261012-0084',
    date: '2026-10-12',
    hour: '14:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '14:15 WIB',
    paymentMethod: 'Transfer',
    itemsCount: 2,
    totalAmount: 436000,
    totalHpp: 397000,
    grossProfit: 39000,
    items: [
      { name: 'Gula Pasir Putih Gulaku 1kg', category: 'Sembako', unit: 'Dus (24)', qty: 1, price: 420000, hpp: 384000 },
      { name: 'Deterjen Rinso Anti Noda 770g', category: 'Perawatan Rumah', unit: 'Pcs', qty: 1, price: 16000, hpp: 13000 }
    ]
  },
  {
    id: 'INV-20261012-0085',
    date: '2026-10-12',
    hour: '18:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '18:40 WIB',
    paymentMethod: 'QRIS',
    itemsCount: 5,
    totalAmount: 312000,
    totalHpp: 267000,
    grossProfit: 45000,
    items: [
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 2, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Karton', qty: 1, price: 128000, hpp: 112000 },
      { name: 'Kopi Kapal Api Spesial Mix 10×24g', category: 'Minuman', unit: 'Renceng', qty: 2, price: 14500, hpp: 12000 }
    ]
  },
  {
    id: 'INV-20261012-0086',
    date: '2026-10-12',
    hour: '19:00',
    terminal: 'Terminal 2',
    cashier: 'Budi Santoso',
    warehouse: 'WH-01',
    time: '19:25 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 3,
    totalAmount: 189000,
    totalHpp: 162000,
    grossProfit: 27000,
    items: [
      { name: 'Susu Bubuk Dancow 1+ Madu 800g', category: 'Susu & Bayi', unit: 'Box', qty: 1, price: 92000, hpp: 81000 },
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Pcs', qty: 2, price: 37000, hpp: 32000 },
      { name: 'Deterjen Rinso Anti Noda 770g', category: 'Perawatan Rumah', unit: 'Pcs', qty: 1, price: 16000, hpp: 13000 }
    ]
  },

  // KEMARIN: 2026-10-11
  {
    id: 'INV-20261011-0075',
    date: '2026-10-11',
    hour: '10:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '10:20 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 3,
    totalAmount: 285000,
    totalHpp: 246000,
    grossProfit: 39000,
    items: [
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 2, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Karton', qty: 1, price: 128000, hpp: 112000 }
    ]
  },
  {
    id: 'INV-20261011-0076',
    date: '2026-10-11',
    hour: '15:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '15:40 WIB',
    paymentMethod: 'QRIS',
    itemsCount: 4,
    totalAmount: 342000,
    totalHpp: 295000,
    grossProfit: 47000,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Dus', qty: 1, price: 215000, hpp: 192000 },
      { name: 'Susu Bubuk Dancow 1+ Madu 800g', category: 'Susu & Bayi', unit: 'Box', qty: 1, price: 92000, hpp: 81000 },
      { name: 'Rokok Sampoerna A Mild 16', category: 'Rokok & Tembakau', unit: 'Bungkus', qty: 1, price: 34500, hpp: 31000 }
    ]
  },
  {
    id: 'INV-20261011-0077',
    date: '2026-10-11',
    hour: '19:00',
    terminal: 'Terminal 2',
    cashier: 'Budi Santoso',
    warehouse: 'WH-01',
    time: '19:10 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 2,
    totalAmount: 198000,
    totalHpp: 171000,
    grossProfit: 27000,
    items: [
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 1, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Pack (10)', qty: 3, price: 33000, hpp: 28000 }
    ]
  },

  // 2 HARI LALU: 2026-10-10
  {
    id: 'INV-20261010-0062',
    date: '2026-10-10',
    hour: '11:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '11:30 WIB',
    paymentMethod: 'QRIS',
    itemsCount: 3,
    totalAmount: 412000,
    totalHpp: 358000,
    grossProfit: 54000,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Dus', qty: 1, price: 215000, hpp: 192000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Karton', qty: 1, price: 128000, hpp: 112000 },
      { name: 'Rokok Sampoerna A Mild 16', category: 'Rokok & Tembakau', unit: 'Bungkus', qty: 2, price: 34500, hpp: 31000 }
    ]
  },
  {
    id: 'INV-20261010-0063',
    date: '2026-10-10',
    hour: '18:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '18:15 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 4,
    totalAmount: 265000,
    totalHpp: 231000,
    grossProfit: 34000,
    items: [
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 2, price: 76000, hpp: 67000 },
      { name: 'Susu UHT Ultra Milk Cokelat 1L', category: 'Minuman', unit: 'Pcs', qty: 4, price: 18500, hpp: 15500 },
      { name: 'Deterjen Rinso Anti Noda 770g', category: 'Perawatan Rumah', unit: 'Pcs', qty: 1, price: 16000, hpp: 13000 }
    ]
  },

  // 3 HARI LALU: 2026-10-09
  {
    id: 'INV-20261009-0051',
    date: '2026-10-09',
    hour: '13:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '13:20 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 3,
    totalAmount: 388000,
    totalHpp: 339000,
    grossProfit: 49000,
    items: [
      { name: 'Gula Pasir Putih Gulaku 1kg', category: 'Sembako', unit: 'Dus (24)', qty: 1, price: 420000, hpp: 384000 }
    ]
  },

  // 4 HARI LALU: 2026-10-08
  {
    id: 'INV-20261008-0042',
    date: '2026-10-08',
    hour: '16:00',
    terminal: 'Terminal 2',
    cashier: 'Budi Santoso',
    warehouse: 'WH-01',
    time: '16:10 WIB',
    paymentMethod: 'QRIS',
    itemsCount: 4,
    totalAmount: 320000,
    totalHpp: 278000,
    grossProfit: 42000,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Dus', qty: 1, price: 215000, hpp: 192000 },
      { name: 'Kopi Kapal Api Spesial Mix 10×24g', category: 'Minuman', unit: 'Renceng', qty: 4, price: 14500, hpp: 12000 }
    ]
  },

  // 5 HARI LALU: 2026-10-07
  {
    id: 'INV-20261007-0035',
    date: '2026-10-07',
    hour: '11:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '11:05 WIB',
    paymentMethod: 'Tunai',
    itemsCount: 3,
    totalAmount: 295000,
    totalHpp: 256000,
    grossProfit: 39000,
    items: [
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 2, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Karton', qty: 1, price: 128000, hpp: 112000 }
    ]
  },

  // 6 HARI LALU: 2026-10-06
  {
    id: 'INV-20261006-0028',
    date: '2026-10-06',
    hour: '14:00',
    terminal: 'Terminal 1',
    cashier: 'Rina S.',
    warehouse: 'WH-01',
    time: '14:45 WIB',
    paymentMethod: 'Transfer',
    itemsCount: 3,
    totalAmount: 462000,
    totalHpp: 405000,
    grossProfit: 57000,
    items: [
      { name: 'Minyak Goreng Sania 2L', category: 'Sembako', unit: 'Dus', qty: 1, price: 215000, hpp: 192000 },
      { name: 'Beras Premium Ramos 5kg', category: 'Sembako', unit: 'Karung', qty: 2, price: 76000, hpp: 67000 },
      { name: 'Indomie Goreng Spesial 85g', category: 'Makanan Instan', unit: 'Pack (10)', qty: 2, price: 33000, hpp: 28000 }
    ]
  }
];

export const INITIAL_USERS = [
  {
    id: 'OWNER',
    name: 'Pak Noor',
    roleTitle: 'Owner (Pemilik Bisnis)',
    role: 'OWNER',
    pin: '1234',
    email: 'owner@tokopaknoor.com',
    password: 'password123',
    phone: '0812-3456-7890',
    status: 'AKTIF',
    assignedTerminal: 'ALL', // Bebas akses semua mesin kasir
    avatarBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Akses penuh ke seluruh modul, omzet finansial, master produk & HPP modal'
  },
  {
    id: 'KEPALA_TOKO',
    name: 'Bambang S.',
    roleTitle: 'Kepala Toko / Supervisor',
    role: 'KEPALA_TOKO',
    pin: '8888',
    email: 'supervisor@tokopaknoor.com',
    password: 'password123',
    phone: '0813-9876-5432',
    status: 'AKTIF',
    assignedTerminal: 'ALL',
    avatarBg: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Otorisasi void kasir, stock opname fisik toko & audit setoran kasir'
  },
  {
    id: 'KASIR',
    name: 'Rina S.',
    roleTitle: 'Kasir Toko (Frontliner)',
    role: 'KASIR',
    pin: '1111',
    email: 'kasir@tokopaknoor.com',
    password: 'password123',
    phone: '0857-1234-5678',
    status: 'AKTIF',
    assignedTerminal: 'Kasir 1', // Terkunci khusus Kasir 1
    avatarBg: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Transaksi scanning kasir POS, cetak struk belanja & buka/tutup shift kasir'
  },
  {
    id: 'KASIR_2',
    name: 'Siti Rahma',
    roleTitle: 'Kasir Toko (Express)',
    role: 'KASIR',
    pin: '5555',
    email: 'siti@tokopaknoor.com',
    password: 'password123',
    phone: '0858-9999-8888',
    status: 'AKTIF',
    assignedTerminal: 'Kasir 2', // Terkunci khusus Kasir 2
    avatarBg: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Kasir counter express minuman & snack cepat'
  },
  {
    id: 'GUDANG_DC',
    name: 'Agus P.',
    roleTitle: 'Staf Logistik & Gudang DC',
    role: 'GUDANG_DC',
    pin: '2222',
    email: 'gudang@tokopaknoor.com',
    password: 'password123',
    phone: '0878-5555-4321',
    status: 'AKTIF',
    assignedTerminal: 'ALL',
    avatarBg: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Penerimaan barang supplier, mutasi armada mobil box & planogram rak'
  }
];

export const INITIAL_TERMINALS = [
  {
    id: 'TRM-01',
    name: 'Kasir 1',
    label: 'Kasir 1 (Mesin Utama Depan)',
    deviceType: 'All-in-One POS Touchscreen 15"',
    ipAddress: '192.168.1.101',
    status: 'ONLINE',
    currentCashier: 'Rina S.',
    location: 'Counter Utama 01 (Depan Pintu Masuk)',
    hardware: {
      printer: { model: 'Epson TM-T82X Thermal 80mm', port: 'USB', autoCut: true, status: 'CONNECTED' },
      drawer: { model: 'SecureBox RJ11 Solenoid 24V', autoKickOnCash: true, status: 'CONNECTED' },
      scanner: { model: 'Honeywell Voyager 1400g 2D/1D', type: 'USB HID', status: 'CONNECTED' },
      customerDisplay: { model: 'VFD 2x20 Alphanumeric Display', status: 'CONNECTED' }
    },
    todaySales: 3450000,
    todayTransactions: 28
  },
  {
    id: 'TRM-02',
    name: 'Kasir 2',
    label: 'Kasir 2 (Counter Cepat Express)',
    deviceType: 'PC Desktop POS + Monitor 18.5"',
    ipAddress: '192.168.1.102',
    status: 'ONLINE',
    currentCashier: 'Siti Rahma',
    location: 'Counter Express 02 (Area Minuman)',
    hardware: {
      printer: { model: 'Xprinter XP-N160II Thermal 80mm', port: 'LAN Network', autoCut: true, status: 'CONNECTED' },
      drawer: { model: 'CashDrawer Pro RJ11 24V', autoKickOnCash: true, status: 'CONNECTED' },
      scanner: { model: 'Datalogic QuickScan Lite USB', type: 'USB HID', status: 'CONNECTED' },
      customerDisplay: { model: 'HDMI Secondary Monitor 10"', status: 'CONNECTED' }
    },
    todaySales: 1820000,
    todayTransactions: 15
  },
  {
    id: 'TRM-03',
    name: 'Kasir 3',
    label: 'Kasir 3 (Counter Cadangan Peak Hour)',
    deviceType: 'PC Desktop POS',
    ipAddress: '192.168.1.103',
    status: 'STANDBY',
    currentCashier: '-',
    location: 'Counter 03 (Siap Buka saat Ramai)',
    hardware: {
      printer: { model: 'Thermal Printer 58mm USB', port: 'USB', autoCut: false, status: 'STANDBY' },
      drawer: { model: 'RJ11 Metal Cash Drawer', autoKickOnCash: true, status: 'STANDBY' },
      scanner: { model: 'Barcode Scanner Handheld USB', type: 'USB HID', status: 'STANDBY' },
      customerDisplay: { model: 'Tidak Ada', status: 'DISABLED' }
    },
    todaySales: 0,
    todayTransactions: 0
  },
  {
    id: 'TRM-04',
    name: 'Tablet Toko',
    label: 'Tablet POS Mobile (Lantai Toko)',
    deviceType: 'Apple iPad 10.9" / Android Tablet',
    ipAddress: '192.168.1.115',
    status: 'ONLINE',
    currentCashier: 'Bambang S. (SPV)',
    location: 'Mobile / Area Display Lorong',
    hardware: {
      printer: { model: 'Mobile Bluetooth Thermal 58mm', port: 'Bluetooth', autoCut: false, status: 'CONNECTED' },
      drawer: { model: 'Tanpa Laci Fisik (Non-Tunai / QRIS)', autoKickOnCash: false, status: 'DISABLED' },
      scanner: { model: 'Kamera Tablet Built-in AI Barcode', type: 'Camera', status: 'CONNECTED' },
      customerDisplay: { model: 'Layar Tablet Menghadap Pembeli', status: 'CONNECTED' }
    },
    todaySales: 950000,
    todayTransactions: 8
  }
];

export const INITIAL_RACKS = [
  // WH-01 (Area Display Toko Depan)
  { id: 'RK-A', code: 'Rak A-01..04', zone: 'Lorong A (Sembako)', warehouse: 'WH-01', category: 'Sembako', capacity: 88, cctv: false, note: 'Minyak Sania, Beras Ramos, Gulaku 1kg, Susu Dancow' },
  { id: 'RK-B', code: 'Rak B-01..02', zone: 'Lorong B (Makanan)', warehouse: 'WH-01', category: 'Makanan Instan', capacity: 75, cctv: false, note: 'Indomie Goreng Spesial, Biskuit & Snack Ringan' },
  { id: 'RK-C', code: 'Chiller 01 & 02', zone: 'Chiller & Minuman', warehouse: 'WH-01', category: 'Minuman', capacity: 65, cctv: false, note: 'Ultra Milk 1L, Le Minerale 600ml (Dingin 4°C)' },
  { id: 'RK-D', code: 'Rak D-01..03', zone: 'Lorong D (Sabun)', warehouse: 'WH-01', category: 'Perawatan Rumah', capacity: 60, cctv: false, note: 'Deterjen Rinso 770g, Sabun Mandi & Shampoo' },
  { id: 'RK-SEC', code: 'RKK-01', zone: 'Etalase Kasir Belakang', warehouse: 'WH-01', category: 'Rokok & Tembakau', capacity: 90, cctv: true, note: 'Rokok Sampoerna A Mild, Korek, Cokelat Mahal (High Shrinkage)' },
  { id: 'RK-PROMO', code: 'Gondola End Promo', zone: 'Area Pintu Masuk Promo', warehouse: 'WH-01', category: 'Promo & Diskon', capacity: 40, cctv: false, note: 'Display produk bundling & promo bulanan' },

  // WH-02 (Gudang Pusat / DC)
  { id: 'PL-01', code: 'Pallet P-01 (DC)', zone: 'Pallet P-01', warehouse: 'WH-02', category: 'Sembako', capacity: 90, cctv: false, note: 'Stok Cadangan Minyak Goreng Dus' },
  { id: 'PL-02', code: 'Pallet P-02 (DC)', zone: 'Pallet P-02', warehouse: 'WH-02', category: 'Sembako', capacity: 80, cctv: false, note: 'Stok Cadangan Gula Pasir Karungan' },
  { id: 'PL-03', code: 'Pallet P-03 (DC)', zone: 'Pallet P-03', warehouse: 'WH-02', category: 'Makanan Instan', capacity: 95, cctv: false, note: 'Indomie 30-50 Karton' },
  { id: 'PL-05', code: 'Pallet P-05 (DC)', zone: 'Pallet P-05', warehouse: 'WH-02', category: 'Sembako', capacity: 70, cctv: false, note: 'Beras Ramos Karung 5kg & 25kg' },
  { id: 'SEC-01', code: 'Brankas DC (SEC-01)', zone: 'Brankas DC Khusus', warehouse: 'WH-02', category: 'Rokok & Tembakau', capacity: 85, cctv: true, note: 'Kartonan Rokok & Nilai Tinggi (Kunci PIN)' }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Pelanggan Umum (Walk-in)',
    phone: '-',
    address: 'Toko Depan',
    tier: 'eceran',
    creditLimit: 0,
    currentDebt: 0,
    dueDate: null,
    status: 'ACTIVE',
    notes: 'Pembayaran tunai / instan langsung di kasir'
  },
  {
    id: 'CUST-002',
    name: 'Warung Bu Siti (Langganan)',
    phone: '0812-3456-7890',
    address: 'Jl. Merdeka No. 12, RT 03/05',
    tier: 'grosir',
    creditLimit: 5000000,
    currentDebt: 1250000,
    dueDate: '2026-10-25',
    status: 'ACTIVE',
    notes: 'Jatuh tempo 14 hari, pembayaran lancar'
  },
  {
    id: 'CUST-003',
    name: 'CV Berkah Konstruksi (Pak Joko)',
    phone: '0857-1122-3344',
    address: 'Kawasan Industri Cikande Blok D-02',
    tier: 'kontraktor',
    creditLimit: 15000000,
    currentDebt: 14200000,
    dueDate: '2026-10-10', // OVERDUE
    status: 'OVERDUE',
    notes: 'Ada tagihan macet Rp 14.200.000 jatuh tempo 10 Okt 2026 (Kunci kredit otomatis)'
  },
  {
    id: 'CUST-004',
    name: 'Toko Kelontong Berkat Mandiri',
    phone: '0878-9900-1122',
    address: 'Pasar Baru Blok B-04',
    tier: 'grosir',
    creditLimit: 8000000,
    currentDebt: 0,
    dueDate: null,
    status: 'ACTIVE',
    notes: 'Limit kredit Rp 8.000.000 bersih tanpa tunggakan'
  },
  {
    id: 'CUST-005',
    name: 'Kantin Sekolah Harapan Bangsa',
    phone: '0821-4455-6677',
    address: 'Jl. Pemuda No. 88',
    tier: 'grosir',
    creditLimit: 3000000,
    currentDebt: 2850000,
    dueDate: '2026-10-22',
    status: 'ACTIVE',
    notes: 'Sisa limit tinggal Rp 150.000'
  }
];

export const INITIAL_EXPENSES = [
  {
    id: 'EXP-202610-001',
    date: '2026-10-15',
    time: '08:45:10 WIB',
    category: 'Bensin & Operasional Armada',
    description: 'Bensin Motor Kurir Pengiriman Sembako ke Bu Siti',
    amount: 35000,
    cashierName: 'Siti Aminah',
    terminal: 'Kasir 1',
    paymentSource: 'Laci Kasir (Cash Drawer)',
    recipient: 'Joko W. (Kurir)'
  },
  {
    id: 'EXP-202610-002',
    date: '2026-10-15',
    time: '11:20:45 WIB',
    category: 'Retribusi & Parkir Pasar',
    description: 'Retribusi Kebersihan & Parkir Mobil Box Suplai',
    amount: 15000,
    cashierName: 'Siti Aminah',
    terminal: 'Kasir 1',
    paymentSource: 'Laci Kasir (Cash Drawer)',
    recipient: 'Petugas Parkir Pasar'
  },
  {
    id: 'EXP-202610-003',
    date: '2026-10-14',
    time: '14:15:30 WIB',
    category: 'Ongkir & Ekspedisi Barang',
    description: 'Bayar Ongkos Kirim J&T Cargo Suplai Sabun Unilever',
    amount: 75000,
    cashierName: 'Budi Santoso',
    terminal: 'Kasir 2',
    paymentSource: 'Laci Kasir (Cash Drawer)',
    recipient: 'Kurir Ekspedisi'
  },
  {
    id: 'EXP-202610-004',
    date: '2026-10-14',
    time: '16:50:12 WIB',
    category: 'Upah Kuli Bongkar Muat',
    description: 'Bongkar Muat 50 Karung Beras Ramos dari Truk DC',
    amount: 50000,
    cashierName: 'Siti Aminah',
    terminal: 'Kasir 1',
    paymentSource: 'Laci Kasir (Cash Drawer)',
    recipient: 'Kuli Angkut Mandiri'
  }
];

export const INITIAL_COMMISSIONS = [
  {
    cashierId: 'USR-002',
    cashierName: 'Siti Aminah',
    role: 'Kasir 1',
    baseRate: 0.015, // 1.5%
    bonusPerItem: 2500, // Rp 2.500 per target SKU
    totalSales: 18450000,
    targetItemCount: 18,
    commissionAmount: 321750,
    status: 'SIAP_CAIR',
    period: 'Oktober 2026'
  },
  {
    cashierId: 'USR-003',
    cashierName: 'Budi Santoso',
    role: 'Kasir 2',
    baseRate: 0.015,
    bonusPerItem: 2500,
    totalSales: 14120000,
    targetItemCount: 12,
    commissionAmount: 241800,
    status: 'SIAP_CAIR',
    period: 'Oktober 2026'
  },
  {
    cashierId: 'USR-004',
    cashierName: 'Rina Marlina',
    role: 'Kasir 3',
    baseRate: 0.015,
    bonusPerItem: 2500,
    totalSales: 8850000,
    targetItemCount: 8,
    commissionAmount: 152750,
    status: 'SIAP_CAIR',
    period: 'Oktober 2026'
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-202610-001',
    date: '2026-10-12',
    supplier: 'PT Berkah Pangan Mandiri',
    targetWarehouse: 'WH-02 (DC Pusat)',
    status: 'DIKIRIM',
    totalAmount: 9600000,
    items: [
      { sku: 'PRD-001', name: 'Minyak Goreng Sania 2L', qty: 50, unit: 'Dus', price: 192000 }
    ],
    notes: 'Pengiriman armada via truk engkel Fuso'
  },
  {
    id: 'PO-202610-002',
    date: '2026-10-10',
    supplier: 'PT Indomarco Adi Prima',
    targetWarehouse: 'WH-02 (DC Pusat)',
    status: 'DITERIMA',
    totalAmount: 10800000,
    items: [
      { sku: 'PRD-002', name: 'Indomie Goreng Spesial 85g', qty: 100, unit: 'Karton', price: 108000 }
    ],
    notes: 'Diterima oleh Agus P. (LPB No. LPB-2026-081)'
  }
];



