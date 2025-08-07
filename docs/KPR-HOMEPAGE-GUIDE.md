# KPR Homepage Concept Switcher Guide

## Overview

The KPR Homepage system provides a dynamic, interactive homepage experience with three distinct design concepts: **Traditional**, **Hybrid**, and **Modern**. Each concept features three product showcase sections with unique styling and functionality.

## 📁 File Structure

### Sections
- `kpr-hero.liquid` - Main hero section with concept selection buttons
- `kpr-traditional-i.liquid` - Traditional New Products
- `kpr-traditional-ii.liquid` - Traditional Best Sellers  
- `kpr-traditional-iii.liquid` - Traditional Recommendations
- `kpr-hybrid-i.liquid` - Hybrid New Products
- `kpr-hybrid-ii.liquid` - Hybrid Best Sellers
- `kpr-hybrid-iii.liquid` - Hybrid Recommendations
- `kpr-modern-i.liquid` - Modern New Products
- `kpr-modern-ii.liquid` - Modern Best Sellers
- `kpr-modern-iii.liquid` - Modern Recommendations

### Assets
- `kpr-homepage.js` - Main functionality and floating panel
- `kpr-performance.css` - Performance optimizations

### Snippets
- `product-card-placeholder.liquid` - Fallback content for empty collections

## 🎯 Features

### Hero Section
- **Customizable Background**: Image upload with overlay options
- **Three Concept Buttons**: Traditional, Hybrid, Modern with icons
- **Text Alignment**: Left, center, or right alignment options
- **Color Schemes**: Supports all theme color schemes
- **Responsive Design**: Mobile-optimized layout

### Concept Sections
- **Dynamic Visibility**: Sections are hidden by default, shown on concept selection
- **Product Collections**: Each section can display products from any collection
- **Unique Styling**: Each concept has distinct visual themes
- **Special Badges**: New, Best Seller, Recommended, etc.
- **@App Integration**: Supports Shopify app blocks
- **Performance Bars**: Visual indicators for Modern sections

### Interactive Features
- **Floating Navigation Panel**: Appears when concept is selected
- **Smooth Animations**: Staggered section reveals
- **Scroll Navigation**: Auto-scroll to sections
- **Keyboard Support**: ESC key to hide concepts
- **Mobile Optimized**: Touch-friendly interface

## 🛠️ Setup Instructions

### 1. Add Sections to Homepage Template

1. Go to **Online Store > Themes > Customize**
2. Select **Homepage** template
3. Add the KPR Hero section first
4. Add all concept sections (they will be hidden by default)

### 2. Configure Hero Section

**Content Settings:**
- Set hero title and subtitle
- Customize button labels (Traditional, Hybrid, Modern)
- Choose text alignment

**Background Settings:**
- Upload background image (optional)
- Enable overlay if needed
- Adjust overlay color and opacity

**Section Settings:**
- Select color scheme
- Adjust padding (top/bottom)

### 3. Configure Concept Sections

For each concept section:

**Products Settings:**
- Select collection for each section type:
  - **New Products**: Recent additions
  - **Best Sellers**: Top-performing products  
  - **Recommended**: Curated selections
- Set number of products to display (2-12)
- Choose image ratio (adapt/portrait/square)
- Enable/disable vendor, ratings, quick add

**Display Options:**
- Enable "View All" button
- Customize button text
- Show/hide recommendation reasons (for III sections)

## 🎨 Customization Guide

### Theme Concepts

#### Traditional 🏛️
- **Colors**: Browns, golds, warm earth tones
- **Style**: Classic, serif fonts, ornate details
- **Features**: Decorative borders, traditional badges
- **Best For**: Heritage brands, luxury goods, artisanal products

#### Hybrid ⚡
- **Colors**: Blues, gradients, tech-inspired
- **Style**: Balanced modern/traditional elements  
- **Features**: Animated gradients, fusion badges
- **Best For**: Innovative brands, tech-forward companies

#### Modern 🚀
- **Colors**: Grays, blacks, minimalist palette
- **Style**: Clean lines, sans-serif fonts, geometric
- **Features**: Performance indicators, AI elements
- **Best For**: Tech companies, startups, contemporary brands

### CSS Customization

Each concept section includes embedded styles that can be modified:

```liquid
<style>
  .kpr-[concept]-section {
    /* Modify background, colors, layout */
    background: your-custom-gradient;
    border-top: 3px solid your-brand-color;
  }
  
  .kpr-[concept]-section .section-heading {
    /* Customize headings */
    color: your-brand-color;
    font-family: your-custom-font;
  }
</style>
```

