'use strict';

const fs = require('node:fs');
const path = require('node:path');
const config = require('../../config/toolkit.config');

function summarize(results, mode, backupDir) {
  const changedFiles = results.filter((item) => item.changed);
  const totalChanges = changedFiles.reduce((sum, item) => sum + item.changes.length, 0);
  return {
    generatedAt: new Date().toISOString(),
    mode,
    filesScanned: results.length,
    filesChanged: changedFiles.length,
    totalChanges,
    skipped: results.filter((item) => item.skipped).length,
    backupDir: backupDir ? path.relative(config.paths.root, backupDir).split(path.sep).join('/') : null,
    results
  };
}

function markdown(report) {
  const lines = [
    '# WinHacks Auto Fix Report',
    '',
    `- Modo: **${report.mode}**`,
    `- Archivos analizados: **${report.filesScanned}**`,
    `- Archivos con cambios: **${report.filesChanged}**`,
    `- Cambios seguros: **${report.totalChanges}**`,
    `- Generado: ${report.generatedAt}`,
    ''
  ];
  if (report.backupDir) lines.push(`- Respaldo: \`${report.backupDir}\``, '');
  lines.push('## Detalle', '');
  report.results.filter((item) => item.changed).forEach((item) => {
    lines.push(`### ${item.file}`, '');
    item.changes.forEach((change) => lines.push(`- ${change.message}`));
    lines.push('');
  });
  if (!report.filesChanged) lines.push('No se detectaron correcciones seguras pendientes.', '');
  return lines.join('\n');
}

function html(report) {
  const rows = report.results.filter((item) => item.changed).map((item) => `
    <tr><td><code>${escapeHtml(item.file)}</code></td><td>${item.changes.map((c) => escapeHtml(c.message)).join('<br>')}</td></tr>`).join('');
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>WinHacks Auto Fix Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:1100px;margin:40px auto;padding:0 20px;color:#17202a}header{border-bottom:1px solid #dfe6e9;padding-bottom:18px}.metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin:24px 0}.metric{border:1px solid #dfe6e9;border-radius:12px;padding:16px}.metric strong{display:block;font-size:1.8rem}table{width:100%;border-collapse:collapse}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #dfe6e9;padding:12px}code{word-break:break-word}.mode{font-weight:700}</style></head>
<body><header><h1>WinHacks Auto Fix Report</h1><p>Modo: <span class="mode">${escapeHtml(report.mode)}</span> · ${escapeHtml(report.generatedAt)}</p></header>
<section class="metrics"><div class="metric"><span>Analizados</span><strong>${report.filesScanned}</strong></div><div class="metric"><span>Con cambios</span><strong>${report.filesChanged}</strong></div><div class="metric"><span>Correcciones</span><strong>${report.totalChanges}</strong></div><div class="metric"><span>Omitidos</span><strong>${report.skipped}</strong></div></section>
${report.backupDir ? `<p>Respaldo: <code>${escapeHtml(report.backupDir)}</code></p>` : ''}
<table><thead><tr><th>Archivo</th><th>Cambios</th></tr></thead><tbody>${rows || '<tr><td colspan="2">No se detectaron correcciones seguras pendientes.</td></tr>'}</tbody></table></body></html>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function writeReports(results, mode, backupDir) {
  fs.mkdirSync(config.paths.reports, { recursive: true });
  const report = summarize(results, mode, backupDir);
  fs.writeFileSync(config.paths.autoFixReportJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(config.paths.autoFixReportMarkdown, markdown(report), 'utf8');
  fs.writeFileSync(config.paths.autoFixReportHtml, html(report), 'utf8');
  return report;
}

module.exports = { writeReports };
