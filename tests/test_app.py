"""Tes otomatis Amplop Gajian.

Menjalankan aplikasi di peramban tanpa layar (Chromium lewat Playwright) dan
memeriksa perhitungan utama. Jalankan dari folder repositori:

    pip install playwright && python -m playwright install chromium
    python tests/test_app.py
"""
import asyncio
import calendar
import datetime
import pathlib
import sys

from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
URL = (ROOT / "index.html").as_uri()
LS_KEY = "amplop-gajian-v1"

results = []


def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(("  OK   " if cond else "  GAGAL") + "  " + name + (("  — " + str(detail)) if detail and not cond else ""))


async def fresh(browser, **kw):
    page = await browser.new_page(viewport={"width": 390, "height": 844}, **kw)
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    await page.goto(URL)
    await page.wait_for_timeout(300)
    return page, errors


async def type_money(page, sel, value):
    await page.fill(sel, value)
    await page.dispatch_event(sel, "input")
    await page.wait_for_timeout(150)


async def amount(page, pid):
    t = await page.text_content(f'.pos[data-id="{pid}"] .pamt')
    return int("".join(ch for ch in t if ch.isdigit()) or 0)


async def text(page, sel):
    return (await page.text_content(sel)) or ""


async def test_auto_split(b):
    print("Pembagian otomatis")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    check("gaji 8 jt terbagi pas", "Pas" in await text(page, "#allocPill"))
    check("tempat tinggal 25% = 2 jt", await amount(page, "k1") == 2_000_000)
    check("tabungan 15% = 1,2 jt", await amount(page, "k7") == 1_200_000)
    await type_money(page, "#inum-k1a", "2500000")
    check("sewa dikunci tetap pas", "Pas" in await text(page, "#allocPill"))
    check("hiburan dikurangi lebih dulu", await amount(page, "k9") < 1_200_000)
    check("tabungan tidak disentuh saat keinginan cukup", await amount(page, "k7") == 1_200_000)
    await type_money(page, "#inum-k1a", "9000000")
    check("biaya terkunci melebihi pemasukan diberi peringatan", "Melebihi" in await text(page, "#allocPill"))
    await page.click('.pos[data-id="k1"] .unlock')
    await page.wait_for_timeout(150)
    check("buka kunci kembali ke acuan", await amount(page, "k1") == 2_000_000)
    check("tanpa galat skrip", not errors, errors)


async def test_debt_and_carry(b):
    print("Utang dan sisa bulan lalu")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await type_money(page, "#inUtang", "1000000")
    check("persentase dihitung setelah utang", "Rp7.000.000" in await text(page, "#utangHint"))
    check("baris utang tampil", await page.locator(".pos.debt").count() == 1)
    await page.click("#tabCatat")
    await page.click(".cat >> nth=1")
    await page.click('#quickAmt button[data-a="50000"]')
    await page.click('#quickAmt button[data-a="20000"]')
    await page.click("#txSubmit")
    await page.wait_for_timeout(700)
    check("sisa uang = gaji − utang − belanja", "6.930.000" in await text(page, "#sLeft"))
    await page.click("#tabBagi")
    await page.click("#nextM")
    await page.wait_for_timeout(700)
    check("sisa terbawa ke bulan berikutnya", "6.930.000" in await text(page, "#carryAmt"))
    check("utang ikut terbawa", (await page.input_value("#inUtang")) == "1.000.000")
    check("sisa bulan lalu masuk tabungan setelah utang", await amount(page, "k7") == 5_930_000)
    check("tetap pas, tidak melebihi pemasukan", "Pas" in await text(page, "#allocPill"))
    await page.click("#advToggle")
    await page.click('#carrySeg button[data-v="split"]')
    await page.wait_for_timeout(200)
    check("pilihan ikut dibagi menyebar ke amplop lain", await amount(page, "k1") > 0 and await amount(page, "k7") < 5_930_000)
    check("tanpa galat skrip", not errors, errors)


async def test_weekly(b):
    print("Gaji mingguan")
    page, errors = await fresh(b)
    await page.click('#freq button[data-f="minggu"]')
    await type_money(page, "#inGaji", "1500000")
    today = datetime.date.today()
    fridays = sum(1 for d in range(1, calendar.monthrange(today.year, today.month)[1] + 1)
                  if datetime.date(today.year, today.month, d).weekday() == 4)
    check("jumlah gajian = jumlah hari Jumat", (await text(page, "#wkCount")) == str(fridays))
    total = await text(page, "#sIn")
    check("total bulanan = gaji × jumlah gajian", f"{1500000 * fridays:,}".replace(",", ".") in total, total)
    check("tanpa galat skrip", not errors, errors)


