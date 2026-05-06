import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;

const DEFAULT_SUPABASE_URL =
  "https://blyvyokkyjadlvlnpscg.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "sb_publishable_l20x2W4tZAscqMm1BDl9gw_egc76Hir";

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getPublicSupabaseConfig() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  const isProduction = process.env.NODE_ENV === "production";
  const fallbackUrl = isProduction ? DEFAULT_SUPABASE_URL : "";
  const fallbackAnonKey = isProduction ? DEFAULT_SUPABASE_ANON_KEY : "";

  const url = isValidHttpUrl(envUrl) ? envUrl : fallbackUrl;
  const anonKey = envAnonKey || fallbackAnonKey;

  if (!url || !anonKey || !isValidHttpUrl(url)) {
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
