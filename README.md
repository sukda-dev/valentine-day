# NIVAC Starter Template

Static web starter template based on **Gulp 5**, designed for interactive websites, mini-games, and page-based experiences.

---

## ✨ Features

- 📄 **Page-based architecture** - Organized structure for multi-page projects
- 🤖 **Auto-generate** HTML / SCSS / JS / JSON with one command
- 🖼️ **Automatic image preloading** by page for optimized performance
- 🎨 **SCSS** with global + page separation
- ⚡ **Development & production builds** with optimization
- 🔄 **BrowserSync** for local development with live reload
- 📦 **ES6+ support** with Babel transpilation
- 🗜️ **Minification** for HTML, CSS, JS, JSON, and images

---

## 📁 Project Structure

```
.
├─ scss/
│  ├─ global/              # variables, mixins, reset
│  ├─ pages/               # page-specific styles
│  ├─ 1_base/              # base styles
│  ├─ 2_components/        # component styles
│  └─ main.scss            # main entry point
├─ js/
│  ├─ controller/          # preload, popup, flow
│  ├─ pages/               # page scripts
│  ├─ templates/           # component scripts
│  └─ libs/                # third-party libraries
├─ templates/
│  ├─ components/          # reusable HTML components
│  └─ *.html               # page templates
├─ images/
│  ├─ general/             # shared images (preload everywhere)
│  └─ pages/               # page-specific images
├─ data/
│  └─ en-gb/               # locale-based JSON data
├─ dist/                   # production build output
├─ gulpfile.js             # Gulp configuration
├─ gulp-preload.js         # Image preload generator
├─ gulp-generate.js        # Page generator
└─ package.json
```

---

## 🔄 Build Flow Diagram

```
SCSS ─┐
JS    ├─► GULP ──► dist/
HTML  ─┘
Images ─► preload.js (auto-generated)
```

**Development Flow:**

1. Edit source files (SCSS, JS, HTML)
2. Gulp watches for changes
3. Auto-compile and reload browser
4. Generate preload scripts on image changes

**Production Flow:**

1. Clean dist folder
2. Compile and minify all assets
3. Optimize images
4. Copy necessary files to dist

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### 1. Install dependencies

```bash
npm install
```

### 2. Start development

```bash
npm run dev
```

This will:

- Clean the build
- Compile SCSS with sourcemaps
- Bundle JavaScript files
- Start BrowserSync server at `http://localhost:3000`
- Watch for file changes

### 3. Build for production

```bash
npm run build
```

This will:

- Clean the dist folder
- Compile and minify all SCSS
- Transpile and minify all JavaScript
- Minify HTML, JSON, and images
- Copy all assets to `dist/` folder

---

## 🧪 Generate New Page

Create a complete page setup with one command:

```bash
npm run make
```

**Input example:**

```
home about contact
```

**Will create:**

- `templates/home.html` - HTML template
- `scss/pages/_home.scss` - Page styles
- `js/pages/home.js` - Page script
- `data/en-gb/home.json` - Page data

**Auto-imported in:**

- `scss/main.scss` - SCSS import added
- `js/pages/` - Ready for bundling

---

## 🖼️ Image Preload System

The template includes an intelligent image preloading system:

### Directory Structure

```
images/
├─ general/              # Preloaded on ALL pages
│  ├─ logo.png
│  └─ bg.jpg
└─ pages/
   ├─ home/              # Preloaded only on home page
   │  └─ hero.jpg
   └─ about/             # Preloaded only on about page
      └─ team.jpg
```

### Generate Preload Script

After adding/removing images, run:

```bash
npm run preload
```

This generates `js/controller/preload.js` with:

- All images from `images/general/`
- Page-specific images from `images/pages/{pageName}/`

### How It Works

```javascript
// Auto-generated in preload.js
const preloadImages = {
  general: ["logo.png", "bg.jpg"],
  home: ["hero.jpg"],
  about: ["team.jpg"],
};
```

---

## 📦 Available Scripts

| Script    | Command                                 | Description                   |
| --------- | --------------------------------------- | ----------------------------- |
| `dev`     | `gulp` or `npm run dev`                 | Start development server      |
| `build`   | `gulp build` or `npm run build`         | Build for production          |
| `make`    | `gulp make` or `npm run make`           | Generate new page files       |
| `preload` | `gulp preloadTask` or `npm run preload` | Generate image preload script |
| `clean`   | `gulp clean`                            | Clean dist folder             |

