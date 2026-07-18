const { fs, path, issue } = require("../lib");
module.exports = async function sessionsCheck(ctx) {
  const root = ctx.root; const issues = [];
  const file = path.join(root, "pc-rescue-kit", "browser", "session-engine.browser.js");
  const text = fs.readFileSync(file, "utf8");
  const methods = ["create(","save(","load(","list(","remove(","exportAll(","importAll(","getStats("];
  for (const method of methods) if (!text.includes(method)) issues.push(issue("error", "session.methodMissing", `Falta método ${method}`, "pc-rescue-kit/browser/session-engine.browser.js"));
  if (!/maxSessions/.test(text)) issues.push(issue("warning", "session.limit", "No se detectó límite de sesiones."));
  if (!/localStorage/.test(text)) issues.push(issue("error", "session.storage", "No se detectó persistencia localStorage."));
  return { name: "Sessions", metrics: { methods: methods.length }, issues };
};
