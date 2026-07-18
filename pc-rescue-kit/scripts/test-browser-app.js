const fs = require("fs-extra");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app");

const requiredFiles = [
  "app/index.html",
  "app/manifest.webmanifest",
  "app/offline.html",
  "app/service-worker.js",
  "app/styles/rescue-kit.css",
  "app/js/app.js",
  "app/js/components-loader.js",
  "app/assets/icon-192.png",
  "app/assets/icon-512.png",
  "app/assets/apple-touch-icon.png",
  "browser/knowledge-engine.browser.js",
  "browser/decision-engine.browser.js",
  "browser/session-engine.browser.js",
  "generated/knowledge-index.json"
];

async function main() {
  console.log("");
  console.log("=========================================");
  console.log(" WinHacks Browser App Smoke Test");
  console.log("=========================================");
  console.log("");

  let failures = 0;

  for (const relative of requiredFiles) {
    const absolute = path.join(ROOT, relative);
    const exists = await fs.pathExists(absolute);

    console.log(`${exists ? "✓" : "✗"} ${relative}`);
    if (!exists) failures++;
  }

  const manifest = await fs.readJson(path.join(APP, "manifest.webmanifest"));
  if (!manifest.name || !manifest.start_url || !Array.isArray(manifest.icons)) {
    console.log("✗ manifest.webmanifest incompleto");
    failures++;
  } else {
    console.log("✓ manifest.webmanifest válido");
  }

  const index = await fs.readJson(
    path.join(ROOT, "generated", "knowledge-index.json")
  );

  if (!index.totalItems || !index.byId) {
    console.log("✗ knowledge-index.json incompleto");
    failures++;
  } else {
    console.log(`✓ knowledge-index.json: ${index.totalItems} elementos`);
  }

  console.log("");
  console.log("Fallos:", failures);

  if (failures > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
