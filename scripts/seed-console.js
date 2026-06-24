// ============================================================
// CARA PAKAI:
// 1. Buka https://sepedamania.com
// 2. Buka DevTools (F12 → Console)
// 3. Paste seluruh isi file ini lalu ENTER
// 4. Tunggu sampai "✅ XX produk berhasil ditambahkan"
// 5. Refresh halaman admin/produk untuk melihat hasil
// ============================================================

(function() {
  'use strict';

  const STORAGE_KEY = 'spm-catalog';
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    console.error('❌ Data katalog belum ada. Buka halaman utama SEPEDAMANIA dulu.');
    return;
  }

  const store = JSON.parse(raw);
  if (!store.products) store.products = [];

  const slugify = (s) => s.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const randId = () => Math.random().toString(36).slice(2, 8);

  const productsData = [
    { name:"Polygon Xtrada 5", sku:"PLG-XTR5-2025", cat:"cat-1", brd:"brd-1", price:11999000, sale:9999000, weight:13500, stock:15, sold:47, desc:"Sepeda gunung hardtail dengan frame Alx Aluminium 6061, fork suspension XCR 100mm, drivetrain Shimano Deore 1x12, hydraulic disc brakes. Cocok untuk trail ringan hingga menengah.", specs:{ Frame:"Alx 6061 Alloy", Fork:"XCR 100mm", Drivetrain:"Shimano Deore 1x12", Brakes:"Hydraulic Disc", Wheelset:"29er" } },
    { name:"Polygon Heist X1", sku:"PLG-HEX1-2025", cat:"cat-4", brd:"brd-1", price:4299000, sale:3999000, weight:10500, stock:23, sold:128, desc:"Sepeda fixie/road bike hybrid dengan frame Chromoly, wheelset double wall, freewheel flip-flop hub. Tampilan klasik dengan performa modern.", specs:{ Frame:"Chromoly", Hub:"Flip Flop", Wheelset:"Double Wall", Handlebar:"Drop Bar" } },
    { name:"United Bike U-MTB 29", sku:"UNT-UMTB29-2025", cat:"cat-1", brd:"brd-2", price:5499000, sale:null, weight:14500, stock:30, sold:85, desc:"MTB 29er entry level dengan frame aluminium butted, fork suspension 100mm, Shimano Altus 3x8 drivetrain. Pilihan tepat untuk memulai trail.", specs:{ Frame:"Alloy Butted 6061", Fork:"Suspension 100mm", Drivetrain:"Shimano Altus 3x8", Brakes:"Mechanical Disc", Wheelset:"29er" } },
    { name:"United Bike U-Urban", sku:"UNT-UURB-2025", cat:"cat-5", brd:"brd-2", price:3299000, sale:2999000, weight:14500, stock:18, sold:62, desc:"City bike stylish retro-modern. Frame step-through rendah, rak belakang, fender, lampu LED. Cocok untuk keliling kota.", specs:{ Frame:"Hi-Ten Steel Step-Through", Drivetrain:"Shimano Nexus 3", Brakes:"V-Brake" } },
    { name:"Wimcycle Classic 26", sku:"WIM-CLAS26-2025", cat:"cat-5", brd:"brd-3", price:2599000, sale:2399000, weight:15500, stock:25, sold:93, desc:"Sepeda city classic vintage. Frame steel glossy, saddle kulit sintetis, handlebar sweep back. Nyaman untuk jalan santai.", specs:{ Frame:"Hi-Ten Steel", Drivetrain:"Shimano Tourney 7-speed", Brakes:"Caliper" } },
    { name:"Wimcycle Mini 16", sku:"WIM-MINI16-2025", cat:"cat-5", brd:"brd-3", price:3899000, sale:3599000, weight:10500, stock:12, sold:156, desc:"Sepeda lipat kompak 16 inch. Frame aluminium ringan, lipat 15 detik. Dilengkapi carrier bag. Cocok commuter.", specs:{ Frame:"Alloy Folding", Roda:'16"', Drivetrain:"Single Speed" } },
    { name:"Pacific BMX Pro 20", sku:"PAC-BMXP20-2025", cat:"cat-3", brd:"brd-4", price:4599000, sale:4299000, weight:11500, stock:8, sold:34, desc:"BMX profesional Chromoly 4130, fork tapered, handlebar 4-piece. Hub sealed bearing, wheelset double wall.", specs:{ Frame:"Chromoly 4130", Fork:"Tapered Chromoly", Handlebar:"4-Piece", Hub:"Sealed Bearing" } },
    { name:"Pacific Kids 18", sku:"PAC-KIDS18-2025", cat:"cat-6", brd:"brd-4", price:999000, sale:849000, weight:9500, stock:40, sold:218, desc:"Sepeda anak 18 inch training wheel. Frame Hi-Ten steel kokoh, handlebar lebar. Warna-warna cerah.", specs:{ Frame:"Hi-Ten Steel", Roda:'18"', Rem:"V-Brake", Fitur:"Training Wheel" } },
    { name:"Element Road Elite 105", sku:"ELM-RD105-2025", cat:"cat-2", brd:"brd-5", price:27999000, sale:24999000, weight:8500, stock:3, sold:12, desc:"Road bike full carbon Toray T700, groupset Shimano 105 Di2, wheelset carbon 50mm. Kecepatan maksimal.", specs:{ Frame:"Full Carbon Toray T700", Groupset:"Shimano 105 Di2", Wheelset:"Carbon 50mm", Berat:"8.5 kg" } },
    { name:"Element Aero S1", sku:"ELM-AERS1-2025", cat:"cat-4", brd:"brd-5", price:5299000, sale:4999000, weight:9500, stock:11, sold:45, desc:"Fixie aerodinamis, fork carbon, frame aluminium aero, wheelset deep 60mm. Cocok balap track atau harian.", specs:{ Frame:"Aero Alloy", Fork:"Carbon", Wheelset:"Deep 60mm", Hub:"Flip Flop" } },
    { name:"ASC Enduro X1", sku:"ASC-EDX1-2025", cat:"cat-1", brd:"brd-6", price:34999000, sale:31999000, weight:15500, stock:4, sold:8, desc:"Full suspension enduro MTB. Fox 36 Float, Fox Float X2, Shimano XT 1x12. Siap downhill.", specs:{ Frame:"Hydroformed Alloy 170mm", Fork:"Fox 36 Float 170mm", RearShock:"Fox Float X2", Drivetrain:"Shimano XT 1x12" } },
    { name:"ASC Urban Gravel", sku:"ASC-UGRV-2025", cat:"cat-2", brd:"brd-6", price:14999000, sale:13999000, weight:10500, stock:6, sold:23, desc:"Gravel bike serbaguna. Frame aluminium, fork carbon, GRX 2x11. Bisa touring jarak jauh.", specs:{ Frame:"Gravel Alloy", Fork:"Carbon", Drivetrain:"Shimano GRX 2x11", Ban:"700x40c" } },
    { name:"ProMax Street BMX", sku:"PMX-STMX-2025", cat:"cat-3", brd:"brd-7", price:3899000, sale:3699000, weight:12200, stock:9, sold:31, desc:"BMX street full Chromoly, fork tapered, cassette 9T, gyro brake system. Kuat untuk street park.", specs:{ Frame:"Full Chromoly", Hub:"Cassette 9T", Brake:"Gyro System" } },
    { name:"XDS Trail 27.5", sku:"XDS-T275-2025", cat:"cat-1", brd:"brd-8", price:16999000, sale:15999000, weight:13500, stock:7, sold:19, desc:"MTB trail 27.5\". Frame aluminium double butted, air suspension 120mm, Shimano SLX 1x11. Lincah.", specs:{ Frame:"DB Alloy 6061", Fork:"Air Suspension 120mm", Drivetrain:"Shimano SLX 1x11", Roda:'27.5"' } },
    { name:"Shimano PD-M520 Pedal SPD", sku:"SHI-PDM520", cat:"cat-7", brd:"brd-9", price:550000, sale:499000, weight:380, stock:100, sold:542, desc:"Pedal clipless SPD entry level. Dual-sided entry, adjustable tension. Berat 380g/pair.", specs:{ Tipe:"Clipless SPD", Entry:"Dual-sided", Tension:"Adjustable", Berat:"380g/pair" } },
    { name:"Shimano BR-MT200 Disc Brake", sku:"SHI-BRMT200", cat:"cat-8", brd:"brd-9", price:850000, sale:799000, weight:520, stock:75, sold:389, desc:"Set hydraulic disc brake Shimano entry. Power stopping handal, perawatan mudah.", specs:{ Tipe:"Hydraulic Disc", Piston:"2-piston", Rotor:"160mm / 180mm", Berat:"520g/set" } },
    { name:"SRAM GX Eagle Cassette 10-52T", sku:"SRM-GX1052", cat:"cat-8", brd:"brd-10", price:1850000, sale:1699000, weight:480, stock:35, sold:167, desc:"Cassette 12-speed 10-52T full steel. Shifting presisi untuk MTB performa tinggi.", specs:{ Speed:"12-speed", Range:"10-52T", Material:"Full Steel", Compatibility:"GX Eagle" } },
    { name:"SRAM GX Eagle Crankset 170mm", sku:"SRM-GXCR170", cat:"cat-8", brd:"brd-10", price:2750000, sale:2599000, weight:680, stock:20, sold:94, desc:"Crankset GX Eagle 170mm 12-speed, direct mount 32T. Aluminium forged. Desain DUB.", specs:{ Speed:"12-speed", Arm:"170mm", Chainring:"32T Direct Mount", Standard:"DUB" } },
    { name:"Helm Sepeda ProMax Aero", sku:"PMX-HELM-2025", cat:"cat-7", brd:"brd-7", price:750000, sale:649000, weight:230, stock:55, sold:312, desc:"Helm aero 230g, ventilasi optimal, dial fit, buckle magnetik. Sertifikasi CPSC & EN 1078.", specs:{ Berat:"230g", Ventilasi:"12 vents", Adjustment:"Dial Fit System", Sertifikasi:"CPSC, EN 1078" } },
    { name:"Sarung Tangan Element Pro", sku:"ELM-GLOVE-2025", cat:"cat-7", brd:"brd-5", price:199000, sale:179000, weight:80, stock:120, sold:478, desc:"Sarung tangan full finger gel padding. Breathable mesh, touchscreen, anti slip.", specs:{ Tipe:"Full Finger", Bahan:"Mesh Breathable", Padding:"Gel", Fitur:"Touchscreen" } },
  ];

  const getCat = (id) => store.categories.find(c => c.id === id);
  const getBrd = (id) => store.brands.find(b => b.id === id);

  let ok = 0, fail = 0;
  for (const d of productsData) {
    const slug = slugify(d.name);
    if (store.products.find(p => p.slug === slug)) {
      console.log(`⚠  ${d.name} — sudah ada, dilewati`);
      continue;
    }
    const cat = getCat(d.cat);
    const brd = getBrd(d.brd);
    if (!cat || !brd) {
      console.error(`✗ ${d.name} — kategori/brand tidak ditemukan`);
      fail++;
      continue;
    }
    const product = {
      id: 'p' + randId(),
      name: d.name,
      slug,
      sku: d.sku,
      description: d.desc,
      categoryId: d.cat,
      brandId: d.brd,
      price: d.price,
      salePrice: d.sale,
      weight: d.weight,
      stock: d.stock,
      sold: d.sold || 0,
      images: [],
      videoUrls: [],
      isActive: true,
      specs: d.specs || {},
      category: { id: cat.id, name: cat.name, slug: cat.slug },
      brand: { id: brd.id, name: brd.name, slug: brd.slug },
      variants: [],
      reviews: [],
      rating: +(4 + Math.random()).toFixed(1),
      reviewCount: Math.floor(Math.random() * 50),
    };
    store.products.push(product);
    ok++;
    console.log(`✓ ${d.name}`);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  console.log(`\n✅ ${ok} produk berhasil ditambahkan${fail ? ', ' + fail + ' gagal' : ''}`);
  if (ok > 0) console.log('🔄 Refresh halaman untuk melihat hasil');
})();
