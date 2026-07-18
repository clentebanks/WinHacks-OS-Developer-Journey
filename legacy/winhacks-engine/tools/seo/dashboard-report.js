const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const CONFIG = require("../../config/toolkit.config");

const ROOT = CONFIG.paths.root;
const REPORTS = CONFIG.paths.reports;
const JSON_FILE = CONFIG.paths.seoReportJson;
const SITE_URL = CONFIG.site.url;

const escapeHtml = (v = "") =>
  String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const normalize = (data) => {
  if (Array.isArray(data)) return { issues: data, summary: {} };
  return {
    issues: data.issues || data.problems || data.items || [],
    summary: data.summary || data.stats || data || {}
  };
};

const sev = (issue) => String(issue.severity || issue.level || "LOW").toUpperCase();
const code = (issue) => issue.code || issue.id || issue.type || "unknown";
const file = (issue) => issue.file || issue.path || issue.page || "sin-archivo";
const msg = (issue) => issue.message || issue.msg || issue.text || issue.description || "";
const value = (issue) => {
  const v = issue.value ?? issue.target ?? issue.url ?? issue.src ?? issue.href ?? "";
  if (v && typeof v === "object") return JSON.stringify(v, null, 2);
  return v;
};

const isExternal = (href = "") =>
  /^(https?:)?\/\//i.test(href) ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("javascript:");

const cleanHref = (href = "") =>
  String(href)
    .replace(/^https?:\/\/winhacks\.dev/i, "")
    .split("#")[0]
    .split("?")[0]
    .trim();

function normalizeToFile(href = "") {
  href = cleanHref(href);
  if (!href || href === "/") return "index.html";
  if (href.startsWith("/")) href = href.slice(1);
  if (href.endsWith("/")) href += "index.html";
  if (!path.extname(href)) href += ".html";
  return href.replace(/\\/g, "/");
}

async function getComponentLinks() {
  const linked = new Set();
  const componentFiles = [
    path.join(ROOT, "components", "navbar.html"),
    path.join(ROOT, "components", "footer.html")
  ];

  for (const componentFile of componentFiles) {
    if (!(await fs.pathExists(componentFile))) continue;
    const html = await fs.readFile(componentFile, "utf8");
    const $ = cheerio.load(html);

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      if (!href || href.startsWith("#") || isExternal(href)) return;
      linked.add(normalizeToFile(href));
    });
  }

  return linked;
}

function filterFalseOrphans(issues, componentLinks) {
  return issues.filter((issue) => {
    if (code(issue) !== "page.orphan_possible") return true;
    const targetFile = normalizeToFile(file(issue));
    return !componentLinks.has(targetFile);
  });
}

const categoryOf = (issue) => {
  const c = code(issue).toLowerCase();

  if (c.includes("link")) return "links";
  if (c.includes("image") || c.includes("alt")) return "images";
  if (
    c.includes("title") ||
    c.includes("description") ||
    c.includes("canonical") ||
    c.includes("og.") ||
    c.includes("twitter") ||
    c.includes("robots")
  ) return "metadata";
  if (c.includes("schema")) return "schema";
  if (c.includes("discover")) return "discover";
  if (c.includes("geo") || c.includes("llms") || c.includes("sitemap") || c.includes("feed")) return "geo";
  if (c.includes("h1") || c.includes("h2") || c.includes("h3") || c.includes("heading")) return "headings";
  if (c.includes("performance") || c.includes("css") || c.includes("js")) return "performance";

  return "other";
};

const categoryLabels = {
  metadata: "Metadata",
  links: "Enlaces",
  images: "Imágenes",
  schema: "Schema",
  discover: "Google Discover",
  geo: "GEO / IA",
  headings: "Headings",
  performance: "Performance",
  other: "Otros"
};

const categoryIcons = {
  metadata: "🧾",
  links: "🔗",
  images: "🖼️",
  schema: "🧩",
  discover: "📰",
  geo: "🤖",
  headings: "🔤",
  performance: "⚡",
  other: "📦"
};

const categoryReports = {
  metadata: "metadata.md",
  links: "links.md",
  images: "images.md",
  schema: "schema.md",
  discover: "discover.md",
  geo: "geo.md",
  headings: "headings.md",
  performance: "performance.md",
  other: "other.md"
};

const mdEscape = (v = "") => String(v).replace(/\r\n/g, "\n");

