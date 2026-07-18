'use strict';
const fs = require('fs-extra');
const kb = bytes => (bytes / 1024).toFixed(1);
async function writeMarkdownReport(filePath, report) {
  const lines = [
    '# WinHacks Performance Report', '',
    `Generado: ${report.generatedAt}`, '',
    `- Páginas: **${report.summary.pages}**`,
    `- Performance Score estático: **${report.summary.score}/100**`,
    `- Excelentes: **${report.summary.excellent}**`,
    `- Críticas: **${report.summary.critical}**`,
    `- Scripts bloqueantes: **${report.summary.totals.blockingScripts}**`,
    `- Imágenes sin dimensiones: **${report.summary.totals.imagesWithoutDimensions}**`, '',
    '> Este análisis es estático. No sustituye mediciones reales de Lighthouse o Chrome UX Report.', '',
    '## Páginas con menor puntuación', '',
    '| Página | Score | HTML | DOM | Scripts bloqueantes | Recomendación |',
    '|---|---:|---:|---:|---:|---|'
  ];
  report.pages.slice().sort((a,b)=>a.score-b.score).slice(0,50).forEach(page => {
    lines.push(`| \`${page.file}\` | ${page.score} | ${kb(page.metrics.htmlBytes)} KB | ${page.metrics.domNodes} | ${page.metrics.blockingScripts} | ${(page.recommendations[0] || 'Sin problemas prioritarios').replace(/\|/g,'\\|')} |`);
  });
  await fs.outputFile(filePath, lines.join('\n') + '\n', 'utf8');
}
module.exports = { writeMarkdownReport };
