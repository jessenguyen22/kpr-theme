# 🛠️ Implementation Guide - Hướng Dẫn Thực Tế

## 🚀 Getting Started - Bắt Đầu với Horizon Theme

### Prerequisites - Yêu Cầu Tiên Quyết

```bash
# Required tools
- Node.js >= 16.0.0
- Shopify CLI >= 3.0.0
- Git
- Code editor với Liquid syntax support

# Recommended knowledge
- Modern JavaScript (ES6+, Web Components)
- CSS Grid & Flexbox
- Liquid templating
- Shopify theme development basics
```

### Project Setup - Thiết Lập Dự Án

```bash
# 1. Clone theme repository
git clone <horizon-theme-repo>
cd horizon-theme

# 2. Install dependencies (nếu có package.json)
npm install

# 3. Connect to Shopify store
shopify theme dev --store=your-store.myshopify.com

# 4. Start development server
shopify theme serve
```

## 🧩 Creating New Blocks - Tạo Block Mới

### Step 1: Block File Structure

```
blocks/
├── your-new-block.liquid     # Main block file
├── _your-component.liquid    # Component block (optional)
└── special-blocks/
    └── complex-block.liquid  # Complex functionality blocks
```

### Step 2: Basic Block Template

```liquid
<!-- blocks/testimonial-card.liquid -->
{%- comment -%}
  Testimonial Card Block - Khối hiển thị lời chứng thực
  @author Your Name
  @version 1.0.0
  @param {object} block - Block object từ Shopify
{%- endcomment -%}

{%- liquid
  # Xử lý dữ liệu đầu vào
  assign customer_name = block.settings.customer_name | default: 'Anonymous'
  assign rating = block.settings.rating | default: 5
  assign testimonial_text = block.settings.testimonial | strip_html | truncate: 200
  
  # Tạo unique ID cho block
  assign block_id = 'testimonial-' | append: block.id
-%}

<div 
  class="testimonial-card color-{{ block.settings.color_scheme }}"
  id="{{ block_id }}"
  {{ block.shopify_attributes }}
  data-block-type="testimonial"
  data-rating="{{ rating }}"
>
  <!-- Card container với proper semantic HTML -->
  <article class="testimonial-card__content">
    <!-- Rating stars -->
    {% if block.settings.show_rating %}
      <div class="testimonial-card__rating" aria-label="Rating: {{ rating }} out of 5 stars">
        {% for i in (1..5) %}
          <span 
            class="star {% if i <= rating %}star--filled{% endif %}"
            aria-hidden="true"
          >★</span>
        {% endfor %}
      </div>
    {% endif %}

    <!-- Testimonial text -->
    {% if testimonial_text != blank %}
      <blockquote class="testimonial-card__quote">
        <p>{{ testimonial_text }}</p>
      </blockquote>
    {% endif %}

    <!-- Customer info -->
    <footer class="testimonial-card__footer">
      {% if block.settings.customer_avatar %}
        <div class="testimonial-card__avatar">
          {% render 'image',
             image: block.settings.customer_avatar,
             alt: customer_name,
             loading: 'lazy',
             sizes: '60px'
          %}
        </div>
      {% endif %}
      
      <div class="testimonial-card__info">
        <cite class="testimonial-card__name">{{ customer_name }}</cite>
        {% if block.settings.customer_title != blank %}
          <p class="testimonial-card__title">{{ block.settings.customer_title }}</p>
        {% endif %}
      </div>
    </footer>
  </article>
</div>

{% # Inline styles cho performance %}
<style>
  #{{ block_id }} {
    /* CSS custom properties cho theming */
    --testimonial-bg: var(--color-background);
    --testimonial-text: var(--color-foreground);
    --testimonial-border: var(--color-border);
    --star-color: #ffd700;
    
    background: var(--testimonial-bg);
    color: var(--testimonial-text);
    border: 1px solid var(--testimonial-border);
    border-radius: {{ block.settings.border_radius }}px;
    padding: var(--spacing-medium);
    
    /* Modern CSS Grid layout */
    display: grid;
    gap: var(--spacing-small);
    
    /* Animation setup */
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  #{{ block_id }}[data-loaded="true"] {
    opacity: 1;
    transform: translateY(0);
  }
  
  .testimonial-card__rating {
    display: flex;
    gap: 2px;
    font-size: 1.2em;
  }
  
  .star--filled {
    color: var(--star-color);
  }
  
  .testimonial-card__quote {
    margin: 0;
    font-style: italic;
    font-size: var(--font-size-base);
    line-height: var(--line-height-relaxed);
  }
  
  .testimonial-card__footer {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);
    margin-top: var(--spacing-small);
  }
  
  .testimonial-card__avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .testimonial-card__name {
    font-weight: 600;
    font-style: normal;
  }
  
  .testimonial-card__title {
    font-size: var(--font-size-small);
    color: var(--color-foreground-secondary);
    margin: 0;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    #{{ block_id }} {
      padding: var(--spacing-small);
    }
    
    .testimonial-card__footer {
      flex-direction: column;
      text-align: center;
    }
  }
</style>

{% # Schema definition %}
{% schema %}
{
  "name": "Testimonial Card",
  "settings": [
    {
      "type": "header",
      "content": "Nội dung testimonial"
    },
    {
      "type": "richtext",
      "id": "testimonial",
      "label": "Nội dung testimonial", 
      "default": "<p>Sản phẩm tuyệt vời! Tôi rất hài lòng với chất lượng và dịch vụ.</p>"
    },
    {
      "type": "text",
      "id": "customer_name",
      "label": "Tên khách hàng",
      "default": "Nguyễn Văn A"
    },
    {
      "type": "text", 
      "id": "customer_title",
      "label": "Chức danh khách hàng",
      "placeholder": "VD: CEO, Công ty ABC"
    },
    {
      "type": "image_picker",
      "id": "customer_avatar",
      "label": "Ảnh đại diện khách hàng"
    },
    {
      "type": "header",
      "content": "Đánh giá"
    },
    {
      "type": "checkbox",
      "id": "show_rating",
      "label": "Hiển thị đánh giá sao",
      "default": true
    },
    {
      "type": "range",
      "id": "rating",
      "label": "Số sao đánh giá",
      "min": 1,
      "max": 5,
      "step": 1,
      "default": 5
    },
    {
      "type": "header",
      "content": "Giao diện"
    },
    {
      "type": "color_scheme",
      "id": "color_scheme",
      "label": "Color scheme",
      "default": "scheme-1"
    },
    {
      "type": "range",
      "id": "border_radius",
      "label": "Bo góc (px)", 
      "min": 0,
      "max": 50,
      "step": 2,
      "default": 8
    },
    {
      "type": "header",
      "content": "Animation"
    },
    {
      "type": "checkbox",
      "id": "enable_animation",
      "label": "Bật hiệu ứng khi scroll",
      "default": true
    },
    {
      "type": "range",
      "id": "animation_delay",
      "label": "Độ trễ animation (ms)",
      "min": 0,
      "max": 1000,
      "step": 100,
      "default": 200,
      "visible_if": "{{ block.settings.enable_animation }}"
    }
  ],
  "presets": [
    {
      "name": "Testimonial Card",
      "category": "Social Proof",
      "settings": {
        "testimonial": "<p>Sản phẩm chất lượng cao, giao hàng nhanh chóng. Tôi sẽ quay lại mua thêm!</p>",
        "customer_name": "Mai Thị B",
        "customer_title": "Khách hàng thân thiết",
        "rating": 5,
        "show_rating": true
      }
    }
  ]
}
{% endschema %}
```

