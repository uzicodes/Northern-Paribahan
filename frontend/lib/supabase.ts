// frontend/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Fallback values are provided to prevent build errors during static generation
// if environment variables are missing. The app will still require valid
// credentials to function correctly at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);