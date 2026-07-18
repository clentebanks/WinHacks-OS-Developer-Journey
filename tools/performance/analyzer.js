'use strict';

const path = require('node:path');
const fs = require('node:fs');
const cheerio = require('cheerio');
const RULES = require('./rules');

const normalize = value => String(value || '').trim();
const isRemote = value => /^(?:https?:)?\/\//i.test(value) || /^data:/i.test(value);
const stripQuery = value => String(value || '').split(/[?#]/)[0];

function resolveLocalAsset(root, htmlFile, url) {
  const clean = stripQuery(url);
  if (!clean || isRemote(clean) || clean.startsWith('#')) return null;
  const relative = clean.startsWith('/')
    ? clean.replace(/^\/+/, '')
    : path.join(path.dirname(htmlFile), clean);
  const full = path.resolve(root, relative);
  if (!full.startsWith(path.resolve(root))) return null;
  return full;
}

function assetSize(root, htmlFile, url) {
  const full = resolveLocalAsset(root, htmlFile, url);
  if (!full) return null;
  try { return fs.statSync(full).size; } catch (_) { return null; }
}

function grade(value, good, warn, inverse = false) {
  if (inverse) return value >= good ? 'good' : value >= warn ? 'warn' : 'bad';
  return value <= good ? 'good' : value <= warn ? 'warn' : 'bad';
}

function scorePage(checks) {
  let earned = 0;
  let possible = 0;
  for (const [key, weight] of Object.entries(RULES.weights)) {
    possible += weight;
    if (checks[key]) earned += weight;
  }
  return Math.round((earned / possible) * 100);
}

function analyzePage({ file, html, root }) {
  const $ = cheerio.load(html);
  const thresholds = RULES.thresholds;
  const htmlBytes = Buffer.byteLength(html, 'utf8');
  const domNodes = $('*').length;

  const scripts = $('script[src]').map((_, node) => ({
    src: normalize($(node).attr('src')),
    defer: $(node).is('[defer]'),
    async: $(node).is('[async]'),
    module: normalize($(node).attr('type')).toLowerCase() === 'module'
  })).get();
  const blockingScripts = scripts.filter(item => !item.defer && !item.async && !item.module);

  const stylesheets = $('link[rel="stylesheet"][href]').map((_, node) => normalize($(node).attr('href'))).get();
  const inlineCssBytes = $('style').toArray().reduce((sum, node) => sum + Buffer.byteLength($(node).html() || '', 'utf8'), 0);

  const images = $('img').map((_, node) => {
    const image = $(node);
    const src = normalize(image.attr('src'));
    return {
      src,
      lazy: normalize(image.attr('loading')).toLowerCase() === 'lazy',
      eager: normalize(image.attr('loading')).toLowerCase() === 'eager',
      width: normalize(image.attr('width')),
      height: normalize(image.attr('height')),
      alt: normalize(image.attr('alt')),
      modern: /\.(?:webp|avif)$/i.test(stripQuery(src)),
      size: assetSize(root, file, src)
    };
  }).get();
  const contentImages = images.filter((_, index) => index > 0);
  const lazyEligible = contentImages.length;
  const lazyCount = contentImages.filter(image => image.lazy).length;
  const dimensionCount = images.filter(image => image.width && image.height).length;
  const modernCount = images.filter(image => image.modern).length;
  const altCount = images.filter(image => image.alt).length;

  const fontLinks = $('link[href*="fonts.googleapis.com"], link[href*="fonts.gstatic.com"]').map((_, node) => normalize($(node).attr('href'))).get();
  const hasFontDisplay = fontLinks.length === 0 || fontLinks.some(href => /[?&]display=swap(?:&|$)/i.test(href));
  const hasFontPreconnect = fontLinks.length === 0 || $('link[rel="preconnect"][href*="fonts.gstatic.com"], link[rel="preconnect"][href*="fonts.googleapis.com"]').length > 0;
  const hasPreloadImage = $('link[rel="preload"][as="image"]').length > 0 || images.length === 0;

  const assetUrls = [...scripts.map(item => item.src), ...stylesheets].filter(Boolean);
  const duplicateAssets = assetUrls.filter((value, index) => assetUrls.indexOf(value) !== index);
  const localJsBytes = scripts.reduce((sum, item) => sum + (assetSize(root, file, item.src) || 0), 0);
  const localCssBytes = stylesheets.reduce((sum, href) => sum + (assetSize(root, file, href) || 0), 0);
  const localImageBytes = images.reduce((sum, item) => sum + (item.size || 0), 0);

  const checks = {
    htmlSize: htmlBytes <= thresholds.htmlBytesWarn,
    domSize: domNodes <= thresholds.domNodesWarn,
    noBlockingScripts: blockingScripts.length === 0,
    limitedScripts: scripts.length <= thresholds.scriptCountWarn,
    limitedStylesheets: stylesheets.length <= thresholds.cssCountWarn,
    inlineCss: inlineCssBytes <= thresholds.inlineCssBytesWarn,
    lazyImages: lazyEligible === 0 || lazyCount === lazyEligible,
    imageDimensions: images.length === 0 || dimensionCount === images.length,
    modernImages: images.length === 0 || modernCount / images.length >= 0.8,
    imageAlt: images.length === 0 || altCount === images.length,
    fontDisplay: hasFontDisplay,
    fontPreconnect: hasFontPreconnect,
    preloadLcp: hasPreloadImage,
    noDuplicateAssets: duplicateAssets.length === 0,
    viewport: $('meta[name="viewport"]').length > 0
  };

  const recommendations = [];
  if (!checks.noBlockingScripts) recommendations.push(`Añadir defer/async a ${blockingScripts.length} script(s) bloqueante(s).`);
  if (!checks.imageDimensions) recommendations.push(`Definir width y height en ${images.length - dimensionCount} imagen(es).`);
  if (!checks.lazyImages) recommendations.push(`Añadir loading="lazy" a ${lazyEligible - lazyCount} imagen(es) fuera del hero.`);
  if (!checks.modernImages) recommendations.push('Convertir imágenes principales a WebP o AVIF.');
  if (!checks.htmlSize) recommendations.push('Reducir el tamaño del HTML generado.');
  if (!checks.domSize) recommendations.push('Reducir la cantidad de nodos DOM.');
  if (!checks.inlineCss) recommendations.push('Mover CSS inline voluminoso a archivos externos.');
  if (!checks.fontDisplay) recommendations.push('Usar display=swap en Google Fonts.');
  if (!checks.fontPreconnect) recommendations.push('Añadir preconnect para Google Fonts.');
  if (!checks.preloadLcp && images.length) recommendations.push('Precargar la imagen probable de LCP.');
  if (!checks.noDuplicateAssets) recommendations.push('Eliminar recursos CSS/JS duplicados.');

  const score = scorePage(checks);
  return {
    file,
    title: normalize($('title').first().text()),
    score,
    rating: score >= 90 ? 'Excelente' : score >= 75 ? 'Bueno' : score >= 60 ? 'Mejorable' : 'Crítico',
    checks,
    metrics: {
      htmlBytes,
      domNodes,
      scripts: scripts.length,
      blockingScripts: blockingScripts.length,
      stylesheets: stylesheets.length,
      inlineCssBytes,
      images: images.length,
      lazyImages: lazyCount,
      imagesWithDimensions: dimensionCount,
      modernImages: modernCount,
      localJsBytes,
      localCssBytes,
      localImageBytes,
      estimatedTransferBytes: htmlBytes + localJsBytes + localCssBytes + localImageBytes
    },
    diagnostics: {
      htmlSize: grade(htmlBytes, thresholds.htmlBytesGood, thresholds.htmlBytesWarn),
      domSize: grade(domNodes, thresholds.domNodesGood, thresholds.domNodesWarn),
      duplicateAssets: [...new Set(duplicateAssets)],
      blockingScriptSources: blockingScripts.map(item => item.src)
    },
    recommendations
  };
}

module.exports = { analyzePage };
