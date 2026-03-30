export function getDatabaseUrl() {
  const pooledUrl = process.env.DATABASE_URL?.trim() ?? "";
  const directUrl = process.env.DIRECT_URL?.trim() ?? "";

  if (!process.env.VERCEL && directUrl) {
    return directUrl;
  }

  return pooledUrl || directUrl;
}

export function hasValidPostgresDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();
  return databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
}
