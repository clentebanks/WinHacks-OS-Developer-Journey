const fs = require("fs-extra");
const path = require("path");
const fg = require("fast-glob");

const sizePkg = require("image-size");
const imageSize = sizePkg.imageSize || sizePkg.default || sizePkg;

const ROOT = path.join(__dirname, "..");

function isRemote(src) {
  return /^(https?:)?\/\//i.test(src) || src.startsWith("data:");
}

function cleanSrc(src) {
  return String(src || "").split("#")[0].split("?")[0].trim();
}

function resolveImagePath(htmlFile, src) {
  const clean = cleanSrc(src);
  if (!clean || isRemote(clean)) return null;

  const candidates = [];

  if (clean.startsWith("/")) {
    candidates.push(path.join(ROOT, clean.replace(/^\/+/, "")));
  } else {
    candidates.push(path.resolve(path.dirname(htmlFile), clean));
    candidates.push(path.join(ROOT, clean.replace(/^(\.\.\/)+/, "")));
    candidates.push(path.join(ROOT, "assets", "images", path.basename(clean)));
    candidates.push(path.join(ROOT, "assets", "img", path.basename(clean)));
    candidates.push(path.join(ROOT, "assets", "screenshots", path.basename(clean)));
    candidates.push(path.join(ROOT, "assets", "thumbnails", path.basename(clean)));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

function getSvgDimensions(filePath) {
  const svg = fs.readFileSync(filePath, "utf8");

  const w = svg.match(/\bwidth=["']?([\d.]+)/i);
  const h = svg.match(/\bheight=["']?([\d.]+)/i);

  if (w && h) {
    return {
      width: Math.round(Number(w[1])),
      height: Math.round(Number(h[1]))
    };
  }

  const vb = svg.match(/\bviewBox=["']([\d.\s-]+)["']/i);
  if (vb) {
    const p = vb[1].trim().split(/\s+/).map(Number);
    if (p.length === 4) {
      return {
        width: Math.round(p[2]),
        height: Math.round(p[3])
      };
    }
  }

  return null;
}

function getDimensions(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".svg") return getSvgDimensions(filePath);

 const size = imageSize(fs.readFileSync(filePath));

  if (!size || !size.width || !size.height) return null;

  return {
    width: size.width,
    height: size.height
  };
}

function addOrReplaceAttr(tag, attr, value) {
  const re = new RegExp(`\\s${attr}\\s*=\\s*["'][^"']*["']`, "i");

  if (re.test(tag)) {
    return tag.replace(re, ` ${attr}="${value}"`);
  }

  return tag.replace(/<img\b/i, `<img ${attr}="${value}"`);
}

function ensureAsyncAttrs(tag) {
  let out = tag;

  if (!/\sloading\s*=/.test(out)) {
    out = out.replace(/<img\b/i, `<img loading="lazy"`);
  }

  if (!/\sdecoding\s*=/.test(out)) {
    out = out.replace(/<img\b/i, `<img decoding="async"`);
  }

  return out;
}

async function main() {
  console.log("");
  console.log("====================================");
  console.log(" WinHacks Image Dimensions");
  console.log("====================================");
  console.log("");

  const htmlFiles = await fg(["**/*.html"], {
    cwd: ROOT,
    absolute: true,
    onlyFiles: true,
    ignore: [
      "node_modules/**",
      ".git/**",
      "reports/**",
      "dist/**",
      "build/**",
      "coverage/**"
    ]
  });

  let htmlCount = 0;
  let imageCount = 0;
  let updatedImages = 0;
  let updatedFiles = 0;
  let missingImages = 0;
  let alreadyOk = 0;

  for (const htmlFile of htmlFiles) {
    htmlCount++;

    let html = await fs.readFile(htmlFile, "utf8");
    let changed = false;

    html = html.replace(/<img\b[\s\S]*?>/gi, (tag) => {
      imageCount++;

      const srcMatch = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
      if (!srcMatch) return tag;

      const src = srcMatch[1];
      const imagePath = resolveImagePath(htmlFile, src);

      if (!imagePath) {
        missingImages++;
        return tag;
      }

      let dimensions;

      try {
        dimensions = getDimensions(imagePath);
      } catch {
        missingImages++;
        return tag;
      }

      if (!dimensions) {
        missingImages++;
        return tag;
      }

      const hadWidth = /\swidth\s*=/.test(tag);
      const hadHeight = /\sheight\s*=/.test(tag);
      const hadLoading = /\sloading\s*=/.test(tag);
      const hadDecoding = /\sdecoding\s*=/.test(tag);

      if (hadWidth && hadHeight && hadLoading && hadDecoding) {
        alreadyOk++;
        return tag;
      }

      let out = tag;
      out = addOrReplaceAttr(out, "width", dimensions.width);
      out = addOrReplaceAttr(out, "height", dimensions.height);
      out = ensureAsyncAttrs(out);

      if (out !== tag) {
        changed = true;
        updatedImages++;
      }

      return out;
    });

    if (changed) {
      await fs.writeFile(htmlFile, html, "utf8");
      updatedFiles++;
      console.log("✓", path.relative(ROOT, htmlFile));
    }
  }

  console.log("");
  console.log("Resumen:");
  console.log("HTML analizados:", htmlCount);
  console.log("Imágenes detectadas:", imageCount);
  console.log("Imágenes actualizadas:", updatedImages);
  console.log("Archivos HTML modificados:", updatedFiles);
  console.log("Imágenes ya correctas:", alreadyOk);
  console.log("Imágenes faltantes:", missingImages);
  console.log("");
}

main().catch((err) => {
  console.error("Error en add-image-dimensions.js");
  console.error(err);
  process.exit(1);
});