import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase com fallback direto para garantir funcionamento na nuvem e deploy estático
const DEFAULT_SUPABASE_URL = 'https://xunvbrwdbdcktgjctzjx.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_8teQXieDX80qnXj8XSw-lA_a4zjY2AS';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

// Cria o cliente Supabase garantindo persistência online
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
