// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/engine.js
// PURPOSE: Motor central sin carga dinámica tardía
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  generateBreadcrumb();
  initCopyButtons();
  initNetlifyForms();
  initYouTubeEmbeds();
  initFAQ();
  initReveal();
  initReadingProgress();
  initBackToTop();
  initSchema();
});
// BREADCRUMB
function generateBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  if (!breadcrumb) return;

  const path = window.location.pathname
    .replace(".html", "")
    .replace(/^\/|\/$/g, "");

  if (!path) {
    breadcrumb.innerHTML = "";
    return;
  }

  const parts = path.split("/");

  const categoryMap = {
    secretos: "Secretos",
    comandos: "Comandos",
    redes: "Redes",
    personalizacion: "Personalización",
    optimizacion: "Optimización",
    seguridad: "Seguridad",
    recursos: "Recursos",
    academy: "Academy",
    tools: "Herramientas",
    search: "Buscar"
  };

  const formatTitle = (text) => {
    return text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  let html = `
    <ol>
      <li><a href="/">Inicio</a></li>
  `;

  let accumulatedPath = "";

  parts.forEach((part, index) => {
    accumulatedPath += `/${part}`;
    const isLast = index === parts.length - 1;
    const label = categoryMap[part] || formatTitle(part);

    html += `<li><span>/</span></li>`;

    if (isLast) {
      html += `<li class="active" aria-current="page">${label}</li>`;
    } else {
      html += `<li><a href="${accumulatedPath}/index.html">${label}</a></li>`;
    }
  });

  html += `</ol>`;
  breadcrumb.innerHTML = html;
}

// COPY BUTTONS
function initCopyButtons() {
  document.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy-btn");
    if (!button) return;

    const text = button.dataset.copy;
    if (!text) return;

    const originalText = button.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      button.textContent = "✓ Copiado";
      button.classList.add("copied");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copied");
      }, 1800);

    } catch (error) {
      alert("No se pudo copiar.");
    }
  });
}

// NETLIFY FORMS
function initNetlifyForms() {
  const forms = document.querySelectorAll(".netlify-form");
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalText = button ? button.textContent : "";

      if (button) {
        button.disabled = true;
        button.textContent = "Enviando...";
      }

      const formData = new FormData(form);

      if (!formData.get("form-name") && form.getAttribute("name")) {
        formData.append("form-name", form.getAttribute("name"));
      }

      const redirectUrl =
        form.dataset.redirect ||
        form.getAttribute("action") ||
        "/recursos/gracias-50-secretos.html";

      try {
        const response = await fetch("/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams(formData).toString()
        });

        if (!response.ok) {
          throw new Error("Netlify no aceptó el formulario.");
        }

        window.location.href = redirectUrl;

      } catch (error) {
        alert("Hubo un problema al enviar el formulario. Inténtalo de nuevo.");

        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  });
}

// YOUTUBE
function initYouTubeEmbeds() {
  const iframes = document.querySelectorAll(".youtube-short iframe");

  iframes.forEach((iframe) => {
    iframe.setAttribute("loading", "lazy");

    if (!iframe.getAttribute("title")) {
      iframe.setAttribute("title", "Short de YouTube WinHacks");
    }

    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );

    iframe.setAttribute("allowfullscreen", "");
  });
}

// FAQ
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-box");

  faqItems.forEach((faq) => {
    const question = faq.querySelector("h3");
    const answer = faq.querySelector("p");

    if (!question || !answer) return;

    question.setAttribute("tabindex", "0");
    question.setAttribute("role", "button");
    question.setAttribute("aria-expanded", "false");

    answer.classList.add("faq-answer");

    const toggle = () => {
      const isOpen = faq.classList.contains("open");
      faq.classList.toggle("open");
      question.setAttribute("aria-expanded", String(!isOpen));
    };

    question.addEventListener("click", toggle);

    question.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
}

// REVEAL
function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((element) => observer.observe(element));
}

