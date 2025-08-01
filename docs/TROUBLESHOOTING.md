# 🚨 Troubleshooting Guide - Xử Lý Sự Cố

## 🔍 Common Issues và Solutions

### 1. Blocks System Issues

#### Issue: Block không hiển thị trong Theme Editor

**Symptoms:**
```
- Block đã tạo nhưng không xuất hiện trong theme editor
- Block hiển thị nhưng không có settings
- Block xuất hiện sai category
```

**Diagnosis:**
```liquid
<!-- Kiểm tra schema trong block file -->
{% schema %}
{
  "name": "Your Block Name",    <!-- ✅ Required -->
  "settings": [...],           <!-- ✅ Required -->
  "presets": [                 <!-- ✅ Required cho visibility -->
    {
      "name": "Preset Name",
      "category": "Basic"       <!-- ✅ Category required -->
    }
  ]
}
{% endschema %}
```

**Solutions:**

```liquid
<!-- ✅ SOLUTION 1: Proper schema structure -->
{% schema %}
{
  "name": "t:names.testimonial_card",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Customer Review"
    }
  ],
  "presets": [
    {
      "name": "Testimonial Card",
      "category": "Social Proof"   <!-- Must have category -->
    }
  ]
}
{% endschema %}

<!-- ✅ SOLUTION 2: Check file location -->
<!-- Block files must be in /blocks/ directory -->
<!-- Component blocks should have _ prefix -->

<!-- ✅ SOLUTION 3: Validate JSON -->
<!-- Use JSON validator to check schema syntax -->
```

**Prevention:**
```bash
# Use theme check to validate
shopify theme check

# Check schema syntax
node -e "console.log(JSON.parse(process.argv[1]))" "$(grep -A 50 '{% schema %}' blocks/your-block.liquid | head -n -1 | tail -n +2)"
```

#### Issue: Blocks bị conflict hoặc không load JavaScript

**Symptoms:**
```
- JavaScript không execute
- Console errors về missing modules
- Component functionality không hoạt động
```

**Diagnosis:**
```javascript
// Check browser console for errors
console.log(customElements.get('your-component')); // Should not be undefined

// Check if component is registered
console.log(document.querySelector('your-component'));

// Check import maps
console.log(document.querySelector('script[type="importmap"]'));
```

**Solutions:**

```javascript
// ✅ SOLUTION 1: Proper component registration
class YourComponent extends Component {
  connectedCallback() {
    super.connectedCallback(); // ⚠️ Don't forget this!
    this.setupComponent();
  }
}

// Register with unique name
customElements.define('your-component', YourComponent);

// ✅ SOLUTION 2: Check import maps
// In layout/theme.liquid
<script type="importmap">
{
  "imports": {
    "@theme/": "{{ 'critical.js' | asset_url | split: 'critical.js' | first }}"
  }
}
</script>

// ✅ SOLUTION 3: Avoid naming conflicts
// Use unique, descriptive component names
customElements.define('horizon-testimonial-card', TestimonialCard);
// Not just 'testimonial' or 'card'
```

### 2. Performance Issues

#### Issue: Slow Page Loading

**Symptoms:**
```
- High LCP (> 2.5s)
- Render blocking resources
- Large bundle sizes
- Multiple network requests
```

**Diagnosis Tools:**
```bash
# Lighthouse analysis
npx lighthouse https://your-store.myshopify.com --view

# Bundle analysis
npx webpack-bundle-analyzer assets/

# Network analysis in DevTools
# 1. Open DevTools > Network tab
# 2. Reload page
# 3. Check for large files, many requests
```

**Solutions:**

```liquid
<!-- ✅ SOLUTION 1: Critical CSS inline -->
<style>
  /* Critical above-fold styles inline */
  .hero-section { /* critical styles */ }
</style>

<!-- Non-critical CSS preload -->
<link rel="preload" href="{{ 'base.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- ✅ SOLUTION 2: Optimize images -->
{% render 'image',
   image: section.settings.hero_image,
   loading: 'eager',              <!-- Critical images -->
   fetchpriority: 'high',
   sizes: '100vw'
%}

{% render 'image', 
   image: product.featured_image,
   loading: 'lazy',               <!-- Non-critical images -->
   sizes: '(min-width: 768px) 50vw, 100vw'
%}

<!-- ✅ SOLUTION 3: Lazy load JavaScript -->
<script type="module">
  // Load non-critical components on demand
  const loadComponent = async (selector, componentPath) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      const { default: Component } = await import(componentPath);
      elements.forEach(el => new Component(el));
    }
  };

  // Load when needed
  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('.slideshow', '{{ 'slideshow.js' | asset_url }}');
    loadComponent('.product-form', '{{ 'product-form.js' | asset_url }}');
  });
</script>
```

