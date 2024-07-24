// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL || "http://localhost:3000";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "test";

export const supabase = createClient(supabaseURL, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
