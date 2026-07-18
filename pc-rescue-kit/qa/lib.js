const fs = require("fs");
const path = require("path");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const output = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...walk(full, predicate));
    else if (predicate(full)) output.push(full);
  }
  return output;
}

function relative(root, file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function issue(level, code, message, file = "", details = {}) {
  return { level, code, message, file, details };
}

function scoreFromIssues(issues) {
  const penalty = issues.reduce((sum, item) => {
    if (item.level === "error") return sum + 12;
    if (item.level === "warning") return sum + 3;
    return sum + 0;
  }, 0);
  return Math.max(0, 100 - penalty);
}

module.exports = { fs, path, readJson, walk, relative, issue, scoreFromIssues };
