// src/lib/supabase/db-utils.ts
import { createServerSupabaseClient } from './server';
import { supabase as browserClient } from './client';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update'];

type QueryResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

/**
 * Ru00e9cupu00e8re tous les enregistrements d'une table avec filtrage optionnel
 * @param table Nom de la table Supabase
 * @param options Options de filtrage et de projection
 * @param useServerClient Utilise le client serveur si vrai, sinon client navigateur
 */
export async function fetchRecords<T extends TableName>(
  table: T,
  options?: {
    select?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  },
  useServerClient: boolean = false
): Promise<QueryResponse<TableRow<T>[]>> {
  const client = useServerClient ? createServerSupabaseClient() : browserClient;
  const { select = '*', filters = {}, order, limit, offset } = options || {};
  
  try {
    let query = client.from(table).select(select);
    
    // Appliquer les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
    
    // Appliquer l'ordre
    if (order) {
      query = query.order(order.column, { ascending: order.ascending ?? true });
    }
    
    // Appliquer la limite
    if (limit) {
      query = query.limit(limit);
    }
    
    // Appliquer le du00e9calage
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    return { data: data as TableRow<T>[], error };
  } catch (error) {
    console.error(`Erreur lors de la ru00e9cupu00e9ration des enregistrements de ${table}:`, error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Ru00e9cupu00e8re un enregistrement unique par son ID
 * @param table Nom de la table Supabase
 * @param id Identifiant de l'enregistrement
 * @param select Champs u00e0 su00e9lectionner
 * @param useServerClient Utilise le client serveur si vrai, sinon client navigateur
 */
export async function fetchRecordById<T extends TableName>(
  table: T,
  id: string | number,
  select: string = '*',
  useServerClient: boolean = false
): Promise<QueryResponse<TableRow<T>>> {
  const client = useServerClient ? createServerSupabaseClient() : browserClient;
  
  try {
    const { data, error } = await client
      .from(table)
      .select(select)
      .eq('id', id)
      .single();
    
    return { data: data as TableRow<T>, error };
  } catch (error) {
    console.error(`Erreur lors de la ru00e9cupu00e9ration de l'enregistrement ${id} de ${table}:`, error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Inu00e8re un nouvel enregistrement dans une table
 * @param table Nom de la table Supabase
 * @param data Donnu00e9es u00e0 inu00e9rer
 * @param useServerClient Utilise le client serveur si vrai, sinon client navigateur
 */
export async function insertRecord<T extends TableName>(
  table: T,
  data: TableInsert<T>,
  useServerClient: boolean = false
): Promise<QueryResponse<TableRow<T>>> {
  const client = useServerClient ? createServerSupabaseClient() : browserClient;
  
  try {
    const { data: result, error } = await client
      .from(table)
      .insert(data)
      .select();
    
    return { 
      data: result?.[0] as TableRow<T> || null, 
      error 
    };
  } catch (error) {
    console.error(`Erreur lors de l'insertion dans ${table}:`, error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Met u00e0 jour un enregistrement existant par son ID
 * @param table Nom de la table Supabase
 * @param id Identifiant de l'enregistrement
 * @param data Donnu00e9es u00e0 mettre u00e0 jour
 * @param useServerClient Utilise le client serveur si vrai, sinon client navigateur
 */
export async function updateRecord<T extends TableName>(
  table: T,
  id: string | number,
  data: TableUpdate<T>,
  useServerClient: boolean = false
): Promise<QueryResponse<TableRow<T>>> {
  const client = useServerClient ? createServerSupabaseClient() : browserClient;
  
  try {
    const { data: result, error } = await client
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    return { 
      data: result?.[0] as TableRow<T> || null, 
      error 
    };
  } catch (error) {
    console.error(`Erreur lors de la mise u00e0 jour de l'enregistrement ${id} de ${table}:`, error);
    return { data: null, error: error as PostgrestError };
  }
}

/**
 * Supprime un enregistrement par son ID
 * @param table Nom de la table Supabase
 * @param id Identifiant de l'enregistrement
 * @param useServerClient Utilise le client serveur si vrai, sinon client navigateur
 */
export async function deleteRecord<T extends TableName>(
  table: T,
  id: string | number,
  useServerClient: boolean = false
): Promise<QueryResponse<null>> {
  const client = useServerClient ? createServerSupabaseClient() : browserClient;
  
  try {
    const { error } = await client
      .from(table)
      .delete()
      .eq('id', id);
    
    return { data: null, error };
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'enregistrement ${id} de ${table}:`, error);
    return { data: null, error: error as PostgrestError };
  }
}
