import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client Configuration
 *
 * Make sure to create a .env file with your Supabase credentials:
 * VITE_SUPABASE_URL=your-supabase-url
 * VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "⚠️ Missing Supabase environment variables.\n" +
      "Please create a .env file with:\n" +
      "VITE_SUPABASE_URL=your-supabase-url\n" +
      "VITE_SUPABASE_ANON_KEY=your-supabase-anon-key"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
