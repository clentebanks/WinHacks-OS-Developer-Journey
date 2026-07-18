#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const CONFIG = require('../../config/toolkit.config');

const GAP_CATALOG = {
  seguridad: ['Configurar SmartScreen correctamente','Protección contra ransomware en Windows 11','Control de aplicaciones y navegador','Historial de protección de Microsoft Defender','Aislamiento del núcleo y protección de memoria','BitLocker: guía completa para principiantes'],
  comandos: ['PowerShell Profiles: personaliza tu terminal','PowerShell Remoting paso a paso','PowerShell Jobs y tareas en segundo plano','Administrar módulos de PowerShell','Comandos esenciales de Windows Terminal','Cómo usar Get-Help en PowerShell'],
  redes: ['Restablecer la red de Windows 11','Cambiar DNS en Windows 11','Diagnosticar pérdida de paquetes','Configurar una IP estática','Solucionar el error sin acceso a Internet','Ver puertos abiertos con PowerShell'],
  optimizacion: ['Reducir programas de inicio en Windows 11','Optimizar memoria virtual','Limpiar archivos temporales con Storage Sense','Mejorar el arranque de Windows 11','Optimizar Windows para equipos con poca RAM','Plan de energía: equilibrio, rendimiento y eficiencia'],
  personalizacion: ['Personalizar Windows Terminal','Crear accesos directos con iconos personalizados','Cambiar sonidos del sistema','Personalizar el menú Inicio de Windows 11','Organizar escritorios virtuales','Personalizar la barra de tareas sin aplicaciones externas'],
  secretos: ['Funciones ocultas de PowerToys','Historial del portapapeles de Windows','Menú Win+X explicado','Grabador de pasos de Windows','Monitor de confiabilidad: guía completa','Comandos secretos del cuadro Ejecutar'],
  recursos: ['Checklist mensual de mantenimiento de Windows','Plantilla de diagnóstico de PC','Guía rápida de comandos de red','Hoja de referencia de PowerShell','Checklist de seguridad para Windows 11'],
  academy: ['Curso básico de mantenimiento de Windows','Curso de PowerShell para usuarios normales','Curso de seguridad práctica en Windows 11']
};

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return fallback; }
}
function normalize(value='') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
}
function esc(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate()+days); return d; }
function isoDate(date) { return date.toISOString().slice(0,10); }
function scoreIdea({category, orphanCount, recommendationCount, entityMentions, type}) {
  let score = 40;
  score += Math.min(20, recommendationCount * 2);
  score += Math.min(15, orphanCount * 3);
  score += Math.min(15, Math.round(entityMentions / 15));
  if (['seguridad','comandos','redes'].includes(category)) score += 5;
  if (type === 'article') score += 5;
  return Math.min(100, score);
}
function reasonFor(category, stats) {
  const parts = [];
  if (stats.recommendations) parts.push(`${stats.recommendations} oportunidades de enlazado interno`);
  if (stats.orphans) parts.push(`${stats.orphans} páginas huérfanas en el cluster`);
  if (stats.mentions) parts.push(`${stats.mentions} menciones de entidades relacionadas`);
  return parts.length ? parts.join('; ') : `fortalece el cluster de ${category}`;
}
function buildHtml(report) {
  const articleRows = report.articles.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.title)}</td><td>${esc(x.category)}</td><td>${x.priority}</td><td>${esc(x.reason)}</td></tr>`).join('');
  const calRows = report.calendar.map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.format)}</td><td>${esc(x.title)}</td><td>${esc(x.category)}</td></tr>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AI Content Planner | WinHacks Toolkit</title><style>
  :root{color-scheme:dark;--bg:#07110d;--panel:#0d1c16;--line:#214333;--text:#f3fff8;--muted:#9cc3ad;--accent:#42e487}*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:var(--bg);color:var(--text)}main{max-width:1180px;margin:auto;padding:28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px}.card,section{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px}.value{font-size:2rem;font-weight:800;color:var(--accent)}h1,h2{margin-top:0}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px;border-bottom:1px solid var(--line);vertical-align:top}small{color:var(--muted)}section{margin-top:18px}.pill{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:4px 9px;color:var(--accent)}@media(max-width:760px){table{font-size:.88rem}.hide-mobile{display:none}}</style></head><body><main>
  <h1>WinHacks AI Content Planner</h1><p><small>Plan editorial local basado en el Knowledge Graph. Generado: ${esc(report.generatedAt)}</small></p>
  <div class="grid"><div class="card"><div>Ideas de artículos</div><div class="value">${report.summary.articles}</div></div><div class="card"><div>Shorts</div><div class="value">${report.summary.shorts}</div></div><div class="card"><div>Recursos</div><div class="value">${report.summary.resources}</div></div><div class="card"><div>Academy</div><div class="value">${report.summary.academy}</div></div><div class="card"><div>Días planificados</div><div class="value">${report.summary.calendarDays}</div></div></div>
  <section><h2>Prioridad editorial</h2><table><thead><tr><th>#</th><th>Tema</th><th>Cluster</th><th>Score</th><th class="hide-mobile">Motivo</th></tr></thead><tbody>${articleRows}</tbody></table></section>
  <section><h2>Calendario de 30 días</h2><table><thead><tr><th>Fecha</th><th>Formato</th><th>Tema</th><th>Cluster</th></tr></thead><tbody>${calRows}</tbody></table></section>
</main></body></html>`;
}

