#!/usr/bin/env node
const fs = require("fs-extra");
const path = require("path");
const glob = require("fast-glob");
const cheerio = require("cheerio");
const CONFIG = require("../../config/toolkit.config");

const ROOT = CONFIG.paths.root;
const REPORT_DIR = CONFIG.paths.reports;
const SITE_URL = CONFIG.site.url;
const PUBLIC_GLOBS = [...CONFIG.content.publicGlobs];

const EXCLUDE = [
  "node_modules/**",
  ".git/**",
  "reports/**",
  "docs/**",
  "tools/**",
  "scripts/**",
  "components/**",
  "templates/**",
  "build/**",
  "dist/**",
  "coverage/**",
  "content/**",
  "google*.html",
  "BingSiteAuth.xml"
];

const SOFT_PAGES = new Set([
  "about.html",
  "contact.html",
  "privacy-policy.html",
  "terms.html",
  "disclaimer.html"
]);

const IGNORE_ORPHAN_PATTERNS = [
  /^recursos\/gracias-/i,
  /^google/i,
  /^404\.html$/i
];

const isExternal = (href = "") =>
  /^(https?:)?\/\//i.test(href) ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:");

const isSkipHref = (href = "") =>
  !href ||
  href.startsWith("#") ||
  href.startsWith("javascript:") ||
  href.startsWith("data:");

const cleanUrl = (href = "") => href.split("#")[0].split("?")[0].trim();
const stripSite = (href = "") => href.replace(/^https?:\/\/winhacks\.dev/i, "");
const toPosix = (p = "") => p.replace(/\\/g, "/");
const textLen = (s = "") => s.trim().replace(/\s+/g, " ").length;

const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;"
}[c]));

const isRootSoftPage = file => SOFT_PAGES.has(toPosix(file));
const shouldIgnoreOrphan = file => {
  const f = toPosix(file);
  if (isRootSoftPage(f)) return true;
  if (f.endsWith("index.html")) return true;
  return IGNORE_ORPHAN_PATTERNS.some(rx => rx.test(f));
};

const downgrade = (file, severity, type) => {
  if (isRootSoftPage(file) && /schema|discover|twitter|og\./i.test(type)) {
    return severity === "high" ? "medium" : "low";
  }
  return severity;
};

function addIssue(issues, severity, type, file, message, value = "", extra = {}) {
  issues.push({
    severity: downgrade(file, severity, type),
    type,
    file: toPosix(file),
    message,
    value,
    ...extra
  });
}

function lineOf(html, needle) {
  if (!needle) return null;
  const idx = html.indexOf(needle);
  if (idx < 0) return null;
  return html.slice(0, idx).split(/\r?\n/).length;
}

function resolveInternalPath(hrefRaw, sourceFile = "index.html") {
  let href = stripSite(cleanUrl(hrefRaw));
  if (!href || href === "/") return "index.html";

  let resolved;
  if (href.startsWith("/")) {
    resolved = href.slice(1);
  } else {
    resolved = path.posix.join(path.posix.dirname(toPosix(sourceFile)), href);
  }

  resolved = path.posix.normalize(resolved);
  if (resolved === ".") resolved = "index.html";
  if (resolved.endsWith("/")) resolved += "index.html";
  if (!path.posix.extname(resolved)) resolved += ".html";
  return resolved;
}

function assetExists(existing, normalizedPath) {
  return existing.has(normalizedPath);
}

function findSuggestion(existingHtml, target) {
  const base = path.posix.basename(target).toLowerCase();
  if (!base) return "";
  const matches = [...existingHtml].filter(f => path.posix.basename(f).toLowerCase() === base);
  if (matches.length === 1) return "/" + matches[0];
  return "";
}

