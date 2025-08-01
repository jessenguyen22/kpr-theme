// assets/kpr-hero.js
import { Component } from '@theme/component';

/**
 * KPR Hero Section Component
 * Displays hero banner with concept selection buttons
 */
export class KprHero extends Component {
  /** @type {string[]} */
  requiredRefs = [];
  
  connectedCallback() {
    super.connectedCallback();
    console.log('KPR Hero initialized');
    
    // Thêm event listener trực tiếp vào component
    this.addEventListener('click', this.handleClick);
    
    // Thêm event listener cho từng nút
    const buttons = document.querySelectorAll('[data-action="show-concept"]');
    console.log(`Found ${buttons.length} concept buttons`);
    
    buttons.forEach(button => {
      if (button instanceof HTMLElement) {
        button.addEventListener('click', () => {
          const concept = button.dataset.concept || '';
          console.log(`Direct click on concept: ${concept}`);
        });
      }
    });
  }
  
  // Declarative event handling for concept buttons
  'on:click [data-action="show-concept"]' = (event) => {
    const concept = event.target.dataset.concept;
    console.log(`Concept selected: ${concept}`);
    
    // Dispatch global event
    document.dispatchEvent(new CustomEvent('kpr:concept-selected', {
      bubbles: true,
      detail: { concept }
    }));
  };
}

// Đăng ký custom element
customElements.define('kpr-hero-section', KprHero);