---

## 🧹 Files Excluded from Production

The following files are automatically excluded or cleaned:

- `*.map` - Source maps
- `css/global.css` - Intermediate global CSS
- `scss/global.scss` - SCSS utility file (not compiled directly)
- Partial SCSS files (`_*.scss`)
- Development-only assets

---

## 🛠️ Gulp Tasks Breakdown

### Development Tasks

- **`scssDev`** - Compile SCSS with sourcemaps
- **`jsController`** - Bundle controller scripts
- **`jsLibrary`** - Concat library files
- **`jsTemplates`** - Bundle template scripts
- **`serve`** - Start BrowserSync server

### Production Tasks

- **`scssProd`** - Compile and minify SCSS
- **`jsPages`** - Transpile page scripts
- **`minifyHtml`** - Minify HTML files
- **`minifyJson`** - Minify JSON data
- **`minifyImage`** - Optimize images
- **`moveFile`** - Copy individual files
- **`moveFolder`** - Copy folders to dist

---

## 🎨 SCSS Structure

```scss
// main.scss - Main entry point
@use "global"; // Variables, mixins, reset
@use "pages/home"; // Page-specific styles
@use "pages/about";
@use "2_components/button"; // Components
```

### Best Practices

1. Use `@use` instead of `@import` (Dart Sass)
2. Prefix partial files with `_` (e.g., `_variables.scss`)
3. Keep page styles in `pages/` folder
4. Use mixins for responsive breakpoints

---

## 🧩 Browser Support

Defined via Browserslist in `package.json`:

```json
{
  "browserslist": ["> 1%", "last 2 versions", "ie >= 9"]
}
```

Autoprefixer will add vendor prefixes based on this configuration.

---

## 🧠 Recommended Workflow

### Creating a New Page

1. **Generate page structure:**

   ```bash
   npm run make
   # Enter: portfolio
   ```

2. **Add page images:**

   ```
   images/pages/portfolio/
   ├─ hero.jpg
   ├─ project1.jpg
   └─ project2.jpg
   ```

3. **Generate preload script:**

   ```bash
   npm run preload
   ```

4. **Start development:**

   ```bash
   npm run dev
   ```

5. **Edit files:**
   - `templates/portfolio.html` - Structure
   - `scss/pages/_portfolio.scss` - Styles
   - `js/pages/portfolio.js` - Interactions
   - `data/en-gb/portfolio.json` - Content

6. **Build for production:**
   ```bash
   npm run build
   ```

### Working with Components

1. Create component files:

   ```
   templates/components/card.html
   scss/2_components/_card.scss
   js/templates/card.js
   ```

2. Import in main files:

   ```scss
   // main.scss
   @use "2_components/card";
   ```

3. Component script auto-bundles to `js/templates.js`

---

## 📝 Configuration

### Gulp Configuration

Edit `gulpfile.js` to customize:

- Source/destination paths
- SCSS compilation options
- JS transpilation settings
- Image optimization levels
- BrowserSync settings

### Environment Variables

Create `.env` file for environment-specific settings:

```env
NODE_ENV=development
API_URL=https://api.example.com
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** `globSync is not a function`

```bash
# Update glob package
npm install glob@latest
```

**Issue:** SCSS mixin not found

```scss
// Add @use at the top of your SCSS file
@use "../mixins" as *;
```

**Issue:** BrowserSync not reloading

```javascript
// Check watch patterns in gulpfile.js
watch("scss/**/*.scss", scssDev);
```

**Issue:** Images not preloading

```bash
# Regenerate preload script
npm run preload
```

---

## 📚 Dependencies

### Core Build Tools

- **gulp** - Task runner
- **gulp-sass** + **sass** - SCSS compilation
- **gulp-babel** + **@babel/core** - JS transpilation
- **gulp-terser** - JS minification
- **browser-sync** - Development server

### Optimization

- **gulp-autoprefixer** - CSS vendor prefixes
- **gulp-clean-css** - CSS minification
- **gulp-htmlmin** - HTML minification
- **gulp-imagemin** - Image optimization
- **gulp-jsonminify** - JSON minification

### Utilities

- **gulp-concat** - File concatenation
- **gulp-sourcemaps** - Source map generation
- **del** - File deletion
- **glob** - File pattern matching
- **dotenv** - Environment variables

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---