#### Issue: High Cumulative Layout Shift (CLS)

**Symptoms:**
```
- Content jumps during loading
- Images load without dimensions
- Web fonts cause text shift
- Dynamic content insertion
```

**Solutions:**

```liquid
<!-- ✅ SOLUTION 1: Image aspect ratios -->
<div class="image-container" style="aspect-ratio: {{ image.aspect_ratio }};">
  <img 
    src="{{ image | image_url: width: 800 }}"
    alt="{{ image.alt }}"
    width="{{ image.width }}"
    height="{{ image.height }}"
    loading="lazy"
  >
</div>

<!-- ✅ SOLUTION 2: Font display optimization -->
<style>
  @font-face {
    font-family: 'Theme Font';
    src: url('{{ settings.font_body.woff2_url }}') format('woff2');
    font-display: swap; /* Prevent invisible text during font load */
  }
</style>

<!-- ✅ SOLUTION 3: Skeleton loading -->
<div class="product-card" data-skeleton="product-card">
  <!-- Skeleton placeholder prevents layout shift -->
  <div class="skeleton-image loading-skeleton"></div>
  <div class="skeleton-title loading-skeleton"></div>
  <div class="skeleton-price loading-skeleton"></div>
</div>

<style>
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
</style>
```

### 3. JavaScript Errors

#### Issue: Module Import Errors

**Symptoms:**
```
- "Failed to resolve module specifier" errors
- "Cannot find module" errors  
- Components not initializing
```

**Diagnosis:**
```javascript
// Check import maps in browser console
console.log(document.querySelector('script[type="importmap"]')?.textContent);

// Check if modules load correctly
import('@theme/component').then(console.log).catch(console.error);

// Verify file paths
fetch('{{ 'component.js' | asset_url }}').then(r => console.log(r.status));
```

**Solutions:**

```html
<!-- ✅ SOLUTION 1: Correct import map setup -->
<script type="importmap">
{
  "imports": {
    "@theme/": "{{ 'critical.js' | asset_url | split: 'critical.js' | first }}",
    "@theme/component": "{{ 'component.js' | asset_url }}",
    "@theme/utilities": "{{ 'utilities.js' | asset_url }}"
  }
}
</script>

<!-- ✅ SOLUTION 2: Fallback for browsers without import maps -->
<script nomodule>
  // Fallback for older browsers
  document.write('<script src="{{ 'legacy-bundle.js' | asset_url }}"><\/script>');
</script>
```

```javascript
// ✅ SOLUTION 3: Proper error handling
try {
  const { Component } = await import('@theme/component');
  customElements.define('my-component', class extends Component {
    // Component code
  });
} catch (error) {
  console.error('Failed to load component:', error);
  
  // Fallback functionality
  document.querySelectorAll('[data-component="my-component"]').forEach(el => {
    // Basic fallback behavior
    el.addEventListener('click', basicClickHandler);
  });
}
```

#### Issue: Event Handler Conflicts

**Symptoms:**
```
- Events firing multiple times
- Event handlers not working
- Components interfering with each other
```

**Solutions:**

```javascript
// ✅ SOLUTION 1: Proper event cleanup
class MyComponent extends Component {
  #eventController = new AbortController();

  connectedCallback() {
    super.connectedCallback();
    
    // Use AbortController for cleanup
    document.addEventListener('click', this.handleGlobalClick, {
      signal: this.#eventController.signal
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    
    // Clean up all events
    this.#eventController.abort();
  }

  // ✅ SOLUTION 2: Event delegation
  'on:click .button' = (event) => {
    // This automatically handles cleanup
    event.preventDefault();
    this.handleButtonClick(event);
  };

  // ✅ SOLUTION 3: Prevent duplicate event binding
  #setupEventListeners() {
    if (this.#eventsSetup) return; // Prevent double setup
    this.#eventsSetup = true;
    
    // Setup events...
  }
}
```

### 4. Styling Issues

#### Issue: CSS Specificity Problems

