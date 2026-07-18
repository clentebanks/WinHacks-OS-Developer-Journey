import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "ROADMAP.md",
  "package.json",
  "packages/core/src/index.js",
  "packages/cli/src/index.js",
  "docs/product/PROJECT_CHARTER.md",
  "docs/product/PRD.md",
  "docs/architecture/overview.md",
  "labs/00-foundation/README.md"
];

const failures = required.filter((file) => !existsSync(resolve(root, file)));

let packageJson;
try {
  packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
} catch (error) {
  failures.push(`package.json is invalid: ${error.message}`);
}

if (packageJson?.engines?.node !== ">=22.0.0") {
  failures.push("package.json must require Node.js >=22.0.0");
}

if (failures.length > 0) {
  console.error("Repository validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Repository validation passed (${required.length} required files).`);
