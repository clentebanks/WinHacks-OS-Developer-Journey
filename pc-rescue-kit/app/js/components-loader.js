async function fetchComponent(url) {
  const response = await fetch(url, {
    headers: { "X-Requested-With": "WinHacks-PC-Rescue-Kit" }
  });

  if (!response.ok) {
    throw new Error(`${url}: ${response.status}`);
  }

  return response.text();
}

function initializeSharedMenu(root = document) {
  const menuToggle = root.querySelector("#menuToggle");
  const navLinks = root.querySelector("#navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("active");

    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  root.querySelectorAll(".dropdown > a").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (window.innerWidth > 900) return;

      event.preventDefault();
      const parent = link.parentElement;

      root.querySelectorAll(".dropdown").forEach((item) => {
        if (item !== parent) item.classList.remove("open");
      });

      parent.classList.toggle("open");
    });
  });

  const currentPath = window.location.pathname.toLowerCase();

  root.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin)
      .pathname
      .toLowerCase();

    const isActive =
      currentPath === linkPath ||
      (linkPath.endsWith("/index.html") &&
        currentPath.startsWith(linkPath.replace("index.html", "")));

    if (!isActive) return;

    link.classList.add("active");
    const dropdown = link.closest(".dropdown");
    dropdown?.querySelector(":scope > a")?.classList.add("active");
  });
}

async function injectComponent(selector, url, onLoaded) {
  const target = document.querySelector(selector);
  if (!target) return false;

  try {
    const html = await fetchComponent(url);
    target.innerHTML = html;
    target.dataset.componentLoaded = "true";
    onLoaded?.(target);
    return true;
  } catch (error) {
    console.warn(`No se pudo cargar ${url}. Se mantiene el fallback.`, error);
    return false;
  }
}

export async function loadWinHacksComponents() {
  const [navbarLoaded, footerLoaded] = await Promise.all([
    injectComponent(
      "#site-navbar",
      "/components/navbar.html",
      initializeSharedMenu
    ),
    injectComponent("#site-footer", "/components/footer.html")
  ]);

  document.documentElement.dataset.sharedNavbar = navbarLoaded
    ? "loaded"
    : "fallback";
  document.documentElement.dataset.sharedFooter = footerLoaded
    ? "loaded"
    : "fallback";

  return { navbarLoaded, footerLoaded };
}
