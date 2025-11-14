# 🗄️ Cara Mengaktifkan Database (Supabase)

## 📋 Ringkasan Masalah

Aplikasi saat ini menggunakan **mock data** (data tiruan) karena database Supabase belum dikonfigurasi. Semua perubahan CRUD (Create, Read, Update, Delete) **TIDAK tersimpan** dan akan hilang saat refresh halaman.

### Status Saat Ini:
- ❌ CRUD tidak menyimpan ke database
- ❌ Data hilang saat refresh browser
- ✅ Aplikasi berjalan normal dengan mock data

## 🚀 Solusi: Setup Supabase Database

### Opsi 1: Quick Setup (Recommended)

Jika Anda sudah memiliki project Supabase:

1. **Copy file environment**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit file `.env.local`** dan isi dengan credentials Supabase Anda:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Restart development server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Cek console browser** - Anda akan melihat:
   ```
   ✅ Supabase is configured and connected
   📡 Fetching gardens from Supabase...
   ✅ Successfully loaded X gardens from Supabase
   ```

### Opsi 2: Setup Supabase dari Awal

Jika Anda belum memiliki project Supabase:

1. **Buat akun Supabase** (gratis)
   - Kunjungi https://supabase.com
   - Sign up dengan GitHub atau email

2. **Buat project baru**
   - Klik "New Project"
   - Pilih nama dan password database
   - Pilih region terdekat (Singapore untuk Indonesia)

3. **Setup database schema**
   - Buka SQL Editor di Supabase dashboard
   - Copy isi file `supabase/schema.sql`
   - Paste dan jalankan di SQL Editor

4. **Dapatkan credentials**
   - Buka Project Settings > API
   - Copy "Project URL" dan "anon public" key

5. **Konfigurasi aplikasi**
   ```bash
   # Copy template
   cp .env.local.example .env.local

   # Edit .env.local dengan credentials Anda
   ```

6. **Seed database dengan data awal** (optional)
   ```bash
   npm run seed
   ```

7. **Restart server**
   ```bash
   npm run dev
   ```

## 🔍 Cara Mengecek Status Database

### Di Browser Console:

Buka Developer Tools (F12) > Console, Anda akan melihat:

**Jika menggunakan Mock Data:**
```
⚠️ Supabase is not configured. Using mock data.
📋 Using mock data (Supabase not configured)
```

**Jika terhubung dengan Supabase:**
```
✅ Supabase is configured and connected
📡 Fetching gardens from Supabase...
✅ Successfully loaded X gardens from Supabase
```

### Di Aplikasi:

**Mock Data Mode:**
- Toast notifications akan menampilkan: "(Mock data - tidak tersimpan di database)"
- Data hilang saat refresh browser

**Supabase Mode:**
- Toast notifications akan menampilkan: "berhasil ditambahkan ke database!"
- Data tetap ada setelah refresh browser

## 🛠️ Troubleshooting

### "Supabase is not configured"

**Penyebab:**
- File `.env.local` tidak ada atau kosong
- Environment variables tidak terisi dengan benar

**Solusi:**
1. Pastikan file `.env.local` ada di root project
2. Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` terisi
3. Restart development server

### "Failed to fetch gardens"

**Penyebab:**
- Database belum di-setup dengan schema yang benar
- Credentials Supabase salah
- Network issues

**Solusi:**
1. Cek apakah schema sudah dijalankan di Supabase
2. Verifikasi credentials di `.env.local`
3. Cek koneksi internet
4. Aplikasi akan otomatis fallback ke mock data jika gagal

### Data masih menggunakan mock data meski sudah setup

**Penyebab:**
- Development server belum di-restart setelah mengubah `.env.local`
- File `.env.local` tidak terdeteksi

**Solusi:**
1. Stop server (Ctrl+C)
2. Restart dengan `npm run dev`
3. Clear browser cache jika perlu

## 📊 Perbedaan Mock Data vs Database

| Fitur | Mock Data | Supabase Database |
|-------|-----------|-------------------|
| Persistensi | ❌ Tidak tersimpan | ✅ Tersimpan permanent |
| Refresh browser | ❌ Data hilang | ✅ Data tetap ada |
| Sharing data | ❌ Tidak bisa | ✅ Bisa di-share |
| Multi-device | ❌ Tidak sinkron | ✅ Sinkron otomatis |
| Production ready | ❌ Hanya testing | ✅ Production ready |

## 🔄 Mode Switching

Aplikasi akan otomatis detect mode berdasarkan konfigurasi:

- **Jika `.env.local` ada dan terisi** → Gunakan Supabase
- **Jika `.env.local` tidak ada** → Gunakan mock data

Anda juga bisa force mode dengan menambahkan di `.env.local`:

```bash
# Force gunakan Supabase (akan error jika credentials salah)
NEXT_PUBLIC_USE_SUPABASE=true

# Force gunakan mock data (meski credentials ada)
NEXT_PUBLIC_USE_SUPABASE=false
```

## 📚 Resources

- [Tutorial Setup Supabase Lengkap](./SETUP_SUPABASE.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Database Schema](./supabase/schema.sql)

## ✅ Checklist Setup

- [ ] Buat project Supabase
- [ ] Jalankan schema SQL
- [ ] Copy `.env.local.example` ke `.env.local`
- [ ] Isi credentials Supabase di `.env.local`
- [ ] Restart development server
- [ ] Cek console browser untuk konfirmasi
- [ ] Test CRUD operations
- [ ] Refresh browser untuk verifikasi data tersimpan

---

💡 **Tips:** Untuk testing lokal, Anda bisa tetap menggunakan mock data. Untuk production atau jika ingin data tersimpan permanent, gunakan Supabase.
