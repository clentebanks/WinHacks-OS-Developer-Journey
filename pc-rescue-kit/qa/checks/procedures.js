const { path, readJson, walk, relative, issue } = require("../lib");

const dangerous = [/\bformat\b/i, /\bdiskpart\s+clean\b/i, /\bdel\s+\/s\b/i, /remove-item\s+-recurse/i, /bcdedit/i];

module.exports = async function proceduresCheck(ctx) {
  const root = ctx.root;
  const dir = path.join(root, "pc-rescue-kit", "knowledge", "procedures");
  const issues = [];
  const files = walk(dir, f => f.endsWith(".json"));
  let commands = 0;

  for (const file of files) {
    const data = readJson(file); const rel = relative(root, file);
    if (!Array.isArray(data.steps) || data.steps.length === 0) issues.push(issue("error", "steps.missing", "Procedimiento sin pasos.", rel));
    if (!Array.isArray(data.validation) || data.validation.length === 0) issues.push(issue("error", "validation.missing", "Procedimiento sin validación.", rel));
    if (!Number.isInteger(data.risk) || data.risk < 1 || data.risk > 5) issues.push(issue("error", "risk.invalid", "Risk debe estar entre 1 y 5.", rel));
    if (!data.estimatedTime) issues.push(issue("warning", "time.missing", "Falta estimatedTime.", rel));
    if (!Array.isArray(data.whenNotUse) || data.whenNotUse.length === 0) issues.push(issue("warning", "whenNotUse.missing", "Falta whenNotUse.", rel));
    for (const cmd of data.commands || []) {
      commands++;
      if (!cmd.command || typeof cmd.requiresAdmin !== "boolean") issues.push(issue("error", "command.invalid", "Comando incompleto.", rel));
      if (dangerous.some(rx => rx.test(cmd.command))) issues.push(issue("warning", "command.dangerous", `Comando sensible: ${cmd.command}`, rel));
    }
    const orders = (data.steps || []).map(s => s.order);
    if (new Set(orders).size !== orders.length) issues.push(issue("error", "steps.orderDuplicate", "Orden de pasos duplicado.", rel));
  }
  return { name: "Procedures", metrics: { procedures: files.length, commands }, issues };
};
