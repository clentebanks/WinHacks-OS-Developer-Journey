const path = require("path");
const KnowledgeEngine = require("./knowledge-engine");

class DecisionEngine {
  constructor(options = {}) {
    this.root = options.root || path.join(__dirname, "..");
    this.knowledge =
      options.knowledge || new KnowledgeEngine({ root: this.root });
  }

  async init() {
    await this.knowledge.init();
    return this;
  }

  matchesCondition(condition, context) {
    const fieldValue = context[condition.field];
    const expected = condition.value;

    switch (condition.operator) {
      case "contains":
        return Array.isArray(fieldValue)
          ? fieldValue.includes(expected)
          : String(fieldValue ?? "").includes(String(expected));

      case "eq":
        return fieldValue === expected;

      case "neq":
        return fieldValue !== expected;

      case "exists":
        return fieldValue !== undefined && fieldValue !== null;

      case "in":
        return Array.isArray(expected) && expected.includes(fieldValue);

      case "gt":
        return Number(fieldValue) > Number(expected);

      case "gte":
        return Number(fieldValue) >= Number(expected);

      case "lt":
        return Number(fieldValue) < Number(expected);

      case "lte":
        return Number(fieldValue) <= Number(expected);

      default:
        return false;
    }
  }

  async evaluateEvidence(evidence = []) {
    const context = {
      evidence: Array.isArray(evidence) ? evidence : [evidence]
    };

    const matchedRules = [];

    for (const record of this.knowledge.list("rules")) {
      const rule = await this.knowledge.loadById(record.id);

      if (!rule || rule.status !== "active") continue;

      const matched = (rule.conditions || []).every((condition) =>
        this.matchesCondition(condition, context)
      );

      if (matched) matchedRules.push(rule);
    }

    return matchedRules.sort(
      (a, b) => Number(b.priority || 0) - Number(a.priority || 0)
    );
  }

  async buildPlan(evidence = []) {
    const normalizedEvidence = Array.isArray(evidence)
      ? evidence
      : [evidence];

    const matchedRules =
      await this.evaluateEvidence(normalizedEvidence);

    const procedures = [];
    const validations = [];
    const blocked = [];

    const seenProcedures = new Set();
    const seenValidations = new Set();

    for (const rule of matchedRules) {
      for (const action of rule.actions || []) {
        if (action.type === "recommend") {
          const procedure =
            await this.knowledge.loadById(action.target);

          if (procedure && !seenProcedures.has(procedure.id)) {
            seenProcedures.add(procedure.id);

            procedures.push({
              id: procedure.id,
              slug: procedure.slug,
              name: procedure.name,
              phase: procedure.phase,
              risk: procedure.risk,
              weight: action.weight ?? 0,
              commands: procedure.commands || [],
              steps: procedure.steps || []
            });
          }
        }

        if (action.type === "validate") {
          const validation =
            await this.knowledge.loadById(action.target);

          if (
            validation &&
            !seenValidations.has(validation.id)
          ) {
            seenValidations.add(validation.id);
            validations.push(validation);
          }
        }

        if (action.type === "block") {
          blocked.push({
            target: action.target,
            weight: action.weight ?? 1
          });
        }
      }
    }

    const phaseOrder = {
      "Recepción": 1,
      "Diagnóstico": 2,
      "Análisis": 3,
      "Limpieza": 4,
      "Reparación": 5,
      "Optimización": 6,
      "Seguridad": 7,
      "Red": 8,
      "Validación": 9,
      "Reporte": 10
    };

    procedures.sort((a, b) => {
      const phaseDiff =
        (phaseOrder[a.phase] || 99) -
        (phaseOrder[b.phase] || 99);

      if (phaseDiff !== 0) return phaseDiff;

      return Number(b.weight || 0) -
        Number(a.weight || 0);
    });

    return {
      generatedAt: new Date().toISOString(),
      evidence: normalizedEvidence,
      matchedRules: matchedRules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        priority: rule.priority
      })),
      procedures,
      validations,
      blocked,
      status:
        procedures.length || validations.length
          ? "plan-generated"
          : "no-match"
    };
  }
}

module.exports = DecisionEngine;
