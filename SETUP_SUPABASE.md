# 🚀 Tutorial Setup Supabase untuk PalmTrack

Panduan lengkap untuk setup database Supabase untuk aplikasi PalmTrack.

## 📋 Daftar Isi

1. [Prasyarat](#prasyarat)
2. [Langkah 1: Buat Project Supabase](#langkah-1-buat-project-supabase)
3. [Langkah 2: Setup Database Schema](#langkah-2-setup-database-schema)
4. [Langkah 3: Konfigurasi Environment Variables](#langkah-3-konfigurasi-environment-variables)
5. [Langkah 4: Seed Database dengan Data Mock](#langkah-4-seed-database-dengan-data-mock)
6. [Langkah 5: Verifikasi Setup](#langkah-5-verifikasi-setup)
7. [Troubleshooting](#troubleshooting)

---

## Prasyarat

Sebelum memulai, pastikan Anda sudah:

- ✅ Memiliki akun GitHub atau email untuk sign up Supabase
- ✅ Node.js versi 18 atau lebih tinggi terinstal
- ✅ npm atau yarn terinstal
- ✅ Sudah clone repository ini

---

## Langkah 1: Buat Project Supabase

### 1.1 Sign Up / Login ke Supabase

1. Buka [https://supabase.com](https://supabase.com)
2. Klik **"Start your project"** atau **"Sign In"** jika sudah punya akun
3. Login menggunakan GitHub atau email

### 1.2 Buat Project Baru

1. Setelah login, klik **"New Project"**
2. Pilih **Organization** (atau buat baru jika belum ada)
3. Isi detail project:
   - **Name**: `palmtrack` (atau nama lain yang Anda inginkan)
   - **Database Password**: Buat password yang kuat (SIMPAN password ini!)
   - **Region**: Pilih region terdekat (contoh: `Southeast Asia (Singapore)`)
   - **Pricing Plan**: Pilih **Free** untuk development

4. Klik **"Create new project"**
5. Tunggu 1-2 menit sampai project selesai dibuat

### 1.3 Catat Credentials

Setelah project dibuat, Anda akan melihat dashboard. Catat informasi berikut:

1. Buka **Settings** (ikon gear di sidebar kiri)
2. Pilih **API** di sidebar
3. Catat informasi berikut:
   - **Project URL** (contoh: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (key yang panjang, dimulai dengan `eyJ...`)

> ⚠️ **PENTING**: Jangan share **service_role** key! Hanya gunakan **anon public** key untuk client-side.

---

## Langkah 2: Setup Database Schema

### 2.1 Buka SQL Editor

1. Di dashboard Supabase, klik **SQL Editor** di sidebar kiri
2. Klik **"New query"**

### 2.2 Jalankan Schema SQL

1. Copy seluruh isi file `supabase/schema.sql` dari repository ini
2. Paste ke SQL Editor
3. Klik **"Run"** atau tekan `Ctrl+Enter` / `Cmd+Enter`

Ini akan membuat:
- ✅ 7 tabel utama (gardens, tasks, harvests, issues, maintenances, documentation, expenses)
- ✅ Semua indexes untuk performa query
- ✅ Triggers untuk auto-update timestamps
- ✅ Function untuk kalkulasi otomatis

### 2.3 Verifikasi Tabel Terbuat

1. Klik **Table Editor** di sidebar kiri
2. Anda seharusnya melihat 7 tabel:
   - `gardens`
   - `tasks`
   - `harvests`
   - `issues`
   - `maintenances`
   - `documentation`
   - `expenses`

---

## Langkah 3: Konfigurasi Environment Variables

### 3.1 Copy File .env.local.example

Di terminal/command prompt, jalankan:

```bash
# Di root folder project
cp .env.local.example .env.local
```

Atau copy manual file `.env.local.example` dan rename menjadi `.env.local`

### 3.2 Isi Environment Variables

Buka file `.env.local` dan isi dengan credentials dari Supabase:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc................
```

**Cara mendapatkan nilai-nilai ini:**

1. **NEXT_PUBLIC_SUPABASE_URL**:
   - Dari Supabase Dashboard > Settings > API
   - Copy nilai **Project URL**

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**:
   - Dari Supabase Dashboard > Settings > API
   - Copy nilai **anon public** key (bukan service_role!)

> ⚠️ **PENTING**: File `.env.local` sudah ada di `.gitignore` dan tidak akan di-commit ke git. Jangan pernah commit file ini!

---

## Langkah 4: Seed Database dengan Data Mock

### 4.1 Install Dependencies

Jika belum install dependencies, jalankan:

```bash
npm install
```

### 4.2 Jalankan Seed Script

```bash
npm run seed
```

Script ini akan:
- ✅ Insert 8 kebun sawit dengan data realistis
- ✅ Insert 20 tasks dengan berbagai status dan prioritas
- ✅ Insert 41 harvest records (histori 6-12 bulan)
- ✅ Insert 10 issues (mix open dan resolved)
- ✅ Insert 15 maintenance records
- ✅ Insert 15 documentation items
- ✅ Insert 28 expense records

Output yang diharapkan:

```
🌱 Starting database seeding...

📍 Seeding gardens...
  ✅ Seeded garden: Kebun Sawit Makmur
  ✅ Seeded garden: Kebun Sawit Sejahtera
  ... (8 gardens total)
✅ Seeded 8 gardens

📋 Seeding tasks...
✅ Seeded 20 tasks

🌾 Seeding harvests...
✅ Seeded 41 harvests

⚠️  Seeding issues...
✅ Seeded 10 issues

🔧 Seeding maintenances...
✅ Seeded 15 maintenances

📄 Seeding documentation...
✅ Seeded 15 documentation items

💰 Seeding expenses...
✅ Seeded 28 expenses

✅ Database seeding completed successfully! 🎉

Summary:
  - Gardens: 8
  - Tasks: 20
  - Harvests: 41
  - Issues: 10
  - Maintenances: 15
  - Documentation: 15
  - Expenses: 28
```

---

## Langkah 5: Verifikasi Setup

### 5.1 Cek Data di Supabase

1. Buka **Table Editor** di Supabase Dashboard
2. Klik tabel **gardens** - seharusnya ada 8 rows
3. Klik tabel **tasks** - seharusnya ada 20 rows
4. Dst...

### 5.2 Jalankan Aplikasi

```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000`

Anda seharusnya melihat:
- ✅ Dashboard dengan data kebun
- ✅ 8 kebun di halaman "Kebun Saya"
- ✅ Charts dan statistik dengan data yang benar
- ✅ Semua fitur CRUD berfungsi

### 5.3 Test CRUD Operations

Coba test beberapa operasi:

1. **Create**: Tambah kebun baru di halaman "Kebun Saya"
2. **Read**: Buka detail kebun, lihat semua tabs
3. **Update**: Edit data task, mark as done, dll
4. **Delete**: Hapus sebuah kebun

Semua perubahan seharusnya langsung tersimpan di Supabase!

---

## Troubleshooting

### ❌ Error: "Missing Supabase environment variables"

**Penyebab**: File `.env.local` tidak ada atau environment variables tidak terisi

**Solusi**:
1. Pastikan file `.env.local` ada di root folder project
2. Pastikan sudah isi `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Restart development server (`Ctrl+C` lalu `npm run dev` lagi)

---

### ❌ Error saat seed: "relation 'gardens' does not exist"

**Penyebab**: Schema belum dijalankan di Supabase

**Solusi**:
1. Buka Supabase Dashboard > SQL Editor
2. Jalankan file `supabase/schema.sql` lengkap
3. Cek Table Editor apakah semua tabel sudah terbuat
4. Jalankan `npm run seed` lagi

---

### ❌ Error saat seed: "duplicate key value violates unique constraint"

**Penyebab**: Data sudah pernah di-seed sebelumnya

**Solusi**:

Opsi 1 - Hapus semua data dan seed ulang:
```sql
-- Jalankan di SQL Editor
TRUNCATE TABLE gardens CASCADE;
```
Lalu jalankan `npm run seed` lagi.

Opsi 2 - Hapus dan buat ulang semua tabel:
```sql
-- Jalankan di SQL Editor
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS documentation CASCADE;
DROP TABLE IF EXISTS maintenances CASCADE;
DROP TABLE IF EXISTS issues CASCADE;
DROP TABLE IF EXISTS harvests CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS gardens CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS calculate_harvest_total CASCADE;
```
Lalu jalankan `supabase/schema.sql` lagi, dan `npm run seed`.

---

### ❌ Aplikasi tidak menampilkan data dari Supabase

**Penyebab**: Aplikasi masih menggunakan mock data, bukan Supabase client

**Solusi**:
1. Pastikan sudah import Supabase client di component yang benar
2. Cek console browser untuk error messages
3. Pastikan `.env.local` sudah benar
4. Restart development server

---

### ❌ Error: "Invalid API key"

**Penyebab**: Anon key salah atau kadaluarsa

**Solusi**:
1. Buka Supabase Dashboard > Settings > API
2. Copy ulang **anon public** key
3. Paste ke `.env.local`
4. Restart development server

---

### ❌ Error: "Failed to fetch" atau network errors

**Penyebab**:
- Project URL salah
- Koneksi internet bermasalah
- Supabase project sedang down

**Solusi**:
1. Cek koneksi internet
2. Verifikasi Project URL di `.env.local` benar
3. Cek status Supabase di [status.supabase.com](https://status.supabase.com)

---

## 📚 Struktur Database

### Tabel dan Relasi

```
gardens (kebun)
  ├── tasks (tugas kebun)
  ├── harvests (data panen)
  ├── issues (masalah kebun)
  ├── maintenances (jadwal perawatan)
  ├── documentation (foto, dokumen, catatan)
  └── expenses (pengeluaran kebun)
```

Semua tabel child memiliki foreign key `garden_id` yang reference ke `gardens.id` dengan `ON DELETE CASCADE`.

### Row Level Security (RLS)

Saat ini RLS **dinonaktifkan** untuk kemudahan development.

Untuk production, Anda bisa enable RLS:

```sql
-- Jalankan di SQL Editor
ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ... dst untuk semua tabel

-- Buat policy (contoh: allow semua operasi)
CREATE POLICY "Allow all operations" ON gardens FOR ALL USING (true);
```

---

## 🎉 Selesai!

Setup Supabase Anda sudah lengkap! Aplikasi PalmTrack sekarang menggunakan database real di cloud.

### Next Steps

1. ✅ Mulai develop fitur baru
2. ✅ Customize schema sesuai kebutuhan
3. ✅ Setup authentication (opsional)
4. ✅ Deploy aplikasi ke Vercel/Netlify

### Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 💡 Tips

### Backup Database

Export data Anda secara berkala:

1. Buka Supabase Dashboard > Database
2. Klik **Backups**
3. Download backup

### Monitor Usage

Pantau usage Anda di **Settings > Usage** untuk memastikan tidak melebihi free tier limit:
- Database size: 500 MB
- Bandwidth: 5 GB
- File storage: 1 GB

### Development Best Practices

1. Gunakan `.env.local` untuk local development
2. Gunakan environment variables berbeda untuk production
3. Jangan commit credentials ke git
4. Backup data secara berkala
5. Test di local dulu sebelum deploy

---

Jika ada pertanyaan atau masalah, silakan buka issue di repository ini! 🙏
