const path = require("path");
const fs = require("fs");
const { scoreFromIssues } = require("./lib");
const jsonReporter = require("./reporters/json");
const markdownReporter = require("./reporters/markdown");
const htmlReporter = require("./reporters/html");

const root = path.resolve(__dirname, "..", "..");
const output = path.join(__dirname, "reports");
fs.mkdirSync(output, { recursive: true });

const checks = [
  require("./checks/knowledge"), require("./checks/procedures"), require("./checks/rules"),
  require("./checks/scenarios"), require("./checks/browser"), require("./checks/seo"),
  require("./checks/pwa"), require("./checks/sessions"), require("./checks/performance")
];

(async () => {
  console.log("\n========================================");
  console.log(" WinHacks PC Rescue Kit QA Engine");
  console.log("========================================\n");
  const results = [];
  for (const run of checks) {
    const result = await run({ root });
    result.score = scoreFromIssues(result.issues);
    result.status = result.issues.some(i => i.level === "error") ? "FAIL" : "PASS";
    results.push(result);
    console.log(`${result.name.padEnd(18)} ${result.status.padEnd(5)} ${String(result.score).padStart(3)}/100  E:${result.issues.filter(i=>i.level==='error').length} W:${result.issues.filter(i=>i.level==='warning').length}`);
  }
  const allIssues = results.flatMap(r => r.issues);
  const summary = { errors: allIssues.filter(i=>i.level==='error').length, warnings: allIssues.filter(i=>i.level==='warning').length, info: allIssues.filter(i=>i.level==='info').length };
  const score = Math.round(results.reduce((sum,r)=>sum+r.score,0)/results.length);
  const report = { engine: "WinHacks PC Rescue Kit QA", version: "1.0.0", generatedAt: new Date().toISOString(), score, summary, checks: results };
  jsonReporter(report, path.join(output, "audit.json"));
  markdownReporter(report, path.join(output, "audit.md"));
  htmlReporter(report, path.join(output, "audit.html"));
  console.log("\n----------------------------------------");
  console.log(`Score: ${score}/100`);
  console.log(`Errors: ${summary.errors}`);
  console.log(`Warnings: ${summary.warnings}`);
  console.log("Reports: pc-rescue-kit/qa/reports/audit.{html,md,json}\n");
  if (summary.errors > 0) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
