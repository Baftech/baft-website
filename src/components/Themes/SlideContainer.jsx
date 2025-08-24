import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [canScrollToNext, setCanScrollToNext] = useState(true);
  const [canScrollToPrev, setCanScrollToPrev] = useState(true);
  const totalSlides = React.Children.count(children);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 50; // Ultra smooth response
  const scrollVelocity = useRef(0);
  const scrollAccumulator = useRef(0);
  const smoothScrollTimer = useRef(null);
  const velocityDecay = useRef(0.95); // Momentum decay factor
  const momentumTimer = useRef(null);
  
  // Touch gesture handling
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const minSwipeDistance = 50;
      const touchCooldown = 600; // Reduced for more responsive touch

  // Scroll position tracking
  const currentSlideRef = useRef(null);
  const scrollThreshold = 30; // Reduced threshold for smoother transitions
  const smoothScrollOptions = {
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest'
  };

  // Responsive detection
  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerHeight < window.innerWidth);
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    window.addEventListener('orientationchange', checkDeviceType);

    return () => {
      window.removeEventListener('resize', checkDeviceType);
      window.removeEventListener('orientationchange', checkDeviceType);
    };
  }, []);

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
      
      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection('none');
      }, 1200); // Slightly faster for smoother feel
    }
  }, [totalSlides, onSlideChange, isTransitioning, slideIndex]);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning) return;
    // Don't prevent default - allow natural scrolling within slides
  }, [isTransitioning]);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioning) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < touchCooldown) return;
    
    touchEndY.current = e.changedTouches[0].clientY;
    const distance = touchStartY.current - touchEndY.current;
    
    if (Math.abs(distance) > minSwipeDistance) {
      let newIndex = slideIndex;
      
      if (distance > 0 && canScrollToNext) {
        // Swipe up - go to next slide only if can't scroll down more
        if (slideIndex < totalSlides - 1) {
          newIndex = slideIndex + 1;
        }
      } else if (distance < 0 && canScrollToPrev) {
        // Swipe down - go to previous slide only if can't scroll up more
        if (slideIndex > 0) {
          newIndex = slideIndex - 1;
        }
      }
      
      if (newIndex !== slideIndex) {
        lastScrollTime.current = now;
        handleSlideChange(newIndex);
      }
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning, canScrollToNext, canScrollToPrev]);

  const handleWheel = useCallback((e) => {
    // Prevent default to ensure smooth handling
    e.preventDefault();
    
    // Respect handoff blocks from slides (e.g., video expansion)
    if (typeof window !== 'undefined' && window.__videoHandoffActive) {
      return;
    }
    
    if (isTransitioning) {
      return;
    }
    
    const now = Date.now();
    const deltaY = e.deltaY;
    const timeDelta = now - lastScrollTime.current;
    
    // Enhanced velocity calculation with dampening
    if (timeDelta > 0) {
      const rawVelocity = Math.abs(deltaY) / timeDelta;
      // Apply velocity dampening for smoother feel
      scrollVelocity.current = scrollVelocity.current * velocityDecay.current + rawVelocity * (1 - velocityDecay.current);
    }
    
    // Accumulate scroll delta with velocity-based scaling
    const velocityFactor = Math.min(scrollVelocity.current / 10, 2); // Cap at 2x
    const scaledDelta = deltaY * (0.5 + velocityFactor * 0.5); // Dynamic scaling
    scrollAccumulator.current += scaledDelta;
    
    // Clear any existing timers
    if (smoothScrollTimer.current) {
      clearTimeout(smoothScrollTimer.current);
    }
    if (momentumTimer.current) {
      clearTimeout(momentumTimer.current);
    }
    
    // Ultra smooth scroll processing with momentum
    smoothScrollTimer.current = setTimeout(() => {
      const direction = scrollAccumulator.current > 0 ? 1 : -1;
      const absAccumulator = Math.abs(scrollAccumulator.current);
      
      // Dynamic threshold based on velocity for more natural feel
      const dynamicThreshold = Math.max(15, Math.min(40, 25 - scrollVelocity.current * 2));
      
      if (absAccumulator > dynamicThreshold) {
        let newIndex = slideIndex;
        
        // Check if we should change slides or allow scrolling within current slide
        if (direction > 0) {
          // Scrolling down
          if (canScrollToNext) {
            // Ultra smooth internal scrolling with velocity-based easing
            if (currentSlideRef.current) {
              const baseScrollAmount = Math.min(absAccumulator * 0.25, 120);
              const velocityBoost = Math.min(scrollVelocity.current * 5, 30);
              const scrollAmount = baseScrollAmount + velocityBoost;
              
              currentSlideRef.current.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
              });
              
              // Add momentum continuation
              momentumTimer.current = setTimeout(() => {
                if (currentSlideRef.current && scrollVelocity.current > 0.1) {
                  const momentumScroll = scrollVelocity.current * 20;
                  currentSlideRef.current.scrollBy({
                    top: momentumScroll,
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }
            scrollAccumulator.current = 0;
            return;
          } else if (slideIndex < totalSlides - 1) {
            newIndex = slideIndex + 1;
          } else {
            scrollAccumulator.current = 0;
            return;
          }
        } else {
          // Scrolling up
          if (canScrollToPrev) {
            // Ultra smooth internal scrolling with velocity-based easing
            if (currentSlideRef.current) {
              const baseScrollAmount = Math.min(absAccumulator * 0.25, 120);
              const velocityBoost = Math.min(scrollVelocity.current * 5, 30);
              const scrollAmount = baseScrollAmount + velocityBoost;
              
              currentSlideRef.current.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
              });
              
              // Add momentum continuation
              momentumTimer.current = setTimeout(() => {
                if (currentSlideRef.current && scrollVelocity.current > 0.1) {
                  const momentumScroll = scrollVelocity.current * 20;
                  currentSlideRef.current.scrollBy({
                    top: -momentumScroll,
                    behavior: 'smooth'
                  });
                }
              }, 100);
            }
            scrollAccumulator.current = 0;
            return;
          } else if (slideIndex > 0) {
            newIndex = slideIndex - 1;
          } else {
            scrollAccumulator.current = 0;
            return;
          }
        }
        
        if (newIndex !== slideIndex) {
          lastScrollTime.current = now;
          handleSlideChange(newIndex);
        }
      }
      
      // Gradual accumulator decay for natural feel
      scrollAccumulator.current *= 0.8;
      if (Math.abs(scrollAccumulator.current) < 1) {
        scrollAccumulator.current = 0;
      }
    }, 20); // Even more responsive debouncing
    
    lastScrollTime.current = now;
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning, canScrollToNext, canScrollToPrev]);

  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return;
    
    let newIndex = slideIndex;
    
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (canScrollToNext) {
        // Try to scroll within current slide first with smooth easing
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollBy({
            top: 80,
            behavior: 'smooth'
          });
          return;
        }
      } else if (slideIndex < totalSlides - 1) {
        newIndex = slideIndex + 1;
      } else {
        return;
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (canScrollToPrev) {
        // Try to scroll within current slide first with smooth easing
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollBy({
            top: -80,
            behavior: 'smooth'
          });
          return;
        }
      } else if (slideIndex > 0) {
        newIndex = slideIndex - 1;
      } else {
        return;
      }
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = totalSlides - 1;
    }
    
    if (newIndex !== slideIndex) {
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning, canScrollToNext, canScrollToPrev]);

  // Add event listeners
  useEffect(() => {
    const handleWheelEvent = (e) => handleWheel(e);
    const handleKeyDownEvent = (e) => handleKeyDown(e);
    const handleTouchStartEvent = (e) => handleTouchStart(e);
    const handleTouchMoveEvent = (e) => handleTouchMove(e);
    const handleTouchEndEvent = (e) => handleTouchEnd(e);
    
    document.addEventListener("wheel", handleWheelEvent, { passive: false });
    document.addEventListener("keydown", handleKeyDownEvent);
    document.addEventListener("touchstart", handleTouchStartEvent, { passive: false });
    document.addEventListener("touchmove", handleTouchMoveEvent, { passive: false });
    document.addEventListener("touchend", handleTouchEndEvent, { passive: false });
    
    return () => {
      // Clear any pending timers for ultra smooth cleanup
      if (smoothScrollTimer.current) {
        clearTimeout(smoothScrollTimer.current);
      }
      if (momentumTimer.current) {
        clearTimeout(momentumTimer.current);
      }
      
      document.removeEventListener("wheel", handleWheelEvent);
      document.removeEventListener("keydown", handleKeyDownEvent);
      document.removeEventListener("touchstart", handleTouchStartEvent);
      document.removeEventListener("touchmove", handleTouchMoveEvent);
      document.removeEventListener("touchend", handleTouchEndEvent);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Update slide index when currentSlide prop changes
  useEffect(() => {
    if (currentSlide !== undefined && currentSlide !== slideIndex) {
      if (currentSlide >= 0 && currentSlide < totalSlides) {
        setSlideIndex(currentSlide);
        setPreviousSlideIndex(slideIndex);
      } else {
        console.error("Invalid slide index:", currentSlide, "Total slides:", totalSlides);
      }
    }
  }, [currentSlide, slideIndex, totalSlides]);

  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[slideIndex];
  const previousChild = childrenArray[previousSlideIndex];

  // Validate slide indices
  if (slideIndex < 0 || slideIndex >= totalSlides) {
    console.error("Invalid slide index:", slideIndex, "Total slides:", totalSlides);
    return null;
  }

  if (!currentChild) {
    console.error("No content found for slide:", slideIndex);
    return null;
  }

  // Seamless transition conditions
  const isSeamlessUp = isTransitioning && transitionDirection === 'up' && 
    ((previousSlideIndex === 3 && slideIndex === 4) || 
     (previousSlideIndex === 4 && slideIndex === 5) ||
     (previousSlideIndex === 5 && slideIndex === 6) ||
     (previousSlideIndex === 6 && slideIndex === 7));
  const isSeamlessDown = isTransitioning && transitionDirection === 'down' && 
    ((previousSlideIndex === 4 && slideIndex === 3) || 
     (previousSlideIndex === 5 && slideIndex === 4) ||
     (previousSlideIndex === 6 && slideIndex === 5) ||
     (previousSlideIndex === 7 && slideIndex === 6));
  const isSeamless = isSeamlessUp || isSeamlessDown;

  return (
    <div className="slide-container relative w-full h-screen overflow-hidden">
      {isSeamless ? (
        <>
          <div className={`absolute inset-0 w-full h-full ${
            isSeamlessUp ? 'seamless-up-prev' : 'seamless-down-prev'
          }`}>
            {previousChild}
          </div>
          <div className={`absolute inset-0 w-full h-full ${
            isSeamlessUp ? 'seamless-up-next' : 'seamless-down-next'
          }`}>
            {currentChild}
          </div>
        </>
      ) : (
        <div 
          ref={currentSlideRef}
          className="w-full h-full transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] overflow-auto scroll-smooth custom-scroll buttery-smooth-scroll"
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
          {currentChild || (
            <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-black text-2xl">
              No slide content found for index {slideIndex}
            </div>
          )}
        </div>
      )}
      
      {/* Banner-style transition overlay (disabled for seamless transitions) */}
      {isTransitioning && !isSeamless && (
        <div 
          className={`absolute inset-0 z-30 pointer-events-none ${
            transitionDirection === 'up' 
              ? 'banner-transition-up' 
              : 'banner-transition-down'
          }`}
        />
      )}

      {/* Progress bar for mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${((slideIndex + 1) / totalSlides) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default SlideContainer;
