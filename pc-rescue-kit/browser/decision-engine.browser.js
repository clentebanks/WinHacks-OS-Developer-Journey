export class BrowserDecisionEngine {
  constructor(knowledge) {
    this.knowledge = knowledge;
  }

  matchesCondition(condition, context) {
    const current = context[condition.field];
    const expected = condition.value;

    switch (condition.operator) {
      case "contains":
        return Array.isArray(current)
          ? current.includes(expected)
          : String(current ?? "").includes(String(expected));
      case "eq": return current === expected;
      case "neq": return current !== expected;
      case "exists": return current !== undefined && current !== null;
      case "in": return Array.isArray(expected) && expected.includes(current);
      case "gt": return Number(current) > Number(expected);
      case "gte": return Number(current) >= Number(expected);
      case "lt": return Number(current) < Number(expected);
      case "lte": return Number(current) <= Number(expected);
      default: return false;
    }
  }

  async evaluateEvidence(evidence = []) {
    const context = { evidence: Array.isArray(evidence) ? evidence : [evidence] };
    const matched = [];

    for (const record of this.knowledge.list("rules")) {
      const rule = await this.knowledge.loadById(record.id);
      if (!rule || rule.status !== "active") continue;

      const ok = (rule.conditions || []).every((condition) =>
        this.matchesCondition(condition, context)
      );
      if (ok) matched.push(rule);
    }

    return matched.sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0));
  }

  async buildPlan(evidence = []) {
    const rules = await this.evaluateEvidence(evidence);
    const procedures = [];
    const validations = [];
    const seen = new Set();

    for (const rule of rules) {
      for (const action of rule.actions || []) {
        if (action.type === "recommend") {
          const item = await this.knowledge.loadById(action.target);
          if (item && !seen.has(item.id)) {
            seen.add(item.id);
            procedures.push({ ...item, weight: action.weight ?? 0, state: "pending" });
          }
        }
        if (action.type === "validate") {
          const item = await this.knowledge.loadById(action.target);
          if (item && !seen.has(item.id)) {
            seen.add(item.id);
            validations.push({ ...item, state: "pending" });
          }
        }
      }
    }

    const phaseOrder = {
      "Recepción": 1, "Diagnóstico": 2, "Análisis": 3, "Limpieza": 4,
      "Reparación": 5, "Optimización": 6, "Seguridad": 7, "Red": 8,
      "Validación": 9, "Reporte": 10
    };

    procedures.sort((a, b) =>
      (phaseOrder[a.phase] || 99) - (phaseOrder[b.phase] || 99) ||
      Number(b.weight || 0) - Number(a.weight || 0)
    );

    return {
      status: procedures.length || validations.length ? "plan-generated" : "no-match",
      matchedRules: rules.map(({ id, name, priority }) => ({ id, name, priority })),
      procedures,
      validations
    };
  }
}