// READING PROGRESS
function initReadingProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    progressBar.style.width = `${progress}%`;
  };

  window.addEventListener("scroll", updateProgress);
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

// BACK TO TOP
function initBackToTop() {
  const button = document.querySelector(".to-top");
  if (!button) return;

  const toggleButton = () => {
    if (window.scrollY > 350) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  };

  button.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", toggleButton);
  toggleButton();
}

// SCHEMA.ORG JSON-LD
function initSchema() {
  const SITE_URL = "https://winhacks.dev";
  const SITE_NAME = "WinHacks";
  const LOGO_URL = `${SITE_URL}/assets/images/logo-cuadrado.webp`;
  const DEFAULT_IMAGE = `${SITE_URL}/assets/img/og/og-default.jpg`;

  const path = window.location.pathname;
  const pageUrl = `${SITE_URL}${path}`;
  const title = document.title || SITE_NAME;
  const description =
    document.querySelector('meta[name="description"]')?.content ||
    "Guías prácticas de Windows, comandos seguros, optimización, seguridad y recursos gratuitos.";

  const isHome = path === "/" || path === "/index.html";
  const isIndexPage = path.endsWith("/") || path.endsWith("/index.html");
  const isCoursePage = path.includes("/academy/plan-");

  function formatName(text) {
    return text
      .replace(".html", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace("Cmd", "CMD")
      .replace("Usb", "USB")
      .replace("Ssd", "SSD")
      .replace("Uac", "UAC");
  }

  function getBreadcrumbItems() {
    const parts = path.split("/").filter(Boolean);

    const items = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${SITE_URL}/`
      }
    ];

    if (parts.length >= 1 && parts[0] !== "index.html") {
      items.push({
        "@type": "ListItem",
        position: 2,
        name: formatName(parts[0]),
        item: `${SITE_URL}/${parts[0]}/`
      });
    }

    if (parts.length >= 2 && !path.endsWith("/index.html")) {
      items.push({
        "@type": "ListItem",
        position: 3,
        name: formatName(parts[parts.length - 1]),
        item: pageUrl
      });
    }

    return items;
  }

  const graph = [];

  graph.push({
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL
    },
    founder: {
      "@type": "Person",
      name: "Clent Ebanks"
    },
    sameAs: [
      "https://youtube.com/@WinHacksOficial"
    ]
  });

  graph.push({
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`
    },
    inLanguage: "es"
  });

  if (!isHome) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: getBreadcrumbItems()
    });
  }

  if (isCoursePage) {
    graph.push({
      "@type": "Course",
      "@id": `${pageUrl}#course`,
      name: title,
      description: description,
      url: pageUrl,
      provider: {
        "@id": `${SITE_URL}/#organization`
      },
      inLanguage: "es"
    });
  } else if (!isHome && isIndexPage) {
    graph.push({
      "@type": "CollectionPage",
      "@id": `${pageUrl}#collection`,
      name: title,
      description: description,
      url: pageUrl,
      isPartOf: {
        "@id": `${SITE_URL}/#website`
      },
      inLanguage: "es"
    });
  } else if (!isHome) {
    graph.push({
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: title,
      description: description,
      url: pageUrl,
      image: DEFAULT_IMAGE,
      author: {
        "@type": "Person",
        name: "Clent Ebanks"
      },
      publisher: {
        "@id": `${SITE_URL}/#organization`
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": pageUrl
      },
      inLanguage: "es"
    });
  }

  const faqItems = [...document.querySelectorAll(".faq-box")]
    .map((faq) => {
      const question = faq.querySelector("h3")?.innerText.trim();
      const answer = faq.querySelector("p")?.innerText.trim();

      if (!question || !answer) return null;

      return {
        "@type": "Question",
        name: question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer
        }
      };
    })
    .filter(Boolean);

  if (faqItems.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqItems
    });
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }, null, 2);

  document.head.appendChild(script);
}