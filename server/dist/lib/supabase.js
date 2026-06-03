"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = exports.supabaseAuth = exports.supabaseAdmin = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = (_a = process.env.SUPABASE_URL) === null || _a === void 0 ? void 0 : _a.trim();
const supabaseServiceKey = (_b = process.env.SUPABASE_SERVICE_ROLE_KEY) === null || _b === void 0 ? void 0 : _b.trim();
const supabaseAnonKey = (_c = process.env.SUPABASE_ANON_KEY) === null || _c === void 0 ? void 0 : _c.trim();
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
