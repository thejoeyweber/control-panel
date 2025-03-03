/**
 * Page Generator
 * 
 * This script uses the TemplateProcessor to generate pages from the base template.
 * It provides utilities for extracting content from existing pages and generating new ones.
 */

class PageGenerator {
  /**
   * Initialize the page generator
   * @param {string} templatePath - Path to the template file
   */
  constructor(templatePath = 'templates/base.html') {
    this.templateProcessor = new TemplateProcessor(templatePath);
    this.pages = [];
  }

  /**
   * Initialize the page generator
   * @returns {Promise} - Promise that resolves when the template is loaded
   */
  async init() {
    await this.templateProcessor.loadTemplate();
    return this;
  }

  /**
   * Extract content from an existing page
   * @param {string} pagePath - Path to the page
   * @returns {Promise<Object>} - Promise that resolves with the extracted content
   */
  async extractContent(pagePath) {
    try {
      const response = await fetch(pagePath);
      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract page title
      const title = doc.title.replace(' - Control Panel', '');
      
      // Extract main content
      const main = doc.querySelector('main');
      const content = main ? main.innerHTML : '';
      
      // Determine paths based on page location
      const isRoot = !pagePath.includes('/');
      const cssPath = isRoot ? '' : '../';
      const jsPath = isRoot ? '' : '../';
      const rootPath = isRoot ? '' : '../';
      
      return {
        title,
        content,
        cssPath,
        jsPath,
        rootPath,
        extraHead: '',
        extraScripts: ''
      };
    } catch (error) {
      console.error('Error extracting content:', error);
      return null;
    }
  }

  /**
   * Generate a page using the template
   * @param {Object} options - Options for generating the page
   * @returns {string} - The generated page HTML
   */
  generatePage(options) {
    return this.templateProcessor.processPage(options);
  }

  /**
   * Add a page to be generated
   * @param {string} outputPath - Path where the page will be saved
   * @param {Object} options - Options for generating the page
   */
  addPage(outputPath, options) {
    this.pages.push({
      outputPath,
      options
    });
  }

  /**
   * Generate all added pages
   * @returns {Promise<Array>} - Promise that resolves with the results of generating each page
   */
  async generateAllPages() {
    const results = [];
    
    for (const page of this.pages) {
      try {
        const html = this.generatePage(page.options);
        
        // In a real environment, we would save the file here
        // For now, we'll just log the output path
        console.log(`Generated page: ${page.outputPath}`);
        
        results.push({
          path: page.outputPath,
          success: true,
          html
        });
      } catch (error) {
        console.error(`Error generating page ${page.outputPath}:`, error);
        results.push({
          path: page.outputPath,
          success: false,
          error
        });
      }
    }
    
    return results;
  }
}

// Export the PageGenerator class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageGenerator;
} 