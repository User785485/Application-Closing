// src/hooks/useRealtimeSubscription.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

interface RealtimeOptions {
  event?: RealtimeEvent | RealtimeEvent[];
  schema?: string;
  filter?: string;
}

export function useRealtimeSubscription<T = any>(
  tableName: string,
  options: RealtimeOptions = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Charger les donnu00e9es initiales
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from(tableName).select('*');
        
        if (options.filter) {
          // Si un filtre est fourni, l'appliquer (par exemple 'user_id=eq.123')
          const [column, op_value] = options.filter.split('=');
          const [op, value] = op_value.split('.');
          
          // @ts-ignore - Supabase API typing complexity
          query = query.filter(column, op, value);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setData(data || []);
      } catch (err: any) {
        console.error(`Erreur lors du chargement des donnu00e9es de ${tableName}:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Configurer la souscription au temps ru00e9el
    const events = options.event ? 
      (Array.isArray(options.event) ? options.event : [options.event]) : 
      ['INSERT', 'UPDATE', 'DELETE'];

    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: events,
          schema: options.schema || 'public',
          table: tableName,
        },
        (payload) => {
          console.log('Changement reu00e7u:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setData((prev) => [...prev, payload.new as T]);
              break;
            case 'UPDATE':
              setData((prev) => 
                prev.map((item: any) => 
                  item.id === payload.new.id ? payload.new : item
                )
              );
              break;
            case 'DELETE':
              setData((prev) => 
                prev.filter((item: any) => item.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for ${tableName}:`, status);
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [tableName, user, options.event, options.schema, options.filter]);

  return { data, loading, error };
}
