/**
 * WinHacks - Engine Centralizado v2.0
 * SEO, RSS, Open Graph, Twitter Cards, JSON-LD, formularios Netlify,
 * Pretty URLs, copiar código, favicons y mejoras GEO.
 */

(() => {
  "use strict";

  /* =========================================================
     CONFIGURACIÓN GLOBAL
  ========================================================= */

  const SITE = {
    name: "WinHacks",
    legalName: "WinHacks by Clent Ebanks",
    url: "https://winhacks.dev",
    lang: "es",
    locale: "es_ES",
    author: "Clent Ebanks",
    brandAuthor: "WinHacks",

    description:
      "Aprende Windows 10 y Windows 11 con trucos ocultos, comandos CMD seguros, PowerShell, optimización, seguridad y recursos técnicos.",

    defaultTitle:
      "WinHacks | Trucos, comandos y optimización para Windows",

    defaultDescription:
      "Descubre funciones ocultas de Windows, comandos CMD, PowerShell, seguridad, optimización, rendimiento y recursos técnicos para mejorar tu PC.",

    defaultImage: "/assets/img/banner-winhacks.webp",
    logo: "/assets/img/logo-winhacks-horizontal.webp",

    favicon: "/assets/images/favicon.ico",
    favicon16: "/assets/images/favicon-16x16.png",
    favicon32: "/assets/images/favicon-32x32.png",
    appleTouchIcon: "/assets/images/apple-touch-icon.png",
    manifest: "/manifest.webmanifest",

    rss: "/feed.xml",
    sitemap: "/sitemap.xml",
    humans: "/humans.txt",
    security: "/.well-known/security.txt",

    themeColor: "#0078D4",
    tileColor: "#070B12",

    youtube: "https://www.youtube.com/@WinHacksOficial",

    sameAs: [
      "https://www.youtube.com/@WinHacksOficial"
      // Agregar cuando estén listos:
      // "https://www.tiktok.com/@WinHacksOficial",
      // "https://www.facebook.com/WinHacks",
      // "https://www.reddit.com/r/WinHacks",
      // "https://github.com/WinHacks"
    ]
  };

  /* =========================================================
     BASE DE DATOS DE PÁGINAS
     Agrega aquí cada nueva página del sitio.
  ========================================================= */

  const pageDatabase = {
    "/": {
      title: "WinHacks | Optimización, seguridad y trucos de Windows",
      description:
        "Descubre trucos ocultos de Windows, comandos CMD, PowerShell, seguridad, optimización y recursos para mejorar tu PC.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Inicio"
    },

    "/secretos": {
      title: "Secretos de Windows | Herramientas ocultas y funciones avanzadas",
      description:
        "Explora funciones ocultas de Windows, herramientas internas, menús avanzados y trucos que casi nadie revisa.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Secretos"
    },

    "/secretos/god-mode-windows": {
      title: "God Mode Windows 11 | Panel oculto de Windows",
      description:
        "Activa God Mode en Windows 10 y Windows 11 para acceder rápido a herramientas ocultas y configuraciones avanzadas.",
      image: "/assets/thumbnails/god-mode.webp",
      type: "article",
      section: "Secretos",
      published: "2026-06-13",
      modified: "2026-06-13",
      video: {
        name: "Windows tiene un panel oculto llamado God Mode",
        description:
          "Aprende a activar God Mode en Windows 10 y Windows 11 para acceder rápido a herramientas ocultas.",
        thumbnail: "/assets/thumbnails/god-mode.webp",
        uploadDate: "2026-06-13",
        embedUrl: "https://www.youtube.com/embed/ID_DEL_VIDEO"
      }
    },

    "/secretos/historial-confiabilidad-windows": {
      title: "Historial de Confiabilidad Windows | Detecta errores ocultos",
      description:
        "Usa el Historial de Confiabilidad de Windows para encontrar errores, cuelgues, fallos del sistema y problemas ocultos.",
      image: "/assets/thumbnails/historial-confiabilidad.webp",
      type: "article",
      section: "Secretos",
      published: "2026-06-13",
      modified: "2026-06-13",
      video: {
        name: "Usa el Historial de Confiabilidad para diagnosticar errores",
        description:
          "Descubre fallos del sistema y cuelgues de aplicaciones sin usar software externo.",
        thumbnail: "/assets/thumbnails/historial-confiabilidad.webp",
        uploadDate: "2026-06-13",
        embedUrl: "https://www.youtube.com/embed/ID_DEL_VIDEO"
      }
    },

    "/secretos/visor-eventos-windows": {
      title: "Visor de Eventos Windows | Logs y errores del sistema",
      description:
        "Aprende a revisar errores, advertencias y registros ocultos de Windows usando el Visor de Eventos.",
      image: "/assets/img/banner-winhacks.webp",
      type: "article",
      section: "Secretos",
      published: "2026-06-13",
      modified: "2026-06-13"
    },

    "/secretos/monitor-recursos-windows": {
      title: "Monitor de Recursos Windows | Procesos, red, disco y memoria",
      description:
        "Aprende a usar el Monitor de Recursos de Windows para revisar procesos, uso de red, disco, memoria y rendimiento del sistema.",
      image: "/assets/img/banner-winhacks.webp",
      type: "article",
      section: "Secretos"
    },

    "/comandos": {
      title: "Comandos CMD y PowerShell para Windows | WinHacks",
      description:
        "Comandos seguros de CMD, PowerShell y herramientas internas de Windows para diagnóstico, reparación y optimización.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Comandos"
    },

    "/comandos/sfc-scannow": {
      title: "SFC /scannow | Reparar Windows desde CMD",
      description:
        "Aprende a usar el comando SFC /scannow para reparar archivos corruptos de Windows desde CMD.",
      image: "/assets/img/logo-winhacks-horizontal.webp",
      type: "article",
      section: "Comandos"
    },

    "/comandos/actualizar-powershell-7": {
      title: "Actualizar PowerShell 7 en Windows | Guía WinHacks",
      description:
        "Instala o actualiza PowerShell 7 en Windows para usar comandos modernos y herramientas avanzadas.",
      image: "/assets/thumbnails/powershell-7.webp",
      type: "article",
      section: "Comandos"
    },

    "/optimizacion": {
      title: "Optimización de Windows | Rendimiento, limpieza y gaming",
      description:
        "Guías para optimizar Windows 10 y Windows 11, mejorar rendimiento, limpiar archivos y preparar tu PC para gaming.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Optimización"
    },

    "/optimizacion/limpieza-windows": {
      title: "Limpieza de Windows sin programas | Optimización segura",
      description:
        "Limpia Windows eliminando archivos temporales, caché y basura acumulada sin instalar programas externos.",
      image: "/assets/img/banner-winhacks.webp",
      type: "article",
      section: "Optimización"
    },

    "/optimizacion/optimizacion-gaming": {
      title: "Optimización Gaming Windows | Mejora FPS y reduce input lag",
      description:
        "Optimiza Windows para gaming, mejora FPS, reduce input lag y ajusta configuraciones clave del sistema.",
      image: "/assets/img/banner-winhacks.webp",
      type: "article",
      section: "Optimización"
    },

    "/seguridad": {
      title: "Seguridad en Windows | Defender, firewall y protección del sistema",
      description:
        "Aprende a proteger Windows con Microsoft Defender, Firewall avanzado, configuraciones ocultas y buenas prácticas.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Seguridad"
    },

    "/recursos": {
      title: "Recursos gratis de WinHacks | Guías, checklists y atajos",
      description:
        "Descarga recursos gratuitos de WinHacks: atajos de teclado, secretos de Windows, checklists de optimización y seguridad.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Recursos"
    },

    "/academy": {
      title: "WinHacks Academy | Aprende Windows desde cero",
      description:
        "Cursos prácticos de Windows, comandos, optimización, seguridad y productividad para usuarios y técnicos.",
      image: "/assets/img/banner-winhacks.webp",
      type: "website",
      section: "Academy"
    }
  };

  /* =========================================================
     HELPERS GENERALES
  ========================================================= */

  const getCleanPath = () => {
    return (
      window.location.pathname
        .replace(/\/index\.html$/, "")
        .replace(/\.html$/, "")
        .replace(/\/$/, "") || "/"
    );
  };

  const absoluteUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${SITE.url}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const getCurrentPage = () => {
    const path = getCleanPath();
    return {
      path,
      data: pageDatabase[path] || {}
    };
  };
    /* =========================================================
     HELPERS PARA HEAD, META, LINKS Y JSON-LD
  ========================================================= */

  const setMeta = (attr, key, content) => {
    if (!content) return;

    let tag = document.head.querySelector(`meta[${attr}="${key}"]`);

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, key);
      document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
  };

  const setLink = (rel, href, type = "", sizes = "", title = "") => {
    if (!href) return;

    let selector = `link[rel="${rel}"]`;

    if (type) selector += `[type="${type}"]`;
    if (sizes) selector += `[sizes="${sizes}"]`;

    let link = document.head.querySelector(selector);

    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", rel);
      document.head.appendChild(link);
    }

    link.setAttribute("href", href);

    if (type) link.setAttribute("type", type);
    if (sizes) link.setAttribute("sizes", sizes);
    if (title) link.setAttribute("title", title);
  };

  const injectSchema = (id, data) => {
    if (!data) return;

    let script = document.getElementById(id);

    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data, null, 2);
  };

  const removeSchema = (id) => {
    const script = document.getElementById(id);
    if (script) script.remove();
  };

  /* =========================================================
     FAVICONS, PWA Y LINKS TÉCNICOS
  ========================================================= */

  const initFavicons = () => {
    setLink("icon", absoluteUrl(SITE.favicon), "image/x-icon", "any");
    setLink("icon", absoluteUrl(SITE.favicon32), "image/png", "32x32");
    setLink("icon", absoluteUrl(SITE.favicon16), "image/png", "16x16");
    setLink(
      "apple-touch-icon",
      absoluteUrl(SITE.appleTouchIcon),
      "image/png",
      "180x180"
    );
    setLink("manifest", absoluteUrl(SITE.manifest));
  };

  const initTechnicalHead = () => {
    setMeta("name", "theme-color", SITE.themeColor);
    setMeta("name", "msapplication-TileColor", SITE.tileColor);
    setMeta("name", "color-scheme", "dark light");
    setMeta("name", "apple-mobile-web-app-title", SITE.name);
    setMeta("name", "application-name", SITE.name);

    setLink(
      "alternate",
      absoluteUrl(SITE.rss),
      "application/rss+xml",
      "",
      "WinHacks RSS Feed"
    );

    setLink("sitemap", absoluteUrl(SITE.sitemap), "application/xml");

    setLink("author", absoluteUrl(SITE.humans), "text/plain");
    setLink("security", absoluteUrl(SITE.security), "text/plain");

    setLink("preconnect", "https://www.youtube.com");
    setLink("preconnect", "https://i.ytimg.com");
    setLink("dns-prefetch", "https://www.youtube.com");
    setLink("dns-prefetch", "https://i.ytimg.com");
  };

  /* =========================================================
     SCHEMA: ORGANIZATION, PERSON, WEBSITE
  ========================================================= */

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(SITE.logo)
    },
    sameAs: SITE.sameAs
  });

  const getPersonSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: SITE.author,
    url: SITE.url,
    worksFor: {
      "@id": `${SITE.url}/#organization`
    },
    sameAs: SITE.sameAs
  });

  const getWebSiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.lang,
    description: SITE.description,
    publisher: {
      "@id": `${SITE.url}/#organization`
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/search/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  });

  /* =========================================================
     BREADCRUMB AUTOMÁTICO
  ========================================================= */

  const buildBreadcrumbSchema = (path, page) => {
    const items = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE.url
      }
    ];

    if (path === "/") return null;

    const parts = path.split("/").filter(Boolean);

    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath += `/${part}`;

      const dbPage = pageDatabase[currentPath];
      const label =
        dbPage?.section ||
        dbPage?.breadcrumb ||
        dbPage?.title?.split("|")[0]?.trim() ||
        part
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

      items.push({
        "@type": "ListItem",
        position: index + 2,
        name: index === parts.length - 1 ? page.title?.split("|")[0]?.trim() || label : label,
        item: `${SITE.url}${currentPath}`
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items
    };
  };

  /* =========================================================
     FAQPAGE AUTOMÁTICO
     Usa HTML así:
     <section data-faq>
       <div data-question="Pregunta" data-answer="Respuesta"></div>
     </section>
  ========================================================= */

  const buildFAQSchema = () => {
    const faqItems = [...document.querySelectorAll("[data-question][data-answer]")];

    if (!faqItems.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.getAttribute("data-question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: item.getAttribute("data-answer")
        }
      }))
    };
  };

  /* =========================================================
     SCHEMA DE PÁGINA / ARTÍCULO
  ========================================================= */

  const buildPageSchema = ({ path, page, title, description, image, canonical }) => {
    const isArticle = page.type === "article";

    const base = {
      "@context": "https://schema.org",
      "@type": isArticle ? "Article" : "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: title,
      headline: title,
      description,
      inLanguage: SITE.lang,
      image,
      isPartOf: {
        "@id": `${SITE.url}/#website`
      },
      publisher: {
        "@id": `${SITE.url}/#organization`
      },
      author: {
        "@id": `${SITE.url}/#person`
      }
    };

    if (isArticle) {
      base.mainEntityOfPage = canonical;
      base.articleSection = page.section || "Windows";
      base.datePublished = page.published || new Date().toISOString().split("T")[0];
      base.dateModified =
        page.modified ||
        page.published ||
        new Date().toISOString().split("T")[0];
    }

    return base;
  };

  /* =========================================================
     VIDEOOBJECT AUTOMÁTICO
  ========================================================= */

  const buildVideoSchema = (page) => {
    if (!page.video) return null;

    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: page.video.name,
      description: page.video.description,
      thumbnailUrl: absoluteUrl(page.video.thumbnail || page.image || SITE.defaultImage),
      uploadDate: page.video.uploadDate,
      embedUrl: page.video.embedUrl,
      publisher: {
        "@id": `${SITE.url}/#organization`
      }
    };
  };
    /* =========================================================
     SEO CENTRALIZADO
  ========================================================= */

 const getExistingMeta = (selector, attr = "content") => {
  return document.querySelector(selector)?.getAttribute(attr)?.trim() || "";
};

