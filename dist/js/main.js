/**
 * Main JavaScript file for the Control Panel application
 * Centralized client-side functionality for all pages
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[MAIN] DOMContentLoaded fired at', new Date().toISOString());
    console.log('[MAIN] Current URL:', window.location.href);
    console.log('[MAIN] Current pathname:', window.location.pathname);
    console.log('[MAIN] Document readyState:', document.readyState);
    
    // Initialize application features
    initApp();
    
    console.log('[MAIN] Initialization complete');
});

/**
 * Initialize all application features
 */
function initApp() {
    // Core functionality
    initMobileMenu();
    setActiveNavItem();
    setupSmoothPageTransitions();
    
    // Page-specific functionality (will only run if elements exist)
    initializeCharts();
    setupBookViewToggle();
    setupPromptViewToggle();
}

/**
 * Initializes charts if they exist on the page
 */
function initializeCharts() {
    const revenueChartElement = document.getElementById('revenue-chart');
    if (revenueChartElement) {
        console.log('[CHARTS] Initializing revenue chart');
        createPlaceholderChart('revenue-chart', [30, 40, 45, 50, 49, 60, 70, 91, 125]);
    }
    
    const wordCountChartElement = document.getElementById('word-count-chart');
    if (wordCountChartElement) {
        console.log('[CHARTS] Initializing word count chart');
        createPlaceholderChart('word-count-chart', [120, 115, 130, 100, 75, 90, 95]);
    }
}

/**
 * Set active navigation item based on current URL
 */
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

/**
 * Initialize mobile menu functionality
 */
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
    
    if (!gridViewButton || !listViewButton || !gridBooks || !listBooks) {
        console.log('[BOOKS] Book view toggle elements not found');
        return;
    }
    
    console.log('[BOOKS] Setting up book view toggle');
    
    // Set initial active state
    gridViewButton.classList.add('bg-gray-200', 'dark:bg-gray-700');
    
    gridViewButton.addEventListener('click', () => {
        setActiveViewToggle(gridViewButton, listViewButton, 'grid');
        
        // Show grid view, hide list view
        gridBooks.classList.remove('hidden');
        listBooks.classList.add('hidden');
    });
    
    listViewButton.addEventListener('click', () => {
        setActiveViewToggle(listViewButton, gridViewButton, 'list');
        
        // Show list view, hide grid view
        listBooks.classList.remove('hidden');
        gridBooks.classList.add('hidden');
    });
}

/**
 * Sets up prompt view toggle functionality for the AI Library
 */
function setupPromptViewToggle() {
    const gridView = document.querySelector('.prompt-grid-view');
    const listView = document.querySelector('.prompt-list-view');
    const promptGrid = document.querySelector('.prompt-grid');
    const promptList = document.querySelector('.prompt-list');
    
    if (!gridView || !listView || !promptGrid || !promptList) {
        console.log('[PROMPTS] Prompt view toggle elements not found');
        return;
    }
    
    console.log('[PROMPTS] Setting up prompt view toggle');
    
    // Set initial active state
    gridView.classList.add('bg-gray-200', 'dark:bg-gray-700');
    
    gridView.addEventListener('click', () => {
        setActiveViewToggle(gridView, listView, 'grid');
        
        // Show grid view, hide list view
        promptGrid.classList.remove('hidden');
        promptList.classList.add('hidden');
    });
    
    listView.addEventListener('click', () => {
        setActiveViewToggle(listView, gridView, 'list');
        
        // Show list view, hide grid view
        promptList.classList.remove('hidden');
        promptGrid.classList.add('hidden');
    });
}

/**
 * Set active view toggle (helper function)
 * @param {Element} activeButton - The button to make active
 * @param {Element} inactiveButton - The button to make inactive
 * @param {string} viewMode - The view mode ('grid' or 'list')
 */
function setActiveViewToggle(activeButton, inactiveButton, viewMode) {
    // Update button states
    activeButton.classList.add('bg-gray-200', 'dark:bg-gray-700');
    inactiveButton.classList.remove('bg-gray-200', 'dark:bg-gray-700');
    
    console.log(`[VIEW] Switched to ${viewMode} view`);
}

/**
 * Creates a placeholder chart for demonstration purposes
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
    
    // Draw chart background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, width, height);
    
    // Draw chart grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const y = height / 5 * i;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();
    
    // Draw chart line
    ctx.strokeStyle = '#4361ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
        const x = width / (data.length - 1) * i;
        const y = height - (data[i] / maxValue) * height * 0.9;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#4361ee';
    for (let i = 0; i < data.length; i++) {
        const x = width / (data.length - 1) * i;
        const y = height - (data[i] / maxValue) * height * 0.9;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * Sets up smooth page transitions
 */
function setupSmoothPageTransitions() {
    console.log('[TRANSITIONS] Setting up smooth page transitions');
    
    // Get all internal links
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"], a[href^="index.html"], a[href^="pages/"]');
    
    internalLinks.forEach(link => {
        // Skip links with target="_blank" or download attribute
        if (link.target === '_blank' || link.hasAttribute('download')) return;
        
        link.addEventListener('click', handleLinkClick);
    });
}

/**
 * Handle link click for smooth page transitions
 * @param {Event} event - The click event
 */
function handleLinkClick(event) {
    // Skip if modifier keys are pressed (user might want to open in new tab)
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    
    const href = this.getAttribute('href');
    
    // Skip if it's an anchor link
    if (href.startsWith('#')) return;
    
    // Prevent default navigation
    event.preventDefault();
    
    console.log('[TRANSITIONS] Link clicked:', href);
    
    // Update active navigation before transition
    updateActiveNavigationFromLink(this);
    
    // Add a transition effect
    document.body.classList.add('page-transition');
    
    // Navigate after a short delay
    setTimeout(() => {
        window.location.href = href;
    }, 300);
}

/**
 * Updates active navigation items based on the clicked link
 * @param {Element} link - The clicked link element
 */
function updateActiveNavigationFromLink(link) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-dashboard, .nav-projects, .nav-revenue, .nav-writing, .nav-ai-library, .nav-resources, .nav-books')
        .forEach(item => item.classList.remove('active'));
    
    // Try to add active class to the clicked nav item
    if (link.classList.contains('nav-dashboard') || 
        link.classList.contains('nav-projects') || 
        link.classList.contains('nav-revenue') || 
        link.classList.contains('nav-writing') || 
        link.classList.contains('nav-ai-library') || 
        link.classList.contains('nav-resources') || 
        link.classList.contains('nav-books')) {
        
        link.classList.add('active');
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