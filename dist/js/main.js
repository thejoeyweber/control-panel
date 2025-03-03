/**
 * Main JavaScript file for the Control Panel application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[MAIN] DOMContentLoaded fired at', new Date().toISOString());
    console.log('[MAIN] Current URL:', window.location.href);
    console.log('[MAIN] Current pathname:', window.location.pathname);
    console.log('[MAIN] Document readyState:', document.readyState);
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Set active navigation item based on current URL
    setActiveNavItem();
    
    // Setup smooth page transitions
    setupSmoothPageTransitions();
    
    console.log('[MAIN] Initialization complete');
});

/**
 * Initializes charts if they exist on the page
 */
function initializeCharts() {
  const revenueChartElement = document.getElementById('revenue-chart');
  if (revenueChartElement) {
    createPlaceholderChart('revenue-chart', [30, 40, 45, 50, 49, 60, 70, 91, 125]);
  }
  
  const wordCountChartElement = document.getElementById('word-count-chart');
  if (wordCountChartElement) {
    createPlaceholderChart('word-count-chart', [120, 115, 130, 100, 75, 90, 95]);
  }
}

// Set active navigation item based on current URL
function setActiveNavItem() {
    console.log('[NAV] Setting active navigation item');
    console.log('[NAV] Current pathname:', window.location.pathname);
    
    // Remove active class from all navigation items
    const navItems = document.querySelectorAll('.nav-dashboard, .nav-projects, .nav-revenue, .nav-writing, .nav-ai-library, .nav-resources, .nav-books');
    console.log('[NAV] Found', navItems.length, 'navigation items');
    
    navItems.forEach(item => {
        if (item.classList.contains('active')) {
            console.log('[NAV] Removing active class from:', item.textContent.trim());
            item.classList.remove('active');
        }
    });
    
    // Get current path
    let path = window.location.pathname;
    console.log('[NAV] Raw path:', path);
    
    // Handle root path
    if (path === '/' || path === '/index.html') {
        path = '/';
        console.log('[NAV] Normalized to root path');
    } else {
        // Extract the first directory from the path
        const match = path.match(/\/([^\/]+)/);
        if (match && match[1]) {
            path = '/' + match[1];
            console.log('[NAV] Normalized to section path:', path);
        }
    }
    
    // Determine which navigation class to use
    let navClass = 'nav-dashboard'; // Default
    
    if (path === '/') {
        navClass = 'nav-dashboard';
    } else if (path === '/projects') {
        navClass = 'nav-projects';
    } else if (path === '/revenue') {
        navClass = 'nav-revenue';
    } else if (path === '/writing') {
        navClass = 'nav-writing';
    } else if (path === '/ai-library') {
        navClass = 'nav-ai-library';
    } else if (path === '/resources') {
        navClass = 'nav-resources';
    } else if (path === '/books') {
        navClass = 'nav-books';
    }
    
    console.log('[NAV] Selected navigation class:', navClass);
    
    // Add active class to the current navigation item
    const currentNavItems = document.querySelectorAll('.' + navClass);
    console.log('[NAV] Found', currentNavItems.length, 'matching navigation items');
    
    currentNavItems.forEach(item => {
        console.log('[NAV] Adding active class to:', item.textContent.trim());
        item.classList.add('active');
    });
}

// Initialize mobile menu
function initMobileMenu() {
    console.log('[MOBILE] Initializing mobile menu');
    
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) {
        console.warn('[MOBILE] One or more mobile menu elements not found');
        return;
    }
    
    console.log('[MOBILE] Mobile menu elements found');
    
    // Toggle mobile menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        console.log('[MOBILE] Hamburger clicked');
        
        const isOpen = mobileMenu.classList.contains('block');
        console.log('[MOBILE] Menu is currently', isOpen ? 'open' : 'closed');
        
        if (isOpen) {
            // Close menu with animation
            mobileMenu.style.maxHeight = '0';
            
            // After animation completes, hide the menu
            setTimeout(() => {
                mobileMenu.classList.remove('block');
                mobileMenu.classList.add('hidden');
                mobileMenu.style.maxHeight = '';
            }, 300);
            
            // Reset hamburger icon
            const lines = hamburger.querySelectorAll('.hamburger-line');
            lines[0].classList.remove('rotate-45');
            lines[0].classList.remove('translate-y-[10px]');
            lines[1].classList.remove('opacity-0');
            lines[2].classList.remove('-rotate-45');
            lines[2].classList.remove('-translate-y-[10px]');
            
            console.log('[MOBILE] Menu closed');
        } else {
            // First make the menu visible but with 0 height
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('block');
            mobileMenu.style.maxHeight = '0';
            
            // Force a reflow to ensure the transition works
            mobileMenu.offsetHeight;
            
            // Then animate the height to expand it
            const menuHeight = mobileMenu.scrollHeight;
            mobileMenu.style.maxHeight = menuHeight + 'px';
            
            // Animate hamburger icon to X
            const lines = hamburger.querySelectorAll('.hamburger-line');
            lines[0].classList.add('rotate-45', 'translate-y-[10px]');
            lines[1].classList.add('opacity-0');
            lines[2].classList.add('-rotate-45', '-translate-y-[10px]');
            
            console.log('[MOBILE] Menu opened');
        }
    });
    
    // Close mobile menu when a navigation link is clicked
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('[MOBILE] Navigation link clicked:', this.textContent.trim());
            
            // Animate the closing
            mobileMenu.style.maxHeight = '0';
            
            // After animation completes, hide the menu
            setTimeout(() => {
                mobileMenu.classList.remove('block');
                mobileMenu.classList.add('hidden');
                mobileMenu.style.maxHeight = '';
            }, 300);
            
            // Reset hamburger icon
            const lines = hamburger.querySelectorAll('.hamburger-line');
            lines[0].classList.remove('rotate-45');
            lines[0].classList.remove('translate-y-[10px]');
            lines[1].classList.remove('opacity-0');
            lines[2].classList.remove('-rotate-45');
            lines[2].classList.remove('-translate-y-[10px]');
            
            console.log('[MOBILE] Menu closed via navigation link');
        });
    });
}

