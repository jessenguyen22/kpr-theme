# ⚡ JavaScript Architecture - Web Components System

## 🏗️ Kiến Trúc JavaScript Tổng Quan

Horizon theme sử dụng một **architecture hoàn toàn mới** dựa trên **Web Components** và **ES6 Modules**, khác biệt hoàn toàn với approach vanilla JavaScript của Dawn theme.

### Core Architecture Components

```
assets/
├── component.js          # Base Web Component class
├── critical.js          # Critical path components  
├── events.js            # Global event system
├── utilities.js         # Core utilities & helpers
├── performance.js       # Performance monitoring
├── morph.js            # DOM morphing system
└── view-transitions.js  # View Transitions API
```

## 🧬 Base Component System

### Component Class Foundation

```javascript
// assets/component.js - Base class cho tất cả components
import { DeclarativeShadowElement } from '@theme/critical';
import { requestIdleCallback } from '@theme/utilities';

/**
 * Base class để tạo Web Components
 * Quản lý refs, event listeners và lifecycle
 * 
 * @template {Refs} [T=Refs] - Type cho refs object
 * @extends {DeclarativeShadowElement}
 */
export class Component extends DeclarativeShadowElement {
  /**
   * Object chứa references đến child elements với `ref` attributes
   * Tự động update khi DOM changes
   * 
   * @type {RefsType<T>}
   */
  refs = {};

  /**
   * Array của required refs - throw error nếu không tìm thấy
   * @type {string[] | undefined}
   */
  requiredRefs;

  /**
   * Lấy root nodes của component (shadowRoot hoặc component itself)
   * @returns {(ShadowRoot | Component<T>)[]}
   */
  get roots() {
    return this.shadowRoot ? [this, this.shadowRoot] : [this];
  }

  /**
   * Lifecycle: Called khi element connected to DOM
   * Setup event listeners và refs
   */
  connectedCallback() {
    super.connectedCallback();
    
    // Setup ref management với MutationObserver
    this.#updateRefs();
    this.#setupMutationObserver();
    
    // Validate required refs
    this.#validateRequiredRefs();
    
    // Setup declarative event listeners
    this.#setupEventListeners();
  }

  /**
   * Auto-update refs using MutationObserver
   * Theo dõi DOM changes và update refs accordingly
   */
  #updateRefs() {
    const refs = {};
    const elements = this.roots.reduce((acc, root) => {
      for (const element of root.querySelectorAll('[ref]')) {
        if (!this.#isDescendant(element)) continue;
        acc.add(element);
      }
      return acc;
    }, new Set());

    // Group elements by ref name
    for (const element of elements) {
      const refName = element.getAttribute('ref');
      if (!refs[refName]) {
        refs[refName] = element;
      } else {
        // Multiple elements with same ref -> create array
        refs[refName] = [].concat(refs[refName], element);
      }
    }

    Object.assign(this.refs, refs);
  }

  /**
   * Setup MutationObserver để track DOM changes
   */
  #setupMutationObserver() {
    if (this.#mutationObserver) return;

    this.#mutationObserver = new MutationObserver(() => {
      // Throttle updates using requestIdleCallback
      requestIdleCallback(() => this.#updateRefs());
    });

    this.roots.forEach(root => {
      this.#mutationObserver.observe(root, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['ref']
      });
    });
  }

  /**
   * Validate required refs exist
   */
  #validateRequiredRefs() {
    if (!this.requiredRefs) return;

    const missingRefs = this.requiredRefs.filter(refName => !this.refs[refName]);
    if (missingRefs.length > 0) {
      throw new Error(`Missing required refs: ${missingRefs.join(', ')}`);
    }
  }

  /**
   * Setup declarative event listeners using 'on:eventName' methods
   */
  #setupEventListeners() {
    const proto = Object.getPrototypeOf(this);
    const eventMethods = Object.getOwnPropertyNames(proto)
      .filter(name => name.startsWith('on:'));

    eventMethods.forEach(methodName => {
      const [, eventName, selector] = methodName.match(/^on:(\w+)(?:\s+(.+))?$/);
      const handler = this[methodName];

      if (selector) {
        // Event delegation với selector
        this.addEventListener(eventName, (event) => {
          if (event.target.matches(selector)) {
            handler.call(this, event);
          }
        });
      } else {
        // Direct event binding
        this.addEventListener(eventName, handler);
      }
    });
  }
}
```

