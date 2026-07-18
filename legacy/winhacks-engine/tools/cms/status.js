#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cms = require('./lib');

cms.ensureDir(cms.cmsRoot);
const drafts = cms.listDrafts();
const index = cms.loadIndex();
console.log('WinHacks CMS');
console.log(`Borradores: ${drafts.length}`);
for (const slug of drafts) {
  try {
    const draft = cms.loadDraft(slug);
    const result = cms.validateDraft(draft, false);
    console.log(`- ${slug}: ${result.errors.length ? 'ERROR' : result.warnings.length ? 'REVISAR' : 'LISTO'}`);
  } catch (error) {
    console.log(`- ${slug}: ERROR (${error.message})`);
  }
}
console.log(`Publicados por CMS: ${index.items.length}`);
