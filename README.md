# Control Panel

A personal dashboard for managing projects, revenue, writing, and resources with a clean, typewriter-inspired design using Tailwind CSS.

## Features

- Dashboard with overview of all key metrics
- Project management with status tracking
- Revenue tracking with charts
- Writing statistics and goals
- AI tools library
- Resource collection
- Book tracking

## Template System

This project uses a custom template system to ensure consistent layout and styling across all pages. The template system consists of several components:

### Base Template

The base template (`templates/base.html`) contains the common structure for all pages, including:

- Header with navigation
- Mobile-responsive menu
- Footer with dark mode toggle
- Consistent styling and layout

### Template Processor

The template processor (`js/template-processor.js`) is responsible for loading the base template and replacing placeholders with page-specific content. Placeholders include:

- `{{PAGE_TITLE}}` - The title of the page
- `{{CSS_PATH}}` - Path to CSS files
- `{{JS_PATH}}` - Path to JavaScript files
- `{{ROOT_PATH}}` - Path to the root directory
- `{{PAGE_CONTENT}}` - The main content of the page
- `{{EXTRA_HEAD}}` - Additional head content
- `{{EXTRA_SCRIPTS}}` - Additional scripts

### Page Generator

The page generator (`js/page-generator.js`) uses the template processor to generate pages from existing content. It extracts the content from existing pages and applies the template.

### Page Converter

The page converter (`js/page-converter.js`) is used to convert existing pages to use the template system. It's useful for migrating pages to the new template structure.

### Template Loader

The template loader (`js/template-loader.js`) is included in all pages to load the template system and apply it to the current page. It's designed to work in development mode only.

### Build Script

The build script (`js/build-pages.js`) is used to build all pages using the template system. It's designed to be run as a build step to generate the final HTML files.

### Conversion Process

The conversion process from the old structure to the template system involved:

1. Creating a base template with placeholders for content
2. Developing scripts to extract content from existing pages
3. Implementing a template processor to replace placeholders
4. Building a page generator for creating new pages
5. Creating a build system for production
6. Converting all existing pages to use the template system
7. Adding new pages (like Tasks) using the template system

The conversion ensures that all pages have a consistent layout and styling, making the application more maintainable and easier to extend with new features.

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development Workflow

1. Start the development server:

```bash
npm run dev
```

2. Edit the HTML, CSS, and JavaScript files as needed
3. The Tailwind CSS will be automatically compiled when changes are detected

### Creating New Pages

You can create new pages using the template system with the following command:

```bash
npm run create-page <page-name> "<page-title>"
```

For example:

```bash
npm run create-page tasks "Task Manager"
```

This will create a new page at `pages/tasks.html` with the title "Task Manager" using the base template.

### Converting Existing Pages

You can convert existing pages to use the template system with the following command:

```bash
npm run convert-pages [page1.html page2.html ...]
```

If no specific pages are provided, all pages will be converted. The converted pages will be placed in the `converted` directory.

For example:

```bash
npm run convert-pages index.html pages/projects.html
```

This will convert the specified pages to use the template system.

### Building for Production

1. Build the CSS:

```bash
npm run build
```

2. Build the pages using the template system:

```bash
npm run build:pages
```

3. Or build everything at once:

```bash
npm run build:all
```

The built files will be in the `dist` directory.

## Styling

This project uses Tailwind CSS for styling, with a custom configuration to match the typewriter-inspired design. The main styles are defined in:

- `css/tailwind.css` - The main Tailwind CSS file
- `css/main.css` - Custom styles that extend Tailwind
- `css/modal.css` - Styles for modal dialogs

## JavaScript

The main JavaScript files are:

- `js/main.js` - Main JavaScript file with core functionality
- `js/template-processor.js` - Template processor
- `js/page-generator.js` - Page generator
- `js/page-converter.js` - Page converter
- `js/template-loader.js` - Template loader
- `js/build-pages.js` - Build script

## License

MIT

## Design System

The Control Panel uses a typewriter + paper + clean/modern design aesthetic, implemented with Tailwind CSS.

### Key Design Elements

- **Typewriter Font**: Special Elite font for headings and key elements
- **Paper Texture**: Subtle paper texture background for cards and widgets
- **Clean Layout**: Modern, clean layout with appropriate spacing
- **Responsive Design**: Mobile-first approach with responsive breakpoints

## CSS Migration

The project has been migrated from custom CSS to Tailwind CSS. The migration involved:

1. Setting up Tailwind CSS configuration
2. Converting custom CSS classes to Tailwind utility classes
3. Maintaining the typewriter + paper + clean/modern design aesthetic
4. Implementing responsive design with Tailwind's responsive utilities
5. Creating component classes for reusable elements

### Custom Components

Some custom components have been created in the `tailwind.css` file using Tailwind's `@layer components` directive:

