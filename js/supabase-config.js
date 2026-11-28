// Same values as .env. The browser cannot read .env, so the site uses this file.
// Only use the publishable key (sb_publishable_...). Never put a secret key (sb_secret_...) here.
const SUPABASE_URL = "https://necaiabapszbxyczgvju.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_pjnS76MsrU0vdyU_EjF-1w_fxAUuDOv";

const supabaseClient = SUPABASE_URL.includes("YOUR-PROJECT-REF")
  ? null
  : supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
