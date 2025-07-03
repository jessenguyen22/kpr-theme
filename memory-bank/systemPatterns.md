# System Patterns

## Architecture Overview
The KPR Theme follows a component-based architecture with clear separation of concerns:

1. **Routing Layer** (`app/routes/`)
   - Uses React Router for navigation
   - Implements locale-aware routing
   - Handles API endpoints
   - Manages authentication flows

2. **Component Layer** (`app/components/`)
   - Atomic design principles
   - Reusable UI components
   - Feature-specific components
   - Layout components

3. **Section Layer** (`app/sections/`)
   - Theme-specific sections
   - Customizable content blocks
   - Integration with Shopify sections

## Design Patterns

### Component Patterns
1. **Composition Over Inheritance**
   - Heavy use of component composition
   - Shared utilities via hooks
   - Common styling through Tailwind

2. **Container/Presenter Pattern**
   - Separation of data fetching and presentation
   - Use of custom hooks for business logic
   - Pure presentation components

### Data Flow Patterns
1. **GraphQL Integration**
   - Centralized queries and fragments
   - Type-safe operations
   - Efficient data fetching

2. **State Management**
   - URL-based state for filters
   - Local state for UI components
   - Cart state management
   - Customer session handling

### Routing Patterns
1. **Dynamic Routes**
   - Locale-prefixed routes
   - Dynamic segments for products/collections
   - API route handling

2. **Layout Patterns**
   - Nested layouts
   - Shared components
   - Mobile/Desktop variations

## Code Organization

### File Naming
- Component files: PascalCase
- Utility files: kebab-case
- Route files: following React Router conventions
- Test files: `.test.ts` suffix

### Directory Structure
- Feature-based organization
- Clear separation of concerns
- Consistent file locations
- Logical grouping of related files

## Error Handling
1. **Boundary Pattern**
   - Error boundaries for route segments
   - Fallback UI components
   - Error logging and reporting

2. **Loading States**
   - Skeleton loaders
   - Progressive loading
   - Optimistic updates

## Integration Patterns
1. **Third-party Services**
   - Clean integration interfaces
   - Fallback mechanisms
   - Error recovery

2. **API Integration**
   - RESTful endpoints
   - GraphQL operations
   - Type-safe interactions

## Testing Patterns
1. **End-to-End Testing**
   - Critical path testing
   - User flow validation
   - Cross-browser compatibility

2. **Unit Testing**
   - Utility function testing
   - Component testing
   - Integration testing 