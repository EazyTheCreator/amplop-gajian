(function(){
  "use strict";
  const $ = (s) => document.querySelector(s);
  const NF = new Intl.NumberFormat('id-ID');
  const fmt = (n) => NF.format(Math.round(Math.abs(n)));
  const rp = (n) => (n < 0 ? '−' : '') + 'Rp' + fmt(n);
  const digits = (s) => { const d = String(s).replace(/\D/g, '').slice(0, 15); return d ? parseInt(d, 10) : 0; };
  const pctParse = (s) => { const v = parseFloat(String(s).replace(',', '.')); return isFinite(v) ? Math.max(0, Math.min(100, v)) : 0; };
  const pctFmt = (v) => String(Math.round(v * 100) / 100).replace('.', ',');
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const PREVIEW_INCOME = 8000000;
  const LS_KEY = 'amplop-gajian-v1';
  /* ---------- Ikon kategori ---------- */
  const ICONS = {
    home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
    drop:'<path d="M12 2.5s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.7 12 2.5 12 2.5z"/>',
    pot:'<path d="M2.5 10h19"/><path d="M5 10v7a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7"/><path d="M9.5 6.5c0-1 1-1.5 1-2.5M14 6.5c0-1 1-1.5 1-2.5"/>',
    cart:'<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H6"/>',
    bowl:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M8 7.5c1.2-1.4 2.6-2 4-2s2.8.6 4 2"/>',
    bottle:'<path d="M10 2h4v4l2 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9l2-3z"/><path d="M8 13h8"/>',
    flame:'<path d="M12 22c4 0 7-2.8 7-7 0-4-3-6-4-9-1 2-2 3-3 3 0-2-1-4-2-6-2 3-5 6.5-5 12 0 4.2 3 7 7 7z"/>',
    utensils:'<path d="M7 2v20"/><path d="M4 2v6a3 3 0 0 0 6 0V2"/><path d="M18 22V2c-2.2 1-3.5 4-3.5 7.5S16 13 18 13"/>',
    bubbles:'<circle cx="9" cy="15" r="5"/><circle cx="17" cy="7" r="3"/><circle cx="18.5" cy="16.5" r="1.6"/>',
    washer:'<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><circle cx="12" cy="13" r="4.5"/><path d="M8 6h.01M11 6h.01"/>',
    bag:'<path d="M5.5 7h13l1 14h-15z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    bus:'<rect x="4" y="3" width="16" height="14" rx="3"/><path d="M4 11h16"/><path d="M7 17v3M17 17v3"/><path d="M8 14h.01M16 14h.01"/>',
    fuel:'<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h12"/><path d="M4 10h10"/><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-3-3"/>',
    car:'<path d="M5 17h14v-4l-2.2-5.2A1.5 1.5 0 0 0 15.4 7H8.6a1.5 1.5 0 0 0-1.4.8L5 13z"/><path d="M3.5 13h17"/><circle cx="8" cy="17.5" r="1.8"/><circle cx="16" cy="17.5" r="1.8"/>',
    parking:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>',
    wifi:'<path d="M2 8.5a15 15 0 0 1 20 0"/><path d="M5.5 12a10 10 0 0 1 13 0"/><path d="M9 15.5a5 5 0 0 1 6 0"/><path d="M12 19h.01"/>',
    phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    play:'<rect x="2.5" y="4" width="19" height="14" rx="3"/><path d="M10 8.5v5l4.5-2.5z"/><path d="M8 21h8"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h4"/>',
    receipt:'<path d="M5 2h14v20l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    book:'<path d="M4 19V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/>',
    cap:'<path d="M2 9 12 4l10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v5"/>',
    tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1"/>',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
    health:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/>',
    pill:'<path d="M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7z"/><path d="m7 7 7 7"/>',
    piggy:'<path d="M5 11a7 6 0 0 1 12.2-3.8L20 6v4l1.5 1v3H19.5a7 6 0 0 1-2.5 3v3h-3v-2h-4v2H7v-3.2A6 6 0 0 1 5 11z"/><path d="M15.5 10.5h.01"/><path d="M5 11H3.5"/>',
    shield:'<path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    game:'<rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10.5v4M5 12.5h4"/><path d="M15.5 12h.01M18 13.5h.01"/>',
    heart:'<path d="M12 20.5s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.1c0 5.8-8 10.4-8 10.4z"/>',
    wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><path d="M16 14.5h.01"/>',
    dots:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
  };
  // Urutan penting: aturan yang lebih spesifik ditaruh lebih dulu.
  const ICON_RULES = [
    [/internet|wifi/, 'wifi'], [/pulsa|kuota|\bhp\b/, 'phone'], [/tagihan/, 'receipt'],
    [/langganan|netflix|spotify|streaming/, 'play'], [/cicilan|kredit|paylater|utang|hutang/, 'card'],
    [/listrik|token|pln/, 'bolt'], [/galon|\bair\b|pdam|minum/, 'drop'], [/\bgas\b|lpg/, 'flame'],
    [/sabun|sampo|mandi|perawatan|skincare/, 'bubbles'], [/laundry|cuci|deterjen|kebersihan/, 'washer'],
    [/bpjs|asuransi/, 'health'], [/obat|periksa|dokter/, 'pill'], [/kesehatan/, 'health'],
    [/sewa|kost|kos\b|kpr|rumah|kontrak|tempat tinggal/, 'home'],
    [/dapur/, 'pot'], [/beras/, 'bowl'], [/bumbu|minyak/, 'bottle'],
    [/makan di luar|jajan|kafe|kopi|resto/, 'utensils'], [/lauk|sayur|belanja|pasar/, 'cart'], [/makan/, 'utensils'],
    [/ongkos|krl|ojek|ojol|transport|\bbus\b|kereta/, 'bus'], [/bensin|bbm/, 'fuel'],
    [/servis|pajak|kendaraan|motor|mobil/, 'car'], [/parkir|tol\b/, 'parking'],
    [/fotokopi|cetak|buku/, 'book'], [/kuliah|kampus|sekolah|pendidikan|kursus/, 'cap'],
    [/iuran|kegiatan|organisasi/, 'tag'], [/keluarga|orang tua|ortu|kiriman|anak/, 'users'],
    [/darurat/, 'shield'], [/tabung|invest|saham|reksa/, 'piggy'],
    [/hiburan|gaya hidup|nonton|game|liburan/, 'game'], [/sedekah|donasi|zakat|infak|amal/, 'heart'],
    [/harian/, 'bag']
  ];
  function iconKey(p, x){
    const n = String((x ? x.name : p && p.name) || '').toLowerCase();
    for (const [re, k] of ICON_RULES) if (re.test(n)) return k;
    return x ? iconKey(p) : 'wallet';
  }
  function icoEl(key, c, size){
    const s = document.createElement('span');
    s.className = 'ico' + (size ? ' ' + size : '');
    if (c) s.style.setProperty('--tone', 'var(--c' + c + ')');
    s.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[key] || ICONS.wallet) + '</svg>';
    return s;
  }
  const rpShort = (n) => {
    const a = Math.abs(n), s = n < 0 ? '−' : '';
    if (a >= 1e6) return s + 'Rp' + String(Math.round(a / 1e5) / 10).replace('.', ',') + 'jt';
    if (a >= 1e3) return s + 'Rp' + Math.round(a / 1e3) + 'rb';
    return s + 'Rp' + a;
  };

  // Template versi pertama; jika belum pernah diubah, otomatis diganti template anak kost.
  const OLD_DEFAULT = [
    ['p1','Kebutuhan pokok',35],['p2','Tagihan & cicilan',15],['p3','Transportasi',10],['p4','Tabungan',10],
    ['p5','Dana darurat',10],['p6','Investasi',5],['p7','Gaya hidup',10],['p8','Sedekah & donasi',5]
  ];
  const it = (id, name, value) => ({ id, name, value });
  const KOST_POS = [
    {id:'k1', name:'Tempat tinggal', type:'rinci', value:0, c:1, items:[
      it('k1a','Sewa kost',1500000), it('k1b','Token listrik',200000), it('k1c','Air minum galon',60000)]},
    {id:'k2', name:'Dapur & makan', type:'rinci', value:0, c:3, items:[
      it('k2a','Belanja lauk & sayur',700000), it('k2b','Beras',120000), it('k2c','Bumbu & minyak goreng',80000),
      it('k2d','Gas LPG',45000), it('k2e','Makan di luar & jajan',300000)]},
    {id:'k3', name:'Kebutuhan harian', type:'rinci', value:0, c:5, items:[
      it('k3a','Sabun, sampo & perawatan diri',100000), it('k3b','Deterjen & kebersihan kamar',50000), it('k3c','Laundry',80000)]},
    {id:'k4', name:'Transportasi', type:'rinci', value:0, c:2, items:[
      it('k4a','Ongkos harian (KRL, ojek daring, bensin)',400000)]},
    {id:'k5', name:'Tagihan & langganan', type:'rinci', value:0, c:6, items:[
      it('k5a','Pulsa & kuota internet',100000), it('k5b','Langganan aplikasi',50000)]},
    {id:'k6', name:'Kuliah', type:'rinci', value:0, c:4, items:[
      it('k6a','Fotokopi, cetak & buku',150000), it('k6b','Kegiatan & iuran',50000)]},
    {id:'k7', name:'Tabungan', type:'pct', value:10, c:8, items:[]},
    {id:'k8', name:'Dana darurat', type:'pct', value:5, c:7, items:[]},
    {id:'k9', name:'Hiburan & gaya hidup', type:'pct', value:5, c:9, items:[]},
    {id:'k10', name:'Sedekah & donasi', type:'pct', value:2.5, c:10, items:[]}
  ];
  // Acuan persentase acuan per amplop template (persen dari total pemasukan).
  const IDEAL = {
    k1:{g:'need', min:20, max:30, t:25}, k2:{g:'need', min:10, max:20, t:15}, k3:{g:'need', min:3, max:5, t:4},
    k4:{g:'need', min:5, max:10, t:6},  k5:{g:'need', min:2, max:5, t:4},   k6:{g:'need', min:2, max:5, t:4},
    k7:{g:'save', min:10, max:null, t:15}, k8:{g:'save', min:5, max:10, t:7},
    k9:{g:'want', min:null, max:15, t:15}, k10:{g:'give', min:2.5, max:5, t:5}
  };
  const GROUPS = [
    {g:'need', name:'Kebutuhan pokok', sub:'tempat tinggal, makan, harian, transportasi, tagihan, dan sejenisnya', min:null, max:60},
    {g:'save', name:'Tabungan & dana darurat', sub:'disisihkan pertama saat gajian', min:20, max:null},
    {g:'want', name:'Hiburan & gaya hidup', sub:'', min:null, max:15},
    {g:'give', name:'Sedekah & donasi', sub:'', min:2.5, max:null}
  ];
  // Penyesuaian acuan untuk gaji mingguan: dana darurat lebih besar, hiburan lebih ketat.
  const WEEKLY_ADJ = { k8:{min:7, max:12, t:10}, u9:{min:7, max:12, t:10}, k9:{max:12, t:12}, u10:{max:12, t:12} };
  const GROUP_DEF = { need:5, save:5, want:5, give:2.5 };
  // Acuan untuk amplop buatan sendiri yang diberi kelompok: kebutuhan & keinginan sebagai batas maksimal,
  // tabungan & sosial sebagai batas minimal (dikurangi paling jauh hingga separuhnya sebelum tahap akhir).
  function customIdeal(p){
    const t = p.t > 0 ? p.t : GROUP_DEF[p.g];
    return (p.g === 'save' || p.g === 'give') ? { g:p.g, t, min:t, max:null, floor:t / 2, custom:true } : { g:p.g, t, min:null, max:t, custom:true };
  }
  function idealOf(id){
    const r = IDEAL[id];
    if (!r) { const p = typeof settings !== 'undefined' ? settings.pos.find(x => x.id === id) : null; return p && p.g ? customIdeal(p) : null; }
    return (typeof settings !== 'undefined' && settings.freq === 'minggu' && WEEKLY_ADJ[id]) ? Object.assign({}, r, WEEKLY_ADJ[id]) : r;
  }
  const rangeText = (r) => r.min != null && r.max != null ? pctFmt(r.min) + '–' + pctFmt(r.max) + '%' : r.min != null ? 'min. ' + pctFmt(r.min) + '%' : 'maks. ' + pctFmt(r.max) + '%';
  // Hasil: [kelas tag, teks tag]; tabungan di bawah minimum dianggap perlu perhatian, kebutuhan di bawah rentang dianggap hemat.
  function judge(share, r, g){
    const tol = 0.25;
    if (r.max != null && share > r.max + tol) return g === 'save' || g === 'give' ? ['ok', 'Di atas acuan'] : ['warn', 'Melebihi acuan'];
    if (r.min != null && share < r.min - tol) return g === 'need' ? ['low', 'Lebih hemat'] : ['warn', 'Kurang dari acuan'];
    return ['ok', 'Sesuai'];
  }
  const round5k = (n) => Math.round(n / 5000) * 5000;
  // Porsi ideal tiap rincian di dalam amplopnya (persen dari pagu amplop).
  const ITEM_SHARE = {
    k1a:85, k1b:11, k1c:4,
    k2a:55, k2b:10, k2c:8, k2d:4, k2e:23,
    k3a:45, k3b:20, k3c:35,
    k4a:100,
    k5a:60, k5b:40,
    k6a:70, k6b:30
  };
  const ITEM_NOTE = {};

  const UMUM_POS = [
    {id:'u1', name:'Tempat tinggal', type:'rinci', value:0, c:1, items:[
      it('u1a','Sewa, KPR, atau kontribusi rumah',1040000), it('u1b','Listrik',240000), it('u1c','Air (PDAM)',80000),
      it('u1d','Internet rumah',160000), it('u1e','Iuran lingkungan (RT, keamanan, sampah)',80000)]},
    {id:'u2', name:'Makan & dapur', type:'rinci', value:0, c:3, items:[
      it('u2a','Belanja dapur',840000), it('u2b','Makan di luar & jajan',360000)]},
    {id:'u3', name:'Kebutuhan harian', type:'rinci', value:0, c:5, items:[
      it('u3a','Perlengkapan mandi & rumah tangga',190000), it('u3b','Perawatan diri',130000)]},
    {id:'u4', name:'Transportasi', type:'rinci', value:0, c:2, items:[
      it('u4a','Bensin & ongkos harian',385000), it('u4b','Parkir & tol',95000), it('u4c','Servis & pajak kendaraan',160000)]},
    {id:'u5', name:'Tagihan & langganan', type:'rinci', value:0, c:6, items:[
      it('u5a','Pulsa & kuota',145000), it('u5b','Langganan aplikasi',95000)]},
    {id:'u6', name:'Kesehatan', type:'rinci', value:0, c:4, items:[
      it('u6a','Iuran BPJS atau asuransi',145000), it('u6b','Obat & pemeriksaan',95000)]},
    {id:'u7', name:'Keluarga & orang tua', type:'rinci', value:0, c:9, items:[
      it('u7a','Kiriman untuk orang tua atau keluarga',400000)]},
    {id:'u8', name:'Tabungan & investasi', type:'pct', value:15, c:8, items:[]},
    {id:'u9', name:'Dana darurat', type:'pct', value:7, c:7, items:[]},
    {id:'u10', name:'Hiburan & gaya hidup', type:'pct', value:15, c:10, items:[]},
    {id:'u11', name:'Sedekah & donasi', type:'pct', value:5, c:1, items:[]}
  ];
  Object.assign(IDEAL, {
    u1:{g:'need', min:15, max:30, t:20}, u2:{g:'need', min:10, max:20, t:15}, u3:{g:'need', min:3, max:6, t:4},
    u4:{g:'need', min:5, max:12, t:8},  u5:{g:'need', min:2, max:5, t:3},   u6:{g:'need', min:2, max:5, t:3},
    u7:{g:'need', min:null, max:10, t:5},
    u8:{g:'save', min:10, max:null, t:15}, u9:{g:'save', min:5, max:10, t:7},
    u10:{g:'want', min:null, max:15, t:15}, u11:{g:'give', min:2.5, max:5, t:5}
  });
  Object.assign(ITEM_SHARE, {
    u1a:65, u1b:15, u1c:5, u1d:10, u1e:5,
    u2a:70, u2b:30,
    u3a:60, u3b:40,
    u4a:60, u4b:15, u4c:25,
    u5a:60, u5b:40,
    u6a:60, u6b:40,
    u7a:100
  });
  const DEFAULT_VAL = {};
  KOST_POS.concat(UMUM_POS).forEach(p => (p.items || []).forEach(x => { DEFAULT_VAL[x.id] = x.value; }));
  const TEMPLATES = { kost:{ name:'Anak kost', pos:KOST_POS }, umum:{ name:'Umum', pos:UMUM_POS } };

  const isOldDefault = (pos) => Array.isArray(pos) && pos.length === OLD_DEFAULT.length &&
    pos.every((p, i) => p && p.id === OLD_DEFAULT[i][0] && p.name === OLD_DEFAULT[i][1] && p.type === 'pct' && Number(p.value) === OLD_DEFAULT[i][2]);

  function normSettings(d){
    d = d || {};
    let pos = Array.isArray(d.pos) ? d.pos : clone(KOST_POS);
    if (isOldDefault(pos)) pos = clone(KOST_POS);
    // Rincian "Cicilan (jika ada)" versi lama dipindahkan ke kolom utang.
    let movedDebt = 0;
    pos = pos.map(p => (p && Array.isArray(p.items)) ? Object.assign({}, p, { items: p.items.filter(x => {
      if (x && (x.id === 'k5c' || x.id === 'u5c')) { movedDebt += Number(x.value) || 0; return false; }
      return true;
    }) }) : p);
    // Data dari versi sebelum pembagian otomatis: semua amplop dan rincian template dibuka kuncinya sekali.
    const legacy = Array.isArray(d.pos) && !(Number(d.autoV) >= 2);
    const tpl = d.tpl === 'umum' || d.tpl === 'kost' ? d.tpl : (pos.some(p => /^u\d+$/.test(String(p && p.id))) ? 'umum' : 'kost');
    return {
      tpl,
      freq: d.freq === 'minggu' ? 'minggu' : 'bulan',
      payday: Number.isInteger(Number(d.payday)) && Number(d.payday) >= 0 && Number(d.payday) <= 6 && d.payday !== null && d.payday !== undefined && d.payday !== '' ? Number(d.payday) : 5,
      pos: pos.map(p => ({
        id:String(p.id), name:String(p.name ?? ''),
        type: p.type === 'fix' || p.type === 'rinci' ? p.type : 'pct',
        value: Number(p.value) || 0,
        c: ((Number(p.c) || 1) - 1) % 10 + 1,
        items: (Array.isArray(p.items) ? p.items : []).map(x => ({ id:String(x.id), name:String(x.name ?? ''), value: Number(x.value) || 0,
          m: legacy ? false : !!x.m })),
        pagu: Number(p.pagu) || 0,
        m: legacy ? false : !!p.m,
        g: ['need', 'save', 'want', 'give'].includes(p.g) ? p.g : '',
        t: Math.max(0, Math.min(100, Number(p.t) || 0))
      })),
      lastIncome: Number(d.lastIncome) || 0,
      auto: legacy ? true : d.auto !== false,
      prio: d.prio === 'need' ? 'need' : 'save',
      carryMode: d.carryMode === 'split' ? 'split' : 'save',
      autoV: 2,
      lastUtang: d.lastUtang !== undefined && d.lastUtang !== null ? (Number(d.lastUtang) || 0) : movedDebt,
      lastWeekly: Number(d.lastWeekly) || 0
    };
  }
  function normMonth(d){
    d = d || {};
    return {
      gaji: Number(d.gaji) || 0,
      lain: Number(d.lain) || 0,
      utang: d.utang === undefined || d.utang === null || d.utang === '' ? null : Math.max(0, Number(d.utang) || 0),
      gajiMinggu: Number(d.gajiMinggu) || 0,
      plan: d.plan && typeof d.plan === 'object' ? d.plan : null,
      minggu: Math.max(0, Math.min(6, Number(d.minggu) || 0)),
      tx: (Array.isArray(d.tx) ? d.tx : []).map(t => ({ id:String(t.id), date:String(t.date || ''), posId:String(t.posId || ''), itemId:String(t.itemId || ''), desc:String(t.desc || ''), amt: Number(t.amt) || 0 }))
    };
  }

  const today = new Date();
  const keyOf = (y, m) => y + '-' + String(m).padStart(2, '0');
  let curY = today.getFullYear(), curM = today.getMonth() + 1;
  let curKey = keyOf(curY, curM);

  let settings = normSettings(null);   // rencana yang sedang ditampilkan
  let globalS = settings;              // rencana berjalan (untuk bulan ini dan seterusnya)
  let frozen = false;                  // true bila bulan yang dibuka memakai rencana yang dibekukan
  let month = normMonth(null);
  let localAll = { settings: null, months: {} };
  const realKey = keyOf(today.getFullYear(), today.getMonth() + 1);

  /* ---------- Rencana per bulan ---------- */
  // Bagian pengaturan yang menjadi "rencana" sebuah bulan; dibekukan saat bulan itu sudah lewat.
  const PLAN_KEYS = ['tpl', 'freq', 'payday', 'auto', 'pos'];
  const pickPlan = (src) => { const o = {}; PLAN_KEYS.forEach(k => { o[k] = clone(src[k]); }); return o; };
  const monthHasData = (m) => !!(m && (m.gaji || m.lain || m.gajiMinggu || (m.tx && m.tx.length)));
  // Bekukan rencana bulan-bulan yang sudah lewat dan berisi data, memakai rencana berjalan saat ini.
  function freezePast(){
    let changed = false;
    Object.keys(localAll.months || {}).forEach(k => {
      const m = localAll.months[k];
      if (k < realKey && monthHasData(m) && !m.plan) { m.plan = pickPlan(globalS); changed = true; }
    });
    if (changed) { try { localStorage.setItem(LS_KEY, JSON.stringify(Object.assign({}, localAll, { settings: clone(globalS) }))); } catch (e) {} }
  }
  // Pilih rencana yang berlaku untuk bulan yang sedang dibuka.
  function activatePlan(){
    if (curKey < realKey && monthHasData(month) && !month.plan) month.plan = pickPlan(globalS);
    if (month.plan) {
      settings = normSettings(Object.assign({}, clone(globalS), clone(month.plan), { autoV: 2 }));
      frozen = true;
    } else { settings = globalS; frozen = false; }
  }

  /* ---------- Penyimpanan ---------- */
  function readLocal(){
    try { const raw = localStorage.getItem(LS_KEY); if (raw) { const o = JSON.parse(raw); localAll = { settings: o.settings || null, months: o.months || {} }; } } catch (e) {}
  }
  function writeLocal(){
    if (month.utang === null) month.utang = utangNow();
    if (frozen) {
      month.plan = pickPlan(settings);
      ['lastIncome', 'lastUtang', 'lastWeekly'].forEach(k => { globalS[k] = settings[k]; });
    } else globalS = settings;
    localAll.settings = clone(globalS);
    localAll.months[curKey] = clone(month);
    try { localStorage.setItem(LS_KEY, JSON.stringify(localAll)); setStatus('local'); if (typeof askPersist === 'function' && hasData()) askPersist(); }
    catch (e) { setStatus('err'); }
  }
  function setStatus(s){
    const el = $('#status');
    const text = { init:'Menyiapkan penyimpanan…', local:'Tersimpan otomatis di perangkat ini', err:'Gagal menyimpan. Penyimpanan peramban penuh atau diblokir; unduh cadangan sekarang.' };
    el.dataset.s = s; el.textContent = text[s] || '';
  }

  // Simpan dengan jeda singkat agar ketikan beruntun tidak menulis berkali-kali.
  const timers = {}, dirty = { settings:false, month:false };
  function schedule(which){
    dirty[which] = true;
    clearTimeout(timers[which]);
    timers[which] = setTimeout(() => flush(which), 400);
  }
  function flush(which){
    clearTimeout(timers[which]); timers[which] = null;
    if (!dirty[which]) return;
    writeLocal(); dirty[which] = false;
  }
  const saveSettings = () => schedule('settings');
  const saveMonth = () => schedule('month');

  /* ---------- Perhitungan ---------- */
  let curCarry = 0;
  const income = () => month.gaji + month.lain + curCarry;
  const utangNow = () => month.utang !== null ? month.utang : (settings.lastUtang || 0);
  // Sisa bulan lalu masuk amplop tabungan (bawaan) atau ikut dibagi seperti pemasukan biasa.
  function carrySaveId(){
    if (settings.carryMode === 'split' || !curCarry) return null;
    const p = settings.pos.find(x => (x.id === 'k7' || x.id === 'u8') && x.type !== 'rinci')
      || settings.pos.find(x => x.type !== 'rinci' && idealOf(x.id) && idealOf(x.id).g === 'save');
    return p ? p.id : null;
  }
  // Bagian sisa bulan lalu yang disisihkan ke tabungan (setelah utang dibayar).
  const carryReserve = (inc) => carrySaveId() ? Math.min(curCarry, Math.max(0, inc - utangNow())) : 0;
  const netOf = (inc) => Math.max(0, inc - utangNow() - carryReserve(inc));
  // Sisa uang yang terbawa ke bulan `k` dari bulan-bulan sebelumnya (hanya yang positif).
  const prevKeyOf = (k) => { let [y, m] = k.split('-').map(Number); m--; if (m < 1) { m = 12; y--; } return keyOf(y, m); };
  function carryInto(k){
    const keys = Object.keys(localAll.months || {}).filter(x => /^\d{4}-\d{2}$/.test(x)).sort();
    if (!keys.length) return 0;
    const first = keys[0];
    const chain = []; let pk = prevKeyOf(k);
    while (pk >= first && chain.length < 240) { chain.unshift(pk); pk = prevKeyOf(pk); }
    let carry = 0;
    chain.forEach(key => {
      const raw = key === curKey ? month : localAll.months[key];
      if (!raw) return;
      const d = normMonth(raw);
      const spentM = d.tx.reduce((s, t) => s + t.amt, 0);
      if (!d.gaji && !d.lain && !spentM && !d.utang) return;
      carry = Math.max(0, d.gaji + d.lain + carry - (d.utang || 0) - spentM);
    });
    return carry;
  }
  const baseIncome = () => income() || PREVIEW_INCOME;
  const itemsSum = (p) => p.items.reduce((s, x) => s + x.value, 0);
  const manualEnvAmt = (p, inc) => p.type === 'fix' ? p.value : p.type === 'rinci' ? itemsSum(p) : Math.round(netOf(inc) * p.value / 100);
  const isAuto = () => settings.auto !== false;
  const isAutoItem = (p, x) => isAuto() && !!idealOf(p.id) && !x.m && !!ITEM_SHARE[x.id];
  const isAutoEnv = (p) => isAuto() && !!idealOf(p.id) && p.type !== 'rinci' && !p.m;
  const itemAmt = (p, x, inc) => isAutoItem(p, x) ? (plan(inc).item[x.id] || 0) : x.value;
  const allocOf = (p, inc) => {
    if (p.type === 'rinci') return p.items.reduce((s, x) => s + itemAmt(p, x, inc), 0);
    const extra = p.id === carrySaveId() ? carryReserve(inc) : 0;
    return extra + (isAutoEnv(p) ? (plan(inc).env[p.id] || 0) : manualEnvAmt(p, inc));
  };
  // Rincian yang dianggap keinginan: dikurangi paling awal saat uang tidak cukup.
  const WANT_ITEMS = new Set(['k2e', 'u2b', 'k5b', 'u5b']);
  let planCache = { key:'', val:null };
  // Pembagian otomatis: nominal yang diisi sendiri dikunci, sisanya dibagi menurut acuan umum,
  // lalu dikurangi bertahap bila tidak cukup atau ditambahkan ke tabungan bila berlebih.
  function plan(inc){
    const key = [inc, utangNow(), settings.freq, settings.prio, settings.carryMode, curCarry, JSON.stringify(settings.pos)].join('|');
    if (planCache.key === key) return planCache.val;
    const B = netOf(inc), parts = [];
    let manual = 0;
    settings.pos.forEach(p => {
      const r = idealOf(p.id);
      if (!r) { manual += manualEnvAmt(p, inc); return; }
      if (p.type === 'rinci') {
        const tot = p.items.filter(x => ITEM_SHARE[x.id]).reduce((s, x) => s + ITEM_SHARE[x.id], 0);
        p.items.forEach(x => {
          if (x.m || !ITEM_SHARE[x.id] || !tot) { manual += x.value; return; }
          parts.push({ kind:'item', id:x.id, pid:p.id, name:x.name || p.name, g:r.g, want: WANT_ITEMS.has(x.id), w: r.t * ITEM_SHARE[x.id] / tot, min:0 });
        });
      } else if (p.m) manual += manualEnvAmt(p, inc);
      else parts.push({ kind:'env', id:p.id, pid:p.id, name:p.name, g:r.g, want: r.g === 'want', w: r.t, min: r.floor != null ? r.floor : (r.min || 0) });
    });
    parts.forEach(x => { x.target = B * x.w / 100; x.amt = x.target; });
    const avail = B - manual;
    let gap = parts.reduce((s, x) => s + x.amt, 0) - avail, deficit = 0;
    if (gap > 0) {
      // Urutan pengurangan mengikuti pilihan pengguna:
      // 'save' = tabungan diutamakan (kebutuhan fleksibel dihemat dulu),
      // 'need' = kebutuhan pokok diutamakan (tabungan turun ke batas minimal dulu).
      const needSoft = x => (x.g === 'need' && !x.want) ? x.target * 0.85 : null;
      const giveMin = x => x.g === 'give' ? B * x.min / 100 : null;
      const saveMin = x => x.g === 'save' ? B * x.min / 100 : null;
      const tiers = (settings.prio === 'need'
        ? [x => x.want ? 0 : null, giveMin, saveMin, needSoft]
        : [x => x.want ? 0 : null, needSoft, giveMin, saveMin]
      ).concat([
        x => (x.g === 'need' && !x.want) ? x.target * 0.7 : null,
        x => (x.g === 'save' || x.g === 'give') ? 0 : null,
        () => 0
      ]);
      for (const floorOf of tiers) {
        if (gap <= 0) break;
        const sel = parts.map(x => [x, floorOf(x)]).filter(([x, f]) => f !== null && x.amt > f);
        const cap = sel.reduce((s, [x, f]) => s + (x.amt - f), 0);
        if (cap <= 0) continue;
        const take = Math.min(gap, cap);
        sel.forEach(([x, f]) => { x.amt -= (x.amt - f) * take / cap; });
        gap -= take;
      }
      deficit = Math.max(0, gap);
    } else if (gap < 0 && parts.length) {
      const pool = parts.some(x => x.g === 'save') ? parts.filter(x => x.g === 'save') : parts;
      const tw = pool.reduce((s, x) => s + x.w, 0);
      pool.forEach(x => { x.amt += (-gap) * x.w / tw; });
    }
    parts.forEach(x => { x.pre = x.amt; x.amt = Math.max(0, round5k(x.amt)); });
    if (parts.length && avail > 0 && !deficit) {
      const diff = avail - parts.reduce((s, x) => s + x.amt, 0);
      if (diff) {
        const pool = parts.filter(x => x.g === 'save' && x.amt + diff >= 0);
        const big = (pool.length ? pool : parts).reduce((a, b) => b.amt > a.amt ? b : a);
        big.amt = Math.max(0, big.amt + diff);
      }
    }
    const env = {}, item = {}, target = {}, cuts = [];
    parts.forEach(x => {
      (x.kind === 'env' ? env : item)[x.id] = x.amt;
      target[x.id] = round5k(x.target);
      // Hanya pengurangan sungguhan yang dilaporkan, bukan selisih pembulatan.
      if (x.target - x.pre >= 5000) cuts.push({ id:x.id, name:x.name, by: round5k(x.target - x.pre) });
    });
    planCache = { key, val: { env, item, target, cuts, deficit: Math.max(deficit, manual - B > 0 ? manual - B : 0), manual, B } };
    return planCache.val;
  }
  function paydaysIn(y, m, wd){
    const last = new Date(y, m, 0).getDate(); let n = 0;
    for (let d = 1; d <= last; d++) if (new Date(y, m - 1, d).getDay() === wd) n++;
    return n;
  }
  const isWeekly = () => settings.freq === 'minggu';
  const weeksNow = () => month.minggu || paydaysIn(curY, curM, settings.payday);
  function syncWeekly(){ if (isWeekly() && month.gajiMinggu) month.gaji = month.gajiMinggu * weeksNow(); }
  // Bulan yang dulu diisi dengan skema bulanan: turunkan gaji per minggu sebelum jumlah gajian diubah.
  function ensureWeekly(){ if (isWeekly() && !month.gajiMinggu && month.gaji) month.gajiMinggu = Math.round(month.gaji / weeksNow() / 1000) * 1000; }
  const weeklyAmt = () => month.gajiMinggu || (month.gaji ? Math.round(month.gaji / weeksNow()) : 0);
  const totalAlloc = (inc) => utangNow() + settings.pos.reduce((s, p) => s + allocOf(p, inc), 0);
  const idealBudget = (p, inc) => idealOf(p.id) ? round5k(netOf(inc) * idealOf(p.id).t / 100) : 0;
  const paguOf = (p, inc) => (Number(p.pagu) > 0 ? Number(p.pagu) : idealBudget(p, inc));
  // Saran per rincian: pagu dikurangi rincian tanpa acuan (mis. cicilan), lalu dibagi menurut porsi ideal.
  function itemSuggestions(p, inc){
    const out = {};
    const shared = p.items.filter(x => ITEM_SHARE[x.id]);
    const tot = shared.reduce((s, x) => s + ITEM_SHARE[x.id], 0);
    const fixedOthers = p.items.filter(x => !ITEM_SHARE[x.id]).reduce((s, x) => s + x.value, 0);
    const basis = Math.max(0, paguOf(p, inc) - fixedOthers);
    if (!basis || !tot) return out;
    shared.forEach(x => { out[x.id] = round5k(basis * ITEM_SHARE[x.id] / tot); });
    const diff = basis - shared.reduce((s, x) => s + out[x.id], 0);
    if (diff) { const big = shared.reduce((a, b) => out[b.id] > out[a.id] ? b : a); out[big.id] = Math.max(0, out[big.id] + diff); }
    return out;
  }
  const spentBy = () => { const m = {}; month.tx.forEach(t => { m[t.posId] = (m[t.posId] || 0) + t.amt; const k = t.posId + '|' + t.itemId; m[k] = (m[k] || 0) + t.amt; }); return m; };
  const totalSpent = () => month.tx.reduce((s, t) => s + t.amt, 0);
  const posName = (id) => { const p = settings.pos.find(x => x.id === id); return p ? (p.name || 'Tanpa nama') : 'Amplop terhapus'; };
  const ADJ = '__adj';   // transaksi koreksi hasil pencocokan saldo
  const txLabel = (t) => {
    if (t.posId === ADJ) return 'Koreksi saldo';
    const p = settings.pos.find(x => x.id === t.posId);
    if (!p) return 'Amplop terhapus';
    const i = t.itemId && p.items.find(x => x.id === t.itemId);
    return (p.name || 'Tanpa nama') + (i ? ' › ' + (i.name || 'Tanpa nama') : '');
  };
  const posColor = (id) => { const p = settings.pos.find(x => x.id === id); return p ? 'var(--c' + p.c + ')' : 'var(--muted)'; };
  const monthLabel = () => new Intl.DateTimeFormat('id-ID', { month:'long', year:'numeric' }).format(new Date(curY, curM - 1, 1));

  /* ---------- Render ---------- */
  const reduceMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Memutar animasi "mengalir dari bawah" untuk isi sebuah wadah, sekali saja.
  function flow(el){
    if (!el || reduceMotion()) return;
    clearTimeout(el._flowT);
    el.classList.remove('flow');
    [...el.children].forEach((c, i) => c.style.setProperty('--i', String(Math.min(i, 12))));
    void el.offsetWidth;
    el.classList.add('flow');
    el._flowT = setTimeout(() => el.classList.remove('flow'), 1400);
  }
  let shownLeft = null, leftRaf = 0;
  function animateLeft(target){
    const el = $('#sLeft');
    if (shownLeft === null || reduceMotion()) { shownLeft = target; el.textContent = rp(target); return; }
    const from = shownLeft, t0 = performance.now(), dur = 500;
    cancelAnimationFrame(leftRaf);
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      shownLeft = Math.round(from + (target - from) * e);
      el.textContent = rp(shownLeft);
      if (k < 1) leftRaf = requestAnimationFrame(step);
    };
    leftRaf = requestAnimationFrame(step);
  }
  function renderSummary(){
    const inc = income(), out = totalSpent() + utangNow();
    $('#sIn').textContent = rp(inc);
    $('#sOut').textContent = rp(out);
    const left = $('#sLeft'); animateLeft(inc - out); left.classList.toggle('neg', inc - out < 0);
    const ratio = inc ? out / inc : 0, C = 2 * Math.PI * 48, fg = $('#ringFg');
    fg.style.strokeDasharray = String(C); fg.style.strokeDashoffset = String(C * (1 - Math.min(1, ratio)));
    $('#ringPct').textContent = inc ? Math.round(ratio * 100) + '%' : '–';
    $('#ring').classList.toggle('over', ratio > 1);
    $('#ring').setAttribute('aria-label', inc ? Math.round(ratio * 100) + '% pemasukan sudah terpakai' : 'Belum ada pemasukan');
  }

  function renderBagi(){
    const g = $('#inGaji'), l = $('#inLain');
    const wk = isWeekly(), gv = wk ? weeklyAmt() : month.gaji;
    if (document.activeElement !== g) g.value = gv ? fmt(gv) : '';
    $('#gajiLblText').textContent = wk ? 'Gaji per minggu' : 'Gaji bulan ini';
    const uin = $('#inUtang'); if (document.activeElement !== uin) { const u = utangNow(); uin.value = u ? fmt(u) : ''; }
    const fq = $('#freq'); fq.dataset.f = settings.freq;
    fq.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === settings.freq)));
    $('#weeklyBox').hidden = !wk;
    if (wk) $('#payday').value = String(settings.payday);
    if (document.activeElement !== l) l.value = month.lain ? fmt(month.lain) : '';
    document.querySelectorAll('.tpl button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tpl === settings.tpl)));
    const list = $('#posList');
    list.textContent = '';
    if (!settings.pos.length) {
      const p = document.createElement('p'); p.className = 'empty';
      p.textContent = 'Belum ada amplop. Tambahkan amplop pertama, misalnya Kebutuhan pokok atau Tabungan.';
      list.appendChild(p);
    }
    settings.pos.forEach(p => {
      const li = document.createElement('li'); li.className = 'pos'; li.dataset.id = p.id;
      li.innerHTML =
        '<input class="pname" aria-label="Nama amplop" autocomplete="off">' +
        '<div class="pval"><div class="seg" role="group" aria-label="Cara membagi">' +
          '<button type="button" data-t="pct">%</button><button type="button" data-t="fix">Rp</button><button type="button" data-t="rinci">Rinci</button></div>' +
          '<input class="pnum" autocomplete="off"><span class="pfrom" hidden>jumlah rincian</span></div>' +
        '<output class="pamt num"></output>' +
        '<button type="button" class="pdel">Hapus</button>' +
        '<div class="pideal"></div>' +
        '<ul class="items"></ul>';
      li.prepend(icoEl(iconKey(p), p.c));
      if (!IDEAL[p.id]) {
        const gp = document.createElement('div'); gp.className = 'pgrp';
        gp.innerHTML = '<select class="pg-sel" aria-label="Kelompok amplop">' +
          '<option value="">Pilih kelompok agar ikut otomatis</option><option value="need">Kebutuhan</option>' +
          '<option value="save">Tabungan</option><option value="want">Keinginan</option><option value="give">Sosial / donasi</option></select>' +
          '<label>Acuan <input class="pg-t" inputmode="decimal" autocomplete="off">%</label>';
        gp.querySelector('.pg-sel').value = p.g;
        const lab = gp.querySelector('label'); lab.hidden = !p.g;
        const t = gp.querySelector('.pg-t'); t.id = 'pgt-' + p.id; t.value = p.g ? pctFmt(p.t > 0 ? p.t : GROUP_DEF[p.g]) : '';
        li.appendChild(gp);
      }
      const nm = li.querySelector('.pname'); nm.value = p.name; nm.id = 'pname-' + p.id;
      li.querySelectorAll('.seg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === p.type)));
      const num = li.querySelector('.pnum'); num.id = 'pnum-' + p.id;
      if (p.type === 'rinci') {
        num.hidden = true; li.querySelector('.pfrom').hidden = false;
        const ul = li.querySelector('.items');
        const pg = document.createElement('li'); pg.className = 'pagu';
        pg.innerHTML = '<div class="pagu-line"><label>Pagu amplop</label><div class="ival"><span>Rp</span><input class="pagu-in" inputmode="numeric" autocomplete="off"></div></div>' +
          '<div class="pagu-info"></div><button type="button" class="link fillideal">Isi semua rincian sesuai saran</button>';
        const pin = pg.querySelector('.pagu-in'); pin.id = 'pagu-' + p.id; pg.querySelector('label').htmlFor = pin.id;
        pin.value = p.pagu ? fmt(p.pagu) : '';
        ul.appendChild(pg);
        p.items.forEach(x => {
          const r = document.createElement('li'); r.className = 'item'; r.dataset.item = x.id;
          r.innerHTML = '<input class="iname" autocomplete="off"><div class="ival"><span>Rp</span><input class="inum" inputmode="numeric" autocomplete="off" placeholder="0"></div>' +
            '<button type="button" class="idel" aria-label="Hapus rincian">×</button><div class="isug"></div>';
          const n = r.querySelector('.iname'); n.value = x.name; n.id = 'iname-' + x.id; n.setAttribute('aria-label', 'Nama rincian di ' + p.name);
          const v = r.querySelector('.inum'); const xv = itemAmt(p, x, baseIncome()); v.value = xv ? fmt(xv) : ''; v.id = 'inum-' + x.id; v.setAttribute('aria-label', 'Nominal ' + x.name);
          r.querySelector('.ival').classList.toggle('auto', isAutoItem(p, x));
          ul.appendChild(r);
        });
        const add = document.createElement('li');
        add.innerHTML = '<button type="button" class="link iadd">+ Tambah rincian</button>';
        ul.appendChild(add);
      } else {
        num.setAttribute('inputmode', p.type === 'fix' ? 'numeric' : 'decimal');
        num.setAttribute('aria-label', p.type === 'fix' ? 'Nominal tetap untuk ' + p.name : 'Persentase untuk ' + p.name);
        num.value = p.type === 'fix' ? (p.value ? fmt(p.value) : '') : pctFmt(p.value);
        num.placeholder = p.type === 'fix' ? 'nominal' : 'persen';
      }
      list.appendChild(li);
    });
    refreshBagiNumbers();
  }

  function refreshBagiNumbers(){
    const inc = income(), base = baseIncome(), preview = inc === 0;
    $('#previewNote').hidden = !preview || !settings.pos.length;
    const groupPct = { need:0, save:0, want:0, give:0, other:0 };
    settings.pos.forEach(p => {
      const row = document.querySelector('.pos[data-id="' + p.id + '"]');
      if (!row) return;
      const amt = allocOf(p, base);
      const out = row.querySelector('.pamt');
      out.textContent = rp(amt);
      out.classList.toggle('preview', preview);
      const nb = netOf(base), share = nb ? amt / nb * 100 : 0;
      const r = idealOf(p.id);
      groupPct[r ? r.g : 'other'] += share;
      const box = row.querySelector('.pideal'); box.textContent = '';
      const span = document.createElement('span');
      if (!r) { span.textContent = 'Amplop tambahan, tanpa acuan umum · ' + pctFmt(Math.round(share * 10) / 10) + '% dari pemasukan'; box.appendChild(span); return; }
      span.textContent = (r.custom ? 'Acuan Anda ' : 'Acuan ') + rangeText(r) + (preview ? '' : ' · saat ini ' + pctFmt(Math.round(share * 10) / 10) + '%');
      box.appendChild(span);
      if (isWeekly() && !preview) { const w = document.createElement('span'); w.className = 'tag low'; w.textContent = '≈ ' + rpShort(Math.round(amt / weeksNow())) + '/minggu'; box.appendChild(w); }
      if (!preview) {
        const [cls, txt] = judge(share, r, r.g);
        const tag = document.createElement('span'); tag.className = 'tag ' + cls; tag.textContent = txt; box.appendChild(tag);
      }
    });
    // Status otomatis/manual, nilai terkini, dan catatan penyesuaian
    const auto = isAuto(), pl = plan(base), nb0 = netOf(base);
    $('#autoSw').setAttribute('aria-checked', String(auto));
    $('#autoDesc').textContent = auto
      ? 'Amplop terisi sendiri sesuai acuan umum. Ubah nominal mana pun, misalnya sewa kost, dan amplop lain menyesuaikan agar tidak minus.'
      : 'Nonaktif. Nominal hanya berubah saat Anda mengisinya sendiri. Untuk mengisi ulang dari acuan umum, nyalakan sebentar lalu matikan lagi; hasilnya tetap tersimpan.';
    const anyManual = settings.pos.some(p => idealOf(p.id) && (p.type === 'rinci' ? p.items.some(x => x.m && ITEM_SHARE[x.id]) : p.m));
    $('#unlockAll').hidden = !auto || !anyManual;
    $('#prioRow').hidden = !auto;
    document.querySelectorAll('#prioSeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === settings.prio)));
    document.querySelectorAll('#carrySeg button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === settings.carryMode)));
    const cs = carrySaveId(), csp = cs && settings.pos.find(x => x.id === cs);
    $('#carryNote').textContent = csp ? 'Otomatis dimasukkan ke amplop ' + (csp.name || 'Tabungan') + '.' : 'Otomatis ditambahkan ke total uang dan ikut dibagi ke amplop.';
    const an = $('#autoNote');
    if (auto && !preview && pl.deficit > 0) {
      an.hidden = false; an.className = 'autonote bad'; an.textContent = '';
      const st = document.createElement('strong'); st.textContent = 'Biaya yang Anda isi sendiri melebihi pemasukan sebesar ' + rp(pl.deficit) + '. ';
      an.append(st, document.createTextNode('Semua amplop otomatis sudah dikurangi sampai habis. Kurangi salah satu nominal yang dikunci atau tambah pemasukan.'));
    } else if (auto && !preview && pl.cuts.length) {
      an.hidden = false; an.className = 'autonote'; an.textContent = '';
      const st = document.createElement('strong'); st.textContent = 'Disesuaikan otomatis agar tidak minus: ';
      const list = pl.cuts.slice().sort((a, b) => b.by - a.by).slice(0, 5).map(c => c.name + ' −' + rpShort(c.by)).join(', ');
      an.append(st, document.createTextNode(list + (pl.cuts.length > 5 ? ', dan lainnya.' : '.')));
    } else an.hidden = true;
    settings.pos.forEach(p => {
      const row = document.querySelector('.pos[data-id="' + p.id + '"]'); if (!row) return;
      if (p.type !== 'rinci') {
        const num = row.querySelector('.pnum');
        if (auto && idealOf(p.id) && num && document.activeElement !== num) {
          const a = allocOf(p, base);
          num.value = p.type === 'fix' ? (a ? fmt(a) : '') : pctFmt(nb0 ? Math.round(a / nb0 * 1000) / 10 : 0);
        }
        if (auto && idealOf(p.id)) {
          const box = row.querySelector('.pideal');
          if (p.m) {
            const t = document.createElement('span'); t.className = 'tag low'; t.textContent = 'Manual';
            const u = document.createElement('button'); u.type = 'button'; u.className = 'link unlock'; u.textContent = '↺ Otomatis';
            box.append(t, u);
          } else {
            const t = document.createElement('span'); t.className = 'tag ok'; t.textContent = 'Otomatis'; box.appendChild(t);
            const cut = (pl.cuts.find(c => c.id === p.id) || {}).by || 0;
            if (!preview && cut >= 5000) { const c = document.createElement('span'); c.className = 'tag warn'; c.textContent = 'Disesuaikan −' + rpShort(cut); box.appendChild(c); }
          }
        }
      }
    });
    settings.pos.forEach(p => {
      if (p.type !== 'rinci') return;
      const row = document.querySelector('.pos[data-id="' + p.id + '"]'); if (!row) return;
      const pg = row.querySelector('.pagu'); if (pg) pg.hidden = auto && !!idealOf(p.id);
      if (auto && idealOf(p.id)) {
        p.items.forEach(x => {
          const r = row.querySelector('.item[data-item="' + x.id + '"]'); if (!r) return;
          const inp = r.querySelector('.inum'), aut = isAutoItem(p, x);
          r.querySelector('.ival').classList.toggle('auto', aut);
          if (aut && document.activeElement !== inp) { const v = itemAmt(p, x, base); inp.value = v ? fmt(v) : ''; }
          const box = r.querySelector('.isug'); box.textContent = '';
          if (!ITEM_SHARE[x.id]) { box.textContent = 'Rincian tambahan, diisi manual'; return; }
          if (x.m) {
            const t = document.createElement('span'); t.className = 'tag low'; t.textContent = 'Manual · dikunci';
            const u = document.createElement('button'); u.type = 'button'; u.className = 'link unlock'; u.dataset.item = x.id; u.textContent = '↺ Otomatis';
            box.append(t, u);
          } else {
            const t = document.createElement('span'); t.className = 'tag ok'; t.textContent = 'Otomatis'; box.appendChild(t);
            const cut = (pl.cuts.find(c => c.id === x.id) || {}).by || 0;
            if (!preview && cut >= 5000) { const c = document.createElement('span'); c.textContent = 'disesuaikan −' + rpShort(cut) + ' dari acuan'; box.appendChild(c); }
          }
        });
        return;
      }
      const ideal = idealBudget(p, inc);
      const pin = row.querySelector('.pagu-in');
      if (pin) pin.placeholder = ideal ? fmt(ideal) : 'isi pagu';
      const info = row.querySelector('.pagu-info');
      const fillBtn = row.querySelector('.fillideal');
      const pagu = paguOf(p, inc), filled = itemsSum(p);
      const sug = preview ? {} : itemSuggestions(p, inc);
      const hasSug = Object.keys(sug).length > 0;
      if (fillBtn) fillBtn.hidden = !hasSug;
      if (info) {
        info.textContent = '';
        if (preview) info.textContent = 'Isi gaji terlebih dahulu untuk menghitung pagu dan saran rincian.';
        else if (!pagu) info.textContent = 'Isi pagu untuk mendapatkan saran nominal rincian.';
        else {
          const src = p.pagu > 0 ? 'Pagu manual. ' : (ideal ? 'Mengikuti acuan ' + pctFmt(idealOf(p.id).t) + '% dari pemasukan. ' : '');
          info.appendChild(document.createTextNode(src + 'Terisi ' + rp(filled) + ' dari ' + rp(pagu) + ' · '));
          const st = document.createElement('span');
          const gap = pagu - filled;
          if (Math.abs(gap) < 1000) { st.className = 'fit'; st.textContent = 'pas'; }
          else if (gap > 0) { st.className = 'under'; st.textContent = 'sisa ' + rp(gap); }
          else { st.className = 'over'; st.textContent = 'lebih ' + rp(-gap); }
          info.appendChild(st);
        }
      }
      p.items.forEach(x => {
        const box = row.querySelector('.item[data-item="' + x.id + '"] .isug'); if (!box) return;
        box.textContent = '';
        if (preview) return;
        if (sug[x.id] != null) {
          const t = document.createElement('span');
          t.textContent = 'Saran ' + rp(sug[x.id]) + ' (' + pctFmt(ITEM_SHARE[x.id]) + '% pagu)';
          box.appendChild(t);
          if (sug[x.id] === x.value) { const ok = document.createElement('span'); ok.className = 'same'; ok.textContent = '✓ sesuai saran'; box.appendChild(ok); }
          else { const b = document.createElement('button'); b.type = 'button'; b.className = 'link usesug'; b.dataset.v = String(sug[x.id]); b.textContent = 'Pakai saran'; box.appendChild(b); }
        } else if (ITEM_NOTE[x.id]) box.textContent = ITEM_NOTE[x.id];
        else box.textContent = 'Rincian tambahan, diisi manual dan mengurangi pagu';
      });
    });
    const gb = $('#groupBox');
    gb.hidden = preview || !settings.pos.length;
    if (!gb.hidden) {
      gb.textContent = '';
      const head = document.createElement('div'); head.className = 'g-row head';
      head.innerHTML = '<span>Kelompok</span><span class="g-pct">Saat ini</span><span style="justify-self:end">Acuan</span>';
      gb.appendChild(head);
      const rows = GROUPS.slice();
      if (groupPct.other > 0) rows.push({ g:'other', name:'Amplop tambahan', sub:'tanpa acuan umum', min:null, max:null });
      rows.forEach(G => {
        const share = groupPct[G.g];
        const row = document.createElement('div'); row.className = 'g-row';
        const n = document.createElement('span'); n.className = 'g-name'; n.textContent = G.name;
        if (G.sub) { const s = document.createElement('small'); s.textContent = G.sub; n.appendChild(s); }
        const pc = document.createElement('span'); pc.className = 'g-pct'; pc.textContent = pctFmt(Math.round(share * 10) / 10) + '%';
        const tg = document.createElement('span');
        if (G.min == null && G.max == null) { tg.className = 'tag low'; tg.textContent = '—'; }
        else { const [cls, txt] = judge(share, G, G.g); tg.className = 'tag ' + cls; tg.textContent = rangeText(G) + ' · ' + txt; }
        row.append(n, pc, tg); gb.appendChild(row);
      });
    }
    // Baris utang & cicilan di urutan teratas daftar amplop
    const ut = utangNow(), list = $('#posList');
    let drow = list.querySelector('.pos.debt');
    if (ut > 0) {
      if (!drow) {
        drow = document.createElement('li'); drow.className = 'pos debt';
        drow.innerHTML = '<span class="pstatic">Utang &amp; cicilan</span><button type="button" class="link debt-edit">Ubah</button>' +
          '<span class="pfrom">Dibayar lebih dulu</span><output class="pamt num"></output><div class="pideal"></div>';
        const ic = icoEl('card', 0); ic.style.setProperty('--tone', 'var(--danger)'); drow.prepend(ic);
        list.prepend(drow);
      }
      drow.querySelector('.pamt').textContent = rp(ut);
      const box = drow.querySelector('.pideal'); box.textContent = '';
      const sp = document.createElement('span');
      if (preview) { sp.textContent = 'Batas sehat maks. 30% pemasukan'; box.appendChild(sp); }
      else {
        const r = ut / ((month.gaji + month.lain) || base) * 100;
        sp.textContent = pctFmt(Math.round(r * 10) / 10) + '% dari pemasukan · batas sehat maks. 30%';
        const tg = document.createElement('span');
        tg.className = 'tag ' + (r > 40 ? 'bad' : r > 30 ? 'warn' : 'ok');
        tg.textContent = r > 40 ? 'Terlalu berat' : r > 30 ? 'Cukup berat' : 'Sehat';
        box.append(sp, tg);
      }
    } else if (drow) drow.remove();
    const uh = $('#utangHint');
    if (ut > 0 && !preview) {
      const r = ut / ((month.gaji + month.lain) || base) * 100;
      uh.textContent = 'Utang dibayar lebih dulu. Persentase acuan dihitung dari sisa ' + rp(netOf(base)) + ' setelah utang. Rasio cicilan ' + pctFmt(Math.round(r * 10) / 10) + '% dari gaji dan pemasukan rutin' + (r > 30 ? ', melebihi batas sehat 30%.' : '.');
    } else uh.textContent = 'Contoh: cicilan motor, KPR, pinjaman, atau paylater. Utang dibayar lebih dulu, lalu persentase acuan dihitung dari sisa pemasukan setelah utang.';
    const cr = $('#carryRow');
    cr.hidden = !(curCarry > 0);
    if (curCarry > 0) $('#carryAmt').textContent = '+' + rp(curCarry);

    const tot = totalAlloc(base), rest = base - tot;
    const bar = $('#stackBar'); bar.textContent = '';
    const scale = Math.max(base, tot) || 1;
    if (ut > 0) { const i = document.createElement('i'); i.style.width = (ut / scale * 100) + '%'; i.style.background = 'var(--danger)'; bar.appendChild(i); }
    settings.pos.forEach(p => {
      const a = allocOf(p, base); if (a <= 0) return;
      const i = document.createElement('i'); i.style.width = (a / scale * 100) + '%'; i.style.background = 'var(--c' + p.c + ')'; bar.appendChild(i);
    });
    $('#tAlloc').textContent = rp(preview ? 0 : tot);
    const tr = $('#tRest'); tr.textContent = rp(preview ? 0 : rest); tr.classList.toggle('bad', !preview && rest < 0);
    const pill = $('#allocPill');
    if (preview) { pill.className = 'pill'; pill.textContent = 'Menunggu gaji diisi'; }
    else if (Math.abs(rest) < 10) { pill.className = 'pill ok'; pill.textContent = 'Pas, seluruhnya terbagi'; }
    else if (rest > 0) { pill.className = 'pill warn'; pill.textContent = 'Sisa ' + rp(rest) + ' belum dibagi'; }
    else { pill.className = 'pill bad'; pill.textContent = 'Melebihi pemasukan ' + rp(-rest); }
    const ul = $('#useLast');
    if (isWeekly()) {
      if (month.gajiMinggu === 0 && month.gaji === 0 && settings.lastWeekly > 0) { ul.hidden = false; ul.textContent = 'Pakai gaji mingguan terakhir (' + rp(settings.lastWeekly) + ')'; }
      else ul.hidden = true;
      const n = weeksNow(), auto = paydaysIn(curY, curM, settings.payday);
      $('#wkCount').textContent = String(n);
      $('#wkMinus').disabled = n <= 1; $('#wkPlus').disabled = n >= 6;
      const wt = $('#wkTotal'); wt.textContent = n + ' × ' + rp(weeklyAmt()) + ' = ';
      const b = document.createElement('b'); b.textContent = rp(month.gajiMinggu ? month.gajiMinggu * n : month.gaji); wt.appendChild(b);
      wt.appendChild(document.createTextNode(' sebulan'));
      $('#wkAuto').hidden = !month.minggu || month.minggu === auto;
      const dayName = $('#payday').selectedOptions[0] ? $('#payday').selectedOptions[0].textContent : '';
      const h = $('#wkHint');
      if (n >= 5) { h.hidden = false; h.textContent = 'Bulan ini ada ' + n + ' kali gajian. Gajian ke-5 sebaiknya langsung masuk tabungan atau dana darurat, karena pengeluaran bulanan sudah tertutup oleh empat gajian sebelumnya.'; }
      else if (month.minggu && month.minggu !== auto) { h.hidden = false; h.textContent = 'Diubah manual. Menurut kalender, ' + monthLabel() + ' memiliki ' + auto + ' hari ' + dayName + '.'; }
      else { h.hidden = false; h.textContent = 'Dihitung dari ' + n + ' hari ' + dayName + ' di ' + monthLabel() + '. Ubah jumlahnya bila jadwal gajian Anda berbeda.'; }
    } else {
      if (month.gaji === 0 && settings.lastIncome > 0) { ul.hidden = false; ul.textContent = 'Pakai gaji terakhir (' + rp(settings.lastIncome) + ')'; }
      else ul.hidden = true;
    }
    renderSummary();
  }

  function defaultTxDate(){
    if (curY === today.getFullYear() && curM === today.getMonth() + 1) return keyOf(curY, curM) + '-' + String(today.getDate()).padStart(2, '0');
    return keyOf(curY, curM) + '-01';
  }

  const ymd = (d) => keyOf(d.getFullYear(), d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0');
  const todayStr = () => ymd(new Date());
  const yestStr = () => { const n = new Date(); return ymd(new Date(n.getFullYear(), n.getMonth(), n.getDate() - 1)); };

  function renderCats(){
    const hid = $('#txPos');
    let [selP, selI] = hid.value.split('|'); selI = selI || '';
    let p0 = settings.pos.find(p => p.id === selP);
    if (!p0) {
      p0 = settings.pos[0]; selP = p0 ? p0.id : '';
      selI = p0 && p0.type === 'rinci' && p0.items[0] ? p0.items[0].id : '';
    }
    if (p0 && p0.type !== 'rinci') selI = '';
    if (p0 && p0.type === 'rinci' && selI && !p0.items.some(x => x.id === selI)) selI = p0.items[0] ? p0.items[0].id : '';
    hid.value = selP ? selP + '|' + selI : '';

    const inc = income(), spent = spentBy();
    const grid = $('#catGrid'); grid.textContent = '';
    if (!settings.pos.length) {
      const m = document.createElement('p'); m.className = 'fhint'; m.textContent = 'Belum ada amplop. Buat amplop terlebih dahulu di tab Bagi gaji.';
      grid.appendChild(m);
    }
    settings.pos.forEach(p => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cat'; b.dataset.pos = p.id;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(p.id === selP));
      b.style.setProperty('--tone', 'var(--c' + p.c + ')');
      b.appendChild(icoEl(iconKey(p), p.c));
      const n = document.createElement('span'); n.className = 'cname'; n.textContent = p.name || 'Tanpa nama';
      b.appendChild(n);
      if (inc) { const sx = document.createElement('span'); sx.className = 'csisa'; sx.textContent = 'sisa ' + rpShort(allocOf(p, inc) - (spent[p.id] || 0)); b.appendChild(sx); }
      grid.appendChild(b);
    });

    const wrap = $('#subWrap'), sg = $('#subGrid');
    sg.textContent = '';
    if (p0 && p0.type === 'rinci' && p0.items.length) {
      wrap.hidden = false;
      $('#subLbl').textContent = 'Rincian ' + (p0.name || 'amplop');
      const add = (id, name, key) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'sub'; b.dataset.item = id;
        b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(id === selI));
        b.style.setProperty('--tone', 'var(--c' + p0.c + ')');
        b.appendChild(icoEl(key, p0.c, 'xs'));
        const t = document.createElement('span'); t.textContent = name; b.appendChild(t);
        sg.appendChild(b);
      };
      p0.items.forEach(x => add(x.id, x.name || 'Tanpa nama', iconKey(p0, x)));
      add('', 'Lainnya', 'dots');
    } else wrap.hidden = true;
  }

  function renderDate(){
    const d = $('#txDate'), t = todayStr(), y = yestStr();
    const inMonth = (v) => v >= d.min && v <= d.max;
    const bt = document.querySelector('.dchip[data-d="today"]'), by = document.querySelector('.dchip[data-d="yest"]');
    bt.hidden = !inMonth(t); by.hidden = !inMonth(y);
    bt.setAttribute('aria-pressed', String(d.value === t));
    by.setAttribute('aria-pressed', String(d.value === y));
    d.classList.toggle('on', d.value !== t && d.value !== y);
  }

  function renderCatat(){
    const d = $('#txDate');
    const last = new Date(curY, curM, 0).getDate();
    d.min = keyOf(curY, curM) + '-01'; d.max = keyOf(curY, curM) + '-' + String(last).padStart(2, '0');
    if (!d.value || d.value < d.min || d.value > d.max) d.value = defaultTxDate();
    renderCats(); renderDate(); renderRecon();

    const inc = income(), spent = spentBy();
    $('#catatNote').hidden = inc !== 0;
    const env = $('#envList'); env.textContent = '';
    settings.pos.forEach(p => {
      const a = allocOf(p, inc), s = spent[p.id] || 0, left = a - s;
      const ratio = a > 0 ? s / a : (s > 0 ? 1.01 : 0);
      const st = ratio > 1 || left < 0 ? 'bad' : ratio >= .8 ? 'warn' : 'ok';
      const li = document.createElement('li'); li.className = 'env st-' + st;
      li.innerHTML = '<button type="button"><div class="env-top"><span class="env-name"></span><span class="chip"></span></div>' +
        '<div class="bar"><i></i></div><div class="env-nums"><span class="u"></span><span class="r"></span></div></button>';
      const btn = li.querySelector('button');
      btn.style.setProperty('--tone', 'var(--c' + p.c + ')');
      li.querySelector('.env-top').prepend(icoEl(iconKey(p), p.c, 'sm'));
      li.querySelector('.env-name').textContent = p.name || 'Tanpa nama';
      li.querySelector('.chip').textContent = st === 'bad' ? 'Lewat' : st === 'warn' ? 'Menipis' : 'Aman';
      li.querySelector('.bar i').style.width = Math.min(100, ratio * 100) + '%';
      li.querySelector('.u').textContent = 'Terpakai ' + rp(s);
      const r = li.querySelector('.r'); r.textContent = 'Sisa ';
      const strong = document.createElement('strong'); strong.textContent = rp(left); r.appendChild(strong);
      r.appendChild(document.createTextNode(' dari ' + rp(a)));
      if (p.type === 'rinci' && p.items.length) {
        const bd = document.createElement('ul'); bd.className = 'breakdown';
        const rows = p.items.map(x => [x.name || 'Tanpa nama', spent[p.id + '|' + x.id] || 0, itemAmt(p, x, inc), true, iconKey(p, x)]);
        const known = new Set(p.items.map(x => x.id));
        const other = month.tx.filter(t => t.posId === p.id && !known.has(t.itemId)).reduce((sum, t) => sum + t.amt, 0);
        if (other) rows.push(['Lainnya', other, 0, false, 'dots']);
        rows.forEach(([n, s2, plan, planned, key]) => {
          const row = document.createElement('li');
          const a1 = document.createElement('span'); a1.className = 'bn';
          a1.appendChild(icoEl(key, p.c, 'xs'));
          const nt = document.createElement('span'); nt.textContent = n; a1.appendChild(nt);
          const a2 = document.createElement('span'); a2.textContent = rp(s2) + (planned ? ' / ' + rp(plan) : '');
          if (planned && s2 > plan) a2.className = 'over';
          row.append(a1, a2); bd.appendChild(row);
        });
        btn.appendChild(bd);
      }
      btn.addEventListener('click', () => {
        $('#txPos').value = p.id + '|' + (p.type === 'rinci' && p.items[0] ? p.items[0].id : '');
        renderCats();
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        $('#txForm').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        $('#txAmt').focus({ preventScroll: true });
      });
      env.appendChild(li);
    });

    const list = $('#txList'); list.textContent = '';
    const txs = month.tx.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    $('#txCount').textContent = txs.length ? txs.length + ' catatan' : '';
    if (!txs.length) {
      const p = document.createElement('p'); p.className = 'empty';
      p.textContent = 'Belum ada pengeluaran di bulan ini. Catatan Anda akan muncul di sini, dikelompokkan per tanggal.';
      list.appendChild(p);
    }
    const dayFmt = new Intl.DateTimeFormat('id-ID', { weekday:'long', day:'numeric', month:'long' });
    let lastDay = null;
    txs.forEach(t => {
      if (t.date !== lastDay) {
        lastDay = t.date;
        const h = document.createElement('li'); h.className = 'tx-day';
        const [y, m, dd] = t.date.split('-').map(Number);
        h.textContent = (y && m && dd) ? dayFmt.format(new Date(y, m - 1, dd)) : 'Tanpa tanggal';
        list.appendChild(h);
      }
      const p = settings.pos.find(x => x.id === t.posId);
      const x = p && t.itemId ? p.items.find(i => i.id === t.itemId) : null;
      const li = document.createElement('li'); li.className = 'tx'; li.dataset.id = t.id;
      if (t.posId === ADJ) { const ic = icoEl('wallet', 0, 'sm'); ic.style.setProperty('--tone', 'var(--warn)'); li.appendChild(ic); }
      else li.appendChild(icoEl(p ? iconKey(p, x || undefined) : 'wallet', p ? p.c : 0, 'sm'));
      const mid = document.createElement('div');
      mid.innerHTML = '<div class="tx-desc"></div><div class="tx-pos"></div>';
      mid.querySelector('.tx-desc').textContent = t.desc || (x ? x.name : (p ? p.name : '')) || 'Tanpa keterangan';
      mid.querySelector('.tx-pos').textContent = txLabel(t);
      const amt = document.createElement('span'); amt.className = 'tx-amt' + (t.amt < 0 ? ' plus' : ''); amt.textContent = t.amt < 0 ? '+' + rp(-t.amt) : rp(t.amt);
      const del = document.createElement('button'); del.type = 'button'; del.className = 'pdel'; del.textContent = 'Hapus';
      li.append(mid, amt, del);
      list.appendChild(li);
    });
    renderSummary();
  }

  $('#catGrid').addEventListener('click', e => {
    const b = e.target.closest('.cat'); if (!b) return;
    const p = settings.pos.find(x => x.id === b.dataset.pos); if (!p) return;
    $('#txPos').value = p.id + '|' + (p.type === 'rinci' && p.items[0] ? p.items[0].id : '');
    renderCats(); flow($('#subGrid'));
  });
  $('#subGrid').addEventListener('click', e => {
    const b = e.target.closest('.sub'); if (!b) return;
    const pid = $('#txPos').value.split('|')[0];
    $('#txPos').value = pid + '|' + b.dataset.item;
    renderCats();
  });
  $('#quickAmt').addEventListener('click', e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const el = $('#txAmt'), add = Number(b.dataset.a);
    const v = add ? digits(el.value) + add : 0;
    el.value = v ? fmt(v) : '';
  });
  document.querySelector('.datepick').addEventListener('click', e => {
    const b = e.target.closest('.dchip'); if (!b) return;
    $('#txDate').value = b.dataset.d === 'today' ? todayStr() : yestStr();
    renderDate();
  });
  $('#txDate').addEventListener('change', renderDate);

  function renderFrozen(){
    const n = $('#frozenNote'); n.hidden = !frozen;
    if (frozen) $('#frozenText').textContent = 'Rencana ' + monthLabel() + ' sudah dibekukan, sehingga riwayatnya tidak ikut berubah. Perubahan di halaman ini hanya berlaku untuk bulan ini.';
  }
  function renderAll(){
    renderFrozen();
    curCarry = carryInto(curKey);
    $('#mLabel').textContent = monthLabel();
    renderBagi();
    if (!$('#panelCatat').hidden) renderCatat();
    renderSummary();
  }

  /* ---------- Interaksi ---------- */
  function bindMoney(el, set){
    el.addEventListener('input', () => { const v = digits(el.value); el.value = v ? fmt(v) : ''; set(v); });
  }
  bindMoney($('#inGaji'), v => {
    if (isWeekly()) { month.gajiMinggu = v; syncWeekly(); if (v) { settings.lastWeekly = v; saveSettings(); } }
    else { month.gaji = v; if (v) { settings.lastIncome = v; saveSettings(); } }
    saveMonth(); refreshBagiNumbers();
  });
  bindMoney($('#inUtang'), v => {
    month.utang = v; settings.lastUtang = v;
    saveSettings(); saveMonth(); refreshBagiNumbers();
  });
  $('#posList').addEventListener('click', e => { if (e.target.closest('.debt-edit')) $('#inUtang').focus(); });
  $('#freq').addEventListener('click', e => {
    const b = e.target.closest('button[data-f]'); if (!b || b.dataset.f === settings.freq) return;
    settings.freq = b.dataset.f;
    if (isWeekly()) {
      ensureWeekly(); syncWeekly(); saveMonth();
    }
    saveSettings(); renderBagi(); flow($('#posList'));
  });
  $('#payday').addEventListener('change', e => {
    ensureWeekly(); settings.payday = Number(e.target.value); month.minggu = 0; syncWeekly();
    saveSettings(); saveMonth(); refreshBagiNumbers();
  });
  const stepWeeks = (d) => {
    ensureWeekly();
    const n = Math.max(1, Math.min(6, weeksNow() + d));
    month.minggu = n === paydaysIn(curY, curM, settings.payday) ? 0 : n; syncWeekly();
    saveMonth(); refreshBagiNumbers();
  };
  $('#wkMinus').addEventListener('click', () => stepWeeks(-1));
  $('#wkPlus').addEventListener('click', () => stepWeeks(1));
  $('#wkAuto').addEventListener('click', () => { ensureWeekly(); month.minggu = 0; syncWeekly(); saveMonth(); refreshBagiNumbers(); });
  bindMoney($('#inLain'), v => { month.lain = v; saveMonth(); refreshBagiNumbers(); });
  bindMoney($('#txAmt'), () => {});
  $('#useLast').addEventListener('click', () => {
    if (isWeekly()) { month.gajiMinggu = settings.lastWeekly; syncWeekly(); } else month.gaji = settings.lastIncome;
    saveMonth(); renderBagi();
  });

  const posList = $('#posList');
  posList.addEventListener('input', e => {
    const li = e.target.closest('.pos'); if (!li) return;
    const p = settings.pos.find(x => x.id === li.dataset.id); if (!p) return;
    if (e.target.classList.contains('pname')) { p.name = e.target.value; saveSettings(); return; }
    if (e.target.classList.contains('pg-t')) {
      const raw = e.target.value.replace(/[^\d,.]/g, ''); if (raw !== e.target.value) e.target.value = raw;
      p.t = pctParse(raw); p.m = false; saveSettings(); refreshBagiNumbers(); return;
    }
    if (e.target.classList.contains('pagu-in')) { const v = digits(e.target.value); e.target.value = v ? fmt(v) : ''; p.pagu = v; saveSettings(); refreshBagiNumbers(); return; }
    const row = e.target.closest('.item');
    if (row) {
      const x = p.items.find(y => y.id === row.dataset.item); if (!x) return;
      if (e.target.classList.contains('iname')) { x.name = e.target.value; saveSettings(); return; }
      if (e.target.classList.contains('inum')) { const v = digits(e.target.value); e.target.value = v ? fmt(v) : ''; x.value = v; x.m = true; saveSettings(); refreshBagiNumbers(); }
      return;
    }
    if (e.target.classList.contains('pnum')) {
      if (p.type === 'fix') { const v = digits(e.target.value); e.target.value = v ? fmt(v) : ''; p.value = v; }
      else { const raw = e.target.value.replace(/[^\d,.]/g, ''); if (raw !== e.target.value) e.target.value = raw; p.value = pctParse(raw); }
      p.m = true;
      saveSettings(); refreshBagiNumbers();
    }
  });
  posList.addEventListener('change', e => {
    if (!e.target.classList.contains('pg-sel')) return;
    const p = settings.pos.find(x => x.id === e.target.closest('.pos').dataset.id); if (!p) return;
    p.g = e.target.value;
    if (p.g) { if (!(p.t > 0)) p.t = GROUP_DEF[p.g]; p.m = false; }
    saveSettings(); renderBagi();
  });
  posList.addEventListener('focusin', e => {
    if (e.target.matches('.inum, .pnum')) { const el = e.target; setTimeout(() => { try { el.select(); } catch (er) {} }, 0); }
  });
  $('#autoSw').addEventListener('click', () => {
    if (isAuto()) {
      // Simpan hasil otomatis sebagai nominal biasa agar tidak berubah saat dimatikan.
      const base = baseIncome();
      settings.pos.forEach(p => {
        if (!idealOf(p.id)) return;
        if (p.type === 'rinci') p.items.forEach(x => { if (isAutoItem(p, x)) x.value = itemAmt(p, x, base); });
        else if (!p.m) { const a = allocOf(p, base); if (p.type === 'fix') p.value = a; else { const nb = netOf(base); p.value = nb ? Math.round(a / nb * 10000) / 100 : 0; } }
      });
      settings.auto = false;
    } else settings.auto = true;
    saveSettings(); renderBagi(); flow($('#posList'));
  });
  $('#prioSeg').addEventListener('click', e => {
    const b = e.target.closest('button[data-v]'); if (!b || b.dataset.v === settings.prio) return;
    settings.prio = b.dataset.v; saveSettings(); refreshBagiNumbers();
  });
  $('#carrySeg').addEventListener('click', e => {
    const b = e.target.closest('button[data-v]'); if (!b || b.dataset.v === settings.carryMode) return;
    settings.carryMode = b.dataset.v; saveSettings(); refreshBagiNumbers();
  });
  $('#unlockAll').addEventListener('click', () => {
    settings.pos.forEach(p => { p.m = false; p.items.forEach(x => { x.m = false; }); });
    saveSettings(); renderBagi(); flow($('#posList'));
  });
  const confirmTimers = new WeakMap();
  function armDelete(btn, run){
    if (btn.classList.contains('confirm')) { clearTimeout(confirmTimers.get(btn)); run(); return; }
    btn.classList.add('confirm'); btn.textContent = 'Yakin hapus?';
    confirmTimers.set(btn, setTimeout(() => { btn.classList.remove('confirm'); btn.textContent = 'Hapus'; }, 3000));
  }
  posList.addEventListener('click', e => {
    const li = e.target.closest('.pos'); if (!li) return;
    const p = settings.pos.find(x => x.id === li.dataset.id); if (!p) return;
    const un = e.target.closest('.unlock');
    if (un) {
      if (un.dataset.item) { const x = p.items.find(y => y.id === un.dataset.item); if (x) x.m = false; } else p.m = false;
      saveSettings(); refreshBagiNumbers();
      return;
    }
    const seg = e.target.closest('.seg button');
    if (seg && seg.dataset.t !== p.type) {
      const inc = income(), cur = allocOf(p, baseIncome());
      const to = seg.dataset.t;
      if (to === 'fix') { p.value = cur; }
      else if (to === 'pct') { p.value = netOf(inc) ? Math.round(cur / netOf(inc) * 10000) / 100 : 0; }
      else if (!p.items.length) { p.items.push({ id: newId(), name: p.name || 'Rincian', value: cur }); }
      p.type = to;
      saveSettings(); renderBagi();
      const n = to === 'rinci' ? document.getElementById('iname-' + p.items[0].id) : document.getElementById('pnum-' + p.id);
      if (n) n.focus();
      return;
    }
    const use = e.target.closest('.usesug');
    if (use) {
      const r = use.closest('.item'); const x = p.items.find(y => y.id === r.dataset.item); if (!x) return;
      x.value = Number(use.dataset.v) || 0;
      const inp = r.querySelector('.inum'); inp.value = x.value ? fmt(x.value) : '';
      saveSettings(); refreshBagiNumbers();
      return;
    }
    if (e.target.closest('.fillideal')) {
      const sug = itemSuggestions(p, income());
      p.items.forEach(x => { if (sug[x.id] != null) x.value = sug[x.id]; });
      saveSettings(); renderBagi();
      return;
    }
    if (e.target.closest('.iadd')) {
      const x = { id: newId(), name: '', value: 0 };
      p.items.push(x); saveSettings(); renderBagi();
      const n = document.getElementById('iname-' + x.id); if (n) { n.placeholder = 'contoh: Isi ulang galon'; n.focus(); }
      return;
    }
    const idel = e.target.closest('.idel');
    if (idel) {
      const row = idel.closest('.item');
      p.items = p.items.filter(y => y.id !== row.dataset.item);
      saveSettings(); renderBagi();
      return;
    }
    const del = e.target.closest('.pdel');
    if (del) armDelete(del, () => { settings.pos = settings.pos.filter(x => x.id !== p.id); saveSettings(); renderBagi(); });
  });
  $('#addPos').addEventListener('click', () => {
    const used = settings.pos.map(p => p.c);
    let c = 0; for (let k = 1; k <= 10; k++) { if (!used.includes(k)) { c = k; break; } }
    if (!c) c = (settings.pos.length % 10) + 1;
    const p = { id: newId(), name: 'Amplop baru', type: 'fix', value: 0, c, items: [], pagu: 0, m: false, g: '', t: 0 };
    settings.pos.push(p); saveSettings(); renderBagi();
    const nm = document.getElementById('pname-' + p.id); if (nm) { nm.focus(); nm.select(); }
  });

  $('#copySum').addEventListener('click', () => {
    const inc = income();
    const lines = ['Pembagian gaji ' + monthLabel(), 'Pemasukan: ' + rp(inc) + (curCarry > 0 ? ' (termasuk sisa bulan lalu ' + rp(curCarry) + ')' : ''), ''];
    if (utangNow() > 0) lines.push('• Utang & cicilan (dibayar lebih dulu): ' + rp(utangNow()));
    settings.pos.forEach(p => {
      const a = allocOf(p, inc);
      lines.push('• ' + (p.name || 'Tanpa nama') + (p.type === 'pct' ? ' (' + pctFmt(p.value) + '%)' : '') + ': ' + rp(a));
      if (p.type === 'rinci') p.items.forEach(x => lines.push('   – ' + (x.name || 'Tanpa nama') + ': ' + rp(itemAmt(p, x, inc))));
    });
    lines.push('', 'Total dibagikan: ' + rp(totalAlloc(inc)), 'Belum dibagi: ' + rp(inc - totalAlloc(inc)));
    const text = lines.join('\n');
    const btn = $('#copySum'), ta = $('#copyFallback');
    const done = (ok) => { btn.textContent = ok ? 'Tersalin' : 'Salin manual di bawah'; setTimeout(() => { btn.textContent = 'Salin ringkasan'; }, 2200); };
    const fallback = () => { ta.hidden = false; ta.value = text; ta.focus(); ta.select(); done(false); };
    try {
      navigator.clipboard.writeText(text).then(() => { ta.hidden = true; done(true); }, fallback);
    } catch (e) { fallback(); }
  });

  let tplPending = null;
  document.querySelector('.tpl').addEventListener('click', e => {
    const b = e.target.closest('button[data-tpl]'); if (!b) return;
    tplPending = b.dataset.tpl;
    const same = tplPending === settings.tpl;
    $('#tplConfirmText').textContent = same
      ? 'Kembalikan semua amplop ke template awal ' + TEMPLATES[tplPending].name + '? Perubahan nama dan nominal amplop akan hilang.'
      : 'Ganti ke template ' + TEMPLATES[tplPending].name + '? Semua amplop saat ini akan diganti. Catatan pengeluaran tetap tersimpan.';
    $('#tplYes').textContent = same ? 'Ya, kembalikan' : 'Ya, ganti';
    $('#tplConfirm').hidden = false;
  });
  $('#tplNo').addEventListener('click', () => { tplPending = null; $('#tplConfirm').hidden = true; });
  $('#tplYes').addEventListener('click', () => {
    if (!tplPending) return;
    settings.tpl = tplPending; settings.pos = normSettings({ pos: clone(TEMPLATES[tplPending].pos) }).pos;
    tplPending = null; $('#tplConfirm').hidden = true;
    saveSettings(); renderBagi(); flow($('#posList'));
  });

  $('#txForm').addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('#txMsg');
    const [posId, itemId = ''] = $('#txPos').value.split('|');
    const amtEl = $('#txAmt'), amt = digits(amtEl.value);
    if (!posId) { msg.className = 'form-msg bad'; msg.textContent = 'Buat amplop terlebih dahulu di tab Bagi gaji.'; return; }
    if (!amt) { msg.className = 'form-msg bad'; msg.textContent = 'Isi nominal pengeluaran terlebih dahulu.'; amtEl.focus(); return; }
    const date = $('#txDate').value || defaultTxDate();
    const t = { id: newId(), date, posId, itemId, desc: $('#txDesc').value.trim(), amt };
    month.tx.push(t);
    saveMonth();
    amtEl.value = ''; $('#txDesc').value = '';
    msg.className = 'form-msg'; msg.textContent = 'Tercatat ' + rp(amt) + ' untuk ' + txLabel(t) + '.';
    renderCatat();
  });
  $('#txList').addEventListener('click', e => {
    const del = e.target.closest('.pdel'); if (!del) return;
    const li = del.closest('.tx');
    armDelete(del, () => { month.tx = month.tx.filter(t => t.id !== li.dataset.id); saveMonth(); renderCatat(); });
  });

  function setTab(t){
    const bagi = t === 'bagi';
    $('#tabBagi').setAttribute('aria-selected', String(bagi));
    $('#tabCatat').setAttribute('aria-selected', String(!bagi));
    $('#panelBagi').hidden = !bagi; $('#panelCatat').hidden = bagi;
    document.querySelector('.tabs').dataset.tab = t;
    if (bagi) renderBagi(); else renderCatat();
    const panel = bagi ? $('#panelBagi') : $('#panelCatat');
    flow(panel);
    if (bagi) flow($('#posList')); else { flow($('#catGrid')); flow($('#envList')); }
  }
  $('#tabBagi').addEventListener('click', () => setTab('bagi'));
  $('#tabCatat').addEventListener('click', () => setTab('catat'));

  function shiftMonth(delta){
    if (timers.month || dirty.month) flush('month');
    let m = curM + delta, y = curY;
    if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
    curY = y; curM = m; curKey = keyOf(y, m);
    $('#txDate').value = '';
    month = normMonth(localAll.months[curKey]);
    activatePlan();
    renderAll();
    flow($('#panelBagi').hidden ? $('#envList') : $('#posList'));
  }
  $('#unfreeze').addEventListener('click', () => {
    // Ganti rencana beku bulan ini dengan salinan rencana berjalan saat ini.
    month.plan = pickPlan(globalS);
    activatePlan(); saveMonth();
    renderAll(); flow($('#posList'));
  });
  $('#prevM').addEventListener('click', () => shiftMonth(-1));
  $('#nextM').addEventListener('click', () => shiftMonth(1));

  window.addEventListener('pagehide', () => { if (dirty.settings) flush('settings'); if (dirty.month) flush('month'); });

  /* ---------- Cocokkan saldo ---------- */
  const leftNow = () => income() - totalSpent() - utangNow();
  function renderRecon(){
    $('#reconApp').textContent = rp(leftNow());
  }
  bindMoney($('#reconIn'), () => { $('#reconMsg').textContent = ''; });
  $('#reconBtn').addEventListener('click', () => {
    const msg = $('#reconMsg'), raw = $('#reconIn').value.trim();
    if (!raw) { msg.className = 'form-msg bad'; msg.textContent = 'Isi total uang Anda saat ini terlebih dahulu.'; $('#reconIn').focus(); return; }
    const actual = digits(raw), diff = leftNow() - actual;
    if (Math.abs(diff) < 1) { msg.className = 'form-msg'; msg.textContent = 'Sudah cocok. Catatan Anda sesuai dengan uang yang ada.'; return; }
    const tx = { id: newId(), date: defaultTxDate(), posId: ADJ, itemId: '', amt: diff,
      desc: diff > 0 ? 'Pengeluaran yang tidak tercatat' : 'Uang lebih dari catatan' };
    month.tx.push(tx); saveMonth();
    $('#reconIn').value = '';
    msg.className = 'form-msg';
    msg.textContent = diff > 0
      ? 'Tercatat koreksi ' + rp(diff) + ' sebagai pengeluaran yang tidak tercatat. Sisa uang kini sama dengan saldo Anda.'
      : 'Tercatat koreksi +' + rp(-diff) + ' karena uang Anda lebih banyak dari catatan. Sisa uang kini sama dengan saldo Anda.';
    renderCatat();
  });

  /* ---------- Cadangan ---------- */
  // Catatan cadangan disimpan terpisah dari data agar memulihkan cadangan tidak mengubahnya.
  const META_KEY = 'amplop-gajian-meta';
  function readMeta(){ try { return JSON.parse(localStorage.getItem(META_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function writeMeta(patch){ try { localStorage.setItem(META_KEY, JSON.stringify(Object.assign(readMeta(), patch))); } catch (e) {} }
  const DAY = 86400000;
  function hasData(){
    const all = Object.assign({}, localAll.months, { [curKey]: month });
    return Object.keys(all).some(k => { const m = all[k]; return m && (m.gaji || m.lain || (m.tx && m.tx.length)); });
  }
  function exportBackup(){
    if (dirty.settings) flush('settings'); if (dirty.month) flush('month');
    writeLocal();
    const data = { app:'amplop-gajian', versi:1, diekspor:new Date().toISOString(), settings: localAll.settings, months: localAll.months };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
    const d = new Date(), stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'amplop-gajian-cadangan-' + stamp + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    writeMeta({ lastBackup: Date.now() });
    const m = $('#bkMsg'); m.className = 'form-msg'; m.textContent = 'Cadangan diunduh. Simpan file tersebut di tempat yang aman, misalnya Google Drive.';
    renderBackupState();
  }
  function renderBackupState(){
    const meta = readMeta(), now = Date.now();
    const days = meta.lastBackup ? Math.floor((now - meta.lastBackup) / DAY) : null;
    $('#bkLast').textContent = meta.lastBackup
      ? 'Cadangan terakhir: ' + new Intl.DateTimeFormat('id-ID', { day:'numeric', month:'long', year:'numeric' }).format(new Date(meta.lastBackup)) + (days ? ' (' + days + ' hari lalu)' : ' (hari ini)')
      : 'Belum pernah mengunduh cadangan.';
    const due = hasData() && (days === null || days >= 7) && !(meta.snoozeUntil && now < meta.snoozeUntil);
    const bn = $('#bkBanner'); bn.hidden = !due;
    if (due) {
      $('#bkBannerTitle').textContent = days === null ? 'Amankan data Anda' : 'Sudah ' + days + ' hari sejak cadangan terakhir';
      $('#bkBannerText').textContent = 'Data hanya tersimpan di perangkat ini dan dapat hilang bila data peramban dibersihkan. Unduh cadangan, lalu simpan di tempat aman.';
    }
  }
  $('#bkExport').addEventListener('click', exportBackup);
  $('#bkNow').addEventListener('click', exportBackup);
  $('#bkLater').addEventListener('click', () => { writeMeta({ snoozeUntil: Date.now() + 3 * DAY }); renderBackupState(); });

  // Minta penyimpanan permanen agar peramban tidak menghapus data saat ruang penyimpanan menipis.
  function askPersist(){
    const meta = readMeta();
    if (meta.persistAsked || !navigator.storage || !navigator.storage.persist) return;
    writeMeta({ persistAsked: true });
    navigator.storage.persist().catch(() => {});
  }

  // Pemasangan sebagai aplikasi (PWA)
  const standalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  let installEvt = null;
  function renderInstall(){
    const box = $('#installBox');
    if (standalone()) { box.hidden = true; return; }
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (installEvt) { box.hidden = false; $('#installBtn').hidden = false; }
    else if (ios) {
      box.hidden = false; $('#installBtn').hidden = true;
      $('#installText').textContent = 'Di iPhone atau iPad: buka di Safari, ketuk tombol Bagikan, lalu pilih "Tambahkan ke Layar Utama". Aplikasi yang dipasang lebih terlindungi dari penghapusan data otomatis dan tetap bisa dibuka tanpa internet.';
    } else box.hidden = true;
  }
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; renderInstall(); });
  $('#installBtn').addEventListener('click', async () => {
    if (!installEvt) return;
    installEvt.prompt();
    try { await installEvt.userChoice; } catch (e) {}
    installEvt = null; renderInstall();
  });
  window.addEventListener('appinstalled', () => { installEvt = null; renderInstall(); });

  let bkPending = null;
  $('#bkFile').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; e.target.value = '';
    const m = $('#bkMsg'); m.textContent = '';
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const o = JSON.parse(String(rd.result));
        if (!o || o.app !== 'amplop-gajian' || typeof o.months !== 'object') throw new Error('format');
        bkPending = o;
        const n = Object.keys(o.months || {}).length;
        $('#bkConfirmText').textContent = 'Pulihkan cadangan berisi ' + n + ' bulan data? Seluruh data di perangkat ini akan diganti dengan isi cadangan.';
        $('#bkConfirm').hidden = false;
      } catch (err) {
        m.className = 'form-msg bad'; m.textContent = 'File tidak dapat dibaca. Pastikan Anda memilih file cadangan Amplop Gajian (.json).';
      }
    };
    rd.onerror = () => { m.className = 'form-msg bad'; m.textContent = 'File gagal dibuka. Coba pilih ulang file cadangan.'; };
    rd.readAsText(f);
  });
  $('#bkNo').addEventListener('click', () => { bkPending = null; $('#bkConfirm').hidden = true; });
  $('#bkYes').addEventListener('click', () => {
    if (!bkPending) return;
    const months = {};
    Object.keys(bkPending.months || {}).forEach(k => { if (/^\d{4}-\d{2}$/.test(k)) months[k] = normMonth(bkPending.months[k]); });
    localAll = { settings: normSettings(bkPending.settings), months };
    globalS = normSettings(bkPending.settings);
    month = normMonth(months[curKey]);
    freezePast(); activatePlan();
    dirty.settings = dirty.month = false;
    try { localStorage.setItem(LS_KEY, JSON.stringify(localAll)); } catch (e) {}
    bkPending = null; $('#bkConfirm').hidden = true;
    renderAll();
    const m = $('#bkMsg'); m.className = 'form-msg'; m.textContent = 'Data berhasil dipulihkan dari cadangan.';
  });

  /* ---------- Mulai ---------- */
  readLocal();
  if (localAll.settings) globalS = normSettings(localAll.settings);
  settings = globalS;
  freezePast();
  month = normMonth(localAll.months[curKey]);
  activatePlan();
  renderAll();
  flow($('#panelBagi'));
  setStatus('local');
  renderBackupState();
  renderInstall();
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
  }
})();
