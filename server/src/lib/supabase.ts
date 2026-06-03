import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL?.trim();
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment"
  );
}

/** Admin client — bypasses RLS for server-side operations */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/** Auth client — sign up / sign in (uses anon key) */
export const supabaseAuth: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey || supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const connectDatabase = async (): Promise<void> => {
  const { error } = await supabaseAdmin.from("profiles").select("id").limit(1);
  if (error && error.code !== "PGRST116") {
    console.warn("Supabase connection check:", error.message);
  }
  console.log("Supabase PostgreSQL connection ready");
};
