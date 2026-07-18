import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve("legacy/winhacks-engine");

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    if (entry.isDirectory()) return walk(full);
    return [full];
  });
}

const files = walk(root).filter((file) => !file.endsWith("MIGRATION_INVENTORY.md"));
const byExtension = new Map();

for (const file of files) {
  const name = relative(root, file);
  const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "(none)";
  byExtension.set(extension, (byExtension.get(extension) ?? 0) + 1);
}

console.log(`Legacy files: ${files.length}`);
for (const [extension, count] of [...byExtension.entries()].sort()) {
  console.log(`${extension.padEnd(12)} ${count}`);
}
