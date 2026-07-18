// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/youtube.js
// PURPOSE: Mejoras globales para Shorts de YouTube incrustados
// ============================================================

class WinHacksYouTube {
  constructor() {
    this.embeds = document.querySelectorAll(".youtube-short iframe");
    this.init();
  }

  init() {
    if (!this.embeds.length) return;

    this.embeds.forEach((iframe) => {
      this.optimizeIframe(iframe);
    });
  }

  optimizeIframe(iframe) {
    iframe.setAttribute("loading", "lazy");

    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );

    iframe.setAttribute("allowfullscreen", "");

    if (!iframe.getAttribute("title")) {
      iframe.setAttribute("title", "Short de YouTube WinHacks");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WinHacksYouTube();
});