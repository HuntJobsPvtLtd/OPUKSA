// function loadHTML(elementId, filePath) {
//     return fetch(filePath)
//         .then(response => response.text())
//         .then(data => {
//             // Inject HTML
//             document.getElementById(elementId).innerHTML = data;

//             // ✅ Run any scripts inside the loaded HTML
//             const temp = document.createElement("div");
//             temp.innerHTML = data;
//             temp.querySelectorAll("script").forEach(oldScript => {
//                 const newScript = document.createElement("script");
//                 if (oldScript.src) {
//                     newScript.src = oldScript.src;
//                 } else {
//                     newScript.textContent = oldScript.textContent;
//                 }
//                 document.body.appendChild(newScript);
//             });
//         })
//         .catch(error => console.error("Error loading HTML:", error));
// }

// // Detect current folder to adjust relative paths
// const isInServicesFolder = window.location.pathname.includes("/services/");
// const isInBlogsFolder = window.location.pathname.includes("/posts_blogs/");

// // Load header & footer
// Promise.all([
//     loadHTML("header", isInServicesFolder || isInBlogsFolder ? "../header.html" : "header.html"),
//     loadHTML("footer", isInServicesFolder || isInBlogsFolder ? "../footer.html" : "footer.html")
// ]).then(() => {
//     setActiveNavLink();
//     initHeaderFunctions();

//     // Initialize Lucide icons
//     if (window.lucide) {
//         lucide.createIcons();
//     }

//     // Set footer year
//     const footerYear = document.querySelector("#footer #currentYear");
//     if (footerYear) {
//         footerYear.textContent = new Date().getFullYear();
//     }
// });

// // ------------------------------
// // Highlight active nav link
// // ------------------------------
// function setActiveNavLink() {
//     const currentPath = window.location.pathname;
//     const navLinks = document.querySelectorAll("a[href]");

//     navLinks.forEach(link => {
//         const linkPath = new URL(link.href).pathname;
//         if (linkPath === currentPath) {
//             link.classList.add("text-primary", "font-bold");
//         } else {
//             link.classList.remove("text-primary", "font-bold");
//         }
//     });
// }

// // ------------------------------
// // Initialize header functions
// // ------------------------------
// function initHeaderFunctions() {
//     // --- Mobile Menu Toggle ---
//     const mobileMenuBtn = document.getElementById("mobile-menu-btn");
//     const mobileMenuContainer = document.getElementById("mobile-menu-container");

//     if (mobileMenuBtn && mobileMenuContainer) {
//         mobileMenuBtn.addEventListener("click", () => {
//             mobileMenuContainer.classList.toggle("hidden");
//         });
//     }

//     // --- Mobile Services Dropdown ---
//     const mobileServicesBtn = document.getElementById("mobile-services-button");
//     const mobileServicesDropdown = document.getElementById("mobile-services-dropdown");

//     if (mobileServicesBtn && mobileServicesDropdown) {
//         mobileServicesBtn.addEventListener("click", () => {
//             const isVisible = mobileServicesDropdown.classList.contains("visible");
//             if (isVisible) {
//                 mobileServicesDropdown.classList.remove("visible", "opacity-100");
//                 mobileServicesDropdown.classList.add("opacity-0", "invisible");
//             } else {
//                 mobileServicesDropdown.classList.add("visible", "opacity-100");
//                 mobileServicesDropdown.classList.remove("opacity-0", "invisible");
//             }
//         });
//     }

//     // --- Language Switcher ---
//     function switchLanguage(lang) {
//         if (lang === "en") {
//             window.location.href = "/";
//         } else if (lang === "ar") {
//             window.location.href = "/ar/";
//         }
//     }

//     // Desktop language dropdown
//     const desktopLangItems = document.querySelectorAll("#desktop-language-dropdown li");
//     desktopLangItems.forEach(item => {
//         item.addEventListener("click", () => {
//             const lang = item.getAttribute("data-lang");
//             switchLanguage(lang);
//         });
//     });

//     // Mobile language dropdown
//     const mobileLangBtn = document.getElementById("mobile-language-button");
//     const mobileLangDropdown = document.getElementById("mobile-language-dropdown");

//     if (mobileLangBtn && mobileLangDropdown) {
//         mobileLangBtn.addEventListener("click", () => {
//             mobileLangDropdown.classList.toggle("opacity-0");
//             mobileLangDropdown.classList.toggle("invisible");
//         });

//         const mobileLangItems = mobileLangDropdown.querySelectorAll("li");
//         mobileLangItems.forEach(item => {
//             item.addEventListener("click", () => {
//                 const lang = item.getAttribute("data-lang");
//                 switchLanguage(lang);
//             });
//         });
//     }
// }

// Remove index.html from URL for SEO

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

// --- Path Detection ---
const isInServicesFolder = window.location.pathname.includes("/services/");
const isInBlogsFolder = window.location.pathname.includes("/blog/");
const isArabicPage = window.location.pathname.includes("/ar/");