async function writeMarkdownReport(name, title, list) {
  let md = `# ${title}\n\n`;
  md += `Total: **${list.length}**\n\n`;
  md += `Generado automáticamente por WinHacks SEO Auditor.\n\n`;

  if (!list.length) {
    md += `✅ Sin problemas encontrados.\n`;
  } else {
    const byFile = {};

    for (const issue of list) {
      const f = file(issue);
      if (!byFile[f]) byFile[f] = [];
      byFile[f].push(issue);
    }

    for (const f of Object.keys(byFile).sort()) {
      md += `---\n\n`;
      md += `## ${f}\n\n`;

      for (const issue of byFile[f]) {
        const suggestion = issue.suggestion ? ` Sugerencia: ${issue.suggestion}` : "";
        md += `### ${sev(issue)} — ${code(issue)}\n\n`;
        md += `${msg(issue)}${suggestion}\n\n`;

        if (value(issue)) {
          md += "```text\n";
          md += mdEscape(value(issue));
          md += "\n```\n\n";
        }
      }
    }
  }

  await fs.writeFile(path.join(REPORTS, name), md, "utf8");
}

function categoryScore(high, medium, low) {
  const penalty = high * 4 + medium * 1.5 + low * 0.4;
  return Math.max(0, Math.round(100 - penalty));
}

function getPagesCount(data, summary) {
  if (typeof data.pageCount === "number") return data.pageCount;
  if (typeof data.totalPages === "number") return data.totalPages;
  if (typeof data.pagesAnalyzed === "number") return data.pagesAnalyzed;
  if (Array.isArray(data.pages)) return data.pages.length;
  if (Array.isArray(summary.pages)) return summary.pages.length;
  if (typeof summary.pageCount === "number") return summary.pageCount;
  if (typeof summary.totalPages === "number") return summary.totalPages;
  if (typeof summary.pagesAnalyzed === "number") return summary.pagesAnalyzed;
  return "N/D";
}

