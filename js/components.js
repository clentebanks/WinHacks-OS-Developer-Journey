async function loadComponent(id, file) {
  const container = document.getElementById(id);

  if (!container) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`No se pudo cargar: ${file}`);
    }

    const html = await response.text();
    container.innerHTML = html;

    if (id === "navbar-container") {
      initializeMenu();
    }

  } catch (error) {
    console.error(error);
  }
}

function initializeMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  const dropdownLinks = document.querySelectorAll(".dropdown > a");

  dropdownLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();

        const parent = this.parentElement;

        document.querySelectorAll(".dropdown").forEach(function (item) {
          if (item !== parent) {
            item.classList.remove("open");
          }
        });

        parent.classList.toggle("open");
      }
    });
  });

  setActiveNavLink();
}

function setActiveNavLink() {
  const currentPath = window.location.pathname.toLowerCase();
  const links = document.querySelectorAll(".nav-links a");

  links.forEach(function (link) {
    const linkPath = new URL(link.href).pathname.toLowerCase();

    let isActive = false;

    if (currentPath === linkPath) {
      isActive = true;
    } else if (
      linkPath.endsWith("/index.html") &&
      currentPath.startsWith(linkPath.replace("index.html", ""))
    ) {
      isActive = true;
    }

    if (isActive) {
      link.classList.add("active");

      const dropdown = link.closest(".dropdown");

      if (dropdown) {
        const parentLink = dropdown.querySelector(":scope > a");

        if (parentLink) {
          parentLink.classList.add("active");
        }
      }
    }
  });
}

loadComponent("navbar-container", "/components/navbar.html");
loadComponent("footer-container", "/components/footer.html");