### Step 3: JavaScript Enhancement (Optional)

```javascript
// assets/testimonial-card.js
import { Component } from '@theme/component';
import { scheduler } from '@theme/utilities';

/**
 * Testimonial Card Component với advanced features
 */
class TestimonialCard extends Component {
  // Required refs cho component
  requiredRefs = ['quote', 'rating'];
  
  // Private state
  #intersectionObserver = null;
  #isAnimated = false;

  connectedCallback() {
    super.connectedCallback();
    this.#setupIntersectionObserver();
    this.#setupAccessibility();
    this.#trackImpression();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#cleanup();
  }

  /**
   * Setup Intersection Observer cho scroll animations
   */
  #setupIntersectionObserver() {
    if (!this.dataset.enableAnimation) return;

    this.#intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.#isAnimated) {
            this.#animateIn();
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

  /**
   * Animate testimonial into view
   */
  #animateIn() {
    this.#isAnimated = true;
    
    const delay = parseInt(this.dataset.animationDelay) || 0;
    
    setTimeout(() => {
      scheduler.mutate(() => {
        this.dataset.loaded = 'true';
        this.style.animationDelay = '0ms';
      });
    }, delay);

    // Track animation completion
    this.addEventListener('transitionend', () => {
      this.#trackAnimationComplete();
    }, { once: true });
  }

  /**
   * Setup accessibility features
   */
  #setupAccessibility() {
    // Add proper ARIA labels
    const rating = parseInt(this.dataset.rating) || 5;
    const ratingElement = this.refs.rating;
    
    if (ratingElement) {
      scheduler.mutate(() => {
        ratingElement.setAttribute('aria-label', `Đánh giá ${rating} trên 5 sao`);
        ratingElement.setAttribute('role', 'img');
      });
    }

    // Add keyboard navigation support
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'article');
    this.setAttribute('aria-label', 'Lời chứng thực từ khách hàng');
  }

  /**
   * Track testimonial impression cho analytics
   */
  #trackImpression() {
    // Only track once when testimonial becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.#sendImpressionEvent();
            observer.unobserve(this);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(this);
  }

  /**
   * Send impression event to analytics
   */
  #sendImpressionEvent() {
    const customerName = this.querySelector('.testimonial-card__name')?.textContent;
    const rating = this.dataset.rating;

    // Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_impression', {
        'customer_name': customerName,
        'rating': rating,
        'block_id': this.id
      });
    }

    // Custom analytics
    if (window.theme?.analytics) {
      window.theme.analytics.track('testimonial_viewed', {
        customerName,
        rating: parseInt(rating),
        blockId: this.id,
        timestamp: Date.now()
      });
    }
  }

  #trackAnimationComplete() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_animation_complete', {
        'block_id': this.id,
        'animation_delay': this.dataset.animationDelay
      });
    }
  }

  /**
   * Cleanup observers
   */
  #cleanup() {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
    }
  }

  // Declarative event handling
  'on:click' = (event) => {
    // Track testimonial clicks
    this.#trackClick(event);
  };

  'on:keydown' = (event) => {
    // Handle keyboard accessibility
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.click();
    }
  };

  #trackClick(event) {
    const customerName = this.querySelector('.testimonial-card__name')?.textContent;
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'testimonial_click', {
        'customer_name': customerName,
        'rating': this.dataset.rating,
        'block_id': this.id
      });
    }
  }
}

// Register custom element
customElements.define('testimonial-card', TestimonialCard);

// Auto-initialize existing elements
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.testimonial-card').forEach(element => {
    if (!element.matches('testimonial-card')) {
      // Upgrade existing elements to custom elements
      element.outerHTML = element.outerHTML.replace('<div', '<testimonial-card').replace('</div>', '</testimonial-card>');
    }
  });
});
```