**Symptoms:**
```
- Styles not applying as expected
- Need to use !important frequently
- Component styles being overridden
```

**Solutions:**

```css
/* ✅ SOLUTION 1: Use CSS custom properties */
:root {
  --button-bg: #007bff;
  --button-text: #ffffff;
  --button-border-radius: 4px;
}

.button {
  background: var(--button-bg);
  color: var(--button-text);
  border-radius: var(--button-border-radius);
}

/* ✅ SOLUTION 2: Scoped component styles */
.component-name {
  /* Use component name as namespace */
}

.component-name__element {
  /* BEM methodology for clarity */
}

.component-name__element--modifier {
  /* Modifiers for variations */
}

/* ✅ SOLUTION 3: CSS layers for specificity control */
@layer base, components, utilities;

@layer base {
  /* Base styles */
}

@layer components {
  /* Component styles */
}

@layer utilities {
  /* Utility classes */
}
```

#### Issue: Responsive Design Problems

**Symptoms:**
```
- Layout breaks on mobile
- Content overlaps
- Horizontal scrolling
- Text too small/large
```

**Solutions:**

```css
/* ✅ SOLUTION 1: Mobile-first approach */
.component {
  /* Mobile styles first */
  padding: 1rem;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .component {
    /* Tablet and up */
    padding: 2rem;
    font-size: 1.2rem;
  }
}

/* ✅ SOLUTION 2: Container queries */
.product-grid {
  container-type: inline-size;
}

@container (min-width: 600px) {
  .product-card {
    grid-template-columns: 1fr 1fr;
  }
}

/* ✅ SOLUTION 3: Clamp for responsive values */
.heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(1rem, 3vw, 2rem);
}

/* ✅ SOLUTION 4: Touch-friendly targets */
.button {
  min-height: 44px; /* Minimum touch target */
  min-width: 44px;
  padding: 12px 16px;
}
```

### 5. Theme Editor Issues

#### Issue: Settings không save hoặc preview không update

**Symptoms:**
```
- Changes không reflect trong preview
- Settings reset sau khi save
- Theme editor shows errors
```

**Solutions:**

```liquid
<!-- ✅ SOLUTION 1: Proper setting IDs -->
{% schema %}
{
  "settings": [
    {
      "type": "text",
      "id": "heading_text",        <!-- Must be unique -->
      "label": "Heading Text"
    },
    {
      "type": "color_scheme", 
      "id": "color_scheme",        <!-- Standard naming -->
      "label": "Color Scheme"
    }
  ]
}
{% endschema %}

<!-- ✅ SOLUTION 2: Conditional settings syntax -->
{
  "type": "range",
  "id": "custom_height",
  "label": "Custom Height",
  "visible_if": "{{ section.settings.height_type == 'custom' }}"  <!-- Correct syntax -->
}

<!-- ✅ SOLUTION 3: Handle missing settings -->
{%- liquid
  assign heading_text = section.settings.heading_text | default: 'Default Heading'
  assign color_scheme = section.settings.color_scheme | default: 'scheme-1'
-%}
```

#### Issue: Block reordering không hoạt động

**Solutions:**

```liquid
<!-- ✅ SOLUTION: Proper block rendering -->
{% for block in section.blocks %}
  <div {{ block.shopify_attributes }}>  <!-- Required for drag/drop -->
    {% case block.type %}
      {% when 'heading' %}
        {% render 'blocks/heading', block: block %}
      {% when 'text' %}
        {% render 'blocks/text', block: block %}
    {% endcase %}
  </div>
{% endfor %}
```

### 6. API và Network Issues

#### Issue: Cart API Errors

**Symptoms:**
```
- Add to cart fails
- Cart count doesn't update
- Network timeout errors
```

**Solutions:**

```javascript
// ✅ SOLUTION 1: Proper error handling
async function addToCart(variantId, quantity = 1) {
  try {
    const formData = new FormData();
    formData.append('id', variantId);
    formData.append('quantity', quantity);

    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    // Update cart UI
    updateCartCount();
    showSuccessMessage();
    
    return result;
    
  } catch (error) {
    console.error('Add to cart failed:', error);
    showErrorMessage(error.message);
    throw error;
  }
}

// ✅ SOLUTION 2: Request timeout handling
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch('/cart/add.js', {
    method: 'POST',
    body: formData,
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  // Handle response...
  
} catch (error) {
  clearTimeout(timeoutId);
  
  if (error.name === 'AbortError') {
    showErrorMessage('Request timed out. Please try again.');
  } else {
    showErrorMessage('Something went wrong. Please try again.');
  }
}
```

