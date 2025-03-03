/**
 * Convert Pages Script
 * 
 * This script converts existing pages to use the template system.
 * It's designed to be run from the command line with optional arguments for specific pages.
 * 
 * Usage: node js/convert-pages.js [page1.html page2.html ...]
 * Example: node js/convert-pages.js index.html pages/projects.html
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Get command line arguments
const args = process.argv.slice(2);

// Configuration
const config = {
  templatePath: 'templates/base.html',
  pagesDir: 'pages',
  rootDir: '.',
  outputDir: 'converted'
};

/**
 * Main function to convert pages
 */
async function convertPages() {
  console.log('Converting pages to use template system...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Create pages directory in output directory if it doesn't exist
    const outputPagesDir = path.join(config.outputDir, config.pagesDir);
    if (!fs.existsSync(outputPagesDir)) {
      fs.mkdirSync(outputPagesDir, { recursive: true });
    }
    
    // Load template
    const template = fs.readFileSync(path.join(config.rootDir, config.templatePath), 'utf8');
    
    // If no specific pages are provided, convert all pages
    if (args.length === 0) {
      // Convert index page
      await convertPage('index.html', template);
      
      // Get all pages in pages directory
      const pages = fs.readdirSync(path.join(config.rootDir, config.pagesDir))
        .filter(file => file.endsWith('.html'));
      
      // Convert each page
      for (const page of pages) {
        await convertPage(path.join(config.pagesDir, page), template);
      }
    } else {
      // Convert specific pages
      for (const page of args) {
        await convertPage(page, template);
      }
    }
    
    console.log('All pages converted successfully!');
  } catch (error) {
    console.error('Error converting pages:', error);
  }
}

/**
 * Convert a single page
 * @param {string} pagePath - The path of the page to convert
 * @param {string} template - The template HTML
 */
async function convertPage(pagePath, template) {
  try {
    // Determine input and output paths
    const inputPath = path.join(config.rootDir, pagePath);
    const outputPath = path.join(config.outputDir, pagePath);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log(`Converting ${inputPath} -> ${outputPath}`);
    
    // Read the page content
    const pageContent = fs.readFileSync(inputPath, 'utf8');
    
    // Extract page title and content
    const { title, content } = extractContent(pageContent);
    
    // Determine relative paths
    const isInPagesDir = pagePath.includes(config.pagesDir);
    const relativePath = isInPagesDir ? '../' : '';
    const rootPath = isInPagesDir ? '..' : '.';
    
    // Apply template
    let processedTemplate = template;
    
    // Replace placeholders
    processedTemplate = processedTemplate.replace(/\{\{PAGE_TITLE\}\}/g, title);
    processedTemplate = processedTemplate.replace(/\{\{CSS_PATH\}\}/g, `${relativePath}css`);
    processedTemplate = processedTemplate.replace(/\{\{JS_PATH\}\}/g, `${relativePath}js`);
    processedTemplate = processedTemplate.replace(/\{\{ROOT_PATH\}\}/g, rootPath);
    processedTemplate = processedTemplate.replace(/\{\{PAGE_CONTENT\}\}/g, content);
    processedTemplate = processedTemplate.replace(/\{\{EXTRA_HEAD\}\}/g, '');
    processedTemplate = processedTemplate.replace(/\{\{EXTRA_SCRIPTS\}\}/g, '');
    
    // Write the processed template to the output file
    fs.writeFileSync(outputPath, processedTemplate);
    
    console.log(`Converted ${pagePath}`);
  } catch (error) {
    console.error(`Error converting ${pagePath}:`, error);
  }
}

/**
 * Extract title and content from a page
 * @param {string} html - The HTML content of the page
 * @returns {Object} - Object containing title and content
 */
function extractContent(html) {
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
      content = mainElement.innerHTML;
    }
    
    return { title, content };
  } catch (error) {
    console.error('Error extracting content:', error);
    return { title: '', content: '' };
  }
}

// Run the convert pages function
convertPages(); 