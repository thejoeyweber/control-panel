/**
 * Template Processor
 * 
 * This script processes HTML templates and applies them to pages.
 * It handles loading the base template and replacing placeholders with page-specific content.
 */

class TemplateProcessor {
  /**
   * Initialize the template processor
   * @param {string} templatePath - Path to the template file
   */
  constructor(templatePath) {
    this.templatePath = templatePath;
    this.template = '';
    this.placeholders = {
      PAGE_TITLE: '',
      CSS_PATH: '',
      ROOT_PATH: '',
      JS_PATH: '',
      PAGE_CONTENT: '',
      EXTRA_HEAD: '',
      EXTRA_SCRIPTS: ''
    };
  }

  /**
   * Load the template from the specified path
   * @returns {Promise} - Promise that resolves when the template is loaded
   */
  async loadTemplate() {
    try {
      const response = await fetch(this.templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.status} ${response.statusText}`);
      }
      this.template = await response.text();
      return this.template;
    } catch (error) {
      console.error('Error loading template:', error);
      return null;
    }
  }

  /**
   * Set a placeholder value
   * @param {string} key - The placeholder key
   * @param {string} value - The value to replace the placeholder with
   */
  setPlaceholder(key, value) {
    if (this.placeholders.hasOwnProperty(key)) {
      this.placeholders[key] = value;
    } else {
      console.warn(`Unknown placeholder: ${key}`);
    }
  }

  /**
   * Apply the template with the current placeholder values
   * @returns {string} - The processed template
   */
  applyTemplate() {
    let result = this.template;
    
    // Replace all placeholders
    for (const [key, value] of Object.entries(this.placeholders)) {
      const placeholder = `<!-- ${key} -->`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return result;
  }

  /**
   * Process a page with the template
   * @param {Object} options - Options for processing the page
   * @param {string} options.title - The page title
   * @param {string} options.content - The page content
   * @param {string} options.cssPath - Path to CSS files (relative to the page)
   * @param {string} options.jsPath - Path to JS files (relative to the page)
   * @param {string} options.rootPath - Path to the root directory (relative to the page)
   * @param {string} options.extraHead - Additional content for the head section
   * @param {string} options.extraScripts - Additional scripts to include
   * @returns {string} - The processed page
   */
  processPage(options) {
    // Set placeholders based on options
    this.setPlaceholder('PAGE_TITLE', options.title || 'Untitled');
    this.setPlaceholder('PAGE_CONTENT', options.content || '');
    this.setPlaceholder('CSS_PATH', options.cssPath || '');
    this.setPlaceholder('JS_PATH', options.jsPath || '');
    this.setPlaceholder('ROOT_PATH', options.rootPath || '');
    this.setPlaceholder('EXTRA_HEAD', options.extraHead || '');
    this.setPlaceholder('EXTRA_SCRIPTS', options.extraScripts || '');
    
    // Apply the template
    return this.applyTemplate();
  }
}

// Export the TemplateProcessor class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateProcessor;
}

document.addEventListener('DOMContentLoaded', function() {
  // Set active navigation item based on current page
  setActiveNavItem();
});

/**
 * Sets the active navigation item based on the current page URL
 */
function setActiveNavItem() {
  const currentPath = window.location.pathname;
  
  // Remove active class from all nav items
  document.querySelectorAll('.site-nav a').forEach(link => {
    link.classList.remove('active', 'text-ink');
    link.classList.add('text-light-ink');
  });
  
  // Determine which nav item should be active
  let activeNavClass = 'nav-dashboard'; // Default
  
  if (currentPath.includes('/projects.html')) {
    activeNavClass = 'nav-projects';
  } else if (currentPath.includes('/revenue.html')) {
    activeNavClass = 'nav-revenue';
  } else if (currentPath.includes('/writing.html')) {
    activeNavClass = 'nav-writing';
  } else if (currentPath.includes('/ai-library.html')) {
    activeNavClass = 'nav-ai';
  } else if (currentPath.includes('/resources.html')) {
    activeNavClass = 'nav-resources';
  } else if (currentPath.includes('/books.html')) {
    activeNavClass = 'nav-books';
  } else if (currentPath.includes('/index.html') || currentPath.endsWith('/')) {
    activeNavClass = 'nav-dashboard';
  }
  
  // Set active class
  const activeNavItem = document.querySelector(`.${activeNavClass}`);
  if (activeNavItem) {
    activeNavItem.classList.remove('text-light-ink');
    activeNavItem.classList.add('active', 'text-ink');
  }
} 