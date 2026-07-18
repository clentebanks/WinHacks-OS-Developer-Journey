#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const config = require('../../config/toolkit.config');
const { analyzeAndFix } = require('./analyzer');
const { writeReports } = require('./reporters');

async function main() {
  const apply = process.argv.includes('--apply');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = apply ? path.join(config.paths.autoFixBackups, timestamp) : null;
  if (backupDir) fs.mkdirSync(backupDir, { recursive: true });

  console.log(`\nWinHacks Auto Fix Engine v1.0 — ${apply ? 'APPLY' : 'DRY RUN'}\n`);
  const results = await analyzeAndFix({ apply, backupDir });
  const report = writeReports(results, apply ? 'apply' : 'dry-run', backupDir);

  console.log(`Archivos analizados: ${report.filesScanned}`);
  console.log(`Archivos con cambios: ${report.filesChanged}`);
  console.log(`Correcciones seguras: ${report.totalChanges}`);
  if (backupDir) console.log(`Respaldo: ${path.relative(config.paths.root, backupDir)}`);
  console.log(`Reporte: ${path.relative(config.paths.root, config.paths.autoFixReportHtml)}\n`);
}

main().catch((error) => {
  console.error('Auto Fix Engine falló:', error);
  process.exitCode = 1;
});
