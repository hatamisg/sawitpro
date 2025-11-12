# 🚀 Panduan Setup Supabase untuk PalmTrack

Panduan lengkap untuk mengintegrasikan backend Supabase dengan aplikasi PalmTrack Anda.

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Membuat Project Supabase](#membuat-project-supabase)
3. [Setup Database](#setup-database)
4. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
5. [Seed Data ke Database](#seed-data-ke-database)
6. [Testing Koneksi](#testing-koneksi)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Persiapan

### Yang Anda Butuhkan:
- Akun Supabase (gratis) - [Daftar di sini](https://supabase.com)
- Node.js terinstall (sudah ada di project ini)
- Text editor (VS Code, dll)

### Dependencies yang Sudah Terinstall:
✅ `@supabase/supabase-js` - Supabase client library
✅ `tsx` - TypeScript execution tool

---

## 2️⃣ Membuat Project Supabase

### Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Kunjungi: https://app.supabase.com
   - Login atau daftar akun baru

2. **Create New Project**
   - Klik tombol **"New Project"**
   - Isi form berikut:
     - **Name**: PalmTrack (atau nama lain sesuai keinginan)
     - **Database Password**: Buat password yang kuat (SIMPAN password ini!)
     - **Region**: Pilih **Southeast Asia (Singapore)** untuk performa terbaik
     - **Pricing Plan**: Pilih **Free** (cukup untuk development)

3. **Tunggu Setup Selesai**
   - Proses setup biasanya memakan waktu 2-3 menit
   - Anda akan melihat loading indicator
   - Setelah selesai, Anda akan masuk ke dashboard project

---

## 3️⃣ Setup Database

### A. Ambil SQL Schema

File schema SQL sudah tersedia di: `supabase/schema.sql`

### B. Jalankan SQL Schema di Supabase

1. **Buka SQL Editor**
   - Di dashboard Supabase, klik menu **"SQL Editor"** di sidebar kiri
   - Atau klik icon ⚡ **"SQL Editor"**

2. **Create New Query**
   - Klik tombol **"New Query"**

3. **Copy & Paste Schema**
   - Buka file `supabase/schema.sql` di project Anda
   - Copy seluruh isi file (Ctrl+A, Ctrl+C)
   - Paste ke SQL Editor di Supabase (Ctrl+V)

4. **Run Query**
   - Klik tombol **"Run"** atau tekan **Ctrl+Enter**
   - Tunggu hingga selesai (biasanya 2-5 detik)
   - Anda akan melihat pesan **"Success. No rows returned"**

5. **Verifikasi Tables**
   - Klik menu **"Table Editor"** di sidebar
   - Anda seharusnya melihat 6 tables:
     - ✅ `gardens`
     - ✅ `tasks`
     - ✅ `harvests`
     - ✅ `issues`
     - ✅ `maintenances`
     - ✅ `documentation`

### C. Disable Row Level Security (RLS) untuk Development

⚠️ **Penting**: Untuk development/testing, kita perlu disable RLS sementara.

1. Masih di **SQL Editor**, buat query baru
2. Copy dan run query berikut:

```sql
-- Disable RLS untuk development
ALTER TABLE gardens DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE harvests DISABLE ROW LEVEL SECURITY;
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenances DISABLE ROW LEVEL SECURITY;
ALTER TABLE documentation DISABLE ROW LEVEL SECURITY;
```

3. Klik **"Run"**

> 📝 **Note**: Untuk production, Anda harus enable RLS dan membuat policies yang sesuai!

---

## 4️⃣ Konfigurasi Environment Variables

### A. Ambil API Keys dari Supabase

1. **Buka Project Settings**
   - Klik icon ⚙️ **"Settings"** di sidebar
   - Pilih **"API"**

2. **Copy URL dan Keys**
   Anda akan melihat 2 informasi penting:

   **Project URL**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **anon/public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....(panjang sekali)
   ```

   ⚠️ **JANGAN share keys ini ke publik!**

### B. Setup Environment Variables di Project

1. **Copy template file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit file `.env.local`**
   - Buka file `.env.local` di text editor
   - Replace dengan values dari Supabase:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
   ```

3. **Save file**
   - Tekan Ctrl+S atau Command+S

### C. Restart Development Server

⚠️ **Penting**: Environment variables hanya dimuat saat server start.

```bash
# Stop server jika sedang berjalan (Ctrl+C)
# Lalu start ulang:
npm run dev
```

---

## 5️⃣ Seed Data ke Database

Sekarang kita akan mengisi database dengan data awal (mock data).

### Jalankan Seed Script

```bash
npm run seed
```

atau

```bash
npx tsx scripts/seed-supabase.ts
```

### Expected Output:

```
🌱 Starting database seeding...

📍 Seeding gardens...
  ✅ Seeded garden: Kebun Sawit Makmur 1
  ✅ Seeded garden: Kebun Sawit Sejahtera
  ✅ Seeded garden: ...
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
✅ Seeded 12 documentation items

✅ Database seeding completed successfully! 🎉

Summary:
  - Gardens: 8
  - Tasks: 20
  - Harvests: 41
  - Issues: 10
  - Maintenances: 15
  - Documentation: 12
```

### Verifikasi Data di Supabase

1. Buka **Table Editor** di Supabase dashboard
2. Klik table **gardens**
3. Anda seharusnya melihat 8 kebun
4. Cek table lain juga untuk memastikan semua data ter-seed

---

## 6️⃣ Testing Koneksi

### Test Manual di Browser

1. **Buka aplikasi**
   ```bash
   npm run dev
   ```

2. **Buka browser**
   - Navigasi ke: http://localhost:3000
   - Anda seharusnya melihat Dashboard dengan data dari Supabase

3. **Test CRUD Operations**
   - ✅ **Create**: Tambah kebun baru
   - ✅ **Read**: Lihat list kebun
   - ✅ **Update**: Edit kebun yang ada
   - ✅ **Delete**: Hapus kebun

### Cek di Supabase Dashboard

Setiap kali Anda melakukan perubahan (create, update, delete), cek di Table Editor Supabase untuk memastikan data ter-update di database.

---

## 7️⃣ Troubleshooting

### ❌ Error: "Missing Supabase environment variables"

**Penyebab**: File `.env.local` tidak ada atau tidak valid.

**Solusi**:
1. Pastikan file `.env.local` ada di root project
2. Pastikan isi file sesuai format
3. Restart dev server (`npm run dev`)

---

### ❌ Error: "Failed to fetch" atau "Network error"

**Penyebab**: URL atau API key salah.

**Solusi**:
1. Cek kembali NEXT_PUBLIC_SUPABASE_URL
2. Cek kembali NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Pastikan tidak ada spasi di awal/akhir
4. Restart dev server

---

### ❌ Error: "Row Level Security" atau "403 Forbidden"

**Penyebab**: RLS masih enabled.

**Solusi**:
Run query ini di SQL Editor:
```sql
ALTER TABLE gardens DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE harvests DISABLE ROW LEVEL SECURITY;
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;
ALTER TABLE maintenances DISABLE ROW LEVEL SECURITY;
ALTER TABLE documentation DISABLE ROW LEVEL SECURITY;
```

---

### ❌ Seed Script Error

**Penyebab**: Tables belum ada atau schema belum dijalankan.

**Solusi**:
1. Pastikan schema.sql sudah dijalankan di SQL Editor
2. Cek di Table Editor apakah 6 tables sudah ada
3. Jika belum, ulangi [Step 3: Setup Database](#3️⃣-setup-database)

---

## 🎉 Selamat!

Setup Supabase Anda sudah selesai! Sekarang aplikasi PalmTrack Anda menggunakan real database backend.

### Next Steps:

1. **Customize Data**: Hapus mock data dan tambahkan data real Anda
2. **Setup Authentication**: Tambahkan user authentication (opsional)
3. **Enable RLS**: Untuk production, enable RLS dan buat policies
4. **Deploy**: Deploy aplikasi ke Vercel/Netlify

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

---

## 💡 Tips

- **Free Plan Limits**:
  - 500MB database space
  - 2GB bandwidth per month
  - 50,000 monthly active users
  - Cukup untuk development dan small apps!

- **Backup Data**:
  - Supabase Free plan tidak include automatic backups
  - Export data secara manual via dashboard jika perlu

- **Monitor Usage**:
  - Cek usage di Settings > Usage
  - Pastikan tidak melebihi quota

---

**Butuh bantuan?** Buka issue di GitHub atau hubungi support Supabase.
