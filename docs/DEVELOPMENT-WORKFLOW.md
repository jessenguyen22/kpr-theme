# 🔄 Development Workflow - Quy Trình Phát Triển

## 🚀 Development Environment Setup

### Local Development Setup

```bash
# 1. Prerequisites installation
# Node.js (v16+)
curl -fsSL https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz | tar -xJ
export PATH=$PATH:/path/to/node/bin

# Shopify CLI (latest)
npm install -g @shopify/cli @shopify/theme

# Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. Project initialization
git clone <horizon-theme-repository>
cd horizon-theme

# 3. Shopify store connection
shopify auth login
shopify theme dev --store=your-development-store.myshopify.com

# 4. Development server
shopify theme serve --host=0.0.0.0 --port=9292
```

### IDE Configuration

```json
// .vscode/settings.json - VS Code configuration
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
  "css.validate": false,
  "scss.validate": false,  
  "javascript.preferences.importModuleSpecifier": "relative",
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

```json
// .vscode/extensions.json - Recommended extensions
{
  "recommendations": [
    "shopify.theme-check-vscode",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Git Workflow Setup

```bash
# .gitignore - Proper exclusions
node_modules/
.env
.shopifyignore
.vscode/settings.json
*.log
.DS_Store
Thumbs.db

# Git hooks setup
# .githooks/pre-commit
#!/bin/bash
echo "🔍 Running pre-commit checks..."

# Theme check
if command -v shopify &> /dev/null; then
    echo "Running theme check..."
    shopify theme check
    if [ $? -ne 0 ]; then
        echo "❌ Theme check failed"
        exit 1
    fi
fi

# JavaScript linting
if [ -f "package.json" ]; then
    echo "Running ESLint..."
    npm run lint
    if [ $? -ne 0 ]; then
        echo "❌ ESLint failed"
        exit 1
    fi
fi

echo "✅ Pre-commit checks passed"
```

## 📁 Project Structure và Organization

### Folder Organization Strategy

```
horizon-theme/
├── assets/                 # Frontend assets
│   ├── critical.js         # Critical path JavaScript
│   ├── component.js        # Base component system
│   ├── utilities.js        # Shared utilities
│   ├── base.css           # Base styles
│   └── components/         # Component-specific assets
│       ├── product-card.js
│       ├── slideshow.js
│       └── cart-drawer.js
├── blocks/                 # Reusable blocks
│   ├── _components/        # Internal components (prefix _)
│   ├── basic/             # Basic blocks (text, image, button)
│   ├── interactive/       # Interactive blocks (forms, galleries)
│   └── ecommerce/         # E-commerce blocks (product cards, etc.)
├── sections/              # Page sections
│   ├── _blocks.liquid     # Universal block container
│   ├── layout/            # Layout sections (header, footer)
│   ├── content/           # Content sections
│   └── ecommerce/         # E-commerce sections
├── snippets/              # Reusable code snippets
│   ├── core/              # Core functionality
│   ├── components/        # UI components
│   └── utilities/         # Helper snippets
├── templates/             # Page templates
├── config/                # Theme configuration
├── locales/               # Internationalization
├── layout/                # Base layouts
└── docs/                  # Documentation
    ├── development.md
    ├── deployment.md
    └── troubleshooting.md
```

### File Naming Conventions

```bash
# ✅ GOOD - Consistent naming patterns
blocks/
├── product-card.liquid           # Kebab-case for blocks
├── _heading-with-subtitle.liquid # Component blocks with underscore
└── testimonial-carousel.liquid   # Descriptive names

assets/
├── product-form.js              # Match block/section names
├── slideshow-component.js       # Component suffix for clarity
└── cart-drawer-styles.css       # Purpose-based naming

snippets/
├── product-grid.liquid          # Feature-based naming
├── responsive-image.liquid      # Descriptive functionality
└── social-sharing-buttons.liquid # Full descriptive names

# ❌ BAD - Inconsistent patterns
blocks/
├── productCard.liquid           # PascalCase inconsistent
├── block_1.liquid              # Generic names
└── ProductTestimonial.liquid   # Mixed naming styles
```

## 🔧 Development Patterns

### Component Development Workflow

```liquid
<!-- 1. Block Template Structure -->
<!-- blocks/feature-card.liquid -->
{%- comment -%}
  Feature Card Block
  
  @author Developer Name
  @version 1.0.0
  @created 2024-01-15
  @updated 2024-01-20
  
  @description
  Hiển thị card với icon, tiêu đề, mô tả và link
  
  @usage
  Có thể sử dụng trong bất kỳ section nào hỗ trợ blocks
  
  @dependencies
  - snippets/icon.liquid
  - snippets/image.liquid
  
  @settings
  - icon: Icon name hoặc custom icon
  - title: Tiêu đề card
  - description: Mô tả content
  - link: URL link (optional)
  - color_scheme: Color scheme selection
{%- endcomment -%}

{%- liquid
  # Validate required settings
  assign title = block.settings.title | default: 'Feature Title'
  assign description = block.settings.description | strip_html | truncate: 150
  assign icon_name = block.settings.icon | default: 'star'
  
  # Generate unique ID
  assign block_id = 'feature-card-' | append: block.id
  
  # Process link settings
  assign link_url = block.settings.link
  assign open_in_new_tab = block.settings.open_in_new_tab | default: false
  assign link_attributes = ''
  if open_in_new_tab
    assign link_attributes = 'target="_blank" rel="noopener noreferrer"'
  endif
-%}

<!-- Semantic HTML structure -->
<article 
  class="feature-card color-{{ block.settings.color_scheme }}"
  id="{{ block_id }}"
  {{ block.shopify_attributes }}
  data-block-type="feature-card"
  data-animation="{{ block.settings.animation_type }}"
>
  <!-- Optional link wrapper -->
  {% if link_url != blank %}
    <a href="{{ link_url }}" class="feature-card__link" {{ link_attributes }}>
  {% endif %}
  
  <!-- Card content -->
  <div class="feature-card__content">
    <!-- Icon section -->
    {% if block.settings.custom_icon %}
      <div class="feature-card__icon">
        {% render 'image', 
           image: block.settings.custom_icon,
           alt: title,
           sizes: '60px',
           loading: 'lazy'
        %}
      </div>
    {% elsif icon_name != blank %}
      <div class="feature-card__icon">
        {% render 'icon', name: icon_name, size: 'large' %}
      </div>
    {% endif %}
    
    <!-- Text content -->
    <div class="feature-card__text">
      <h3 class="feature-card__title">{{ title }}</h3>
      {% if description != blank %}
        <p class="feature-card__description">{{ description }}</p>
      {% endif %}
    </div>
    
    <!-- Optional CTA -->
    {% if block.settings.cta_text != blank and link_url != blank %}
      <div class="feature-card__cta">
        <span class="feature-card__cta-text">
          {{ block.settings.cta_text }}
          {% render 'icon', name: 'arrow-right', size: 'small' %}
        </span>
      </div>
    {% endif %}
  </div>
  
  {% if link_url != blank %}
    </a>
  {% endif %}
</article>

<!-- Scoped CSS -->
<style>
  #{{ block_id }} {
    /* CSS Custom Properties cho theming */
    --card-bg: var(--color-background);
    --card-text: var(--color-foreground);
    --card-border: var(--color-border);
    --card-shadow: var(--color-shadow);
    --card-radius: {{ block.settings.border_radius | default: 12 }}px;
    --card-padding: var(--spacing-medium);
    
    /* Base card styles */
    background: var(--card-bg);
    color: var(--card-text);
    border: 1px solid var(--card-border);
    border-radius: var(--card-radius);
    padding: var(--card-padding);
    
    /* Modern layout */
    display: grid;
    gap: var(--spacing-small);
    
    /* Hover effects */
    transition: all 0.3s ease;
    cursor: {% if link_url != blank %}pointer{% else %}default{% endif %};
  }
  
  #{{ block_id }}:hover {
    {% if link_url != blank %}
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(var(--card-shadow) / 0.15);
    {% endif %}
  }
  
  .feature-card__link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .feature-card__content {
    display: grid;
    gap: var(--spacing-small);
    text-align: {{ block.settings.text_alignment | default: 'center' }};
  }
  
  .feature-card__icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: var(--color-primary);
  }
  
  .feature-card__title {
    font-size: var(--font-size-h4);
    font-weight: 600;
    line-height: var(--line-height-tight);
    margin: 0;
  }
  
  .feature-card__description {
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
    color: var(--color-foreground-secondary);
    margin: 0;
  }
  
  .feature-card__cta {
    margin-top: var(--spacing-small);
  }
  
  .feature-card__cta-text {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-weight: 500;
    color: var(--color-primary);
    font-size: var(--font-size-small);
  }
  
  /* Animation styles */
  #{{ block_id }}[data-animation="fade-in"] {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  #{{ block_id }}[data-animation="fade-in"][data-loaded="true"] {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    #{{ block_id }} {
      --card-padding: var(--spacing-small);
    }
  }
</style>

<!-- Schema definition -->
{% schema %}
{
  "name": "Feature Card",
  "settings": [
    {
      "type": "header",
      "content": "📝 Content Settings"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Card Title",
      "default": "Amazing Feature",
      "info": "Keep it concise and descriptive"
    },
    {
      "type": "richtext",
      "id": "description", 
      "label": "Description",
      "default": "<p>Describe your feature or benefit in detail</p>"
    },
    {
      "type": "url",
      "id": "link",
      "label": "Card Link (Optional)"
    },
    {
      "type": "checkbox",
      "id": "open_in_new_tab",
      "label": "Open link in new tab",
      "default": false,
      "visible_if": "{{ block.settings.link != blank }}"
    },
    {
      "type": "text",
      "id": "cta_text",
      "label": "Call-to-action Text",
      "default": "Learn More",
      "visible_if": "{{ block.settings.link != blank }}"
    },
    {
      "type": "header",
      "content": "🎨 Icon Settings"
    },
    {
      "type": "select",
      "id": "icon",
      "label": "Icon",
      "options": [
        { "value": "star", "label": "⭐ Star" },
        { "value": "heart", "label": "❤️ Heart" },
        { "value": "shield", "label": "🛡️ Shield" },
        { "value": "lightning", "label": "⚡ Lightning" },
        { "value": "trophy", "label": "🏆 Trophy" },
        { "value": "rocket", "label": "🚀 Rocket" },
        { "value": "custom", "label": "🖼️ Custom Image" }
      ],
      "default": "star"
    },
    {
      "type": "image_picker",
      "id": "custom_icon",
      "label": "Custom Icon Image",
      "visible_if": "{{ block.settings.icon == 'custom' }}"
    },
    {
      "type": "header",
      "content": "🎨 Design Settings"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Color Scheme",
      "default": "scheme-1"
    },
    {
      "type": "select",
      "id": "text_alignment",
      "label": "Text Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ],
      "default": "center"
    },
    {
      "type": "range",
      "id": "border_radius",
      "label": "Border Radius (px)",
      "min": 0,
      "max": 50,
      "step": 2,
      "default": 12
    },
    {
      "type": "header",
      "content": "✨ Animation Settings"
    },
    {
      "type": "select",
      "id": "animation_type",
      "label": "Animation Type",
      "options": [
        { "value": "none", "label": "No Animation" },
        { "value": "fade-in", "label": "Fade In" },
        { "value": "slide-up", "label": "Slide Up" },
        { "value": "scale-in", "label": "Scale In" }
      ],
      "default": "fade-in"
    },
    {
      "type": "range",
      "id": "animation_delay",
      "label": "Animation Delay (ms)",
      "min": 0,
      "max": 1000,
      "step": 100,
      "default": 200,
      "visible_if": "{{ block.settings.animation_type != 'none' }}"
    }
  ],
  "presets": [
    {
      "name": "Feature Card",
      "category": "Content",
      "settings": {
        "title": "Premium Quality",
        "description": "<p>Experience the highest quality materials and craftsmanship in every product.</p>",
        "icon": "star",
        "color_scheme": "scheme-1",
        "animation_type": "fade-in"
      }
    }
  ]
}
{% endschema %}
```

### JavaScript Component Pattern

```javascript
// assets/feature-card.js
import { Component } from '@theme/component';

/**
 * Feature Card Component
 * Handles animations và user interactions
 */
class FeatureCard extends Component {
  // Define required refs
  requiredRefs = ['title', 'description'];
  
  // Private properties
  #intersectionObserver = null;
  #isAnimated = false;
  #animationType = 'none';

  connectedCallback() {
    super.connectedCallback();
    
    // Get animation settings
    this.#animationType = this.dataset.animation || 'none';
    
    // Setup component
    this.#setupAnimation();
    this.#setupAccessibility();
    this.#setupAnalytics();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanup();
  }

  /**
   * Setup scroll-triggered animations  
   */
  #setupAnimation() {
    if (this.#animationType === 'none') return;

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.#isAnimated) {
            this.#triggerAnimation();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.#intersectionObserver.observe(this);
  }

  #triggerAnimation() {
    this.#isAnimated = true;
    
    // Get animation delay
    const delay = parseInt(this.dataset.animationDelay) || 0;
    
    setTimeout(() => {
      this.dataset.loaded = 'true';
      
      // Dispatch animation complete event
      this.dispatchEvent(new CustomEvent('feature-card:animated', {
        bubbles: true,
        detail: { animationType: this.#animationType }
      }));
      
    }, delay);
  }

  /**
   * Setup accessibility features
   */
  #setupAccessibility() {
    // Add proper ARIA attributes
    this.setAttribute('role', 'article');
    
    // Improve keyboard navigation
    if (this.querySelector('.feature-card__link')) {
      this.setAttribute('tabindex', '0');
      
      // Handle Enter/Space key presses
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.querySelector('.feature-card__link').click();
        }
      });
    }

    // Add screen reader improvements
    const title = this.refs.title.textContent;
    const description = this.refs.description.textContent;
    this.setAttribute('aria-label', `${title}: ${description}`);
  }

  /**
   * Setup analytics tracking
   */
  #setupAnalytics() {
    // Track card impressions
    const impressionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.#trackImpression();
            impressionObserver.unobserve(this);
          }
        });
      },
      { threshold: 0.5 }
    );

    impressionObserver.observe(this);
  }

  // Declarative event handling
  'on:click' = (event) => {
    this.#trackClick(event);
  };

  'on:mouseenter' = () => {
    this.#trackHover();
  };

  #trackImpression() {
    const title = this.refs.title.textContent;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_card_impression', {
        'card_title': title,
        'card_position': this.dataset.position || 'unknown',
        'section_id': this.closest('[data-section-id]')?.dataset.sectionId
      });
    }
  }

  #trackClick(event) {
    const title = this.refs.title.textContent;
    const link = event.target.closest('.feature-card__link');
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_card_click', {
        'card_title': title,
        'destination_url': link?.href || 'none',
        'section_id': this.closest('[data-section-id]')?.dataset.sectionId
      });
    }
  }

  #trackHover() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'feature_card_hover', {
        'card_title': this.refs.title.textContent
      });
    }
  }

  #cleanup() {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
    }
  }
}

// Register custom element
customElements.define('feature-card', FeatureCard);

// Auto-upgrade existing elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-block-type="feature-card"]').forEach(element => {
    if (!element.matches('feature-card')) {
      // Convert to custom element
      const featureCard = document.createElement('feature-card');
      
      // Copy attributes
      Array.from(element.attributes).forEach(attr => {
        featureCard.setAttribute(attr.name, attr.value);
      });
      
      // Copy content
      featureCard.innerHTML = element.innerHTML;
      
      // Replace element
      element.parentNode.replaceChild(featureCard, element);
    }
  });
});

// Handle section updates (theme editor)
document.addEventListener('shopify:section:load', (event) => {
  const section = event.detail.sectionId;
  const featureCards = document.querySelectorAll(`[data-section-id="${section}"] feature-card`);
  
  featureCards.forEach(card => {
    // Re-initialize animations
    if (card.#intersectionObserver) {
      card.#intersectionObserver.disconnect();
      card.#setupAnimation();
    }
  });
});
```

## 🧪 Testing và Quality Assurance

### Testing Checklist Template

```markdown
# 🧪 Block/Section Testing Checklist

## Block: [Block Name]
## Version: [Version Number]
## Date: [Testing Date]
## Tester: [Tester Name]

### ✅ Functionality Testing

#### Basic Functionality
- [ ] Block renders correctly in theme editor
- [ ] All settings work as expected
- [ ] Default values display correctly
- [ ] Required fields validation works
- [ ] Optional fields can be left empty

#### Content Management
- [ ] Text fields accept various content lengths
- [ ] Rich text editor works properly
- [ ] Image uploads work correctly
- [ ] URL fields validate properly
- [ ] Color scheme changes apply correctly

#### Interactive Features
- [ ] Hover effects work smoothly
- [ ] Click interactions function properly
- [ ] Keyboard navigation works
- [ ] Form submissions process correctly
- [ ] Animations trigger appropriately

### 📱 Responsive Testing

#### Mobile (320px - 768px)
- [ ] Layout adapts correctly
- [ ] Text remains readable
- [ ] Images scale appropriately
- [ ] Touch targets are large enough (44px+)
- [ ] Horizontal scrolling not required

#### Tablet (768px - 1024px)
- [ ] Layout transitions smoothly
- [ ] Content remains accessible
- [ ] Images maintain aspect ratios
- [ ] Touch interactions work properly

#### Desktop (1024px+)
- [ ] Full layout displays correctly
- [ ] Hover states are appropriate
- [ ] Mouse interactions work smoothly
- [ ] Content is well-proportioned

### ♿ Accessibility Testing

#### Screen Reader Support
- [ ] Content reads in logical order
- [ ] Images have proper alt text
- [ ] Interactive elements have labels
- [ ] Form fields have proper labels
- [ ] Status messages are announced

#### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key works where appropriate
- [ ] Enter/Space activate elements

#### Visual Accessibility
- [ ] Color contrast meets WCAG AA standards
- [ ] Text remains readable when zoomed to 200%
- [ ] Focus indicators are clearly visible
- [ ] Content works without color alone
- [ ] Animations can be disabled

### ⚡ Performance Testing

#### Loading Performance
- [ ] Images load efficiently
- [ ] CSS loads without blocking
- [ ] JavaScript doesn't block rendering
- [ ] Fonts load with proper fallbacks
- [ ] Large content lazy loads

#### Runtime Performance
- [ ] Interactions are responsive (<100ms)
- [ ] Animations are smooth (60fps)
- [ ] Memory usage remains reasonable
- [ ] No console errors or warnings
- [ ] Network requests are optimized

### 🌐 Browser Testing

#### Chrome (Latest)
- [ ] Full functionality works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Responsive design works

#### Firefox (Latest)
- [ ] Full functionality works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Responsive design works

#### Safari (Latest)
- [ ] Full functionality works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Responsive design works

#### Edge (Latest)
- [ ] Full functionality works
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] Responsive design works

### 🔍 SEO Testing

#### Semantic HTML
- [ ] Proper heading hierarchy
- [ ] Meaningful HTML5 elements
- [ ] Proper link attributes
- [ ] Meta information complete
- [ ] Structured data valid

#### Content Quality
- [ ] Text content is meaningful
- [ ] Images have descriptive alt text
- [ ] Links have descriptive text
- [ ] Content hierarchy is clear
- [ ] Loading states don't hide content

### 📊 Analytics Testing

#### Event Tracking
- [ ] Impression events fire correctly
- [ ] Click events track properly
- [ ] Form submission events work
- [ ] Error events are captured
- [ ] Custom events include proper data

#### Data Quality
- [ ] Event parameters are accurate
- [ ] User IDs are consistent
- [ ] Timestamps are correct
- [ ] Custom dimensions work
- [ ] Conversion tracking functions

### ✨ Theme Editor Testing

#### Block Management
- [ ] Block appears in correct category
- [ ] Block can be added to sections
- [ ] Block settings are accessible
- [ ] Block can be reordered
- [ ] Block can be deleted

#### Settings Interface
- [ ] All settings display correctly
- [ ] Conditional settings work
- [ ] Setting changes preview immediately
- [ ] Reset to defaults works
- [ ] Settings validation works

#### Preview Mode
- [ ] Changes preview in real-time
- [ ] Mobile preview works correctly
- [ ] Desktop preview works correctly
- [ ] Preview doesn't affect live site
- [ ] Exit preview works properly

### 🚨 Error Handling

#### Invalid Input
- [ ] Invalid URLs handled gracefully
- [ ] Missing required fields show errors
- [ ] Invalid images display fallbacks
- [ ] Network errors don't break layout
- [ ] JavaScript errors don't crash page

#### Edge Cases
- [ ] Empty content handled properly
- [ ] Very long content truncates
- [ ] Special characters work correctly
- [ ] Multiple instances don't conflict
- [ ] Rapid interactions don't break

### Sign-off

#### Functional Testing
**Passed:** [ ] **Failed:** [ ] **Notes:** ________________

#### Responsive Testing  
**Passed:** [ ] **Failed:** [ ] **Notes:** ________________

#### Accessibility Testing
**Passed:** [ ] **Failed:** [ ] **Notes:** ________________

#### Performance Testing
**Passed:** [ ] **Failed:** [ ] **Notes:** ________________

#### Browser Testing
**Passed:** [ ] **Failed:** [ ] **Notes:** ________________

**Overall Status:** [ ] ✅ PASS [ ] ❌ FAIL [ ] ⚠️ CONDITIONAL PASS

**Final Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

**Tester Signature:** _________________ **Date:** _________
```

### Automated Testing Setup

```bash
# package.json - Testing dependencies
{
  "name": "horizon-theme-testing",
  "scripts": {
    "test": "npm run test:theme && npm run test:performance && npm run test:accessibility",
    "test:theme": "shopify theme check",
    "test:performance": "lighthouse-ci",
    "test:accessibility": "axe-cli",
    "lint": "eslint assets/**/*.js",
    "lint:fix": "eslint assets/**/*.js --fix"
  },
  "devDependencies": {
    "@shopify/cli": "^3.45.0",
    "eslint": "^8.42.0",
    "lighthouse-ci": "^0.12.0",
    "axe-cli": "^4.7.0",
    "puppeteer": "^20.7.2"
  }
}
```

```javascript
// tests/performance.test.js - Performance testing
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runPerformanceTest(url) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };
  
  const runnerResult = await lighthouse(url, options);
  
  // Performance thresholds
  const performanceScore = runnerResult.lhr.categories.performance.score * 100;
  const lcp = runnerResult.lhr.audits['largest-contentful-paint'].numericValue;
  const cls = runnerResult.lhr.audits['cumulative-layout-shift'].numericValue;
  
  console.log(`Performance Score: ${performanceScore}`);
  console.log(`LCP: ${lcp}ms`);
  console.log(`CLS: ${cls}`);
  
  // Assert thresholds
  if (performanceScore < 85) {
    throw new Error(`Performance score ${performanceScore} below threshold 85`);
  }
  
  if (lcp > 2500) {
    throw new Error(`LCP ${lcp}ms above threshold 2500ms`);
  }
  
  if (cls > 0.1) {
    throw new Error(`CLS ${cls} above threshold 0.1`);
  }
  
  await chrome.kill();
}

module.exports = { runPerformanceTest };
```

## 🚀 Deployment Workflow

### Pre-deployment Checklist

```bash
#!/bin/bash
# deploy-checklist.sh - Pre-deployment validation

echo "🚀 Starting deployment checklist..."

# 1. Theme validation
echo "1️⃣ Running theme check..."
shopify theme check
if [ $? -ne 0 ]; then
    echo "❌ Theme check failed"
    exit 1
fi

# 2. JavaScript linting
echo "2️⃣ Running JavaScript linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ JavaScript linting failed"
    exit 1
fi

# 3. Performance testing
echo "3️⃣ Running performance tests..."
npm run test:performance
if [ $? -ne 0 ]; then
    echo "⚠️ Performance tests failed - review required"
fi

# 4. Accessibility testing
echo "4️⃣ Running accessibility tests..."
npm run test:accessibility
if [ $? -ne 0 ]; then
    echo "⚠️ Accessibility tests failed - review required"
fi

# 5. Asset optimization
echo "5️⃣ Optimizing assets..."
# Compress images, minify CSS/JS if needed

# 6. Backup current theme
echo "6️⃣ Creating theme backup..."
shopify theme pull --development

echo "✅ Pre-deployment checklist completed!"
```

### Deployment Stages

```bash
# 1. Development to Staging
shopify theme push --development --allow-live

# 2. Staging validation
shopify theme preview --development

# 3. Production deployment
shopify theme push --live --allow-live

# 4. Post-deployment verification
curl -I https://your-store.myshopify.com/
```

## 📊 Monitoring và Maintenance

### Performance Monitoring

```javascript
// assets/monitoring.js - Production monitoring
class ThemeMonitoring {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    this.trackErrors();
    this.trackPerformance();
    this.trackUserInteractions();
  }

  trackErrors() {
    window.addEventListener('error', (event) => {
      this.reportError({
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack
      });
    });
  }

  trackPerformance() {
    // Track Core Web Vitals
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.reportMetric('LCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  reportError(error) {
    // Send error to monitoring service
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        'description': error.message,
        'fatal': false
      });
    }

    // Log in development
    if (window.Shopify?.designMode) {
      console.error('Theme Error:', error);
    }
  }

  reportMetric(name, value) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        'name': name,
        'value': Math.round(value)
      });
    }
  }
}

// Initialize monitoring
new ThemeMonitoring();
```

## 🎯 Best Practices Summary

### ✅ **Development Best Practices:**

1. **Code Organization**: Consistent file structure và naming
2. **Documentation**: Comprehensive comments và README files
3. **Version Control**: Proper Git workflow với meaningful commits
4. **Testing**: Automated testing pipeline với manual QA
5. **Performance**: Continuous performance monitoring
6. **Accessibility**: WCAG 2.1 AA compliance
7. **SEO**: Semantic HTML và proper meta tags
8. **Analytics**: Comprehensive event tracking

### 🔄 **Workflow Optimization:**

1. **Local Development**: Fast iteration với hot reloading
2. **Code Quality**: ESLint, Prettier, theme-check integration
3. **Automated Testing**: CI/CD pipeline với automated checks  
4. **Deployment**: Staged deployment với rollback capability
5. **Monitoring**: Real-time error tracking và performance monitoring
6. **Documentation**: Up-to-date technical documentation
7. **Knowledge Sharing**: Team collaboration và code reviews