const requiredInSupabaseMode = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isLikelySupabasePublicKey(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;

  return (
    trimmed.startsWith("sb_publishable_") ||
    trimmed.startsWith("eyJ") ||
    trimmed.startsWith("anon_")
  );
}

function shouldValidateNow() {
  const nodeEnv = process.env.NODE_ENV || "";
  const vercelEnv = process.env.VERCEL_ENV || "";
  const ci = process.env.CI || "";

  return (
    nodeEnv === "production" ||
    vercelEnv === "production" ||
    ci.toLowerCase() === "true"
  );
}

function fail(message) {
  console.error(`\n[env-check] ${message}\n`);
  process.exit(1);
}

if (!shouldValidateNow()) {
  console.log("[env-check] Skip strict validation outside production/CI build context.");
  process.exit(0);
}

const dataSource = (process.env.NEXT_PUBLIC_DATA_SOURCE || "").trim();
if (dataSource && dataSource !== "supabase") {
  console.log("[env-check] DATA_SOURCE is not supabase; skip Supabase public env checks.");
  process.exit(0);
}

for (const key of requiredInSupabaseMode) {
  if (!String(process.env[key] || "").trim()) {
    fail(`Missing required env: ${key}`);
  }
}

const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
if (!isValidHttpUrl(supabaseUrl)) {
  fail("NEXT_PUBLIC_SUPABASE_URL must be a valid http/https URL.");
}

const anonKey = String(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
if (!isLikelySupabasePublicKey(anonKey)) {
  fail(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY has unexpected format. Expect publishable key (sb_publishable_...) or legacy anon JWT."
  );
}

console.log("[env-check] Supabase public env validation passed.");
