// src/hooks/useSupabaseAuth.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

export function useSupabaseAuth() {
  const router = useRouter();
  const { user, setUser, setLoading, setError, clearState } = useAuthStore();

  // Initializer l'u00e9tat d'authentification et u00e9couter les changements
  useEffect(() => {
    // u00c9tat initial
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        setUser(data.session?.user || null);
      } catch (error: any) {
        console.error('Erreur d\'initialisation de l\'auth:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Ecouter les changements d'auth en temps ru00e9el
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        switch (event) {
          case 'SIGNED_IN':
            setUser(session?.user || null);
            router.refresh();
            break;
          case 'SIGNED_OUT':
            clearState();
            router.push('/login');
            break;
          case 'USER_UPDATED':
            setUser(session?.user || null);
            break;
          case 'TOKEN_REFRESHED':
            // Gestion du refresh de token
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async ({ email, password, metadata = {} }: { email: string; password: string; metadata?: any }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      clearState();
      return { success: true };
    } catch (error: any) {
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    signIn,
    signUp,
    signOut,
  };
}
