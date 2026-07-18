'use strict';

const fs = require('node:fs');
const path = require('node:path');
const CONFIG = require('../../config/toolkit.config');

const root = CONFIG.paths.root;
const cmsRoot = path.join(root, 'cms');
const contentDrafts = path.join(root, 'content', 'drafts');
const publishedRoot = path.join(cmsRoot, 'published');
const archiveRoot = path.join(cmsRoot, 'archive');
const indexFile = path.join(cmsRoot, 'index.json');
const historyFile = path.join(cmsRoot, 'history.json');

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return fallback; }
}
function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}
function copyDir(source, target) {
  ensureDir(path.dirname(target));
  fs.cpSync(source, target, { recursive: true, force: true });
}
function removeDir(dir) { if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); }
function listDrafts() {
  if (!fs.existsSync(contentDrafts)) return [];
  return fs.readdirSync(contentDrafts, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}
function loadDraft(slug) {
  const dir = path.join(contentDrafts, slug);
  if (!fs.existsSync(dir)) throw new Error(`No existe el borrador: ${slug}`);
  const metadataFile = path.join(dir, 'metadata.json');
  const articleFile = path.join(dir, 'article.html');
  if (!fs.existsSync(metadataFile)) throw new Error(`Falta metadata.json en ${slug}`);
  if (!fs.existsSync(articleFile)) throw new Error(`Falta article.html en ${slug}`);
  const metadata = readJson(metadataFile);
  if (!metadata || !metadata.category || !metadata.slug) throw new Error('metadata.json no contiene category/slug válidos');
  return { slug, dir, metadata, articleFile };
}
function validateDraft(draft, strict = true) {
  const errors = [];
  const warnings = [];
  const html = fs.readFileSync(draft.articleFile, 'utf8');
  if (!/<h1\b/i.test(html)) errors.push('El artículo no contiene H1.');
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push('El artículo no contiene <title>.');
  if (!/rel=["']canonical["']/i.test(html)) warnings.push('No se detectó canonical.');
  if (/PENDIENTE_|TÍTULO DEL|NOMBRE_DEL|SLUG-DEL|DESCRIPCIÓN SEO/i.test(html)) warnings.push('Quedan marcadores pendientes en article.html.');
  const checklist = draft.metadata.checklist || {};
  const pending = Object.entries(checklist).filter(([, value]) => value !== true).map(([key]) => key);
  if (pending.length) warnings.push(`Checklist pendiente: ${pending.join(', ')}.`);
  if (strict && warnings.length) errors.push('Publicación estricta bloqueada por advertencias. Usa --force solo después de revisar.');
  return { errors, warnings, ok: errors.length === 0 };
}
function loadIndex() {
  const data = readJson(indexFile, { version: '1.0.0', updatedAt: null, items: [] });
  if (!Array.isArray(data.items)) data.items = [];
  return data;
}
function saveIndex(index) { index.updatedAt = new Date().toISOString(); writeJson(indexFile, index); }
function appendHistory(event) {
  const history = readJson(historyFile, []);
  const list = Array.isArray(history) ? history : [];
  list.push({ at: new Date().toISOString(), ...event });
  writeJson(historyFile, list.slice(-500));
}
function normalizePath(value) { return value.split(path.sep).join('/'); }

module.exports = {
  root, cmsRoot, contentDrafts, publishedRoot, archiveRoot, indexFile, historyFile,
  ensureDir, readJson, writeJson, copyDir, removeDir, listDrafts, loadDraft,
  validateDraft, loadIndex, saveIndex, appendHistory, normalizePath
};