## 🛠️ Debugging Tools và Techniques

### Browser DevTools Usage

```javascript
// ✅ Component debugging
// In browser console:

// 1. Find components
document.querySelectorAll('[data-component]');

// 2. Inspect component state
const component = document.querySelector('my-component');
console.log(component.refs);       // Check refs
console.log(component.dataset);   // Check data attributes

// 3. Test component methods
component.connectedCallback();     // Re-initialize

// 4. Monitor events
monitorEvents(component);          // Chrome DevTools
monitorEvents(component, 'click'); // Specific events

// 5. Check performance
console.time('component-load');
// ... component code ...
console.timeEnd('component-load');
```

### Theme Check Integration

```bash
# Install theme check
npm install -g @shopify/theme-check

# Run theme check
shopify theme check

# Fix auto-fixable issues
shopify theme check --fix

# Check specific files
shopify theme check blocks/my-block.liquid

# Custom rules configuration
# .theme-check.yml
exclude:
  - node_modules/
  - dist/

TemplateLength:
  max_length: 500

ParserBlockingJavaScript:
  threshold: 100
```

### Performance Debugging

```javascript
// ✅ Performance monitoring in production
class PerformanceDebugger {
  static logWebVitals() {
    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lcp = entries[entries.length - 1];
      console.log('LCP:', lcp.startTime, lcp.element);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // CLS
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log('CLS:', clsValue, entry.sources);
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }

  static logLongTasks() {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        console.warn('Long task:', entry.duration + 'ms', entry);
      }
    }).observe({ entryTypes: ['longtask'] });
  }
}

// Enable in development
if (window.Shopify?.designMode) {
  PerformanceDebugger.logWebVitals();
  PerformanceDebugger.logLongTasks();
}
```

## 🚨 Emergency Fixes

### Quick Rollback Procedure

```bash
# 1. Immediate rollback to previous version
shopify theme push --theme-id=PREVIOUS_THEME_ID --live

# 2. Identify problematic changes
git log --oneline -10
git diff HEAD~1 HEAD

# 3. Create hotfix
git checkout -b hotfix/critical-issue
# Make minimal fix
git commit -m "hotfix: resolve critical issue"

# 4. Deploy hotfix
shopify theme push --live --allow-live

# 5. Test and monitor
curl -I https://your-store.myshopify.com/
# Check error logs and monitoring
```

### Critical CSS/JS Fixes

```liquid
<!-- Emergency disable for problematic components -->
{% unless settings.disable_problematic_feature %}
  {% render 'problematic-component' %}
{% endunless %}

<!-- Fallback for failed JavaScript -->
<noscript>
  <style>
    .js-only { display: none !important; }
    .no-js-fallback { display: block !important; }
  </style>
</noscript>

<!-- Quick performance fix -->
<script>
  // Disable non-critical animations in emergency
  if (performance.now() > 3000) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
  }
</script>
```

## 📞 Support Resources

### Internal Documentation

```markdown
## 📚 Quick Reference Links

### Development
- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Liquid Reference](https://shopify.github.io/liquid/)
- [Theme Inspector Chrome Extension](https://chrome.google.com/webstore/detail/shopify-theme-inspector/fndnankcflemoafdeboboehphmiijkgp)

### Performance
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)

### Accessibility
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)
```

### Escalation Procedures

```markdown
## 🆘 When to Escalate

### Severity Levels

#### 🔴 CRITICAL (Immediate escalation)
- Site is completely down
- Checkout process broken
- Data loss or security breach
- Revenue-impacting bugs

#### 🟡 HIGH (Escalate within 2 hours)
- Major functionality broken
- Performance degradation >50%
- Multiple user reports
- SEO impact

#### 🟢 MEDIUM (Escalate within 1 day)
- Minor functionality issues
- UI/UX problems
- Single feature affected
- Enhancement requests

### Escalation Contacts
- **Technical Lead**: [contact info]
- **DevOps Team**: [contact info]  
- **Product Manager**: [contact info]
- **Emergency Line**: [contact info]
```

---

**💡 Remember**: Most issues can be prevented with proper testing, monitoring, and following the development workflow. When in doubt, rollback first, debug second!