'use strict';
const fs = require('fs-extra');
const esc = value => String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kb = bytes => (Number(bytes || 0) / 1024).toFixed(1);
async function writeHtmlReport(filePath, report) {
  const rows = report.pages.slice().sort((a,b)=>a.score-b.score).map(page => `<tr>
<td><code>${esc(page.file)}</code><small>${esc(page.title)}</small></td><td><strong>${page.score}</strong><small>${esc(page.rating)}</small></td>
<td>${kb(page.metrics.htmlBytes)} KB</td><td>${page.metrics.domNodes}</td><td>${page.metrics.blockingScripts}/${page.metrics.scripts}</td>
<td>${page.metrics.imagesWithDimensions}/${page.metrics.images}</td><td>${page.metrics.lazyImages}</td><td>${esc(page.recommendations.slice(0,2).join(' '))}</td></tr>`).join('');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WinHacks Performance Report</title><style>
:root{color-scheme:dark;--bg:#07110d;--panel:#0d1b15;--line:#234332;--text:#effbf4;--muted:#9ab6a5;--accent:#43d17c;--bad:#ff8a8a}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 system-ui,sans-serif}.wrap{max-width:1500px;margin:auto;padding:28px}.hero{display:flex;justify-content:space-between;gap:20px;align-items:end}.score{font-size:64px;font-weight:800;color:var(--accent)}h1{margin:0}p,small{color:var(--muted)}.metrics{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin:22px 0}.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card strong{display:block;font-size:26px}.note{border-left:4px solid var(--accent);padding:10px 14px;background:var(--panel);margin:0 0 20px}.table{overflow:auto;background:var(--panel);border:1px solid var(--line);border-radius:14px}table{width:100%;border-collapse:collapse;min-width:1150px}th,td{padding:11px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}th{position:sticky;top:0;background:#102219}small{display:block;max-width:400px}code{color:#d7ffe7}@media(max-width:850px){.metrics{grid-template-columns:repeat(2,1fr)}.hero{display:block}.score{font-size:48px}}</style></head><body><main class="wrap">
<section class="hero"><div><h1>WinHacks Performance Analyzer</h1><p>${esc(report.generatedAt)} · ${report.summary.pages} páginas</p></div><div><span class="score">${report.summary.score}</span>/100</div></section>
<section class="metrics"><div class="card">Excelentes<strong>${report.summary.excellent}</strong></div><div class="card">Críticas<strong>${report.summary.critical}</strong></div><div class="card">Scripts bloqueantes<strong>${report.summary.totals.blockingScripts}</strong></div><div class="card">Sin dimensiones<strong>${report.summary.totals.imagesWithoutDimensions}</strong></div><div class="card">Transferencia estimada<strong>${kb(report.summary.totals.estimatedTransferBytes)} KB</strong></div></section>
<p class="note">Auditoría estática del código. LCP, CLS e INP reales requieren Lighthouse o datos de usuarios reales.</p>
<section class="table"><table><thead><tr><th>Página</th><th>Score</th><th>HTML</th><th>DOM</th><th>JS bloqueante</th><th>Dimensiones</th><th>Lazy</th><th>Prioridad</th></tr></thead><tbody>${rows}</tbody></table></section>
</main></body></html>`;
  await fs.outputFile(filePath, html, 'utf8');
}
module.exports = { writeHtmlReport };
