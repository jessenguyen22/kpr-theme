# 🧩 Hệ Thống Blocks - Hướng Dẫn Chi Tiết

## 🌟 Đặc Điểm Cách Mạng của Blocks System

Horizon theme giới thiệu một kiến trúc **blocks system** hoàn toàn mới, khác biệt hoàn toàn với approach truyền thống của Dawn theme. Đây là điểm đột phá chính làm nên sự khác biệt.

### Cấu trúc Blocks Directory

```
blocks/
├── _component-blocks/        # Blocks với prefix _ (không standalone)
│   ├── _heading.liquid      # Component heading
│   ├── _content.liquid      # Content wrapper
│   ├── _image.liquid        # Image component
│   └── _media.liquid        # Media wrapper
├── standalone-blocks/        # Blocks có thể sử dụng độc lập
│   ├── button.liquid        # Button block
│   ├── text.liquid          # Text block
│   ├── image.liquid         # Image block
│   └── video.liquid         # Video block
└── special-blocks/          # Blocks cho specific contexts
    ├── accordion.liquid     # Accordion component
    ├── slideshow.liquid     # Slideshow component
    └── product-card.liquid  # Product card
```

## 🏗️ Kiến Trúc Blocks

### 1. Component Blocks (prefix `_`)

**Component blocks** không thể sử dụng độc lập, chúng được design để được gọi bởi các blocks khác:

```liquid
<!-- blocks/_heading.liquid -->
{%- doc -%}
  Renders a heading block.
  @param {string} text - Văn bản hiển thị
  @param {object} block - Block object từ Shopify
{%- enddoc -%}

{% render 'text', width: '100%', block: block, fallback_text: text %}

{% schema %}
{
  "name": "t:names.heading",
  "tag": null,  // Quan trọng: null để không hiển thị trong editor
  "settings": [
    {
      "type": "select",
      "id": "type_preset",
      "label": "t:settings.preset",
      "options": [
        { "value": "h1", "label": "t:options.h1" },
        { "value": "h2", "label": "t:options.h2" },
        { "value": "custom", "label": "t:options.custom" }
      ],
      "default": "rte"
    }
    // ... more settings
  ]
}
{% endschema %}
```

### 2. Standalone Blocks

**Standalone blocks** có thể được sử dụng trực tiếp trong theme editor:

```liquid
<!-- blocks/button.liquid -->
{% render 'button', link: block.settings.link %}

{% schema %}
{
  "name": "t:names.button",
  "tag": null,
  "settings": [
    {
      "type": "text",
      "id": "label",
      "label": "t:settings.label",
      "default": "t:text_defaults.button_label"
    },
    {
      "type": "url",
      "id": "link", 
      "label": "t:settings.link"
    },
    {
      "type": "select",
      "id": "style_class",
      "label": "t:settings.style",
      "options": [
        { "value": "button", "label": "t:options.primary" },
        { "value": "button-secondary", "label": "t:options.secondary" },
        { "value": "link", "label": "t:options.link" }
      ],
      "default": "button"
    }
  ],
  "presets": [
    {
      "name": "t:names.button",
      "category": "t:categories.basic",
      "settings": {
        "link": "shopify://collections/all"
      }
    }
  ]
}
{% endschema %}
```

## 🔄 Data Flow và Composition

### Universal Section: `sections/_blocks.liquid`

```liquid
<!-- sections/_blocks.liquid - Section tổng quát nhận tất cả blocks -->
{% capture children %}
  {% content_for 'blocks' %}  
  {%- comment -%} Thu thập tất cả blocks được add trong theme editor {%- endcomment -%}
{% endcapture %}

{% render 'section', section: section, children: children %}
{%- comment -%} Render wrapper section với styling và layout {%- endcomment -%}

{% schema %}
{
  "name": "t:names.section",
  "class": "section-wrapper",
  "blocks": [
    {
      "type": "@theme"  // Cho phép tất cả theme blocks
    },
    {
      "type": "@app"    // Cho phép app blocks
    },
    {
      "type": "_divider" // Specific block types
    }
  ],
  "settings": [
    // Layout settings
    {
      "type": "select",
      "id": "content_direction",
      "label": "t:settings.direction",
      "options": [
        { "value": "column", "label": "t:options.vertical" },
        { "value": "row", "label": "t:options.horizontal" }
      ],
      "default": "column"
    }
    // ... more settings
  ]
}
{% endschema %}
```

### Section Wrapper: `snippets/section.liquid`

