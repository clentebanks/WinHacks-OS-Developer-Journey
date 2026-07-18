#!/usr/bin/env node

/*
  WinHacks Sitemap Generator
  Archivo: scripts/generate-sitemap.js

  Uso:
    node scripts/generate-sitemap.js

  Resultado:
    Genera /sitemap.xml automáticamente desde los archivos .html públicos.
*/

const fs = require("fs");
const path = require("path");
const CONFIG = require("../config/toolkit.config");

const SITE_URL = CONFIG.site.url;
const ROOT_DIR = CONFIG.paths.root;
const OUTPUT_FILE = CONFIG.paths.sitemap;
const EXCLUDED_DIRS = new Set(CONFIG.content.excludedDirectories);

const EXCLUDED_FILES = [
  /^google.*\.html$/i,
  /^404\.html$/i
];

function isExcludedFile(fileName) {
  return EXCLUDED_FILES.some((pattern) => pattern.test(fileName));
}

function isNoIndexPage(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html) ||
    /<meta\s+[^>]*content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["']/i.test(html);
}

function walkDirectory(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        walkDirectory(fullPath, files);
      }
      continue;
    }

    if (
      entry.isFile() &&
      entry.name.endsWith(".html") &&
      !isExcludedFile(entry.name) &&
      !isNoIndexPage(fullPath)
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function toUrl(filePath) {
  let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");

  if (relativePath === "index.html") {
    return `${SITE_URL}/`;
  }

  if (relativePath.endsWith("/index.html")) {
    relativePath = relativePath.replace(/\/index\.html$/, "/");
    return `${SITE_URL}/${relativePath}`;
  }

  return `${SITE_URL}/${relativePath}`;
}

function getLastMod(filePath) {
  const stats = fs.statSync(filePath);
  return stats.mtime.toISOString().split("T")[0];
}

function getChangeFreq(url) {
  if (url === `${SITE_URL}/`) return "daily";
  if (url.endsWith("/")) return "weekly";

  if (
    url.includes("privacy-policy") ||
    url.includes("terms") ||
    url.includes("disclaimer")
  ) {
    return "yearly";
  }

  return "monthly";
}

function getPriority(url) {
  if (url === `${SITE_URL}/`) return "1.0";

  if (
    url.includes("/academy/") ||
    url.includes("/recursos/guia-50-secretos") ||
    url.includes("/recursos/checklist") ||
    url.includes("/secretos/") ||
    url.includes("/comandos/") ||
    url.includes("/optimizacion/") ||
    url.includes("/seguridad/")
  ) {
    return url.endsWith("/") ? "0.9" : "0.8";
  }

  if (
    url.includes("/redes/") ||
    url.includes("/personalizacion/") ||
    url.includes("/recursos/")
  ) {
    return url.endsWith("/") ? "0.8" : "0.7";
  }

  return "0.5";
}

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function generateSitemap() {
  const htmlFiles = walkDirectory(ROOT_DIR);

  const urls = htmlFiles
    .map((filePath) => ({
      loc: toUrl(filePath),
      lastmod: getLastMod(filePath),
      changefreq: getChangeFreq(toUrl(filePath)),
      priority: getPriority(toUrl(filePath))
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  fs.writeFileSync(OUTPUT_FILE, xml, "utf8");

  console.log(`✅ Sitemap generado correctamente`);
  console.log(`📄 Archivo: ${OUTPUT_FILE}`);
  console.log(`🔗 URLs incluidas: ${urls.length}`);
}

generateSitemap();
