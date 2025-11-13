import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';

type Harvest = Database['public']['Tables']['harvests']['Row'];
type HarvestInsert = Database['public']['Tables']['harvests']['Insert'];

// Convert database row to app format
function convertFromDb(harvest: Harvest) {
  return {
    id: harvest.id,
    gardenId: harvest.garden_id,
    tanggal: new Date(harvest.tanggal),
    jumlahKg: Number(harvest.jumlah_kg),
    hargaPerKg: Number(harvest.harga_per_kg),
    totalNilai: Number(harvest.total_nilai),
    kualitas: harvest.kualitas as 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang',
    catatan: harvest.catatan || undefined,
    createdAt: new Date(harvest.created_at),
  };
}

// Convert app format to database format
function convertToDb(harvest: any): HarvestInsert {
  return {
    garden_id: harvest.gardenId,
    tanggal: harvest.tanggal instanceof Date
      ? harvest.tanggal.toISOString().split('T')[0]
      : harvest.tanggal,
    jumlah_kg: harvest.jumlahKg,
    harga_per_kg: harvest.hargaPerKg,
    kualitas: harvest.kualitas,
    catatan: harvest.catatan || null,
  };
}

/**
 * Fetch all harvests for a garden
 */
export async function getHarvestsByGarden(gardenId: string) {
  try {
    validateUUID(gardenId, 'Garden ID');

    const { data, error } = await supabase
      .from('harvests')
      .select('*')
      .eq('garden_id', gardenId)
      .order('tanggal', { ascending: false });

    if (error) throw error;

    return {
      data: data?.map(convertFromDb) || [],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Create a new harvest
 */
export async function createHarvest(harvest: any) {
  try {
    validateUUID(harvest.gardenId, 'Garden ID');

    const harvestData = convertToDb(harvest);

    const { data, error } = await (supabase as any)
      .from('harvests')
      .insert(harvestData)
      .select()
      .single();

    if (error) throw error;

    return {
      data: data ? convertFromDb(data) : null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Update an existing harvest
 */
export async function updateHarvest(id: string, harvest: any) {
  try {
    validateUUID(id, 'Harvest ID');

    const harvestData = convertToDb(harvest);

    const { data, error } = await (supabase as any)
      .from('harvests')
      .update(harvestData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      data: data ? convertFromDb(data) : null,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: handleSupabaseError(error),
    };
  }
}

/**
 * Delete a harvest
 */
export async function deleteHarvest(id: string) {
  try {
    validateUUID(id, 'Harvest ID');

    const { error } = await supabase
      .from('harvests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: handleSupabaseError(error),
    };
  }
}