async def test_custom_group(b):
    print("Amplop buatan sendiri")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await page.click("#addPos")
    await page.wait_for_timeout(150)
    await page.select_option(".pos:last-child .pg-sel", "save")
    await page.wait_for_timeout(200)
    pid = await page.get_attribute(".pos:last-child", "data-id")
    check("kelompok tabungan 5% = 400 rb", await amount(page, pid) == 400_000)
    check("tetap pas setelah amplop baru", "Pas" in await text(page, "#allocPill"))
    await page.reload()
    await page.wait_for_timeout(300)
    check("setelah gaji diisi, aplikasi dibuka di tab Catat", await page.is_visible("#panelCatat"))
    await page.click("#tabBagi")
    check("tersimpan setelah muat ulang", await amount(page, pid) == 400_000)
    check("tanpa galat skrip", not errors, errors)


async def test_legacy_unlock(b):
    print("Pembaruan dari data lama")
    page, errors = await fresh(b)
    old = {"settings": {"tpl": "kost", "pos": [
        {"id": "k7", "name": "Tabungan", "type": "fix", "value": 900000, "c": 8, "items": [], "m": True},
        {"id": "k1", "name": "Tempat tinggal", "type": "rinci", "value": 0, "c": 1,
         "items": [{"id": "k1a", "name": "Sewa kost", "value": 1500000, "m": True}]}]},
        "months": {}}
    await page.evaluate("o => localStorage.setItem('%s', JSON.stringify(o))" % LS_KEY, old)
    await page.reload()
    await page.wait_for_timeout(300)
    manual = await page.evaluate("[...document.querySelectorAll('.pideal, .isug')].filter(e => e.textContent.includes('Manual')).length")
    check("data lama dibuka kuncinya sekali", manual == 0, manual)
    check("tanpa galat skrip", not errors, errors)


async def test_backup_reminder(b):
    print("Pengingat cadangan")
    page, errors = await fresh(b)
    check("tanpa data, pengingat tersembunyi", await page.is_hidden("#bkBanner"))
    await type_money(page, "#inGaji", "8000000")
    await page.wait_for_timeout(600)
    await page.reload()
    await page.wait_for_timeout(300)
    check("ada data tanpa cadangan, pengingat muncul", await page.is_visible("#bkBanner"))
    await page.click("#bkLater")
    check("tombol Nanti menyembunyikan pengingat", await page.is_hidden("#bkBanner"))
    async with page.expect_download() as dl:
        await page.click("#bkExport")
    d = await dl.value
    check("cadangan terunduh sebagai .json", d.suggested_filename.endswith(".json"), d.suggested_filename)
    check("tanggal cadangan terakhir tercatat", "Cadangan terakhir" in await text(page, "#bkLast"))
    check("tanpa galat skrip", not errors, errors)


async def test_frozen_plan(b):
    print("Rencana per bulan")
    page, errors = await fresh(b)
    await page.click("#prevM")                       # bulan lalu
    await page.wait_for_timeout(200)
    await type_money(page, "#inGaji", "8000000")
    await page.wait_for_timeout(600)
    await page.reload()                              # saat dibuka ulang, bulan lalu dibekukan
    await page.wait_for_timeout(300)
    await page.click("#tabBagi")
    await type_money(page, "#inGaji", "8000000")     # bulan ini
    await type_money(page, "#inum-k1a", "2500000")   # ubah rencana berjalan
    await page.wait_for_timeout(600)
    check("bulan ini memakai sewa baru", (await page.input_value("#inum-k1a")) == "2.500.000")
    await page.click("#prevM")
    await page.wait_for_timeout(300)
    check("bulan lalu ditandai beku", await page.is_visible("#frozenNote"))
    check("riwayat bulan lalu tidak berubah", await amount(page, "k1") == 2_000_000)
    await page.click("#nextM")
    await page.wait_for_timeout(300)
    check("bulan ini tidak beku", await page.is_hidden("#frozenNote"))
    check("tanpa galat skrip", not errors, errors)


async def test_reconcile(b):
    print("Cocokkan saldo")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await page.click("#tabCatat")
    await page.click("#recon summary")
    check("sisa menurut catatan tampil", "8.000.000" in await text(page, "#reconApp"))
    await type_money(page, "#reconIn", "7800000")
    await page.click("#reconBtn")
    await page.wait_for_timeout(700)
    check("kekurangan dicatat sebagai koreksi", "7.800.000" in await text(page, "#sLeft"))
    await type_money(page, "#reconIn", "7900000")
    await page.click("#reconBtn")
    await page.wait_for_timeout(700)
    check("kelebihan uang juga dikoreksi", "7.900.000" in await text(page, "#sLeft"))
    check("riwayat menampilkan koreksi", "Koreksi saldo" in await text(page, "#txList"))
    check("tanpa galat skrip", not errors, errors)


async def test_priority(b):
    print("Pilihan prioritas")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "5000000")
    await type_money(page, "#inum-k1a", "2500000")
    save_first = await amount(page, "k7")
    await page.click("#advToggle")
    await page.click('#prioSeg button[data-v="need"]')
    await page.wait_for_timeout(200)
    need_first = await amount(page, "k7")
    check("utamakan kebutuhan menurunkan tabungan lebih dulu", need_first < save_first, (save_first, need_first))
    check("tetap pas", "Pas" in await text(page, "#allocPill"))
    check("tanpa galat skrip", not errors, errors)


