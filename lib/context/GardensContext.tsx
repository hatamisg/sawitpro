"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Garden } from '@/types';
import * as gardensApi from '@/lib/supabase/api/gardens';
import { gardens as mockGardens } from '@/lib/data/mock-data';
import { toast } from 'sonner';
import { generateUUID } from '@/lib/utils';

interface GardensContextType {
  gardens: Garden[];
  loading: boolean;
  error: string | null;
  refreshGardens: () => Promise<void>;
  createGarden: (garden: Omit<Garden, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateGarden: (id: string, garden: Omit<Garden, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  deleteGarden: (id: string) => Promise<boolean>;
  getGardenById: (id: string) => Garden | undefined;
}

const GardensContext = createContext<GardensContextType | undefined>(undefined);

interface GardensProviderProps {
  children: ReactNode;
  useSupabase?: boolean; // Toggle between Supabase and mock data
}

export function GardensProvider({ children, useSupabase = false }: GardensProviderProps) {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if Supabase is configured
  const isSupabaseConfigured = () => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  };

  // Determine if we should use Supabase
  const shouldUseSupabase = useSupabase && isSupabaseConfigured();

  // Fetch gardens on mount
  useEffect(() => {
    refreshGardens();
  }, [shouldUseSupabase]);

  const refreshGardens = async () => {
    setLoading(true);
    setError(null);

    try {
      if (shouldUseSupabase) {
        // Fetch from Supabase
        const { data, error } = await gardensApi.getAllGardens();

        if (error) {
          throw new Error(error);
        }

        setGardens(data || []);
      } else {
        // Use mock data
        setGardens(mockGardens);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch gardens';
      setError(errorMessage);
      console.error('Error fetching gardens:', err);

      // Fallback to mock data if Supabase fails
      if (shouldUseSupabase) {
        console.log('Falling back to mock data');
        setGardens(mockGardens);
      }
    } finally {
      setLoading(false);
    }
  };

  const createGarden = async (gardenData: Omit<Garden, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      if (shouldUseSupabase) {
        // Create in Supabase
        const { data, error } = await gardensApi.createGarden(gardenData);

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setGardens(prev => [data, ...prev]);
          toast.success('Kebun berhasil ditambahkan!');
          return true;
        }
      } else {
        // Create in local state (mock)
        const newGarden: Garden = {
          ...gardenData,
          id: generateUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setGardens(prev => [newGarden, ...prev]);
        toast.success('Kebun berhasil ditambahkan!');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create garden';
      toast.error(errorMessage);
      console.error('Error creating garden:', err);
      return false;
    }
  };

  const updateGarden = async (id: string, gardenData: Omit<Garden, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      if (shouldUseSupabase) {
        // Update in Supabase
        const { data, error } = await gardensApi.updateGarden(id, gardenData);

        if (error) {
          throw new Error(error);
        }

        if (data) {
          setGardens(prev => prev.map(g => g.id === id ? data : g));
          toast.success('Kebun berhasil diperbarui!');
          return true;
        }
      } else {
        // Update in local state (mock)
        setGardens(prev => prev.map(g =>
          g.id === id
            ? { ...g, ...gardenData, updatedAt: new Date() }
            : g
        ));
        toast.success('Kebun berhasil diperbarui!');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update garden';
      toast.error(errorMessage);
      console.error('Error updating garden:', err);
      return false;
    }
  };

  const deleteGarden = async (id: string): Promise<boolean> => {
    try {
      if (shouldUseSupabase) {
        // Delete from Supabase
        const { success, error } = await gardensApi.deleteGarden(id);

        if (error) {
          throw new Error(error);
        }

        if (success) {
          setGardens(prev => prev.filter(g => g.id !== id));
          toast.success('Kebun berhasil dihapus!');
          return true;
        }
      } else {
        // Delete from local state (mock)
        setGardens(prev => prev.filter(g => g.id !== id));
        toast.success('Kebun berhasil dihapus!');
        return true;
      }

      return false;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete garden';
      toast.error(errorMessage);
      console.error('Error deleting garden:', err);
      return false;
    }
  };

  const getGardenById = (id: string): Garden | undefined => {
    return gardens.find(g => g.id === id);
  };

  const value: GardensContextType = {
    gardens,
    loading,
    error,
    refreshGardens,
    createGarden,
    updateGarden,
    deleteGarden,
    getGardenById,
  };

  return (
    <GardensContext.Provider value={value}>
      {children}
    </GardensContext.Provider>
  );
}

// Custom hook to use the GardensContext
export function useGardens() {
  const context = useContext(GardensContext);
  if (context === undefined) {
    throw new Error('useGardens must be used within a GardensProvider');
  }
  return context;
}
