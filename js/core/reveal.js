// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/reveal.js
// PURPOSE: Animaciones globales al hacer scroll
// ============================================================

class WinHacksReveal {
  constructor() {
    this.elements = document.querySelectorAll(".reveal");
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    this.elements.forEach((element) => {
      observer.observe(element);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WinHacksReveal();
});