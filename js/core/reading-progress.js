// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/reading-progress.js
// PURPOSE: Barra de progreso de lectura global
// ============================================================

class WinHacksReadingProgress {
  constructor() {
    this.progressBar = null;
    this.init();
  }

  init() {
    this.createProgressBar();
    this.updateProgress();

    window.addEventListener("scroll", () => {
      this.updateProgress();
    });

    window.addEventListener("resize", () => {
      this.updateProgress();
    });
  }

  createProgressBar() {
    this.progressBar = document.createElement("div");
    this.progressBar.className = "reading-progress";
    document.body.appendChild(this.progressBar);
  }

  updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    const progress =
      documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

    this.progressBar.style.width = `${progress}%`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WinHacksReadingProgress();
});