/**
 * Sets up book view toggle functionality
 */
function setupBookViewToggle() {
  const gridViewButton = document.querySelector('.grid-view');
  const listViewButton = document.querySelector('.list-view');
  const gridBooks = document.querySelector('.grid-books');
  const listBooks = document.querySelector('.list-books');
  
  if (!gridViewButton || !listViewButton || !gridBooks || !listBooks) return;
  
  // Set initial active state
  gridViewButton.classList.add('bg-gray-200', 'dark:bg-gray-700');
  
  gridViewButton.addEventListener('click', () => {
    // Update button states
    gridViewButton.classList.add('bg-gray-200', 'dark:bg-gray-700');
    listViewButton.classList.remove('bg-gray-200', 'dark:bg-gray-700');
    
    // Show grid view, hide list view
    gridBooks.classList.remove('hidden');
    listBooks.classList.add('hidden');
  });
  
  listViewButton.addEventListener('click', () => {
    // Update button states
    listViewButton.classList.add('bg-gray-200', 'dark:bg-gray-700');
    gridViewButton.classList.remove('bg-gray-200', 'dark:bg-gray-700');
    
    // Show list view, hide grid view
    listBooks.classList.remove('hidden');
    gridBooks.classList.add('hidden');
  });
}

/**
 * Sets up dark mode toggle functionality
 */
function setupDarkModeToggle() {
  // This function is no longer used as we've removed the dark mode toggle
  // Keeping the function as a placeholder in case we need to reimplement it later
}

/**
 * Creates a placeholder chart
 * @param {string} selector - The ID of the element to create the chart in
 * @param {Array} data - The data for the chart
 */
function createPlaceholderChart(selector, data) {
  const canvas = document.getElementById(selector);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const maxValue = Math.max(...data);
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw chart
  ctx.beginPath();
  ctx.moveTo(0, height - (data[0] / maxValue) * height);
  
  for (let i = 1; i < data.length; i++) {
    const x = (i / (data.length - 1)) * width;
    const y = height - (data[i] / maxValue) * height;
    ctx.lineTo(x, y);
  }
  
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.stroke();
}

/**
 * Creates a modal dialog
 * @param {string} title - The title of the modal
 * @param {string} content - The content of the modal
 * @returns {HTMLElement} - The modal element
 */
function createModal(title, content) {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'fixed inset-0 flex items-center justify-center z-50';
  
  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'absolute inset-0 bg-black bg-opacity-50';
  modalContainer.appendChild(backdrop);
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'bg-white dark:bg-dark-paper rounded-lg shadow-xl z-10 w-full max-w-md mx-4 overflow-hidden';
  
  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700';
  
  // Create title
  const modalTitle = document.createElement('h3');
  modalTitle.className = 'text-lg font-typewriter';
  modalTitle.textContent = title;
  modalHeader.appendChild(modalTitle);
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.className = 'text-light-ink hover:text-highlight transition-colors';
  closeButton.innerHTML = '<i class="ri-close-line text-xl"></i>';
  modalHeader.appendChild(closeButton);
  
  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'p-4';
  modalBody.innerHTML = content;
  
  // Assemble modal
  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  modalContainer.appendChild(modal);
  
  // Add to document
  document.body.appendChild(modalContainer);
  
  // Close modal function
  const closeModal = () => {
    modalContainer.classList.add('opacity-0');
    setTimeout(() => {
      document.body.removeChild(modalContainer);
    }, 300);
  };
  
  // Add event listeners
  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  
  // Return modal element
  return modalContainer;
}

