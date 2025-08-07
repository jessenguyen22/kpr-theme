/**
 * KPR Homepage Concept Switcher
 * Handles concept switching, floating navigation, and section visibility
 */

class KPRHomepage {
  constructor() {
    this.activeSection = null;
    this.activeConcept = null;
    this.floatingPanel = null;
    this.conceptSections = {
      traditional: ['kpr-traditional-i', 'kpr-traditional-ii', 'kpr-traditional-iii'],
      hybrid: ['kpr-hybrid-i', 'kpr-hybrid-ii', 'kpr-hybrid-iii'],
      modern: ['kpr-modern-i', 'kpr-modern-ii', 'kpr-modern-iii']
    };
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.createFloatingPanel();
    this.hideAllConceptSections();
    this.observeScroll();
  }

  bindEvents() {
    // Concept button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-action="show-concept"]')) {
        e.preventDefault();
        const concept = e.target.dataset.concept;
        this.showConcept(concept);
      }
      
      if (e.target.matches('[data-action="navigate-to-section"]')) {
        e.preventDefault();
        const sectionId = e.target.dataset.sectionId;
        this.navigateToSection(sectionId);
      }
    });

    // Escape key to hide concepts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeConcept) {
        this.hideConcepts();
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.updateFloatingPanelPosition();
    });
  }

  showConcept(concept) {
    // Hide all concept sections first
    this.hideAllConceptSections();
    
    // Update active concept
    this.activeConcept = concept;
    
    // Update hero buttons
    this.updateHeroButtons(concept);
    
    // Show sections for the selected concept
    const sectionsToShow = this.conceptSections[concept];
    sectionsToShow.forEach((sectionType, index) => {
      const section = document.querySelector(`[data-section-type="${sectionType}"]`);
      if (section) {
        setTimeout(() => {
          section.style.display = 'block';
          section.classList.add('concept-section-visible');
          
          // Add entrance animation
          section.style.opacity = '0';
          section.style.transform = 'translateY(30px)';
          
          requestAnimationFrame(() => {
            section.style.transition = 'all 0.6s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
          });
        }, index * 200); // Stagger the animations
      }
    });

    // Show floating panel
    setTimeout(() => {
      this.showFloatingPanel(concept);
      this.scrollToFirstSection(concept);
    }, 300);
  }

  hideConcepts() {
    this.hideAllConceptSections();
    this.hideFloatingPanel();
    this.activeConcept = null;
    this.updateHeroButtons(null);
    
    // Scroll back to hero
    const heroSection = document.querySelector('[data-section-type="kpr-hero"]');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  hideAllConceptSections() {
    const conceptSections = document.querySelectorAll('[data-concept]');
    conceptSections.forEach(section => {
      section.style.display = 'none';
      section.classList.remove('concept-section-visible');
    });
  }

  updateHeroButtons(activeConcept) {
    const conceptButtons = document.querySelectorAll('[data-action="show-concept"]');
    conceptButtons.forEach(button => {
      button.classList.remove('active');
      if (activeConcept && button.dataset.concept === activeConcept) {
        button.classList.add('active');
      }
    });
  }

  scrollToFirstSection(concept) {
    const firstSectionType = this.conceptSections[concept][0];
    const firstSection = document.querySelector(`[data-section-type="${firstSectionType}"]`);
    if (firstSection) {
      setTimeout(() => {
        firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }

  createFloatingPanel() {
    this.floatingPanel = document.createElement('div');
    this.floatingPanel.className = 'kpr-floating-panel';
    this.floatingPanel.innerHTML = `
      <div class="floating-panel-header">
        <span class="panel-title">Navigate</span>
        <button class="panel-close" data-action="hide-concepts">&times;</button>
      </div>
      <nav class="floating-panel-nav">
        <ul class="panel-nav-list"></ul>
      </nav>
    `;
    
    // Add close functionality
    this.floatingPanel.querySelector('[data-action="hide-concepts"]').addEventListener('click', () => {
      this.hideConcepts();
    });
    
    document.body.appendChild(this.floatingPanel);
  }

  showFloatingPanel(concept) {
    const navList = this.floatingPanel.querySelector('.panel-nav-list');
    const conceptLabels = {
      traditional: ['New Traditional', 'Best Sellers', 'Recommended'],
      hybrid: ['New Hybrid', 'Top Performers', 'Fusion Picks'],
      modern: ['Latest Modern', 'Performance Leaders', 'AI Curated']
    };
    
    // Clear existing nav items
    navList.innerHTML = '';
    
    // Add navigation items
    this.conceptSections[concept].forEach((sectionType, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <button class="panel-nav-item" data-action="navigate-to-section" data-section-id="${sectionType}">
          <span class="nav-number">${index + 1}</span>
          <span class="nav-label">${conceptLabels[concept][index]}</span>
        </button>
      `;
      navList.appendChild(li);
    });
    
    // Update panel theme
    this.floatingPanel.className = `kpr-floating-panel kpr-floating-panel--${concept}`;
    
    // Show panel
    setTimeout(() => {
      this.floatingPanel.classList.add('visible');
    }, 100);
    
    this.updateFloatingPanelPosition();
  }

  hideFloatingPanel() {
    this.floatingPanel.classList.remove('visible');
  }

  updateFloatingPanelPosition() {
    if (!this.floatingPanel.classList.contains('visible')) return;
    
    const rect = this.floatingPanel.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Position on left side by default
    this.floatingPanel.style.left = '20px';
    this.floatingPanel.style.top = '50%';
    this.floatingPanel.style.transform = 'translateY(-50%)';
    
    // Adjust for mobile
    if (viewportWidth < 768) {
      this.floatingPanel.style.left = '10px';
      this.floatingPanel.style.right = '10px';
      this.floatingPanel.style.width = 'calc(100% - 20px)';
      this.floatingPanel.style.top = 'auto';
      this.floatingPanel.style.bottom = '20px';
      this.floatingPanel.style.transform = 'none';
    }
  }

  navigateToSection(sectionType) {
    const section = document.querySelector(`[data-section-type="${sectionType}"]`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update active nav item
      const navItems = this.floatingPanel.querySelectorAll('.panel-nav-item');
      navItems.forEach(item => item.classList.remove('active'));
      
      const activeItem = this.floatingPanel.querySelector(`[data-section-id="${sectionType}"]`);
      if (activeItem) {
        activeItem.classList.add('active');
      }
    }
  }

  observeScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.dataset.concept === this.activeConcept) {
          const sectionType = entry.target.dataset.sectionType;
          
          // Update active nav item
          const navItems = this.floatingPanel.querySelectorAll('.panel-nav-item');
          navItems.forEach(item => item.classList.remove('active'));
          
          const activeItem = this.floatingPanel.querySelector(`[data-section-id="${sectionType}"]`);
          if (activeItem) {
            activeItem.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px'
    });

    // Observe all concept sections
    document.querySelectorAll('[data-concept]').forEach(section => {
      observer.observe(section);
    });
  }
}

// Enhanced floating panel styles
const floatingPanelStyles = `
  .kpr-floating-panel {
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 250px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    opacity: 0;
    transform: translateY(-50%) translateX(-20px);
    transition: all 0.3s ease;
    pointer-events: none;
  }

  .kpr-floating-panel.visible {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
    pointer-events: all;
  }

  .floating-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .panel-title {
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .panel-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  .panel-close:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .floating-panel-nav {
    padding: 8px 0;
  }

  .panel-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .panel-nav-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 20px;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }

  .panel-nav-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .panel-nav-item.active {
    background: rgba(0, 0, 0, 0.08);
    border-left-color: currentColor;
  }

  .nav-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: 12px;
  }

  .nav-label {
    font-size: 0.85rem;
    font-weight: 500;
  }

  .panel-nav-item.active .nav-number {
    background: currentColor;
    color: white;
  }

  /* Concept-specific theming */
  .kpr-floating-panel--traditional {
    border-left: 4px solid #8b4513;
  }

  .kpr-floating-panel--traditional .panel-title {
    color: #8b4513;
  }

  .kpr-floating-panel--traditional .panel-nav-item.active {
    color: #8b4513;
  }

  .kpr-floating-panel--hybrid {
    border-left: 4px solid #4a90e2;
  }

  .kpr-floating-panel--hybrid .panel-title {
    color: #4a90e2;
  }

  .kpr-floating-panel--hybrid .panel-nav-item.active {
    color: #4a90e2;
  }

  .kpr-floating-panel--modern {
    border-left: 4px solid #2c3e50;
  }

  .kpr-floating-panel--modern .panel-title {
    color: #2c3e50;
  }

  .kpr-floating-panel--modern .panel-nav-item.active {
    color: #2c3e50;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .kpr-floating-panel {
      left: 10px !important;
      right: 10px !important;
      width: calc(100% - 20px) !important;
      top: auto !important;
      bottom: 20px !important;
      transform: translateY(20px) !important;
      max-height: 50vh;
      overflow-y: auto;
    }

    .kpr-floating-panel.visible {
      transform: translateY(0) !important;
    }

    .floating-panel-header {
      padding: 12px 16px;
    }

    .panel-title {
      font-size: 0.8rem;
    }

    .panel-nav-item {
      padding: 10px 16px;
    }

    .nav-number {
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
    }

    .nav-label {
      font-size: 0.8rem;
    }
  }

  /* Concept section animations */
  .concept-section-visible {
    animation: slideInUp 0.6s ease;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Performance optimizations */
  .kpr-concept-section {
    contain: layout style paint;
  }

  .kpr-floating-panel {
    contain: layout style paint;
    will-change: transform, opacity;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = floatingPanelStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new KPRHomepage();
  });
} else {
  new KPRHomepage();
}

// Export for potential external use
window.KPRHomepage = KPRHomepage;