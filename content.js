// ============================================
// Scaler DOM Cleaner - Enhanced SPA Support
// ============================================

// Elements to remove on /academy/mentee-dashboard/todos page
const TODOS_PAGE_SELECTORS = [
  // 2025 Revisited card
  {
    selector: "a._3l2QS_TrEOIiff69Oqtw-",
    verify: (el) =>
      el.textContent.includes("2025") && el.textContent.includes("Revisited"),
  },
  // Referral Stats container
  {
    selector: "div.referral-live-counter__container",
    verify: (el) =>
      el
        .querySelector(".referral-live-counter__title")
        ?.textContent.includes("Referral Stats"),
  },
  // Mess Fee info card - EXCEPTION: show in last 10 days of month
  {
    selector: "a.mentee-card",
    verify: (el) => {
      const isMessFee = el.textContent.includes("Mess Fee");
      if (!isMessFee) return false;

      // Allow Mess Fee card in last 10 days of the month
      const today = new Date();
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      ).getDate();
      const dayOfMonth = today.getDate();
      const isLast10Days = dayOfMonth > lastDayOfMonth - 10;

      // Return true to REMOVE only if NOT in last 10 days
      return !isLast10Days;
    },
  },
  // Refer & Earn nudge button
  {
    selector: "a.refer-and-earn-nudge-sst",
    verify: (el) =>
      el.textContent.includes("Refer") && el.textContent.includes("Earn"),
  },
  // Scaler coins link
  {
    selector: 'a.mentee-header__stats[href="/store"]',
    verify: (el) => el.querySelector('img[alt="scaler coin"]') !== null,
  },
  // Continue Watching section
  {
    selector: "div.section.continue-watch",
    verify: (el) =>
      el
        .querySelector(".section-header__title")
        ?.textContent.includes("Continue Watching"),
  },
  // Referral banner
  {
    selector: "div.ug-referral-banner-sst",
    verify: (el) =>
      el.textContent.includes("Referral") && el.textContent.includes("Rewards"),
  },
];

// Global elements to remove on ALL scaler.com pages
const GLOBAL_SELECTORS = [
  // Notebook widget
  {
    selector: "a",
    verify: (el) =>
      el.querySelector('img[alt="widget-icon"][src*="notebook-widget"]') !==
      null,
  },
];

// Sidebar elements to remove (runs when sidebar opens)
const SIDEBAR_SELECTORS = [
  // SST Goodies link
  {
    selector: 'a[href="/academy/store"]',
    verify: (el) => el.textContent.includes("SST Goodies"),
  },
  // Refer Friends to SST link
  {
    selector: "a.me-sidebar-refer-and-earn-sst__nav",
    verify: (el) => el.textContent.includes("Refer Friends"),
  },
  // Refer banner/card
  {
    selector: "div.me-sidebar-refer-and-earn-sst",
    verify: (el) => el.getAttribute("role") === "presentation",
  },
];

// Track the last URL to detect navigation
let lastUrl = location.href;

// Track if sidebar observer is set up
let sidebarObserverSetup = false;

/**
 * Check if current page is the todos page
 */
function isTodosPage() {
  return location.pathname.includes("/academy/mentee-dashboard/todos");
}

/**
 * Remove elements based on selector config
 */
function removeElementsByConfig(configs, logPrefix) {
  let removedCount = 0;

  configs.forEach((config) => {
    const elements = document.querySelectorAll(config.selector);
    elements.forEach((element) => {
      if (config.verify(element)) {
        element.remove();
        removedCount++;
        // console.log(`[Scaler DOM Cleaner] ${logPrefix}: Removed ${config.selector}`);
      }
    });
  });

  return removedCount;
}

/**
 * Add Core-Curriculum link to the h2 element
 */
function addCoreCurriculumLink() {
  // Find h2 with "Today's Tasks" or similar header
  const h2 = document.querySelector(".section-header__title");

  // Skip if already has the link
  if (h2.querySelector('a[href*="core-curriculum"]')) return;

  // Create the anchor tag
  const anchor = document.createElement("a");
  anchor.href =
    "https://www.scaler.com/academy/mentee-dashboard/core-curriculum/m/";
  anchor.textContent = "Core-Curriculum";
  anchor.style.marginLeft = "10px";
  anchor.style.color = "#5865F2";
  anchor.style.textDecoration = "none";
  anchor.style.fontSize = "0.8em";
  anchor.style.fontWeight = "normal";

  // Append the anchor to the first section header
  h2.appendChild(anchor);
  // console.log("[Scaler DOM Cleaner] Added Core-Curriculum link");
  return; // Only add once
}

/**
 * Add Core-Curriculum icon link to the header container
 * First tries class selector, then falls back to XPath after delay
 */
function addCoreCurriculumIconLink() {
  // First try by class name
  let container = document.querySelector(".e7ge61UPj54Me37pqU2Rd");

  if (container) {
    appendCurriculumIcon(container);
  } else {
    // Wait 2 seconds for DOM to load, then try XPath
    setTimeout(() => {
      const containerXPath =
        "/html/body/div[3]/div/div[1]/div/div[1]/div/div[2]/div/div[1]";
      const xpathContainer = getElementByXPath(containerXPath);

      if (xpathContainer) {
        appendCurriculumIcon(xpathContainer);
      }
    }, 2000);
  }
}

