# DOKUMEN PROPOSAL TEKNIS & RENCANA ANGGARAN BIAYA (RAB) v2.0
## Sistem Point of Sale (POS) & Manajemen Inventori Retail Multi-Gudang Terintegrasi

**Kepada Yth:**  
**Bpk. Noor (Owner / Direktur)**  
Toko Retail Pak Noor  
Banjarmasin / Indonesia  

**Dari:**  
**Wahyu Utomo, S.Kom & Tim Pengembang**  
*Full-Stack Engineer & Retail Software Specialist*  
GitHub: [WagYu31/kasir-pak-noor](https://github.com/WagYu31/kasir-pak-noor)  
Demo Live Sistem: [https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)  

**Tanggal:** 16 Oktober 2026  
**Nomor Dokumen:** 028/PROP-POS-PN/X/2026  
**Status:** Dokumen Resmi Penawaran & Spesifikasi Kebutuhan Sistem (Revisi Final v2.0)  

---

### 1. RINGKASAN EKSEKUTIF & PERNYATAAN KESIAPAN TEKNOLOGI

Menindaklanjuti draf lembar kebutuhan sistem retail dan spesifikasi teknis dari **Bpk. Noor**, kami menyatakan bahwa **seluruh kebutuhan fungsional dan operasional toko telah SESUAI 100% dengan kapabilitas teknologi tim kami**.

Bahkan sebagai wujud komitmen dan keseriusan kami, tim pengembang telah membangun dan meluncurkan **Prototipe Sistem Operasional Penuh (Fully Functional Live Demo)** yang saat ini sudah dapat diakses dan diuji coba secara langsung oleh Bpk. Noor melalui tautan:  
👉 **[https://kasir-pak-noor.vercel.app](https://kasir-pak-noor.vercel.app)**

Sistem ini dirancang khusus untuk mengakomodasi model bisnis grosir dan eceran dengan beban transaksi tinggi (multi-kasir bersamaan), pengendalian stok di multi-gudang (Toko & DC Pusat), pengawasan ketat risiko piutang (*Credit Limit*), pencatatan biaya kasir harian (*Petty Cash*), hingga pelaporan audit kasir mendalam per jam dan per barang guna menjamin kemudahan stok opname tanpa selisih.

---

### 2. MATRIKS KESESUAIAN KEBUTUHAN SISTEM (100% COMPLIANT)

Berikut adalah rekapitulasi spesifikasi teknis yang diminta oleh Bpk. Noor beserta implementasi solusinya:

| No | Modul / Kebutuhan Bpk. Noor | Implementasi Solusi Tim Mas Wahyu | Status Kesiapan |
|:--:|:---|:---|:---:|
| **1** | **POS Kasir Cepat (Multi-Terminal)** | Mendukung 5 kasir aktif serentak dengan *ACID Database Locking* (mencegah bentrok stok), navigasi *keyboard-first* (F1-F12), dan mode sentuh (*touchscreen* tablet). | **Tersedia (100%)** |
| **2** | **Integrasi Perangkat Keras** | Kompatibel Barcode Scanner (USB HID & Bluetooth), Printer Thermal 58mm/80mm (*ESC/POS*), Laci Uang (*Cash Drawer* RJ11), dan Layar Pelanggan (*Customer Display [F8]*). | **Tersedia (100%)** |
| **3** | **Modul Pelanggan & Limit Piutang** | Registrasi member/pelanggan langsung di kasir, penetapan plafon piutang (*Credit Limit*), tracking tanggal jatuh tempo, dan pemblokiran otomatis jika kredit melampaui limit atau menunggak (*Overdue*). | **Tersedia (100%)** |
| **4** | **Metode Bayar Fleksibel** | 5 metode pembayaran: **Tunai**, **QRIS Dinamis**, **Transfer Bank**, **Piutang (Tempo 7/14/30 Hari)**, dan **DP (Uang Muka + Sisa Tempo)**. | **Tersedia (100%)** |
| **5** | **Input Kas Kecil Kasir (Petty Cash)** | Form pencatatan biaya kasir instan di POS (Bensin armada, retribusi parkir pasar, ongkir ekspedisi, upah kuli bongkar, konsumsi toko). Otomatis memotong uang fisik kasir pada shift aktif. | **Tersedia (100%)** |
| **6** | **Cetak Draf Bill / Picking List Gudang** | Cetak struk thermal sementara untuk antrean hold bill berformat *Warehouse Picking List* dilengkapi lokasi rak barang, kotak centang `[ ]`, dan kolom paraf petugas gudang. | **Tersedia (100%)** |
| **7** | **Multi-Gudang & Manajemen Rak** | Pemisahan stok real-time antara Toko Depan (WH-01) dan DC Pusat (WH-02), transfer stok antar-gudang, serta pemetaan planogram rak fisik (Kolom/Baris/Bin). | **Tersedia (100%)** |
| **8** | **Surat Jalan Mode Koli / Kardus** | Cetak Surat Jalan resmi dengan opsi beralih (*toggle*) antara rincian SKU detail dan ringkasan kardus logistik (*Packing List Koli Ringkas*) untuk sopir ekspedisi. | **Tersedia (100%)** |
| **9** | **Multi-Satuan & HPP Otomatis** | Konversi bertingkat (Pcs, Box, Dus/Karton), scan barcode unik per satuan, multi-tier harga (Eceran, Grosir 1, Grosir 2, Member), serta perhitungan HPP *Average Costing*. | **Tersedia (100%)** |
| **10**| **Ekspor Excel (.xlsx) Lengkap** | Ekspor file native `.xlsx` pada Laporan Audit Penjualan, Kartu Stok & HPP, Beban Kas Kecil, dan Buku Piutang Pelanggan. | **Tersedia (100%)** |
| **11**| **Impor Excel Massal Master Produk** | Fitur unggah katalog barang massal via spreadsheet (.xlsx/.csv) dilengkapi unduhan template resmi dan validasi sebelum disimpan. | **Tersedia (100%)** |
| **12**| **Audit Kasir & Log Transaksi Detail** | Fitur khusus Owner untuk memantau log transaksi kasir: **Nama Kasir, Jam Transaksi, Nama Barang, dan Nominal per Transaksi** sehingga mempermudah investigasi selisih saat stok opname. | **Tersedia (100%)** |
| **13**| **Sistem Komisi Sales & Pegawai** | Perhitungan otomatis komisi 1.5% dari omzet kasir + bonus pencapaian target unit, disertai pencatatan status pencairan komisi. | **Tersedia (100%)** |
| **14**| **Hak Akses Berjenjang (RBAC)** | Pemisahan hak akses 4 level: **Owner (Pemilik Bisnis)**, **Kepala Toko / Supervisor**, **Kasir Toko**, dan **Petugas Gudang / DC**. | **Tersedia (100%)** |

---

### 3. RENCANA ANGGARAN BIAYA (RAB) INVESTASI SISTEM

Kami menawarkan paket investasi transparan, rasional, dan menyeluruh tanpa biaya tersembunyi (*no hidden fee*):

#### A. Biaya Pengembangan Perangkat Lunak (Software Development - Sekali Bayar / One-Time Fee)

| No | Modul / Komponen Pekerjaan | Spesifikasi & Deliverable | Biaya (IDR) |
|:--:|:---|:---|:---:|
| **1** | **Core POS Engine & Multi-Terminal** | Arsitektur POS 5 terminal kasir, transaksi cepat keyboard & touch, ACID database locking, hold bill, split bill, integrasi scanner, thermal receipt 58/80mm, cash drawer, dan customer display F8. | Rp 4.500.000 |
| **2** | **Modul Pelanggan & Manajemen Piutang** | Database pelanggan, plafon limit kredit (credit limit), peringatan & kunci otomatis jatuh tempo (overdue), skema bayar Piutang & DP, kartu piutang pelanggan. | Rp 2.500.000 |
| **3** | **Modul Inventori, Multi-Gudang & Rak** | Manajemen stok 2 gudang (Toko & DC), transfer mutasi stok, stok opname digital, planogram manajemen rak barang, cetak surat jalan standar & mode packing list koli/kardus. | Rp 3.000.000 |
| **4** | **Modul Kas Kecil (Petty Cash) Kasir** | Form input biaya kasir instan, kategorisasi biaya operasional, pemotongan laci kasir otomatis, cetak bukti kas kecil, dan rekapitulasi audit per shift kasir. | Rp 1.500.000 |
| **5** | **Master Data Produk & Impor/Ekspor Excel** | Satuan bertingkat (Pcs/Dus), multi-tier harga, HPP average costing, modul impor produk massal (.xlsx) dengan template, dan ekspor native `.xlsx` di seluruh laporan. | Rp 2.000.000 |
| **6** | **Laporan, Audit Transaksi & Komisi Sales** | Audit kasir detail per jam/item/nominal (khusus Owner), laporan laba kotor, kartu stok, sistem komisi sales/pegawai (1.5% + bonus), dan analisis visual recharts. | Rp 2.000.000 |
| **7** | **Sistem Keamanan & Manajemen Peran (RBAC)** | Halaman login ritel terproteksi, manajemen akun kasir/pegawai oleh Owner, kontrol hak akses 4 level peran, dan manajemen terminal hardware. | Rp 1.500.000 |
| | **SUBTOTAL BIAYA PENGEMBANGAN SISTEM** | *(Lisensi Penuh / Full Ownership - Sekali Bayar)* | **Rp 17.000.000** |

#### B. Layanan Infrastruktur Cloud, Domain & Pemeliharaan (Tahun Pertama)

| No | Komponen Layanan Cloud | Spesifikasi & Cakupan Layanan | Biaya (IDR) |
|:--:|:---|:---|:---:|
| **1** | **Cloud VPS Server High Performance** | Server cloud terdedikasi, kapasitas transaksi multi-kasir stabil 24/7, SSD NVMe storage, unmetered bandwidth. | Termasuk |
| **2** | **Nama Domain Bisnis Kustom** | Domain resmi toko (pilihan: `.com` / `.id` / `.co.id` / `.my.id`) selama 1 tahun. | Termasuk |
| **3** | **Sertifikat Keamanan SSL (HTTPS)** | Enkripsi data standar perbankan / retail modern 256-bit. | Termasuk |
| **4** | **Otomatisasi Backup Cloud Harian** | Auto-backup database transaksi & stok setiap malam ke cloud storage terpisah (aman dari kehilangan data fisik). | Termasuk |
| **5** | **Pemeliharaan & Monitoring Uptime Server** | Pengawasan kesehatan server 24/7 dan penanganan cepat kendala teknis cloud. | Termasuk |
| | **SUBTOTAL LAYANAN CLOUD TAHUN KE-1** | *(Dibayarkan per tahun)* | **Rp 2.000.000** |

---

### REKAPITULASI TOTAL INVESTASI

```
+-------------------------------------------------------------------------------+
|  1. Pengembangan Sistem POS & Inventori Retail v2.0 (Sekali Bayar) : Rp 17.000.000 |
|  2. Layanan Cloud VPS, Domain & Auto Backup Harian (Tahun Pertama) : Rp  2.000.000 |
+-------------------------------------------------------------------------------+
|  TOTAL INVESTASI AWAL (TAHUN PERTAMA)                             : Rp 19.000.000 |
+-------------------------------------------------------------------------------+
```

> **Catatan Biaya Tahun ke-2 dan Seterusnya:**  
> Toko Retail Pak Noor hanya dikenakan biaya perpanjangan operasional Cloud VPS, Domain, dan Auto-Backup sebesar **Rp 2.000.000 / tahun**. Tidak ada biaya langganan bulanan per kasir (*zero recurring monthly subscription*), sehingga jauh lebih hemat dibanding aplikasi POS SaaS komersial yang menarik biaya bulanan per kasir.

---

### 4. SKEMA TERMIN PEMBAYARAN (TERM OF PAYMENT)

Untuk menjamin kenyamanan dan transparansi bersama, pembayaran dapat dilakukan secara bertahap dalam 3 termin:

1. **Termin 1 (Uang Muka 40% + Biaya Cloud): Rp 8.800.000**  
   - Dibayarkan saat penandatanganan kesepakatan kerjasama.  
   - Tim langsung mengkonfigurasi Cloud VPS Server produksi, domain resmi toko, dan migrasi basis data.
2. **Termin 2 (Progres Pekerjaan 30%): Rp 5.100.000**  
   - Dibayarkan saat demonstrasi integrasi modul kasir, modul piutang, multi-gudang, dan kas kecil selesai ditinjau bersama tim Pak Noor.
3. **Termin 3 (Pelunasan 30% saat Go-Live): Rp 5.100.000**  
   - Dibayarkan setelah pengujian menyeluruh (*User Acceptance Testing / UAT*), integrasi hardware printer/scanner di lokasi, pelatihan staf, dan sistem resmi digunakan untuk operasional toko (*Go-Live*).

---

### 5. JADWAL PELAKSANAAN & PENERAPAN (TIMELINE: 3 - 4 MINGGU)

Karena prototipe arsitektur dasar telah berhasil kami bangun dan diuji coba, waktu implementasi menjadi jauh lebih cepat dan terukur:

```
[ Minggu 1 ] Setup Cloud Production, Domain Resmi, Konfigurasi Multi-Gudang & Master Data
      ↓
[ Minggu 2 ] Impor Katalog Produk Pak Noor, Konfigurasi Plafon Piutang Pelanggan & Kas Kecil
      ↓
[ Minggu 3 ] Integrasi Hardware Fisik Kasir (Printer Thermal, Barcode Scanner, Cash Drawer) & Uji 5 Kasir
      ↓
[ Minggu 4 ] Pelatihan Kasir & Tim Gudang, Stok Opname Awal, dan Peluncuran Resmi (Go-Live)
```

---

### 6. FASILITAS PENDUKUNG & GARANSI (VALUE-ADDED SERVICES)

Sebagai bagian dari layanan profesional kami, Bpk. Noor mendapatkan fasilitas pendukung tanpa biaya tambahan:
1. **Garansi Sistem & Bug-Free 60 Hari Kalender**: Perbaikan langsung jika ditemukan anomali atau *bug* sistem pasca Go-Live.
2. **Buku Panduan Operasional Digital (SOP Kasir & Gudang)**: Dokumen petunjuk visual penggunaan sistem untuk mempermudah pelatihan karyawan baru.
3. **Template Excel Standar**: Format siap pakai untuk impor master barang dan data pelanggan awal.
4. **Dukungan Bantuan Teknis Prioritas**: Jalur komunikasi khusus via WhatsApp pada hari dan jam operasional toko untuk penanganan cepat kendala kasir.

---

### 7. LEMBAR PENGESAHAN & PERSETUJUAN KERJASAMA

Proposal penawaran dan rancangan anggaran biaya ini berlaku selama 30 (tiga puluh) hari kalender sejak tanggal diterbitkan. Persetujuan dapat dilakukan dengan menandatangani dokumen ini atau melalui konfirmasi resmi via pesan/surat elektronik.

<br>

| Disetujui Oleh (Pihak Klien), | Diajukan Oleh (Pihak Pengembang), |
| :---: | :---: |
| **TOKO RETAIL PAK NOOR** | **TIM PENGEMBANG SISTEM** |
| <br><br><br><br> | <br><br><br><br> |
| **( BPK. NOOR )** | **( WAHYU UTOMO, S.Kom )** |
| *Owner / Direktur Utama* | *Lead Full-Stack Engineer* |
| Tanggal: ________________________ | Tanggal: 16 Oktober 2026 |

---
*Lampiran: Tautan Live Demo Sistem POS & Inventori Pak Noor: https://kasir-pak-noor.vercel.app*
