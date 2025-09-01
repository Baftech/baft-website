import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');



  const [canScrollToNext, setCanScrollToNext] = useState(true);
  const [canScrollToPrev, setCanScrollToPrev] = useState(true);
  const totalSlides = React.Children.count(children);
  const [showAboutCrossfade, setShowAboutCrossfade] = useState(false);
  const [aboutCrossfadeFadeOut, setAboutCrossfadeFadeOut] = useState(false);
  const [aboutCrossfadeOpaque, setAboutCrossfadeOpaque] = useState(false);
  const lastNavTime = useRef(0);
  const navCooldownMs = 300;
  const momentumGuardUntilRef = useRef(0);
  
  // Touch gesture handling
  const touchStartY = useRef(0);
  const minSwipeDistance = 50;

  // Scroll position tracking
  const currentSlideRef = useRef(null);
  const scrollThreshold = 30; // Reduced threshold for smoother transitions
  const smoothScrollOptions = {
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  };



  // Check if current slide can scroll and update scroll permissions
  useEffect(() => {
    const checkScrollPermissions = () => {
      if (!currentSlideRef.current) return;
      
      const element = currentSlideRef.current;
      const canScrollUp = element.scrollTop > scrollThreshold;
      const canScrollDown = element.scrollTop < (element.scrollHeight - element.clientHeight - scrollThreshold);
      
      setCanScrollToPrev(canScrollUp);
      setCanScrollToNext(canScrollDown);
    };

    // Check after a short delay to ensure content is rendered
    const timer = setTimeout(checkScrollPermissions, 100);
    
    // Also check on window resize
    window.addEventListener('resize', checkScrollPermissions);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPermissions);
    };
  }, [slideIndex]);

  const handleSlideChange = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides && !isTransitioning) {
      setPreviousSlideIndex(slideIndex);
      const direction = newIndex > slideIndex ? 'up' : 'down';
      setTransitionDirection(direction);
      setIsTransitioning(true);

      // Determine if this change should use seamless transition timing
      const movingUpSeamless = direction === 'up' && (
        (slideIndex === 3 && newIndex === 4) ||
        (slideIndex === 4 && newIndex === 5) ||
        (slideIndex === 5 && newIndex === 6) ||
        (slideIndex === 6 && newIndex === 7)
      );
      const movingDownSeamless = direction === 'down' && (
        (slideIndex === 4 && newIndex === 3) ||
        (slideIndex === 5 && newIndex === 4) ||
        (slideIndex === 6 && newIndex === 5) ||
        (slideIndex === 7 && newIndex === 6)
      );
      const isSeamlessTransition = movingUpSeamless || movingDownSeamless;
      // Optimized timing: seamless 1.2s for instant feel, banner overlay 1.6s
      const transitionDurationMs = isSeamlessTransition ? 1200 : 1600;

      // Set a momentum guard immediately so inertial scroll doesn't affect target slide
      momentumGuardUntilRef.current = Date.now() + transitionDurationMs + 450;

      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);

      // Proactively reset scroll so the next slide always starts at top
      // Try immediately on next frame and again after transition ends for seamless cases
      requestAnimationFrame(() => {
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      });

      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection('none');
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        // Extend guard briefly after transition fully ends
        momentumGuardUntilRef.current = Date.now() + 500;
      }, transitionDurationMs);
    }
  }, [totalSlides, onSlideChange, isTransitioning, slideIndex]);

  // Touch gesture handlers (element-level)
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    // Allow native scrolling otherwise; do not prevent default
  }, [isTransitioning]);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    const now = Date.now();
    if (now - lastNavTime.current < navCooldownMs) return;

    const endY = e.changedTouches[0].clientY;
    const distance = touchStartY.current - endY;
    if (Math.abs(distance) < minSwipeDistance) return;

    const element = currentSlideRef.current;
    if (!element) return;
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold);

    if (distance > 0 && atBottom && slideIndex < totalSlides - 1) {
      // Swipe up at bottom -> next slide
      lastNavTime.current = now;
      handleSlideChange(slideIndex + 1);
    } else if (distance < 0 && atTop && slideIndex > 0) {
      // Swipe down at top -> previous slide
      lastNavTime.current = now;
      handleSlideChange(slideIndex - 1);
    }
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // Attach non-passive touch listeners so preventDefault works when needed (iOS/Android)
  useEffect(() => {
    const element = currentSlideRef.current;
    if (!element) return;

    const ts = (e) => handleTouchStart(e);
    const tm = (e) => handleTouchMove(e);
    const te = (e) => handleTouchEnd(e);

    element.addEventListener('touchstart', ts, { passive: false });
    element.addEventListener('touchmove', tm, { passive: false });
    element.addEventListener('touchend', te, { passive: false });

    return () => {
      element.removeEventListener('touchstart', ts);
      element.removeEventListener('touchmove', tm);
      element.removeEventListener('touchend', te);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, slideIndex]);

  const handleWheel = useCallback((e) => {
    if (isTransitioning || Date.now() < momentumGuardUntilRef.current) {
      // Prevent momentum scroll from affecting the next slide during transitions
      if (e && e.cancelable) e.preventDefault();
      return;
    }
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;

    const element = currentSlideRef.current;
    if (!element) return;

    const now = Date.now();
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold);

    if (e.deltaY > 0 && atBottom && slideIndex < totalSlides - 1) {
      if (e && e.cancelable) e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        handleSlideChange(slideIndex + 1);
      }
    } else if (e.deltaY < 0 && atTop && slideIndex > 0) {
      if (e && e.cancelable) e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        handleSlideChange(slideIndex - 1);
      }
    }
    // Otherwise allow native scrolling
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // Attach non-passive wheel listener so preventDefault works without warnings
  useEffect(() => {
    const element = currentSlideRef.current;
    if (!element) return;
    const wheelListener = (e) => {
      handleWheel(e);
    };
    element.addEventListener('wheel', wheelListener, { passive: false });
    return () => {
      element.removeEventListener('wheel', wheelListener);
    };
  }, [handleWheel, slideIndex]);





  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return;
    if (typeof window !== 'undefined' && (window.__videoHandoffActive || window.__aboutPinnedActive)) return;
    const element = currentSlideRef.current;
    const atTop = element ? element.scrollTop <= scrollThreshold : true;
    const atBottom = element ? element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold) : true;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (!atBottom && element) {
        element.scrollBy({ top: 100, behavior: 'smooth' });
        return;
      }
      if (slideIndex < totalSlides - 1) {
        handleSlideChange(slideIndex + 1);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (!atTop && element) {
        element.scrollBy({ top: -100, behavior: 'smooth' });
        return;
      }
      if (slideIndex > 0) {
        handleSlideChange(slideIndex - 1);
      }
    } else if (e.key === "Home") {
      handleSlideChange(0);
    } else if (e.key === "End") {
      handleSlideChange(totalSlides - 1);
    }
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  // No global listeners; handlers are attached to elements



  // Update slide index when currentSlide prop changes
  useEffect(() => {
    if (currentSlide !== undefined && currentSlide !== slideIndex) {
      if (currentSlide >= 0 && currentSlide < totalSlides) {
        setSlideIndex(currentSlide);
        setPreviousSlideIndex(slideIndex);
      }
    }
  }, [currentSlide, slideIndex, totalSlides]);

  // Ensure scroll position is reset whenever the active slide changes
  useEffect(() => {
    requestAnimationFrame(() => {
      if (currentSlideRef.current) {
        currentSlideRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    });
  }, [slideIndex]);

  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[slideIndex];
  const previousChild = childrenArray[previousSlideIndex];

  // Validate slide indices
  if (slideIndex < 0 || slideIndex >= totalSlides) {
    return null;
  }

  if (!currentChild) {
    return null;
  }

    // Enhanced seamless transition conditions for slides 4-8 (continuous motion roll)
  const seamlessEnabled = true; // Enable seamless for slides 4-8
  
  // Immediate preloading of all critical assets on mount
  useEffect(() => {
    const preloadAllCriticalAssets = () => {
      // Features section assets (highest priority)
      const featureImages = [
        "/baft_card1.svg",
        "/baft_card2.svg", 
        "/baft_card3.svg",
        "/baft_card4.svg",
        "/pay-bills.svg",
        "/manage-account.svg",
        "/rewards.svg",
        "/seamless-payments.svg"
      ];
      
      // Video section assets
      const videoAssets = [
        "/video-thumbnail.jpg",
        "/play-button.svg"
      ];
      
      // Preload all assets with maximum priority and force completion
      [...featureImages, ...videoAssets].forEach(src => {
        const img = new Image();
        img.decoding = "sync";
        img.fetchPriority = "high";
        img.src = src;
        
        // Force immediate loading with multiple strategies
        img.onload = () => {
          console.log(`Critical asset preloaded: ${src}`);
          // Force browser to keep image in memory
          img.style.display = 'none';
          document.body.appendChild(img);
          setTimeout(() => document.body.removeChild(img), 100);
        };
        img.onerror = () => console.warn(`Failed to preload critical asset: ${src}`);
        
        // Additional force loading for critical assets
        if (featureImages.includes(src)) {
          // For Features section, use multiple loading strategies
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = src;
          link.fetchPriority = 'high';
          document.head.appendChild(link);
        }
      });
    };

    // Preload immediately on mount - don't wait for slideIndex
    preloadAllCriticalAssets();
  }, []); // Empty dependency array = runs once on mount

  // Aggressive preloading for Features section to eliminate delay
  useEffect(() => {
    // Preload Features section assets immediately when component mounts
    const preloadFeaturesAssets = () => {
      const featureImages = [
        "/baft_card1.svg",
        "/baft_card2.svg", 
        "/baft_card3.svg",
        "/baft_card4.svg",
        "/pay-bills.svg",
        "/manage-account.svg",
        "/rewards.svg",
        "/seamless-payments.svg"
      ];
      
      // Preload with high priority and immediate loading
      featureImages.forEach(src => {
        const img = new Image();
        img.decoding = "sync";
        img.fetchPriority = "high";
        img.src = src;
        // Force load completion
        img.onload = () => console.log(`Preloaded: ${src}`);
        img.onerror = () => console.warn(`Failed to preload: ${src}`);
      });
    };

    // Preload immediately on mount
    preloadFeaturesAssets();
    
    // Preload Features section from the very beginning (slides 1-3)
    if (slideIndex <= 3) {
      preloadFeaturesAssets();
    }
    
    // Also preload when approaching Features section
    if (slideIndex === 3 || slideIndex === 4) {
      preloadFeaturesAssets();
      
      // Preload next few slides for ultra-smooth transitions
      if (slideIndex === 3) {
        const videoAssets = [
          "/video-thumbnail.jpg",
          "/play-button.svg"
        ];
        videoAssets.forEach(src => {
          const img = new Image();
          img.decoding = "sync";
          img.fetchPriority = "high";
          img.src = src;
        });
      }
    }
  }, [slideIndex]);
  
  // Listen for About section pinned end to advance to next slide (pre-footer)
  useEffect(() => {
    const handleAboutPinnedEnd = () => {
      if (isTransitioning) return;
      const nextIndex = Math.min(slideIndex + 1, totalSlides - 1);
      if (nextIndex !== slideIndex) {
        // Prepare a smooth fade-out transition to pre-footer
        setShowAboutCrossfade(true);
        setAboutCrossfadeOpaque(false); // start transparent
        setAboutCrossfadeFadeOut(false);
        
        // Fade to black smoothly over 800ms
        setTimeout(() => {
          setAboutCrossfadeOpaque(true);
        }, 50);
        
        // Once fully black, change slide under cover
        setTimeout(() => {
          // Ensure current slide is at top without animation
          const element = currentSlideRef.current;
          if (element) {
            try { element.scrollTo({ top: 0, left: 0, behavior: 'auto' }); } catch {}
          }
          handleSlideChange(nextIndex);
          
          // After a brief hold, fade the cover out smoothly
          setTimeout(() => {
            setAboutCrossfadeFadeOut(true);
            // Remove overlay after fade completes
            setTimeout(() => {
              setShowAboutCrossfade(false);
              setAboutCrossfadeFadeOut(false);
              setAboutCrossfadeOpaque(false);
            }, 1000);
          }, 300);
        }, 850); // allow ~850ms for fade-in to black
      }
    };
    
    window.addEventListener('aboutPinnedEnded', handleAboutPinnedEnd);
    return () => window.removeEventListener('aboutPinnedEnded', handleAboutPinnedEnd);
  }, [slideIndex, totalSlides, isTransitioning, handleSlideChange]);
  
  const isSeamlessUp = isTransitioning && transitionDirection === 'up' && 
    ((previousSlideIndex === 3 && slideIndex === 4) || 
     (previousSlideIndex === 4 && slideIndex === 5) ||
     (previousSlideIndex === 5 && slideIndex === 6) ||
     (previousSlideIndex === 6 && slideIndex === 7) ||
     (previousSlideIndex === 7 && slideIndex === 8));
  const isSeamlessDown = isTransitioning && transitionDirection === 'down' && 
    ((previousSlideIndex === 4 && slideIndex === 3) || 
     (previousSlideIndex === 5 && slideIndex === 4) ||
     (previousSlideIndex === 6 && slideIndex === 5) ||
     (previousSlideIndex === 7 && slideIndex === 6) ||
     (previousSlideIndex === 8 && slideIndex === 7));
  const isSeamless = seamlessEnabled && (isSeamlessUp || isSeamlessDown);

  return (
    <div className={`slide-container relative w-full h-screen overflow-hidden ${isSeamless ? 'seamless-mode' : ''}`} tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Main slide container - always visible for slides 1-3, conditional for slides 4+ */}
      {(!isTransitioning || slideIndex < 3) && (
        <div 
          ref={currentSlideRef}
          className="w-full h-full transition-all duration-300 ease-out overflow-auto scroll-smooth custom-scroll buttery-smooth-scroll"
          onScroll={() => {
            // Update scroll permissions when user scrolls
            if (currentSlideRef.current) {
              const element = currentSlideRef.current;
              const canScrollUp = element.scrollTop > scrollThreshold;
              const canScrollDown = element.scrollTop < (element.scrollHeight - element.clientHeight - scrollThreshold);
              
              setCanScrollToPrev(canScrollUp);
              setCanScrollToNext(canScrollDown);
            }
          }}
        >
          {currentChild}
        </div>
      )}
      
      {/* Clean PowerPoint-style transition for slides 4-8 */}
      {isSeamless && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Previous slide - slides out cleanly */}
          <div className={`absolute inset-0 w-full h-full seamless-transition ${
            isSeamlessUp ? 'seamless-up-prev' : 'seamless-down-prev'
          }`}>
            {previousChild}
          </div>
          {/* Current slide - slides in cleanly */}
          <div className={`absolute inset-0 w-full h-full seamless-transition ${
            isSeamlessUp ? 'seamless-up-next' : 'seamless-down-next'
          }`}>
            {currentChild}
          </div>
        </div>
      )}

      {/* Standard banner transition for other slides - only for slides 4+ */}
      {isTransitioning && !isSeamless && slideIndex >= 3 && (
        <div 
          className={`absolute inset-0 z-30 pointer-events-none ${
            transitionDirection === 'up' 
              ? 'banner-transition-up' 
              : 'banner-transition-down'
          }`}
        />
      )}

      {/* About section crossfade overlay for smooth transition to pre-footer */}
      {showAboutCrossfade && (
        <div 
          className={`pointer-events-none absolute inset-0 z-40 about-fade-transition`}
          style={{ 
            background: '#000', 
            opacity: aboutCrossfadeFadeOut ? 0 : (aboutCrossfadeOpaque ? 1 : 0),
            willChange: 'opacity' 
          }}
        />
      )}
    </div>
  );
};

export default SlideContainer;