### JavaScript Customization

Modify `kpr-homepage.js` for custom behaviors:

```javascript
// Customize concept labels
const conceptLabels = {
  traditional: ['Custom Label 1', 'Custom Label 2', 'Custom Label 3'],
  hybrid: ['Custom Label 1', 'Custom Label 2', 'Custom Label 3'],
  modern: ['Custom Label 1', 'Custom Label 2', 'Custom Label 3']
};

// Customize animation timing
setTimeout(() => {
  section.style.display = 'block';
}, index * 300); // Increase delay between sections
```

## 📱 Mobile Optimization

The system includes comprehensive mobile optimizations:

- **Responsive Grid**: Auto-adjusts to screen size
- **Touch-Friendly**: Large tap targets, swipe gestures
- **Bottom Panel**: Floating navigation moves to bottom on mobile
- **Performance**: Reduced animations on mobile devices
- **Accessibility**: Keyboard navigation, screen reader support

## 🚀 Performance Features

### Optimizations Applied
- **Hardware Acceleration**: GPU-accelerated animations
- **Layout Containment**: Prevents layout thrashing
- **Lazy Loading**: Sections load only when needed
- **Image Optimization**: Proper sizing and lazy loading
- **Memory Management**: Efficient DOM manipulation

### Performance Monitoring
The system includes built-in performance optimizations:
- Content visibility API for hidden sections
- Intersection Observer for scroll detection
- Will-change properties for smooth animations
- Reduced motion support for accessibility

## 🔧 Advanced Configuration

### Collection Setup
For optimal results, create specific collections:

1. **Traditional Collections**
   - `traditional-new` - New traditional products
   - `traditional-bestsellers` - Popular traditional items
   - `traditional-recommended` - Curated traditional picks

2. **Hybrid Collections**
   - `hybrid-new` - New fusion products
   - `hybrid-bestsellers` - Top hybrid performers
   - `hybrid-recommended` - Expert fusion picks

3. **Modern Collections**
   - `modern-new` - Latest modern designs
   - `modern-bestsellers` - Performance leaders
   - `modern-recommended` - AI-curated modern products

### Schema Customization
Each section supports extensive customization through Shopify's schema system:

```json
{
  "type": "range",
  "id": "custom_setting",
  "label": "Custom Setting",
  "min": 0,
  "max": 100,
  "default": 50
}
```

## 🎬 User Experience Flow

1. **Page Load**: Hero section appears with three concept buttons
2. **Concept Selection**: User clicks Traditional, Hybrid, or Modern
3. **Section Reveal**: Concept sections appear with staggered animations
4. **Navigation**: Floating panel provides quick section navigation
5. **Interaction**: Users can switch between concepts or return to hero

## 📊 Analytics Integration

Track concept engagement with custom events:

```javascript
// Add to kpr-homepage.js
gtag('event', 'concept_selected', {
  'concept_type': concept,
  'page_location': window.location.href
});
```

## 🛡️ Troubleshooting

### Common Issues

**Sections Not Showing**
- Verify collections are assigned in section settings
- Check that products exist in assigned collections
- Ensure sections are added to homepage template

**JavaScript Errors**
- Confirm `kpr-homepage.js` is loaded correctly
- Check browser console for specific error messages
- Verify script is only loading on index template

**Performance Issues**
- Enable `kpr-performance.css` in theme
- Reduce number of products shown per section
- Optimize images used in collections

**Styling Problems**
- Check color scheme compatibility
- Verify CSS isn't being overridden by theme styles
- Test on different devices and browsers

### Debug Mode
Add to end of `kpr-homepage.js`:

```javascript
// Enable debug mode
window.KPR_DEBUG = true;
```

## 🔄 Updates and Maintenance

### Version History
- **v1.0**: Initial release with core functionality
- **v1.1**: Performance optimizations added
- **v1.2**: Mobile improvements and accessibility

### Regular Maintenance
- Monitor performance metrics
- Update product collections regularly
- Test on new devices/browsers
- Review and optimize image sizes

## 📞 Support

For technical support or customization requests:
1. Check this documentation first
2. Review browser console for errors
3. Test in theme preview mode
4. Contact development team with specific error messages

---

*This system provides a powerful, flexible foundation for showcasing products across different brand concepts while maintaining optimal performance and user experience.*