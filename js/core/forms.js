// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/forms.js
// PURPOSE: Manejo global de formularios Netlify + redirecciones
// ============================================================

class WinHacksForms {
  constructor() {
    this.forms = document.querySelectorAll(".netlify-form");
    this.init();
  }

  init() {
    if (!this.forms.length) return;

    this.forms.forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        this.submitForm(form);
      });
    });
  }

  getRedirectUrl(form) {
    return form.dataset.redirect || form.getAttribute("action") || "/gracias.html";
  }

  async submitForm(form) {
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

      window.location.href = this.getRedirectUrl(form);

    } catch (error) {
      console.error("Error enviando formulario:", error);

      alert("Hubo un problema al enviar el formulario. Inténtalo de nuevo.");

      if (button) {
        button.disabled = false;
        button.textContent = originalText;
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WinHacksForms();
});