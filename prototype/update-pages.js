/**
 * HTML Page Optimizer Script
 * 
 * This script processes all HTML pages in the 'pages' directory to remove
 * repeated elements like headers, navigation, and footers, leaving only
 * the main content section. This optimizes the codebase for token efficiency
 * when working with LLMs.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const config = {
  pagesDir: 'pages',
  processedFileCount: 0,
  failedFileCount: 0
};

/**
 * Main function to optimize all pages
 */
async function optimizePages() {
  console.log('Starting page optimization process...');
  
  try {
    // Get all HTML files in the pages directory
    const pages = fs.readdirSync(config.pagesDir)
      .filter(file => file.endsWith('.html'));
    
    console.log(`Found ${pages.length} HTML files to process.`);
    
    // Process each page
    for (const page of pages) {
      const pagePath = path.join(config.pagesDir, page);
      await optimizePage(pagePath, page);
    }
    
    console.log(`\nPage optimization completed: ${config.processedFileCount} files processed successfully, ${config.failedFileCount} files failed.`);
  } catch (error) {
    console.error('Error during page optimization process:', error);
  }
}

/**
 * Optimize a single page
 * @param {string} filePath - Path to the HTML file
 * @param {string} fileName - Name of the file
 */
async function optimizePage(filePath, fileName) {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the HTML
    const dom = new JSDOM(fileContent);
    const document = dom.window.document;
    
    // Extract the main content
    const mainElement = document.querySelector('main');
    
    if (!mainElement) {
      console.error(`No <main> element found in ${fileName}. Skipping file.`);
      config.failedFileCount++;
      return;
    }
    
    // Get the page title
    const titleElement = document.querySelector('title');
    const pageTitle = titleElement ? titleElement.textContent : fileName.replace('.html', '');
    
    // Format the title for the minimized HTML
    const formattedTitle = pageTitle.replace(' - Control Panel', '');
    
    // Extract any page-specific scripts (not including src scripts)
    let pageScripts = '';
    const inlineScripts = document.querySelectorAll('body > script:not([src])');
    if (inlineScripts.length > 0) {
      Array.from(inlineScripts).forEach(script => {
        pageScripts += script.outerHTML + '\n';
      });
    }
    
    // Create the minimized HTML
    const minimizedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formattedTitle} - Control Panel</title>
</head>
<body>
    ${mainElement.outerHTML}
    
    ${pageScripts}
</body>
</html>`;
    
    // Write the minimized HTML back to the file
    fs.writeFileSync(filePath, minimizedHTML);
    
    console.log(`✓ Optimized: ${fileName}`);
    config.processedFileCount++;
  } catch (error) {
    console.error(`Error optimizing ${fileName}:`, error);
    config.failedFileCount++;
  }
}

// Run the optimization process
optimizePages(); 