const path = require("path");
const KnowledgeEngine = require("../core/knowledge-engine");

(async () => {
  const engine = new KnowledgeEngine({ root: path.join(__dirname, "..") });
  await engine.init();

  console.log("\n=========================================");
  console.log(" WinHacks Knowledge Engine Test");
  console.log("=========================================\n");

  console.log("Resumen:", engine.getSummary());
  const sfc = await engine.getProcedure("sfc-scannow");
  console.log("Procedimiento:", sfc ? `${sfc.id} — ${sfc.name}` : "No encontrado");
  console.log("Búsqueda SFC:", await engine.search("sfc"));
  console.log("");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
