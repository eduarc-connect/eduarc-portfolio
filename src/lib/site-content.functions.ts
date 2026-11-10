import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { mergeContent, defaultContent } from "@/content/eduarc";

let cachedPublicClient: SupabaseClient<Database> | null = null;

function getPublicSupabaseClient(url: string, key: string): SupabaseClient<Database> {
  if (!cachedPublicClient) {
    cachedPublicClient = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
  }
  return cachedPublicClient;
}

// Public read of the editable site content (anon SELECT policy only).
export const getSiteContent = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["SUPABASE_URL"] || "https://bxdibrixivozxipefylz.supabase.co";
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] || "sb_publishable_4SSpwpxYs41goOAmkVlzdg_Z4sTOlQ9";
  if (!url || !key) return defaultContent;

  try {
    const client = getPublicSupabaseClient(url, key);
    const { data, error } = await client
      .from("site_content")
      .select("data")
      .eq("id", "main")
      .maybeSingle();
    if (error || !data) return defaultContent;
    return mergeContent(data.data);
  } catch (err) {
    console.warn("[getSiteContent] Database fallback to defaultContent:", err);
    return defaultContent;
  }
});
