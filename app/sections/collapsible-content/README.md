# Collapsible Content Section

A flexible accordion/collapsible content section for Weaverse Hydrogen projects.

## Features

- **Multiple Icon Styles**: Plus/minus, chevron, or arrow icons
- **Icon Positioning**: Left or right icon placement
- **Single/Multiple Mode**: Allow one or multiple items to be open simultaneously
- **Customizable Animation**: Adjustable animation duration
- **Rich Text Support**: Content supports HTML formatting
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Automatically adapts to dark/light themes

## Usage

### In Weaverse Editor

1. Add the "Collapsible Content" section to your page
2. Configure the section settings:
   - **Section Title**: Main heading for the section
   - **Section Subtitle**: Optional subtitle
   - **Allow Multiple Items Open**: Toggle between single/multiple accordion mode
   - **Icon Position**: Choose left or right icon placement
   - **Icon Style**: Select plus/minus, chevron, or arrow icons
   - **Animation Duration**: Set the expand/collapse animation speed

3. Add "Collapsible Item" components as children:
   - **Title**: The clickable header text
   - **Content**: Rich text content (supports HTML)
   - **Open by Default**: Whether this item should be expanded initially

### Example Configuration

```typescript
// Section settings
{
  title: "Frequently Asked Questions",
  subtitle: "Find answers to common questions",
  allowMultiple: false,
  iconPosition: "right",
  iconStyle: "plus-minus",
  animationDuration: 0.15
}

// Item example
{
  title: "How do I place an order?",
  content: "You can place an order by browsing our products and adding items to your cart...",
  isOpen: false
}
```

## Styling

The component uses Tailwind CSS classes and follows the project's design system:

- **Typography**: Uses the project's font stack and sizing
- **Colors**: Automatically adapts to light/dark themes
- **Spacing**: Consistent with other sections
- **Borders**: Subtle separators between items
- **Focus States**: Accessible focus indicators

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Semantic HTML structure

## Dependencies

- `@radix-ui/react-accordion` - Core accordion functionality
- `@phosphor-icons/react` - Icons
- `clsx` - Conditional class names
- Tailwind CSS - Styling 