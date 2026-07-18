/**
 * WinHacks Schema Engine v1.0
 * Reusable JSON-LD generator for WinHacks pages.
 *
 * Usage:
 * 1. Define window.WINHACKS_PAGE before loading this file.
 * 2. Include: <script src="/js/schema.js" defer></script>
 *
 * Supported page types:
 * - article
 * - category
 * - page
 * - resource
 * - course
 */
(() => {
  "use strict";

  const SITE = {
    name: "WinHacks",
    legalName: "WinHacks",
    url: "https://winhacks.dev",
    language: "es",
    logo: "/assets/img/logo-winhacks-square.webp",
    image: "/assets/img/banner-winhacks.webp",
    description:
      "WinHacks es un centro de conocimiento en español sobre Windows, comandos CMD, PowerShell, optimización, seguridad y diagnóstico del sistema.",
    founder: {
      name: "Clent Ebanks",
      url: "/about.html#clent-ebanks",
      jobTitle: "Fundador de WinHacks",
      knowsAbout: [
        "Microsoft Windows",
        "Windows 10",
        "Windows 11",
        "CMD",
        "PowerShell",
        "Optimización de Windows",
        "Diagnóstico de Windows",
        "Seguridad en Windows"
      ]
    },
    sameAs: [
      "https://www.youtube.com/@WinHacksOficial"
      /* Agregar redes oficiales cuando estén confirmadas:
      "https://www.tiktok.com/@TU_USUARIO",
      "https://www.facebook.com/TU_PAGINA",
      "https://github.com/TU_USUARIO"
      */
    ]
  };

  const cleanPath = (path) => {
    if (!path) return "/";
    return path.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  };

  const absoluteUrl = (url) => {
    if (!url) return SITE.url + "/";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${SITE.url}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const getCanonical = () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.href;
    if (canonical) return canonical;
    return absoluteUrl(cleanPath(window.location.pathname));
  };

  const getMeta = (selector, fallback = "") => {
    return document.querySelector(selector)?.getAttribute("content") || fallback;
  };

  const unique = (items = []) => [...new Set(items.filter(Boolean))];

  const normalizeDate = (date) => {
    if (!date) return new Date().toISOString();
    return date;
  };

  const makeId = (url, hash) => `${absoluteUrl(url).replace(/\/$/, "")}${hash}`;

  const buildOrganization = () => ({
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: `${SITE.url}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE.url}/#logo`,
      url: absoluteUrl(SITE.logo)
    },
    image: absoluteUrl(SITE.image),
    description: SITE.description,
    founder: {
      "@id": absoluteUrl(SITE.founder.url)
    },
    sameAs: SITE.sameAs.filter((item) => !item.includes("TU_"))
  });

  const buildPerson = () => ({
    "@type": "Person",
    "@id": absoluteUrl(SITE.founder.url),
    name: SITE.founder.name,
    jobTitle: SITE.founder.jobTitle,
    url: absoluteUrl("/about.html"),
    worksFor: {
      "@id": `${SITE.url}/#organization`
    },
    knowsAbout: SITE.founder.knowsAbout
  });

  const buildWebSite = () => ({
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: `${SITE.url}/`,
    description: SITE.description,
    publisher: {
      "@id": `${SITE.url}/#organization`
    },
    inLanguage: SITE.language,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  });

  const buildBreadcrumb = (page) => {
    const url = page.url || getCanonical();
    const breadcrumbs = page.breadcrumbs?.length
      ? page.breadcrumbs
      : [
          { name: "Inicio", url: "/" },
          page.category ? { name: page.category, url: page.categoryUrl || "/" } : null,
          { name: page.title || document.title, url }
        ].filter(Boolean);

    return {
      "@type": "BreadcrumbList",
      "@id": makeId(url, "#breadcrumb"),
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.url)
      }))
    };
  };

  const buildWebPage = (page) => {
    const url = page.url || getCanonical();

    return {
      "@type": page.webPageType || "WebPage",
      "@id": makeId(url, "#webpage"),
      url: absoluteUrl(url),
      name: page.title || document.title,
      description:
        page.description ||
        getMeta('meta[name="description"]', SITE.description),
      isPartOf: {
        "@id": `${SITE.url}/#website`
      },
      about: unique(page.about || ["Microsoft Windows", page.category]).map((name) => ({
        "@type": "Thing",
        name
      })),
      primaryImageOfPage: page.image
        ? {
            "@type": "ImageObject",
            url: absoluteUrl(page.image)
          }
        : undefined,
      breadcrumb: {
        "@id": makeId(url, "#breadcrumb")
      },
      inLanguage: page.language || SITE.language
    };
  };

  const buildArticle = (page) => {
    const url = page.url || getCanonical();

    return {
      "@type": page.schemaType || "TechArticle",
      "@id": makeId(url, "#article"),
      headline: page.headline || page.title || document.title,
      alternativeHeadline: page.alternativeHeadline,
      description:
        page.description ||
        getMeta('meta[name="description"]', SITE.description),
      image: absoluteUrl(page.image || SITE.image),
      datePublished: normalizeDate(page.datePublished),
      dateModified: normalizeDate(page.dateModified || page.datePublished),
      author: {
        "@id": absoluteUrl(SITE.founder.url)
      },
      publisher: {
        "@id": `${SITE.url}/#organization`
      },
      mainEntityOfPage: {
        "@id": makeId(url, "#webpage")
      },
      articleSection: page.category || "Windows",
      keywords: unique(page.keywords || ["Windows", "WinHacks"]),
      proficiencyLevel: page.level || page.proficiencyLevel || "Beginner",
      inLanguage: page.language || SITE.language,
      about: unique(page.about || ["Microsoft Windows", page.category]).map((name) => ({
        "@type": "Thing",
        name
      })),
      mentions: unique(page.mentions || []).map((name) => ({
        "@type": "Thing",
        name
      }))
    };
  };

  const buildFAQ = (page) => {
    if (!page.faq || !page.faq.length) return null;

    return {
      "@type": "FAQPage",
      "@id": makeId(page.url || getCanonical(), "#faq"),
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    };
  };

  const buildVideo = (page) => {
    if (!page.video) return null;

    return {
      "@type": "VideoObject",
      "@id": makeId(page.url || getCanonical(), "#video"),
      name: page.video.name || page.title,
      description: page.video.description || page.description,
      thumbnailUrl: [absoluteUrl(page.video.thumbnail || page.image || SITE.image)],
      uploadDate: normalizeDate(page.video.uploadDate || page.datePublished),
      embedUrl: page.video.embedUrl,
      contentUrl: page.video.contentUrl,
      publisher: {
        "@id": `${SITE.url}/#organization`
      },
      inLanguage: page.language || SITE.language
    };
  };

  const buildHowTo = (page) => {
    if (!page.steps || !page.steps.length) return null;

    return {
      "@type": "HowTo",
      "@id": makeId(page.url || getCanonical(), "#howto"),
      name: page.howToName || page.title,
      description: page.description,
      image: absoluteUrl(page.image || SITE.image),
      totalTime: page.totalTime,
      step: page.steps.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name || `Paso ${index + 1}`,
        text: step.text,
        url: step.url ? absoluteUrl(step.url) : undefined,
        image: step.image ? absoluteUrl(step.image) : undefined
      }))
    };
  };

  const buildCollectionPage = (page) => {
    if (page.type !== "category") return null;

    return {
      "@type": "CollectionPage",
      "@id": makeId(page.url || getCanonical(), "#collection"),
      name: page.title || document.title,
      description: page.description || getMeta('meta[name="description"]'),
      url: absoluteUrl(page.url || getCanonical()),
      isPartOf: {
        "@id": `${SITE.url}/#website`
      },
      about: unique(page.about || [page.category || "Microsoft Windows"]).map((name) => ({
        "@type": "Thing",
        name
      })),
      publisher: {
        "@id": `${SITE.url}/#organization`
      },
      inLanguage: page.language || SITE.language
    };
  };

  const injectJSONLD = (graph) => {
    const id = "winhacks-jsonld";
    let script = document.getElementById(id);

    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": graph.filter(Boolean)
      },
      null,
      2
    );
  };

  const buildSchema = (page = {}) => {
    const normalizedPage = {
      type: page.type || "page",
      title: page.title || getMeta('meta[property="og:title"]', document.title),
      description: page.description || getMeta('meta[name="description"]'),
      image: page.image || getMeta('meta[property="og:image"]', SITE.image),
      url: page.url || getCanonical(),
      ...page
    };

    const graph = [
      buildOrganization(),
      buildPerson(),
      buildWebSite(),
      buildBreadcrumb(normalizedPage),
      buildWebPage(normalizedPage),
      normalizedPage.type === "article" || normalizedPage.type === "resource" || normalizedPage.type === "course"
        ? buildArticle(normalizedPage)
        : null,
      buildCollectionPage(normalizedPage),
      buildFAQ(normalizedPage),
      buildVideo(normalizedPage),
      buildHowTo(normalizedPage)
    ];

    return graph.filter(Boolean);
  };

  const init = () => {
    const page = window.WINHACKS_PAGE || {};
    injectJSONLD(buildSchema(page));
  };

  window.WinHacksSchema = {
    SITE,
    absoluteUrl,
    buildSchema,
    injectJSONLD
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
