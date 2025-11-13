import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';
import { validateUUID } from '@/lib/utils';

type Documentation = Database['public']['Tables']['documentation']['Row'];
type DocumentationInsert = Database['public']['Tables']['documentation']['Insert'];
type DocumentationUpdate = Database['public']['Tables']['documentation']['Update'];

// Convert database row to app format
function convertFromDb(doc: Documentation) {
  return {
    id: doc.id,
    gardenId: doc.garden_id,
    tipe: doc.tipe as 'foto' | 'dokumen' | 'catatan',
    judul: doc.judul,
    deskripsi: doc.deskripsi || undefined,
    fileUrl: doc.file_url || undefined,
    content: doc.content || undefined,
    kategori: doc.kategori || undefined,
    createdAt: new Date(doc.created_at),
    updatedAt: new Date(doc.updated_at),
  };
}

// Convert app format to database format for insert
function convertToDbInsert(doc: any): DocumentationInsert {
  return {
    garden_id: doc.gardenId,
    tipe: doc.tipe,
    judul: doc.judul,
    deskripsi: doc.deskripsi || null,
    file_url: doc.fileUrl || null,
    content: doc.content || null,
    kategori: doc.kategori || null,
  };
}

// Convert app format to database format for update
function convertToDbUpdate(doc: any): DocumentationUpdate {
  return {
    garden_id: doc.gardenId,
    tipe: doc.tipe,
    judul: doc.judul,
    deskripsi: doc.deskripsi || null,
    file_url: doc.fileUrl || null,
    content: doc.content || null,
    kategori: doc.kategori || null,
  };
}

/**
 * Fetch all documentation for a garden
 */
export async function getDocumentationByGarden(gardenId: string) {
  try {
    validateUUID(gardenId, 'Garden ID');

    const { data, error } = await (supabase as any)
      .from('documentation')
      .select('*')
      .eq('garden_id', gardenId)
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
 * Fetch documentation by type
 */
export async function getDocumentationByType(gardenId: string, tipe: 'foto' | 'dokumen' | 'catatan') {
  try {
    validateUUID(gardenId, 'Garden ID');

    const { data, error } = await (supabase as any)
      .from('documentation')
      .select('*')
      .eq('garden_id', gardenId)
      .eq('tipe', tipe)
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
 * Create new documentation
 */
export async function createDocumentation(doc: any) {
  try {
    validateUUID(doc.gardenId, 'Garden ID');

    const docData = convertToDbInsert(doc);

    const { data, error } = await (supabase as any)
      .from('documentation')
      .insert(docData)
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
 * Update documentation
 */
export async function updateDocumentation(id: string, doc: any) {
  try {
    validateUUID(id, 'Documentation ID');

    const docData = convertToDbUpdate(doc);

    const { data, error } = await (supabase as any)
      .from('documentation')
      .update(docData)
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
 * Delete documentation
 */
export async function deleteDocumentation(id: string) {
  try {
    validateUUID(id, 'Documentation ID');

    const { error } = await (supabase as any)
      .from('documentation')
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
