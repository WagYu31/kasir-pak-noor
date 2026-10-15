# PROPOSAL PENAWARAN PENGEMBANGAN SISTEM
## Sistem Point of Sale (POS) & Manajemen Inventori Retail
**Klien:** Bpk. Noor  
**Dokumen Referensi:** Product Requirement Document (PRD) v1.0  
**Penyedia Jasa:** Wahyu Utomo, S.Kom (Full-Stack Engineer & Data Specialist)  
**Tanggal:** 9 Oktober 2026  
**Status:** Penawaran Resmi (Fase 1 - Core MVP & Layanan Cloud)

---

### 1. RINGKASAN EKSEKUTIF
Sistem Point of Sale (POS) dan Manajemen Inventori ini dirancang khusus untuk toko retail fisik milik **Pak Noor**, berfokus pada kecepatan transaksi di area kasir (5 terminal bersamaan), akurasi stok di 2 lokasi gudang, fleksibilitas konversi multi-satuan dan tingkatan harga, serta pelaporan keuangan yang transparan.

Proposal ini mengadopsi **Skema Fase 1 (Core MVP)** yang memprioritaskan kestabilan operasional toko, efisiensi biaya awal investasi, serta pemeliharaan server cloud tahunan yang terjangkau dan terukur.

---

### 2. RUANG LINGKUP PEKERJAAN (SCOPE OF WORK - FASE 1)

Sistem dibangun berbasis web aplikasi responsif (*Next.js / React + Go/Node.js + PostgreSQL/MySQL*) yang mencakup modul-modul berikut:

#### A. Modul Kasir (Point of Sale / POS)
- **Dukungan 5 Terminal Kasir Aktif:** Penguncian transaksi pada level database (*ACID Transaction Locking*) agar tidak terjadi selisih stok (*race condition*).
- **Antarmuka Kasir Cepat:** Desain *keyboard-first* untuk kecepatan input kasir serta ramah sentuh (*touch-friendly* untuk tablet).
- **Integrasi Hardware Kasir:**
  - Barcode Scanner (mode USB HID & Bluetooth).
  - Printer Thermal (ukuran 58mm & 80mm) untuk cetak struk belanja langsung.
- **Multi-Satuan Otomatis:** Deteksi satuan barang secara otomatis berdasarkan scan barcode masing-masing satuan (Pcs, Box, Dus, dll).
- **Multi-Level Harga:** Pilihan tingkatan harga fleksibel per item (Eceran, Grosir 1, Grosir 2, Member).
- **Hold / Pending Order:** Simpan transaksi sementara untuk melayani pelanggan berikutnya tanpa menghilangkan antrean belanja sebelumnya.
- **Manajemen Shift Kasir:** Input modal awal kasir, pencatatan kas masuk/keluar, dan rekapitulasi audit selisih kas saat tutup shift.

#### B. Modul Inventori & Multi-Gudang (2 Lokasi)
- **Pencatatan Stok 2 Gudang:** Pemisahan dan pemantauan stok secara terpisah dan rinci untuk 2 lokasi gudang fisik.
- **Mutasi Stok Antar-Gudang:** Fitur transfer stok antar-gudang (mengurangi gudang asal dan menambah gudang tujuan secara instan dan akurat).
- **Stock Opname Digital:** Penyesuaian stok fisik secara berkala disertai log riwayat penyesuaian (*stock adjustment log*).
- **Peringatan Stok Minimum:** Notifikasi otomatis ketika stok produk berada di bawah batas aman.

#### C. Modul Master Data Produk & Harga
- **Hirarki Satuan Bertingkat:** Relasi satuan berjenjang (contoh: 1 Dus = 12 Box = 144 Pcs) dengan barcode unik per tingkatan satuan.
- **Kalkulasi HPP:** Menggunakan metode **Average Costing (Harga Rata-Rata)** untuk kestabilan kalkulasi margin keuntungan.
- **Pengelompokan Produk:** Kategori, Brand, Supplier, dan pengaturan Pajak (PPN).

#### D. Modul Laporan & Analitik (Reporting)
- **Laporan Penjualan:** Rekap harian, mingguan, bulanan dengan filter per kasir, per produk, dan per metode pembayaran (Tunai/QRIS/Transfer).
- **Laporan Laba Rugi Kotor:** Perhitungan estimasi margin laba kotor (*Gross Margin*) secara real-time.
- **Kartu Stok (Stock Movement):** Riwayat keluar-masuk barang per produk di masing-masing gudang.
- **Rekonsiliasi Shift Kasir:** Laporan audit penerimaan sistem vs uang fisik kasir.
- **Ekspor Data:** Dukungan unduh laporan ke format **Excel (.xlsx)** dan **PDF**.

---

### 3. BATASAN RUANG LINGKUP (OUT OF SCOPE - FASE 1)

Untuk menjaga ketepatan waktu rilis dan efisiensi biaya, batasan berikut berlaku untuk Fase 1:
1. **Pengadaan Perangkat Keras:** Laptop/PC/Tablet kasir, barcode scanner, dan printer thermal disediakan oleh pihak klien (Pak Noor) sesuai spesifikasi yang disarankan.
2. **Koneksi Jaringan Lokal:** Kestabilan koneksi Wi-Fi/LAN di dalam toko menjadi tanggung jawab pengelola toko.
3. **Migrasi Data Awal:** Tim pengembang menyediakan template spreadsheet (Excel) standar. Pengisian dan validasi data produk awal dilakukan oleh pihak Pak Noor sebelum diimpor ke sistem.
4. **Pelatihan Staf:** Dilakukan secara daring (*remote*) melalui Google Meet beserta panduan petunjuk teknis / video rekaman operasional sistem.