async function main() {
  if (!(await fs.pathExists(JSON_FILE))) {
    console.error("No existe reports/seo-report.json. Ejecuta primero: npm run seo:raw");
    process.exit(1);
  }

  const data = await fs.readJson(JSON_FILE);
  const { summary } = normalize(data);
  const componentLinks = await getComponentLinks();
  const issues = filterFalseOrphans(normalize(data).issues, componentLinks);

  await fs.ensureDir(REPORTS);

  const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  const byCat = {};

  for (const issue of issues) {
    const s = sev(issue);
    counts[s] = (counts[s] || 0) + 1;

    const cat = categoryOf(issue);
    if (!byCat[cat]) byCat[cat] = [];
    byCat[cat].push(issue);
  }

  const categories = [
    "links",
    "images",
    "metadata",
    "schema",
    "discover",
    "geo",
    "headings",
    "performance",
    "other"
  ];

  for (const cat of categories) {
    await writeMarkdownReport(categoryReports[cat], categoryLabels[cat], byCat[cat] || []);
  }

  await writeMarkdownReport("summary.md", "Resumen SEO WinHacks", issues);

  const score = Math.max(
    0,
    Math.round(100 - counts.CRITICAL * 10 - Math.min(counts.HIGH, 60) * 1.2 - Math.min(counts.MEDIUM, 120) * 0.25 - Math.min(counts.LOW, 250) * 0.05)
  );

  const pages = getPagesCount(data, summary);

  const categoryCards = categories.map((cat) => {
    const list = byCat[cat] || [];
    const high = list.filter(i => sev(i) === "HIGH" || sev(i) === "CRITICAL").length;
    const medium = list.filter(i => sev(i) === "MEDIUM").length;
    const low = list.filter(i => sev(i) === "LOW").length;

    return {
      cat,
      label: categoryLabels[cat],
      icon: categoryIcons[cat],
      total: list.length,
      high,
      medium,
      low,
      score: categoryScore(high, medium, low),
      file: categoryReports[cat]
    };
  });

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>WinHacks SEO Dashboard</title>
<style>
:root{--bg:#070B12;--panel:#101827;--panel2:#0d1422;--border:#223047;--text:#F5F5F5;--muted:#9aa4b2;--blue:#0078D4;--red:#FF2D2D;--orange:#FFB020;--yellow:#FFD166;--green:#00FF88}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,#0f2342 0,#070B12 38%);color:var(--text);font-family:Inter,Arial,sans-serif;line-height:1.5}.wrap{max-width:1320px;margin:0 auto;padding:34px}.hero{background:linear-gradient(135deg,#101827,#0a1322);border:1px solid var(--border);border-radius:22px;padding:30px;box-shadow:0 24px 80px rgba(0,0,0,.35)}h1{font-size:38px;margin:0 0 8px}.muted{color:var(--muted)}.score-big{font-size:72px;font-weight:900;color:var(--green);line-height:1;margin:18px 0}.kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin:24px 0 0}.kpi-card{background:var(--panel2);border:1px solid var(--border);border-radius:16px;padding:18px}.kpi-card b{display:block;font-size:30px;margin-top:5px}.critical b{color:var(--red)}.high b{color:var(--orange)}.medium b{color:var(--yellow)}.low b{color:var(--green)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin:28px 0}.card{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:22px;text-decoration:none;color:var(--text);transition:.2s}.card:hover{transform:translateY(-4px);border-color:var(--blue)}.card-top{display:flex;justify-content:space-between;gap:12px;align-items:center}.icon{font-size:30px}.card h2{margin:10px 0 6px;font-size:22px}.card .num{font-size:34px;font-weight:900}.badge{display:inline-block;margin-top:12px;padding:6px 10px;border-radius:999px;background:#0a1322;border:1px solid var(--border);color:var(--muted);font-size:13px}.good{color:var(--green)}.warn{color:var(--yellow)}.danger{color:var(--orange)}.bad{color:var(--red)}.panel{background:var(--panel);border:1px solid var(--border);border-radius:18px;margin:24px 0;overflow:hidden}.panel h2{margin:0;padding:18px 20px;border-bottom:1px solid var(--border)}table{width:100%;border-collapse:collapse;font-size:14px}th,td{padding:12px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top}th{background:#0d1422;color:var(--muted)}code{color:#d6e4ff;white-space:normal}.footer{margin:34px 0;color:var(--muted);font-size:13px}
</style>
</head>
<body>
<div class="wrap">
<section class="hero">
<h1>WinHacks SEO Auditor</h1>
<p class="muted">Generado: ${escapeHtml(new Date().toISOString())}</p>
<div class="score-big">${score}/100</div>
<p class="muted">Dashboard de auditoría técnica, SEO, Discover y GEO para WinHacks.</p>
<div class="kpi">
  <div class="kpi-card critical">Críticos <b>${counts.CRITICAL}</b></div>
  <div class="kpi-card high">Altos <b>${counts.HIGH}</b></div>
  <div class="kpi-card medium">Medios <b>${counts.MEDIUM}</b></div>
  <div class="kpi-card low">Bajos <b>${counts.LOW}</b></div>
  <div class="kpi-card">Páginas <b>${escapeHtml(pages)}</b></div>
</div>
</section>
<div class="grid">
${categoryCards.map(card => {
  const cls = card.score >= 90 ? "good" : card.score >= 75 ? "warn" : card.score >= 50 ? "danger" : "bad";
  return `<a class="card" href="${card.file}"><div class="card-top"><span class="icon">${card.icon}</span><span class="${cls}">${card.score}/100</span></div><h2>${escapeHtml(card.label)}</h2><div class="num">${card.total}</div><div class="muted">Problemas detectados</div><span class="badge">High: ${card.high} · Medium: ${card.medium} · Low: ${card.low}</span></a>`;
}).join("")}
</div>
<section class="panel">
<h2>Problemas principales</h2>
<table><thead><tr><th>Severidad</th><th>Tipo</th><th>Archivo</th><th>Problema</th><th>Valor</th></tr></thead><tbody>
${issues.filter(i => ["CRITICAL", "HIGH"].includes(sev(i))).slice(0, 80).map(i => `<tr><td><strong>${escapeHtml(sev(i))}</strong></td><td><code>${escapeHtml(code(i))}</code></td><td><code>${escapeHtml(file(i))}</code></td><td>${escapeHtml(msg(i))}</td><td><code>${escapeHtml(value(i))}</code></td></tr>`).join("")}
</tbody></table>
</section>
<p class="footer">Este dashboard filtra falsos huérfanos detectados en components/navbar.html y components/footer.html.</p>
</div>
</body>
</html>`;

  await fs.writeFile(path.join(REPORTS, "index.html"), html, "utf8");

  await fs.writeJson(
    path.join(REPORTS, "score.json"),
    {
      score,
      counts,
      pages,
      generated: new Date().toISOString(),
      componentLinksCount: componentLinks.size,
      categories: categoryCards
    },
    { spaces: 2 }
  );

  console.log("✅ Dashboard profesional generado: reports/index.html");
  console.log("✅ Reportes Markdown generados en reports/");
  console.log(`✅ Enlaces de componentes detectados: ${componentLinks.size}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
