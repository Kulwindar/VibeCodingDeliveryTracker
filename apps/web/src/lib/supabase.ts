import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Demo mode: no URL OR localhost (for development without running Supabase)
export const isDemoMode = () => !supabaseUrl || supabaseUrl === 'http://localhost:54321';

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && !isDemoMode()) {
  supabaseClient = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
}

export const supabase = supabaseClient;