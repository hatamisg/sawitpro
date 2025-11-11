# PalmTrack - Garden Planner & Management MVP

Aplikasi web manajemen kebun kelapa sawit dengan fitur task management, harvest recording, issue tracking, maintenance scheduling, dan documentation.

## 🚀 Status Implementasi

### ✅ Fase yang Sudah Selesai:

**Phase 1: Setup & Layout** ✅
- Next.js 15 dengan TypeScript, Tailwind CSS
- Komponen UI shadcn/ui lengkap (Button, Card, Badge, Input, Select, Dialog, Tabs, dll)
- TypeScript interfaces untuk semua data models
- Mock data comprehensive untuk 8 kebun dengan histori lengkap
- Layout dengan Navbar responsive

**Phase 2: Dashboard** ✅
- 4 Summary Cards (Total Kebun, Luas, Pohon, Task Pending)
- Task Mendesak section dengan high-priority tasks
- Masalah Aktif section
- Produksi Bulan Ini bar chart (Recharts)
- Kebun Quick Access cards

### 🚧 Fase yang Perlu Diimplementasi:

**Phase 3: Kebun Saya** (Priority: HIGH)
- Halaman list kebun dengan grid layout
- Search dan filter functionality
- Add/Edit/Delete kebun dengan modal form
- Form validation dengan React Hook Form + Zod

**Phase 4: Detail Kebun - Tab Informasi** (Priority: HIGH)
- Garden header dengan breadcrumb
- Quick stats bar
- Production line chart
- Activity timeline
- Two-column layout

**Phase 5: Detail Kebun - Tab Task** (Priority: HIGH)
- Task list dengan filter (status, kategori)
- Add/Edit/Delete task functionality
- Inline status editing
- Quick complete checkbox

**Phase 6: Detail Kebun - Tab Panen** (Priority: MEDIUM)
- Summary cards (total panen, nilai, rata-rata)
- Harvest table dengan sorting
- Add harvest modal dengan auto-calculation
- Production chart

**Phase 7: Detail Kebun - Tab Masalah** (Priority: MEDIUM)
- Issue cards dengan filter
- Add issue modal dengan photo upload (placeholder)
- Detail drawer
- Status toggle (Open/Resolved)

**Phase 8: Detail Kebun - Tab Perawatan** (Priority: MEDIUM)
- Timeline view untuk maintenance
- Schedule maintenance modal
- Recurring maintenance options
- Mark as done functionality

**Phase 9: Detail Kebun - Tab Dokumentasi** (Priority: LOW)
- Three sections: Foto, Dokumen, Catatan
- Photo gallery dengan lightbox
- Document list
- Note cards
- Add documentation modal

**Phase 10: Polish & Optimization** (Priority: LOW)
- Loading states dan skeletons
- Error boundaries
- Toast notifications untuk semua actions
- Empty states
- Responsive optimization

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks (useState, useContext)
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner

## 📁 Struktur Project