```liquid
<!-- snippets/section.liquid - Universal section wrapper -->
{%- doc -%}
  Renders a wrapper section
  @param {section} section - The section object
  @param {string} children - The children of the section
{%- enddoc -%}

<div class="section-background color-{{ section.settings.color_scheme }}"></div>
<div
  class="section section--{{ section.settings.section_width }} color-{{ section.settings.color_scheme }}"
  {% if request.visual_preview_mode %}data-shopify-visual-preview{% endif %}
  style="
    {% if section.settings.section_height == 'custom' %}
      --section-min-height: {{ section.settings.section_height_custom }}svh;
    {% endif %}
  "
>
  <!-- Background media -->
  <div class="custom-section-background">
    {% render 'background-media',
      background_media: section.settings.background_media,
      background_video: section.settings.video,
      background_image: section.settings.background_image
    %}
  </div>

  <!-- Content wrapper -->
  <div class="border-style custom-section-content">
    {% if section.settings.toggle_overlay %}
      {% render 'overlay', settings: section.settings %}
    {% endif %}

    <div
      class="
        spacing-style
        layout-panel-flex
        layout-panel-flex--{{ section.settings.content_direction }}
        section-content-wrapper
        {% if section.settings.vertical_on_mobile %} mobile-column{% endif %}
      "
      style="{% render 'layout-panel-style', settings: section.settings %}"
    >
      {{ children }}  
      {%- comment -%} Đây là nơi các blocks được render {%- endcomment -%}
    </div>
  </div>
</div>
```

## 🎨 Tạo Block Mới - Step by Step

### Bước 1: Tạo Block Schema

```liquid
<!-- blocks/custom-banner.liquid -->
{%- comment -%}
  Custom Banner Block - Khối banner tùy chỉnh
  @param {object} block - Block object từ Shopify
{%- endcomment -%}

<div 
  class="custom-banner color-{{ block.settings.color_scheme }}"
  style="
    {% if block.settings.height %}height: {{ block.settings.height }}px;{% endif %}
  "
  {{ block.shopify_attributes }}
>
  <div class="custom-banner__content">
    {% if block.settings.title != blank %}
      <h2 class="custom-banner__title">{{ block.settings.title }}</h2>
    {% endif %}
    
    {% if block.settings.description != blank %}
      <div class="custom-banner__description">
        {{ block.settings.description }}
      </div>
    {% endif %}
    
    {% if block.settings.button_label != blank and block.settings.button_link != blank %}
      <a href="{{ block.settings.button_link }}" class="button custom-banner__button">
        {{ block.settings.button_label }}
      </a>
    {% endif %}
  </div>
</div>

{% schema %}
{
  "name": "Custom Banner",
  "settings": [
    {
      "type": "header",
      "content": "Nội dung"
    },
    {
      "type": "text",
      "id": "title",
      "label": "Tiêu đề",
      "default": "Banner title"
    },
    {
      "type": "richtext", 
      "id": "description",
      "label": "Mô tả",
      "default": "<p>Mô tả cho banner</p>"
    },
    {
      "type": "text",
      "id": "button_label", 
      "label": "Text button"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Link button"
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
      "id": "height",
      "label": "Chiều cao (px)",
      "min": 200,
      "max": 800,
      "step": 50,
      "default": 400
    }
  ],
  "presets": [
    {
      "name": "Custom Banner",
      "category": "Promotional",
      "settings": {
        "title": "Welcome to our store",
        "description": "<p>Discover amazing products</p>",
        "button_label": "Shop now"
      }
    }
  ]
}
{% endschema %}
```

### Bước 2: CSS Styling

```css
/* Trong assets/base.css hoặc tạo file riêng */

.custom-banner {
  /* Modern CSS Grid layout */
  display: grid;
  place-items: center;
  min-height: 400px;
  
  /* CSS Custom Properties để support theming */
  background: var(--color-background);
  color: var(--color-foreground);
  
  /* Logical properties cho RTL support */
  padding-block: var(--spacing-large);
  padding-inline: var(--spacing-medium);
  
  /* Border radius từ theme settings */
  border-radius: var(--border-radius);
}

.custom-banner__content {
  text-align: center;
  max-width: 600px;
  
  /* CSS Grid cho automatic spacing */
  display: grid;
  gap: var(--spacing-medium);
  justify-items: center;
}

.custom-banner__title {
  /* Typography scale từ theme */
  font-size: var(--font-heading-scale);
  line-height: var(--font-heading-line-height);
  font-family: var(--font-heading-family);
  margin: 0;
}

.custom-banner__description {
  /* Rich text styling */
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
}

.custom-banner__button {
  /* Button styling kế thừa từ theme */
  margin-top: var(--spacing-small);
}

/* Responsive design với container queries */
@container (min-width: 768px) {
  .custom-banner {
    padding-block: var(--spacing-extra-large);
  }
  
  .custom-banner__content {
    max-width: 800px;
  }
}
```

### Bước 3: JavaScript (nếu cần)

