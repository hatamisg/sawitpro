import { supabase, handleSupabaseError } from '../client';
import { validateUUID } from '@/lib/utils';

// Note: expenses table types not yet generated in Database types
// Using any types temporarily until Supabase types are regenerated

// Convert database row to app format
function convertFromDb(expense: any) {
  return {
    id: expense.id,
    gardenId: expense.garden_id,
    tanggal: new Date(expense.tanggal),
    kategori: expense.kategori as 'Pupuk' | 'Pestisida' | 'Peralatan' | 'Tenaga Kerja' | 'Transportasi' | 'Lainnya',
    deskripsi: expense.deskripsi,
    jumlah: Number(expense.jumlah),
    catatan: expense.catatan || undefined,
    createdAt: new Date(expense.created_at),
    updatedAt: new Date(expense.updated_at),
  };
}

// Convert app format to database format
function convertToDb(expense: any): any {
  return {
    garden_id: expense.gardenId,
    tanggal: expense.tanggal instanceof Date
      ? expense.tanggal.toISOString().split('T')[0]
      : expense.tanggal,
    kategori: expense.kategori,
    deskripsi: expense.deskripsi,
    jumlah: expense.jumlah,
    catatan: expense.catatan || null,
  };
}

/**
 * Fetch all expenses for a garden
 */
export async function getExpensesByGarden(gardenId: string) {
  try {
    validateUUID(gardenId, 'Garden ID');

    const { data, error } = await (supabase as any)
      .from('expenses')
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
 * Create a new expense
 */
export async function createExpense(expense: any) {
  try {
    validateUUID(expense.gardenId, 'Garden ID');

    const expenseData = convertToDb(expense);

    const { data, error } = await (supabase as any)
      .from('expenses')
      .insert(expenseData)
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
 * Update an existing expense
 */
export async function updateExpense(id: string, expense: any) {
  try {
    validateUUID(id, 'Expense ID');

    const expenseData = convertToDb(expense);

    const { data, error } = await (supabase as any)
      .from('expenses')
      .update(expenseData)
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
 * Delete an expense
 */
export async function deleteExpense(id: string) {
  try {
    validateUUID(id, 'Expense ID');

    const { error } = await (supabase as any)
      .from('expenses')
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
