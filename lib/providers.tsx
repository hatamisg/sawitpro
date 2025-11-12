"use client";

import { ReactNode } from 'react';
import { GardensProvider } from './context/GardensContext';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Set to true to use Supabase, false to use mock data
  // You can also use an environment variable for this
  const useSupabase = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';

  return (
    <GardensProvider useSupabase={useSupabase}>
      {children}
    </GardensProvider>
  );
}