// Setup smooth page transitions
function setupSmoothPageTransitions() {
    console.log('[TRANSITIONS] Setting up page transitions');
    
    // Check if we're using the file protocol (local file)
    const isFileProtocol = window.location.protocol === 'file:';
    console.log('[TRANSITIONS] Using file protocol:', isFileProtocol);
    
    // If using file protocol, don't use AJAX navigation
    if (isFileProtocol) {
        console.log('[TRANSITIONS] Skipping AJAX navigation setup due to file protocol');
        return;
    }
    
    // Get all internal links
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="' + window.location.origin + '"]');
    console.log('[TRANSITIONS] Found', internalLinks.length, 'internal links');
    
    // Add click event listener to each internal link
    internalLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });
    
    // Handle popstate event (browser back/forward buttons)
    window.addEventListener('popstate', function(event) {
        console.log('[TRANSITIONS] Popstate event fired');
        console.log('[TRANSITIONS] State:', event.state);
        
        if (event.state && event.state.url) {
            console.log('[TRANSITIONS] Navigating to:', event.state.url);
            window.location.href = event.state.url;
        }
    });
    
    console.log('[TRANSITIONS] Page transitions setup complete');
}

// Handle link click
function handleLinkClick(event) {
    console.log('[TRANSITIONS] Link clicked:', this.href);
    console.log('[TRANSITIONS] Link text:', this.textContent.trim());
    
    // Get the href attribute
    const href = this.getAttribute('href');
    console.log('[TRANSITIONS] Href attribute:', href);
    
    // Skip if it's an external link or has a target attribute
    if (this.hasAttribute('target') || !href.startsWith('/')) {
        console.log('[TRANSITIONS] Skipping - external link or has target attribute');
        return;
    }
    
    // Update active navigation immediately
    updateActiveNavigationFromLink(this);
    
    // Let the browser handle the navigation normally
    console.log('[TRANSITIONS] Proceeding with normal navigation');
}

// Update active navigation based on clicked link
function updateActiveNavigationFromLink(link) {
    console.log('[NAV] Updating active navigation from link');
    
    // Remove active class from all navigation items
    const navItems = document.querySelectorAll('.nav-dashboard, .nav-projects, .nav-revenue, .nav-writing, .nav-ai-library, .nav-resources, .nav-books');
    navItems.forEach(item => {
        if (item.classList.contains('active')) {
            console.log('[NAV] Removing active class from:', item.textContent.trim());
            item.classList.remove('active');
        }
    });
    
    // Determine which navigation class to use based on the link
    let navClass = '';
    
    if (link.classList.contains('nav-dashboard')) navClass = 'nav-dashboard';
    else if (link.classList.contains('nav-projects')) navClass = 'nav-projects';
    else if (link.classList.contains('nav-revenue')) navClass = 'nav-revenue';
    else if (link.classList.contains('nav-writing')) navClass = 'nav-writing';
    else if (link.classList.contains('nav-ai-library')) navClass = 'nav-ai-library';
    else if (link.classList.contains('nav-resources')) navClass = 'nav-resources';
    else if (link.classList.contains('nav-books')) navClass = 'nav-books';
    
    console.log('[NAV] Derived navigation class from link:', navClass);
    
    if (navClass) {
        // Add active class to the current navigation item
        const currentNavItems = document.querySelectorAll('.' + navClass);
        currentNavItems.forEach(item => {
            console.log('[NAV] Adding active class to:', item.textContent.trim());
            item.classList.add('active');
        });
    } else {
        console.log('[NAV] No matching navigation class found for link');
    }
}

// Performance monitoring
window.addEventListener('load', function() {
    console.log('[PERF] Window load event fired at', new Date().toISOString());
    
    // Report performance metrics
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domComplete - perfData.domLoading;
        
        console.log('[PERF] Page load time:', pageLoadTime, 'ms');
        console.log('[PERF] DOM ready time:', domReadyTime, 'ms');
        console.log('[PERF] DOM content loaded:', perfData.domContentLoadedEventEnd - perfData.navigationStart, 'ms');
        console.log('[PERF] First paint:', perfData.responseEnd - perfData.navigationStart, 'ms');
    } else {
        console.log('[PERF] Performance API not supported');
    }
    
    // Check if fonts are loaded
    if ('fonts' in document) {
        console.log('[PERF] Checking font loading status');
        document.fonts.ready.then(function() {
            console.log('[PERF] All fonts loaded at', new Date().toISOString());
        });
    }
}); 