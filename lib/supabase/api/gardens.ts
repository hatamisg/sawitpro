import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';

type Garden = Database['public']['Tables']['gardens']['Row'];
type GardenInsert = Database['public']['Tables']['gardens']['Insert'];
type GardenUpdate = Database['public']['Tables']['gardens']['Update'];

// Convert database row to app format
function convertFromDb(garden: Garden) {
  return {
    id: garden.id,
    nama: garden.nama,
    lokasi: garden.lokasi,
    lokasiLengkap: garden.lokasi_lengkap,
    luas: Number(garden.luas),
    jumlahPohon: garden.jumlah_pohon,
    tahunTanam: garden.tahun_tanam,
    varietas: garden.varietas,
    status: garden.status,
    createdAt: new Date(garden.created_at),
    updatedAt: new Date(garden.updated_at),
  };
}

// Convert app format to database format
function convertToDb(garden: any): GardenInsert | GardenUpdate {
  return {
    nama: garden.nama,
    lokasi: garden.lokasi,
    lokasi_lengkap: garden.lokasiLengkap,
    luas: garden.luas,
    jumlah_pohon: garden.jumlahPohon,
    tahun_tanam: garden.tahunTanam,
    varietas: garden.varietas,
    status: garden.status,
  };
}

/**
 * Fetch all gardens
 */
export async function getAllGardens() {
  try {
    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .order('created_at', { ascending: false });

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
 * Fetch a single garden by ID
 */
export async function getGardenById(id: string) {
  try {
    validateUUID(id, 'Garden ID');

    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .eq('id', id)
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
 * Create a new garden
 */
export async function createGarden(garden: any) {
  try {
    const gardenData = convertToDb(garden) as GardenInsert;

    const { data, error } = await (supabase as any)
      .from('gardens')
      .insert(gardenData)
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
 * Update an existing garden
 */
export async function updateGarden(id: string, garden: any) {
  try {
    validateUUID(id, 'Garden ID');

    const gardenData = convertToDb(garden) as GardenUpdate;

    const { data, error } = await (supabase as any)
      .from('gardens')
      .update(gardenData)
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
 * Delete a garden
 */
export async function deleteGarden(id: string) {
  try {
    validateUUID(id, 'Garden ID');

    const { error } = await supabase
      .from('gardens')
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

/**
 * Search gardens by name or location
 */
export async function searchGardens(query: string) {
  try {
    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .or(`nama.ilike.%${query}%,lokasi.ilike.%${query}%`)
      .order('created_at', { ascending: false });

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
 * Filter gardens by status
 */
export async function getGardensByStatus(status: string) {
  try {
    const { data, error } = await supabase
      .from('gardens')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

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
