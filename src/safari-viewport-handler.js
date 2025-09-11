/**
 * Safari Viewport Handler
 * Handles Safari's dynamic tab bar behavior and viewport changes
 */

class SafariViewportHandler {
  constructor() {
    this.isSafari = this.detectSafari();
    this.initialViewportHeight = window.innerHeight;
    this.currentViewportHeight = window.innerHeight;
    this.tabBarVisible = true;
    this.resizeTimeout = null;
    this.observers = new Set();
    
    if (this.isSafari) {
      this.init();
    }
  }

  detectSafari() {
    return typeof navigator !== 'undefined' && 
           /safari/i.test(navigator.userAgent) && 
           !/chrome|crios|fxios|android/i.test(navigator.userAgent);
  }

  init() {
    // Listen for viewport changes
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    
    // Listen for scroll events to detect tab bar visibility
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Initial setup
    this.updateViewportHeight();
    this.notifyObservers();
  }

  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateViewportHeight();
      this.notifyObservers();
    }, 100);
  }

  handleOrientationChange() {
    // Wait for orientation change to complete
    setTimeout(() => {
      this.updateViewportHeight();
      this.notifyObservers();
    }, 500);
  }

  handleScroll() {
    // Detect if tab bar is likely visible based on scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const wasTabBarVisible = this.tabBarVisible;
    
    // Tab bar is typically hidden when scrolling down and visible when at top
    this.tabBarVisible = scrollTop < 50;
    
    // If tab bar visibility changed, update viewport
    if (wasTabBarVisible !== this.tabBarVisible) {
      this.updateViewportHeight();
      this.notifyObservers();
    }
  }

  updateViewportHeight() {
    const newHeight = window.innerHeight;
    
    if (Math.abs(newHeight - this.currentViewportHeight) > 10) {
      this.currentViewportHeight = newHeight;
      
      // Update CSS custom properties
      document.documentElement.style.setProperty('--viewport-height', `${newHeight}px`);
      document.documentElement.style.setProperty('--viewport-height-dynamic', `${newHeight}px`);
      
      // Add/remove class based on tab bar visibility
      document.body.classList.toggle('safari-tab-bar-hidden', !this.tabBarVisible);
      document.body.classList.toggle('safari-tab-bar-visible', this.tabBarVisible);
    }
  }

  // Subscribe to viewport changes
  subscribe(callback) {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => {
      try {
        callback({
          viewportHeight: this.currentViewportHeight,
          tabBarVisible: this.tabBarVisible,
          isSafari: this.isSafari
        });
      } catch (error) {
        console.warn('Safari viewport handler callback error:', error);
      }
    });
  }

  // Get current viewport information
  getViewportInfo() {
    return {
      viewportHeight: this.currentViewportHeight,
      tabBarVisible: this.tabBarVisible,
      isSafari: this.isSafari,
      heightDifference: this.initialViewportHeight - this.currentViewportHeight
    };
  }

  // Force update (useful for manual triggers)
  forceUpdate() {
    this.updateViewportHeight();
    this.notifyObservers();
  }

  // Cleanup
  destroy() {
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    clearTimeout(this.resizeTimeout);
    this.observers.clear();
  }
}

// Create global instance
const safariViewportHandler = new SafariViewportHandler();

// Export for use in components
export default safariViewportHandler;

// Also make available globally for debugging
if (typeof window !== 'undefined') {
  window.safariViewportHandler = safariViewportHandler;
}
