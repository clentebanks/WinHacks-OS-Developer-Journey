#!/usr/bin/env node

/*
  WinHacks RSS Generator
  Archivo: scripts/generate-rss.js

  Genera /feed.xml automáticamente leyendo las páginas HTML públicas.
  No requiere lista manual de artículos.
*/

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const CONFIG = require("../config/toolkit.config");

const SITE = CONFIG.site;
const ROOT_DIR = CONFIG.paths.root;
const OUTPUT_FILE = CONFIG.paths.feed;
const MAX_ITEMS = CONFIG.rss.maxItems;
const INCLUDED_DIRS = new Set(CONFIG.content.includedDirectories);
const EXCLUDED_DIRS = new Set(CONFIG.content.excludedDirectories);

const EXCLUDED_FILES = [
  /^404\.html$/i,
  /^index\.html$/i,
  /^privacy-policy\.html$/i,
  /^terms\.html$/i,
  /^disclaimer\.html$/i,
  /^contact\.html$/i,
  /^about\.html$/i,
  /^gracias-/i,
  /^thank/i
];

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripSiteTitle(title = "") {
  return title
    .replace(/\s*\|\s*WinHacks.*$/i, "")
    .replace(/\s*-\s*WinHacks.*$/i, "")
    .trim();
}

function cleanText(value = "") {
  return String(value).replace(/\s+/g, " ").trim();
}

function absoluteUrl(value = "") {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE.url}${value.startsWith("/") ? value : `/${value}`}`;
}

function isExcludedFile(fileName) {
  return EXCLUDED_FILES.some((pattern) => pattern.test(fileName));
}

function walkDirectory(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) walkDirectory(fullPath, files);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html") && !isExcludedFile(entry.name)) {
      const relativePath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, "/");
      const topDir = relativePath.split("/")[0];

      if (INCLUDED_DIRS.has(topDir)) files.push(fullPath);
    }
  }

  return files;
}

function filePathToUrl(filePath) {
  let relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");

  if (relativePath.endsWith("/index.html")) {
    relativePath = relativePath.replace(/\/index\.html$/, "/");
    return `${SITE.url}/${relativePath}`;
  }

  relativePath = relativePath.replace(/\.html$/, "");
  return `${SITE.url}/${relativePath}`;
}

function extractJsonLd($, type) {
  let result = null;

  $('script[type="application/ld+json"]').each((_, el) => {
    if (result) return;

    try {
      const raw = $(el).contents().text().trim();
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        if (item && item["@type"] === type) {
          result = item;
          return;
        }

        if (item && Array.isArray(item["@graph"])) {
          result = item["@graph"].find((graphItem) => graphItem["@type"] === type) || null;
          if (result) return;
        }
      }
    } catch (_) {}
  });

  return result;
}

function extractPage(filePath) {
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html);
  const stats = fs.statSync(filePath);

  const articleSchema = extractJsonLd($, "Article") || extractJsonLd($, "NewsArticle") || extractJsonLd($, "BlogPosting");

  const robots = cleanText($('meta[name="robots"]').attr("content") || "").toLowerCase();
  if (robots.includes("noindex")) return null;

  const title = stripSiteTitle(
    cleanText(
      $('meta[property="og:title"]').attr("content") ||
      articleSchema?.headline ||
      $("title").first().text() ||
      $("h1").first().text()
    )
  );

  const description = cleanText(
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    articleSchema?.description ||
    $("p").first().text()
  );

  if (!title || !description) return null;

  const loc = filePathToUrl(filePath);
  const canonical = $('link[rel="canonical"]').attr("href") || loc;

  const image = absoluteUrl(
    $('meta[property="og:image"]').attr("content") ||
    articleSchema?.image?.url ||
    (Array.isArray(articleSchema?.image) ? articleSchema.image[0] : articleSchema?.image) ||
    $("article img, main img, img").first().attr("src") ||
    ""
  );

  const date =
    articleSchema?.datePublished ||
    articleSchema?.dateModified ||
    stats.mtime.toISOString();

  return {
    title,
    description,
    loc: canonical.startsWith("http") ? canonical : loc,
    image,
    date: new Date(date).toUTCString(),
    mtime: stats.mtimeMs
  };
}

function generateRss() {
  const items = walkDirectory(ROOT_DIR)
    .map(extractPage)
    .filter(Boolean)
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, MAX_ITEMS);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(SITE.url)}</link>
    <atom:link href="${escapeXml(`${SITE.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE.description)}</description>
    <language>${escapeXml(SITE.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items
  .map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.loc)}</link>
      <guid isPermaLink="true">${escapeXml(item.loc)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${escapeXml(item.date)}</pubDate>${item.image ? `
      <media:content url="${escapeXml(item.image)}" medium="image" />` : ""}
    </item>`)
  .join("\n")}
  </channel>
</rss>
`;

  fs.writeFileSync(OUTPUT_FILE, xml, "utf8");

  console.log("✅ feed.xml generado automáticamente");
  console.log(`📄 Archivo: ${OUTPUT_FILE}`);
  console.log(`📰 Items incluidos: ${items.length}`);
}

generateRss();
