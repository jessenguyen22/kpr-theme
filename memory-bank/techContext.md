# Technical Context

## Core Technologies
- React (with TypeScript)
- React Router v7 (not Remix)
- Shopify Hydrogen
- Vite
- Biome (for code formatting/linting)
- Playwright (for testing)

## Key Dependencies
- GraphQL for API interactions
- Tailwind CSS for styling
- Various Shopify APIs:
  - Storefront API
  - Customer Account API
  - Admin API

## Development Setup
- TypeScript configuration via `tsconfig.json`
- Vite build system
- Biome for code quality
- Playwright for end-to-end testing
- GraphQL code generation for type safety

## Project Structure
```
app/
├── components/     # Reusable UI components
├── graphql/       # GraphQL queries and fragments
├── hooks/         # Custom React hooks
├── routes/        # Route components and handlers
├── sections/      # Theme sections
├── styles/        # CSS and styling
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── weaverse/      # Weaverse integration
```

## Technical Constraints
1. Must use React Router instead of Remix
2. Must maintain TypeScript type safety
3. Must follow Shopify's API best practices
4. Must support multiple locales
5. Must maintain SEO-friendly structure

## Build and Deploy
- Uses Vite for building
- Supports development and production modes
- Includes proper error boundaries
- Implements proper caching strategies

## Testing Strategy
- End-to-end tests with Playwright
- Cart functionality testing
- Utility function testing

## Performance Considerations
- Image optimization
- Code splitting
- Route-based chunking
- Proper caching implementation
- SEO optimization

## Security
- CSP implementation
- Proper API key handling
- Secure customer data management
- Safe third-party integrations 