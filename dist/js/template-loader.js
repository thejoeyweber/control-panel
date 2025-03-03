/**
 * Template Loader
 * 
 * This script loads the template system and applies it to the current page.
 * It's designed to be included in all pages to ensure consistent layout and behavior.
 */

// Load dependencies
document.addEventListener('DOMContentLoaded', async function() {
  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Only load the template system in development mode
  if (isDevelopment) {
    try {
      // Load the template processor script
      await loadScript('js/template-processor.js');
      
      // Load the page generator script
      await loadScript('js/page-generator.js');
      
      // Load the page converter script
      await loadScript('js/page-converter.js');
      
      console.log('Template system loaded successfully');
    } catch (error) {
      console.error('Error loading template system:', error);
    }
  }
});

/**
 * Loads a script dynamically
 * @param {string} src - The source URL of the script
 * @returns {Promise} - Promise that resolves when the script is loaded
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Adjust the path based on the current page location
    const isRoot = !window.location.pathname.includes('/pages/');
    const adjustedSrc = isRoot ? src : `../${src}`;
    
    // Create script element
    const script = document.createElement('script');
    script.src = adjustedSrc;
    script.async = true;
    
    // Set up event handlers
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    // Add to document
    document.head.appendChild(script);
  });
}

/**
 * Applies the template to the current page
 * This is a placeholder function that would be used in a real implementation
 */
async function applyTemplate() {
  try {
    // Create a page converter
    const converter = new PageConverter();
    await converter.init();
    
    // Convert the current page
    const result = await converter.convertPage(window.location.pathname);
    
    if (result.success) {
      console.log('Page converted successfully');
      
      // In a real implementation, we would update the page content here
      // For now, we'll just log the HTML to the console
      console.log('Converted HTML:', result.html);
    } else {
      console.error('Failed to convert page');
    }
  } catch (error) {
    console.error('Error applying template:', error);
  }
} 