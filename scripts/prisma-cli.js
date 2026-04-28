const { spawnSync } = require("node:child_process");
const { normalizeDatabaseEnv } = require("./database-env");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("Usage: node scripts/prisma-cli.js <prisma args>");
  process.exit(1);
}

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", ...args], {
  stdio: "inherit",
  env: normalizeDatabaseEnv(process.env),
  shell: process.platform === "win32"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