function main() {
  const knowledge = readJson(CONFIG.paths.knowledgeReportJson);
  if (!knowledge) throw new Error('Falta reports/knowledge-graph.json. Ejecuta npm run knowledge primero.');

  const existing = new Set(knowledge.pages.map(p => normalize(p.title)));
  const clusterStats = {};
  for (const c of knowledge.clusters) clusterStats[c.name] = { pages:c.pages, orphans:0, recommendations:0, mentions:0 };
  for (const o of knowledge.orphans) (clusterStats[o.category] ||= {pages:0,orphans:0,recommendations:0,mentions:0}).orphans++;
  for (const r of knowledge.recommendations) {
    const source = knowledge.pages.find(p=>p.url===r.source);
    if (source) (clusterStats[source.category] ||= {pages:0,orphans:0,recommendations:0,mentions:0}).recommendations++;
  }
  for (const p of knowledge.pages) {
    const s = clusterStats[p.category] ||= {pages:0,orphans:0,recommendations:0,mentions:0};
    s.mentions += p.entities.reduce((n,e)=>n+e.count,0);
  }

  const ideas = [];
  for (const [category, titles] of Object.entries(GAP_CATALOG)) {
    const stats = clusterStats[category] || {pages:0,orphans:0,recommendations:0,mentions:0};
    for (const title of titles) {
      const n = normalize(title);
      const duplicate = [...existing].some(e => e.includes(n) || n.includes(e));
      if (!duplicate) ideas.push({ title, category, type:'article', priority:scoreIdea({category,orphanCount:stats.orphans,recommendationCount:stats.recommendations,entityMentions:stats.mentions,type:'article'}), reason:reasonFor(category,stats) });
    }
  }
  ideas.sort((a,b)=>b.priority-a.priority || a.title.localeCompare(b.title));
  const articles = ideas.slice(0,24);
  const shorts = articles.slice(0,16).map(x=>({ ...x, type:'short', title:`Short: ${x.title}`, hook:`¿Sabías que ${x.title.toLowerCase()} puede cambiar cómo usas Windows?` }));
  const resources = articles.filter(x=>['recursos','seguridad','comandos','redes','optimizacion'].includes(x.category)).slice(0,8).map(x=>({title:`Recurso: ${x.title}`,category:x.category,source:x.title,format:x.category==='recursos'?'PDF':'Checklist/PDF'}));
  const academy = articles.filter(x=>['seguridad','comandos','optimizacion'].includes(x.category)).slice(0,6).map(x=>({title:`Lección: ${x.title}`,category:x.category,course:`Ruta ${x.category[0].toUpperCase()+x.category.slice(1)}`}));

  const formats = ['Artículo','Short','Artículo','Short','Recurso','Artículo','Short'];
  const pools = {Artículo:articles,Short:shorts,Recurso:resources};
  const counters = {Artículo:0,Short:0,Recurso:0};
  const start = new Date();
  const calendar = [];
  for (let i=0;i<30;i++) {
    const format = formats[i % formats.length];
    const pool = pools[format];
    const item = pool[counters[format]++ % pool.length];
    calendar.push({date:isoDate(addDays(start,i)),format,title:item.title,category:item.category,priority:item.priority || null});
  }

  const report = {
    version:'1.0.0', generatedAt:new Date().toISOString(), sourceGeneratedAt:knowledge.generatedAt,
    summary:{articles:articles.length,shorts:shorts.length,resources:resources.length,academy:academy.length,calendarDays:calendar.length},
    articles, shorts, resources, academy, calendar,
    notes:['Plan generado sin API externa.','Las prioridades se calculan con clusters, páginas huérfanas, entidades y oportunidades de enlazado interno.','Valida tendencias y volumen de búsqueda antes de producir cada tema.']
  };
  fs.mkdirSync(CONFIG.paths.reports,{recursive:true});
  fs.writeFileSync(CONFIG.paths.aiPlannerJson,JSON.stringify(report,null,2)+'\n','utf8');
  fs.writeFileSync(CONFIG.paths.aiPlannerHtml,buildHtml(report),'utf8');
  const md = ['# WinHacks AI Content Planner','',`Generado: ${report.generatedAt}`,'','## Próximos artículos',...articles.map((x,i)=>`${i+1}. **${x.title}** — ${x.category} — prioridad ${x.priority}/100\n   - ${x.reason}`),'','## Ideas para Shorts',...shorts.map(x=>`- ${x.title}\n  - Hook: ${x.hook}`),'','## Recursos',...resources.map(x=>`- ${x.title} (${x.format})`),'','## Academy',...academy.map(x=>`- ${x.course}: ${x.title}`),'','## Calendario de 30 días','',...calendar.map(x=>`- ${x.date} — ${x.format}: ${x.title}`),''];
  fs.writeFileSync(CONFIG.paths.aiPlannerMarkdown,md.join('\n'),'utf8');
  const csv = ['date,format,category,title',...calendar.map(x=>[x.date,x.format,x.category,x.title].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n')+'\n';
  fs.writeFileSync(CONFIG.paths.aiCalendarCsv,csv,'utf8');
  console.log(`AI Content Planner listo: ${articles.length} artículos, ${shorts.length} Shorts, ${resources.length} recursos y calendario de ${calendar.length} días.`);
}

try { main(); } catch (error) { console.error('AI Content Planner falló:', error.message); process.exit(1); }