### Usage Example

```javascript
// assets/product-card.js - Example component
import { Component } from '@theme/component';
import { ThemeEvents, VariantUpdateEvent } from '@theme/events';

class ProductCard extends Component {
  // Type-safe refs declaration
  requiredRefs = ['addToCartButton', 'priceElement', 'variantSelector'];

  // Private fields cho state management  
  #isLoading = false;
  #selectedVariant = null;

  connectedCallback() {
    super.connectedCallback();
    this.#setupVariantHandling();
    this.#setupIntersectionObserver();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanup();
  }

  // Getter/setter với reactive updates
  set loading(value) {
    this.#isLoading = Boolean(value);
    this.toggleAttribute('loading', this.#isLoading);
    
    // Update UI state
    if (this.refs.addToCartButton) {
      this.refs.addToCartButton.disabled = this.#isLoading;
    }
  }

  get loading() {
    return this.#isLoading;
  }

  // Declarative event handling - Add to cart
  'on:click [data-action="add-to-cart"]' = async (event) => {
    event.preventDefault();
    
    try {
      this.loading = true;
      await this.#addToCart();
      this.#showSuccessMessage();
    } catch (error) {
      this.#showErrorMessage(error.message);
    } finally {
      this.loading = false;
    }
  };

  // Declarative event handling - Variant selection
  'on:change [data-variant-selector]' = (event) => {
    const variantId = event.target.value;
    this.#updateVariant(variantId);
  };

  // Declarative event handling - Quick view
  'on:click [data-action="quick-view"]' = (event) => {
    event.preventDefault();
    this.#openQuickView();
  };

  /**
   * Setup variant handling với global events
   */
  #setupVariantHandling() {
    // Listen for global variant updates
    document.addEventListener(ThemeEvents.variantUpdate, (event) => {
      if (event.detail.productId === this.dataset.productId) {
        this.#handleVariantUpdate(event.detail);
      }
    });
  }

  /**
   * Setup Intersection Observer cho lazy loading
   */
  #setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.#loadProductData();
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this);
  }

  /**
   * Add product to cart với error handling
   */
  async #addToCart() {
    const formData = new FormData();
    formData.append('id', this.#selectedVariant?.id || this.dataset.variantId);
    formData.append('quantity', 1);

    const response = await fetch('/cart/add.js', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }

    const result = await response.json();
    
    // Dispatch cart update event
    document.dispatchEvent(new CustomEvent(ThemeEvents.cartUpdate, {
      detail: { item: result }
    }));

    return result;
  }

  /**
   * Update variant với DOM morphing
   */
  async #updateVariant(variantId) {
    try {
      // Fetch variant data
      const response = await fetch(`${this.dataset.productUrl}?variant=${variantId}`);
      const html = await response.text();
      
      // Parse response và extract price
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newPriceElement = doc.querySelector('[data-price]');
      
      if (newPriceElement && this.refs.priceElement) {
        // Use DOM morphing cho smooth updates
        const { morph } = await import('@theme/morph');
        morph(this.refs.priceElement, newPriceElement);
      }

      // Dispatch variant selected event
      document.dispatchEvent(new VariantUpdateEvent(
        this.dataset.productId,
        this.id,
        { variantId, available: true }
      ));

    } catch (error) {
      console.error('Failed to update variant:', error);
    }
  }

  #cleanup() {
    // Cleanup observers, abort controllers, etc.
    if (this.#abortController) {
      this.#abortController.abort();
    }
  }
}

// Register custom element
customElements.define('product-card', ProductCard);
```

## 🌐 Global Event System

### Event Architecture

