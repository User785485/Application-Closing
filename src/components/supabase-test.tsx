"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export default function SupabaseTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        // Une requête simple pour vérifier la connexion
        const { data, error } = await supabase.from('test_connection').select('*').limit(1);
        
        if (error) {
          throw error;
        }
        
        setIsConnected(true);
        setError(null);
      } catch (err: any) {
        console.error('Erreur de connexion à Supabase:', err);
        setIsConnected(false);
        
        // Gérer les différents types d'erreurs
        if (err.message.includes('không tìm thấy bảng') || err.message.includes('relation "test_connection" does not exist')) {
          setError("La table test_connection n'existe pas, mais la connexion fonctionne. Vous pouvez créer vos propres tables.");
          setIsConnected(true);
        } else {
          setError(err.message || 'Erreur de connexion à Supabase');
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkConnection();
  }, []);

  return (
    <Card className="max-w-md mx-auto my-8">
      <Card.Header>
        <h2 className="text-xl font-semibold">Test de connexion Supabase</h2>
      </Card.Header>
      
      <Card.Body>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : isConnected ? (
          <>
            <div className="flex items-center text-green-600 mb-4">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">Connexion à Supabase établie</span>
            </div>
            
            {error && (
              <div className="text-yellow-600 bg-yellow-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center text-red-600 mb-4">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <span className="font-medium">Échec de connexion à Supabase</span>
            </div>
            
            {error && (
              <div className="text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mt-4 text-sm">
              <p>Vérifiez que:</p>
              <ul className="list-disc list-inside">
                <li>Les variables d'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont définies correctement</li>
                <li>Votre projet Supabase est en cours d'exécution</li>
                <li>Votre accès réseau n'est pas limité</li>
              </ul>
            </div>
          </>
        )}
      </Card.Body>
      
      <Card.Footer>
        <Button 
          onClick={() => window.location.reload()}
          className="w-full"
        >
          Tester à nouveau
        </Button>
      </Card.Footer>
    </Card>
  );
}
