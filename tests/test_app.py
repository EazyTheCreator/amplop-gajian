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
    await page.click("#txForm button[type=submit]")
    await page.wait_for_timeout(700)
    check("sisa uang = gaji − utang − belanja", "6.930.000" in await text(page, "#sLeft"))
    await page.click("#tabBagi")
    await page.click("#nextM")
    await page.wait_for_timeout(700)
    check("sisa terbawa ke bulan berikutnya", "6.930.000" in await text(page, "#carryAmt"))
    check("utang ikut terbawa", (await page.input_value("#inUtang")) == "1.000.000")
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
        for t in (test_auto_split, test_debt_and_carry, test_weekly, test_custom_group, test_legacy_unlock, test_layout):
            await t(b)
        await b.close()
    failed = [r for r in results if not r[1]]
    print(f"\n{len(results) - len(failed)} lulus, {len(failed)} gagal")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    asyncio.run(main())
