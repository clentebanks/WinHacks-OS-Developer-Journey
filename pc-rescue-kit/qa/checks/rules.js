const { path, readJson, walk, relative, issue } = require("../lib");
const operators = new Set(["eq","neq","gt","gte","lt","lte","contains","in","exists"]);
const actionTypes = new Set(["recommend","block","escalate","validate","set-state"]);

module.exports = async function rulesCheck(ctx) {
  const root = ctx.root;
  const dir = path.join(root, "pc-rescue-kit", "knowledge", "rules");
  const issues = [];
  const files = walk(dir, f => f.endsWith(".json"));
  const priorities = new Map();
  for (const file of files) {
    const data = readJson(file); const rel = relative(root, file);
    if (!Array.isArray(data.conditions) || !data.conditions.length) issues.push(issue("error", "conditions.missing", "Regla sin condiciones.", rel));
    if (!Array.isArray(data.actions) || !data.actions.length) issues.push(issue("error", "actions.missing", "Regla sin acciones.", rel));
    if (!Number.isInteger(data.priority)) issues.push(issue("error", "priority.invalid", "Prioridad debe ser entero.", rel));
    else priorities.set(data.priority, (priorities.get(data.priority) || 0) + 1);
    for (const c of data.conditions || []) if (!operators.has(c.operator)) issues.push(issue("error", "operator.invalid", `Operador no soportado: ${c.operator}`, rel));
    for (const a of data.actions || []) {
      if (!actionTypes.has(a.type)) issues.push(issue("error", "action.invalid", `Acción no soportada: ${a.type}`, rel));
      if (!a.target) issues.push(issue("error", "action.targetMissing", "Acción sin target.", rel));
      if (a.weight !== undefined && (a.weight < 0 || a.weight > 1)) issues.push(issue("warning", "action.weight", `Peso fuera de 0..1: ${a.weight}`, rel));
    }
  }
  return { name: "Rules", metrics: { rules: files.length, priorities: priorities.size }, issues };
};
