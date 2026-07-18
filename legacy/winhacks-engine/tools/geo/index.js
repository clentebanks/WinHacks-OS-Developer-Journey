#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('fs-extra');
const glob = require('fast-glob');
const CONFIG = require('../../config/toolkit.config');
const { analyzePage } = require('./analyzer');
const { writeJsonReport } = require('./report-json');
const { writeMarkdownReport } = require('./report-md');
const { writeHtmlReport } = require('./report-html');

const EXCLUDE = [
  'node_modules/**', '.git/**', 'reports/**', 'docs/**', 'tools/**', 'scripts/**',
  'components/**', 'templates/**', 'build/**', 'dist/**', 'coverage/**', 'content/**',
  'toolkit/**', 'logs/**', 'google*.html'
];

function percentage(pages, key) {
  if (!pages.length) return 0;
  return Math.round((pages.filter(page => page.checks[key]).length / pages.length) * 100);
}

(async function main() {
  const files = await glob([
    ...CONFIG.content.publicGlobs,
    ...EXCLUDE.map(pattern => `!${pattern}`)
  ], { cwd: CONFIG.paths.root, onlyFiles: true, unique: true });

  const pages = [];
  for (const file of files) {
    const html = await fs.readFile(path.join(CONFIG.paths.root, file), 'utf8');
    pages.push(analyzePage({ file: file.replace(/\\/g, '/'), html, siteUrl: CONFIG.site.url }));
  }

  const score = pages.length ? Math.round(pages.reduce((sum, page) => sum + page.score, 0) / pages.length) : 0;
  const recommendationCounts = new Map();
  pages.forEach(page => page.recommendations.forEach(item => recommendationCounts.set(item, (recommendationCounts.get(item) || 0) + 1)));

  const report = {
    tool: 'WinHacks GEO Auditor',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    site: CONFIG.site,
    summary: {
      pages: pages.length,
      score,
      ready: pages.filter(page => page.score >= 80).length,
      highPriority: pages.filter(page => page.score < 50).length,
      coverage: {
        schema: percentage(pages, 'schema'),
        articleSchema: percentage(pages, 'articleSchema'),
        breadcrumb: percentage(pages, 'breadcrumbSchema'),
        faqOrHowTo: percentage(pages, 'faqOrHowToSchema'),
        organizationOrWebsite: percentage(pages, 'organizationOrWebsiteSchema'),
        author: percentage(pages, 'author'),
        dates: percentage(pages, 'dates'),
        directAnswer: percentage(pages, 'directAnswer'),
        structuredContent: percentage(pages, 'structuredContent'),
        maxImagePreview: percentage(pages, 'maxImagePreview')
      },
      topRecommendations: [...recommendationCounts.entries()]
        .map(([recommendation, count]) => ({ recommendation, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    },
    pages
  };

  await fs.ensureDir(CONFIG.paths.reports);
  await Promise.all([
    writeJsonReport(CONFIG.paths.geoReportJson, report),
    writeMarkdownReport(CONFIG.paths.geoReportMarkdown, report),
    writeHtmlReport(CONFIG.paths.geoReportHtml, report)
  ]);

  console.log('===================================');
  console.log('       WINHACKS GEO AUDITOR v1');
  console.log('===================================');
  console.log(`Páginas analizadas: ${report.summary.pages}`);
  console.log(`GEO Score: ${report.summary.score}/100`);
  console.log(`Páginas listas: ${report.summary.ready}`);
  console.log(`Prioridad alta: ${report.summary.highPriority}`);
  console.log('Reportes:');
  console.log('  reports/geo-report.html');
  console.log('  reports/geo-report.json');
  console.log('  reports/geo-report.md');
})();
