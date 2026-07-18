#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline/promises');
const { stdin, stdout } = require('node:process');
const CONFIG = require('../../config/toolkit.config');

const ALLOWED_CATEGORIES = new Set([
  'secretos',
  'comandos',
  'redes',
  'personalizacion',
  'optimizacion',
  'seguridad'
]);

function getArg(name, fallback = '') {
  const prefix = `--${name}=`;
  const inline = process.argv.find((item) => item.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1] && !process.argv[index + 1].startsWith('--')) {
    return process.argv[index + 1];
  }

  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function slugify(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(value = '') {
  return JSON.stringify(String(value)).slice(1, -1);
}

function categoryLabel(category) {
  const labels = {
    secretos: 'Secretos',
    comandos: 'Comandos',
    redes: 'Redes',
    personalizacion: 'Personalización',
    optimizacion: 'Optimización',
    seguridad: 'Seguridad'
  };
  return labels[category] || category;
}

function extractYouTubeId(input = '') {
  const value = String(input).trim();
  if (!value) return '';

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || '';
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || '';
    if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || '';
    return url.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

function isoWithHondurasOffset(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Tegucigalpa',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}-06:00`;
}

function humanDate(date = new Date()) {
  return new Intl.DateTimeFormat('es-HN', {
    timeZone: 'America/Tegucigalpa',
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

function replaceAll(html, replacements) {
  let result = html;
  for (const [search, replacement] of replacements) {
    result = result.split(search).join(replacement);
  }
  return result;
}

function buildArticle(template, data) {
  const titleHtml = escapeHtml(data.title);
  const descriptionHtml = escapeHtml(data.description);
  const introHtml = escapeHtml(data.intro);
  const categoryHtml = escapeHtml(data.categoryLabel);
  const canonical = `${CONFIG.site.url}/${data.category}/${data.slug}.html`;
  const ogImage = `${CONFIG.site.url}/assets/img/og/og-${data.slug}.webp`;
  const relativeOgImage = `/assets/img/og/og-${data.slug}.webp`;
  const embedUrl = data.videoId
    ? `https://www.youtube.com/embed/${data.videoId}`
    : 'https://www.youtube.com/embed/VIDEO_ID_PENDIENTE';
  const publishedDate = data.isoDate.slice(0, 10);

  let html = replaceAll(template, [
    ['TÍTULO SEO PRINCIPAL | WinHacks', `${titleHtml} | WinHacks`],
    ['TÍTULO SEO PRINCIPAL', titleHtml],
    ['TÍTULO DEL ARTÍCULO', titleHtml],
    ['Título principal del artículo orientado a intención de búsqueda', titleHtml],
    ['DESCRIPCIÓN SEO DE 140 A 160 CARACTERES. Explica el beneficio, el tema y la versión de Windows si aplica.', descriptionHtml],
    ['DESCRIPCIÓN SEO DEL ARTÍCULO.', descriptionHtml],
    ['DESCRIPCIÓN CORTA PARA REDES SOCIALES.', descriptionHtml],
    ['DESCRIPCIÓN CORTA PARA X/TWITTER.', descriptionHtml],
    ['DESCRIPCIÓN DEL VIDEO.', descriptionHtml],
    ['CATEGORIA/SLUG-DEL-ARTICULO', `${data.category}/${data.slug}.html`],
    ['CATEGORÍA WINHACKS', categoryHtml],
    ['CATEGORÍA', categoryHtml],
    ['CATEGORIA', data.category],
    ['SLUG-DEL-ARTICULO', `${data.slug}.html`],
    ['og-NOMBRE.webp', `og-${data.slug}.webp`],
    ['2026-07-03T00:00:00-06:00', data.isoDate],
    ['2026-07-03', publishedDate],
    ['3 julio 2026', escapeHtml(data.humanDate)],
    ['TÍTULO DEL VIDEO', escapeHtml(data.videoTitle)],
    ['ID_DEL_VIDEO', data.videoId || 'VIDEO_ID_PENDIENTE'],
    ['VIDEO_ID', data.videoId || 'VIDEO_ID_PENDIENTE'],
    ['NOMBRE_DEL_TEMA', titleHtml],
    ['PREGUNTA FRECUENTE 1', `¿${titleHtml} funciona en Windows 11?`],
    ['PREGUNTA FRECUENTE 2', `¿Es seguro aplicar este tutorial?`],
    ['RESPUESTA CORTA, CLARA Y VERIFICABLE.', 'Sí, siempre que sigas los pasos, compruebes la compatibilidad y leas las advertencias del artículo.']
  ]);

  html = html
    .replace(
      /Resumen corto del tutorial\. Explica qué problema resuelve, qué aprenderá el usuario\s+y por qué vale la pena seguir leyendo\. Debe ser claro, directo y sin relleno\./,
      introHtml
    )
    .replace(
      /Responde en menos de 120 palabras qué es, para qué sirve, cuándo usarlo y si tiene algún riesgo\.\s+Este bloque debe ser suficientemente claro para usuarios y asistentes de IA\./,
      escapeHtml(data.quickAnswer)
    )
    .replace('Fácil / Intermedia / Avanzada', escapeHtml(data.difficulty))
    .replace('2 minutos', escapeHtml(data.duration))
    .replace('Bajo / Medio / Alto', escapeHtml(data.risk))
    .replace('https://www.youtube.com/embed/VIDEO_ID_PENDIENTE', embedUrl)
    .replace('title: "' + titleHtml + ' | WinHacks"', 'title: "' + escapeJs(data.title) + ' | WinHacks"')
    .replace('headline: "' + titleHtml + '"', 'headline: "' + escapeJs(data.title) + '"')
    .replace('description: "' + descriptionHtml + '"', 'description: "' + escapeJs(data.description) + '"')
    .replace(`url: "${canonical}"`, `url: "${escapeJs(canonical)}"`)
    .replace(`image: "${relativeOgImage}"`, `image: "${escapeJs(relativeOgImage)}"`)
    .replace(`category: "${categoryHtml}"`, `category: "${escapeJs(data.categoryLabel)}"`)
    .replace(`name: "${escapeHtml(data.videoTitle)}"`, `name: "${escapeJs(data.videoTitle)}"`)
    .replace(`description: "${descriptionHtml}"`, `description: "${escapeJs(data.description)}"`)
    .replace(`embedUrl: "${embedUrl}"`, `embedUrl: "${escapeJs(embedUrl)}"`);

  return html;
}

async function collectInput() {
  const nonInteractive = hasFlag('yes') || hasFlag('non-interactive');
  const provided = {
    title: getArg('title'),
    category: slugify(getArg('category')),
    slug: slugify(getArg('slug')),
    description: getArg('description'),
    intro: getArg('intro'),
    video: getArg('video'),
    difficulty: getArg('difficulty'),
    duration: getArg('duration'),
    risk: getArg('risk')
  };

  if (nonInteractive) return provided;

  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const title = provided.title || (await rl.question('Título del artículo: ')).trim();
    const suggestedSlug = slugify(title);
    const category = provided.category || slugify(await rl.question(
      'Categoría [secretos/comandos/redes/personalizacion/optimizacion/seguridad]: '
    ));
    const slugAnswer = provided.slug || (await rl.question(`Slug [${suggestedSlug}]: `)).trim();
    const description = provided.description || (await rl.question('Descripción SEO: ')).trim();
    const intro = provided.intro || (await rl.question('Introducción corta: ')).trim();
    const video = provided.video || (await rl.question('URL o ID de YouTube (opcional): ')).trim();
    const difficulty = provided.difficulty || (await rl.question('Dificultad [Fácil]: ')).trim();
    const duration = provided.duration || (await rl.question('Tiempo estimado [5 minutos]: ')).trim();
    const risk = provided.risk || (await rl.question('Riesgo [Bajo]: ')).trim();

    return {
      title,
      category,
      slug: slugAnswer || suggestedSlug,
      description,
      intro,
      video,
      difficulty,
      duration,
      risk
    };
  } finally {
    rl.close();
  }
}

function validate(data) {
  const errors = [];
  if (!data.title) errors.push('El título es obligatorio.');
  if (!ALLOWED_CATEGORIES.has(data.category)) {
    errors.push(`Categoría inválida: "${data.category}".`);
  }
  if (!data.slug) errors.push('El slug no puede quedar vacío.');
  if (!data.description) errors.push('La descripción SEO es obligatoria.');
  if (data.description.length > 165) errors.push('La descripción SEO no debe superar 165 caracteres.');
  if (!data.intro) errors.push('La introducción corta es obligatoria.');
  return errors;
}

async function main() {
  const answers = await collectInput();
  const now = new Date();
  const title = answers.title.trim();
  const category = slugify(answers.category);
  const slug = slugify(answers.slug || title);
  const description = answers.description.trim();
  const intro = answers.intro.trim();
  const videoId = extractYouTubeId(answers.video);

  const data = {
    title,
    category,
    categoryLabel: categoryLabel(category),
    slug,
    description,
    intro,
    quickAnswer: `${title} es una función, configuración o procedimiento de Windows explicado paso a paso por WinHacks. Revisa la compatibilidad, sigue las advertencias y comprueba el resultado antes de continuar con otros cambios.`,
    videoId,
    videoTitle: `${title} | WinHacks`,
    difficulty: answers.difficulty || 'Fácil',
    duration: answers.duration || '5 minutos',
    risk: answers.risk || 'Bajo',
    isoDate: isoWithHondurasOffset(now),
    humanDate: humanDate(now)
  };

  const errors = validate(data);
  if (answers.video && !videoId) errors.push('La URL o ID de YouTube no es válido.');
  if (errors.length) {
    throw new Error(errors.map((error) => `- ${error}`).join('\n'));
  }

  const templatePath = path.join(CONFIG.paths.root, 'templates', 'article-template.html');
  const outputDir = path.join(CONFIG.paths.root, category);
  const outputPath = path.join(outputDir, `${slug}.html`);
  const imageDir = path.join(CONFIG.paths.root, 'assets', 'images', 'articulos', slug);

  if (!fs.existsSync(templatePath)) {
    throw new Error('No se encontró templates/article-template.html.');
  }
  if (fs.existsSync(outputPath) && !hasFlag('force')) {
    throw new Error(`El artículo ya existe: ${path.relative(CONFIG.paths.root, outputPath)}\nUsa --force solo si deseas reemplazarlo.`);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(imageDir, { recursive: true });

  const template = fs.readFileSync(templatePath, 'utf8');
  const html = buildArticle(template, data);
  fs.writeFileSync(outputPath, html.endsWith('\n') ? html : `${html}\n`, 'utf8');

  const imageReadme = [
    `# Imágenes del artículo: ${title}`,
    '',
    `Página: /${category}/${slug}.html`,
    '',
    'Archivos sugeridos:',
    `- ${slug}-01.webp`,
    `- ${slug}-02.webp`,
    `- ${slug}-03.webp`,
    `- og-${slug}.webp (guardar en assets/img/og/)`,
    ''
  ].join('\n');
  fs.writeFileSync(path.join(imageDir, 'README.md'), imageReadme, 'utf8');

  console.log('\n✅ Artículo creado correctamente');
  console.log(`HTML: ${path.relative(CONFIG.paths.root, outputPath)}`);
  console.log(`Imágenes: ${path.relative(CONFIG.paths.root, imageDir)}`);
  console.log(`URL futura: ${CONFIG.site.url}/${category}/${slug}.html`);
  if (!videoId) console.log('Nota: el video quedó marcado como pendiente.');
  console.log('\nSiguiente paso: abre el HTML y completa el contenido, los pasos y las capturas.');
}

main().catch((error) => {
  console.error(`\n❌ No se pudo crear el artículo:\n${error.message}`);
  process.exitCode = 1;
});
