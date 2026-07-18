import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function runDoctor() {
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const checks = [
    {
      name: "Node.js 22 or newer",
      ok: nodeMajor >= 22,
      detail: `detected ${process.versions.node}`
    },
    {
      name: "Run from repository root",
      ok: existsSync(resolve(process.cwd(), "package.json")),
      detail: process.cwd()
    },
    {
      name: "Legacy engine reference available",
      ok: existsSync(resolve(process.cwd(), "legacy/winhacks-engine/MIGRATION_INVENTORY.md")),
      detail: "legacy/winhacks-engine"
    }
  ];

  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"}  ${check.name} — ${check.detail}`);
  }

  const ok = checks.every((check) => check.ok);
  console.log(ok ? "\nEnvironment is ready." : "\nResolve failed checks before continuing.");
  return { ok, checks };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runDoctor();
  process.exitCode = result.ok ? 0 : 1;
}
