// src/lib/supabase/queries.ts
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Utilitaires pour les requêtes Supabase fréquemment utilisées
 * Ces fonctions encapsulent les opérations courantes et gèrent les erreurs de manière cohérente
 */

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

type FilterParams = Record<string, any>;

interface QueryOptions extends PaginationParams {
  filters?: FilterParams;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Récupère tous les éléments d'une table avec pagination et filtrage optionnels
 */
export async function fetchItems<T>(
  tableName: string, 
  options: QueryOptions = {}
): Promise<{ data: T[] | null; count: number | null; error: Error | null }> {
  try {
    const {
      page = 1,
      pageSize = 10,
      filters = {},
      orderBy,
      orderDirection = 'desc'
    } = options;
    
    // Calculer le décalage pour la pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Construire la requête de base
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(from, to);
    
    // Ajouter les filtres
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });
    
    // Ajouter le tri
    if (orderBy) {
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
    }
    
    // Exécuter la requête
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { data, count, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des éléments depuis ${tableName}:`, error.message);
    return { data: null, count: null, error };
  }
}

/**
 * Récupère un élément spécifique par son ID
 */
export async function fetchItemById<T>(
  tableName: string, 
  id: string | number
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération de l'élément ${id} depuis ${tableName}:`, error.message);
    return { data: null, error };
  }
}

/**
 * Crée un nouvel élément dans la table spécifiée
 */
export async function createItem<T>(
  tableName: string, 
  itemData: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(itemData)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la création d'un élément dans ${tableName}:`, error.message);
    return { data: null, error };
  }
}

/**
 * Met à jour un élément existant dans la table spécifiée
 */
export async function updateItem<T>(
  tableName: string, 
  id: string | number, 
  updates: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'élément ${id} dans ${tableName}:`, error.message);
    return { data: null, error };
  }
}

/**
 * Supprime un élément de la table spécifiée
 */
export async function deleteItem(
  tableName: string, 
  id: string | number
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la suppression de l'élément ${id} dans ${tableName}:`, error.message);
    return { success: false, error };
  }
}

/**
 * Récupère le profil utilisateur courant
 */
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du profil utilisateur:`, error.message);
    return { data: null, error };
  }
}

/**
 * Récupère tous les rendez-vous d'un utilisateur
 */
export async function fetchUserAppointments(userId: string, options: QueryOptions = {}) {
  try {
    const {
      page = 1,
      pageSize = 10,
      filters = {},
      orderBy = 'start_time',
      orderDirection = 'asc'
    } = options;
    
    // Calculer le décalage pour la pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Combiner les filtres avec le filtre utilisateur
    const allFilters = { ...filters, user_id: userId };
    
    // Construire la requête
    let query = supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .range(from, to);
    
    // Ajouter les filtres
    Object.entries(allFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query = query.eq(key, value);
      }
    });
    
    // Ajouter le tri
    query = query.order(orderBy, { ascending: orderDirection === 'asc' });
    
    // Exécuter la requête
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    return { data, count, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération des rendez-vous:`, error.message);
    return { data: null, count: null, error };
  }
}

/**
 * Met à jour ou crée les préférences utilisateur
 */
export async function updateUserPreferences(userId: string, preferences: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour des préférences utilisateur:`, error.message);
    return { data: null, error };
  }
}
