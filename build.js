/**
 * Build Script
 * 
 * This script runs the main build process for the Control Panel application.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration - centralized config for the entire build process
const config = {
  outputDir: 'dist',
  cssDir: 'css',
  jsDir: 'js',
  pagesDir: 'pages',
  templatesDir: 'templates',
  assetsDir: 'assets',
  imgDir: 'img',
  templatePath: 'templates/base.html'
};

// Export the config for other scripts to use
exports.config = config;

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
    console.log('Building pages using template system...');
    // We use require here to load the build-pages module and run it
    require('./js/build-pages');
    
    // Copy asset directories
    console.log('Copying assets...');
    if (fs.existsSync(config.assetsDir)) {
      copyDirectory(config.assetsDir, path.join(config.outputDir, config.assetsDir));
    }
    
    console.log('Copying images...');
    if (fs.existsSync(config.imgDir)) {
      copyDirectory(config.imgDir, path.join(config.outputDir, config.imgDir));
    }
    
    // Copy other assets
    console.log('Copying other assets...');
    if (fs.existsSync('favicon.ico')) {
      copyFile('favicon.ico', path.join(config.outputDir, 'favicon.ico'));
    }
    
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

// Export utility functions for use in other build scripts
exports.copyDirectory = copyDirectory;
exports.copyFile = copyFile;

// Run the build process if this script is executed directly
if (require.main === module) {
  build();
} 