- Widget component
- Card component
- Button component
- Badge component
- Form controls
- Progress bar
- Stat card
- Navigation

### Dark Mode

Dark mode is implemented using Tailwind's `dark:` variant and the `class` strategy. The dark mode can be toggled using JavaScript.

## File Structure

- `index.html`: Main dashboard page
- `pages/`: Individual pages for different sections
- `css/`: CSS files
  - `styles.css`: Compiled CSS
  - `tailwind.css`: Tailwind directives and custom components
  - `main.css`: Custom styles that can't be easily replaced with Tailwind
  - `modal.css`: Modal component styles
  - `normalize.css`: CSS normalization
- `js/`: JavaScript files
  - `main.js`: Main JavaScript functionality
- `img/`: Images and assets

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Build for production: `npm run build`

## Dependencies

- Tailwind CSS
- PostCSS
- Autoprefixer
- Remix Icon (for icons)
- Special Elite font (Google Fonts)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
controlpanel/
├── css/
│   ├── normalize.css    # CSS reset
│   └── main.css         # Main styles
├── js/
│   └── main.js          # Main JavaScript functionality
├── img/                 # Images directory
├── assets/              # Other assets
│   └── icons/           # Custom icons
├── pages/               # Internal pages
│   ├── projects.html
│   ├── revenue.html
│   ├── writing.html
│   ├── ai-library.html
│   ├── resources.html
│   └── books.html
└── index.html           # Main dashboard
```

## Customization

### Theming

The project uses CSS variables for easy theming. Modify the color scheme in `css/main.css`:

```css
:root {
  /* Colors */
  --color-primary: #3498db;
  --color-primary-dark: #2980b9;
  /* ... other colors ... */
}
```

### Dark Mode

The application includes a built-in dark mode that can be toggled using the moon icon in the header.

## Design System Updates

The Control Panel has been refactored to use Tailwind CSS as its design system foundation. This update provides:

- Consistent design tokens across all pages
- Improved responsive behavior
- Better mobile experience with a hamburger menu
- Streamlined component styling
- Reduced CSS file size and complexity

### How to Use

The project now uses:
- Tailwind CSS for styling
- A component-based approach with reusable classes
- Dark mode support via the `dark:` variants

To make changes to the design:

1. Edit the `tailwind.config.js` file to update design tokens
2. Modify the custom components in `css/tailwind.css`
3. Run `npm run build` to compile the CSS
4. Run `npm run watch` during development for live updates

### Key Components

The design system includes the following components:

- **Layout**: `.main-container`, `.site-header`, `.site-nav`
- **Cards**: `.card`, `.widget`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, etc.
- **Forms**: `.form-control`, `.form-label`, `.form-group`
- **Utilities**: `.grid-dashboard`, `.flex-center`, `.flex-between`, etc.

The mobile menu is now fully responsive with a hamburger button that triggers a slide-in menu on smaller screens.

## Development Roadmap

### Phase 1: Basic Structure
- [x] Dashboard layout
- [x] Navigation
- [x] Projects page
- [ ] Revenue tracking
- [ ] Writing & publishing

### Phase 2: Enhanced Features
- [ ] AI prompt library
- [ ] Resource directory
- [ ] Book inventory

### Phase 3: Advanced Functionality
- [ ] Data persistence
- [ ] Export/import functionality
- [ ] API integrations

## License

This project is for personal use only.

## Acknowledgements

- [Remix Icon](https://remixicon.com/) for the icon library
- [Normalize.css](https://necolas.github.io/normalize.css/) for CSS reset

## Technical Details

### CSS Architecture

This project uses Tailwind CSS for styling with a focus on:

1. **Typewriter/Paper Design**: Clean, paper-like aesthetic with typewriter fonts
2. **Component-Based Styling**: Reusable components like cards, buttons, and badges
3. **Responsive Design**: Mobile-first approach with responsive layouts
4. **Dark Mode Support**: Full dark mode implementation

### Mobile Navigation

The mobile navigation system has been implemented with the following features:

1. **Consistent Behavior**: The mobile menu works consistently across all pages
2. **Smooth Transitions**: Animated hamburger button and menu transitions
3. **Backdrop**: Click-away functionality with a semi-transparent backdrop
4. **Scroll Lock**: Prevents background scrolling when the menu is open
5. **Responsive Adjustments**: Automatically adapts to screen size changes

### JavaScript Components

- **Mobile Menu**: Handles the responsive navigation menu
- **Dark Mode Toggle**: Allows users to switch between light and dark modes
- **Book View Toggle**: Switches between grid and list views on the Books page
- **Chart Placeholders**: Simple chart visualizations for data

## Development

### Prerequisites

- Node.js and npm

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Development Commands

- **Development mode**: Run Tailwind in watch mode
  ```
  npm run dev
  ```

- **Build for production**: Generate minified CSS
  ```
  npm run build
  ``` #   c o n t r o l - p a n e l  
 