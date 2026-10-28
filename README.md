# Amplop Gajian

Aplikasi web sederhana untuk membagi gaji ke amplop anggaran dan mencatat pengeluaran bulanan.

- Template **Anak kost** dan **Umum**, lengkap dengan rincian per amplop
- Acuan persentase ideal dan tombol bagi otomatis
- Pencatatan pengeluaran per amplop dan per rincian
- Data tersimpan di peramban perangkat masing-masing pengguna (tanpa login, tanpa server)
- Cadangan dan pemulihan data melalui file `.json`

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
