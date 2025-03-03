/**
 * Page Converter
 * 
 * This script helps convert existing pages to use the template system.
 * It extracts content from existing pages and generates new ones using the template.
 */

// Import dependencies
// Note: In a browser environment, these would be loaded via script tags
const TemplateProcessor = window.TemplateProcessor || (typeof require !== 'undefined' ? require('./template-processor') : null);
const PageGenerator = window.PageGenerator || (typeof require !== 'undefined' ? require('./page-generator') : null);

class PageConverter {
  /**
   * Initialize the page converter
   * @param {string} templatePath - Path to the template file
   */
  constructor(templatePath = 'templates/base.html') {
    this.pageGenerator = new PageGenerator(templatePath);
    this.pagesToConvert = [];
  }

  /**
   * Initialize the page converter
   * @returns {Promise} - Promise that resolves when initialization is complete
   */
  async init() {
    await this.pageGenerator.init();
    return this;
  }

  /**
   * Add a page to be converted
   * @param {string} pagePath - Path to the page to convert
   */
  addPage(pagePath) {
    this.pagesToConvert.push(pagePath);
  }

  /**
   * Convert all added pages
   * @returns {Promise<Array>} - Promise that resolves with the results of converting each page
   */
  async convertAllPages() {
    const results = [];
    
    for (const pagePath of this.pagesToConvert) {
      try {
        // Extract content from the existing page
        const options = await this.pageGenerator.extractContent(pagePath);
        
        if (!options) {
          throw new Error(`Failed to extract content from ${pagePath}`);
        }
        
        // Generate the new page
        const html = this.pageGenerator.generatePage(options);
        
        // In a real environment, we would save the file here
        // For now, we'll just log the output path
        console.log(`Converted page: ${pagePath}`);
        
        results.push({
          path: pagePath,
          success: true,
          html
        });
      } catch (error) {
        console.error(`Error converting page ${pagePath}:`, error);
        results.push({
          path: pagePath,
          success: false,
          error
        });
      }
    }
    
    return results;
  }

  /**
   * Convert a specific page
   * @param {string} pagePath - Path to the page to convert
   * @returns {Promise<Object>} - Promise that resolves with the result of converting the page
   */
  async convertPage(pagePath) {
    try {
      // Extract content from the existing page
      const options = await this.pageGenerator.extractContent(pagePath);
      
      if (!options) {
        throw new Error(`Failed to extract content from ${pagePath}`);
      }
      
      // Generate the new page
      const html = this.pageGenerator.generatePage(options);
      
      // In a real environment, we would save the file here
      // For now, we'll just log the output path
      console.log(`Converted page: ${pagePath}`);
      
      return {
        path: pagePath,
        success: true,
        html
      };
    } catch (error) {
      console.error(`Error converting page ${pagePath}:`, error);
      return {
        path: pagePath,
        success: false,
        error
      };
    }
  }
}

// Export the PageConverter class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageConverter;
}

// Initialize the converter when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  // Create a button to convert the current page
  const convertButton = document.createElement('button');
  convertButton.textContent = 'Convert Page to Template';
  convertButton.className = 'fixed bottom-4 right-4 bg-highlight text-white px-4 py-2 rounded shadow-lg z-50';
  convertButton.style.display = 'none'; // Hide by default
  
  // Only show in development mode
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    convertButton.style.display = 'block';
  }
  
  // Add click event listener
  convertButton.addEventListener('click', async function() {
    try {
      const converter = new PageConverter();
      await converter.init();
      
      const result = await converter.convertPage(window.location.pathname);
      
      if (result.success) {
        // Show success message
        alert('Page converted successfully! Check the console for details.');
        
        // Log the HTML to the console
        console.log('Converted HTML:', result.html);
      } else {
        // Show error message
        alert('Failed to convert page. Check the console for details.');
      }
    } catch (error) {
      console.error('Error converting page:', error);
      alert('An error occurred while converting the page. Check the console for details.');
    }
  });
  
  // Add the button to the page
  document.body.appendChild(convertButton);
}); 