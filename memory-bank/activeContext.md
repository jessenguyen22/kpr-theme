# 🔍 Active Context - KPR Theme

## 📌 Current Focus

Hiện tại, focus đang hướng vào việc phát triển và hoàn thiện **KPR Hero component** - một thành phần quan trọng trong giao diện trang chủ. Component này nhằm tạo ra trải nghiệm hero section tương tác và đẹp mắt cho người dùng.

### Key Components in Development:
1. **KPR Hero Section**: `sections/kpr-hero.liquid` (đã hoàn thành cơ bản)
2. **KPR Hero JavaScript**: `assets/kpr-hero.js` (đã hoàn thành cơ bản)

## 🆕 Recent Changes

### Latest Addition: KPR Hero Component
- **New Files**:
  - `assets/kpr-hero.js` - Web component cho KPR Hero
  - `sections/kpr-hero.liquid` - Section template cho KPR Hero

- **Current State**:
  - JavaScript component đã được cài đặt và hoạt động với event handlers
  - File structure setup đã hoàn thành
  - Event handling đã được thiết lập và hoạt động
  - Đã thêm vào Import Maps và scripts để module được load đúng

- **Technical Details**:
  - Extends base Component class
  - Uses event delegation cho concept selection
  - Implements Web Component lifecycle hooks
  - Module được đăng ký trong import maps và modulepreload

```javascript
// assets/kpr-hero.js - Component JavaScript file
import { Component } from '@theme/component';

export class KprHero extends Component {
  /** @type {string[]} */
  requiredRefs = [];
  
  connectedCallback() {
    super.connectedCallback();
    console.log('KPR Hero initialized');
    
    // Thêm event listener trực tiếp vào component
    this.addEventListener('click', this.handleClick);
  }
  
  handleClick = (event) => {
    const target = event.target instanceof Element ? event.target : null;
    const button = target ? target.closest('[data-action="show-concept"]') : null;
    
    if (button && button instanceof HTMLElement) {
      const concept = button.dataset.concept || '';
      console.log(`Concept selected: ${concept}`);
      
      document.dispatchEvent(new CustomEvent('kpr:concept-selected', {
        bubbles: true,
        detail: { concept }
      }));
    }
  };
}

// Đăng ký custom element
customElements.define('kpr-hero-section', KprHero);
```

## ✨ Quy trình tạo component mới trong theme

Qua quá trình phát triển KPR Hero, chúng ta đã học được quy trình chuẩn để tạo và cài đặt một component mới trong theme:

### 1. Cấu trúc file cần tạo:
- **Liquid section file**: `sections/your-component.liquid`
- **JavaScript file**: `assets/your-component.js`

### 2. Đăng ký JavaScript trong Import Maps:
Cập nhật `snippets/scripts.liquid` để thêm component vào Import Maps:

```liquid
<script type="importmap">
  {
    "imports": {
      // ...các imports khác
      "@theme/your-component": "{{ 'your-component.js' | asset_url }}"
    }
  }
</script>
```

### 3. Thêm Module Preload:
Thêm modulepreload link trong `snippets/scripts.liquid`:
```liquid
<link
  rel="modulepreload"
  href="{{ 'your-component.js' | asset_url }}"
  fetchpriority="low"
>
```

### 4. Thêm Script Tag:
Thêm script tag vào `snippets/scripts.liquid` để load module:
```liquid
<script
  src="{{ 'your-component.js' | asset_url }}"
  type="module"
  fetchpriority="low"
></script>
```

### 5. Cấu trúc Component JavaScript:
```javascript
import { Component } from '@theme/component';

export class YourComponent extends Component {
  /** @type {string[]} */
  requiredRefs = [];
  
  connectedCallback() {
    super.connectedCallback();
    
    // Khởi tạo component
    // Lưu ý: KHÔNG sử dụng cú pháp 'on:click [selector]', sẽ không hoạt động
    this.addEventListener('click', this.handleClick);
  }
  
  // Sử dụng event delegation
  handleClick = (event) => {
    // Xử lý event
  };
}

// Đăng ký custom element
customElements.define('your-component-name', YourComponent);
```

### 6. Cấu trúc Liquid Section:
```liquid
<your-component-name
  data-section-id="{{ section.id }}"
  data-section-type="your-component"
  class="your-component-class"
>
  <!-- Section content -->
</your-component-name>

{% schema %}
{
  "name": "Your Component",
  "settings": [
    // Settings
  ],
  "presets": [
    {
      "name": "Your Component"
    }
  ]
}
{% endschema %}
```

## 🔄 Ongoing Tasks

### Immediate Tasks
1. **Hoàn thiện KPR Hero Component**:
   - Thêm styling cho component
   - Implement chức năng hiển thị/ẩn sections dựa trên concept được chọn
   - Thêm animations

## 🚀 Next Steps

1. **Implement Logic cho Concept Selection**:
   - Thêm listener cho event `kpr:concept-selected` để hiển thị/ẩn các sections
   - Thêm focus styles cho nút được chọn
   - Lưu concept được chọn vào localStorage để duy trì trạng thái

2. **Integration & Testing**:
   - Test KPR Hero trong different contexts
   - Verify responsive behavior
   - Test performance & accessibility

## 🧩 Related Components

- **Header**: Potential interaction with hero section
- **Product Sections**: May need to link to products from hero
- **Slideshow**: Similar animation patterns could be shared

## 🔍 Technical Considerations

- **Event Handling**: Sử dụng event delegation thay vì declarative event handlers
- **Component Registration**: Đảm bảo đăng ký module trong import maps và script tags
- **TypeScript**: Thêm JSDoc comments cho type checking

## 📝 Notes & Decisions

- Không sử dụng cú pháp declarative event handlers `'on:click [selector]'`, không hoạt động đúng
- Thay vào đó, sử dụng event delegation qua `addEventListener` và `closest()`
- Module phải được đăng ký trong Import Maps để có thể import từ các module khác
- Component phải extends từ base Component class để sử dụng được lifecycle hooks 