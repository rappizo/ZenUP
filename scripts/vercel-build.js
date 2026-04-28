const { spawnSync } = require("node:child_process");
const { normalizeDatabaseEnv } = require("./database-env");

const env = normalizeDatabaseEnv(process.env);

const commandSets =
  process.platform === "win32"
    ? [
        ["npx.cmd", ["prisma", "generate"]],
        ["npx.cmd", ["prisma", "db", "push"]],
        ["npx.cmd", ["next", "build"]]
      ]
    : [
        ["npx", ["prisma", "generate"]],
        ["npx", ["prisma", "db", "push"]],
        ["npx", ["next", "build"]]
      ];

for (const [command, args] of commandSets) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: process.platform === "win32"
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
