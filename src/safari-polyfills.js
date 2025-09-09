// Safari compatibility polyfills and fixes

// Check if we're in Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Safari-specific fixes
if (isSafari) {
  // Fix for Safari's handling of will-change
  const style = document.createElement('style');
  style.textContent = `
    * {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
  `;
  document.head.appendChild(style);

  // Fix for Safari's handling of mix-blend-mode
  const mixBlendElements = document.querySelectorAll('[style*="mix-blend-mode"]');
  mixBlendElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.mixBlendMode) {
      el.style.webkitMixBlendMode = computedStyle.mixBlendMode;
    }
  });

  // Fix for Safari's handling of backdrop-filter
  const backdropElements = document.querySelectorAll('[style*="backdrop-filter"]');
  backdropElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.backdropFilter) {
      el.style.webkitBackdropFilter = computedStyle.backdropFilter;
    }
  });

  // Fix for Safari's handling of text gradients
  const textGradientElements = document.querySelectorAll('.coin-text, .eb-garamond-Bfast, .inter-Bfast_sub');
  textGradientElements.forEach(el => {
    el.classList.add('safari-text-gradient');
  });

  // Fix for Safari's handling of transforms
  const transformElements = document.querySelectorAll('[style*="transform"]');
  transformElements.forEach(el => {
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.transform && computedStyle.transform !== 'none') {
      el.style.webkitTransform = computedStyle.transform;
    }
  });

  // Fix for Safari's handling of scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  document.documentElement.style.webkitOverflowScrolling = 'touch';

  // Fix for Safari's handling of font loading
  if (document.fonts) {
    document.fonts.ready.then(() => {
      document.body.classList.add('fonts-loaded');
    });
  }

  // Fix for Safari's handling of video elements
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.classList.add('safari-video-fix');
  });

  // Fix for Safari's handling of animations
  const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
  animatedElements.forEach(el => {
    el.classList.add('safari-animation-optimized');
  });
}

// Safari-specific event listeners
if (isSafari) {
  // Fix for Safari's handling of touch events
  document.addEventListener('touchstart', function(e) {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // Fix for Safari's handling of scroll events
  let ticking = false;
  function updateScrollPosition() {
    // Safari-specific scroll handling
    ticking = false;
  }

  document.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  });

  // Fix for Safari's handling of resize events
  window.addEventListener('resize', function() {
    // Force reflow for Safari
    document.body.offsetHeight;
  });
}

// Safari-specific CSS fixes
if (isSafari) {
  // Add Safari-specific classes to body
  document.body.classList.add('safari-browser');
  
  // Fix for Safari's handling of viewport units
  function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
}

export { isSafari };
