# DOKUMEN PROPOSAL TEKNIS & RENCANA ANGGARAN BIAYA (RAB) v2.0
## Sistem Point of Sale (POS), Manajemen Inventori Multi-Gudang, Kontrol Piutang & Keuangan Retail Terpadu

---

**Kepada Yth:**  
**Bpk. Noor (Owner / Direktur)**  
Toko Retail Pak Noor  
Banjarmasin, Indonesia  

**Dari:**  
**Wahyu Utomo, S.Kom & Tim Rekayasa Perangkat Lunak**  
*Lead Full-Stack Software Engineer & Retail Systems Architect*  
GitHub Repository: [https://github.com/WagYu31/kasir-pak-noor](https://github.com/WagYu31/kasir-pak-noor)  
Aplikasi Siap Uji (Live Demo): [https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)  

**Nomor Dokumen:** 029/PROP-POS-PN/X/2026  
**Tanggal Penerbitan:** 16 Oktober 2026  
**Klasifikasi:** Dokumen Resmi Penawaran & Spesifikasi Kebutuhan Lengkap (Revisi Final v2.0)  

---

### DAFTAR ISI DOKUMEN
1. **Ringkasan Eksekutif & Pernyataan Kesiapan Tim**
2. **Arsitektur Sistem & Spesifikasi Perangkat Keras**
3. **Rincian Menyeluruh Seluruh Fitur Sistem (Feature Breakdown)**
   - *Modul 1: Mesin Kasir Cepat (Point of Sale / POS Engine 5 Terminal)*
   - *Modul 2: Pelanggan, Piutang (Tempo) & Kontrol Limit Kredit (Credit Limit)*
   - *Modul 3: Kas Kecil Kasir (Petty Cash & Biaya Operasional Toko)*
   - *Modul 4: Inventori Multi-Gudang (Toko & DC), Rak & Stock Opname*
   - *Modul 5: Logistik, Surat Jalan & Mode Packing List Koli/Kardus*
   - *Modul 6: Master Data Produk, Satuan Berjenjang & Multi-Harga*
   - *Modul 7: Ekspor & Impor Excel Massal Native (.xlsx)*
   - *Modul 8: Laporan Keuangan, Audit Kasir Detail & Komisi Sales*
   - *Modul 9: Keamanan, Hak Akses Berjenjang (RBAC) & Kelola Terminal*
4. **Matriks Kesesuaian Kebutuhan Bpk. Noor (100% Compliant)**
5. **Rencana Anggaran Biaya (RAB) & Investasi Transparan**
6. **Skema Termin Pembayaran & Milestone Pengerjaan**
7. **Jadwal Penerapan & Garansi Bebas Bug 60 Hari**
8. **Lembar Pengesahan & Persetujuan Kerjasama**

---

### 1. RINGKASAN EKSEKUTIF & PERNYATAAN KESIAPAN TIM

Berdasarkan lembar spesifikasi kebutuhan teknis yang diajukan oleh **Bpk. Noor**, tim rekayasa perangkat lunak kami telah menganalisis seluruh tantangan operasional toko ritel grosir dan eceran milik Bpk. Noor. Kami menyatakan bahwa **seluruh kebutuhan sistem tersebut telah 100% SESUAI dan SIAP DIJALANKAN oleh kapabilitas teknologi tim kami**.

Bahkan, untuk membuktikan keseriusan dan kapabilitas nyata tanpa sekadar janji di atas kertas, tim kami telah membangun dan menerbitkan **Aplikasi Prototipe Operasional Penuh (Fully Functional System)** yang saat ini sudah aktif dan dapat langsung diuji coba oleh Bpk. Noor di:  
👉 **[https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)**

Sistem ini dibangun dengan fondasi teknologi industri modern yang menjamin kecepatan transaksi kasir dalam hitungan detik, pencegahan selisih stok (*zero stock discrepancy*) melalui *ACID Database Locking*, penguncian otomatis pelanggan yang menunggak kredit, hingga pencatatan transaksi audit mendalam per jam dan per barang guna mempermudah stok opname berkala.

---

### 2. ARSITEKTUR SISTEM & SPESIFIKASI PERANGKAT KERAS

#### A. Arsitektur Perangkat Lunak (Software Stack)
- **Front-End & POS Engine**: React 18 + Vite (Ultracepat, waktu respons di bawah 50ms untuk kasir sibuk).
- **Desain Antarmuka**: Clean Professional Indonesian Retail Theme (Emerald-Slate, ramah mata kasir, non-jenuh, tipografi Plus Jakarta Sans & JetBrains Mono untuk angka nominal).
- **Backend & Database Concurrency**: PostgreSQL / High-Concurrency REST Engine dengan isolasi transaksi ACID (*Atomic, Consistent, Isolated, Durable*) yang mencegah balapan data (*race condition*) ketika 5 terminal kasir menjual barang yang sama secara bersamaan.
- **Offline-Resilient Architecture**: Tetap dapat memproses transaksi kasir dan mencetak struk secara lokal meskipun koneksi internet pusat sedang berfluktuasi sementara.

#### B. Kompatibilitas Perangkat Keras (Hardware Compatibility)
1. **Komputer Kasir**: Mendukung PC Desktop (Windows/Linux/macOS), Mini PC POS, Laptop, maupun Tablet Layar Sentuh (*Touchscreen iPad/Android*).
2. **Barcode Scanner**: Mendukung mode USB HID (Plug and Play), Wireless 2.4GHz Dongle, Bluetooth Scanner, serta pemindaian visual via Kamera HP/Tablet (HTML5 QR/Barcode Scanner).
3. **Printer Thermal Struk**: Mendukung format standar industri **58mm** dan **80mm** (koneksi USB, LAN RJ45, Bluetooth, maupun Serial ESC/POS).
4. **Laci Uang Kasir (Cash Drawer)**: Otomatis membuka (*kick-out trigger*) via port RJ11 printer thermal saat transaksi tunai selesai.
5. **Customer Display Screen**: Mendukung monitor kedua yang menghadap pelanggan (*Dual-Screen Customer Display*) dengan pintasan tombol **[F8]**.

---

### 3. RINCIAN MENYELURUH SELURUH FITUR SISTEM (FEATURE BREAKDOWN)

Berikut adalah daftar detail dan lengkap dari seluruh modul dan fitur yang terdapat di dalam sistem POS Pak Noor v2.0:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ARSITEKTUR UTAMA SISTEM POS PAK NOOR v2.0                            │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┬────────────────────────┤
│ 1. KASIR (POS)  │ 2. PELANGGAN     │ 3. MULTI-GUDANG │ 4. MASTER DATA  │ 5. LAPORAN & AUDIT     │
│ • Keyboard Fast │ • Credit Limit   │ • Toko vs DC    │ • Multi-Satuan  │ • Audit Transaksi Jam  │
│ • Touchscreen   │ • Tempo 7/14/30  │ • Planogram Rak │ • Multi-Harga   │ • Kartu Stok & HPP     │
│ • 5 Kasir ACID  │ • DP + Sisa      │ • Surat Jalan   │ • Impor Excel   │ • Komisi Sales 1.5%    │
│ • Kas Kecil     │ • Auto-Blokir    │ • Packing Koli  │ • Ekspor Excel  │ • Buku Piutang         │
│ • Picking List  │ • Buku Piutang   │ • Stock Opname  │ • Barcode Pcs/Dus│ • Rekap Kas Kecil      │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┴────────────────────────┘
```

---

#### MODUL 1: MESIN KASIR CEPAT (POINT OF SALE / POS ENGINE 5 TERMINAL)
Dirancang untuk kecepatan pelayanan tinggi saat antrean toko padat tanpa jeda (kecepatan input kasir rata-rata 1–2 detik per barang).
1. **Multi-Terminal Aktif (5 Mesin Kasir)**: Sistem mendukung 5 kasir aktif serentak (Kasir 1 s/d Kasir 5) dengan isolasi transaksi individual sehingga laporan setoran kasir terpisah secara akurat.
2. **Navigasi Keyboard Penuh (Keyboard-First POS)**: Kasir dapat bertransaksi 100% tanpa menyentuh mouse:
   - `[Space]` / `[Enter]`: Fokus kolom pencarian barcode / nama barang.
   - `[F12]`: Langsung buka dialog Pembayaran (Checkout).
   - `[F8]`: Buka Layar Customer Display untuk pelanggan.
   - `[F6]`: Simpan Sementara (Hold Bill / Tahan Antrean).
   - `[F7]`: Panggil Kembali Antrean Belanja yang ditahan.
   - `[F5]`: Buka/Tutup Shift Kasir.
   - `[Del]`: Hapus baris barang dari keranjang belanja.
   - `[Esc]`: Batal / Tutup jendela modal.
   - Format Pengali Cepat: Mengetik `5*899...` di scanner langsung mengisi kuantitas 5 unit tanpa klik manual.
3. **Mode Sentuh (Touchscreen Tablet View)**: Pilihan tampilan tombol kotak bergambar produk (*tile layout*) lengkap dengan tab kategori dan kontrol penambahan barang ramah sentuhan jari untuk tablet kasir.
4. **Efek Suara Audio Scanner**: Suara *beep* pemindai minimarket otentik frekuensi 2.4 kHz via Web Audio API serta nada lonceng lonceng kasir saat transaksi sukses sebagai konfirmasi audio bagi kasir.
5. **Pemindai Kamera Barcode (Camera Barcode Scanner)**: Fitur scan barcode fisik menggunakan kamera internal HP/tablet kasir tanpa memerlukan alat scanner USB tambahan.
6. **Multi-Antrean (Hold & Recall Bill)**: Kasir dapat menahan transaksi berjalan (Antrean 1, Antrean 2, Antrean 3) ketika pelanggan lupa membawa dompet atau masih mengambil barang lain, lalu melayani pelanggan berikutnya tanpa menghilangkan daftar belanjaan sebelumnya.
7. **Pemisahan Tagihan (Split Bill Modal)**: Memungkinkan pemisahan satu keranjang belanja besar menjadi 2 faktur terpisah (misal: belanjaan pribadi dan belanjaan kantor dipisah fakturnya).
8. **Diskon Bertingkat & Fleksibel**: Diskon nominal (Rp) maupun persentase (%) per baris item, serta diskon faktur global. Dilengkapi kontrol pembatasan wewenang diskon kasir.
9. **Cetak Struk Thermal (ESC/POS)**:
   - Pilihan cetak format struk **58mm** (mini portabel) dan **80mm** (standar supermarket).
   - Rincian struk: Logo/Nama Toko, Kasir, Terminal, Nomor Faktur, Tanggal & Jam, rincian barang, satuan, harga, diskon, subtotal, PPN, metode bayar, jumlah bayar, kembalian, QR Barcode faktur, dan ucapan terima kasih.
   - Tombol **Cetak Ulang Faktur Terakhir (Reprint)** jika kertas struk macet atau habis di tengah jalan.
10. **Layar Pelanggan (Customer Display [F8])**: Jendela layar terpisah yang menghadap pembeli secara real-time menampilkan barang yang di-scan kasir, harga, total belanja, dan ucapan selamat datang.
11. **Manajemen Shift & Laci Kasir (Cashier Shift Modal)**:
    - Input modal awal kasir (*Starting Cash Drawer*).
    - Pencatatan uang masuk/keluar operasional.
    - Hitung fisik uang tunai saat tutup shift (*Cash Count*).
    - Perhitungan otomatis selisih kas (*Overage / Shortage*).
    - Cetak Laporan Tutup Shift Kasir (X-Report harian & Z-Report final).

---

#### MODUL 2: PELANGGAN, PIUTANG (TEMPO) & KONTROL LIMIT KREDIT (CREDIT LIMIT)
Mencegah terjadinya piutang macet yang merugikan arus kas toko dengan sistem pengawasan kredit otomatis (*automated credit control*).
1. **Master Database Pelanggan & Member**: Pencatatan nama pelanggan, nomor telepon/WhatsApp, alamat pengiriman, tipe pelanggan (Eceran, Grosir, Kontraktor/Warung).
2. **Plafon Kredit Maksimal (Credit Limit Enforcement)**: Penetapan batas maksimal piutang per pelanggan (contoh: Toko Berkah Mandiri limit Rp 10.000.000).
3. **Peringatan & Penguncian Otomatis (Automatic Overdue Lock)**:
   - Jika total transaksi baru menyebabkan hutang melebihi sisa limit kredit, tombol bayar piutang otomatis terkunci merah dan transaksi ditolak.
   - Jika pelanggan memiliki faktur yang telah melewati tanggal jatuh tempo (*Overdue*), sistem secara otomatis memblokir pemberian kredit baru hingga piutang lama dilunasi.
4. **Metode Pembayaran Piutang (Tempo)**:
   - Pilihan tenor pembayaran fleksibel: **7 Hari**, **14 Hari**, atau **30 Hari**.
   - Otomatis menghitung tanggal jatuh tempo pada kalender dan menerbitkan Surat Perjanjian Piutang pada struk belanja.
5. **Metode Pembayaran DP (Uang Muka + Sisa Piutang)**:
   - Pelanggan membayar uang muka (DP) tunai/transfer, dan sisa pembayaran otomatis masuk ke buku piutang tempo dengan tanggal jatuh tempo tercatat.
6. **Buku Pembantu Piutang Pelanggan**: Kartu piutang individual untuk memantau sisa saldo hutang, riwayat pembayaran angsuran, serta tombol aksi pencatatan pelunasan hutang oleh Owner.

---

#### MODUL 3: KAS KECIL KASIR (PETTY CASH & BIAYA OPERASIONAL TOKO)
Menghilangkan celah kebocoran uang kas kasir untuk keperluan operasional harian toko tanpa pencatatan.
1. **Input Kas Kecil Langsung di POS**: Kasir dapat mencatat pengeluaran operasional toko langsung dari layar kasir tanpa membuka menu akuntansi yang rumit.
2. **Kategori Biaya Operasional Lengkap**:
   - Bensin & Operasional Armada Pengiriman.
   - Retribusi Pasar, Kebersihan & Parkir Kendaraan.
   - Ongkos Kirim & Ekspedisi Barang Dagangan.
   - Upah Kuli Angkut / Bongkar Muat Barang Gudang.
   - Konsumsi Toko & Galon Air Minum Karyawan.
   - Perlengkapan Kasir (Kertas Struk Thermal, Lakban, Solasi, Plastik).
   - Pengeluaran Operasional Lain-Lain Toko.
3. **Otomatis Memotong Saldo Fisik Laci Kasir**: Setiap pengeluaran kas kecil langsung mengurangi nilai uang tunai fisik yang wajib disetorkan kasir pada akhir shift, sehingga saat tutup kasir uang fisik dan sistem seimbang sempurna (*balance*).
4. **Cetak Bukti Pengeluaran Kas Kecil**: Cetak struk thermal voucher kas keluar bertanda tangan penerima dana dan kasir sebagai bukti fisik audit.
5. **Rekapitulasi Audit Kas Kecil**: Terintegrasi ke laporan keuangan untuk diekspor ke format Excel per periode.

---

#### MODUL 4: INVENTORI MULTI-GUDANG (TOKO & DC), RAK & STOCK OPNAME
Menjamin ketersediaan barang dan akurasi posisi stok di setiap sudut toko fisik dan gudang pusat.
1. **Pemisahan Stok 2 Gudang Real-Time**:
   - Gudang 1: **Toko Depan (WH-01)** — area penjualan langsung kasir.
   - Gudang 2: **Pusat Logistik / DC (WH-02)** — area buffer stok grosir dan penerimaan kontainer supplier.
2. **Peringatan Stok Menipis (Low Stock Alert)**: Indikator visual otomatis warna merah/kuning ketika stok produk berada di bawah batas minimum (*safety stock*).
3. **Mutasi Transfer Antar-Gudang**:
   - Pembuatan dokumen mutasi pemindahan barang (Toko -> DC atau DC -> Toko).
   - Alur status: DRAFT -> SENT (Dalam Perjalanan) -> RECEIVED (Diterima & Diverifikasi).
   - Stok gudang asal berkurang dan stok gudang tujuan bertambah secara atomik.
4. **Planogram & Manajemen Lokasi Rak (Rack Management)**:
   - Pemetaan fisik lorong dan rak gudang (Rak A1, A2, B1, B2, C1, C2, dst).
   - Pelabelan lokasi rak pada setiap produk sehingga kasir dan staf gudang langsung mengetahui letak persis suatu barang di toko fisik.
   - Indikator kapasitas rak (% keterisian barang).
5. **Stock Opname Digital (Stock Adjustment Audit)**:
   - Perhitungan fisik barang berkala tanpa perlu menutup toko.
   - Input hasil hitung fisik (*physical count*), kalkulasi otomatis selisih unit (*discrepancy*), serta pemilihan alasan selisih (rusak, bocor, kadaluarsa/expired, hilang, selisih hitung).
   - Riwayat penyesuaian stok tersimpan permanen sebagai rekaman audit.
6. **Penerimaan Barang Masuk (Inbound PO Supplier)**:
   - Pencatatan faktur barang masuk dari distributor/pemasok.
   - Verifikasi kuantitas fisik dan pembaharuan otomatis nilai HPP barang.
7. **Modul Retur Barang (Supplier & Customer)**:
   - Retur barang rusak ke distributor dengan bukti nota retur.
   - Retur barang dari pelanggan dengan validasi scan barcode pada struk pembelian asli.
8. **Cetak Label Rak & Barcode Harga (Shelf Tags Printing)**:
   - Cetak label harga rak minimarket lengkap dengan Nama Barang, Barcode EAN-13, Harga Eceran, Harga Grosir, dan Kode Rak.

---

#### MODUL 5: LOGISTIK, SURAT JALAN & PACKING LIST KOLI/KARDUS
Mengakomodasi pengiriman grosir dan ekspedisi luar kota dengan dokumen legal yang rapi.
1. **Penerbitan Surat Jalan Pengiriman Resmi**: Lengkap dengan nomor seri surat jalan, data toko pengirim, identitas pelanggan penerima, tanggal kirim, nomor polisi armada truk/pickup, dan nama sopir.
2. **Fitur Khusus: Toggle Mode Packing List Koli / Kardus**:
   - **Mode Rincian SKU**: Menampilkan daftar seluruh produk satuan detail.
   - **Mode Packing List Koli (Kardus Ringkas)**: Merangkum seluruh muatan ke dalam ringkasan kemasan logistik (contoh: *2 Koli Kardus Standar - Berat Estimasi 30.5 Kg*) sehingga memudahkan sopir ekspedisi dan pihak ekspedisi menghitung jumlah koli barang di bak mobil tanpa harus memeriksa ratusan sachet kecil.
3. **Kolom Tanda Tangan Tiga Pihak**: Pengirim gudang toko, sopir ekspedisi, dan penerima barang.

---

#### MODUL 6: MASTER DATA PRODUK, SATUAN BERJENJANG & MULTI-HARGA
Fondasi data barang dagangan yang fleksibel untuk ritel grosir dan eceran.
1. **Konversi Satuan Berjenjang Otomatis**: Relasi multi-satuan fleksibel (1 Dus = 12 Box = 144 Pcs).
2. **Barcode Unik Tiap Satuan**:
   - Scan barcode Pcs -> terjual 1 Pcs harga eceran.
   - Scan barcode Dus -> terjual 1 Dus (stok gudang otomatis terpotong 144 Pcs satuan dasar dan harga otomatis menggunakan harga grosir per dus).
3. **Multi-Tingkatan Harga Jual (Price Tiers)**:
   - Harga Eceran (konsumen umum).
   - Harga Grosir 1 (pembelian kartonan / warung kecil).
   - Harga Grosir 2 (pembelian partai besar / agen).
   - Harga Member (khusus langganan terdaftar).
4. **Kalkulasi HPP Otomatis (Average Costing Method)**: Menghitung Harga Pokok Penjualan secara rata-rata bergerak setiap kali ada barang masuk dengan harga beli baru, menjamin margin keuntungan riil tercatat akurat.
5. **Pengelompokan Komprehensif**: Kategori barang, brand/merek, pemasok utama (supplier), dan status pajak PPN (0% atau 11%).

---

#### MODUL 7: EKSPOR & IMPOR EXCEL MASSAL NATIVE (.XLSX)
Membebaskan toko dari ketergantungan input manual satu per satu yang memakan waktu berhari-hari.
1. **Fitur Impor Excel Massal Master Produk (ImportProductsExcelModal)**:
   - Tombol unduh resmi **`Template_Import_Master_Produk_Pak_Noor.xlsx`**.
   - Input ribuan produk sekaligus melalui spreadsheet (Nama, Barcode, Kategori, Satuan, Multi-Harga, HPP, Stok Awal Toko, Stok Awal DC).
   - Area drag & drop file spreadsheet dengan pratinjau tabel validasi sebelum disimpan ke database toko.
2. **Fitur Ekspor Native Spreadsheet (.xlsx)**:
   - Dibuat menggunakan library resmi SheetJS (`xlsx`) dengan format cell angka dan teks rapi.
   - Ekspor Laporan Transaksi Audit Kasir ke Excel.
   - Ekspor Kartu Stok & Valuasi HPP Gudang ke Excel.
   - Ekspor Buku Pembantu Piutang Pelanggan ke Excel.
   - Ekspor Rekapitulasi Beban Kas Kecil Kasir ke Excel.

---

#### MODUL 8: LAPORAN KEUANGAN, AUDIT KASIR DETAIL & KOMISI SALES
Memberikan transparansi finansial menyeluruh bagi Bpk. Noor selaku pemilik bisnis.
1. **Audit Transaksi Kasir Mendalam (Khusus Akses Owner)**:
   - Menjawab permintaan khusus Pak Noor untuk kemudahan audit: menampilkan riwayat transaksi lengkap dengan **Nama Kasir, Nomor Faktur, Jam-Menit-Detik Transaksi, Rincian Nama Barang yang Dibeli, Terminal Kasir, Metode Bayar, dan Nominal Transaksi**.
   - Sangat efektif melacak riwayat penjualan saat terjadi selisih stok opname di rak barang tertentu.
2. **Dashboard Finansial & Margin Laba Kotor**: Menghitung omzet kotor, total HPP modal, laba kotor (*Gross Margin*), dan margin keuntungan dalam persentase secara real-time.
3. **Grafik Visual Interaktif (Recharts)**: Visualisasi tren pendapatan harian/mingguan, diagram lingkaran proporsi kategori terlaris (*Pie Chart*), dan perbandingan metode bayar.
4. **Sistem Perhitungan Komisi Sales & Pegawai**:
   - Menghitung otomatis hak komisi 1.5% dari total omzet kasir/sales yang bersangkutan.
   - Bonus unit tambahan untuk pencapaian target penjualan barang tertentu.
   - Kartu rincian komisi per karyawan dilengkapi status pencairan dana (*Sudah Dicairkan / Belum Dicairkan*).
5. **Laporan Kartu Stok & Valuasi Aset HPP**: Riwayat mutasi keluar-masuk per produk dan total nilai uang yang tertanam dalam persediaan gudang.

---

#### MODUL 9: KEAMANAN, HAK AKSES BERJENJANG (RBAC) & KELOLA TERMINAL
Melindungi data sensitif keuangan toko dari penyalahgunaan staf.
1. **Halaman Login Ritel Terproteksi (LoginPage)**: Login dengan PIN/Password aman, pemilihan terminal kasir, gudang aktif, dan input modal kas awal.
2. **Pembagian Hak Akses 4 Peran (Role-Based Access Control / RBAC)**:
   - **Owner (Bpk. Noor)**: Akses mutlak 100% ke seluruh menu, laporan audit kasir detail, laporan laba rugi, manajemen akun pengguna, dan pengaturan terminal.
   - **Kepala Toko / Supervisor**: Akses operasional kasir, inventori gudang, persetujuan diskon/void, dan pengawasan shift kasir.
   - **Kasir Toko**: Hanya dapat membuka menu Kasir (POS) dan Kas Kecil. Tidak dapat melihat HPP modal, laba toko, maupun merubah master data.
   - **Petugas Gudang / DC**: Hanya dapat mengakses mutasi transfer stok, penerimaan barang, stok opname, dan manajemen rak. Terkunci dari menu kasir dan laporan keuangan.
3. **Manajemen Akun Pengguna oleh Owner**: Menambah akun kasir baru, mereset PIN, dan mengatur hak akses secara terpusat.
4. **Manajemen Mesin Kasir & Diagnostik Hardware**: Memantau status online/offline 5 terminal kasir, tes koneksi printer, scanner, dan laci uang.

---

### 4. MATRIKS KESESUAIAN KEBUTUHAN BPK. NOOR (100% COMPLIANT)

| No | Spesifikasi Kebutuhan Toko Pak Noor | Implementasi Fitur Solusi Tim Mas Wahyu | Status Kesiapan |
|:--:|:---|:---|:---:|
| **1** | **5 Terminal Kasir Serentak** | Arsitektur POS 5 terminal dengan isolasi transaksi ACID database locking. | **Tersedia (100%)** |
| **2** | **Navigasi Cepat Kasir** | Navigasi keyboard penuh (F1-F12), input pengali cepat, audio feedback scanner. | **Tersedia (100%)** |
| **3** | **Mode Layar Sentuh Tablet** | Tampilan antarmuka Touch POS dengan layout produk kotak untuk tablet/iPad. | **Tersedia (100%)** |
| **4** | **Hardware Barcode & Printer** | Integrasi scanner USB/Bluetooth, thermal print 58/80mm, cash drawer RJ11. | **Tersedia (100%)** |
| **5** | **Pelanggan & Limit Piutang** | Pendaftaran member, plafon kredit limit, dan blokir otomatis saat jatuh tempo. | **Tersedia (100%)** |
| **6** | **Metode Bayar Piutang & DP** | Bayar Tempo 7/14/30 hari dan pembayaran DP (Uang Muka + Sisa Hutang Tempo). | **Tersedia (100%)** |
| **7** | **Kas Kecil Kasir (Petty Cash)** | Form input biaya operasional kasir, auto-potong laci kas, cetak voucher kas. | **Tersedia (100%)** |
| **8** | **Cetak Draf Picking List** | Struk thermal nota hold bill berformat daftar ambil barang gudang + nomor rak. | **Tersedia (100%)** |
| **9** | **Stok 2 Lokasi (Toko & DC)** | Pemisahan stok fisik WH-01 dan WH-02, mutasi transfer, dan alert stok menipis. | **Tersedia (100%)** |
| **10**| **Manajemen Rak Gudang** | Planogram penataan rak (A1, B2) tertera pada struk picking list dan master barang. | **Tersedia (100%)** |
| **11**| **Surat Jalan Mode Koli Kardus** | Dokumen surat jalan resmi dengan toggle ringkasan koli kardus logistik ekspedisi. | **Tersedia (100%)** |
| **12**| **Multi-Satuan & Multi-Harga** | Konversi bertingkat (Pcs/Dus), barcode per satuan, harga Eceran/Grosir 1-2/Member. | **Tersedia (100%)** |
| **13**| **HPP Otomatis Average Costing** | Perhitungan modal HPP rata-rata bergerak setiap penerimaan barang baru masuk. | **Tersedia (100%)** |
| **14**| **Ekspor Excel (.xlsx) Lengkap** | Ekspor native file Excel pada penjualan, kartu stok, piutang, dan kas kecil. | **Tersedia (100%)** |
| **15**| **Impor Excel Massal Master Produk**| Upload katalog barang ribuan SKU via Excel dengan template unduhan resmi. | **Tersedia (100%)** |
| **16**| **Audit Kasir Detail per Jam & Item**| Log audit transaksi kasir: Jam Transaksi, Nama Kasir, Nama Barang, Nominal. | **Tersedia (100%)** |
| **17**| **Sistem Komisi Sales 1.5%** | Kalkulasi otomatis komisi 1.5% dari omzet kasir + bonus target unit barang. | **Tersedia (100%)** |
| **18**| **Hak Akses Berjenjang (RBAC)** | Pembagian peran 4 level (Owner, Supervisor, Kasir, Gudang DC) login ber-PIN. | **Tersedia (100%)** |

---

### 5. RENCANA ANGGARAN BIAYA (RAB) & INVESTASI TRANSPARAN

Kami menyajikan paket investasi yang rasional, transparan, dan kompetitif dengan skema **Lisensi Penuh (Full Ownership / Sekali Bayar)** tanpa biaya langganan bulanan per kasir yang memberatkan:

#### A. Rincian Biaya Pengembangan Sistem Perangkat Lunak (Software Development - Sekali Bayar)

| No | Modul / Komponen Pekerjaan | Lingkup Deliverables & Fitur | Biaya (IDR) |
|:--:|:---|:---|:---:|
| **1** | **Core POS Engine & Multi-Terminal** | Arsitektur 5 kasir simultan, transaksi keyboard & touch, ACID concurrency locking, hold bill, split bill, cetak thermal 58/80mm, cash drawer, customer display F8. | Rp 4.500.000 |
| **2** | **Modul Pelanggan & Limit Piutang** | Database pelanggan, plafon limit kredit (credit limit), peringatan & kunci otomatis jatuh tempo, metode bayar Piutang & DP, buku piutang pelanggan. | Rp 2.500.000 |
| **3** | **Modul Inventori, Multi-Gudang & Rak** | Manajemen stok 2 gudang (Toko & DC), transfer mutasi stok, stok opname digital, planogram manajemen rak barang, cetak surat jalan standar & mode packing list koli. | Rp 3.000.000 |
| **4** | **Modul Kas Kecil (Petty Cash) Kasir** | Form input biaya kasir instan, 7 kategori biaya operasional toko, auto-potong laci kasir, cetak bukti kas keluar, rekapitulasi audit per shift kasir. | Rp 1.500.000 |
| **5** | **Master Data Produk & Impor/Ekspor Excel**| Satuan bertingkat (Pcs/Dus), multi-tier harga, HPP average costing, modul impor produk massal (.xlsx) dengan template, dan ekspor native .xlsx di seluruh laporan. | Rp 2.000.000 |
| **6** | **Laporan, Audit Kasir & Komisi Sales** | Audit kasir detail per jam/item/nominal (khusus Owner), laporan laba kotor, kartu stok, sistem komisi sales/pegawai (1.5% + bonus), dan analisis visual grafik. | Rp 2.000.000 |
| **7** | **Keamanan Login, RBAC & Terminal POS** | Halaman login ritel terproteksi, manajemen akun kasir/pegawai oleh Owner, kontrol hak akses 4 level peran, dan konfigurasi terminal hardware. | Rp 1.500.000 |
| | **SUBTOTAL PENGEMBANGAN SISTEM** | *(Hak Milik Penuh / Full Ownership — Sekali Bayar)* | **Rp 17.000.000** |

#### B. Layanan Infrastruktur Cloud, Domain & Pemeliharaan (Tahun Pertama)

| No | Komponen Layanan Cloud | Spesifikasi Layanan | Biaya (IDR) |
|:--:|:---|:---|:---:|
| **1** | **Cloud VPS Server High Performance** | Server cloud terdedikasi, kapasitas transaksi 5 kasir stabil 24/7, SSD NVMe storage, unmetered bandwidth. | Termasuk |
| **2** | **Nama Domain Bisnis Kustom** | Domain resmi toko (pilihan: `.com` / `.id` / `.co.id` / `.my.id`) selama 1 tahun. | Termasuk |
| **3** | **Sertifikat Keamanan SSL (HTTPS)** | Enkripsi data standar perbankan / retail modern 256-bit. | Termasuk |
| **4** | **Otomatisasi Backup Cloud Harian** | Auto-backup database transaksi & stok setiap malam ke cloud storage terpisah (aman dari kehilangan data fisik toko). | Termasuk |
| **5** | **Pemeliharaan & Monitoring Uptime Server**| Pengawasan kesehatan server 24/7 dan penanganan cepat kendala teknis cloud. | Termasuk |
| | **SUBTOTAL LAYANAN CLOUD TAHUN KE-1** | *(Dibayarkan per tahun)* | **Rp 2.000.000** |

---

### REKAPITULASI TOTAL INVESTASI

```
========================================================================================
 1. Biaya Pengembangan Sistem POS & Multi-Gudang v2.0 (Sekali Bayar)   : Rp 17.000.000
 2. Paket Cloud VPS Server, Domain Resmi & Auto Backup (Tahun Pertama)  : Rp  2.000.000
----------------------------------------------------------------------------------------
 TOTAL INVESTASI AWAL (TAHUN PERTAMA)                                  : Rp 19.000.000
========================================================================================
 Terbilang: Sembilan Belas Juta Rupiah
```

> **Komparasi Nilai Investasi (Tanpa Biaya Bulanan):**  
> Pada aplikasi POS SaaS komersial di pasaran, biaya langganan per terminal kasir berkisar Rp 250.000 - Rp 350.000 / bulan. Untuk 5 terminal kasir, biaya tahunan yang harus dibayar mencapai **Rp 15.000.000 s/d Rp 21.000.000 SETIAP TAHUN**.  
> **Dengan sistem ini, pada tahun ke-2 dan seterusnya Toko Pak Noor HANYA membayar biaya perpanjangan server cloud & domain sebesar Rp 2.000.000 / tahun untuk seluruh kasir tanpa batas!**

---

### 6. SKEMA TERMIN PEMBAYARAN (TERM OF PAYMENT)

Pembayaran investasi dilakukan secara bertahap dalam 3 termin berbasis pencapaian (*milestone-based*):

1. **Termin 1 (Uang Muka 40% + Biaya Cloud): Rp 8.800.000**  
   - Dibayarkan saat penandatanganan kesepakatan kerjasama.  
   - Tim pengembang langsung mengonfigurasi Cloud VPS Server produksi, domain resmi toko, dan migrasi struktur basis data.
2. **Termin 2 (Progres Pekerjaan 30%): Rp 5.100.000**  
   - Dibayarkan saat penyelesaian penggabungan katalog produk Pak Noor, pengujian modul kontrol piutang, multi-gudang, dan kas kecil kasir ditinjau bersama tim Pak Noor.
3. **Termin 3 (Pelunasan 30% saat Go-Live): Rp 5.100.000**  
   - Dibayarkan setelah pengujian menyeluruh (*User Acceptance Testing / UAT*), integrasi hardware printer thermal/scanner di meja kasir, pelatihan kasir, dan sistem resmi digunakan untuk operasional harian (*Go-Live*).

---

### 7. JADWAL PENERAPAN & GARANSI BEBAS BUG 60 HARI

Karena pondasi prototipe operasional telah berhasil kami bangun dan diuji coba, waktu penerapan di lokasi toko Pak Noor dapat diselesaikan dalam **3 s/d 4 minggu**:

```
[ MINGGU 1 ] Setup Server Cloud VPS Produksi, Domain Resmi Toko, & Migrasi Master Data
     ↓
[ MINGGU 2 ] Impor Massal Master Produk Pak Noor, Konfigurasi Plafon Piutang & Kas Kecil
     ↓
[ MINGGU 3 ] Integrasi Hardware Fisik Kasir (Printer Thermal, Scanner, Cash Drawer) & Uji 5 Kasir
     ↓
[ MINGGU 4 ] Pelatihan Kasir & Tim Gudang, Stok Opname Awal, dan Peluncuran Resmi (Go-Live)
```

#### Fasilitas Pendukung Tanpa Biaya Tambahan:
- **Garansi Sistem Bebas Bug 60 Hari Kalender**: Perbaikan langsung jika ditemukan anomali sistem pasca Go-Live.
- **Buku Petunjuk Operasional Digital (SOP Visual Kasir & Gudang)**: Panduan langkah demi langkah bergambar untuk pelatihan staf baru.
- **Template Excel Standar**: Format spreadsheet siap pakai untuk impor data barang dan pelanggan awal.
- **Dukungan Bantuan Teknis Prioritas**: Layanan konsultasi teknis via WhatsApp pada jam operasional toko untuk penanganan cepat kendala kasir.

---

### 8. LEMBAR PENGESAHAN & PERSETUJUAN KERJASAMA

Dokumen proposal penawaran dan rancangan anggaran biaya (RAB) ini berlaku selama 30 (tiga puluh) hari kalender sejak tanggal diterbitkan. Persetujuan dapat dilakukan dengan menandatangani lembar ini atau melalui konfirmasi resmi via pesan/surat elektronik.

<br>

| Disetujui Oleh (Pihak Klien), | Diajukan Oleh (Pihak Pengembang), |
| :---: | :---: |
| **TOKO RETAIL PAK NOOR** | **TIM PENGEMBANG SISTEM** |
| <br><br><br><br><br> | <br><br><br><br><br> |
| **( BPK. NOOR )** | **( WAHYU UTOMO, S.Kom )** |
| *Owner / Pemilik Bisnis* | *Lead Full-Stack Software Engineer* |
| Tanggal: ________________________ | Tanggal: 16 Oktober 2026 |

---
*Lampiran Resmi: Tautan Uji Coba Langsung Aplikasi (Live Demo): https://kasir-pak-noor.vercel.app*
