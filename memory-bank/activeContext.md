# 🔍 Active Context - KPR Theme

## 📌 Current Focus

Hiện tại, focus đang hướng vào việc phân tích yêu cầu và thiết kế một phương pháp thích hợp cho **KPR Hero & Concept System** - một hệ thống navigation hoàn chỉnh cho trang chủ.

Các file KPR đã được thử nghiệm trước đó đã được xóa do không đáp ứng đúng yêu cầu nghiệp vụ. Cần một phương pháp tiếp cận mới dựa trên phân tích yêu cầu chi tiết hơn.

### Các Vấn Đề Đã Gặp:

1. **Kiến trúc File**: 
   - Cấu trúc thư mục của Shopify không cho phép subdirectories trong `assets`
   - Flat file structure được yêu cầu

2. **Module Resolution**: 
   - Import maps (`@theme/...`) không hoạt động trong môi trường dev local
   - Cần sử dụng relative imports cho development

3. **Theme Editor Integration**:
   - Sections không xuất hiện trong Theme Editor
   - Cần tích hợp đúng với JSON template format (Online Store 2.0)

4. **JS Architecture**:
   - Cần phân tích kỹ hơn cấu trúc Component của Horizon theme
   - Đảm bảo các Web Components tương thích với theme

## 🆕 Recent Changes

### Approach Đã Thử và Không Phù Hợp:

- **Web Components System**:
  - Sử dụng custom elements để tạo hệ thống SPA-like
  - Cài đặt Router, State Management, và Events system
  - Các component: Hero, Concept Container, Sidebar Nav
  - Vấn đề: Không tích hợp tốt với Theme Editor và không hoạt động như mong đợi

## ⚙️ Yêu Cầu Chính

1. **Hero Banner System**:
   - Section Hero chứa 3 button (Traditional, Hybrid, Modern)
   - Chọn concept sẽ ẩn hero, hiển thị concept đã chọn
   - Floating sidebar navigation giữa các concept và sections
   - Back navigation để quay về hero

2. **Concept Section Structure**:
   - Mỗi concept là 1 section riêng biệt
   - Mỗi section concept có thể customizable qua Theme Editor
   - Chứa các blocks cho: New Arrivals, Best Sellers, Bundle Products
   - Responsive (Mobile-first)

3. **Technical Requirements**:
   - SPA-like experience (không reload trang)
   - Performance optimization cho mobile
   - Tích hợp với Theme Editor
   - Lazy loading sections
   - Support cho browser history
   - SEO-friendly URLs

## 🧩 Bài Học & Điều Cần Làm Rõ

1. **Theme Integration**:
   - Cần hiểu rõ hơn về cách sections được thêm vào Theme Editor
   - JSON templates và cách cấu hình sections_groups
   - Cách handling section events trong Shopify

2. **JavaScript Architecture**:
   - Cân nhắc between Web Components và vanilla JS
   - Cách tiếp cận phù hợp với Horizon theme
   - Handling của Liquid variables trong JS

3. **Performance Constraints**:
   - 90% traffic đến từ mobile FB app
   - Lazy loading strategy
   - Caching content đã load

## 🔄 Next Steps

1. **Phân Tích Yêu Cầu Chi Tiết**:
   - Tạo file phân tích chi tiết các yêu cầu và câu hỏi
   - Xác định các edge cases và constraints

2. **Thiết Kế Architecture Mới**:
   - Dựa trên hiểu biết sâu hơn về cách Theme Editor hoạt động
   - Tích hợp tốt hơn với các APIs của Shopify
   - Simplified approach phù hợp với Horizon architecture 