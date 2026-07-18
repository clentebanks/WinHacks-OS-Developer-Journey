const fs = require('node:fs');
const path = require('node:path');

const coursePath = path.join(process.cwd(), 'course');
const modules = fs.readdirSync(coursePath, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

console.log('\nWinHacks OS Developer Journey\n');
console.log(`Modules prepared: ${modules.length}`);
for (const moduleName of modules) console.log(`- ${moduleName}`);
console.log('\nCurrent phase: 00-foundation\n');
