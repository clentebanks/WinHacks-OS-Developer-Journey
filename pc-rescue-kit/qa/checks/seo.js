const { fs, path, issue } = require("../lib");
module.exports = async function seoCheck(ctx) {
  const root = ctx.root; const issues = [];
  const pages = [
    { file: "recursos/pc-rescue-kit.html", public: true },
    { file: "pc-rescue-kit/app/index.html", public: false }
  ];
  for (const page of pages) {
    const full = path.join(root, page.file);
    if (!fs.existsSync(full)) continue;
    const html = fs.readFileSync(full, "utf8");
    const checks = [
      [/<title>[^<]{10,70}<\/title>/i, "title.invalid", "Title ausente o fuera de longitud."],
      [/<meta\s+name="description"\s+content="[^"]{50,180}"/i, "description.invalid", "Meta description ausente o fuera de longitud."],
      [/<link\s+rel="canonical"\s+href="https:\/\//i, "canonical.missing", "Canonical ausente."],
      [/<meta\s+property="og:title"/i, "og.title", "Falta og:title."],
      [/<meta\s+name="twitter:card"/i, "twitter.card", "Falta twitter:card."],
      [/application\/ld\+json/i, "schema.missing", "Falta JSON-LD."]
    ];
    for (const [rx, code, message] of checks) if (!rx.test(html)) issues.push(issue(page.public ? "error" : "warning", code, message, page.file));
    if (page.public && !/index,follow/i.test(html)) issues.push(issue("error", "robots.public", "Landing pública no está indexable.", page.file));
    if (!page.public && !/noindex,follow/i.test(html)) issues.push(issue("warning", "robots.app", "La app debería usar noindex,follow.", page.file));
  }
  return { name: "SEO", metrics: { pages: pages.length }, issues };
};