---

### 4. RENCANA ANGGARAN BIAYA & INVESTASI

| No | Komponen Layanan | Periode | Biaya Investasi |
| :---: | :--- | :---: | :---: |
| **1** | **Pengembangan Sistem POS & Inventori Retail (Fase 1)**<br>• Modul Kasir 5 Terminal, Multi-Satuan, Multi-Harga<br>• Modul Stok 2 Gudang & Mutasi Antar Gudang<br>• Master Data Produk, Kategori, Supplier<br>• Laporan Penjualan, Laba Kotor, Kartu Stok, & Shift<br>• Garansi Perbaikan Bug: 30 Hari kalender | *Sekali Bayar* | **Rp 15.000.000** |
| **2** | **Layanan Cloud Hosting, Domain & Keamanan Data (Tahun ke-1)**<br>• Sewa Cloud VPS High-Performance (Kapasitas transaksi 5 kasir)<br>• Nama Domain Kustom (.com / .id / .my.id)<br>• Sertifikat Keamanan SSL (HTTPS Encryption)<br>• Otomatisasi Backup Database Harian (*Auto Cloud Backup*)<br>• Monitoring Uptime Server & Pemeliharaan Teknis Cloud | *Tahunan* | **Rp 2.000.000** |
| | **TOTAL INVESTASI TAHUN PERTAMA** | | **Rp 17.000.000** |

---

### 5. KETENTUAN KHUSUS LAYANAN HOSTING & CLOUD (OPSI B - Rp 2.000.000 / TAHUN)

Agar kerja sama berjalan transparan dan berkesinambungan, batasan layanan tahunan Rp 2.000.000 mencakup:
1. **Cakupan Layanan:**
   - Pemeliharaan server agar sistem dapat diakses secara online 24/7.
   - Pemulihan data (*restore database*) jika terjadi kegagalan sistem pada server.
   - Pembaruan masa aktif domain dan sertifikat keamanan SSL tahunan.
2. **Di Luar Cakupan Biaya Tahunan:**
   - Penambahan fitur atau modul baru di luar dokumen penawaran ini (akan dikenakan biaya pengembangan terpisah berdasarkan *request*).
   - Kerusakan fisik pada perangkat keras (printer, scanner, PC/tablet kasir).
   - Masalah jaringan internet lokal toko atau provider telekomunikasi di toko fisik.
3. **Dukungan Bantuan Teknis:**
   - Layanan konsultasi teknis via WhatsApp/Remote Support pada hari dan jam operasional kerja (Senin – Sabtu, 08.00 – 18.00 WIB) dengan waktu respon maksimal 1–2 jam untuk kendala prioritas kasir.

---

### 6. SKEMA TERMIN PEMBAYARAN (TERM OF PAYMENT)

Pembayaran biaya pengembangan sistem (**Rp 15.000.000**) dilakukan secara bertahap sesuai progres pengerjaan:

1. **Termin 1 (DP 40%): Rp 6.000.000**  
   Dibayarkan saat penandatanganan persetujuan proposal sebelum pengerjaan arsitektur dan database dimulai.
2. **Termin 2 (Progres 30%): Rp 4.500.000**  
   Dibayarkan saat Modul Master Data, Stok 2 Gudang, dan Antarmuka Kasir (POS) selesai didemonstrasikan.
3. **Termin 3 (Pelunasan 30%): Rp 4.500.000**  
   Dibayarkan setelah pengujian menyeluruh (*User Acceptance Testing / UAT*), integrasi hardware printer/scanner selesai, dan sistem siap diluncurkan (*Go-Live*).
4. **Biaya Hosting & Cloud (Rp 2.000.000):**  
   Dibayarkan bersamaan dengan Termin 1 saat server cloud dan domain mulai dikonfigurasi.

---

### 7. ESTIMASI JADWAL PENGERJAAN (TIMELINE: 5 MINGGU)

| Minggu | Fokus Kegiatan | Output Utama |
| :---: | :--- | :--- |
| **Minggu 1** | Arsitektur & Database | Skema database 2 gudang, multi-satuan, setup Cloud VPS & domain |
| **Minggu 2** | Master Data & Stok | Modul produk, satuan bertingkat, mutasi antar-gudang, stok opname |
| **Minggu 3** | Modul POS & Hardware | Antarmuka kasir, integrasi scanner, cetak struk thermal, shift kasir |
| **Minggu 4** | Laporan & Pengujian | Modul laporan penjualan, laba kotor, kartu stok, tes 5 kasir bersamaan |
| **Minggu 5** | UAT & Peluncuran (*Go-Live*) | Uji fungsi pengguna bersama Pak Noor, impor data awal, pelatihan staf |

---

### 8. LEMBAR PERSETUJUAN KERJASAMA

Dengan menandatangani proposal ini, kedua belah pihak menyetujui ruang lingkup pekerjaan, rincian biaya, serta syarat dan ketentuan yang tertera di atas.

<br>

**Disetujui Oleh (Klien),**  
Toko Retail Pak Noor  

<br><br><br>

**( Bpk. Noor )**  
Tanggal: ___________________  

<br>

**Diajukan Oleh (Pengembang),**  
Full-Stack Engineer  

<br><br><br>

**( Wahyu Utomo, S.Kom )**  
Tanggal: 9 Oktober 2026  
