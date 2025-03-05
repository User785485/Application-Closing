import { createClient } from '@supabase/supabase-js';

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erreur critique: Variables d\'environnement Supabase manquantes');
}

// Logger les informations de configuration
console.log(`Supabase initialization: URL ${supabaseUrl?.substring(0, 15)}... Key defined: ${!!supabaseAnonKey}`);

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'my-muqabala' },
  },
};

let supabaseClient = null;

try {
  // Initialiser le client Supabase avec des options avancées
  supabaseClient = createClient(supabaseUrl || '', supabaseAnonKey || '', options);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

// Exporter le client Supabase
export const supabase = supabaseClient;