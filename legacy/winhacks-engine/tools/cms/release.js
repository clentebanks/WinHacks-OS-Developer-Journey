#!/usr/bin/env node
'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const CONFIG = require('../../config/toolkit.config');
const cms = require('./lib');

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function has(name) { return process.argv.includes(`--${name}`); }
function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: CONFIG.paths.root, stdio: 'inherit', shell: process.platform === 'win32', ...options });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} falló`);
}

const slug = arg('slug');
if (!slug) {
  console.error('Uso: npm run release -- --slug <slug> [--force] [--dry-run] [--git] [--tag vX.Y.Z] [--deploy]');
  process.exit(1);
}

try {
  const publishArgs = [path.join(CONFIG.paths.root, 'tools', 'cms', 'publish.js'), '--slug', slug];
  if (has('force')) publishArgs.push('--force');
  if (has('dry-run')) publishArgs.push('--dry-run');
  if (has('skip-audit')) publishArgs.push('--skip-audit');
  run(process.execPath, publishArgs);
  if (has('dry-run')) process.exit(0);

  if (has('git')) {
    run('git', ['add', '.']);
    const message = arg('message', `Publicar ${slug}`);
    run('git', ['commit', '-m', message]);
  }
  const tag = arg('tag');
  if (tag) run('git', ['tag', tag]);
  if (has('deploy')) {
    console.log('Deploy solicitado. Se ejecutará Netlify CLI solo si está instalado y autenticado.');
    run('npx', ['netlify', 'deploy', '--prod']);
  }
  cms.appendHistory({ action: 'release', slug, git: has('git'), tag: tag || null, deploy: has('deploy') });
  console.log('Release completado.');
} catch (error) {
  console.error(`Release falló: ${error.message}`);
  process.exit(1);
}
