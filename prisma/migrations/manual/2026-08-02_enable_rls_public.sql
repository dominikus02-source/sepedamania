-- Aktifkan RLS di SELURUH tabel schema public.
--
-- Jalankan di: Supabase SQL Editor (project sepedamania).
-- Idempoten: aman dijalankan ulang, dan aman dijalankan lagi setiap kali ada
-- tabel baru (mis. setelah `prisma migrate`).
--
-- ── Kenapa ini aman untuk sepedamania ────────────────────────────────────
-- Seluruh akses data aplikasi lewat Prisma, yang terhubung sebagai role
-- `postgres` (BYPASSRLS) — RLS tidak berlaku untuknya. Satu-satunya pemakaian
-- supabase-js ada di src/lib/supabase-storage.ts dan itu memakai
-- SUPABASE_SECRET_KEY (service role), yang juga menembus RLS.
--
-- Yang diblokir justru yang seharusnya diblokir: akses langsung lewat
-- PostgREST memakai anon key. Tanpa RLS, siapa pun yang tahu URL project dan
-- anon key bisa membaca tabel User, Address, Order, dan Session — termasuk
-- data pribadi pembeli. Itulah yang dilaporkan advisor sebagai CRITICAL.
--
-- Tidak ada policy yang dibuat: tanpa policy, RLS menolak semua akses non-
-- bypass. Itu memang yang diinginkan selama aplikasi tidak mengakses data
-- lewat anon key. Kalau nanti ada fitur yang perlu baca langsung dari browser,
-- policy-nya ditambahkan khusus untuk tabel itu saja.

DO $$
DECLARE
  t record;
  jumlah int := 0;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t.tablename);
    jumlah := jumlah + 1;
  END LOOP;
  RAISE NOTICE 'RLS diaktifkan pada % tabel di schema public', jumlah;
END $$;

-- Verifikasi: seluruh baris harus rowsecurity = true.
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity, tablename;
