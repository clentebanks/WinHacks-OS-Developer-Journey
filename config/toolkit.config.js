'use strict';

const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');

module.exports = Object.freeze({
  version: '3.0.0',
  site: Object.freeze({
    name: 'WinHacks',
    url: 'https://winhacks.dev',
    author: 'Clent Ebanks',
    language: 'es',
    description: 'Trucos, comandos y optimización extrema para Windows.',
    logo: '/assets/images/logo-winhacks-horizontal.webp',
    defaultImage: '/assets/images/banner-winhacks.webp'
  }),
  paths: Object.freeze({
    root: rootDir,
    reports: path.join(rootDir, 'reports'),
    logs: path.join(rootDir, 'logs'),
    toolkit: path.join(rootDir, 'toolkit'),
    feed: path.join(rootDir, 'feed.xml'),
    sitemap: path.join(rootDir, 'sitemap.xml'),
    seoReportJson: path.join(rootDir, 'reports', 'seo-report.json'),
    scoreJson: path.join(rootDir, 'reports', 'score.json'),
    historyJson: path.join(rootDir, 'reports', 'history.json'),
    geoReportJson: path.join(rootDir, 'reports', 'geo-report.json'),
    geoReportMarkdown: path.join(rootDir, 'reports', 'geo-report.md'),
    geoReportHtml: path.join(rootDir, 'reports', 'geo-report.html'),
    performanceReportJson: path.join(rootDir, 'reports', 'performance-report.json'),
    performanceReportMarkdown: path.join(rootDir, 'reports', 'performance-report.md'),
    performanceReportHtml: path.join(rootDir, 'reports', 'performance-report.html'),
    autoFixReportJson: path.join(rootDir, 'reports', 'autofix-report.json'),
    autoFixReportMarkdown: path.join(rootDir, 'reports', 'autofix-report.md'),
    autoFixReportHtml: path.join(rootDir, 'reports', 'autofix-report.html'),
    autoFixBackups: path.join(rootDir, 'backups', 'autofix'),
    knowledgeReportJson: path.join(rootDir, 'reports', 'knowledge-graph.json'),
    knowledgeReportMarkdown: path.join(rootDir, 'reports', 'knowledge-graph.md'),
    knowledgeReportHtml: path.join(rootDir, 'reports', 'knowledge-graph.html'),
    aiPlannerJson: path.join(rootDir, 'reports', 'ai-content-plan.json'),
    aiPlannerMarkdown: path.join(rootDir, 'reports', 'ai-content-plan.md'),
    aiPlannerHtml: path.join(rootDir, 'reports', 'ai-content-plan.html'),
    aiCalendarCsv: path.join(rootDir, 'reports', 'content-calendar.csv'),
    cms: path.join(rootDir, 'cms'),
    cmsIndex: path.join(rootDir, 'cms', 'index.json'),
    cmsHistory: path.join(rootDir, 'cms', 'history.json')
  }),
  content: Object.freeze({
    publicGlobs: Object.freeze([
      '*.html',
      'academy/**/*.html',
      'comandos/**/*.html',
      'optimizacion/**/*.html',
      'personalizacion/**/*.html',
      'recursos/**/*.html',
      'redes/**/*.html',
      'secretos/**/*.html',
      'seguridad/**/*.html'
    ]),
    includedDirectories: Object.freeze([
      'secretos',
      'comandos',
      'optimizacion',
      'seguridad',
      'personalizacion',
      'redes',
      'recursos',
      'academy'
    ]),
    excludedDirectories: Object.freeze([
      '.git',
      '.github',
      '.netlify',
      'node_modules',
      'assets',
      'css',
      'js',
      'components',
      'templates',
      'docs',
      'engine',
      'build',
      'dist',
      'coverage',
      'content',
      'reports',
      'tools',
      'scripts',
      'toolkit',
      'logs'
    ])
  }),
  rss: Object.freeze({ maxItems: 80 }),
  toolkit: Object.freeze({
    tasks: Object.freeze([
      Object.freeze({ name: 'Build Engine', script: 'build' }),
      Object.freeze({ name: 'RSS Builder', script: 'rss' }),
      Object.freeze({ name: 'Sitemap Builder', script: 'sitemap' }),
      Object.freeze({ name: 'SEO Auditor + Dashboard', script: 'seo' }),
      Object.freeze({ name: 'GEO Auditor', script: 'geo' }),
      Object.freeze({ name: 'Performance Analyzer', script: 'performance' }),
      Object.freeze({ name: 'Knowledge Graph Engine', script: 'knowledge' }),
      Object.freeze({ name: 'AI Content Planner', script: 'ai:plan' })
    ])
  })
});
