// =======================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/breadcrumb.js
// PURPOSE: Generar breadcrumb automático según la URL
// =======================================================

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
      <li>
        <a href="/">
          Inicio
        </a>
      </li>
  `;

  let accumulatedPath = "";

  parts.forEach((part, index) => {
    accumulatedPath += `/${part}`;

    const isLast = index === parts.length - 1;

    const label = categoryMap[part] || formatTitle(part);

    html += `<li><span>/</span></li>`;

    if (isLast) {
      html += `
        <li class="active" aria-current="page">
          ${label}
        </li>
      `;
    } else {
      html += `
        <li>
          <a href="${accumulatedPath}/index.html">
            ${label}
          </a>
        </li>
      `;
    }
  });

  html += `</ol>`;

  breadcrumb.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", generateBreadcrumb);