#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const fg = require('fast-glob');
const cheerio = require('cheerio');
const CONFIG = require('../../config/toolkit.config');

const STOPWORDS = new Set([
  'para','como','desde','hasta','este','esta','estos','estas','sobre','entre','cuando','donde','porque','puede','puedes','windows','winhacks','guia','paso','usar','hacer','mejor','forma','todo','todos','todas','con','sin','por','del','las','los','una','uno','unos','unas','que','sus','más','mas','muy','ya','tu','tus','su','se','en','el','la','y','o','a','de','es','al'
]);

const ENTITY_PATTERNS = [
  ['PowerShell', /powershell/gi], ['CMD', /\bcmd\b|símbolo del sistema/gi],
  ['Microsoft Defender', /microsoft defender|windows defender|seguridad de windows/gi],
  ['Firewall', /firewall/gi], ['SmartScreen', /smartscreen/gi],
  ['Registro de Windows', /registro de windows|regedit/gi], ['Directiva de grupo', /directiva de grupo|gpedit/gi],
  ['Wi-Fi', /wi[- ]?fi/gi], ['Redes', /\bred(es)?\b|network/gi],
  ['Winget', /winget/gi], ['SFC', /sfc\s*\/scannow|\bsfc\b/gi],
  ['DISM', /\bdism\b/gi], ['CHKDSK', /\bchkdsk\b/gi],
  ['Administrador de tareas', /administrador de tareas|task manager/gi],
  ['Windows Search', /windows search|búsqueda de windows/gi],
  ['Windows Update', /windows update/gi], ['BitLocker', /bitlocker/gi],
  ['OneDrive', /onedrive/gi], ['Hyper-V', /hyper-v/gi], ['WSL', /\bwsl\b|subsistema de windows para linux/gi]
];

function normalizeUrl(file) {
  const rel = file.replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return '/' + rel.replace(/index\.html$/i, '').replace(/\.html$/i, '');
}

function cleanText(value = '') {
  return String(value).replace(/\s+/g, ' ').trim();
}

function words(text) {
  return cleanText(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9áéíóúñü\- ]/gi, ' ').split(/\s+/)
    .filter(w => w.length >= 4 && !STOPWORDS.has(w));
}

function topKeywords(text, limit = 12) {
  const counts = new Map();
  for (const w of words(text)) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts.entries()].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit).map(([term,count]) => ({ term, count }));
}

function extractEntities(text) {
  const found = [];
  for (const [name, regex] of ENTITY_PATTERNS) {
    const matches = text.match(regex);
    if (matches?.length) found.push({ name, count: matches.length });
  }
  return found.sort((a,b) => b.count-a.count || a.name.localeCompare(b.name));
}

function pageCategory(file) {
  const parts = file.replace(/\\/g,'/').split('/');
  return parts.length > 1 ? parts[0] : 'general';
}

function resolveInternalHref(currentFile, href) {
  if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:|https?:\/\/)/i.test(href)) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  let resolved;
  if (clean.startsWith('/')) resolved = clean.slice(1);
  else resolved = path.posix.normalize(path.posix.join(path.posix.dirname(currentFile.replace(/\\/g,'/')), clean));
  if (resolved.endsWith('/')) resolved += 'index.html';
  else if (!path.posix.extname(resolved)) resolved += '.html';
  return resolved;
}

function similarity(a, b) {
  const aSet = new Set(a.keywords.map(k => k.term));
  const bSet = new Set(b.keywords.map(k => k.term));
  const shared = [...aSet].filter(x => bSet.has(x)).length;
  const entityA = new Set(a.entities.map(e => e.name));
  const entityB = new Set(b.entities.map(e => e.name));
  const entityShared = [...entityA].filter(x => entityB.has(x)).length;
  const categoryBonus = a.category === b.category ? 2 : 0;
  return shared + entityShared * 2 + categoryBonus;
}

