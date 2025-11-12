import { supabase, handleSupabaseError } from '../client';
import { Database } from '../types';

type Issue = Database['public']['Tables']['issues']['Row'];
type IssueInsert = Database['public']['Tables']['issues']['Insert'];
type IssueUpdate = Database['public']['Tables']['issues']['Update'];

// Convert database row to app format
function convertFromDb(issue: Issue) {
  return {
    id: issue.id,
    gardenId: issue.garden_id,
    judul: issue.judul,
    deskripsi: issue.deskripsi,
    areaTerdampak: issue.area_terdampak,
    tingkatKeparahan: issue.tingkat_keparahan as 'Parah' | 'Sedang' | 'Ringan',
    status: issue.status as 'Open' | 'Resolved',
    fotoUrls: issue.foto_urls || undefined,
    solusi: issue.solusi || undefined,
    tanggalLapor: new Date(issue.tanggal_lapor),
    tanggalSelesai: issue.tanggal_selesai ? new Date(issue.tanggal_selesai) : undefined,
    createdAt: new Date(issue.created_at),
    updatedAt: new Date(issue.updated_at),
  };
}

// Convert app format to database format
function convertToDb(issue: any): IssueInsert | IssueUpdate {
  return {
    garden_id: issue.gardenId,
    judul: issue.judul,
    deskripsi: issue.deskripsi,
    area_terdampak: issue.areaTerdampak,
    tingkat_keparahan: issue.tingkatKeparahan,
    status: issue.status,
    foto_urls: issue.fotoUrls || null,
    solusi: issue.solusi || null,
    tanggal_lapor: issue.tanggalLapor instanceof Date
      ? issue.tanggalLapor.toISOString().split('T')[0]
      : issue.tanggalLapor,
    tanggal_selesai: issue.tanggalSelesai
      ? (issue.tanggalSelesai instanceof Date
          ? issue.tanggalSelesai.toISOString().split('T')[0]
          : issue.tanggalSelesai)
      : null,
  };
}

/**
 * Fetch all issues for a garden
 */
export async function getIssuesByGarden(gardenId: string) {
  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .eq('garden_id', gardenId)
      .order('tanggal_lapor', { ascending: false });

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
 * Create a new issue
 */
export async function createIssue(issue: any) {
  try {
    const issueData = convertToDb(issue) as IssueInsert;

    const { data, error } = await supabase
      .from('issues')
      .insert(issueData)
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
 * Update an issue
 */
export async function updateIssue(id: string, issue: any) {
  try {
    const issueData = convertToDb(issue) as IssueUpdate;

    const { data, error } = await supabase
      .from('issues')
      .update(issueData)
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
 * Update issue status
 */
export async function updateIssueStatus(id: string, status: 'Open' | 'Resolved') {
  try {
    const updateData: any = { status };

    if (status === 'Resolved') {
      updateData.tanggal_selesai = new Date().toISOString().split('T')[0];
    } else {
      updateData.tanggal_selesai = null;
    }

    const { data, error } = await supabase
      .from('issues')
      .update(updateData)
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
 * Delete an issue
 */
export async function deleteIssue(id: string) {
  try {
    const { error } = await supabase
      .from('issues')
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
