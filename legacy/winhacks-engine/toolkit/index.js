#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const CONFIG = require('../config/toolkit.config');

const startedAt = new Date();
const logLines = [];

function log(message = '') {
  console.log(message);
  logLines.push(message);
}

function persistLog(status) {
  fs.mkdirSync(CONFIG.paths.logs, { recursive: true });
  const stamp = startedAt.toISOString().replace(/[:.]/g, '-');
  const body = [
    `WinHacks Toolkit ${CONFIG.version}`,
    `Inicio: ${startedAt.toISOString()}`,
    `Fin: ${new Date().toISOString()}`,
    `Estado: ${status}`,
    '',
    ...logLines,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(CONFIG.paths.logs, `toolkit-${stamp}.log`), body, 'utf8');
  fs.writeFileSync(path.join(CONFIG.paths.logs, 'toolkit.log'), body, 'utf8');
}

function updateHistory() {
  if (!fs.existsSync(CONFIG.paths.scoreJson)) return;
  const score = JSON.parse(fs.readFileSync(CONFIG.paths.scoreJson, 'utf8'));
  let history = [];
  if (fs.existsSync(CONFIG.paths.historyJson)) {
    try { history = JSON.parse(fs.readFileSync(CONFIG.paths.historyJson, 'utf8')); } catch (_) {}
  }
  if (!Array.isArray(history)) history = [];
  history.push({
    generated: new Date().toISOString(),
    score: score.score ?? null,
    pages: score.pages ?? null,
    critical: score.counts?.CRITICAL ?? 0,
    high: score.counts?.HIGH ?? 0,
    medium: score.counts?.MEDIUM ?? 0,
    low: score.counts?.LOW ?? 0
  });
  fs.writeFileSync(CONFIG.paths.historyJson, JSON.stringify(history.slice(-100), null, 2) + '\n', 'utf8');
}

function runTask(task) {
  log(`\n▶ ${task.name}`);
  const result = spawnSync('npm', ['run', task.script], {
    cwd: CONFIG.paths.root,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  if (result.error || result.status !== 0) {
    const detail = result.error?.message || `código ${result.status}`;
    log(`✖ ${task.name} falló: ${detail}`);
    persistLog('ERROR');
    process.exit(result.status || 1);
  }
  log(`✔ ${task.name} completado`);
}

log('===================================');
log(`       WINHACKS TOOLKIT v${CONFIG.version}`);
log('===================================');

for (const task of CONFIG.toolkit.tasks) runTask(task);

updateHistory();
log('\n===================================');
log('✔ Toolkit ejecutado correctamente');
log('  Dashboard SEO: reports/index.html');
log('  Historial: reports/history.json');
log('  Log: logs/toolkit.log');
log('===================================\n');
persistLog('OK');
