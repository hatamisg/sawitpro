"use client";

import { ReactNode } from 'react';
import { GardensProvider } from './context/GardensContext';
import { isSupabaseConfigured } from './supabase/client';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Determine whether to use Supabase:
  // 1. If NEXT_PUBLIC_USE_SUPABASE is explicitly set, use that value
  // 2. Otherwise, auto-detect based on whether Supabase is configured
  const envUseSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE;
  const useSupabase = envUseSupabase !== undefined
    ? envUseSupabase === 'true'
    : isSupabaseConfigured();

  return (
    <GardensProvider useSupabase={useSupabase}>
      {children}
    </GardensProvider>
  );
}
