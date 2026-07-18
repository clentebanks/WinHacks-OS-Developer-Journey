const fs = require('node:fs');
const path = require('node:path');

const required = [
  'README.md',
  'ROADMAP.md',
  'LEARNING_PATH.md',
  'engineering-log',
  'course',
  'legacy/winhacks-engine'
];

const missing = required.filter((entry) => !fs.existsSync(path.join(process.cwd(), entry)));

if (missing.length > 0) {
  console.error('Project check failed. Missing:');
  for (const entry of missing) console.error(`- ${entry}`);
  process.exit(1);
}

console.log('WinHacks OS Developer Journey: project structure OK.');
