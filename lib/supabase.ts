

import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
  // Fixed: Replaced import.meta.env with process.env to resolve TypeScript property errors on ImportMeta
  // Önce Vercel/Environment Variables, sonra LocalStorage, en son varsayılan kod içi değerler.
  const envUrl = (process.env as any).VITE_SUPABASE_URL;
  const envKey = (process.env as any).VITE_SUPABASE_ANON_KEY;
  
  const savedUrl = localStorage.getItem('qresta_supabase_url');
  const savedKey = localStorage.getItem('qresta_supabase_key');
  
  const defaultUrl = 'https://mwehtrluglznrjoszjbt.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13ZWh0cmx1Z2x6bnJqb3N6amJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzA3NTEsImV4cCI6MjA4NjY0Njc1MX0.F1G5x2BpImtFliPP3agr3ojjZDIR1xp1XY5w_Ic1NbA';

  return {
    url: envUrl || savedUrl || defaultUrl,
    key: envKey || savedKey || defaultKey
  };
};

const config = getSupabaseConfig();
export const supabase = createClient(config.url, config.key);

export const refreshSupabaseClient = () => {
  window.location.reload();
};
