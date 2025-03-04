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

This project uses a custom template system to ensure consistent layout and styling across all pages.

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

## Project Structure

```
controlpanel/
├── dist/                  # Production build output
├── pages/                 # HTML pages
│   ├── projects.html
│   ├── revenue.html
│   └── ...
├── css/
│   ├── tailwind.css       # Tailwind directives + custom styles
│   └── styles.css         # Compiled output
├── js/
│   ├── build-pages.js     # Build script for pages
│   ├── main.js            # Core frontend logic
│   ├── template-processor.js # Template processor
│   └── create-page.js     # Utility to create new pages
├── templates/
│   └── base.html          # Base template
├── assets/                # Static assets
├── img/                   # Images
├── index.html             # Main entry point
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind configuration
└── README.md              # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Development

To run the development server:

```bash
npm run dev
```

This will start the Tailwind CSS watcher to compile your CSS in real-time.

### Creating a New Page

To create a new page:

```bash
npm run create-page <page-name> "Page Title"
```

Example:
```bash
npm run create-page tasks "Task Manager"
```

### Building for Production

To build for production:

```bash
npm run build:all
```

This will:
1. Build and minify the CSS
2. Generate all pages using the template system
3. Copy all necessary assets to the dist folder

## Styling

The project uses Tailwind CSS for styling, with custom components defined in `css/tailwind.css`. The styling follows a typewriter-inspired design system with a paper aesthetic.

### Color Scheme

- Paper: Light slate grey/blue tint (`#f0f4f8`)
- Ink: Dark grey (`#333333`) 
- Light ink: Medium grey (`#777777`)
- Highlight: Blue (`#4361ee`)
- Success: Green (`#4ade80`)
- Warning: Yellow (`#fbbf24`) 
- Danger: Red (`#f87171`)

### Custom Components

Custom components are defined using Tailwind's `@layer components` directive. These include:

- `.card` - Card containers
- `.widget` - Dashboard widgets
- `.btn`, `.btn-primary`, etc. - Button styles
- `.form-control` - Form elements

### Dark Mode

Dark mode is supported using Tailwind's dark mode feature and custom CSS variables. Toggle in the footer.

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
  ```