## 🎨 Creating Complex Sections - Tạo Section Phức Tạp

### Advanced Section Example: Product Showcase

```liquid
<!-- sections/product-showcase.liquid -->
{%- comment -%}
  Product Showcase Section - Hiển thị sản phẩm nổi bật với filtering
  Sử dụng blocks system để tạo layout linh hoạt
{%- endcomment -%}

{%- liquid
  # Xử lý collection data
  assign collection = collections[section.settings.collection] | default: collections.all
  assign products_per_page = section.settings.products_per_page | default: 12
  assign enable_filtering = section.settings.enable_filtering | default: false
  
  # Tạo unique section ID
  assign section_id = 'product-showcase-' | append: section.id
-%}

<div 
  class="product-showcase section-{{ section_id }}"
  data-section-id="{{ section.id }}"
  data-section-type="product-showcase"
  data-collection-handle="{{ collection.handle }}"
>
  <!-- Section header -->
  {% if section.settings.show_header %}
    <header class="product-showcase__header">
      {% for block in section.blocks %}
        {% case block.type %}
          {% when 'heading' %}
            {% render 'blocks/_heading', block: block %}
          {% when 'text' %}
            {% render 'blocks/_content', block: block %}
          {% when 'button' %}
            {% render 'blocks/button', block: block %}
        {% endcase %}
      {% endfor %}
    </header>
  {% endif %}

  <!-- Filtering controls -->
  {% if enable_filtering %}
    <div class="product-showcase__filters" data-filters>
      <!-- Category filter -->
      <div class="filter-group">
        <label for="category-filter-{{ section.id }}" class="filter-label">
          Danh mục:
        </label>
        <select 
          id="category-filter-{{ section.id }}"
          class="filter-select"
          data-filter-type="category"
        >
          <option value="">Tất cả danh mục</option>
          {% for product in collection.products %}
            {% for tag in product.tags %}
              {% unless tag contains '_' %}
                <option value="{{ tag | handle }}">{{ tag }}</option>
              {% endunless %}
            {% endfor %}
          {% endfor %}
        </select>
      </div>

      <!-- Price range filter -->
      <div class="filter-group">
        <label class="filter-label">Khoảng giá:</label>
        <div class="price-range-filter">
          <input 
            type="range" 
            id="price-min-{{ section.id }}"
            class="price-range-input"
            data-filter-type="price-min"
            min="0" 
            max="{{ collection.products | map: 'price' | sort | last }}"
            value="0"
          >
          <input 
            type="range"
            id="price-max-{{ section.id }}" 
            class="price-range-input"
            data-filter-type="price-max"
            min="0"
            max="{{ collection.products | map: 'price' | sort | last }}"
            value="{{ collection.products | map: 'price' | sort | last }}"
          >
        </div>
      </div>

      <!-- Sort options -->
      <div class="filter-group">
        <label for="sort-filter-{{ section.id }}" class="filter-label">
          Sắp xếp:
        </label>
        <select 
          id="sort-filter-{{ section.id }}"
          class="filter-select"
          data-filter-type="sort"
        >
          <option value="manual">Thứ tự mặc định</option>
          <option value="price-ascending">Giá: Thấp đến cao</option>
          <option value="price-descending">Giá: Cao đến thấp</option>
          <option value="title-ascending">Tên: A-Z</option>
          <option value="created-descending">Mới nhất</option>
        </select>
      </div>
    </div>
  {% endif %}

  <!-- Products grid -->
  <div 
    class="product-showcase__grid"
    data-products-container
    data-layout="{{ section.settings.grid_layout }}"
  >
    {% for product in collection.products limit: products_per_page %}
      <div 
        class="product-showcase__item"
        data-product-id="{{ product.id }}"
        data-product-price="{{ product.price }}"
        data-product-tags="{{ product.tags | join: ',' }}"
        data-product-created="{{ product.created_at | date: '%s' }}"
      >
        {% render 'blocks/product-card', 
           product: product,
           show_vendor: section.settings.show_vendor,
           show_rating: section.settings.show_rating,
           enable_quick_add: section.settings.enable_quick_add
        %}
      </div>
    {% endfor %}
  </div>

  <!-- Load more button -->
  {% if collection.products.size > products_per_page %}
    <div class="product-showcase__load-more">
      <button 
        class="button button--secondary"
        data-load-more
        data-page="1"
        data-total-pages="{{ collection.products.size | divided_by: products_per_page | ceil }}"
      >
        Xem thêm sản phẩm
        <span class="loading-spinner" hidden></span>
      </button>
    </div>
  {% endif %}
</div>

<!-- CSS styles -->
<style>
  .product-showcase {
    container-type: inline-size;
    padding: var(--spacing-section) 0;
  }
  
  .product-showcase__header {
    text-align: center;
    margin-bottom: var(--spacing-large);
  }
  
  .product-showcase__filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-medium);
    margin-bottom: var(--spacing-large);
    padding: var(--spacing-medium);
    background: var(--color-background-secondary);
    border-radius: var(--border-radius);
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-small);
  }
  
  .filter-label {
    font-weight: 600;
    font-size: var(--font-size-small);
  }
  
  .filter-select,
  .price-range-input {
    padding: var(--spacing-small);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-small);
    background: var(--color-background);
  }
  
  .product-showcase__grid {
    display: grid;
    gap: var(--spacing-medium);
    
    /* Default grid layout */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .product-showcase__grid[data-layout="2-columns"] {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .product-showcase__grid[data-layout="3-columns"] {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .product-showcase__grid[data-layout="4-columns"] {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .product-showcase__item {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
  }
  
  .product-showcase__item[data-loaded="true"] {
    opacity: 1;
    transform: translateY(0);
  }
  
  .product-showcase__item[data-filtered="false"] {
    display: none;
  }
  
  .product-showcase__load-more {
    text-align: center;
    margin-top: var(--spacing-large);
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-border);
    border-top: 2px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    margin-left: var(--spacing-small);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Container queries cho responsive design */
  @container (max-width: 768px) {
    .product-showcase__grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .product-showcase__filters {
      grid-template-columns: 1fr;
    }
  }
  
  @container (max-width: 480px) {
    .product-showcase__grid {
      grid-template-columns: 1fr;
    }
  }
</style>

{% schema %}
{
  "name": "Product Showcase",
  "settings": [
    {
      "type": "header",
      "content": "Collection Settings"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection",
      "default": "frontpage"
    },
    {
      "type": "range",
      "id": "products_per_page",
      "label": "Số sản phẩm hiển thị",
      "min": 4,
      "max": 24,
      "step": 4,
      "default": 12
    },
    {
      "type": "checkbox",
      "id": "enable_filtering",
      "label": "Bật filtering",
      "default": true
    },
    {
      "type": "header",
      "content": "Layout Settings"
    },
    {
      "type": "select",
      "id": "grid_layout",
      "label": "Grid layout",
      "options": [
        { "value": "auto", "label": "Auto (responsive)" },
        { "value": "2-columns", "label": "2 cột" },
        { "value": "3-columns", "label": "3 cột" },
        { "value": "4-columns", "label": "4 cột" }
      ],
      "default": "auto"
    },
    {
      "type": "checkbox",
      "id": "show_header",
      "label": "Hiển thị header",
      "default": true
    },
    {
      "type": "header",
      "content": "Product Card Settings"
    },
    {
      "type": "checkbox",
      "id": "show_vendor",
      "label": "Hiển thị thương hiệu",
      "default": false
    },
    {
      "type": "checkbox",
      "id": "show_rating",
      "label": "Hiển thị đánh giá",
      "default": true
    },
    {
      "type": "checkbox",
      "id": "enable_quick_add",
      "label": "Bật quick add",
      "default": true
    }
  ],
  "blocks": [
    {
      "type": "heading",
      "name": "Heading",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "Heading text",
          "default": "Featured Products"
        }
      ]
    },
    {
      "type": "text",
      "name": "Text",
      "limit": 1,
      "settings": [
        {
          "type": "richtext",
          "id": "text",
          "label": "Text content",
          "default": "<p>Discover our best-selling products</p>"
        }
      ]
    },
    {
      "type": "button",
      "name": "Button",
      "limit": 1
    }
  ],
  "presets": [
    {
      "name": "Product Showcase",
      "category": "Product",
      "blocks": [
        {
          "type": "heading",
          "settings": {
            "heading": "Sản phẩm nổi bật"
          }
        },
        {
          "type": "text",
          "settings": {
            "text": "<p>Khám phá những sản phẩm bán chạy nhất của chúng tôi</p>"
          }
        }
      ],
      "settings": {
        "collection": "frontpage",
        "products_per_page": 8,
        "enable_filtering": true,
        "grid_layout": "auto"
      }
    }
  ]
}
{% endschema %}
```

