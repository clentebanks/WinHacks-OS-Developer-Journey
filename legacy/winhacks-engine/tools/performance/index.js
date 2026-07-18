#!/usr/bin/env node
'use strict';

const path = require('node:path');
const fs = require('fs-extra');
const glob = require('fast-glob');
const CONFIG = require('../../config/toolkit.config');
const RULES = require('./rules');
const { analyzePage } = require('./analyzer');
const { writeJsonReport } = require('./report-json');
const { writeMarkdownReport } = require('./report-md');
const { writeHtmlReport } = require('./report-html');

const EXCLUDE = ['node_modules/**','.git/**','reports/**','docs/**','tools/**','scripts/**','components/**','templates/**','build/**','dist/**','coverage/**','content/**','toolkit/**','logs/**','google*.html'];

(async function main() {
  const files = await glob([...CONFIG.content.publicGlobs, ...EXCLUDE.map(p => `!${p}`)], { cwd: CONFIG.paths.root, onlyFiles: true, unique: true });
  const pages = [];
  for (const file of files) {
    const html = await fs.readFile(path.join(CONFIG.paths.root, file), 'utf8');
    pages.push(analyzePage({ file: file.replace(/\\/g,'/'), html, root: CONFIG.paths.root }));
  }
  const sum = key => pages.reduce((total,page)=>total + Number(page.metrics[key] || 0), 0);
  const score = pages.length ? Math.round(pages.reduce((total,page)=>total+page.score,0)/pages.length) : 0;
  const report = {
    tool: 'WinHacks Performance Analyzer', version: RULES.version, generatedAt: new Date().toISOString(), site: CONFIG.site,
    methodology: 'Static source analysis; not field Core Web Vitals.',
    summary: {
      pages: pages.length, score,
      excellent: pages.filter(p=>p.score>=90).length,
      good: pages.filter(p=>p.score>=75&&p.score<90).length,
      needsImprovement: pages.filter(p=>p.score>=60&&p.score<75).length,
      critical: pages.filter(p=>p.score<60).length,
      totals: {
        blockingScripts: sum('blockingScripts'),
        images: sum('images'),
        imagesWithoutDimensions: sum('images') - sum('imagesWithDimensions'),
        estimatedTransferBytes: sum('estimatedTransferBytes')
      }
    }, pages
  };
  await fs.ensureDir(CONFIG.paths.reports);
  await Promise.all([
    writeJsonReport(CONFIG.paths.performanceReportJson, report),
    writeMarkdownReport(CONFIG.paths.performanceReportMarkdown, report),
    writeHtmlReport(CONFIG.paths.performanceReportHtml, report)
  ]);
  console.log('===================================');
  console.log('  WINHACKS PERFORMANCE ANALYZER v1');
  console.log('===================================');
  console.log(`Páginas analizadas: ${report.summary.pages}`);
  console.log(`Performance Score: ${report.summary.score}/100`);
  console.log(`Excelentes: ${report.summary.excellent}`);
  console.log(`Críticas: ${report.summary.critical}`);
  console.log('Reportes: reports/performance-report.{html,json,md}');
  console.log('Nota: análisis estático; no sustituye Core Web Vitals reales.');
})().catch(error => { console.error(error); process.exit(1); });
