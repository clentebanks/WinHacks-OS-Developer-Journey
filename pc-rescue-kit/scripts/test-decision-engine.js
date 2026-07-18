const path = require("path");
const DecisionEngine = require("../core/decision-engine");

(async () => {
  const engine = new DecisionEngine({
    root: path.join(__dirname, "..")
  });

  await engine.init();

  console.log("");
  console.log("=========================================");
  console.log(" WinHacks Decision Engine Test");
  console.log("=========================================");
  console.log("");

  const rule = await engine.knowledge.loadById("RULE-PERF-001");
  console.log("Regla cargada:", rule ? `${rule.id} — ${rule.name}` : "No encontrada");
  console.log("");

  const plan = await engine.buildPlan(["diskUsageHigh"]);

  console.log("Estado:", plan.status);
  console.log("Evidencia:", plan.evidence.join(", "));
  console.log("");

  console.log("Reglas activadas:");
  for (const item of plan.matchedRules) {
    console.log(`- ${item.id} — ${item.name}`);
  }

  console.log("");
  console.log("Plan generado:");

  plan.procedures.forEach((procedure, index) => {
    console.log(
      `${index + 1}. ${procedure.id} — ${procedure.name} | Fase: ${procedure.phase} | Riesgo: ${procedure.risk}`
    );
  });

  plan.validations.forEach((validation, index) => {
    console.log(
      `${plan.procedures.length + index + 1}. ${validation.id} — ${validation.name}`
    );
  });

  console.log("");

  if (plan.status !== "plan-generated") {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
