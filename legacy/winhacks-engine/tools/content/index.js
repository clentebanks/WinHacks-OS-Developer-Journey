#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const CONFIG = require('../../config/toolkit.config');

function arg(name, fallback = '') {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}
function has(name) { return process.argv.includes(`--${name}`); }
function slugify(value='') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90);
}
function titleCase(value='') { return value.replace(/\b\w/g, c => c.toUpperCase()); }
function ensureDir(dir) { fs.mkdirSync(dir,{recursive:true}); }
function write(file, body) { fs.writeFileSync(file, body.endsWith('\n') ? body : body+'\n', 'utf8'); }
function readJson(file) { return JSON.parse(fs.readFileSync(file,'utf8')); }
function isoLocal() { return new Date().toISOString(); }
function dateEs() {
  return new Intl.DateTimeFormat('es-HN',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Tegucigalpa'}).format(new Date());
}
function escapeJson(value='') { return JSON.stringify(String(value)).slice(1,-1); }

function selectIdea() {
  const titleArg = arg('title');
  const categoryArg = arg('category');
  if (titleArg) return { title:titleArg, category:categoryArg || 'secretos', reason:'Tema proporcionado manualmente' };
  const planPath = CONFIG.paths.aiPlannerJson;
  if (!fs.existsSync(planPath)) throw new Error('Falta reports/ai-content-plan.json. Ejecuta npm run ai:plan o usa --title.');
  const plan = readJson(planPath);
  const idx = Math.max(0, Number(arg('idea','1')) - 1);
  const idea = plan.articles?.[idx];
  if (!idea) throw new Error(`No existe la idea ${idx+1} en el plan.`);
  return idea;
}

function replaceTemplate(template, data) {
  const replacements = [
    [/TÍTULO SEO PRINCIPAL \| WinHacks/g, `${data.title} | WinHacks`],
    [/TÍTULO SEO PRINCIPAL/g, data.title],
    [/TÍTULO DEL ARTÍCULO/g, data.title],
    [/Título principal del artículo orientado a intención de búsqueda/g, data.title],
    [/CATEGORIA\/SLUG-DEL-ARTICULO/g, `${data.category}/${data.slug}.html`],
    [/CATEGORÍA WINHACKS/g, data.categoryLabel],
    [/CATEGORÍA/g, data.categoryLabel],
    [/CATEGORIA/g, data.category],
    [/SLUG-DEL-ARTICULO/g, `${data.slug}.html`],
    [/og-NOMBRE\.webp/g, `og-${data.slug}.webp`],
    [/DESCRIPCIÓN SEO DE 140 A 160 CARACTERES\. Explica el beneficio, el tema y la versión de Windows si aplica\./g, data.description],
    [/DESCRIPCIÓN SEO DEL ARTÍCULO\./g, data.description],
    [/DESCRIPCIÓN CORTA PARA REDES SOCIALES\./g, data.socialDescription],
    [/DESCRIPCIÓN CORTA PARA X\/TWITTER\./g, data.socialDescription],
    [/Resumen corto del tutorial\. Explica qué problema resuelve, qué aprenderá el usuario\s+y por qué vale la pena seguir leyendo\. Debe ser claro, directo y sin relleno\./g, data.intro],
    [/¿Qué es NOMBRE_DEL_TEMA\?/g, `¿Qué es ${data.title}?`],
    [/Responde en menos de 120 palabras qué es, para qué sirve, cuándo usarlo y si tiene algún riesgo\.\s+Este bloque debe ser suficientemente claro para usuarios y asistentes de IA\./g, data.quickAnswer],
    [/3 julio 2026/g, dateEs()],
    [/2026-07-03T00:00:00-06:00/g, data.generatedAt],
    [/2026-07-03/g, data.generatedAt.slice(0,10)],
    [/TÍTULO DEL VIDEO/g, data.videoTitle],
    [/DESCRIPCIÓN DEL VIDEO\./g, data.socialDescription],
    [/VIDEO_ID/g, 'PENDIENTE_VIDEO_ID'],
    [/PREGUNTA FRECUENTE 1/g, `¿${data.title} funciona en Windows 11?`],
    [/PREGUNTA FRECUENTE 2/g, `¿Es seguro usar ${data.title.toLowerCase()}?`],
    [/RESPUESTA CORTA, CLARA Y VERIFICABLE\./g, 'Sí, siempre que sigas los pasos y revises las advertencias indicadas en el tutorial.'],
    [/NOMBRE_DEL_TEMA/g, data.title]
  ];
  let html = template;
  for (const [pattern,value] of replacements) html = html.replace(pattern,value);
  html = html.replace(/<strong>Fácil \/ Intermedia \/ Avanzada<\/strong>/, '<strong>Intermedia</strong>')
    .replace(/<strong>Bajo \/ Medio \/ Alto<\/strong>/, '<strong>Bajo</strong>');
  return html;
}

function main() {
  const idea = selectIdea();
  const category = slugify(arg('category', idea.category || 'secretos')) || 'secretos';
  const title = idea.title.replace(/^Short:\s*/i,'').trim();
  const slug = slugify(arg('slug', title));
  const categoryLabel = titleCase(category.replace(/-/g,' '));
  const generatedAt = isoLocal();
  const description = `Aprende ${title.toLowerCase()} en Windows 10 y 11 con pasos claros, recomendaciones de seguridad y soluciones prácticas de WinHacks.`.slice(0,158);
  const socialDescription = `Guía práctica de WinHacks para ${title.toLowerCase()} en Windows 10 y 11.`;
  const data = {
    title, slug, category, categoryLabel, generatedAt, description, socialDescription,
    intro:`En esta guía aprenderás ${title.toLowerCase()} de forma segura y paso a paso. Incluye requisitos, recomendaciones, comprobaciones y soluciones a los problemas más comunes.`,
    quickAnswer:`${title} es un procedimiento o función de Windows que puede ayudarte a administrar, diagnosticar o mejorar el sistema. Úsalo únicamente después de revisar los requisitos y crea un punto de restauración cuando el cambio afecte la configuración del equipo.`,
    videoTitle:`${title} en Windows 11`, reason:idea.reason || ''
  };

  const outRoot = path.join(CONFIG.paths.root,'content','drafts',slug);
  ensureDir(outRoot);
  const templatePath = path.join(CONFIG.paths.root,'templates','article-template.html');
  if (!fs.existsSync(templatePath)) throw new Error('No existe templates/article-template.html');
  const html = replaceTemplate(fs.readFileSync(templatePath,'utf8'),data);
  write(path.join(outRoot,'article.html'),html);
  write(path.join(outRoot,'article.md'),`# ${title}\n\n> Borrador generado por WinHacks Content Pipeline. Debe verificarse técnicamente antes de publicar.\n\n## Objetivo\n\n${data.intro}\n\n## Respuesta rápida\n\n${data.quickAnswer}\n\n## Requisitos\n\n- Windows 10 o Windows 11.\n- Cuenta con permisos adecuados.\n- Copia de seguridad o punto de restauración cuando corresponda.\n\n## Pasos\n\n1. Confirma la versión y edición de Windows.\n2. Sigue el procedimiento principal.\n3. Comprueba el resultado.\n4. Revierte el cambio si aparece un problema.\n\n## Problemas frecuentes\n\n- El ajuste no aparece en todas las ediciones.\n- Algunas opciones requieren permisos de administrador.\n- Una actualización de Windows puede cambiar la ubicación del ajuste.\n\n## FAQ\n\n### ¿Funciona en Windows 11?\n\nSí, pero debes validar la compilación y la edición.\n\n### ¿Es seguro?\n\nEs seguro cuando se siguen las advertencias y se conserva una forma de revertir el cambio.\n`);

  const metadata = {
    status:'draft', title:`${title} | WinHacks`, headline:title, slug, category,
    canonical:`https://winhacks.dev/${category}/${slug}.html`, description,
    ogImage:`/assets/img/og/og-${slug}.webp`, author:'Clent Ebanks',
    datePublished:generatedAt, dateModified:generatedAt,
    sourceIdea:{reason:data.reason}, checklist:{technicalVerification:false, screenshots:false, videoId:false, internalLinks:false, finalSeoReview:false}
  };
  write(path.join(outRoot,'metadata.json'),JSON.stringify(metadata,null,2));
  write(path.join(outRoot,'schema.json'),JSON.stringify({
    '@context':'https://schema.org','@type':'TechArticle',headline:title,description,
    author:{'@type':'Person',name:'Clent Ebanks'},publisher:{'@type':'Organization',name:'WinHacks'},
    datePublished:generatedAt,dateModified:generatedAt,mainEntityOfPage:metadata.canonical,
    image:`https://winhacks.dev/assets/img/og/og-${slug}.webp`,about:['Microsoft Windows','Windows 10','Windows 11']
  },null,2));
  write(path.join(outRoot,'youtube.md'),`# YouTube Pack — ${title}\n\n## Título\n${title} en Windows 11: guía rápida\n\n## Descripción\n${socialDescription}\n\nLee la guía completa: ${metadata.canonical}\n\n## Tags\nWindows 11, Windows 10, WinHacks, tutorial Windows, ${title}\n\n## Hashtags\n#Windows11 #WinHacks #TutorialWindows\n`);
  write(path.join(outRoot,'short-script.md'),`# Short — ${title}\n\n## Hook (0–3 s)\n¿Sabías que puedes ${title.toLowerCase()} en Windows?\n\n## Demostración (3–35 s)\n1. Muestra el problema.\n2. Abre la herramienta o configuración correcta.\n3. Ejecuta el procedimiento.\n4. Enseña el resultado.\n\n## Advertencia (35–45 s)\nVerifica tu versión de Windows y crea un punto de restauración cuando corresponda.\n\n## CTA (45–60 s)\nLa guía completa está en WinHacks.\n`);
  write(path.join(outRoot,'pinterest.md'),`# Pinterest\n\n**Título:** ${title} en Windows 11\n\n**Descripción:** ${socialDescription} Guarda este tutorial para consultarlo después.\n\n**Destino:** ${metadata.canonical}\n`);
  write(path.join(outRoot,'newsletter.md'),`# Newsletter\n\n## Asunto\n${title}: guía práctica de esta semana\n\n## Cuerpo\nEsta semana en WinHacks te mostramos ${title.toLowerCase()}. La guía incluye pasos, advertencias y soluciones frecuentes.\n\nLeer: ${metadata.canonical}\n`);
  write(path.join(outRoot,'academy.md'),`# WinHacks Academy\n\n## Lección propuesta\n${title}\n\n## Objetivo de aprendizaje\nAl finalizar, el estudiante podrá aplicar el procedimiento, verificar el resultado y revertirlo de manera segura.\n\n## Práctica\nReproducir el procedimiento en una máquina de prueba y documentar el antes y el después.\n\n## Evaluación\n- Identificar requisitos.\n- Ejecutar pasos correctamente.\n- Explicar riesgos y reversión.\n`);
  write(path.join(outRoot,'image-prompts.md'),`# Imágenes requeridas\n\n## Open Graph 1200×630\nInterfaz moderna de Windows 11 relacionada con “${title}”, estilo tecnológico limpio de WinHacks, azul Windows, verde de acento, alto contraste, espacio para titular corto, sin logos de terceros.\n\nArchivo final: \`assets/img/og/og-${slug}.webp\`\n\n## Miniatura 1280×720\nEscena visual clara mostrando el problema y el resultado de “${title}”, estilo WinHacks, texto máximo de 4 palabras, alta legibilidad móvil.\n`);
  write(path.join(outRoot,'README.md'),`# Content Package\n\nTema: **${title}**\n\nGenerado: ${generatedAt}\n\n## Estado\n\nEste paquete es un borrador editorial. No se publica automáticamente.\n\n## Flujo\n\n1. Verificar comandos y procedimientos en Windows 10/11.\n2. Completar el artículo usando la plantilla exacta.\n3. Añadir capturas reales en cada paso.\n4. Generar y optimizar imágenes.\n5. Añadir video y enlaces internos.\n6. Ejecutar \`npm run toolkit\`.\n7. Mover \`article.html\` a \`${category}/${slug}.html\` cuando esté aprobado.\n`);

  const manifest = {version:'1.0.0',generatedAt,output:path.relative(CONFIG.paths.root,outRoot),files:fs.readdirSync(outRoot).sort()};
  write(path.join(outRoot,'manifest.json'),JSON.stringify(manifest,null,2));
  console.log(`Content Pipeline listo: ${path.relative(CONFIG.paths.root,outRoot)}`);
  console.log(`Tema: ${title}`);
  console.log(`Archivos: ${manifest.files.length + 1}`);
}

try { main(); } catch (error) { console.error('Content Pipeline falló:', error.message); process.exit(1); }
