import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vldkberonuuujnoiscwl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZGtiZXJvbnV1dWpub2lzY3dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNjczMjAsImV4cCI6MjA1Njc0MzMyMH0.5VbPa3J0KkDQ26xrpIxsRStmhQrnyVq6ZCtzUZz9Kmg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