function esc(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function buildHtml(report) {
  const topClusters = report.clusters.slice(0, 12).map(c => `
    <tr><td>${esc(c.name)}</td><td>${c.pages}</td><td>${c.entities}</td><td>${c.internalLinks}</td></tr>`).join('');
  const orphanRows = report.orphans.slice(0, 30).map(p => `<li><a href="..${esc(p.url)}">${esc(p.title)}</a> <small>${esc(p.category)}</small></li>`).join('');
  const recRows = report.recommendations.slice(0, 50).map(r => `<tr><td>${esc(r.sourceTitle)}</td><td>${esc(r.targetTitle)}</td><td>${r.score}</td></tr>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Knowledge Graph | WinHacks Toolkit</title><style>
  :root{color-scheme:dark;--bg:#07110d;--panel:#0d1c16;--line:#214333;--text:#f3fff8;--muted:#9cc3ad;--accent:#42e487}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text)}main{max-width:1180px;margin:auto;padding:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}.card,section{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}.value{font-size:2rem;font-weight:800;color:var(--accent)}h1,h2{margin-top:0}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid var(--line)}a{color:var(--accent)}small{color:var(--muted)}.cols{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:18px}@media(max-width:760px){.cols{grid-template-columns:1fr}}</style></head><body><main>
  <h1>WinHacks Knowledge Graph</h1><p><small>Generado: ${esc(report.generatedAt)}</small></p>
  <div class="grid"><div class="card"><div>Páginas</div><div class="value">${report.summary.pages}</div></div><div class="card"><div>Entidades</div><div class="value">${report.summary.uniqueEntities}</div></div><div class="card"><div>Clusters</div><div class="value">${report.summary.clusters}</div></div><div class="card"><div>Huérfanas</div><div class="value">${report.summary.orphans}</div></div><div class="card"><div>Enlaces sugeridos</div><div class="value">${report.summary.recommendations}</div></div></div>
  <div class="cols"><section><h2>Clusters</h2><table><thead><tr><th>Cluster</th><th>Páginas</th><th>Entidades</th><th>Enlaces</th></tr></thead><tbody>${topClusters}</tbody></table></section><section><h2>Páginas huérfanas</h2><ul>${orphanRows || '<li>Ninguna</li>'}</ul></section></div>
  <section style="margin-top:18px"><h2>Recomendaciones de enlazado interno</h2><table><thead><tr><th>Desde</th><th>Hacia</th><th>Relevancia</th></tr></thead><tbody>${recRows}</tbody></table></section>
</main></body></html>`;
}

async function main() {
  const files = await fg(CONFIG.content.publicGlobs, { cwd: CONFIG.paths.root, onlyFiles: true, unique: true, ignore: CONFIG.content.excludedDirectories.map(d => `${d}/**`) });
  const pages = [];
  for (const file of files.sort()) {
    const absolute = path.join(CONFIG.paths.root, file);
    const html = fs.readFileSync(absolute, 'utf8');
    const $ = cheerio.load(html);
    $('script,style,noscript,svg').remove();
    const title = cleanText($('h1').first().text() || $('title').text() || path.basename(file,'.html'));
    const description = cleanText($('meta[name="description"]').attr('content') || '');
    const bodyText = cleanText($('main').text() || $('article').text() || $('body').text());
    const hrefs = $('a[href]').map((_,a) => $(a).attr('href')).get();
    pages.push({
      file: file.replace(/\\/g,'/'), url: normalizeUrl(file), title, description,
      category: pageCategory(file), keywords: topKeywords(`${title} ${description} ${bodyText}`),
      entities: extractEntities(`${title} ${description} ${bodyText}`),
      outboundFiles: hrefs.map(h => resolveInternalHref(file,h)).filter(Boolean)
    });
  }
  const byFile = new Map(pages.map(p => [p.file,p]));
  for (const p of pages) {
    p.outbound = [...new Set(p.outboundFiles)].filter(f => byFile.has(f)).map(f => byFile.get(f).url);
    p.inbound = [];
  }
  for (const p of pages) for (const targetUrl of p.outbound) {
    const target = pages.find(x => x.url === targetUrl);
    if (target) target.inbound.push(p.url);
  }
  const clusters = [...new Set(pages.map(p => p.category))].map(name => {
    const members = pages.filter(p => p.category === name);
    return { name, pages: members.length, entities: new Set(members.flatMap(p => p.entities.map(e => e.name))).size, internalLinks: members.reduce((n,p) => n+p.outbound.length,0), urls: members.map(p=>p.url) };
  }).sort((a,b)=>b.pages-a.pages);
  const recommendations = [];
  for (const source of pages) {
    const linked = new Set(source.outbound);
    const candidates = pages.filter(t => t.url !== source.url && !linked.has(t.url)).map(target => ({ target, score: similarity(source,target) })).filter(x => x.score >= 5).sort((a,b)=>b.score-a.score).slice(0,3);
    for (const c of candidates) recommendations.push({ source: source.url, sourceTitle: source.title, target: c.target.url, targetTitle: c.target.title, score: c.score });
  }
  const entityMap = new Map();
  for (const p of pages) for (const e of p.entities) {
    const current = entityMap.get(e.name) || { name:e.name, mentions:0, pages:[] };
    current.mentions += e.count; current.pages.push(p.url); entityMap.set(e.name,current);
  }
  const orphans = pages.filter(p => p.inbound.length === 0 && p.url !== '/').map(p => ({ url:p.url,title:p.title,category:p.category,outbound:p.outbound.length }));
  const report = {
    version: '1.0.0', generatedAt: new Date().toISOString(),
    summary: { pages: pages.length, uniqueEntities: entityMap.size, clusters: clusters.length, orphans: orphans.length, recommendations: recommendations.length },
    entities: [...entityMap.values()].sort((a,b)=>b.mentions-a.mentions), clusters, orphans, recommendations,
    pages: pages.map(({outboundFiles,...p})=>p)
  };
  fs.mkdirSync(CONFIG.paths.reports,{recursive:true});
  fs.writeFileSync(CONFIG.paths.knowledgeReportJson, JSON.stringify(report,null,2)+'\n','utf8');
  fs.writeFileSync(CONFIG.paths.knowledgeReportHtml, buildHtml(report),'utf8');
  const md = [`# WinHacks Knowledge Graph`,``,`Generado: ${report.generatedAt}`,``,`- Páginas: ${report.summary.pages}`,`- Entidades únicas: ${report.summary.uniqueEntities}`,`- Clusters: ${report.summary.clusters}`,`- Páginas huérfanas: ${report.summary.orphans}`,`- Enlaces sugeridos: ${report.summary.recommendations}`,``,`## Clusters`,...clusters.map(c=>`- ${c.name}: ${c.pages} páginas, ${c.entities} entidades, ${c.internalLinks} enlaces`),``,`## Páginas huérfanas`,...orphans.map(p=>`- [${p.title}](${p.url})`),``,`## Recomendaciones principales`,...recommendations.slice(0,100).map(r=>`- ${r.sourceTitle} → ${r.targetTitle} (score ${r.score})`),''];
  fs.writeFileSync(CONFIG.paths.knowledgeReportMarkdown, md.join('\n'),'utf8');
  console.log(`Knowledge Graph listo: ${report.summary.pages} páginas, ${report.summary.uniqueEntities} entidades, ${report.summary.orphans} huérfanas, ${report.summary.recommendations} enlaces sugeridos.`);
}

main().catch(error => { console.error('Knowledge Graph falló:', error); process.exit(1); });
