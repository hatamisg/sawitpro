-- PalmTrack Database Schema for Supabase
-- This SQL file contains the complete database structure for the PalmTrack application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. GARDENS TABLE
-- ============================================
CREATE TABLE gardens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  lokasi_lengkap TEXT NOT NULL,
  luas DECIMAL(10, 2) NOT NULL CHECK (luas > 0),
  jumlah_pohon INTEGER NOT NULL CHECK (jumlah_pohon > 0),
  tahun_tanam INTEGER NOT NULL CHECK (tahun_tanam >= 1980 AND tahun_tanam <= EXTRACT(YEAR FROM CURRENT_DATE)),
  varietas VARCHAR(50) NOT NULL CHECK (varietas IN ('Tenera', 'Dura', 'Pisifera')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('Baik', 'Perlu Perhatian', 'Bermasalah')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 2. TASKS TABLE
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Pemupukan', 'Panen', 'Perawatan', 'Penyemprotan', 'Lainnya')),
  prioritas VARCHAR(20) NOT NULL CHECK (prioritas IN ('High', 'Normal', 'Low')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
  tanggal_target DATE NOT NULL,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 3. HARVESTS TABLE
-- ============================================
CREATE TABLE harvests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  jumlah_kg DECIMAL(10, 2) NOT NULL CHECK (jumlah_kg > 0),
  harga_per_kg DECIMAL(10, 2) NOT NULL CHECK (harga_per_kg > 0),
  total_nilai DECIMAL(15, 2) NOT NULL,
  kualitas VARCHAR(50) NOT NULL CHECK (kualitas IN ('Baik Sekali', 'Baik', 'Cukup', 'Kurang')),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 4. ISSUES TABLE
-- ============================================
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  area_terdampak VARCHAR(255) NOT NULL,
  tingkat_keparahan VARCHAR(20) NOT NULL CHECK (tingkat_keparahan IN ('Parah', 'Sedang', 'Ringan')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Open', 'Resolved')),
  foto_urls TEXT[], -- Array of image URLs
  solusi TEXT,
  tanggal_lapor DATE NOT NULL,
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 5. MAINTENANCES TABLE
-- ============================================
CREATE TABLE maintenances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  jenis_perawatan VARCHAR(50) NOT NULL CHECK (jenis_perawatan IN ('Pemupukan', 'Penyemprotan', 'Pemangkasan', 'Pembersihan', 'Lainnya')),
  judul VARCHAR(255) NOT NULL,
  tanggal_dijadwalkan DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Dijadwalkan', 'Selesai', 'Terlambat')),
  detail TEXT,
  penanggung_jawab VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval INTEGER, -- in days
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 6. DOCUMENTATION TABLE
-- ============================================
CREATE TABLE documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('foto', 'dokumen', 'catatan')),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file_url TEXT, -- for photos and documents
  content TEXT, -- for notes
  kategori VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 7. EXPENSES TABLE
-- ============================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Pupuk', 'Pestisida', 'Peralatan', 'Tenaga Kerja', 'Transportasi', 'Lainnya')),
  deskripsi VARCHAR(255) NOT NULL,
  jumlah DECIMAL(15, 2) NOT NULL CHECK (jumlah > 0),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- INDEXES for better query performance
-- ============================================

-- Gardens indexes
CREATE INDEX idx_gardens_slug ON gardens(slug);
CREATE INDEX idx_gardens_status ON gardens(status);
CREATE INDEX idx_gardens_created_at ON gardens(created_at);

-- Tasks indexes
CREATE INDEX idx_tasks_garden_id ON tasks(garden_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tanggal_target ON tasks(tanggal_target);

-- Harvests indexes
CREATE INDEX idx_harvests_garden_id ON harvests(garden_id);
CREATE INDEX idx_harvests_tanggal ON harvests(tanggal);

-- Issues indexes
CREATE INDEX idx_issues_garden_id ON issues(garden_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_tingkat_keparahan ON issues(tingkat_keparahan);

-- Maintenances indexes
CREATE INDEX idx_maintenances_garden_id ON maintenances(garden_id);
CREATE INDEX idx_maintenances_status ON maintenances(status);
CREATE INDEX idx_maintenances_tanggal_dijadwalkan ON maintenances(tanggal_dijadwalkan);

-- Documentation indexes
CREATE INDEX idx_documentation_garden_id ON documentation(garden_id);
CREATE INDEX idx_documentation_tipe ON documentation(tipe);

-- Expenses indexes
CREATE INDEX idx_expenses_garden_id ON expenses(garden_id);
CREATE INDEX idx_expenses_tanggal ON expenses(tanggal);
CREATE INDEX idx_expenses_kategori ON expenses(kategori);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_gardens_updated_at BEFORE UPDATE ON gardens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenances_updated_at BEFORE UPDATE ON maintenances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentation_updated_at BEFORE UPDATE ON documentation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate harvest total value
CREATE OR REPLACE FUNCTION calculate_harvest_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_nilai = NEW.jumlah_kg * NEW.harga_per_kg;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for harvest total calculation
CREATE TRIGGER calculate_harvest_total_trigger BEFORE INSERT OR UPDATE ON harvests
  FOR EACH ROW EXECUTE FUNCTION calculate_harvest_total();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Optional: Enable if you want user-based access control
-- ============================================

-- Enable RLS on all tables (uncomment if needed)
-- ALTER TABLE gardens ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE harvests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE maintenances ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE documentation ENABLE ROW LEVEL SECURITY;

-- Create policies (example for public access)
-- CREATE POLICY "Allow public access to gardens" ON gardens FOR ALL USING (true);
-- CREATE POLICY "Allow public access to tasks" ON tasks FOR ALL USING (true);
-- CREATE POLICY "Allow public access to harvests" ON harvests FOR ALL USING (true);
-- CREATE POLICY "Allow public access to issues" ON issues FOR ALL USING (true);
-- CREATE POLICY "Allow public access to maintenances" ON maintenances FOR ALL USING (true);
-- CREATE POLICY "Allow public access to documentation" ON documentation FOR ALL USING (true);

-- ============================================
-- COMMENTS for documentation
-- ============================================

COMMENT ON TABLE gardens IS 'Stores information about palm oil gardens';
COMMENT ON TABLE tasks IS 'Stores tasks and activities for each garden';
COMMENT ON TABLE harvests IS 'Records harvest data including quantity, price, and quality';
COMMENT ON TABLE issues IS 'Tracks problems and issues in gardens';
COMMENT ON TABLE maintenances IS 'Schedules and tracks maintenance activities';
COMMENT ON TABLE documentation IS 'Stores photos, documents, and notes for gardens';
COMMENT ON TABLE expenses IS 'Stores expense records for each garden including fertilizer, pesticides, equipment, labor, and other costs';
