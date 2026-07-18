#!/usr/bin/env node
'use strict';
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const CONFIG = require('../../config/toolkit.config');

const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [path.join(CONFIG.paths.root, 'tools', 'content', 'index.js'), ...args], {
  cwd: CONFIG.paths.root,
  stdio: 'inherit'
});
process.exit(result.status ?? 1);
