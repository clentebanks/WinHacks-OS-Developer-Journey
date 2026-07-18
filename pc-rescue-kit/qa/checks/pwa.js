const { fs, path, readJson, issue } = require("../lib");
module.exports = async function pwaCheck(ctx) {
  const root = ctx.root; const issues = [];
  const base = path.join(root, "pc-rescue-kit", "app");
  const manifestPath = path.join(base, "manifest.webmanifest");
  if (!fs.existsSync(manifestPath)) issues.push(issue("error", "manifest.missing", "Falta manifest.webmanifest."));
  else {
    const m = readJson(manifestPath);
    for (const key of ["name","short_name","start_url","display","icons"]) if (!m[key]) issues.push(issue("error", "manifest.field", `Falta ${key} en manifest.`));
    for (const icon of m.icons || []) if (!fs.existsSync(path.join(base, icon.src.replace(/^\.\//, "")))) issues.push(issue("error", "manifest.iconMissing", `Icono inexistente: ${icon.src}`));
  }
  const sw = path.join(base, "service-worker.js");
  if (!fs.existsSync(sw)) issues.push(issue("error", "sw.missing", "Falta Service Worker."));
  else {
    const text = fs.readFileSync(sw, "utf8");
    if (!/addEventListener\("install"/.test(text)) issues.push(issue("error", "sw.install", "Service Worker sin install."));
    if (!/addEventListener\("fetch"/.test(text)) issues.push(issue("error", "sw.fetch", "Service Worker sin fetch."));
  }
  return { name: "PWA", metrics: {}, issues };
};
