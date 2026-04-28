function trimEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDatabaseEnv(sourceEnv) {
  const env = { ...sourceEnv };
  const pooledUrl =
    trimEnvValue(env.SUPABASE_POOLER_6543_URL) || trimEnvValue(env.DATABASE_URL);
  const sessionPoolerUrl =
    trimEnvValue(env.SUPABASE_POOLER_5432_URL) || trimEnvValue(env.DIRECT_URL);

  if (pooledUrl) {
    env.SUPABASE_POOLER_6543_URL = pooledUrl;
    env.DATABASE_URL = pooledUrl;
  }

  if (sessionPoolerUrl) {
    env.SUPABASE_POOLER_5432_URL = sessionPoolerUrl;
    env.DIRECT_URL = sessionPoolerUrl;
  }

  if (!env.SUPABASE_POOLER_5432_URL && pooledUrl) {
    env.SUPABASE_POOLER_5432_URL = pooledUrl;
  }

  if (!env.DIRECT_URL && pooledUrl) {
    env.DIRECT_URL = pooledUrl;
  }

  return env;
}

module.exports = {
  normalizeDatabaseEnv
};
