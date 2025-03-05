"use client";

import { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import SupabaseTest from "../components/supabase-test";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Détection si l'application s'exécute en mode dev ou production
  const isProduction = process.env.NODE_ENV === 'production';

  useEffect(() => {
    console.log(`Page is initializing (${process.env.NODE_ENV} mode)`);
    
    try {
      // Initialiser la page
      setInitializing(false);
      setLoading(false);
      console.log('Page initialized successfully');
    } catch (err) {
      console.error('Error initializing page:', err);
      setError(err instanceof Error ? err.message : 'Unknown error initializing page');
      setLoading(false);
    }
  }, []);

  // Afficher un état de chargement
  if (initializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-center">Chargement de l'application...</p>
      </div>
    );
  }

  // Afficher une erreur si nécessaire
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg mb-4 max-w-2xl">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-200 mb-2">Erreur d'initialisation</h2>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Recharger la page
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-6">My Muqabala 3.0</h1>
        <p className="text-xl mb-8">Plateforme de coaching et de développement personnel</p>
        
        {/* Informations sur l'environnement */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-2">Informations sur l'environnement</h2>
          <p>Mode: <span className="font-mono">{isProduction ? 'Production' : 'Développement'}</span></p>
          <p>Node.js: <span className="font-mono">{process.version || 'Non disponible'}</span></p>
          <p>URL Supabase: <span className="font-mono">{process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 15)}...</span></p>
        </div>
        
        {/* Composant de test Supabase */}
        <SupabaseTest />
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline">
            Accéder au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
}