const { fs, path, issue } = require("../lib");

module.exports = async function browserCheck(ctx) {
  const root = ctx.root;
  const issues = [];

  const required = [
    "pc-rescue-kit/app/index.html",
    "pc-rescue-kit/app/js/app.js",
    "pc-rescue-kit/app/styles/rescue-kit.css",
    "pc-rescue-kit/browser/knowledge-engine.browser.js",
    "pc-rescue-kit/browser/decision-engine.browser.js",
    "pc-rescue-kit/browser/session-engine.browser.js",
    "recursos/pc-rescue-kit.html",
    "css/pc-rescue-kit-landing.css"
  ];

  for (const relativePath of required) {
    const absolutePath = path.join(root, relativePath);

    if (!fs.existsSync(absolutePath)) {
      issues.push(
        issue(
          "error",
          "file.missing",
          `Falta ${relativePath}`,
          relativePath
        )
      );
    }
  }

  const appIndexPath = path.join(
    root,
    "pc-rescue-kit/app/index.html"
  );

  if (!fs.existsSync(appIndexPath)) {
    return {
      name: "Browser",
      metrics: {
        requiredFiles: required.length,
        stylesheets: 0,
        scripts: 0
      },
      issues
    };
  }

  const appHtml = fs.readFileSync(appIndexPath, "utf8");

  if (!/\bid=["']app["']/i.test(appHtml)) {
    issues.push(
      issue(
        "error",
        "app.rootMissing",
        "Falta el elemento #app en index.html.",
        "pc-rescue-kit/app/index.html"
      )
    );
  }

  const moduleScripts = extractModuleScripts(appHtml);

  if (moduleScripts.length === 0) {
    issues.push(
      issue(
        "error",
        "app.moduleMissing",
        "No se detectó ningún script JavaScript cargado como módulo.",
        "pc-rescue-kit/app/index.html"
      )
    );
  }

  const stylesheets = extractStylesheets(appHtml);

  if (stylesheets.length === 0) {
    issues.push(
      issue(
        "error",
        "app.cssLink",
        "No se detectó ninguna hoja de estilos en index.html.",
        "pc-rescue-kit/app/index.html"
      )
    );
  }

  for (const href of stylesheets) {
    if (isExternalResource(href)) {
      continue;
    }

    const resolvedPath = resolveHtmlResource(
      appIndexPath,
      root,
      href
    );

    if (!fs.existsSync(resolvedPath)) {
      issues.push(
        issue(
          "error",
          "app.cssMissing",
          `La hoja de estilos enlazada no existe: ${href}`,
          href
        )
      );
    }
  }

  for (const src of moduleScripts) {
    if (isExternalResource(src)) {
      continue;
    }

    const resolvedPath = resolveHtmlResource(
      appIndexPath,
      root,
      src
    );

    if (!fs.existsSync(resolvedPath)) {
      issues.push(
        issue(
          "error",
          "app.moduleFileMissing",
          `El módulo JavaScript enlazado no existe: ${src}`,
          src
        )
      );
    }
  }

  const expectedMainCss = stylesheets.some((href) =>
    normalizeUrl(href).endsWith(
      "pc-rescue-kit/app/styles/rescue-kit.css"
    )
  );

  if (!expectedMainCss) {
    issues.push(
      issue(
        "warning",
        "app.mainCssMissing",
        "No se detectó rescue-kit.css como hoja de estilos principal.",
        "pc-rescue-kit/app/index.html"
      )
    );
  }

  return {
    name: "Browser",
    metrics: {
      requiredFiles: required.length,
      stylesheets: stylesheets.length,
      moduleScripts: moduleScripts.length
    },
    issues
  };
};

function extractStylesheets(html) {
  const links = html.match(/<link\b[^>]*>/gi) || [];
  const stylesheets = [];

  for (const tag of links) {
    const rel = getAttribute(tag, "rel");
    const href = getAttribute(tag, "href");

    if (
      href &&
      rel &&
      rel
        .toLowerCase()
        .split(/\s+/)
        .includes("stylesheet")
    ) {
      stylesheets.push(href);
    }
  }

  return stylesheets;
}

function extractModuleScripts(html) {
  const scripts = html.match(/<script\b[^>]*>/gi) || [];
  const modules = [];

  for (const tag of scripts) {
    const type = getAttribute(tag, "type");
    const src = getAttribute(tag, "src");

    if (
      src &&
      type &&
      type.toLowerCase() === "module"
    ) {
      modules.push(src);
    }
  }

  return modules;
}

function getAttribute(tag, attributeName) {
  const expression = new RegExp(
    `\\b${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i"
  );

  const match = tag.match(expression);

  return match
    ? match[1] || match[2] || match[3] || ""
    : "";
}

function resolveHtmlResource(
  htmlFilePath,
  projectRoot,
  resourceUrl
) {
  const cleanUrl = resourceUrl
    .split("?")[0]
    .split("#")[0];

  if (cleanUrl.startsWith("/")) {
    return path.join(
      projectRoot,
      cleanUrl.replace(/^\/+/, "")
    );
  }

  return path.resolve(
    path.dirname(htmlFilePath),
    cleanUrl
  );
}

function isExternalResource(resourceUrl) {
  return /^(?:https?:)?\/\//i.test(resourceUrl) ||
    /^(?:data|blob):/i.test(resourceUrl);
}

function normalizeUrl(resourceUrl) {
  return resourceUrl
    .split("?")[0]
    .split("#")[0]
    .replace(/\\/g, "/")
    .replace(/^\.?\//, "");
}