```javascript
// assets/events.js - Centralized event system
/**
 * Global theme events constants
 * Đảm bảo consistency across components
 */
export class ThemeEvents {
  // Product events
  static variantSelected = 'variant:selected';
  static variantUpdate = 'variant:update'; 
  static productView = 'product:view';
  
  // Cart events
  static cartUpdate = 'cart:update';
  static cartOpen = 'cart:open';
  static cartClose = 'cart:close';
  
  // Search events
  static searchQuery = 'search:query';
  static searchResults = 'search:results';
  
  // Navigation events
  static pageTransition = 'page:transition';
  static menuToggle = 'menu:toggle';
}

/**
 * Custom event classes với typed data
 */
export class VariantUpdateEvent extends Event {
  constructor(productId, sourceId, data) {
    super(ThemeEvents.variantUpdate, { 
      bubbles: true,
      cancelable: true 
    });
    
    this.detail = {
      productId,
      sourceId, 
      data: {
        variantId: data.variantId,
        available: data.available,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        ...data
      },
      timestamp: Date.now()
    };
  }
}

export class CartUpdateEvent extends Event {
  constructor(action, item, quantity = 1) {
    super(ThemeEvents.cartUpdate, { bubbles: true });
    
    this.detail = {
      action, // 'add', 'remove', 'update'
      item,
      quantity,
      timestamp: Date.now()
    };
  }
}

/**
 * Event utilities
 */
export class EventHelpers {
  /**
   * Debounce event handler
   */
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle event handler  
   */
  static throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}
```

## 🚀 Performance Optimizations

### DOM Morphing System

```javascript
// assets/morph.js - Efficient DOM updates
/**
 * Morph DOM trees with minimal changes
 * Preserve component state và avoid layout thrashing
 */

const MORPH_OPTIONS = {
  childrenOnly: false,
  skipAttributes: ['data-morph-skip'],
  skipElements: ['script', 'style'],
  beforeAttributeUpdate: null,
  beforeNodeAdded: null,
  beforeNodeRemoved: null
};

export function morph(oldTree, newTree, options = MORPH_OPTIONS) {
  if (options.childrenOnly) {
    updateChildren(newTree, oldTree, options);
    return oldTree;
  }
  
  return walk(newTree, oldTree, options);
}

function walk(newTree, oldTree, options) {
  // Skip elements marked with skip attribute
  if (oldTree.hasAttribute?.('data-morph-skip')) {
    return oldTree;
  }

  // Same node type - update attributes and children
  if (oldTree.nodeType === newTree.nodeType) {
    if (oldTree.nodeType === Node.ELEMENT_NODE) {
      updateAttributes(newTree, oldTree, options);
      updateChildren(newTree, oldTree, options);
    } else if (oldTree.nodeType === Node.TEXT_NODE) {
      if (oldTree.nodeValue !== newTree.nodeValue) {
        oldTree.nodeValue = newTree.nodeValue;
      }
    }
    return oldTree;
  }

  // Different node types - replace entire node
  return replaceNode(newTree, oldTree, options);
}

function updateChildren(newTree, oldTree, options) {
  const newChildren = Array.from(newTree.childNodes);
  const oldChildren = Array.from(oldTree.childNodes);
  
  // Use key-based reconciliation nếu có data-key
  const keyedNew = new Map();
  const keyedOld = new Map();
  
  newChildren.forEach(child => {
    const key = child.dataset?.key;
    if (key) keyedNew.set(key, child);
  });
  
  oldChildren.forEach(child => {
    const key = child.dataset?.key;
    if (key) keyedOld.set(key, child);
  });

  // Efficient diffing algorithm
  let oldIndex = 0;
  let newIndex = 0;

  while (newIndex < newChildren.length || oldIndex < oldChildren.length) {
    const newChild = newChildren[newIndex];
    const oldChild = oldChildren[oldIndex];

    if (!newChild) {
      // Remove remaining old children
      oldChild.remove();
      oldIndex++;
      continue;
    }

    if (!oldChild) {
      // Append remaining new children
      oldTree.appendChild(newChild.cloneNode(true));
      newIndex++;
      continue;
    }

    // Keyed reconciliation
    const newKey = newChild.dataset?.key;
    const oldKey = oldChild.dataset?.key;

    if (newKey && oldKey && newKey !== oldKey) {
      if (keyedOld.has(newKey)) {
        // Move existing keyed element
        const existingNode = keyedOld.get(newKey);
        oldTree.insertBefore(existingNode, oldChild);
        walk(newChild, existingNode, options);
      } else {
        // Insert new keyed element
        oldTree.insertBefore(newChild.cloneNode(true), oldChild);
      }
      newIndex++;
      continue;
    }

    // Regular diffing
    walk(newChild, oldChild, options);
    oldIndex++;
    newIndex++;
  }
}
```

### View Transitions API

