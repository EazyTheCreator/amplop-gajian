# Amplop Gajian

Aplikasi web sederhana untuk membagi gaji ke amplop anggaran dan mencatat pengeluaran bulanan.

- Template **Anak kost** dan **Umum**, skema gaji **bulanan** atau **mingguan**
- Pembagian otomatis berdasarkan acuan umum (adaptasi pola 50/30/20); nominal yang diubah dikunci dan amplop lain menyesuaikan
- Kolom utang dengan sisa pokok dan perkiraan bulan lunas
- Sisa uang bulan lalu otomatis terbawa (masuk tabungan atau ikut dibagi)
- Rencana tiap bulan dibekukan setelah bulan berlalu sehingga riwayat tidak berubah
- Pencatatan pengeluaran visual, bisa diubah, dan pencocokan dengan saldo sebenarnya
- Laporan: grafik 6 bulan, pengeluaran per amplop, pencarian, ekspor CSV
- Data hanya tersimpan di perangkat pengguna; pengingat cadangan, pulihkan dari cadangan
- Bisa dipasang di layar utama dan dibuka tanpa internet
- Membagikan ringkasan amplop Dapur & makan bulan berjalan ke [Menu Masak Mingguan](https://eazythecreator.github.io/menu-kost/) di perangkat yang sama

Buka aplikasinya di: https://eazythecreator.github.io/amplop-gajian/

## Struktur

| File | Isi |
|---|---|
| `index.html` | Kerangka halaman |
| `styles.css` | Tampilan (mode terang dan gelap) |
| `app.js` | Seluruh logika aplikasi |
| `tests/test_app.py` | Tes otomatis perhitungan utama |

## Menjalankan tes

```bash
pip install playwright
python -m playwright install chromium
python tests/test_app.py
```