async def test_debt_payoff(b):
    print("Sisa pokok utang")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await type_money(page, "#inUtang", "1000000")
    await type_money(page, "#inDebtTotal", "5000000")
    eta = await text(page, "#debtEta")
    check("perkiraan lunas 4 bulan lagi", "4.000.000" in eta and "4 bulan lagi" in eta, eta)
    await page.wait_for_timeout(600)
    await page.click("#nextM")
    await page.wait_for_timeout(300)
    check("bulan berikutnya sisa pokok berkurang otomatis", (await page.input_value("#inDebtTotal")) == "4.000.000")
    check("tanpa galat skrip", not errors, errors)


async def test_simple_mode(b):
    print("Mode sederhana")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    check("pengaturan lanjutan tersembunyi secara bawaan", await page.is_hidden('.pos[data-id="k1"] .seg'))
    await page.click("#advToggle")
    check("bisa ditampilkan", await page.is_visible('.pos[data-id="k1"] .seg'))
    await page.reload()
    await page.wait_for_timeout(300)
    await page.click("#tabBagi")
    check("pilihan diingat", await page.is_visible('.pos[data-id="k1"] .seg'))
    check("tanpa galat skrip", not errors, errors)


async def test_edit_tx(b):
    print("Ubah transaksi")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await page.click("#tabCatat")
    await page.click(".cat >> nth=1")
    await type_money(page, "#txAmt", "50000")
    await page.fill("#txDesc", "Pasar")
    await page.click("#txSubmit")
    await page.wait_for_timeout(600)
    await page.click("#txList .tx .tx-desc")
    check("formulir terisi data lama", (await page.input_value("#txAmt")) == "50.000")
    check("mode ubah aktif", "Simpan" in await text(page, "#txSubmit"))
    await type_money(page, "#txAmt", "75000")
    await page.click("#txSubmit")
    await page.wait_for_timeout(600)
    check("jumlah catatan tetap satu", await page.locator("#txList .tx").count() == 1)
    check("nominal diperbarui", "75.000" in await text(page, "#txList"))
    check("sisa uang ikut berubah", "7.925.000" in await text(page, "#sLeft"))
    check("tanpa galat skrip", not errors, errors)


async def test_template_switch(b):
    print("Ganti template")
    page, errors = await fresh(b)
    await type_money(page, "#inGaji", "8000000")
    await page.click("#addPos")
    await page.wait_for_timeout(150)
    await page.fill(".pos:last-child .pname", "Kucing")
    await page.dispatch_event(".pos:last-child .pname", "input")
    await page.click("#tabCatat")
    await page.click('.cat[data-pos="k1"]')
    await page.click('.sub[data-item="k1b"]')
    await type_money(page, "#txAmt", "100000")
    await page.click("#txSubmit")
    await page.click('.cat[data-pos="k6"]')
    await type_money(page, "#txAmt", "30000")
    await page.click("#txSubmit")
    await page.wait_for_timeout(600)
    await page.click("#tabBagi")
    await page.click('.tpl button[data-tpl="umum"]')
    await page.click("#tplYes")
    await page.wait_for_timeout(600)
    names = await page.evaluate("[...document.querySelectorAll('.pos[data-id] .pname')].map(e => e.value)")
    check("amplop buatan sendiri tetap ada", "Kucing" in names, names)
    check("amplop Kuliah dipertahankan karena ada riwayat", "Kuliah" in names, names)
    await page.click("#tabCatat")
    hist = await text(page, "#txList")
    check("listrik dipindah ke amplop Umum", "Tempat tinggal › Listrik" in hist, hist)
    check("tidak ada 'Amplop terhapus'", "Amplop terhapus" not in hist, hist)
    check("tanpa galat skrip", not errors, errors)


async def test_layout(b):
    print("Tata letak")
    for scheme in ("light", "dark"):
        page, errors = await fresh(b, color_scheme=scheme)
        await type_money(page, "#inGaji", "8000000")
        for tab in ("#tabBagi", "#tabCatat"):
            await page.click(tab)
            await page.wait_for_timeout(200)
            width = await page.evaluate("document.documentElement.scrollWidth")
            check(f"{scheme} {tab}: tidak menggulir ke samping", width <= 390, width)
        check(f"{scheme}: tanpa galat skrip", not errors, errors)


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for t in (test_auto_split, test_debt_and_carry, test_weekly, test_custom_group, test_legacy_unlock, test_backup_reminder, test_frozen_plan, test_reconcile, test_priority, test_debt_payoff, test_simple_mode, test_edit_tx, test_template_switch, test_layout):
            await t(b)
        await b.close()
    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)} lulus, {len(failed)} gagal")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    asyncio.run(main())