### JavaScript for Complex Section

```javascript
// assets/product-showcase.js
import { Component } from '@theme/component';
import { requestManager } from '@theme/utilities';

/**
 * Product Showcase Section với filtering và infinite scroll
 */
class ProductShowcase extends Component {
  requiredRefs = ['productsContainer', 'loadMoreButton'];
  
  // Private state
  #currentPage = 1;
  #totalPages = 1;
  #isLoading = false;
  #filters = {
    category: '',
    priceMin: 0,
    priceMax: 999999,
    sort: 'manual'
  };

  connectedCallback() {
    super.connectedCallback();
    this.#setupFiltering();
    this.#setupInfiniteScroll();
    this.#animateInitialProducts();
  }

  /**
   * Setup filtering functionality
   */
  #setupFiltering() {
    const filterElements = this.querySelectorAll('[data-filter-type]');
    
    filterElements.forEach(element => {
      const filterType = element.dataset.filterType;
      
      element.addEventListener('change', (event) => {
        this.#updateFilter(filterType, event.target.value);
        this.#applyFilters();
      });
    });
  }

  #updateFilter(type, value) {
    switch (type) {
      case 'category':
        this.#filters.category = value;
        break;
      case 'price-min':
        this.#filters.priceMin = parseInt(value);
        break;
      case 'price-max':
        this.#filters.priceMax = parseInt(value);
        break;
      case 'sort':
        this.#filters.sort = value;
        break;
    }
  }

  #applyFilters() {
    const productItems = this.querySelectorAll('.product-showcase__item');
    let visibleProducts = [];

    productItems.forEach(item => {
      const productData = {
        tags: item.dataset.productTags.split(','),
        price: parseInt(item.dataset.productPrice),
        created: parseInt(item.dataset.productCreated),
        element: item
      };

      let shouldShow = true;

      // Category filter
      if (this.#filters.category && !productData.tags.includes(this.#filters.category)) {
        shouldShow = false;
      }

      // Price range filter
      if (productData.price < this.#filters.priceMin || productData.price > this.#filters.priceMax) {
        shouldShow = false;
      }

      // Show/hide product
      item.dataset.filtered = shouldShow;
      
      if (shouldShow) {
        visibleProducts.push(productData);
      }
    });

    // Apply sorting
    this.#sortProducts(visibleProducts);
    
    // Track filter usage
    this.#trackFilterUsage();
  }

  #sortProducts(products) {
    const container = this.refs.productsContainer;
    
    // Sort products array
    products.sort((a, b) => {
      switch (this.#filters.sort) {
        case 'price-ascending':
          return a.price - b.price;
        case 'price-descending':
          return b.price - a.price;
        case 'title-ascending':
          return a.element.querySelector('.product-card__title').textContent.localeCompare(
            b.element.querySelector('.product-card__title').textContent
          );
        case 'created-descending':
          return b.created - a.created;
        default:
          return 0;
      }
    });

    // Reorder DOM elements
    products.forEach(product => {
      container.appendChild(product.element);
    });
  }

  /**
   * Setup infinite scroll/load more
   */
  #setupInfiniteScroll() {
    if (!this.refs.loadMoreButton) return;
    
    this.#totalPages = parseInt(this.refs.loadMoreButton.dataset.totalPages);
    
    // Load more button click
    this.refs.loadMoreButton.addEventListener('click', () => {
      this.#loadMoreProducts();
    });

    // Optional: Auto-load on scroll
    if (this.dataset.autoLoad === 'true') {
      this.#setupScrollLoading();
    }
  }

  async #loadMoreProducts() {
    if (this.#isLoading || this.#currentPage >= this.#totalPages) return;

    this.#isLoading = true;
    this.#showLoadingState();

    try {
      const nextPage = this.#currentPage + 1;
      const collectionHandle = this.dataset.collectionHandle;
      
      // Fetch next page
      const url = `/collections/${collectionHandle}?page=${nextPage}&view=ajax`;
      const response = await requestManager.fetch(url);
      const html = await response.text();

      // Parse response
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newProducts = doc.querySelectorAll('.product-showcase__item');

      // Add products to container
      newProducts.forEach(product => {
        this.refs.productsContainer.appendChild(product);
      });

      this.#currentPage = nextPage;

      // Update button state
      if (this.#currentPage >= this.#totalPages) {
        this.refs.loadMoreButton.style.display = 'none';
      }

      // Animate new products
      this.#animateNewProducts(newProducts);

      // Track load more usage
      this.#trackLoadMore();

    } catch (error) {
      console.error('Failed to load more products:', error);
      this.#showErrorState();
    } finally {
      this.#isLoading = false;
      this.#hideLoadingState();
    }
  }

  #setupScrollLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.#isLoading) {
          this.#loadMoreProducts();
        }
      });
    }, { threshold: 0.1 });

    if (this.refs.loadMoreButton) {
      observer.observe(this.refs.loadMoreButton);
    }
  }

  #animateInitialProducts() {
    const products = this.querySelectorAll('.product-showcase__item');
    
    products.forEach((product, index) => {
      setTimeout(() => {
        product.dataset.loaded = 'true';
      }, index * 100);
    });
  }

  #animateNewProducts(products) {
    products.forEach((product, index) => {
      setTimeout(() => {
        product.dataset.loaded = 'true';
      }, index * 100);
    });
  }

  #showLoadingState() {
    const spinner = this.refs.loadMoreButton.querySelector('.loading-spinner');
    if (spinner) {
      spinner.removeAttribute('hidden');
    }
    
    this.refs.loadMoreButton.disabled = true;
    this.refs.loadMoreButton.textContent = 'Đang tải...';
  }

  #hideLoadingState() {
    const spinner = this.refs.loadMoreButton.querySelector('.loading-spinner');
    if (spinner) {
      spinner.setAttribute('hidden', '');
    }
    
    this.refs.loadMoreButton.disabled = false;
    this.refs.loadMoreButton.textContent = 'Xem thêm sản phẩm';
  }

  #showErrorState() {
    this.refs.loadMoreButton.textContent = 'Thử lại';
    this.refs.loadMoreButton.classList.add('button--error');
  }

  #trackFilterUsage() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'product_filter_applied', {
        'section_id': this.dataset.sectionId,
        'filters': JSON.stringify(this.#filters)
      });
    }
  }

  #trackLoadMore() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'products_load_more', {
        'section_id': this.dataset.sectionId,
        'page': this.#currentPage,
        'total_pages': this.#totalPages
      });
    }
  }
}

// Register custom element
customElements.define('product-showcase', ProductShowcase);

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-section-type="product-showcase"]').forEach(element => {
    if (!element.matches('product-showcase')) {
      // Upgrade to custom element
      const showcase = document.createElement('product-showcase');
      Array.from(element.attributes).forEach(attr => {
        showcase.setAttribute(attr.name, attr.value);
      });
      showcase.innerHTML = element.innerHTML;
      element.parentNode.replaceChild(showcase, element);
    }
  });
});
```

