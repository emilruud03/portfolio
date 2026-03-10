const yearElement = document.getElementById("year");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const themeToggle = document.getElementById("theme-toggle");
const links = document.querySelectorAll(".nav-links a");
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function closeMenu() {
  if (!mainNav || !menuToggle) {
    return;
  }

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

function setActiveLink() {
  const scrollY = window.scrollY + 140;
  let currentSection = "";

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      currentSection = section.id;
    }
  });

  links.forEach((link) => {
    const href = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("active", href === currentSection);
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

function getEffectiveTheme() {
  const explicitTheme = document.documentElement.getAttribute("data-theme");
  if (explicitTheme === "dark" || explicitTheme === "light") {
    return explicitTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark" || storedTheme === "light") {
  document.documentElement.setAttribute("data-theme", storedTheme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = getEffectiveTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
}

function updateHeaderVisibility() {
  if (!siteHeader) {
    return;
  }

  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", setActiveLink);
window.addEventListener("scroll", updateHeaderVisibility);
window.addEventListener("load", setActiveLink);
window.addEventListener("load", updateHeaderVisibility);
window.addEventListener("resize", setActiveLink);
window.addEventListener("click", (event) => {
  if (!mainNav || !menuToggle || !mainNav.classList.contains("open")) {
    return;
  }

  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});
