const { fs, path, readJson, walk, relative, issue } = require("../lib");

module.exports = async function knowledgeCheck(ctx) {
  const issues = [];
  const root = ctx.root;
  const knowledge = path.join(root, "pc-rescue-kit", "knowledge");
  const files = walk(knowledge, (file) => file.endsWith(".json") && !file.includes(`${path.sep}schema${path.sep}`));
  const ids = new Map();
  const slugs = new Map();
  const records = [];

  for (const file of files) {
    let data;
    try { data = readJson(file); }
    catch (error) {
      issues.push(issue("error", "json.invalid", error.message, relative(root, file)));
      continue;
    }
    records.push({ file, data });
    if (!data.id) issues.push(issue("error", "id.missing", "Falta id.", relative(root, file)));
    else if (ids.has(data.id)) issues.push(issue("error", "id.duplicate", `ID duplicado: ${data.id}`, relative(root, file), { first: ids.get(data.id) }));
    else ids.set(data.id, relative(root, file));

    if (data.slug) {
      if (slugs.has(data.slug)) issues.push(issue("warning", "slug.duplicate", `Slug duplicado: ${data.slug}`, relative(root, file), { first: slugs.get(data.slug) }));
      else slugs.set(data.slug, relative(root, file));
    }

    if (data.status && !["draft","review","active","deprecated","archived"].includes(data.status)) {
      issues.push(issue("error", "status.invalid", `Status no permitido: ${data.status}`, relative(root, file)));
    }
    if (data.version && !/^\d+\.\d+\.\d+$/.test(data.version)) {
      issues.push(issue("warning", "version.invalid", `Versión no semántica: ${data.version}`, relative(root, file)));
    }
  }

  const knownIds = new Set(ids.keys());
  for (const { file, data } of records) {
    const rel = relative(root, file);
    const refs = [];
    if (Array.isArray(data.nextProcedures)) refs.push(...data.nextProcedures);
    if (Array.isArray(data.failureActions)) refs.push(...data.failureActions.map(x => x.nextProcedure).filter(Boolean));
    if (Array.isArray(data.actions)) refs.push(...data.actions.map(x => x.target).filter(x => /^(WHPRS|VAL|RULE|Q|SYM|CMD|TOOL)-/.test(x)));
    if (typeof data.failureNext === "string" && /^(WHPRS|VAL|RULE|Q|SYM|CMD|TOOL)-/.test(data.failureNext)) refs.push(data.failureNext);
    if (typeof data.successNext === "string" && /^(WHPRS|VAL|RULE|Q|SYM|CMD|TOOL)-/.test(data.successNext)) refs.push(data.successNext);
    for (const ref of refs) if (!knownIds.has(ref)) issues.push(issue("error", "reference.broken", `Referencia inexistente: ${ref}`, rel));
  }

  const indexPath = path.join(root, "pc-rescue-kit", "generated", "knowledge-index.json");
  if (!fs.existsSync(indexPath)) issues.push(issue("error", "index.missing", "Falta generated/knowledge-index.json."));
  else {
    try {
      const index = readJson(indexPath);
      if (index.totalItems !== records.length) issues.push(issue("warning", "index.stale", `Índice reporta ${index.totalItems}; archivos detectados ${records.length}.`, relative(root, indexPath)));
    } catch (error) { issues.push(issue("error", "index.invalid", error.message, relative(root, indexPath))); }
  }

  return { name: "Knowledge", metrics: { files: records.length, ids: knownIds.size }, issues };
};
