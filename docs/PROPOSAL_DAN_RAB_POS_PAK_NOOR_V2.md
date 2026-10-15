# PROPOSAL TEKNIS & RENCANA ANGGARAN BIAYA (RAB) v2.0
## Sistem Informasi Point of Sale (POS), Manajemen Multi-Gudang, Kontrol Piutang & Keuangan Retail Terpadu

---

**Kepada Yth:**  
**Bpk. Noor (Owner / Direktur)**  
Toko Retail Pak Noor  
Banjarmasin, Indonesia  

**Dari:**  
**Wahyu Utomo, S.Kom & Tim Rekayasa Perangkat Lunak**  
*Lead Full-Stack Software Engineer & Retail Systems Architect*  
- Portofolio Repositori: [https://github.com/WagYu31/kasir-pak-noor](https://github.com/WagYu31/kasir-pak-noor)  
- Prototipe Interaktif (Staging Preview): [https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)  

**Nomor Dokumen:** 029/PROP-POS-PN/X/2026  
**Tanggal Penerbitan:** 16 Oktober 2026  
**Klasifikasi:** Dokumen Resmi Penawaran & Spesifikasi Kebutuhan Lengkap (Revisi Final v2.0)  

---

### DAFTAR ISI DOKUMEN
1. **Ringkasan Eksekutif & Pernyataan Kesiapan Tim**
2. **Arsitektur Sistem & Spesifikasi Perangkat Keras**
3. **Rincian Seluruh Fitur Sistem (Feature Breakdown)**
   - *3.1 Modul Kasir Cepat (Point of Sale / POS Engine 5 Terminal)*
   - *3.2 Modul Pelanggan & Pengawasan Risiko Piutang (Credit Limit)*
   - *3.3 Modul Kas Kecil Kasir (Petty Cash & Biaya Operasional)*
   - *3.4 Modul Inventori Multi-Gudang (Toko & DC), Rak & Stock Opname*
   - *3.5 Modul Logistik Pengiriman, Surat Jalan & Mode Koli/Kardus*
   - *3.6 Modul Master Data Produk, Satuan Berjenjang & Multi-Harga*
   - *3.7 Modul Integrasi Spreadsheet: Impor & Ekspor Excel Native (.xlsx)*
   - *3.8 Modul Laporan Finansial, Audit Kasir Detail & Komisi Sales*
   - *3.9 Modul Keamanan, Hak Akses Berjenjang (RBAC) & Kelola Terminal*
4. **Matriks Kesesuaian Kebutuhan Bpk. Noor (100% Compliant)**
5. **Rencana Anggaran Biaya (RAB) & Investasi Transparan**
6. **Skema Termin Pembayaran & Milestone Pekerjaan**
7. **Jadwal Pelaksanaan (Timeline 4 Minggu) & Garansi Bebas Bug**
8. **Lembar Pengesahan & Persetujuan Kerjasama**

---

### 1. RINGKASAN EKSEKUTIF & PERNYATAAN KESIAPAN TIM

Berdasarkan dokumen spesifikasi kebutuhan teknis yang disampaikan oleh **Bpk. Noor**, tim rekayasa perangkat lunak kami telah menganalisis seluruh tantangan operasional toko ritel grosir dan eceran milik Bpk. Noor. Kami menyatakan bahwa **seluruh kebutuhan sistem tersebut telah 100% SESUAI dan SIAP DIJALANKAN oleh kapabilitas teknologi tim kami**.

Sebagai wujud profesionalisme dan pembuktian langsung atas kesiapan logika sistem kami, tim pengembang telah menyiapkan **Prototipe Interaktif / Lingkungan Simulasi Pengujian (Staging Preview / Proof of Concept)** yang saat ini dapat langsung dicoba dan disimulasikan alurnya oleh Bpk. Noor melalui tautan pengujian:  
👉 **[https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)**  
*(Catatan Teknis: Tautan di atas merupakan server pengujian sementara / staging dengan data simulasi untuk membuktikan kesiapan alur kerja sistem. Pada tahap pelaksanaan kontrak resmi, sistem akan dipasang dan dikonfigurasi secara menyeluruh pada Server Cloud VPS Mandiri dan Domain Bisnis Resmi milik Toko Pak Noor).*

Sistem ini dirancang khusus untuk memecahkan 5 kendala utama toko retail:
1. **Kecepatan Layanan Kasir**: Mencegah antrean panjang di jam sibuk dengan transaksi cepat berbasis keyboard & pemindai barcode.
2. **Mencegah Selisih Stok Antar-Kasir**: Menggunakan isolasi database *ACID Concurrency Locking* saat 5 kasir menjual barang yang sama serentak.
3. **Pencegahan Piutang Macet**: Penguncian otomatis sistem jika hutang pelanggan melampaui limit kredit atau melewati jatuh tempo.
4. **Transparansi Pengeluaran Kas Toko**: Pencatatan kas kecil langsung di laci kasir untuk bensin armada, parkir, kuli, dan ongkir ekspedisi.
5. **Kemudahan Audit & Stok Opname**: Catatan transaksi mendalam per kasir, per jam-menit transaksi, per nama barang, dan nominal faktur.

---

### 2. ARSITEKTUR SISTEM & SPESIFIKASI PERANGKAT KERAS

#### A. Arsitektur Perangkat Lunak (Software Stack)
- **Front-End & POS Engine**: React 18 + Vite (Waktu respon antarmuka < 50ms, instan dan ringan).
- **Desain Antarmuka**: *Clean Professional Indonesian Retail Theme* (Warna Emerald-Slate, ramah mata kasir, kontras jelas).
- **Backend & Database Concurrency**: PostgreSQL / High-Concurrency REST Engine dengan penguncian transaksi atomik (*ACID Compliant*) untuk mencegah *race condition*.
- **Offline Resilience**: Kasir tetap dapat melayani transaksi dan mencetak struk secara lokal saat jaringan internet berfluktuasi.

#### B. Kompatibilitas Perangkat Keras Kasir (Hardware Compatibility)
1. **Perangkat Komputer**: PC Desktop (Windows/Linux), Mini PC POS, Laptop, maupun Tablet Layar Sentuh (*iPad / Android Tablet*).
2. **Barcode Scanner**: Scanner USB HID kabel, Wireless 2.4GHz Dongle, Bluetooth Scanner, serta scan via Kamera HP/Tablet terintegrasi.
3. **Printer Thermal Struk**: Printer Thermal format **58mm** dan **80mm** (Koneksi USB, LAN RJ45, Bluetooth, maupun Serial ESC/POS).
4. **Laci Uang Kasir (Cash Drawer)**: Otomatis membuka (*kick-out trigger*) via port RJ11 printer thermal saat kasir menekan bayar tunai.
5. **Customer Display Screen**: Mendukung layar kedua menghadap pelanggan (*Dual-Screen*) melalui pintasan tombol **[F8]**.

---

### 3. RINCIAN MENYELURUH SELURUH FITUR SISTEM

---

#### 3.1 MODUL KASIR CEPAT (POINT OF SALE / POS ENGINE 5 TERMINAL)

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Dukungan 5 Kasir Simultan** | Menjalankan 5 terminal kasir (Kasir 1 s/d Kasir 5) aktif bersamaan dengan isolasi pembukuan kasir terpisah. | Menghilangkan antrean pelanggan di jam sibuk tanpa risiko data transaksi tercampur antar-kasir. |
| **Navigasi Keyboard Penuh (Keyboard-First)** | Transaksi 100% tanpa mouse: `[Space]` Search, `[F12]` Bayar, `[F6]` Hold, `[F7]` Recall, `[Del]` Hapus Item, `[Esc]` Batal. | Mempercepat proses input kasir hingga 3x lipat dibanding sistem kasir berbasis klik mouse biasa. |
| **Format Input Pengali Cepat** | Kasir cukup mengetik `5*899...` di kolom scanner untuk otomatis memasukkan 5 unit barang. | Kasir tidak perlu memindai barang yang sama berulang-ulang sebanyak 5 kali. |
| **Mode Sentuh (Touchscreen Tablet)** | Pilihan tata letak kotak tombol bergambar produk (*tile layout*) dengan navigasi tab kategori produk. | Sangat fleksibel jika kasir menggunakan perangkat tablet kasir atau monitor layar sentuh. |
| **Audio Feedback Scanner** | Nada *beep* 2.4 kHz otentik minimarket saat scan sukses dan nada lonceng (*cash chime*) saat bayar. | Kasir langsung mengetahui barang berhasil masuk keranjang tanpa harus menatap layar terus-menerus. |
| **Kamera Barcode Terintegrasi** | Scan barcode fisik langsung menggunakan kamera internal HP/tablet tanpa alat scanner eksternal. | Solusi cadangan instan jika alat scanner kabel USB mengalami gangguan atau saat melayani di luar meja. |
| **Antrean Belanja (Hold & Recall Bill)** | Kasir dapat menahan keranjang belanja pelanggan (Antrean 1, 2, 3) dan melayani pembeli berikutnya. | Antrean kasir tidak terhenti saat ada pembeli yang lupa dompet atau masih mengambil barang tambahan. |
| **Cetak Draf Nota Gudang (Picking List)** | Mencetak struk thermal antrean hold bill berformat daftar ambil barang lengkap nomor rak dan paraf gudang. | Petugas gudang dapat langsung menyiapkan barang grosir dari rak sebelum pembayaran diselesaikan. |
| **Pemisahan Tagihan (Split Bill)** | Memisahkan satu keranjang belanja besar menjadi dua faktur struk pembayaran terpisah. | Memudahkan pelanggan rombongan atau langganan yang ingin memisahkan nota belanja pribadi dan kantor. |
| **Diskon Item & Diskon Faktur** | Potongan harga fleksibel dalam nominal rupiah (Rp) maupun persentase (%) per barang atau total faktur. | Mendukung program promosi toko dan diskon khusus langganan dengan verifikasi wewenang kasir. |
| **Cetak Struk Thermal (ESC/POS)** | Cetak struk ukuran 58mm & 80mm lengkap rincian barang, PPN, metode bayar, kembalian, dan QR faktur. | Bukti belanja resmi pelanggan yang rapi, profesional, dan dapat dicetak ulang (*Reprint*) jika kertas habis. |
| **Layar Pelanggan (Customer Display [F8])** | Tampilan monitor kedua menghadap pembeli menampilkan nama barang scan, harga, dan total belanja real-time. | Meningkatkan kepercayaan pelanggan terhadap transparansi harga dan meminimalisir komplain salah harga. |
| **Manajemen Shift & Setoran Laci Kasir** | Input modal awal, log kas masuk/keluar, hitung fisik uang kasir (*cash count*), dan kalkulasi selisih kas otomatis. | Mencegah selisih uang setoran kasir dan memudahkan audit harian melalui Laporan Tutup Shift (X/Z Report). |

---

#### 3.2 MODUL PELANGGAN & PENGAWASAN RISIKO PIUTANG (CREDIT LIMIT)

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Master Data Pelanggan & Member** | Database pelanggan memuat Nama, Kontak WhatsApp, Alamat Kirim, dan Klasifikasi (Eceran, Grosir, Kontraktor). | Membangun loyalitas langganan dan mempermudah pengiriman barang grosir ke alamat pemesan. |
| **Plafon Limit Kredit (Credit Limit)** | Pengaturan batas maksimal saldo hutang yang diizinkan untuk setiap pelanggan (misal: Limit Rp 10.000.000). | Mengendalikan risiko toko agar pelanggan tidak mengambil barang melebihi kemampuan bayarnya. |
| **Penguncian Otomatis (Auto Overdue Lock)** | Sistem otomatis mengunci tombol bayar piutang jika hutang melebihi limit atau ada faktur yang lewat jatuh tempo. | **Mencegah terjadinya piutang macet** secara otomatis tanpa bergantung pada ingatan kasir. |
| **Metode Pembayaran Piutang (Tempo)** | Pilihan jatuh tempo pembayaran: **7 Hari**, **14 Hari**, atau **30 Hari**, tercatat otomatis pada struk dan tanggal kalender. | Mengakomodasi langganan grosir/warung yang terbiasa mengambil barang dengan sistem pembayaran tempo. |
| **Metode Pembayaran Uang Muka (DP)** | Pembayaran sebagian nilai belanja (DP tunai/transfer), dan sisa tagihan otomatis masuk ke saldo piutang tempo. | Mengamankan uang muka transaksi partai besar sebelum seluruh pesanan dikirimkan ke pelanggan. |
| **Buku Pembantu Piutang Pelanggan** | Kartu piutang individual mencatat riwayat faktur hutang, tanggal jatuh tempo, sisa saldo, dan aksi pelunasan hutang. | Pemilik toko (Pak Noor) memiliki visibilitas 100% atas seluruh uang toko yang masih beredar di luar. |

---

#### 3.3 MODUL KAS KECIL KASIR (PETTY CASH & BIAYA OPERASIONAL TOKO)

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Form Input Kas Kecil Cepat di POS** | Kasir dapat mencatat pengeluaran biaya harian langsung dari tombol kasir tanpa membuka menu akuntansi rumit. | Memastikan setiap uang rupiah yang keluar dari laci kasir tercatat secara resmi dan akurat. |
| **7 Kategori Biaya Operasional Toko** | Kategorisasi lengkap: Bensin Armada, Retribusi Pasar & Parkir, Ongkir Ekspedisi, Kuli Bongkar, Konsumsi, Perlengkapan Kasir, dll. | Memudahkan pengelompokan biaya operasional toko saat pembuatan laporan laba rugi bulanan. |
| **Pemotongan Otomatis Saldo Laci Kas** | Nominal kas kecil otomatis memotong nilai uang fisik laci kasir pada shift aktif kasir yang bersangkutan. | **Menghilangkan selisih setoran kasir** saat tutup toko; uang fisik dan pembukuan sistem klop sempurna. |
| **Cetak Bukti Pengeluaran Kasir** | Mencetak struk voucher kas keluar thermal bertanda tangan penerima dana dan kasir bertugas. | Menjadi bukti fisik sah saat pemeriksaan pertanggungjawaban pengeluaran uang kas toko. |

---

#### 3.4 MODUL INVENTORI MULTI-GUDANG (TOKO & DC), RAK & STOCK OPNAME

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Pencatatan Stok 2 Gudang Real-Time** | Pemisahan jumlah stok fisik antara **Toko Depan (WH-01)** dan **Gudang Pusat / DC (WH-02)**. | Menghindari kekosongan barang di toko depan meskipun stok cadangan di gudang pusat masih banyak. |
| **Peringatan Stok Menipis (Low Stock Alert)** | Notifikasi visual warna merah/kuning saat persediaan barang berada di bawah batas minimum (*safety stock*). | Toko dapat segera melakukan pemesanan ulang (*re-order*) ke distributor sebelum barang habis total. |
| **Mutasi Transfer Antar-Gudang** | Pemindahan stok Toko &harr; DC dengan alur status bertahap: Draft &rarr; Sent (Dalam Perjalanan) &rarr; Received (Diterima). | Stok berpindah secara atomik tanpa ada barang hilang di jalan dan tercatat siapa petugas pengirimnya. |
| **Planogram & Manajemen Lokasi Rak** | Pemetaan lorong dan nomor rak fisik (Rak A1, B2, C1, dst) terhubung langsung ke master barang. | Mempercepat staf toko dan gudang menemukan lokasi barang fisik saat menyiapkan pesanan pelanggan. |
| **Stock Opname Digital (Penyesuaian Stok)** | Input hasil hitung fisik (*physical count*), kalkulasi otomatis selisih unit, dan pencatatan alasan (rusak, hilang, expired). | **Mempermudah kegiatan stok opname berkala** tanpa perlu menutup toko seharian. |
| **Inbound PO Supplier & Retur Barang** | Pencatatan barang masuk dari distributor, verifikasi kuantitas fisik, update HPP otomatis, dan nota retur barang rusak. | Menjaga akurasi penerimaan barang dari pemasok dan mempermudah klaim retur barang cacat pabrik. |
| **Cetak Label Rak & Barcode (Shelf Tags)** | Cetak label rak minimarket memuat Nama Barang, Barcode EAN-13, Harga Eceran, Harga Grosir, dan Lokasi Rak. | Tampilan display rak toko fisik menjadi rapi, profesional, dan memudahkan pembeli melihat harga. |

---

#### 3.5 MODUL LOGISTIK PENGIRIMAN, SURAT JALAN & PACKING LIST KOLI

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Penerbitan Surat Jalan Pengiriman Resmi** | Mencetak dokumen surat jalan pengiriman lengkap dengan nomor seri, data pengirim, armada, sopir, dan penerima. | Dokumen legal pengiriman yang sah dan melindungi barang toko selama perjalanan di jalan raya. |
| **Toggle Mode Packing List Koli / Kardus** | Opsi beralih antara rincian seluruh SKU satuan detail dan ringkasan kemasan logistik kardus (*Packing List Koli Ringkas*). | **Sopir dan pihak ekspedisi dapat langsung menghitung jumlah koli kardus** di bak mobil secara cepat dan akurat. |
| **Format Tanda Tangan Tiga Pihak** | Kolom tanda tangan resmi untuk Petugas Gudang Pengirim, Sopir Pengantar, dan Pelanggan Penerima Barang. | Bukti serah terima barang yang kuat untuk mencegah klaim sepihak barang tidak sampai dari pembeli. |

---

#### 3.6 MODUL MASTER DATA PRODUK, SATUAN BERJENJANG & MULTI-HARGA

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Multi-Satuan Berjenjang Otomatis** | Relasi satuan berjenjang fleksibel (contoh: 1 Dus = 12 Box = 144 Pcs) terhubung ke 1 master produk. | Kasir dapat menjual dalam satuan eceran maupun kartonan tanpa perlu membuat master barang ganda. |
| **Dukungan Barcode Unik Tiap Satuan** | Scan barcode Pcs memotong 1 Pcs; scan barcode Dus otomatis memotong 144 Pcs dari stok gudang. | Kasir terhindar dari salah pilih barang atau salah hitung perkalian jumlah satuan saat melayani grosir. |
| **Tingkatan Harga Jual (Price Tiers)** | 4 Level harga fleksibel: **Harga Eceran**, **Grosir 1** (warung), **Grosir 2** (agen partai), dan **Member** langganan. | Toko dapat melayani berbagai segmen pelanggan (konsumen langsung vs pedagang grosir) secara otomatis. |
| **Kalkulasi HPP Average Costing** | Perhitungan modal HPP rata-rata bergerak (*moving average*) setiap ada barang masuk dengan harga beli baru. | Laba kotor toko tercatat riil sesuai fluktuasi harga modal beli barang dari distributor. |

---

#### 3.7 MODUL INTEGRASI SPREADSHEET: IMPOR & EKSPOR EXCEL NATIVE (.XLSX)

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Impor Excel Massal Master Produk** | Fitur unggah katalog ribuan barang via spreadsheet (.xlsx/.csv) lengkap dengan tombol unduh template resmi. | Memangkas waktu input data awal toko dari yang semula memakan waktu berhari-hari menjadi hitungan menit. |
| **Pratinjau & Validasi Data Impor** | Sistem memvalidasi barcode ganda, format harga, dan satuan sebelum disimpan permanen ke database. | Mencegah kesalahan data (*human error*) atau data korup masuk ke sistem operasional toko. |
| **Ekspor Native Spreadsheet (.xlsx)** | Unduh laporan Penjualan, Kartu Stok HPP, Buku Piutang, dan Kas Kecil ke file Excel asli dengan format sel rapi. | Memudahkan Bpk. Noor mengolah data laporan keuangan untuk keperluan pembukuan akuntansi dan perpajakan. |

---

#### 3.8 MODUL LAPORAN FINANSIAL, AUDIT KASIR DETAIL & KOMISI SALES

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Audit Transaksi Kasir Mendalam (Khusus Owner)** | Log transaksi memuat: **Nama Kasir, Nomor Faktur, Jam-Menit-Detik Transaksi, Rincian Barang yang Dibeli, Terminal, dan Nominal Faktur**. | **Sangat efektif melacak riwayat transaksi saat ada selisih stok opname** pada barang tertentu di rak. |
| **Dashboard Finansial & Margin Laba Kotor** | Ringkasan total omzet kotor, total HPP modal, laba kotor (*Gross Margin*), dan margin laba (%) real-time. | Pemilik toko dapat memantau kesehatan keuangan toko secara langsung kapan pun dan di mana pun. |
| **Grafik Visual Interaktif (Recharts)** | Grafik tren omzet harian/mingguan, diagram lingkaran (*Pie Chart*) kategori terlaris, dan metode bayar terpopuler. | Mempermudah pengambilan keputusan bisnis strategis (produk apa yang harus ditambah stoknya). |
| **Sistem Perhitungan Komisi Sales/Pegawai** | Menghitung otomatis hak komisi 1.5% dari omzet penjualan kasir + bonus unit target pencapaian toko. | Meningkatkan motivasi kerja karyawan toko dengan sistem insentif yang transparan dan otomatis. |
| **Kartu Stok & Valuasi HPP Gudang** | Riwayat mutasi keluar-masuk per produk dan total nilai uang rupiah yang tertanam dalam aset persediaan barang. | Memberikan kepastian total nilai aset barang dagangan milik Toko Pak Noor secara akurat. |

---

#### 3.9 MODUL KEAMANAN, HAK AKSES BERJENJANG (RBAC) & KELOLA TERMINAL

| Fitur Utama | Deskripsi Operasional | Manfaat bagi Toko Pak Noor |
|:---|:---|:---|
| **Halaman Login Ritel Terproteksi** | Akses masuk menggunakan PIN/Password unik karyawan, pilihan terminal kasir, gudang aktif, dan modal awal kas. | Mencegah orang luar atau staf yang tidak berwenang mengoperasikan komputer kasir toko. |
| **Hak Akses 4 Tingkat Peran (RBAC)** | • **Owner (Pak Noor)**: Akses mutlak 100%, audit kasir detail, laporan laba rugi, kelola akun.<br>• **Kepala Toko / SPV**: Akses operasional kasir, gudang, persetujuan diskon/void.<br>• **Kasir Toko**: Hanya menu POS & Kas Kecil. Terkunci dari HPP modal dan laba toko.<br>• **Petugas Gudang DC**: Hanya mutasi transfer stok, penerimaan barang, dan rak. | **Melindungi rahasia data finansial toko (HPP dan laba)** dari staf biasa serta mencegah manipulasi data. |
| **Manajemen Akun Pengguna oleh Owner** | Fitur khusus Owner untuk menambah kasir baru, mereset PIN staf, dan menonaktifkan karyawan yang sudah keluar. | Kontrol penuh pengelolaan staf toko berada 100% di tangan Bpk. Noor secara mandiri. |
| **Manajemen Mesin Kasir & Diagnostik** | Memantau status online/offline 5 terminal kasir, tes koneksi printer thermal, scanner barcode, dan laci uang. | Memastikan seluruh perangkat keras kasir siap digunakan sebelum toko dibuka setiap pagi. |

---

### 4. MATRIKS KESESUAIAN KEBUTUHAN BPK. NOOR (100% COMPLIANT)

| No | Spesifikasi Kebutuhan Toko Pak Noor | Implementasi Fitur Solusi Tim Mas Wahyu | Status Kesiapan |
|:--:|:---|:---|:---:|
| **1** | **5 Terminal Kasir Aktif & Cepat** | Arsitektur POS 5 terminal simultan dengan isolasi transaksi ACID database locking. | **Tersedia (100%)** |
| **2** | **Navigasi Cepat Kasir (Keyboard-First)** | Pintasan F1–F12, input pengali cepat `5*899...`, suara beep scanner otentik minimarket. | **Tersedia (100%)** |
| **3** | **Mode Layar Sentuh Tablet (Touch POS)** | Antarmuka kotak foto produk bergambar dengan tab kategori untuk tablet/iPad kasir. | **Tersedia (100%)** |
| **4** | **Integrasi Scanner, Printer & Cash Drawer** | Scanner USB/Bluetooth, Printer Thermal 58/80mm ESC/POS, laci uang RJ11, Customer Display F8. | **Tersedia (100%)** |
| **5** | **Pelanggan & Limit Piutang (Credit Limit)** | Master pelanggan, plafon limit kredit, kunci blokir otomatis saat piutang jatuh tempo. | **Tersedia (100%)** |
| **6** | **Metode Bayar Piutang (Tempo) & Uang Muka (DP)** | Bayar Tempo 7/14/30 hari dan pembayaran DP (Uang Muka + Sisa Hutang Tempo) tercatat di struk. | **Tersedia (100%)** |
| **7** | **Kas Kecil Kasir (Petty Cash)** | Input biaya kasir instan, 7 kategori biaya operasional toko, auto-potong laci kasir per shift. | **Tersedia (100%)** |
| **8** | **Cetak Draf Picking List Gudang** | Struk thermal nota antrean sementara khusus staf gudang dengan lokasi rak barang (A1, B2). | **Tersedia (100%)** |
| **9** | **Pencatatan Stok 2 Gudang (Toko & DC)** | Pemisahan stok fisik WH-01 dan WH-02, mutasi transfer stok, dan notifikasi stok menipis. | **Tersedia (100%)** |
| **10**| **Manajemen Planogram Rak Gudang** | Pemetaan lorong dan nomor rak (A1, B2) tertera pada struk picking list dan master barang. | **Tersedia (100%)** |
| **11**| **Surat Jalan Mode Packing List Koli** | Dokumen surat jalan resmi dengan toggle ringkasan koli kardus logistik ekspedisi. | **Tersedia (100%)** |
| **12**| **Multi-Satuan Berjenjang & Multi-Barcode** | Konversi bertingkat (Pcs/Dus), barcode per satuan, harga Eceran/Grosir 1-2/Member. | **Tersedia (100%)** |
| **13**| **HPP Otomatis Average Costing** | Perhitungan modal HPP rata-rata bergerak setiap penerimaan barang baru masuk. | **Tersedia (100%)** |
| **14**| **Ekspor Excel (.xlsx) Lengkap** | Ekspor native file Excel pada penjualan, kartu stok HPP, piutang, dan kas kecil. | **Tersedia (100%)** |
| **15**| **Impor Excel Massal Master Produk** | Upload katalog barang ribuan SKU via Excel dengan template unduhan resmi. | **Tersedia (100%)** |
| **16**| **Audit Kasir Detail per Jam & Item** | Log audit transaksi kasir: Jam Transaksi, Nama Kasir, Nama Barang, Nominal Faktur. | **Tersedia (100%)** |
| **17**| **Sistem Komisi Sales & Pegawai** | Perhitungan otomatis komisi 1.5% dari omzet kasir + bonus target unit barang. | **Tersedia (100%)** |
| **18**| **Hak Akses Berjenjang (RBAC 4 Level)** | Pembagian peran 4 tingkatan (Owner, Supervisor, Kasir, Gudang DC) login ber-PIN aman. | **Tersedia (100%)** |

---

### 5. RENCANA ANGGARAN BIAYA (RAB) & INVESTASI TRANSPARAN

Kami menyajikan paket investasi yang transparan, rasional, dan menyeluruh dengan skema **Hak Milik Penuh (Full Ownership / Sekali Bayar)** tanpa biaya langganan bulanan per kasir yang memberatkan:

#### A. Rincian Biaya Pengembangan Sistem Perangkat Lunak (Software Development - Sekali Bayar)

| No | Modul / Komponen Pekerjaan | Lingkup Deliverables & Fitur | Biaya (IDR) |
|:--:|:---|:---|:---:|
| **1** | **Core POS Engine & Multi-Terminal** | Arsitektur 5 kasir simultan, transaksi keyboard & touch, ACID concurrency locking, hold bill, split bill, cetak thermal 58/80mm, cash drawer, customer display F8. | Rp 4.500.000 |
| **2** | **Modul Pelanggan & Limit Piutang** | Database pelanggan, plafon limit kredit (credit limit), peringatan & kunci otomatis jatuh tempo, metode bayar Piutang & DP, kartu piutang pelanggan. | Rp 2.500.000 |
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

### 7. JADWAL PENERAPAN (TIMELINE: 3 - 4 MINGGU) & GARANSI BEBAS BUG

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
