// Shared helpers for saving and removing bookmarks in Supabase.
function slugify(value) {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildItemKey(majorKey, itemType, title) {
  return `${majorKey}:${itemType}:${slugify(title)}`;
}

async function getCurrentUser() {
  if (!supabaseClient) return null;
  const { data } = await supabaseClient.auth.getSession();
  return data.session?.user || null;
}

async function fetchSavedKeys(userId) {
  const { data, error } = await supabaseClient
    .from("saved_items")
    .select("item_key")
    .eq("user_id", userId);

  if (error) throw error;
  return new Set((data || []).map(row => row.item_key));
}

async function fetchSavedItems() {
  const { data, error } = await supabaseClient
    .from("saved_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

async function saveBookmark(payload) {
  const { data, error } = await supabaseClient
    .from("saved_items")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function removeBookmark(userId, itemKey) {
  const { error } = await supabaseClient
    .from("saved_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_key", itemKey);

  if (error) throw error;
}

function requireSignIn(returnPath) {
  const next = encodeURIComponent(returnPath || window.location.pathname.split("/").pop() || "index.html");
  window.location.href = `login.html?next=${next}`;
}
