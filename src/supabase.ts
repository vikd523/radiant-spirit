/**
 * Supabase Client — Initialize and export the Supabase client.
 * Uses VITE_ env vars so Vite can inline them at build time.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing env vars — auth features will be disabled');
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;
