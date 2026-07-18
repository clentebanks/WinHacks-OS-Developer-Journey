const fs = require("fs-extra");
const path = require("path");
const fg = require("fast-glob");

const ROOT = path.join(__dirname, "..");
const KNOWLEDGE = path.join(ROOT, "knowledge");
const GENERATED = path.join(ROOT, "generated");
const OUTPUT = path.join(GENERATED, "knowledge-index.json");

const TYPES = [
  "procedures",
  "symptoms",
  "tools",
  "commands",
  "questions",
  "rules",
  "validations"
];

async function main() {
  console.log("");
  console.log("=========================================");
  console.log(" WinHacks Knowledge Indexer");
  console.log("=========================================");
  console.log("");

  await fs.ensureDir(GENERATED);

  const index = {
    generatedAt: new Date().toISOString(),
    totals: {},
    byType: {},
    byId: {},
    bySlug: {}
  };

  for (const type of TYPES) {
    const dir = path.join(KNOWLEDGE, type);

    index.byType[type] = {};
    index.totals[type] = 0;

    if (!(await fs.pathExists(dir))) {
      continue;
    }

    const files = await fg(["**/*.json"], {
      cwd: dir,
      absolute: true,
      onlyFiles: true
    });

    for (const file of files) {
      const data = await fs.readJson(file);
      const relativePath = path.relative(ROOT, file).replace(/\\/g, "/");

      const record = {
        type,
        id: data.id || "",
        slug: data.slug || "",
        name: data.name || data.shortName || "",
        path: relativePath,
        status: data.status || "unknown",
        version: data.version || "0.0.0"
      };

      const typeKey =
        record.slug ||
        record.id ||
        path.basename(file, path.extname(file));

      index.byType[type][typeKey] = record;

      if (record.slug) {
        index.bySlug[`${type}:${record.slug}`] = record;
      }

      if (record.id) {
        index.byId[record.id] = record;
      }

      index.totals[type]++;
    }
  }

  index.totalItems = Object.values(index.totals).reduce(
    (sum, value) => sum + value,
    0
  );

  await fs.writeJson(OUTPUT, index, { spaces: 2 });

  console.log("Índice generado:", path.relative(ROOT, OUTPUT));
  console.log("Total de elementos:", index.totalItems);

  for (const type of TYPES) {
    console.log(`${type}:`, index.totals[type]);
  }

  console.log("");
}

main().catch((error) => {
  console.error("Error generando knowledge-index.json");
  console.error(error);
  process.exit(1);
});