// Helper to determine the correct path to header/footer
const getIncludePath = (file) => {
  // Check if we are in a subfolder or the main level of the /ar/ directory
  if (
    isInServicesFolder ||
    isInBlogsFolder ||
    (isArabicPage &&
      window.location.pathname.split("/").length <= 3 &&
      window.location.pathname !== "/")
  ) {
    return `../${file}`;
  }
  return file;
};

// Load header & footer
Promise.all([
  loadHTML("header", getIncludePath("header.html")),
  loadHTML("footer", getIncludePath("footer.html")),
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
// function initHeaderFunctions() {
//     const toggleDropdown = (buttonId, dropdownId) => {
//         const btn = document.getElementById(buttonId);
//         const menu = document.getElementById(dropdownId);
//         if (btn && menu) {
//             btn.addEventListener("click", (e) => {
//                 e.stopPropagation(); // Stop click from immediately closing the menu
//                 menu.classList.toggle("opacity-0");
//                 menu.classList.toggle("invisible");
//             });
//         }
//     };

//     // --- Mobile Menu Toggle ---
//     toggleDropdown("mobile-menu-btn", "mobile-menu-container");

//     // --- Mobile Services Dropdown ---
//     toggleDropdown("mobile-services-button", "mobile-services-dropdown");

//     // --- Mobile Language Dropdown Toggle ---
//     toggleDropdown("mobile-language-button", "mobile-language-dropdown");

//     // --- NEW: Desktop Language Dropdown Toggle ---
//     toggleDropdown("desktop-language-button", "desktop-language-menu");

//     // Close desktop language menu when clicking outside
//     document.addEventListener('click', (e) => {
//         const desktopMenu = document.getElementById("desktop-language-menu");
//         const desktopBtn = document.getElementById("desktop-language-button");
//         if (desktopMenu && !desktopMenu.contains(e.target) && desktopBtn && !desktopBtn.contains(e.target)) {
//             desktopMenu.classList.add("opacity-0", "invisible");
//             desktopMenu.classList.remove("visible");
//         }
//     });

//     // --- Language Switcher Initialization ---
//     initLanguageSwitcher();
// }

// ------------------------------
// Initialize header functions
// ------------------------------
function initHeaderFunctions() {
  // Generic dropdown toggler for opacity/invisible type menus
  const toggleDropdown = (buttonId, dropdownId) => {
    const btn = document.getElementById(buttonId);
    const menu = document.getElementById(dropdownId);
    if (btn && menu) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("opacity-0");
        menu.classList.toggle("invisible");
      });
    }
  };

  // --- Mobile Menu Toggle (uses 'hidden', not opacity) ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuContainer = document.getElementById("mobile-menu-container");
  if (mobileMenuBtn && mobileMenuContainer) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenuContainer.classList.toggle("hidden");
    });
  }

  // --- Mobile Services Dropdown ---
  toggleDropdown("mobile-services-button", "mobile-services-dropdown");

  // --- Mobile Language Dropdown ---
  toggleDropdown("mobile-language-button", "mobile-language-dropdown");

  // --- Desktop Language Dropdown ---
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
// Language Switcher Logic
// ------------------------------
// function initLanguageSwitcher() {
//   const langItems = document.querySelectorAll("li[data-lang]");

//   langItems.forEach((item) => {
//     item.addEventListener("click", (event) => {
//       const newLang = event.currentTarget.getAttribute("data-lang");
//       let currentPathname = window.location.pathname;

//       // 1. Normalize current path (remove /ar/ prefix for the base filename)
//       const isCurrentlyArabic = currentPathname.startsWith("/ar");
//       if (isCurrentlyArabic) {
//         // Removes /ar or /ar/
//         currentPathname = currentPathname.replace(/^\/ar\/?/, "/");
//       }
//       if (currentPathname === "/") currentPathname = "/index.html";

//       let newPathname = currentPathname;
//       const currentOrigin = window.location.origin;

//       if (newLang === "ar") {
//         if (!isCurrentlyArabic) {
//           newPathname = "/ar" + newPathname;
//         } else {
//           return; // Already on Arabic version
//         }
//       } else if (newLang === "en") {
//         if (isCurrentlyArabic) {
//           // newPathname is already the English path (/index.html or /about.html)
//           if (newPathname === "/index.html") {
//             newPathname = "/"; // Go to root path for English index
//           }
//         } else {
//           return; // Already on English version
//         }
//       } else {
//         return;
//       }

//       // Redirect to the new page
//       window.location.href = currentOrigin + newPathname;
//     });
//   });
// }
function initLanguageSwitcher() {
  const langItems = document.querySelectorAll("li[data-lang]");

  langItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const lang = event.currentTarget.getAttribute("data-lang");

      if (lang === "ar") {
        window.location.href = "/ar/"; // <<< ALWAYS go to /ar/
      } else if (lang === "en") {
        window.location.href = "/"; // <<< English homepage
      }
    });
  });
}
