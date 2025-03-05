// src/lib/supabase/auth-utils.ts
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from './server';
import { redirect } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

/**
 * Vu00e9rifie si l'utilisateur est authentifiu00e9 et renvoie la session
 * @returns L'objet session ou null si non authentifiu00e9
 */
export async function getSession(): Promise<Session | null> {
  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Erreur lors de la ru00e9cupu00e9ration de la session:', error);
    return null;
  }
}

/**
 * Vu00e9rifie si l'utilisateur est authentifiu00e9, sinon redirige vers la page de connexion
 * @param redirectTo Chemin vers lequel rediriger apru00e8s l'authentification
 * @returns L'objet session si authentifiu00e9
 */
export async function requireAuth(redirectTo: string = '/auth/login'): Promise<Session> {
  const session = await getSession();
  
  if (!session) {
    const params = new URLSearchParams();
    
    if (redirectTo !== '/auth/login') {
      params.set('redirectTo', redirectTo);
    }
    
    const redirectUrl = params.size > 0 
      ? `${redirectTo}?${params.toString()}` 
      : redirectTo;
      
    redirect(redirectUrl);
  }
  
  return session;
}

/**
 * Vu00e9rifie si l'utilisateur est authentifiu00e9, si oui redirige vers le tableau de bord
 * @param redirectTo Chemin vers lequel rediriger si du00e9ju00e0 authentifiu00e9
 * @returns L'objet session ou null si non authentifiu00e9
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard'): Promise<Session | null> {
  const session = await getSession();
  
  if (session) {
    redirect(redirectTo);
  }
  
  return session;
}

/**
 * Ru00e9cupu00e8re le profil utilisateur complet depuis la base de donnu00e9es
 * @returns Le profil utilisateur ou null si non trouvu00e9/authentifiu00e9
 */
export async function getUserProfile() {
  const session = await getSession();
  
  if (!session) {
    return null;
  }
  
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la ru00e9cupu00e9ration du profil:', error);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Exception lors de la ru00e9cupu00e9ration du profil:', error);
    return null;
  }
}
