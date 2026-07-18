const path = require("path");
const DecisionEngine = require("../core/decision-engine");
const SessionEngine = require("../core/session-engine");

(async () => {
  const root = path.join(__dirname, "..");

  const decision = new DecisionEngine({ root });
  const sessions = new SessionEngine({ root });

  await decision.init();
  await sessions.init();

  console.log("");
  console.log("=========================================");
  console.log(" WinHacks Session Engine Test");
  console.log("=========================================");
  console.log("");

  let session = await sessions.createSession({
    symptom: {
      id: "SYM-PERF-001",
      slug: "pc-lenta",
      name: "PC lenta"
    },
    device: {
      os: "Windows 11"
    }
  });

  console.log("Sesión creada:", session.id);

  session = await sessions.addAnswer(session.id, {
    questionId: "Q-PERF-001",
    value: "disk-high",
    label: "Disco al 90 % o más",
    evidence: ["diskUsageHigh"]
  });

  const plan = await decision.buildPlan(session.evidence);
  session = await sessions.applyPlan(session.id, plan);

  console.log("Estado:", session.status);
  console.log("Evidencia:", session.evidence);
  console.log("Pasos:", session.progress.totalSteps);

  for (const step of [
    ...session.plan.procedures,
    ...session.plan.validations
  ]) {
    session = await sessions.updateStep(
      session.id,
      step.id,
      "completed",
      "Prueba automática completada."
    );
  }

  session = await sessions.finishSession(session.id, {
    healthScore: 82,
    statusLabel: "Bueno",
    summary: "Flujo inicial completado correctamente.",
    recommendations: [
      "Continuar monitoreando el uso del disco."
    ]
  });

  console.log("Estado final:", session.status);
  console.log("Health Score:", session.result.healthScore);
  console.log("Archivo:", `sessions/${session.id}.json`);
  console.log("");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
