/**
 * Build Script
 * 
 * This script runs the build process for the Control Panel application.
 * It builds the CSS using Tailwind and then builds the pages using the template system.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  outputDir: 'dist',
  cssDir: 'css',
  jsDir: 'js',
  pagesDir: 'pages',
  templatesDir: 'templates'
};

/**
 * Main function to run the build process
 */
async function build() {
  console.log('Starting build process...');
  
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Build CSS
    console.log('Building CSS...');
    execSync('npx tailwindcss -i ./css/tailwind.css -o ./css/styles.css --minify', { stdio: 'inherit' });
    
    // Copy CSS to output directory
    console.log('Copying CSS to output directory...');
    copyDirectory(config.cssDir, path.join(config.outputDir, config.cssDir));
    
    // Copy JS to output directory
    console.log('Copying JS to output directory...');
    copyDirectory(config.jsDir, path.join(config.outputDir, config.jsDir));
    
    // Build pages
    console.log('Building pages...');
    require('./js/build-pages');
    
    // Copy other assets
    console.log('Copying other assets...');
    copyFile('favicon.ico', path.join(config.outputDir, 'favicon.ico'));
    
    console.log('Build process completed successfully!');
  } catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
  }
}

/**
 * Copy a directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 */
function copyDirectory(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Get all files in the source directory
  const files = fs.readdirSync(src);
  
  // Copy each file
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    // Check if it's a directory or a file
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      // Recursively copy directory
      copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Copy a file
 * @param {string} src - Source file
 * @param {string} dest - Destination file
 */
function copyFile(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  } catch (error) {
    console.error(`Error copying file ${src} to ${dest}:`, error);
  }
}

// Run the build process
build(); 