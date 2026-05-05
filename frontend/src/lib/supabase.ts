import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

  if (!url || !anonKey) {
    return null;
  }

  return { anonKey, url };
}

export function isSupabaseMode(): boolean {
  const dataSource = process.env.NEXT_PUBLIC_DATA_SOURCE?.trim();
  if (dataSource) {
    return dataSource === "supabase";
  }

  return Boolean(getPublicSupabaseConfig());
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const config = getPublicSupabaseConfig();
    if (!config) {
      throw new Error("Supabase 配置缺失");
    }

    supabaseClient = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  return supabaseClient;
}