(async function main() {
  const htmlFiles = await glob([
    ...PUBLIC_GLOBS,
    ...EXCLUDE.map(x => "!" + x)
  ], {
    cwd: ROOT,
    dot: false,
    onlyFiles: true,
    unique: true
  });

  const existing = new Set(await glob([
    "**/*",
    ...EXCLUDE.map(x => "!" + x)
  ], {
    cwd: ROOT,
    dot: false,
    onlyFiles: true,
    unique: true
  }).then(list => list.map(toPosix)));

  const existingHtml = new Set(htmlFiles.map(toPosix));

  const siteScriptPath = path.join(ROOT, "js", "script.js");
  const siteScript = await fs.pathExists(siteScriptPath) ? await fs.readFile(siteScriptPath, "utf8") : "";
  const hasDynamicSeoEngine = /injectSEO|Open Graph|Twitter Cards|JSON-LD|schema-/i.test(siteScript);

  const pages = [];
  const issues = [];
  const titleMap = new Map();
  const descMap = new Map();
  const h1Map = new Map();
  const inbound = new Map();

  for (const file of htmlFiles) {
    const full = path.join(ROOT, file);
    const html = await fs.readFile(full, "utf8");
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim();
    const desc = $('meta[name="description"]').attr("content")?.trim() || "";
    const canonical = $('link[rel="canonical"]').attr("href")?.trim() || "";
    const robots = $('meta[name="robots"]').attr("content")?.trim() || "";
    const h1s = $("h1").map((_, e) => $(e).text().trim()).get().filter(Boolean);
    const h2s = $("h2").map((_, e) => $(e).text().trim()).get().filter(Boolean);
    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim() || "";
    const ogDesc = $('meta[property="og:description"]').attr("content")?.trim() || "";
    const ogImage = $('meta[property="og:image"]').attr("content")?.trim() || "";
    const ogUrl = $('meta[property="og:url"]').attr("content")?.trim() || "";
    const twCard = $('meta[name="twitter:card"]').attr("content")?.trim() || "";
    const twImage = $('meta[name="twitter:image"]').attr("content")?.trim() || "";
    const schemas = $('script[type="application/ld+json"]').map((_, e) => $(e).html()).get();
    const imgs = $("img").toArray();
    const links = $("a[href]").toArray();

    pages.push({ file, title, desc, canonical, robots, h1s, h2s, ogTitle, ogDesc, ogImage, ogUrl, twCard, twImage, imageCount: imgs.length, linkCount: links.length });

    if (!title) addIssue(issues, "critical", "title.missing", file, "Falta <title>.");
    else {
      if (textLen(title) < 20) addIssue(issues, "medium", "title.short", file, "Title demasiado corto.", title);
      if (textLen(title) > 70) addIssue(issues, "medium", "title.long", file, "Title demasiado largo.", title);
      titleMap.set(title, [...(titleMap.get(title) || []), file]);
    }

    if (!desc) addIssue(issues, "critical", "description.missing", file, "Falta meta description.");
    else {
      if (textLen(desc) < 60) addIssue(issues, "medium", "description.short", file, "Description demasiado corta.", desc);
      if (textLen(desc) > 175) addIssue(issues, "medium", "description.long", file, "Description demasiado larga.", desc);
      descMap.set(desc, [...(descMap.get(desc) || []), file]);
    }

    if (!canonical) addIssue(issues, "high", "canonical.missing", file, "Falta canonical.");
    else if (!canonical.startsWith(SITE_URL)) addIssue(issues, "medium", "canonical.external_or_invalid", file, "Canonical no apunta al dominio oficial.", canonical);

    if (robots && /noindex/i.test(robots) && !/^recursos\/gracias-/i.test(file)) {
      addIssue(issues, "high", "robots.noindex", file, "Página marcada como noindex.", robots);
    }

    if (!h1s.length) addIssue(issues, "high", "h1.missing", file, "Falta H1.");
    if (h1s.length > 1) addIssue(issues, "medium", "h1.multiple", file, "Hay más de un H1.", h1s.join(" | "));
    if (!h2s.length && !isRootSoftPage(file)) addIssue(issues, "low", "h2.missing", file, "No hay H2.");
    h1s.forEach(h => h1Map.set(h, [...(h1Map.get(h) || []), file]));

    // MODO SEO DINÁMICO
    // Si js/script.js tiene injectSEO / Open Graph / Twitter Cards / JSON-LD,
    // el auditor NO debe marcar como error lo que el navegador genera dinámicamente.
    // Solo validamos JSON-LD estático si existe y mantenemos metadata básica: title, description, canonical, H1/H2.
    if (!hasDynamicSeoEngine) {
      if (!ogTitle) addIssue(issues, "medium", "og.title.missing", file, "Falta og:title.");
      if (!ogDesc) addIssue(issues, "medium", "og.description.missing", file, "Falta og:description.");
      if (!ogImage) addIssue(issues, "high", "og.image.missing", file, "Falta og:image.");
      if (!ogUrl) addIssue(issues, "medium", "og.url.missing", file, "Falta og:url.");
      if (!twCard) addIssue(issues, "low", "twitter.card.missing", file, "Falta twitter:card.");
      if (!twImage) addIssue(issues, "low", "twitter.image.missing", file, "Falta twitter:image.");

      if (!/max-image-preview:large/i.test(robots + " " + html)) {
        addIssue(issues, "medium", "discover.max_image_preview", file, "No se detecta max-image-preview:large.");
      }

      if (!schemas.length) {
        addIssue(issues, "medium", "schema.missing", file, "No se detecta JSON-LD.");
      }
    }

    schemas.forEach(raw => {
      try {
        JSON.parse(raw);
      } catch {
        addIssue(issues, "high", "schema.invalid", file, "JSON-LD inválido.");
      }
    });

    for (const img of imgs) {
      const src = $(img).attr("src") || "";
      const alt = $(img).attr("alt");
      const width = $(img).attr("width");
      const height = $(img).attr("height");
      const loading = $(img).attr("loading");
      const decoding = $(img).attr("decoding");
      const line = lineOf(html, src);

      // Primero verificamos si el archivo local existe. Si falta, no tiene sentido
      // penalizar además width/height, loading o decoding: esos atributos se validan
      // únicamente para imágenes que realmente están disponibles en el proyecto.
      if (src && !isExternal(src) && !src.startsWith("data:")) {
        const asset = resolveInternalPath(src, file);
        if (!assetExists(existing, asset)) {
          addIssue(issues, "high", "image.file.missing", file, "Imagen referenciada no existe.", src, { line, resolvedPath: asset });
          continue;
        }
      }

      if (!alt || !alt.trim()) addIssue(issues, "medium", "image.alt.missing", file, "Imagen sin ALT.", src, { line });
      if (!width || !height) addIssue(issues, "low", "image.dimensions.missing", file, "Imagen sin width/height.", src, { line });
      if (!loading) addIssue(issues, "low", "image.loading.missing", file, "Imagen sin loading=lazy/eager.", src, { line });
      if (!decoding) addIssue(issues, "low", "image.decoding.missing", file, "Imagen sin decoding=async.", src, { line });
    }

    for (const a of links) {
      const hrefRaw = $(a).attr("href") || "";
      if (isSkipHref(hrefRaw) || isExternal(hrefRaw)) continue;

      const target = resolveInternalPath(hrefRaw, file);
      inbound.set(target, (inbound.get(target) || 0) + 1);

      if (!existing.has(target)) {
        const suggestion = findSuggestion(existingHtml, target);
        const line = lineOf(html, hrefRaw);
        addIssue(
          issues,
          "high",
          "link.internal.broken",
          file,
          suggestion ? `Enlace interno roto. Sugerencia: ${suggestion}` : "Enlace interno roto.",
          hrefRaw,
          { line, resolvedPath: target, suggestion }
        );
      }
    }
  }

  // Los componentes compartidos también forman parte del grafo interno.
  // Esto evita marcar como huérfanas páginas enlazadas desde navbar/footer.
  for (const componentRel of ["components/navbar.html", "components/footer.html"]) {
    const componentFull = path.join(ROOT, componentRel);
    if (!(await fs.pathExists(componentFull))) continue;

    const componentHtml = await fs.readFile(componentFull, "utf8");
    const component$ = cheerio.load(componentHtml);

    component$("a[href]").each((_, element) => {
      const hrefRaw = component$(element).attr("href") || "";
      if (isSkipHref(hrefRaw) || isExternal(hrefRaw)) return;
      const target = resolveInternalPath(hrefRaw, "index.html");
      inbound.set(target, (inbound.get(target) || 0) + 1);
    });
  }

  for (const [title, files] of titleMap) if (files.length > 1) addIssue(issues, "high", "title.duplicate", files.join(", "), "Title duplicado.", title);
  for (const [desc, files] of descMap) if (desc && files.length > 1) addIssue(issues, "high", "description.duplicate", files.join(", "), "Description duplicada.", desc.slice(0, 220));
  for (const [h1, files] of h1Map) if (files.length > 1) addIssue(issues, "low", "h1.duplicate", files.join(", "), "H1 duplicado.", h1);

  for (const file of htmlFiles) {
    if (shouldIgnoreOrphan(file)) continue;
    if (!inbound.has(file)) addIssue(issues, "medium", "page.orphan_possible", file, "Posible página huérfana: ningún enlace interno la apunta.");
  }

  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  issues.forEach(i => counts[i.severity]++);
  const score = Math.max(0, 100 - counts.critical * 10 - Math.min(counts.high, 60) * 1.2 - Math.min(counts.medium, 120) * 0.25 - Math.min(counts.low, 250) * 0.05);

  const report = {
    generatedAt: new Date().toISOString(),
    version: "1.5",
    site: SITE_URL,
    pageCount: htmlFiles.length,
    score: Math.round(score),
    counts,
    notes: {
      ignored: EXCLUDE,
      dynamicSeoDetected: hasDynamicSeoEngine,
      scope: PUBLIC_GLOBS
    },
    issues,
    pages
  };

  await fs.ensureDir(REPORT_DIR);
  await fs.writeJson(path.join(REPORT_DIR, "seo-report.json"), report, { spaces: 2 });

  const md = [
    `# WinHacks SEO Auditor`, ``,
    `Generado: ${report.generatedAt}`, ``,
    `Versión: **${report.version}**`, ``,
    `Score: **${report.score}/100**`, ``,
    `Páginas analizadas: **${report.pageCount}**`, ``,
    `Notas: reportes, docs, tools, scripts, components y templates se ignoran. SEO dinámico detectado: **${hasDynamicSeoEngine ? "sí" : "no"}**.`, ``,
    `## Resumen`, ``,
    `- Críticos: ${counts.critical}`,
    `- Altos: ${counts.high}`,
    `- Medios: ${counts.medium}`,
    `- Bajos: ${counts.low}`, ``,
    `## Problemas`, ``,
    ...issues.map(i => `- **${i.severity.toUpperCase()}** [${i.type}] ${i.file}${i.line ? `:${i.line}` : ""} — ${i.message}${i.value ? ` → \`${i.value}\`` : ""}${i.suggestion ? ` | sugerencia: \`${i.suggestion}\`` : ""}`)
  ].join("\n");
  await fs.writeFile(path.join(REPORT_DIR, "seo-report.md"), md, "utf8");

  const rows = issues.map(i => `<tr class="${esc(i.severity)}"><td>${esc(i.severity)}</td><td>${esc(i.type)}</td><td>${esc(i.file)}${i.line ? ":" + esc(i.line) : ""}</td><td>${esc(i.message)}</td><td><code>${esc(i.value)}</code>${i.suggestion ? `<br><strong>Sugerencia:</strong> <code>${esc(i.suggestion)}</code>` : ""}</td></tr>`).join("\n");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WinHacks SEO Report</title><style>body{font-family:Inter,Arial,sans-serif;background:#070B12;color:#f5f5f5;margin:24px}h1{color:#fff}.cards{display:flex;gap:12px;flex-wrap:wrap}.card{background:#111827;border:1px solid #263244;border-radius:12px;padding:16px;min-width:130px}.score{font-size:42px;font-weight:800;color:#00ff88}table{width:100%;border-collapse:collapse;margin-top:24px;font-size:14px}th,td{border-bottom:1px solid #263244;padding:10px;vertical-align:top}th{background:#101826;text-align:left;position:sticky;top:0}.critical td{background:rgba(255,45,45,.16)}.high td{background:rgba(255,120,0,.13)}.medium td{background:rgba(255,210,0,.10)}.low td{background:rgba(0,120,212,.10)}code{color:#00ff88}.muted{color:#aab3c2}</style></head><body><h1>WinHacks SEO Auditor</h1><p class="muted">Generado: ${esc(report.generatedAt)}</p><p class="muted">Versión: ${esc(report.version)}. SEO dinámico detectado: ${hasDynamicSeoEngine ? "sí" : "no"}. Reports/docs/tools/scripts/components/templates ignorados.</p><div class="cards"><div class="card"><div>Score</div><div class="score">${report.score}</div></div><div class="card"><div>Páginas</div><h2>${report.pageCount}</h2></div><div class="card"><div>Críticos</div><h2>${counts.critical}</h2></div><div class="card"><div>Altos</div><h2>${counts.high}</h2></div><div class="card"><div>Medios</div><h2>${counts.medium}</h2></div><div class="card"><div>Bajos</div><h2>${counts.low}</h2></div></div><table><thead><tr><th>Severidad</th><th>Tipo</th><th>Archivo</th><th>Problema</th><th>Valor</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  await fs.writeFile(path.join(REPORT_DIR, "seo-report.html"), html, "utf8");

  console.log("\n====================================");
  console.log(" WinHacks SEO Auditor v1.5");
  console.log("====================================\n");
  console.log(`Páginas analizadas: ${report.pageCount}`);
  console.log(`SEO dinámico detectado: ${hasDynamicSeoEngine ? "sí" : "no"}`);
  console.log(`Score SEO: ${report.score}/100`);
  console.log(`Críticos: ${counts.critical}`);
  console.log(`Altos: ${counts.high}`);
  console.log(`Medios: ${counts.medium}`);
  console.log(`Bajos: ${counts.low}`);
  console.log("\nReportes generados:");
  console.log("reports/seo-report.html");
  console.log("reports/seo-report.md");
  console.log("reports/seo-report.json\n");
  if (counts.critical > 0) process.exitCode = 1;
})();
