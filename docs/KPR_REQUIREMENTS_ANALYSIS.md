# KPR Hero Banner System - Phân Tích Yêu Cầu & Giải Pháp

## 1. Tóm Tắt Yêu Cầu

### 1.1 Mục Tiêu
Xây dựng hệ thống KPR Hero Banner cho trang chủ với trải nghiệm SPA-like, hiệu suất cao và tương thích với Theme Editor Shopify, đặc biệt cho khách hàng truy cập từ thiết bị di động (90% traffic từ FB app).

### 1.2 User Flow
1. **Initial State**: 
   - Hero Banner hiển thị trên trang chủ
   - 3 buttons: Traditional, Hybrid, Modern

2. **Interaction**:
   - Khi user click vào một concept button:
     - Hero Banner biến mất (transition mượt)
     - Concept section tương ứng hiện ra
     - Hiển thị sidebar navigation

3. **Navigation**:
   - Sidebar cho phép chuyển giữa các concepts
   - Sidebar có các sections trong mỗi concept (New Arrivals, Best Sellers, Bundle Products)
   - Button "Trở về" để quay lại Hero Banner

4. **State Management**:
   - Browser history được cập nhật khi navigation
   - URL phản ánh state hiện tại (concept, section)
   - Back/Forward browser navigation hoạt động như mong đợi

## 2. Cấu Trúc Sections

### 2.1 Hero Banner Section
- Section chính hiển thị trên trang chủ
- Có thể tùy chỉnh trong Theme Editor
- Chứa 3 concept buttons có thể cấu hình

### 2.2 Concept Sections
- Mỗi concept (Traditional, Hybrid, Modern) là section riêng biệt
- Có thể được tùy chỉnh độc lập trong Theme Editor
- Mỗi concept section chứa các blocks:
  - New Arrivals Collection (block)
  - Best Sellers Collection (block)
  - Bundle Products (block)
  - Blocks từ Apps (@app)

### 2.3 Navigation Component
- Floating sidebar (desktop) / Bottom tabs (mobile)
- Hiển thị các concepts và sections
- Toggle để thu gọn/mở rộng
- Responsive design

## 3. Technical Requirements

### 3.1 Performance
- **Lazy Loading**: Chỉ load concept data khi được chọn
- **Caching**: Concepts đã load cần được cache
- **Animation**: Transitions mượt mà, không làm giật UI
- **Mobile-First**: Tối ưu cho 90% traffic từ FB app

### 3.2 SEO & URLs
- URLs dạng: `?view=concept&concept=traditional&section=new_arrivals`
- Hỗ trợ deep linking
- Title và Meta tags cập nhật theo context

### 3.3 Theme Editor Integration
- Sections và blocks hiển thị trong Theme Editor
- Sections có thể được customize riêng lẻ
- Trong design_mode, tất cả sections cần visible
- Hỗ trợ events: `shopify:section:load`, `shopify:section:select`, etc.

### 3.4 Cross-Browser & Accessibility
- Tương thích với các trình duyệt chính
- Keyboard navigation support
- Screen reader friendly

## 4. Câu Hỏi Cần Làm Rõ

### 4.1 Theme Editor Integration
- **Q1**: Làm thế nào để sections và blocks mới được phát hiện và hiển thị trong Theme Editor?
- **Q2**: Làm sao để sections chỉ hiển thị trong Theme Editor nhưng ẩn trên live site trừ khi active?

### 4.2 Component Architecture
- **Q3**: Nên sử dụng Web Components của Horizon theme hay vanilla JS?
- **Q4**: Làm thế nào để tích hợp với Liquid variables trong JavaScript?

### 4.3 URL & State Management
- **Q5**: Có yêu cầu cụ thể về URL structure không?
- **Q6**: Cần lưu trữ và cache những data nào?
- **Q7**: Nên sử dụng localStorage, sessionStorage hay một giải pháp khác cho caching?

### 4.4 Dynamic Sections
- **Q8**: Mỗi concept section cần những customization options nào?
- **Q9**: Làm sao để xử lý block data từ theme settings trong JS?

### 4.5 Performance
- **Q10**: Có metrics cụ thể cho performance (loading time, TTI)?
- **Q11**: Lazy loading cần áp dụng đến mức nào (images, collections, sections)?

## 5. Phân Tích Phương Pháp Tiếp Cận

### 5.1 Approach 1: Web Components + SPA
**Đã thử và chưa thành công**
- **Ưu điểm**:
  - Encapsulation tốt
  - Event handling đơn giản
  - Fits với Horizon architecture
- **Nhược điểm**:
  - Tích hợp phức tạp với Theme Editor
  - Import issues trong local dev
  - Overengineered cho yêu cầu

### 5.2 Approach 2: Vanilla JS + Sections
- **Ưu điểm**:
  - Đơn giản hơn, ít dependencies
  - Tích hợp trực tiếp với Shopify Section Rendering API
  - Control flow đơn giản hơn
- **Nhược điểm**:
  - Code có thể sẽ ít structure hơn
  - State management phức tạp hơn
  - Event handling có thể verbose

### 5.3 Approach 3: Hybrid Approach
- **Ưu điểm**:
  - Sử dụng Web Components cho UI elements phức tạp
  - Vanilla JS cho section control và integration
  - Tận dụng được Shopify APIs và Horizon theme features
- **Nhược điểm**:
  - Cần architect cẩn thận để tránh conflicts
  - Có thể phức tạp hơn để maintain

## 6. Recommended Next Steps

### 6.1 Decide Architecture
Dựa trên các phân tích, chọn một trong các approaches:
- Tiếp tục với Web Components nhưng simplify
- Chuyển sang Vanilla JS approach
- Hybrid approach

### 6.2 Create Proof of Concept
- Tạo một prototype đơn giản với minimum functionality
- Test trong Theme Editor và trên mobile
- Evaluate performance

### 6.3 Build Incrementally
1. Hero Banner section với buttons
2. Single concept section với sidebar
3. Navigation giữa concepts
4. Section navigation trong concept
5. URL & browser history integration
6. Lazy loading & caching
7. Animation & transitions

### 6.4 Testing & Optimization
- Mobile testing (đặc biệt là Facebook in-app browser)
- Performance metrics
- Accessibility audit
- Cross-browser compatibility

## 7. Technical Specifications

### 7.1 File Structure
```
assets/
├── kpr-hero.js        # Hero banner logic
├── kpr-concept.js     # Concept handling
├── kpr-navigation.js  # Sidebar/navigation
├── kpr-utils.js       # Utilities, helpers
└── kpr-styles.css     # Styles

sections/
├── kpr-hero.liquid             # Hero banner section
├── kpr-concept-traditional.liquid  # Traditional concept
├── kpr-concept-hybrid.liquid       # Hybrid concept
└── kpr-concept-modern.liquid       # Modern concept

snippets/
├── kpr-sidebar-nav.liquid      # Navigation component
└── kpr-section-heading.liquid  # Reusable component
```

### 7.2 Sample URL Structure
- Homepage: `/`
- Traditional concept: `/?view=concept&concept=traditional`
- Traditional/New Arrivals: `/?view=concept&concept=traditional&section=new_arrivals`
- Hybrid concept: `/?view=concept&concept=hybrid`

### 7.3 Performance Targets
- First Meaningful Paint: < 1.5s on 3G
- Time to Interactive: < 3s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1
- Mobile Optimization Priority

### 7.4 Browser Support
- Chrome, Safari, Firefox (latest 2 versions)
- iOS Safari
- Chrome for Android
- Facebook in-app browser 