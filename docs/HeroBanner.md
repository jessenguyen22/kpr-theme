 KPR Homepage Requirements Summary
Hero Banner Logic:

Initial state: 100vh hero với 3 buttons (Traditional, Hybrid, Modern)
On button click: Hero disappears, selected concept section appears
Back navigation: Concept disappears, hero reappears
URL support: Browser back/forward works

Concept Section Structure:

Layout: Sticky sidebar navigation (280px) + main content area
Navigation includes:

Concept switcher (Traditional ↔ Hybrid ↔ Modern)
Section navigation (New Arrivals, Best Sellers, Bundle)
Back to Home button


Content area: 3 main sections per concept

Section Types (per concept):

New Arrivals: Product collection showcase
Best Sellers: Product collection with ratings/badges
Bundle Products: Product bundles/recommendations

Technical Requirements:

90% mobile traffic from FB app → performance critical
No page reloads → SPA-like experience
Lazy loading → sections load only when selected
Responsive design → mobile sticky nav becomes bottom tabs
Slider compatibility → proper component lifecycle to avoid init conflicts

Key Constraints:

Shopify Liquid environment
Theme customizer compatibility (blocks system)
Third-party scripts (sliders) must init correctly
SEO friendly with proper state management

Goal: Build trên Horizon theme architecture với Web Components thay vì Alpine.js để tránh script conflicts và improve performance.