// src/lib/supabase/index.ts
// Export des clients et utilitaires Supabase pour faciliter l'importation

export { supabase } from './client';
export { createServerSupabaseClient } from './server';
export { getSession, requireAuth, redirectIfAuthenticated, getUserProfile } from './auth-utils';

// Reu00e9exporter les types de session et d'erreur d'authentification pour faciliter l'accu00e8s
export type { Session, AuthError, PostgrestError } from '@supabase/supabase-js';
