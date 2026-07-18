'use strict';

const fs = require('fs-extra');

function mark(value) { return value ? '✅' : '❌'; }

async function writeMarkdownReport(filePath, report) {
  const lines = [
    '# WinHacks GEO Auditor',
    '',
    `- Generado: ${report.generatedAt}`,
    `- Páginas: ${report.summary.pages}`,
    `- GEO Score: **${report.summary.score}/100**`,
    `- Páginas listas (80+): ${report.summary.ready}`,
    `- Páginas con prioridad alta (<50): ${report.summary.highPriority}`,
    '',
    '## Cobertura',
    '',
    '| Señal | Cobertura |',
    '|---|---:|',
    ...Object.entries(report.summary.coverage).map(([key, value]) => `| ${key} | ${value}% |`),
    '',
    '## Páginas con menor puntuación',
    '',
    '| Archivo | Score | Schema | Breadcrumb | FAQ/HowTo | Autor | Fechas |',
    '|---|---:|:---:|:---:|:---:|:---:|:---:|',
    ...report.pages.slice().sort((a, b) => a.score - b.score).slice(0, 40).map(page =>
      `| ${page.file} | ${page.score} | ${mark(page.checks.schema)} | ${mark(page.checks.breadcrumbSchema)} | ${mark(page.checks.faqOrHowToSchema)} | ${mark(page.checks.author)} | ${mark(page.checks.dates)} |`
    ),
    '',
    '## Recomendaciones prioritarias',
    '',
    ...report.summary.topRecommendations.map(item => `- **${item.count} páginas:** ${item.recommendation}`),
    ''
  ];
  await fs.outputFile(filePath, lines.join('\n'), 'utf8');
}

module.exports = { writeMarkdownReport };
