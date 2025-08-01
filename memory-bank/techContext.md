# 💻 Technical Context - KPR Theme

## 🛠️ Stack Công Nghệ

### Core Technologies

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | Custom Web Components |
| **Templating** | Liquid (Shopify) |
| **CSS** | Modern CSS (Custom Properties, Grid, Flexbox) |
| **JavaScript** | ES6+, TypeScript types |
| **Build Tools** | Shopify CLI, Node.js ecosystem |

### Key Dependencies & Libraries

- **Component System**: Custom component base class (`component.js`)
- **DOM Utilities**: Vanilla JS DOM manipulation utilities
- **Performance**: View Transitions API, Intersection Observer
- **Animation**: CSS animations, optional GSAP for complex animations
- **Asset Pipeline**: Shopify asset management

## 🔧 Development Environment Setup

### Required Tools
- **Node.js**: v16+ (preference for v18+)
- **Shopify CLI**: Latest version
- **Git**: For version control
- **VS Code**: Recommended editor with extensions

### Local Development
```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Clone repository
git clone <repo-url>
cd kpr-theme

# Connect to Shopify store
shopify auth login
shopify theme dev --store=your-store.myshopify.com

# Development server
shopify theme serve --host=0.0.0.0 --port=9292
```

### VS Code Configuration
```json
// Recommended VS Code settings
{
  "liquid.format.enable": true,
  "liquid.engine": "shopify",
  "emmet.includeLanguages": {
    "liquid": "html"
  },
  "files.associations": {
    "*.liquid": "liquid"
  },
  "editor.quickSuggestions": {
    "strings": true
  },
  "javascript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🧱 Code Organization

### Directory Structure
```
kpr-theme/
├── assets/           # JavaScript, CSS, SVGs, and other assets
│   ├── component.js  # Base component class
│   ├── critical.js   # Critical-path JavaScript
│   ├── base.css      # Core CSS
│   └── *.js          # Component JavaScript files
├── blocks/           # Block components
│   ├── _*.liquid     # Internal block components
│   └── *.liquid      # Standalone blocks
├── sections/         # Section templates
├── snippets/         # Reusable code snippets
├── templates/        # Page templates (JSON)
├── config/           # Theme configuration
│   ├── settings_data.json    # Theme settings data
│   └── settings_schema.json  # Theme settings schema
├── locales/          # Internationalization files
└── layout/           # Base layout templates
```

### File Naming Conventions
- **Block Files**: Kebab-case (`product-card.liquid`)
- **Internal Blocks**: Underscore prefix (`_heading.liquid`) 
- **JavaScript Components**: Match block/section names (`product-card.js`)
- **CSS Files**: Feature-based naming (`base.css`, `components.css`)

## 🚧 Technical Constraints

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Browsers**: iOS Safari, Chrome for Android
- **No IE Support**: Not supporting Internet Explorer
- **Progressive Enhancement**: Core functionality works without JS

### Performance Targets
- **First Contentful Paint**: < 1.0s
- **Largest Contentful Paint**: < 2.5s
- **First Input Delay**: < 100ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

### Shopify Platform Limitations
- **Liquid Limitations**: No advanced programming constructs
- **Asset Size Limits**: 20MB max per asset file
- **API Rate Limits**: Considerations for dynamic content
- **Theme Editor Constraints**: UI limitations for complex settings
- **Section/Block Nesting**: Maximum nesting depth limitations

## 📱 Responsive Design Approach

### Breakpoints
```css
/* Mobile-first breakpoints */
--breakpoint-sm: 640px;   /* Small devices */
--breakpoint-md: 768px;   /* Medium devices */
--breakpoint-lg: 1024px;  /* Large devices */
--breakpoint-xl: 1280px;  /* Extra large devices */
--breakpoint-2xl: 1536px; /* 2X large devices */
```

### Responsive Strategy
- **Mobile-First**: Base styles for mobile, media queries for larger screens
- **Container Queries**: Layout based on container size where possible
- **Fluid Typography**: Responsive type scaling with clamp()
- **Responsive Images**: `srcset` and `sizes` for optimized loading
- **Adaptive UI**: Components adapt to screen size changes

## ⚡ Performance Optimization Techniques

- **Critical CSS Inlining**: Above-the-fold styles inlined
- **JavaScript Modularization**: ES6 modules with tree-shaking
- **Code Splitting**: Features loaded on demand
- **Image Optimization**: Next-gen formats, responsive sizing
- **Font Loading Strategy**: Font display swap and preloading
- **Service Worker**: Optional caching strategy
- **Resource Hints**: Preload, prefetch, preconnect
- **Asset Compression**: Minification and Brotli/Gzip

## 🔒 Security Considerations

- **Content Security Policy**: Restrictive CSP implementation
- **Trusted Types**: For DOM manipulation where supported
- **XSS Prevention**: Proper escaping of dynamic content
- **CORS Configuration**: Appropriate cross-origin policies
- **Third-party Script Management**: Limited and controlled

## 🌐 i18n Approach

- **Translation Keys**: All UI text uses translation keys
- **RTL Support**: Bidirectional text support
- **Locale Detection**: Auto-detection with manual override
- **Currency Formatting**: Locale-aware currency display
- **Date/Time Formatting**: Locale-specific date formats 