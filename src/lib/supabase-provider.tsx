"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type SupabaseContext = {
  supabase: SupabaseClient;
};

// Créer un contexte avec une valeur par défaut null-safe
const Context = createContext<SupabaseContext | undefined>(undefined);

export interface Props {
  children: ReactNode;
}

export function SupabaseProvider({ children }: Props) {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialisation du client Supabase
  useEffect(() => {
    try {
      console.log('Initializing Supabase client...');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set');
      console.log('Supabase Key defined:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No');
      
      // Vérifier que les variables d'environnement sont définies
      if (!supabase) {
        throw new Error('Supabase client could not be initialized');
      }
      
      setClient(supabase);
      setIsReady(true);
      console.log('Supabase client initialized successfully');
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
      setError(err instanceof Error ? err.message : 'Unknown error initializing Supabase');
      setIsReady(false);
    }
  }, []);

  // Configurer le listener d'événements d'authentification
  useEffect(() => {
    if (!client) return;
    
    console.log('Setting up Supabase auth listener...');
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event) => {
          console.log(`Supabase auth event: ${event}`);
        }
      );

      return () => {
        console.log('Cleaning up Supabase auth listener...');
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up auth listener:', err);
    }
  }, [client]);

  // Afficher un état de chargement ou d'erreur si nécessaire
  if (!isReady) {
    console.log('Supabase provider not ready yet...');
    // Optionnellement retourner un composant de chargement au lieu de null
    return (
      <div className="flex items-center justify-center min-h-screen">
        {error ? (
          <div className="text-red-500">
            <p>Erreur d'initialisation: {error}</p>
          </div>
        ) : (
          <p>Chargement de l'application...</p>
        )}
      </div>
    );
  }

  return (
    <Context.Provider value={{ supabase: client as SupabaseClient }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