## 🎯 Best Practices Summary

### ✅ **Development Best Practices:**

1. **Semantic HTML**: Luôn sử dụng proper HTML5 elements
2. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
3. **Performance**: Lazy loading, image optimization, code splitting
4. **Responsive Design**: Container queries, mobile-first approach
5. **Error Handling**: Try-catch blocks, graceful degradation
6. **Analytics**: Track user interactions và performance metrics
7. **Documentation**: JSDoc comments, inline explanations
8. **Testing**: Cross-browser testing, accessibility audits

### 🔧 **Technical Implementation:**

1. **Use Component Architecture**: Web Components cho reusability
2. **Optimize Critical Path**: Inline critical CSS, defer non-critical JS
3. **Implement Progressive Enhancement**: Core functionality works without JS
4. **Cache Strategy**: Request deduplication, response caching
5. **Bundle Optimization**: ES6 modules, tree-shaking, lazy imports
6. **Performance Monitoring**: Web Vitals tracking, custom metrics

### 📊 **Quality Assurance:**

1. **Code Reviews**: Peer review cho mọi changes
2. **Testing Checklist**: Functionality, performance, accessibility
3. **Browser Support**: Test trên major browsers
4. **Mobile Testing**: Various devices và screen sizes
5. **Performance Audits**: Lighthouse scores, real user metrics
6. **A/B Testing**: Test different implementations