const getFallbackTitle = () => {
  const h1 = document.querySelector("h1")?.textContent?.trim();
  const currentTitle = document.title?.trim();

  return (
    currentTitle ||
    (h1 ? `${h1} | WinHacks` : "") ||
    SITE.defaultTitle
  );
};

const getFallbackDescription = () => {
  const currentDescription = getExistingMeta('meta[name="description"]');
  const firstParagraph = document.querySelector("main p, article p, .article-content p")?.textContent?.trim();

  return (
    currentDescription ||
    (firstParagraph ? firstParagraph.slice(0, 155) : "") ||
    SITE.defaultDescription
  );
};

const getFallbackImage = () => {
  const ogImage = getExistingMeta('meta[property="og:image"]');
  const firstImage = document.querySelector("main img, article img, .article-content img")?.getAttribute("src");

  return absoluteUrl(
    ogImage ||
    firstImage ||
    SITE.defaultImage
  );
};

const injectSEO = () => {
  const { path, data: page } = getCurrentPage();

  const title = page.title || getFallbackTitle();
  const description = page.description || getFallbackDescription();
  const image = absoluteUrl(page.image || getFallbackImage());
  const canonical = `${SITE.url}${path === "/" ? "" : path}`;

  document.documentElement.setAttribute("lang", SITE.lang);
  document.title = title;

  setMeta("name", "viewport", "width=device-width, initial-scale=1.0");
  setMeta("http-equiv", "X-UA-Compatible", "IE=edge");
  setMeta("name", "description", description);
  setMeta("name", "author", SITE.author);
  setMeta("name", "robots", "index, follow, max-image-preview:large");

  setLink("canonical", canonical);

  setMeta("property", "og:locale", SITE.locale);
  setMeta("property", "og:site_name", SITE.name);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:type", page.type === "article" ? "article" : "website");
  setMeta("property", "og:image", image);
  setMeta("property", "og:image:width", "1200");
  setMeta("property", "og:image:height", "630");
  setMeta("property", "og:image:alt", title);

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);

  injectSchema("schema-organization", getOrganizationSchema());
  injectSchema("schema-person", getPersonSchema());
  injectSchema("schema-website", getWebSiteSchema());

  injectSchema(
    "schema-webpage",
    buildPageSchema({
      path,
      page,
      title,
      description,
      image,
      canonical
    })
  );

  const breadcrumb = buildBreadcrumbSchema(path, {
    ...page,
    title
  });

  breadcrumb
    ? injectSchema("schema-breadcrumb", breadcrumb)
    : removeSchema("schema-breadcrumb");

  const faq = buildFAQSchema();
  faq
    ? injectSchema("schema-faq", faq)
    : removeSchema("schema-faq");

  const video = buildVideoSchema(page);
  video
    ? injectSchema("schema-video", video)
    : removeSchema("schema-video");
};

  /* =========================================================
     PRETTY URLS
  ========================================================= */

  const patchPrettyUrls = () => {
    document.querySelectorAll("a[href]").forEach((link) => {
      let href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http")
      ) {
        return;
      }

      href = href
        .replace(/^(\.\.\/)+/, "/")
        .replace(/\/index\.html$/, "")
        .replace(".html", "");

      link.setAttribute("href", href);
    });
  };

  /* =========================================================
     ASSETS
  ========================================================= */

  const patchAssets = () => {
    const stylesheet = document.querySelector('link[href*="style.css"]');

    if (stylesheet && stylesheet.getAttribute("href").startsWith("..")) {
      stylesheet.setAttribute("href", "/css/style.css");
    }
  };

  /* =========================================================
     BOTONES COPIAR
  ========================================================= */

  const initCopyButtons = () => {
    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const text = button.getAttribute("data-copy") || "";

        try {
          await navigator.clipboard.writeText(text);
          const oldText = button.textContent;

          button.textContent = "Copiado";

          setTimeout(() => {
            button.textContent = oldText || "Copiar";
          }, 1600);
        } catch {
          alert("No se pudo copiar.");
        }
      });
    });
  };

  /* =========================================================
     FORMULARIOS NETLIFY
  ========================================================= */

  const encodeFormData = (formData) => {
    return new URLSearchParams(formData).toString();
  };

  const initNetlifyForms = () => {
    document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formNameInput = form.querySelector('input[name="form-name"]');
        const formName =
          formNameInput?.value?.trim() ||
          form.getAttribute("name")?.trim();

        const successUrl =
          form.getAttribute("data-success") ||
          "/recursos/gracias-50-secretos.html";

        if (!formName) {
          console.error("El formulario no tiene form-name.");
          return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : "";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = "Enviando...";
        }

        const formData = new FormData(form);
        formData.set("form-name", formName);

        const isLocal =
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname === "localhost";

        if (isLocal) {
          window.location.href = successUrl;
          return;
        }

        try {
          const response = await fetch("/", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: encodeFormData(formData)
          });

          if (!response.ok) {
            throw new Error(`Error Netlify: ${response.status}`);
          }

          window.location.href = successUrl;
        } catch (error) {
          console.error("Error enviando formulario:", error);

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent =
              originalButtonText || "Descargar guía";
          }

          alert("Hubo un problema enviando el formulario. Intenta de nuevo.");
        }
      });
    });
  };

  /* =========================================================
     INICIALIZACIÓN
  ========================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    patchAssets();
    patchPrettyUrls();
    initFavicons();
    initTechnicalHead();
    injectSEO();
    initCopyButtons();
    initNetlifyForms();
  });
})();