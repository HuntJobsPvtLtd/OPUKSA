// --- Constants and Global State ---
const LANG_KEY = "preferredLang";
const DEFAULT_LANG = "en"; // Default stored preference should still be English if none is set

// --- Path Detection ---
// NOTE: Since this script lives in the /ar/ folder, we MUST adjust path detection
// for the includes (header/footer).
const isInServicesFolder = window.location.pathname.includes("/services/");
const isInBlogsFolder = window.location.pathname.includes("/blog/");

// In the /ar/ context, we assume the page is Arabic unless proven otherwise (e.g., if we kept the old script)
// We rely on window.location.pathname for runtime language determination, but need to be careful with relative paths.
const isArabicPage = window.location.pathname.includes("/ar/");

// Helper to determine the correct path to header/footer
// If we are in /ar/ and its subfolders, we adjust pathing accordingly.

// const getIncludePath = (file) => {
//     // If we are in a subfolder of /ar/ (like /ar/services/ or /ar/posts_blogs/)
//     if (isInServicesFolder || isInBlogsFolder) {
//         return `../${file}`;
//     }
//     // If we are directly in /ar/ (like /ar/index.html), the header/footer is also in /ar/
//     // Since the script is in /ar/js/, we must go up one level to the /ar/ folder
//     return `../${file}`;
// };

const getIncludePath = (file) => {
  const path = window.location.pathname;

  // Special case for Arabic blog posts
  if (
    path === "/ar/blog/benefits-of-outsourcing-auditing-services-vs-in-house-audits.html" ||
    path === "/ar/blog/how-to-choose-a-reliable-auditing-service-for-your-startup.html"
  ) {
    return `../${file.replace(/^ar\//, "")}`;
  }

  if (isInServicesFolder || isInBlogsFolder) {
    return `../${file}`;
  }

  return `../${file}`;
};

Promise.all([
  loadHTML("header", getIncludePath("ar/header.html")),
  loadHTML("footer", getIncludePath("ar/footer.html")),
  // loadHTML("header", getIncludePath("header.html")),
  // loadHTML("footer", getIncludePath("footer.html"))
]).then(() => {
  setActiveNavLink();
  initHeaderFunctions();

  if (window.lucide) {
    lucide.createIcons();
  }

  const footerYear = document.querySelector("#footer #currentYear");
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});

// ------------------------------
// Utility Functions
// ------------------------------
function loadHTML(elementId, filePath) {
  return fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      const temp = document.createElement("div");
      temp.innerHTML = data;
      temp.querySelectorAll("script").forEach((oldScript) => {
        const newScript = document.createElement("script");
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.textContent;
        }
        document.body.appendChild(newScript);
      });
      return true;
    })
    .catch((error) => {
      console.error("Error loading HTML:", error);
      return false;
    });
}

// ------------------------------
// Highlight active nav link
// ------------------------------
function setActiveNavLink() {
  // Normalise path by removing '/ar/' for comparison
  const currentPath = window.location.pathname.replace(/\/ar\//, "/");
  const normalizedCurrentPath =
    currentPath === "/" ? "/index.html" : currentPath;

  document.querySelectorAll("a[href]").forEach((link) => {
    const linkPath = new URL(
      link.href,
      window.location.origin
    ).pathname.replace(/\/ar\//, "/");
    const normalizedLinkPath = linkPath === "/" ? "/index.html" : linkPath;

    if (normalizedLinkPath === normalizedCurrentPath) {
      link.classList.add("text-primary", "font-bold");
    } else {
      link.classList.remove("text-primary", "font-bold");
    }
  });
}

// ------------------------------
// Initialize header functions
// ------------------------------
function initHeaderFunctions() {
  const toggleDropdown = (buttonId, dropdownId) => {
    const btn = document.getElementById(buttonId);
    const menu = document.getElementById(dropdownId);
    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Stop click from immediately closing the menu
        menu.classList.toggle("opacity-0");
        menu.classList.toggle("invisible");
      });
    }
  };
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuContainer = document.getElementById("mobile-menu-container");
  if (mobileMenuBtn && mobileMenuContainer) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenuContainer.classList.toggle("hidden");
    });
  }
  // --- Mobile Menu Toggle ---
  // toggleDropdown("mobile-menu-btn", "mobile-menu-container");

  // --- Mobile Services Dropdown ---
  toggleDropdown("mobile-services-button", "mobile-services-dropdown");

  // --- Mobile Language Dropdown Toggle ---
  toggleDropdown("mobile-language-button", "mobile-language-dropdown");

  // --- NEW: Desktop Language Dropdown Toggle ---
  toggleDropdown("desktop-language-button", "desktop-language-menu");

  // Close desktop language menu when clicking outside
  document.addEventListener("click", (e) => {
    const desktopMenu = document.getElementById("desktop-language-menu");
    const desktopBtn = document.getElementById("desktop-language-button");
    if (
      desktopMenu &&
      !desktopMenu.contains(e.target) &&
      desktopBtn &&
      !desktopBtn.contains(e.target)
    ) {
      desktopMenu.classList.add("opacity-0", "invisible");
      desktopMenu.classList.remove("visible");
    }
  });

  // --- Language Switcher Initialization ---
  initLanguageSwitcher();
}

// ------------------------------
// Language Switcher Logic (Identical to English version for full context)
// ------------------------------
function initLanguageSwitcher() {
  const langItems = document.querySelectorAll("li[data-lang]");

  langItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const newLang = event.currentTarget.getAttribute("data-lang");
      let currentPathname = window.location.pathname;

      // 1. Normalize current path (remove /ar/ prefix for the base filename)
      const isCurrentlyArabic = currentPathname.startsWith("/ar");
      if (isCurrentlyArabic) {
        // Removes /ar or /ar/
        currentPathname = currentPathname.replace(/^\/ar\/?/, "/");
      }
      if (currentPathname === "/") currentPathname = "/index.html";

      let newPathname = currentPathname;
      const currentOrigin = window.location.origin;

      if (newLang === "ar") {
        if (!isCurrentlyArabic) {
          newPathname = "/ar" + newPathname;
        } else {
          return; // Already on Arabic version
        }
      } else if (newLang === "en") {
        if (isCurrentlyArabic) {
          // newPathname is already the English path (/index.html or /about.html)
          if (newPathname === "/index.html") {
            newPathname = "/"; // Go to root path for English index
          }
        } else {
          return; // Already on English version
        }
      } else {
        return;
      }

      // Redirect to the new page
      window.location.href = currentOrigin + newPathname;
    });
  });
}
