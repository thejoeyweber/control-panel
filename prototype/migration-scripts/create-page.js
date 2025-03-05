/**
 * Create Page Script
 * 
 * This script creates a new page using the template system.
 * It's designed to be run from the command line with arguments for the page name and title.
 * 
 * Usage: node migration-scripts/create-page.js <page-name> <page-title>
 * Example: node migration-scripts/create-page.js tasks "Task Manager"
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
const pageName = args[0];
const pageTitle = args[1] || pageName.charAt(0).toUpperCase() + pageName.slice(1);

// Check if page name is provided
if (process.argv.length < 4) {
  console.log('Error: Missing required arguments');
  console.log('Usage: node migration-scripts/create-page.js <page-name> <page-title>');
  console.log('Example: node migration-scripts/create-page.js tasks "Task Manager"');
  process.exit(1);
}

// Configuration
const config = {
  templatePath: 'templates/base.html',
  pagesDir: 'pages',
  rootDir: '.'
};

/**
 * Main function to create a new page
 */
async function createPage() {
  console.log(`Creating new page: ${pageName} (${pageTitle})`);
  
  try {
    // Load template
    const template = fs.readFileSync(path.join(config.rootDir, config.templatePath), 'utf8');
    
    // Create page content
    const pageContent = `
<section class="mb-8">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">${pageTitle}</h1>
        <button class="btn btn-primary">
            <i class="ri-add-line mr-1"></i> Add New
        </button>
    </div>
    
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <p class="text-gray-600 mb-4">
            This is a new page created with the template system. You can customize it to fit your needs.
        </p>
        
        <div class="flex flex-wrap gap-4">
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Total Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Active Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">0</div>
                <div class="stat-label">Completed Items</div>
            </div>
        </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Example Item</h3>
                <span class="badge badge-primary">Active</span>
            </div>
            <div class="card-body">
                <p>This is an example item. You can add more items to this page.</p>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm btn-outline">Edit</button>
                <button class="btn btn-sm btn-danger">Delete</button>
            </div>
        </div>
    </div>
</section>
    `;
    
    // Apply template
    let processedTemplate = template;
    
    // Replace placeholders
    processedTemplate = processedTemplate.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle);
    processedTemplate = processedTemplate.replace(/\{\{CSS_PATH\}\}/g, '../css');
    processedTemplate = processedTemplate.replace(/\{\{JS_PATH\}\}/g, '../js');
    processedTemplate = processedTemplate.replace(/\{\{ROOT_PATH\}\}/g, '..');
    processedTemplate = processedTemplate.replace(/\{\{PAGE_CONTENT\}\}/g, pageContent);
    processedTemplate = processedTemplate.replace(/\{\{EXTRA_HEAD\}\}/g, '');
    processedTemplate = processedTemplate.replace(/\{\{EXTRA_SCRIPTS\}\}/g, '');
    
    // Create page file
    const pagePath = path.join(config.rootDir, config.pagesDir, `${pageName}.html`);
    
    // Check if file already exists
    if (fs.existsSync(pagePath)) {
      console.error(`Error: Page ${pageName}.html already exists`);
      process.exit(1);
    }
    
    // Write the processed template to the page file
    fs.writeFileSync(pagePath, processedTemplate);
    
    console.log(`Page created successfully: ${pagePath}`);
    console.log(`You can access it at: ${config.pagesDir}/${pageName}.html`);
    
    // Update navigation in main.js
    console.log('Note: You may need to update the navigation in main.js to include the new page.');
  } catch (error) {
    console.error('Error creating page:', error);
    process.exit(1);
  }
}

// Run the create page function
createPage(); 