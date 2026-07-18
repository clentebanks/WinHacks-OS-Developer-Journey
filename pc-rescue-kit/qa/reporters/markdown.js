const fs = require("fs");
module.exports = function markdownReporter(report, file) {
  const out = ["# WinHacks PC Rescue Kit QA", "", `Generado: ${report.generatedAt}`, "", `Score: **${report.score}/100**`, "", `Errores: **${report.summary.errors}** · Warnings: **${report.summary.warnings}**`, "", "---", ""];
  for (const check of report.checks) {
    out.push(`## ${check.status === "PASS" ? "✅" : "❌"} ${check.name}`, "", `Score: **${check.score}/100**`, "");
    if (!check.issues.length) out.push("Sin problemas.", "");
    else for (const i of check.issues) out.push(`- **${i.level.toUpperCase()} — ${i.code}**: ${i.message}${i.file ? ` — \`${i.file}\`` : ""}`);
    out.push("");
  }
  fs.writeFileSync(file, out.join("\n"));
};