/**
 * Helper function to append the curriculum icon to a container
 */
function appendCurriculumIcon(container) {
  // Skip if already has the curriculum link
  if (container.querySelector('a[href*="core-curriculum"]')) return;

  // Create the anchor tag with icon
  const anchor = document.createElement("a");
  anchor.href =
    "https://www.scaler.com/academy/mentee-dashboard/core-curriculum/m/";
  anchor.className = "tappable";
  anchor.style.display = "inline-flex";
  anchor.style.alignItems = "center";
  anchor.style.marginLeft = "10px";
  anchor.title = "Core Curriculum";

  // Create the icon
  const icon = document.createElement("i");
  icon.className = "icon-curriculum-outlined sidebar__item-icon";

  // Append icon to anchor
  anchor.appendChild(icon);

  // Append at the end of the container (like push_back)
  container.appendChild(anchor);
  // console.log("[Scaler DOM Cleaner] Added Core-Curriculum icon link to header");
}

/**
 * Main cleanup function - runs on todos page
 */
function cleanupTodosPage() {
  if (!isTodosPage()) return;

  // console.log("[Scaler DOM Cleaner] Running cleanup on todos page...");

  const removed = removeElementsByConfig(TODOS_PAGE_SELECTORS, "Todos");

  if (removed > 0) {
    // console.log(`[Scaler DOM Cleaner] Removed ${removed} element(s) on todos page`);
  }

  addCoreCurriculumLink();
  addCoreCurriculumIconLink();
}

/**
 * Global cleanup - runs on all pages
 */
function cleanupGlobal() {
  const removed = removeElementsByConfig(GLOBAL_SELECTORS, "Global");

  if (removed > 0) {
    // console.log(`[Scaler DOM Cleaner] Removed ${removed} global element(s)`);
  }
}

/**
 * Cleanup sidebar elements
 */
function cleanupSidebar() {
  const sidebar = document.querySelector(".sidebar__content");
  if (!sidebar) return;

  removeElementsByConfig(SIDEBAR_SELECTORS, "Sidebar");
}

/**
 * Setup observer to watch for sidebar open/close
 */
function setupSidebarObserver() {
  if (sidebarObserverSetup) return;

  // Find the sidebar container
  const sidebarContainer = document.querySelector(
    ".ug-sidebar.sidebar.mentee-sidebar"
  );
  if (!sidebarContainer) {
    // Try again later if sidebar not found yet
    setTimeout(setupSidebarObserver, 1000);
    return;
  }

  // Create observer to watch for class changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        const target = mutation.target;
        if (target.classList.contains("sidebar__open")) {
          // Sidebar just opened, clean it
          setTimeout(cleanupSidebar, 100);
          setTimeout(cleanupSidebar, 500);
        }
      }
    });
  });

  observer.observe(sidebarContainer, {
    attributes: true,
    attributeFilter: ["class"],
  });

  sidebarObserverSetup = true;
  // console.log("[Scaler DOM Cleaner] Sidebar observer setup complete");

  // Also clean sidebar immediately if it's already open
  if (sidebarContainer.classList.contains("sidebar__open")) {
    cleanupSidebar();
  }
}

/**
 * Run all cleanup tasks
 */
function runCleanup() {
  cleanupGlobal();
  cleanupTodosPage();
  cleanupSidebar();
  setupSidebarObserver();
}

/**
 * Handle URL changes (SPA navigation)
 */
function handleUrlChange() {
  if (location.href !== lastUrl) {
    // console.log(`[Scaler DOM Cleaner] URL changed: ${lastUrl} -> ${location.href}`);
    lastUrl = location.href;

    // Wait for content to load after navigation
    setTimeout(runCleanup, 1500);
    setTimeout(runCleanup, 3000); // Retry after 3s for slow loading elements
  }
}

/**
 * Setup URL change detection using multiple methods
 */
function setupUrlChangeDetection() {
  // Method 1: Watch for popstate (back/forward navigation)
  window.addEventListener("popstate", () => {
    setTimeout(handleUrlChange, 100);
  });

  // Method 2: Override pushState and replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(handleUrlChange, 100);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(handleUrlChange, 100);
  };

  // Method 3: MutationObserver as fallback (watches for significant DOM changes)
  const observer = new MutationObserver((mutations) => {
    // Check if URL changed
    if (location.href !== lastUrl) {
      handleUrlChange();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Method 4: Periodic check (fallback for edge cases)
  setInterval(handleUrlChange, 2000);
}

// ============================================
// Initialize
// ============================================

// Run on initial page load
window.addEventListener("load", () => {
  // console.log("[Scaler DOM Cleaner] Extension loaded");

  // Setup URL change detection for SPA navigation
  setupUrlChangeDetection();

  // Initial cleanup with delays for dynamic content
  setTimeout(runCleanup, 1000);
  setTimeout(runCleanup, 2500);
  setTimeout(runCleanup, 5000); // Final retry for very slow elements
});

// Also run on DOMContentLoaded (fires earlier)
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(runCleanup, 500);
});