```javascript
// assets/custom-banner.js
import { Component } from '@theme/component';

class CustomBanner extends Component {
  // Khai báo required refs cho type safety
  requiredRefs = ['button'];
  
  connectedCallback() {
    super.connectedCallback();
    this.#setupAnimations();
    this.#setupTracking();
  }
  
  #setupAnimations() {
    // Intersection Observer cho reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(this);
  }
  
  #setupTracking() {
    // Track banner impressions
    this.trackImpression();
  }
  
  // Declarative event handling
  'on:click .custom-banner__button' = (event) => {
    // Custom analytics tracking
    this.trackBannerClick(event.target.href);
    
    // Optional: Add loading state
    event.target.classList.add('loading');
  };
  
  trackImpression() {
    // Analytics tracking cho banner impression
    if (typeof gtag !== 'undefined') {
      gtag('event', 'banner_impression', {
        'banner_title': this.querySelector('.custom-banner__title')?.textContent,
        'banner_position': this.dataset.position || 'unknown'
      });
    }
  }
  
  trackBannerClick(url) {
    // Analytics tracking cho banner click
    if (typeof gtag !== 'undefined') {
      gtag('event', 'banner_click', {
        'banner_title': this.querySelector('.custom-banner__title')?.textContent,
        'destination_url': url
      });
    }
  }
}

// Đăng ký custom element
customElements.define('custom-banner', CustomBanner);
```

## 🔧 Advanced Block Patterns

### Composite Blocks

```liquid
<!-- blocks/hero-section.liquid - Complex block using multiple components -->
<div class="hero-section" {{ block.shopify_attributes }}>
  <!-- Background media -->
  {% if block.settings.background_image %}
    {% render 'blocks/_media', 
       image: block.settings.background_image,
       position: block.settings.image_position,
       lazy: false 
    %}
  {% endif %}
  
  <!-- Content area -->
  <div class="hero-content">
    <!-- Heading component -->
    {% render 'blocks/_heading',
       text: block.settings.heading,
       level: block.settings.heading_level,
       alignment: block.settings.text_alignment
    %}
    
    <!-- Text content -->
    {% if block.settings.text != blank %}
      {% render 'blocks/_content',
         content: block.settings.text,
         alignment: block.settings.text_alignment
      %}
    {% endif %}
    
    <!-- Call to action buttons -->
    {% if block.settings.button_1_label != blank %}
      {% render 'blocks/button',
         label: block.settings.button_1_label,
         link: block.settings.button_1_link,
         style: block.settings.button_1_style
      %}
    {% endif %}
  </div>
</div>
```

### Conditional Block Rendering

```liquid
<!-- blocks/conditional-content.liquid -->
{% liquid
  # Logic để hiển thị block dựa trên conditions
  assign show_block = true
  
  # Kiểm tra customer status
  if block.settings.customer_only and customer == null
    assign show_block = false
  endif
  
  # Kiểm tra device type
  if block.settings.mobile_only and request.design_mode == false
    assign show_block = false
  endif
  
  # Kiểm tra date range
  if block.settings.start_date and block.settings.end_date
    assign current_date = 'now' | date: '%Y-%m-%d'
    if current_date < block.settings.start_date or current_date > block.settings.end_date
      assign show_block = false
    endif
  endif
%}

{% if show_block %}
  <div class="conditional-content" {{ block.shopify_attributes }}>
    {{ block.settings.content }}
  </div>
{% endif %}
```

## 🎯 Best Practices

### 1. Block Naming Convention

```
✅ GOOD:
- product-card.liquid (descriptive, kebab-case)
- _heading.liquid (component prefix)
- email-signup.liquid (feature-based)

❌ BAD:
- block1.liquid (không descriptive)
- ProductCard.liquid (PascalCase)
- product_card.liquid (snake_case)
```

### 2. Settings Organization

```json
{
  "settings": [
    {
      "type": "header",
      "content": "Nội dung"
    },
    // Content settings grouped together
    
    {
      "type": "header", 
      "content": "Giao diện"
    },
    // Appearance settings grouped together
    
    {
      "type": "header",
      "content": "Responsive"
    }
    // Responsive settings grouped together
  ]
}
```

### 3. Performance Considerations

```liquid
<!-- Lazy load non-critical assets -->
{% if block.settings.enable_animations %}
  <script src="{{ 'animations.js' | asset_url }}" defer></script>
{% endif %}

<!-- Preload critical assets -->
{% if block.settings.background_video %}
  <link rel="preload" href="{{ block.settings.background_video | file_url }}" as="video">
{% endif %}

<!-- Optimize images -->
{% render 'image',
   src: block.settings.image,
   loading: 'lazy',
   sizes: '(min-width: 768px) 50vw, 100vw'
%}
```

## 🚀 Kết Luận

Hệ thống blocks của Horizon theme mang lại:

- **🧩 Modularity**: Components có thể tái sử dụng
- **🎨 Flexibility**: Infinite layout possibilities  
- **⚡ Performance**: Optimized rendering
- **👨‍💻 Developer Experience**: Clear separation of concerns
- **🎯 User Experience**: Intuitive theme editor interface

Đây chính là nền tảng giúp Horizon theme vượt trội so với các theme truyền thống.