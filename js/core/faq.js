// ============================================================
// WINHACKS ENGINE v1.0
// FILE: js/core/faq.js
// PURPOSE: Acordeón global para preguntas frecuentes
// ============================================================

class WinHacksFAQ {
  constructor() {
    this.faqItems = document.querySelectorAll(".faq-box");
    this.init();
  }

  init() {
    if (!this.faqItems.length) return;

    this.faqItems.forEach((faq) => {
      const question = faq.querySelector("h3");
      const answer = faq.querySelector("p");

      if (!question || !answer) return;

      question.setAttribute("tabindex", "0");
      question.setAttribute("role", "button");
      question.setAttribute("aria-expanded", "false");

      answer.classList.add("faq-answer");

      question.addEventListener("click", () => {
        this.toggleFAQ(faq, question);
      });

      question.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.toggleFAQ(faq, question);
        }
      });
    });
  }

  toggleFAQ(faq, question) {
    const isOpen = faq.classList.contains("open");

    faq.classList.toggle("open");
    question.setAttribute("aria-expanded", String(!isOpen));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new WinHacksFAQ();
});