'use strict';

const fs = require('fs-extra');

const escapeHtml = value => String(value || '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

function badge(value) {
  return value ? '<span class="ok">Sí</span>' : '<span class="bad">No</span>';
}

async function writeHtmlReport(filePath, report) {
  const rows = report.pages.slice().sort((a, b) => a.score - b.score).map(page => `
    <tr>
      <td><code>${escapeHtml(page.file)}</code><small>${escapeHtml(page.title || page.h1)}</small></td>
      <td><strong>${page.score}</strong></td>
      <td>${badge(page.checks.schema)}</td>
      <td>${badge(page.checks.breadcrumbSchema)}</td>
      <td>${badge(page.checks.faqOrHowToSchema)}</td>
      <td>${badge(page.checks.author)}</td>
      <td>${badge(page.checks.dates)}</td>
      <td>${escapeHtml(page.recommendations.slice(0, 2).join(' '))}</td>
    </tr>`).join('');

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>WinHacks GEO Report</title>
<style>
:root{color-scheme:dark;--bg:#07110d;--panel:#0d1b15;--line:#234332;--text:#effbf4;--muted:#9ab6a5;--accent:#43d17c;--bad:#ff8a8a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,sans-serif}.wrap{max-width:1450px;margin:auto;padding:28px}.hero{display:flex;justify-content:space-between;gap:20px;align-items:end;margin-bottom:22px}.score{font-size:64px;font-weight:800;color:var(--accent)}h1{margin:0;font-size:32px}p{color:var(--muted)}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card strong{display:block;font-size:28px}.table{overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:14px}table{width:100%;border-collapse:collapse;min-width:1100px}th,td{padding:12px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{position:sticky;top:0;background:#102219}small{display:block;color:var(--muted);max-width:420px}.ok{color:var(--accent);font-weight:700}.bad{color:var(--bad);font-weight:700}code{color:#d7ffe7}@media(max-width:800px){.metrics{grid-template-columns:repeat(2,1fr)}.hero{display:block}.score{font-size:48px}}
</style>
</head>
<body><main class="wrap">
<section class="hero"><div><h1>WinHacks GEO Auditor</h1><p>Generado ${escapeHtml(report.generatedAt)} · ${report.summary.pages} páginas analizadas</p></div><div><span class="score">${report.summary.score}</span>/100</div></section>
<section class="metrics">
<div class="card"><span>Páginas listas</span><strong>${report.summary.ready}</strong></div>
<div class="card"><span>Prioridad alta</span><strong>${report.summary.highPriority}</strong></div>
<div class="card"><span>Schema válido</span><strong>${report.summary.coverage.schema}%</strong></div>
<div class="card"><span>Respuesta directa</span><strong>${report.summary.coverage.directAnswer}%</strong></div>
</section>
<section class="table"><table><thead><tr><th>Página</th><th>Score</th><th>Schema</th><th>Breadcrumb</th><th>FAQ/HowTo</th><th>Autor</th><th>Fechas</th><th>Prioridad</th></tr></thead><tbody>${rows}</tbody></table></section>
</main></body></html>`;
  await fs.outputFile(filePath, html, 'utf8');
}

module.exports = { writeHtmlReport };
