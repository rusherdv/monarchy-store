import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey);
export const user = supabase.auth.getUser()