```javascript
// assets/view-transitions.js - Modern page transitions
/**
 * Setup View Transitions API cho smooth navigation
 * Graceful degradation cho browsers không support
 */

class ViewTransitions {
  constructor() {
    this.isSupported = 'startViewTransition' in document;
    this.init();
  }

  init() {
    if (!this.isSupported) return;

    // Handle page navigation
    window.addEventListener('pageswap', this.handlePageSwap.bind(this));
    window.addEventListener('pagereveal', this.handlePageReveal.bind(this));
  }

  async handlePageSwap(event) {
    if (!this.hasViewTransition(event)) return;

    const { viewTransition } = event;
    
    // Cancel transition on user interaction (better INP)
    ['pointerdown', 'keydown'].forEach(eventName => {
      document.addEventListener(eventName, () => {
        viewTransition.skipTransition();
      }, { once: true });
    });

    // Setup transition names
    this.setupTransitionNames();

    // Wait for transition to complete
    try {
      await viewTransition.finished;
    } catch (error) {
      // Transition was skipped or failed
      console.debug('View transition cancelled:', error);
    }
  }

  handlePageReveal(event) {
    if (!this.hasViewTransition(event)) return;

    // Animate in new content
    this.animatePageReveal();
  }

  hasViewTransition(event) {
    return event.viewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupTransitionNames() {
    // Set view transition names for hero elements
    const hero = document.querySelector('[data-hero]');
    if (hero) {
      hero.style.viewTransitionName = 'hero';
    }

    // Set transition names for navigation
    const nav = document.querySelector('[data-nav]');
    if (nav) {
      nav.style.viewTransitionName = 'nav';
    }

    // Set transition names for main content
    const main = document.querySelector('main');
    if (main) {
      main.style.viewTransitionName = 'main';
    }
  }

  animatePageReveal() {
    // Custom reveal animations
    const elements = document.querySelectorAll('[data-animate-in]');
    elements.forEach((element, index) => {
      element.style.animationDelay = `${index * 100}ms`;
      element.classList.add('animate-reveal');
    });
  }

  // Manual view transition for SPA-like navigation
  async navigateWithTransition(url) {
    if (!this.isSupported) {
      window.location.href = url;
      return;
    }

    const transition = document.startViewTransition(async () => {
      // Fetch new page
      const response = await fetch(url);
      const html = await response.text();
      
      // Update page content
      const parser = new DOMParser();
      const newDoc = parser.parseFromString(html, 'text/html');
      
      // Morph main content
      const { morph } = await import('@theme/morph');
      morph(document.querySelector('main'), newDoc.querySelector('main'));
      
      // Update title
      document.title = newDoc.title;
      
      // Update URL
      history.pushState(null, '', url);
    });

    return transition.finished;
  }
}

// Initialize view transitions
new ViewTransitions();

// CSS cho view transitions
const transitionStyles = `
  @view-transition {
    navigation: auto;
  }
  
  ::view-transition-old(main) {
    animation: slide-out-left 0.3s ease-out;
  }
  
  ::view-transition-new(main) {
    animation: slide-in-right 0.3s ease-out;
  }
  
  @keyframes slide-out-left {
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
  
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;

// Inject styles
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(transitionStyles);
document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
```

## 📊 Performance Monitoring

```javascript
// assets/performance.js - Built-in performance tracking
/**
 * Theme performance monitoring system
 * Track Core Web Vitals và custom metrics
 */
class ThemePerformance {
  constructor() {
    this.metricPrefix = 'horizon_theme';
    this.init();
  }

  init() {
    // Track Core Web Vitals
    this.trackCoreWebVitals();
    
    // Track custom theme metrics
    this.trackThemeMetrics();
    
    // Setup performance observer
    this.setupPerformanceObserver();
  }

  trackCoreWebVitals() {
    // LCP - Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.recordMetric('lcp', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FID - First Input Delay (deprecated, replaced by INP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.recordMetric('fid', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.recordMetric('cls', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  trackThemeMetrics() {
    // Component initialization time
    this.measureFromEvent('component_init', new Event('component:init'));
    
    // Cart operations
    document.addEventListener('cart:update', (event) => {
      this.measureFromEvent('cart_update', event);
    });

    // Search performance
    document.addEventListener('search:query', (event) => {
      this.measureFromEvent('search_query', event);
    });
  }

  measureFromEvent(benchmarkName, event) {
    const metricName = `${this.metricPrefix}:${benchmarkName}`;
    
    const startMarker = performance.mark(`${metricName}:start`, {
      startTime: event.timeStamp
    });

    // Return function để end measurement
    return {
      end: () => {
        const endMarker = performance.mark(`${metricName}:end`);
        const measure = performance.measure(metricName, startMarker.name, endMarker.name);
        
        this.recordMetric(benchmarkName, measure.duration);
        return measure;
      }
    };
  }

  recordMetric(name, value) {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: `${this.metricPrefix}_${name}`,
        value: Math.round(value)
      });
    }

    // Console log trong development
    if (window.Shopify?.designMode) {
      console.log(`🚀 ${name}: ${value.toFixed(2)}ms`);
    }
  }

  setupPerformanceObserver() {
    // Track long tasks
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      });
    }).observe({ entryTypes: ['longtask'] });
  }
}

