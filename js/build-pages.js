/**
 * Build Pages Script
 * 
 * This script builds all pages using the template system.
 * It's designed to be run as a build step to generate the final HTML files.
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const config = {
  templatePath: 'templates/base.html',
  pagesDir: 'pages',
  outputDir: 'dist',
  rootDir: '.'
};

/**
 * Main function to build all pages
 */
async function buildPages() {
  console.log('Building pages...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Load template
    const template = fs.readFileSync(path.join(config.rootDir, config.templatePath), 'utf8');
    
    // Build index page
    await buildPage('index.html', template, '');
    
    // Get all pages in pages directory
    const pages = fs.readdirSync(path.join(config.rootDir, config.pagesDir))
      .filter(file => file.endsWith('.html'));
    
    // Build each page
    for (const page of pages) {
      // Get the page name without extension
      const pageName = page.replace('.html', '');
      
      // Create directory for clean URL if it doesn't exist
      const pageDir = path.join(config.outputDir, pageName);
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }
      
      // Build the page with clean URL structure
      await buildPage(page, template, config.pagesDir, pageName);
      
      // Also create a redirect from /pages/pagename.html to /pagename/
      createRedirect(path.join(config.outputDir, config.pagesDir, page), `/${pageName}/`);
    }
    
    console.log('All pages built successfully!');
  } catch (error) {
    console.error('Error building pages:', error);
  }
}

/**
 * Build a single page
 * @param {string} pageName - The name of the page file
 * @param {string} template - The template HTML
 * @param {string} pageDir - The directory containing the page
 * @param {string} cleanUrlPath - The clean URL path for the page (without extension)
 */
async function buildPage(pageName, template, pageDir, cleanUrlPath = null) {
  try {
    // Determine input path
    const inputPath = path.join(config.rootDir, pageDir, pageName);
    
    // Determine output path based on clean URL structure
    let outputPath;
    let relativePath;
    
    if (cleanUrlPath) {
      // For pages other than index, use clean URL structure
      outputPath = path.join(config.outputDir, cleanUrlPath, 'index.html');
      relativePath = '../';
    } else {
      // For index page, keep at root
      outputPath = path.join(config.outputDir, pageName);
      relativePath = '';
    }
    
    console.log(`Building ${inputPath} -> ${outputPath}`);
    
    // Read the page content
    const pageContent = fs.readFileSync(inputPath, 'utf8');
    
    // Extract page title and content
    const { title, content } = extractContent(pageContent, pageName);
    
    // Ensure the page title matches the expected page name
    const expectedTitle = cleanUrlPath ? 
      cleanUrlPath.charAt(0).toUpperCase() + cleanUrlPath.slice(1) : 
      'Dashboard';
    
    // If there's a mismatch between the page title and expected title, log a warning
    if (title !== expectedTitle) {
      console.warn(`Title mismatch: Expected "${expectedTitle}" but got "${title}" for ${pageName}`);
    }
    
    // Apply template
    let processedTemplate = template;
    
    // Replace placeholders
    processedTemplate = processedTemplate.replace('{{PAGE_TITLE}}', title || expectedTitle);
    processedTemplate = processedTemplate.replace('{{CSS_PATH}}', `${relativePath}css`);
    processedTemplate = processedTemplate.replace('{{JS_PATH}}', `${relativePath}js`);
    processedTemplate = processedTemplate.replace('{{ROOT_PATH}}', relativePath ? relativePath.slice(0, -1) : '.');
    processedTemplate = processedTemplate.replace('{{PAGE_CONTENT}}', content);
    processedTemplate = processedTemplate.replace('{{EXTRA_HEAD}}', '');
    processedTemplate = processedTemplate.replace('{{EXTRA_SCRIPTS}}', '');
    
    // Set active navigation item based on page
    const pageType = cleanUrlPath || (pageName === 'index.html' ? 'dashboard' : pageName.replace('.html', ''));
    
    // Replace Handlebars-style conditionals with actual active classes
    processedTemplate = processedTemplate.replace(new RegExp(`{{#if active\\.${pageType}}}active{{/if}}`, 'g'), 'active');
    processedTemplate = processedTemplate.replace(/{{#if active\.[^}]+}}active{{\/if}}/g, '');
    
    // Make sure all placeholders are replaced (including in navigation links)
    processedTemplate = replaceTemplatePlaceholders(processedTemplate, relativePath);
    
    // Write the processed template to the output file
    fs.writeFileSync(outputPath, processedTemplate);
    
    console.log(`Built ${pageName}`);
  } catch (error) {
    console.error(`Error building ${pageName}:`, error);
  }
}

/**
 * Extract title and content from a page
 * @param {string} html - The HTML content of the page
 * @param {string} pageName - The name of the page file
 * @returns {Object} - Object containing title and content
 */
function extractContent(html, pageName) {
  try {
    // Parse HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Extract title
    let title = '';
    const titleElement = document.querySelector('title');
    if (titleElement) {
      title = titleElement.textContent.replace(' - Control Panel', '');
    }
    
    // Extract main content
    let content = '';
    const mainElement = document.querySelector('main');
    if (mainElement) {
      // Get the main content directly from the source page
      content = mainElement.innerHTML;
      
      // Log the content extraction for debugging
      console.log(`Extracted content for ${pageName}. Content length: ${content.length} bytes`);
      
      // Verify content matches the expected page
      const h1Element = mainElement.querySelector('h1');
      if (h1Element) {
        const h1Text = h1Element.textContent.trim();
        console.log(`Page: "${pageName}", H1 text: "${h1Text}"`);
      }
    } else {
      console.error(`No main element found in ${pageName}`);
    }
    
    return { title, content };
  } catch (error) {
    console.error('Error extracting content:', error);
    return { title: '', content: '' };
  }
}

/**
 * Add a function to replace template placeholders in the HTML
 * @param {string} html - The HTML content
 * @param {string} relativePath - The relative path to the root directory
 * @returns {string} - The HTML with placeholders replaced
 */
function replaceTemplatePlaceholders(html, relativePath = '.') {
  // Fix navigation links for pages in subdirectories
  if (relativePath === '../') {
    return html
      .replace(/\{\{ROOT_PATH\}\}/g, '..')
      .replace(/\{\{PAGE_TITLE\}\}/g, 'Control Panel')
      .replace(/\{\{CSS_PATH\}\}/g, '../css')
      .replace(/\{\{JS_PATH\}\}/g, '../js')
      .replace(/href="\.\/pages\//g, 'href="../'); // Fix links to other pages from a page
  } else {
    return html
      .replace(/\{\{ROOT_PATH\}\}/g, '.')
      .replace(/\{\{PAGE_TITLE\}\}/g, 'Control Panel')
      .replace(/\{\{CSS_PATH\}\}/g, 'css')
      .replace(/\{\{JS_PATH\}\}/g, 'js');
  }
}

/**
 * Creates a simple HTML redirect file
 * @param {string} filePath - Path to create the redirect file
 * @param {string} targetUrl - URL to redirect to
 */
function createRedirect(filePath, targetUrl) {
  // Make sure the directory exists
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create a simple HTML redirect
  const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${targetUrl}">
  <title>Redirecting...</title>
</head>
<body>
  <script>
    window.location.href = "${targetUrl}";
  </script>
  <p>If you are not redirected automatically, follow this <a href="${targetUrl}">link</a>.</p>
</body>
</html>
  `;
  
  fs.writeFileSync(filePath, redirectHtml);
}

// Run the build process
buildPages(); 