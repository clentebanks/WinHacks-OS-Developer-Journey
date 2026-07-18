'use strict';

const fs = require('node:fs');
const path = require('node:path');
const fg = require('fast-glob');
const cheerio = require('cheerio');
const config = require('../../config/toolkit.config');
const rules = require('./rules');

function normalizeUrlPath(relativeFile) {
  const normalized = relativeFile.split(path.sep).join('/');
  if (normalized === 'index.html') return '/';
  if (normalized.endsWith('/index.html')) return `/${normalized.slice(0, -10)}`;
  return `/${normalized.replace(/\.html$/i, '')}`;
}

function absoluteUrl(relativeFile) {
  return new URL(normalizeUrlPath(relativeFile), `${config.site.url}/`).toString();
}

function shouldSkip(relativeFile) {
  return rules.skipFiles.some((entry) => relativeFile === entry || relativeFile.endsWith(`/${entry}`));
}

function addMeta($, attrs) {
  const node = $('<meta>');
  Object.entries(attrs).forEach(([key, value]) => node.attr(key, value));
  $('head').append('\n  ', node);
}

function ensureCanonical($, relativeFile, changes) {
  if ($('link[rel="canonical"]').length) return;
  const node = $('<link>').attr({ rel: 'canonical', href: absoluteUrl(relativeFile) });
  $('head').append('\n  ', node);
  changes.push({ rule: 'canonical', message: 'Canonical agregado.' });
}

function ensureRobotsMaxImagePreview($, changes) {
  const robots = $('meta[name="robots"]').first();
  if (!robots.length) {
    addMeta($, { name: 'robots', content: 'index, follow, max-image-preview:large' });
    changes.push({ rule: 'robots-max-image-preview', message: 'Meta robots agregado con max-image-preview:large.' });
    return;
  }

  const content = String(robots.attr('content') || '').trim();
  if (/max-image-preview\s*:\s*large/i.test(content)) return;
  const next = content ? `${content}, max-image-preview:large` : 'index, follow, max-image-preview:large';
  robots.attr('content', next);
  changes.push({ rule: 'robots-max-image-preview', message: 'max-image-preview:large agregado a robots.' });
}

function ensureOgLocale($, changes) {
  if ($('meta[property="og:locale"]').length) return;
  addMeta($, { property: 'og:locale', content: 'es_ES' });
  changes.push({ rule: 'og-locale', message: 'og:locale agregado.' });
}

function ensureTwitterCard($, changes) {
  if ($('meta[name="twitter:card"]').length) return;
  addMeta($, { name: 'twitter:card', content: 'summary_large_image' });
  changes.push({ rule: 'twitter-card', message: 'twitter:card agregado.' });
}

function improveImages($, changes) {
  let lazy = 0;
  let decoding = 0;
  $('img').each((index, element) => {
    const image = $(element);
    const isLikelyHero = index === 0 || image.closest('header, .hero, .article-hero, figure.article-image').length > 0;
    if (!isLikelyHero && !image.attr('loading')) {
      image.attr('loading', 'lazy');
      lazy += 1;
    }
    if (!image.attr('decoding')) {
      image.attr('decoding', 'async');
      decoding += 1;
    }
  });
  if (lazy) changes.push({ rule: 'image-loading', message: `loading=lazy agregado a ${lazy} imagen(es).`, count: lazy });
  if (decoding) changes.push({ rule: 'image-decoding', message: `decoding=async agregado a ${decoding} imagen(es).`, count: decoding });
}

function secureExternalLinks($, changes) {
  let count = 0;
  $('a[href^="http://"], a[href^="https://"]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');
    let target;
    try { target = new URL(href); } catch { return; }
    const siteHost = new URL(config.site.url).hostname;
    if (target.hostname === siteHost) return;
    if (link.attr('target') !== '_blank') return;
    const rel = new Set(String(link.attr('rel') || '').split(/\s+/).filter(Boolean));
    const before = rel.size;
    rel.add('noopener');
    rel.add('noreferrer');
    if (rel.size !== before || !link.attr('rel')) {
      link.attr('rel', [...rel].join(' '));
      count += 1;
    }
  });
  if (count) changes.push({ rule: 'external-link-security', message: `rel=noopener noreferrer agregado a ${count} enlace(s).`, count });
}

function serialize($, original) {
  const rendered = $.html();
  if (/^\s*<!doctype html>/i.test(original) && !/^\s*<!doctype html>/i.test(rendered)) {
    return `<!DOCTYPE html>\n${rendered}`;
  }
  return rendered;
}

async function analyzeAndFix({ apply = false, backupDir = null } = {}) {
  const files = await fg(config.content.publicGlobs, {
    cwd: config.paths.root,
    onlyFiles: true,
    unique: true,
    ignore: config.content.excludedDirectories.map((dir) => `${dir}/**`)
  });

  const results = [];
  for (const relativeFile of files.sort()) {
    if (shouldSkip(relativeFile)) continue;
    const fullPath = path.join(config.paths.root, relativeFile);
    const original = fs.readFileSync(fullPath, 'utf8');
    const $ = cheerio.load(original, { decodeEntities: false });
    const changes = [];

    if (!$('head').length) {
      results.push({ file: relativeFile, changed: false, skipped: true, reason: 'Documento sin <head>.' });
      continue;
    }

    ensureCanonical($, relativeFile, changes);
    ensureRobotsMaxImagePreview($, changes);
    ensureOgLocale($, changes);
    ensureTwitterCard($, changes);
    improveImages($, changes);
    secureExternalLinks($, changes);

    const changed = changes.length > 0;
    if (apply && changed) {
      if (backupDir) {
        const backupPath = path.join(backupDir, relativeFile);
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        fs.copyFileSync(fullPath, backupPath);
      }
      fs.writeFileSync(fullPath, serialize($, original), 'utf8');
    }

    results.push({ file: relativeFile, changed, skipped: false, changes });
  }

  return results;
}

module.exports = { analyzeAndFix };
