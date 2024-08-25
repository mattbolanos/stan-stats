// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_SUPABASE_URL || "http://localhost:3000";
const supabaseServiceKey = process.env.NEXT_SUPABASE_SERVICE_KEY || "test";

export const supabase = createClient(supabaseURL, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: (...args) => {
      const [url, options] = args;
      return fetch(url, { ...options, next: { revalidate: 57600 } });
    },
  },
});