// Initialize performance monitoring
new ThemePerformance();
```

## 🔧 Module System và Asset Loading

### ES6 Modules với Import Maps

```html
<!-- layout/theme.liquid - Import maps setup -->
<script type="importmap">
{
  "imports": {
    "@theme/": "{{ 'critical.js' | asset_url | split: 'critical.js' | first }}",
    "@theme/component": "{{ 'component.js' | asset_url }}",
    "@theme/events": "{{ 'events.js' | asset_url }}",
    "@theme/utilities": "{{ 'utilities.js' | asset_url }}",
    "@theme/morph": "{{ 'morph.js' | asset_url }}",
    "@theme/performance": "{{ 'performance.js' | asset_url }}"
  }
}
</script>
```

### Lazy Loading Strategy

```javascript
// assets/utilities.js - Advanced lazy loading
export class LazyLoader {
  static components = new Map();
  static observers = new Map();

  /**
   * Register component cho lazy loading
   */
  static registerComponent(selector, componentPath, options = {}) {
    this.components.set(selector, { componentPath, options });
    this.observeElements(selector);
  }

  /**
   * Observe elements cho lazy loading
   */
  static observeElements(selector) {
    const observer = new IntersectionObserver(
      this.handleIntersection.bind(this, selector),
      {
        rootMargin: '50px', // Load 50px before entering viewport
        threshold: 0.1
      }
    );

    // Observe existing elements
    document.querySelectorAll(selector).forEach(el => {
      if (!el.dataset.lazyLoaded) {
        observer.observe(el);
      }
    });

    this.observers.set(selector, observer);
  }

  /**
   * Handle intersection cho lazy loading
   */
  static async handleIntersection(selector, entries) {
    for (const entry of entries) {
      if (entry.isIntersecting && !entry.target.dataset.lazyLoaded) {
        entry.target.dataset.lazyLoaded = 'true';
        
        const config = this.components.get(selector);
        if (config) {
          await this.loadComponent(config.componentPath, entry.target);
        }
        
        this.observers.get(selector)?.unobserve(entry.target);
      }
    }
  }

  /**
   * Load component dynamically
   */
  static async loadComponent(componentPath, element) {
    try {
      const module = await import(componentPath);
      
      // Initialize component if it has init method
      if (module.default?.init) {
        module.default.init(element);
      }
      
      return module;
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error);
    }
  }
}

// Example usage
LazyLoader.registerComponent(
  '.product-recommendations',
  '/assets/product-recommendations.js'
);

LazyLoader.registerComponent(
  '.slideshow',
  '/assets/slideshow.js'
);
```

## 🎯 Kết Luận

JavaScript architecture của Horizon theme:

### ✅ **Ưu điểm:**
- **🧬 Modern Web Standards**: Web Components, ES6 Modules
- **⚡ Performance-First**: Lazy loading, DOM morphing, View Transitions
- **🎯 Type Safety**: JSDoc annotations, TypeScript-ready
- **🔧 Developer Experience**: Declarative event handling, auto-managed refs
- **📈 Scalability**: Component-based architecture, global event system

### 🔄 **Workflow Integration:**
- **Seamless Liquid Integration**: Section Rendering API
- **Global State Management**: Event-driven architecture  
- **Performance Monitoring**: Built-in metrics tracking
- **Error Handling**: Comprehensive error boundaries

Đây là nền tảng JavaScript hiện đại nhất trong ecosystem Shopify themes hiện tại.