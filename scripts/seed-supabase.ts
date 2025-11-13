/**
 * Script to seed Supabase database with mock data
 * Run this script after setting up your Supabase project
 *
 * Usage: npm run seed
 *
 * Prerequisites:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run the schema.sql file in Supabase SQL Editor
 * 3. Copy .env.local.example to .env.local and fill in your Supabase credentials
 * 4. Run this script: npm run seed
 */

import { supabase } from '../lib/supabase/client';
import { gardens, tasks, harvests, issues, maintenances, documentation, expenses } from '../lib/data/mock-data';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Seed Gardens
    console.log('📍 Seeding gardens...');
    const gardenPromises = gardens.map(async (garden) => {
      const { data, error } = await (supabase as any)
        .from('gardens')
        .insert({
          id: garden.id,
          nama: garden.nama,
          lokasi: garden.lokasi,
          lokasi_lengkap: garden.lokasiLengkap,
          luas: garden.luas,
          jumlah_pohon: garden.jumlahPohon,
          tahun_tanam: garden.tahunTanam,
          varietas: garden.varietas,
          status: garden.status,
          created_at: garden.createdAt.toISOString(),
          updated_at: garden.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding garden ${garden.nama}:`, error.message);
      } else {
        console.log(`  ✅ Seeded garden: ${garden.nama}`);
      }
      return data;
    });

    await Promise.all(gardenPromises);
    console.log(`✅ Seeded ${gardens.length} gardens\n`);

    // 2. Seed Tasks
    console.log('📋 Seeding tasks...');
    const taskPromises = tasks.map(async (task) => {
      const { data, error } = await (supabase as any)
        .from('tasks')
        .insert({
          id: task.id,
          garden_id: task.gardenId,
          judul: task.judul,
          deskripsi: task.deskripsi || null,
          kategori: task.kategori,
          prioritas: task.prioritas,
          status: task.status,
          tanggal_target: task.tanggalTarget.toISOString().split('T')[0],
          assigned_to: task.assignedTo || null,
          created_at: task.createdAt.toISOString(),
          updated_at: task.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding task ${task.judul}:`, error.message);
      }
      return data;
    });

    await Promise.all(taskPromises);
    console.log(`✅ Seeded ${tasks.length} tasks\n`);

    // 3. Seed Harvests
    console.log('🌾 Seeding harvests...');
    const harvestPromises = harvests.map(async (harvest) => {
      const { data, error } = await (supabase as any)
        .from('harvests')
        .insert({
          id: harvest.id,
          garden_id: harvest.gardenId,
          tanggal: harvest.tanggal.toISOString().split('T')[0],
          jumlah_kg: harvest.jumlahKg,
          harga_per_kg: harvest.hargaPerKg,
          total_nilai: harvest.totalNilai,
          kualitas: harvest.kualitas,
          catatan: harvest.catatan || null,
          created_at: harvest.createdAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding harvest:`, error.message);
      }
      return data;
    });

    await Promise.all(harvestPromises);
    console.log(`✅ Seeded ${harvests.length} harvests\n`);

    // 4. Seed Issues
    console.log('⚠️  Seeding issues...');
    const issuePromises = issues.map(async (issue) => {
      const { data, error } = await (supabase as any)
        .from('issues')
        .insert({
          id: issue.id,
          garden_id: issue.gardenId,
          judul: issue.judul,
          deskripsi: issue.deskripsi,
          area_terdampak: issue.areaTerdampak,
          tingkat_keparahan: issue.tingkatKeparahan,
          status: issue.status,
          foto_urls: issue.fotoUrls || null,
          solusi: issue.solusi || null,
          tanggal_lapor: issue.tanggalLapor.toISOString().split('T')[0],
          tanggal_selesai: issue.tanggalSelesai ? issue.tanggalSelesai.toISOString().split('T')[0] : null,
          created_at: issue.createdAt.toISOString(),
          updated_at: issue.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding issue ${issue.judul}:`, error.message);
      }
      return data;
    });

    await Promise.all(issuePromises);
    console.log(`✅ Seeded ${issues.length} issues\n`);

    // 5. Seed Maintenances
    console.log('🔧 Seeding maintenances...');
    const maintenancePromises = maintenances.map(async (maintenance) => {
      const { data, error } = await (supabase as any)
        .from('maintenances')
        .insert({
          id: maintenance.id,
          garden_id: maintenance.gardenId,
          jenis_perawatan: maintenance.jenisPerawatan,
          judul: maintenance.judul,
          tanggal_dijadwalkan: maintenance.tanggalDijadwalkan.toISOString().split('T')[0],
          status: maintenance.status,
          detail: maintenance.detail || null,
          penanggung_jawab: maintenance.penanggungJawab || null,
          is_recurring: maintenance.isRecurring,
          recurring_interval: maintenance.recurringInterval || null,
          tanggal_selesai: maintenance.tanggalSelesai ? maintenance.tanggalSelesai.toISOString().split('T')[0] : null,
          created_at: maintenance.createdAt.toISOString(),
          updated_at: maintenance.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding maintenance ${maintenance.judul}:`, error.message);
      }
      return data;
    });

    await Promise.all(maintenancePromises);
    console.log(`✅ Seeded ${maintenances.length} maintenances\n`);

    // 6. Seed Documentation
    console.log('📄 Seeding documentation...');
    const docPromises = documentation.map(async (doc) => {
      const { data, error } = await (supabase as any)
        .from('documentation')
        .insert({
          id: doc.id,
          garden_id: doc.gardenId,
          tipe: doc.tipe,
          judul: doc.judul,
          deskripsi: doc.deskripsi || null,
          file_url: doc.fileUrl || null,
          content: doc.content || null,
          kategori: doc.kategori || null,
          created_at: doc.createdAt.toISOString(),
          updated_at: doc.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding documentation ${doc.judul}:`, error.message);
      }
      return data;
    });

    await Promise.all(docPromises);
    console.log(`✅ Seeded ${documentation.length} documentation items\n`);

    // 7. Seed Expenses
    console.log('💰 Seeding expenses...');
    const expensePromises = expenses.map(async (expense) => {
      const { data, error } = await (supabase as any)
        .from('expenses')
        .insert({
          id: expense.id,
          garden_id: expense.gardenId,
          tanggal: expense.tanggal.toISOString().split('T')[0],
          kategori: expense.kategori,
          deskripsi: expense.deskripsi,
          jumlah: expense.jumlah,
          catatan: expense.catatan || null,
          created_at: expense.createdAt.toISOString(),
          updated_at: expense.updatedAt.toISOString(),
        })
        .select();

      if (error) {
        console.error(`  ❌ Error seeding expense:`, error.message);
      }
      return data;
    });

    await Promise.all(expensePromises);
    console.log(`✅ Seeded ${expenses.length} expenses\n`);

    console.log('✅ Database seeding completed successfully! 🎉\n');
    console.log('Summary:');
    console.log(`  - Gardens: ${gardens.length}`);
    console.log(`  - Tasks: ${tasks.length}`);
    console.log(`  - Harvests: ${harvests.length}`);
    console.log(`  - Issues: ${issues.length}`);
    console.log(`  - Maintenances: ${maintenances.length}`);
    console.log(`  - Documentation: ${documentation.length}`);
    console.log(`  - Expenses: ${expenses.length}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
