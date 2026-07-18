#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const CONFIG = require('../../config/toolkit.config');
const cms = require('./lib');

function arg(name, fallback = '') {
  const token = `--${name}`;
  const index = process.argv.indexOf(token);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}
function has(name) { return process.argv.includes(`--${name}`); }
function runNpm(script) {
  const result = spawnSync('npm', ['run', script], { cwd: CONFIG.paths.root, stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) throw new Error(`${script} falló con código ${result.status}`);
}

const slug = arg('slug');
if (!slug) {
  console.error('Uso: npm run publish -- --slug <slug> [--force] [--dry-run] [--skip-audit]');
  process.exit(1);
}

try {
  const draft = cms.loadDraft(slug);
  const force = has('force');
  const dryRun = has('dry-run');
  const validation = cms.validateDraft(draft, !force);
  for (const warning of validation.warnings) console.warn(`ADVERTENCIA: ${warning}`);
  if (!validation.ok) throw new Error(validation.errors.join(' '));

  const categoryDir = path.join(CONFIG.paths.root, draft.metadata.category);
  const publicFile = path.join(categoryDir, `${draft.metadata.slug}.html`);
  const packageDir = path.join(cms.publishedRoot, draft.metadata.slug);
  const archiveDir = path.join(cms.archiveRoot, `${draft.metadata.slug}-${new Date().toISOString().replace(/[:.]/g, '-')}`);

  console.log(`Borrador: ${cms.normalizePath(path.relative(CONFIG.paths.root, draft.dir))}`);
  console.log(`Destino web: ${cms.normalizePath(path.relative(CONFIG.paths.root, publicFile))}`);
  console.log(`Paquete CMS: ${cms.normalizePath(path.relative(CONFIG.paths.root, packageDir))}`);
  if (dryRun) {
    console.log('Dry run completado. No se modificó ningún archivo.');
    process.exit(0);
  }

  cms.ensureDir(categoryDir);
  if (fs.existsSync(packageDir)) {
    cms.copyDir(packageDir, archiveDir);
  }
  fs.copyFileSync(draft.articleFile, publicFile);
  cms.removeDir(packageDir);
  cms.copyDir(draft.dir, packageDir);

  const publishedMetadataFile = path.join(packageDir, 'metadata.json');
  const publishedMetadata = cms.readJson(publishedMetadataFile, {});
  publishedMetadata.status = 'published';
  publishedMetadata.dateModified = new Date().toISOString();
  publishedMetadata.publishedPath = cms.normalizePath(path.relative(CONFIG.paths.root, publicFile));
  cms.writeJson(publishedMetadataFile, publishedMetadata);

  const index = cms.loadIndex();
  const item = {
    slug: draft.metadata.slug,
    title: draft.metadata.headline || draft.metadata.title,
    category: draft.metadata.category,
    canonical: draft.metadata.canonical,
    publishedPath: publishedMetadata.publishedPath,
    publishedAt: new Date().toISOString(),
    packagePath: cms.normalizePath(path.relative(CONFIG.paths.root, packageDir))
  };
  index.items = index.items.filter(existing => existing.slug !== item.slug);
  index.items.push(item);
  index.items.sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  cms.saveIndex(index);
  cms.appendHistory({ action: 'publish', slug: item.slug, category: item.category, path: item.publishedPath });

  if (!has('keep-draft')) cms.removeDir(draft.dir);

  runNpm('build');
  runNpm('rss');
  runNpm('sitemap');
  if (!has('skip-audit')) runNpm('toolkit');

  console.log(`Publicado correctamente: ${item.publishedPath}`);
} catch (error) {
  console.error(`Publicación falló: ${error.message}`);
  process.exit(1);
}
