'use strict';

const fs = require('fs-extra');

async function writeJsonReport(filePath, report) {
  await fs.outputJson(filePath, report, { spaces: 2 });
}

module.exports = { writeJsonReport };
