"use client";

import { useEffect, useState } from 'react';
import { useSupabase } from '../lib/supabase-provider';

export default function Home() {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase.from('test_connection').select('*').limit(1);
        
        if (error) {
          console.error('Supabase connection error:', error);
          setIsConnected(false);
        } else {
          console.log('Supabase connection successful');
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, [supabase]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="mt-8 mb-4">Bienvenue sur My Muqabala 3.0</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Votre plateforme de coaching et de développement personnel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400">Accédez à vos statistiques et indicateurs de performance.</p>
          <a href="/dashboard" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            Voir le tableau de bord &rarr;
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Clients</h2>
          <p className="text-gray-500 dark:text-gray-400">Gérez vos clients et suivez leur progression.</p>
          <a href="/clients" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            Gérer les clients &rarr;
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Scripts</h2>
          <p className="text-gray-500 dark:text-gray-400">Accédez aux scripts de vente et de coaching.</p>
          <a href="/scripts" className="mt-4 inline-block text-primary-600 hover:text-primary-500">
            Voir les scripts &rarr;
          </a>
        </div>
      </div>

      <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Statut de la connexion Supabase:</h3>
        {isLoading ? (
          <p className="text-gray-500">Vérification de la connexion...</p>
        ) : isConnected ? (
          <p className="text-green-500">Connecté à Supabase ✓</p>
        ) : (
          <p className="text-red-500">Non connecté à Supabase ✗</p>
        )}
      </div>
    </div>
  );
}