```
sawitpro/
├── app/
│   ├── layout.tsx          # Root layout dengan Navbar
│   ├── page.tsx            # Dashboard (✅ Completed)
│   ├── globals.css         # Global styles dengan Tailwind
│   └── kebun/              # Kebun routes (🚧 TODO)
│       ├── page.tsx        # List kebun
│       └── [id]/           # Detail kebun
│           └── page.tsx    # Detail dengan tabs
├── components/
│   ├── ui/                 # shadcn/ui components (✅ Completed)
│   ├── layout/
│   │   └── Navbar.tsx      # Main navigation (✅ Completed)
│   ├── dashboard/          # Dashboard components (✅ Completed)
│   ├── kebun/              # Kebun components (🚧 TODO)
│   └── kebun-detail/       # Detail kebun components (🚧 TODO)
│       └── tabs/           # Tab components (🚧 TODO)
├── lib/
│   ├── data/
│   │   └── mock-data.ts    # Mock data lengkap (✅ Completed)
│   └── utils.ts            # Utility functions (✅ Completed)
├── types/
│   └── index.ts            # TypeScript interfaces (✅ Completed)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🎨 Design System

### Colors
- **Primary**: Green (#10b981 / green-500)
- **Success**: green-500
- **Warning**: orange-500
- **Danger**: red-500
- **Background**: gray-50
- **Card**: white dengan shadow-sm

### Typography
- **Font**: System fonts (sans-serif)
- **Headings**: font-bold
- **Body**: font-normal, text-sm sampai text-base

### Layout
- **Max width**: max-w-7xl
- **Spacing**: consistent padding (p-4, p-6) dan gap (gap-4, gap-6)
- **Rounded**: rounded-lg (8px)

## 📊 Data Models

### Garden
```typescript
interface Garden {
  id: string;
  nama: string;
  lokasi: string;
  lokasiLengkap: string;
  luas: number; // hectares
  jumlahPohon: number;
  tahunTanam: number;
  varietas: string;
  status: 'Baik' | 'Perlu Perhatian' | 'Bermasalah';
  createdAt: Date;
  updatedAt: Date;
}
```

### Task, Harvest, Issue, Maintenance, Documentation
Lihat `types/index.ts` untuk semua interface lengkap.

## 🗄️ Mock Data

File `lib/data/mock-data.ts` berisi:
- **8 gardens** dengan variasi status
- **20 tasks** dengan berbagai prioritas dan status
- **41 harvest records** covering 6-12 bulan
- **10 issues** (mix Open dan Resolved)
- **15 maintenance records** (past dan upcoming)
- **15 documentation items** (foto, dokumen, catatan)

Semua data menggunakan date-fns untuk date handling yang relatif terhadap tanggal sekarang.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📝 Development Guide

### Menambah Halaman Baru

1. Buat file di `app/` dengan struktur App Router Next.js
2. Import mock data dari `lib/data/mock-data.ts`
3. Gunakan komponen UI dari `components/ui/`
4. Follow design system yang sudah ditetapkan

### Menambah Komponen

1. Letakkan di folder yang sesuai (`components/dashboard/`, `components/kebun/`, dll)
2. Gunakan TypeScript dengan proper typing
3. Gunakan Tailwind CSS untuk styling
4. Import utilities dari `lib/utils.ts` (cn function untuk className merging)

### State Management

Untuk MVP ini menggunakan:
- `useState` untuk local component state
- Props drilling untuk passing data
- Untuk production nanti bisa migrate ke Context API atau Zustand

### Form Handling

Gunakan React Hook Form + Zod:
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  luas: z.number().positive("Luas harus positif"),
});

const form = useForm({
  resolver: zodResolver(formSchema),
});
```

### Toast Notifications

Gunakan Sonner untuk notifications:
```typescript
import { toast } from "sonner";

toast.success("Data berhasil disimpan!");
toast.error("Terjadi kesalahan!");
```

## 🎯 Next Steps

### Immediate (Priority: HIGH)

1. **Buat halaman Kebun Saya** (`app/kebun/page.tsx`)
   - Grid layout untuk garden cards
   - Search dan filter
   - Add garden modal dengan form

2. **Buat Detail Kebun** (`app/kebun/[id]/page.tsx`)
   - Garden header dengan stats
   - Tab navigation (6 tabs)
   - Implement Tab Informasi dulu

3. **Context atau State Management**
   - Buat context untuk gardens, tasks, etc.
   - CRUD operations (in-memory untuk MVP)
   - State updates untuk UI reactivity

### Medium Priority

4. **Implement remaining tabs** (Task, Panen, Masalah, Perawatan, Dokumentasi)
5. **Add form validations** untuk semua forms
6. **Implement filtering dan sorting** untuk semua lists

### Polish

7. **Add loading states** dengan skeletons
8. **Add empty states** untuk data kosong
9. **Toast notifications** untuk semua user actions
10. **Responsive testing** dan optimization

## 🐛 Known Issues / Limitations

- **No authentication**: MVP tidak include login/auth
- **In-memory state**: Semua perubahan hilang saat refresh (expected untuk MVP)
- **No real file upload**: Photo upload menggunakan placeholder URLs
- **No backend**: Semua data adalah mock data client-side

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Recharts Documentation](https://recharts.org)

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for Indonesian palm oil garden management
