const { fs, path, walk, issue } = require("../lib");
module.exports = async function performanceCheck(ctx) {
  const root = ctx.root; const issues = [];
  const files = walk(path.join(root, "pc-rescue-kit"), f => /\.(js|css|json|html)$/.test(f));
  let bytes = 0; let largest = { file: "", size: 0 };
  for (const file of files) {
    const size = fs.statSync(file).size; bytes += size;
    if (size > largest.size) largest = { file: path.relative(root, file).replace(/\\/g, "/"), size };
    if (size > 500 * 1024) issues.push(issue("warning", "asset.large", `Archivo mayor de 500 KB: ${Math.round(size/1024)} KB`, path.relative(root, file).replace(/\\/g, "/")));
  }
  const index = path.join(root, "pc-rescue-kit", "generated", "knowledge-index.json");
  if (fs.existsSync(index) && fs.statSync(index).size > 300 * 1024) issues.push(issue("warning", "index.large", "knowledge-index.json supera 300 KB."));
  return { name: "Performance", metrics: { files: files.length, totalKB: Math.round(bytes/1024), largest }, issues };
};
