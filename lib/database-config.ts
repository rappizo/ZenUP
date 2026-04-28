function getTrimmedEnvValue(value: string | undefined) {
  return value?.trim() ?? "";
}

export function getSupabasePooler6543Url() {
  return getTrimmedEnvValue(process.env.SUPABASE_POOLER_6543_URL) || getTrimmedEnvValue(process.env.DATABASE_URL);
}

export function getSupabasePooler5432Url() {
  return getTrimmedEnvValue(process.env.SUPABASE_POOLER_5432_URL) || getTrimmedEnvValue(process.env.DIRECT_URL);
}

export function getDatabaseUrl() {
  const pooledUrl = getSupabasePooler6543Url();
  const sessionPoolerUrl = getSupabasePooler5432Url();
  return pooledUrl || sessionPoolerUrl;
}

export function hasValidPostgresDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();
  return databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
}
