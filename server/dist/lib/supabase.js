"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.supabaseAuth = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment");
}
/** Admin client — bypasses RLS for server-side operations */
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
/** Auth client — sign up / sign in (uses anon key) */
exports.supabaseAuth = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
const connectDatabase = async () => {
    const { error } = await exports.supabaseAdmin.from("profiles").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
        console.warn("Supabase connection check:", error.message);
    }
    console.log("Supabase PostgreSQL connection ready");
};
exports.connectDatabase = connectDatabase;
