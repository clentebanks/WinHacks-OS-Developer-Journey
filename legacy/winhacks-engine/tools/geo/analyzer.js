'use strict';

const cheerio = require('cheerio');
const RULES = require('./rules');

const normalizeText = value => String(value || '').replace(/\s+/g, ' ').trim();
const wordCount = value => normalizeText(value).split(/\s+/).filter(Boolean).length;

function flattenSchemaTypes(value, output = new Set()) {
  if (!value) return output;
  if (Array.isArray(value)) {
    value.forEach(item => flattenSchemaTypes(item, output));
    return output;
  }
  if (typeof value !== 'object') return output;

  const type = value['@type'];
  if (Array.isArray(type)) type.forEach(item => output.add(String(item)));
  else if (type) output.add(String(type));

  if (Array.isArray(value['@graph'])) value['@graph'].forEach(item => flattenSchemaTypes(item, output));
  Object.values(value).forEach(item => {
    if (item && typeof item === 'object') flattenSchemaTypes(item, output);
  });
  return output;
}

function parseSchemas($) {
  const types = new Set();
  const errors = [];
  const documents = [];

  $('script[type="application/ld+json"]').each((index, node) => {
    const raw = $(node).html() || '';
    try {
      const parsed = JSON.parse(raw);
      documents.push(parsed);
      flattenSchemaTypes(parsed, types);
    } catch (error) {
      errors.push({ index: index + 1, message: error.message });
    }
  });

  return { documents, types: [...types].sort(), errors };
}

function hasDirectAnswer($) {
  const selectors = [
    'main p',
    'article p',
    '.article-content p',
    '.content p',
    '.step-box p',
    '.faq-answer',
    'details p'
  ];
  const candidates = $(selectors.join(',')).map((_, node) => normalizeText($(node).text())).get();
  return candidates.some(text => {
    const words = wordCount(text);
    return words >= 20 && words <= 90;
  });
}

function extractEntities($) {
  const text = normalizeText([
    $('title').first().text(),
    $('h1').first().text(),
    $('h2').map((_, node) => $(node).text()).get().join(' '),
    $('meta[name="keywords"]').attr('content') || ''
  ].join(' '));

  const known = [
    'Windows 10', 'Windows 11', 'Microsoft', 'PowerShell', 'CMD', 'Windows Defender',
    'Microsoft Defender', 'Winget', 'Registro de Windows', 'Editor del Registro',
    'Símbolo del sistema', 'Administrador de tareas', 'Firewall', 'BitLocker',
    'Windows Update', 'Explorador de archivos', 'WinHacks'
  ];
  return known.filter(entity => text.toLowerCase().includes(entity.toLowerCase()));
}

function scorePage(checks) {
  const weights = RULES.weights;
  let earned = 0;
  let possible = 0;
  for (const [key, weight] of Object.entries(weights)) {
    possible += weight;
    if (checks[key]) earned += weight;
  }
  return Math.round((earned / possible) * 100);
}

function analyzePage({ file, html, siteUrl }) {
  const $ = cheerio.load(html);
  const schemas = parseSchemas($);
  const schemaTypes = new Set(schemas.types);
  const robots = normalizeText($('meta[name="robots"]').attr('content'));
  const canonical = normalizeText($('link[rel="canonical"]').attr('href'));
  const ogTitle = normalizeText($('meta[property="og:title"]').attr('content'));
  const ogDescription = normalizeText($('meta[property="og:description"]').attr('content'));
  const ogImage = normalizeText($('meta[property="og:image"]').attr('content'));
  const twitterCard = normalizeText($('meta[name="twitter:card"]').attr('content'));
  const twitterImage = normalizeText($('meta[name="twitter:image"]').attr('content'));
  const author = normalizeText(
    $('meta[name="author"]').attr('content') ||
    $('[rel="author"]').first().text() ||
    $('.author, .article-author, [itemprop="author"]').first().text()
  );
  const published = normalizeText(
    $('meta[property="article:published_time"]').attr('content') ||
    $('time[datetime]').first().attr('datetime') ||
    $('[itemprop="datePublished"]').attr('content')
  );
  const modified = normalizeText(
    $('meta[property="article:modified_time"]').attr('content') ||
    $('[itemprop="dateModified"]').attr('content')
  );

  const faqVisible = $('details, .faq-item, .faq-question, [data-faq]').length > 0;
  const stepsVisible = $('ol li, .step-box, [itemprop="step"], .step-number').length >= 2;
  const listsOrTables = $('ul li, ol li, table').length >= 3;
  const headings = $('h1').length === 1 && $('h2').length >= 1;
  const imageCount = $('img').length;
  const imagesWithAlt = $('img[alt]').filter((_, node) => normalizeText($(node).attr('alt')).length > 0).length;
  const entities = extractEntities($);

  const checks = {
    canonical: Boolean(canonical && canonical.startsWith(siteUrl)),
    robots: !/noindex/i.test(robots),
    maxImagePreview: /max-image-preview\s*:\s*large/i.test(robots) || /max-image-preview\s*:\s*large/i.test(html),
    openGraph: Boolean(ogTitle && ogDescription && ogImage),
    twitterCards: Boolean(twitterCard && twitterImage),
    schema: schemas.types.length > 0 && schemas.errors.length === 0,
    articleSchema: ['Article', 'NewsArticle', 'BlogPosting'].some(type => schemaTypes.has(type)),
    breadcrumbSchema: schemaTypes.has('BreadcrumbList'),
    faqOrHowToSchema: schemaTypes.has('FAQPage') || schemaTypes.has('HowTo') || faqVisible || stepsVisible,
    organizationOrWebsiteSchema: schemaTypes.has('Organization') || schemaTypes.has('WebSite'),
    author: Boolean(author || schemaTypes.has('Person')),
    dates: Boolean(published || modified),
    directAnswer: hasDirectAnswer($),
    structuredContent: faqVisible || stepsVisible || listsOrTables,
    headings,
    entities: entities.length >= 1,
    accessibleImages: imageCount === 0 || imagesWithAlt === imageCount
  };

  const recommendations = [];
  if (!checks.schema) recommendations.push('Agregar o corregir JSON-LD válido.');
  if (!checks.articleSchema) recommendations.push('Agregar Article o BlogPosting a las páginas editoriales.');
  if (!checks.breadcrumbSchema) recommendations.push('Agregar BreadcrumbList.');
  if (!checks.faqOrHowToSchema) recommendations.push('Agregar FAQPage o HowTo cuando el contenido lo justifique.');
  if (!checks.organizationOrWebsiteSchema) recommendations.push('Conectar la página con Organization o WebSite.');
  if (!checks.author) recommendations.push('Mostrar autor y datos de responsabilidad editorial.');
  if (!checks.dates) recommendations.push('Incluir fecha de publicación o actualización.');
  if (!checks.directAnswer) recommendations.push('Añadir una respuesta directa y breve cerca del inicio.');
  if (!checks.maxImagePreview) recommendations.push('Añadir max-image-preview:large.');
  if (!checks.openGraph) recommendations.push('Completar Open Graph, especialmente og:image.');

  return {
    file,
    title: normalizeText($('title').first().text()),
    h1: normalizeText($('h1').first().text()),
    score: scorePage(checks),
    checks,
    schemaTypes: schemas.types,
    schemaErrors: schemas.errors,
    visibleSignals: {
      faq: faqVisible,
      steps: stepsVisible,
      listsOrTables,
      directAnswer: checks.directAnswer,
      entities,
      author,
      published,
      modified
    },
    recommendations
  };
}

module.exports = { analyzePage };
