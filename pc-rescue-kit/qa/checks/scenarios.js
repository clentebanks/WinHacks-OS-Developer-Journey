const { path, readJson, walk, relative, issue } = require("../lib");

function match(condition, context) {
  const value = context[condition.field]; const expected = condition.value;
  switch (condition.operator) {
    case "contains": return Array.isArray(value) ? value.includes(expected) : String(value || "").includes(String(expected));
    case "eq": return value === expected;
    case "neq": return value !== expected;
    case "exists": return value !== undefined && value !== null;
    case "in": return Array.isArray(expected) && expected.includes(value);
    case "gt": return Number(value) > Number(expected);
    case "gte": return Number(value) >= Number(expected);
    case "lt": return Number(value) < Number(expected);
    case "lte": return Number(value) <= Number(expected);
    default: return false;
  }
}

module.exports = async function scenariosCheck(ctx) {
  const root = ctx.root; const issues = [];
  const questions = walk(path.join(root, "pc-rescue-kit", "knowledge", "questions"), f => f.endsWith(".json")).map(readJson);
  const rules = walk(path.join(root, "pc-rescue-kit", "knowledge", "rules"), f => f.endsWith(".json")).map(readJson);
  let scenarios = 0;
  for (const question of questions) {
    for (const answer of question.answers || []) {
      scenarios++;
      const evidence = answer.addsEvidence || [];
      const matched = rules.filter(rule => (rule.conditions || []).every(c => match(c, { evidence })));
      if (!matched.length) issues.push(issue("error", "scenario.noMatch", `Respuesta sin regla: ${question.id} / ${answer.value}`));
      const actions = matched.flatMap(r => r.actions || []);
      if (!actions.some(a => a.type === "recommend")) issues.push(issue("error", "scenario.noProcedure", `Escenario sin procedimiento: ${question.id} / ${answer.value}`));
      if (!actions.some(a => a.type === "validate")) issues.push(issue("warning", "scenario.noValidation", `Escenario sin validación: ${question.id} / ${answer.value}`));
    }
  }
  return { name: "Scenarios", metrics: { scenarios }, issues };
};
