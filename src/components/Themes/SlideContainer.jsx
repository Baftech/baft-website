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
  const scrollCooldown = 900;
  
  // Touch gesture handling
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const minSwipeDistance = 50;
  const touchCooldown = 1000;

  // Scroll position tracking
  const currentSlideRef = useRef(null);
  const scrollThreshold = 50; // pixels from edge to trigger slide change

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
      console.log("SlideContainer: Changing from slide", slideIndex, "to", newIndex);
      
      setPreviousSlideIndex(slideIndex);
      const direction = newIndex > slideIndex ? 'up' : 'down';
      setTransitionDirection(direction);
      setIsTransitioning(true);
      
      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection('none');
      }, 1400);
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
        console.log("Touch swipe: changing from slide", slideIndex + 1, "to", newIndex + 1);
        lastScrollTime.current = now;
        handleSlideChange(newIndex);
      }
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning, canScrollToNext, canScrollToPrev]);

  const handleWheel = useCallback((e) => {
    // Respect handoff blocks from slides (e.g., video expansion)
    if (typeof window !== 'undefined' && window.__videoHandoffActive) {
      lastScrollTime.current = Date.now();
      return;
    }
    
    const now = Date.now();
    if (now - lastScrollTime.current < scrollCooldown || isTransitioning) {
      return;
    }
    
    const direction = e.deltaY > 0 ? 1 : -1;
    let newIndex = slideIndex;
    
    // Check if we should change slides or allow scrolling within current slide
    if (direction > 0) {
      // Scrolling down
      if (canScrollToNext) {
        // Can still scroll within current slide, don't change slides
        return;
      } else if (slideIndex < totalSlides - 1) {
        newIndex = slideIndex + 1;
      } else {
        return; // At last slide
      }
    } else {
      // Scrolling up
      if (canScrollToPrev) {
        // Can still scroll within current slide, don't change slides
        return;
      } else if (slideIndex > 0) {
        newIndex = slideIndex - 1;
      } else {
        return; // At first slide
      }
    }
    
    if (newIndex !== slideIndex) {
      console.log("Wheel scroll: changing from slide", slideIndex + 1, "to", newIndex + 1);
      lastScrollTime.current = now;
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning, canScrollToNext, canScrollToPrev]);

  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return;
    
    let newIndex = slideIndex;
    
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      if (canScrollToNext) {
        // Try to scroll within current slide first
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollBy(0, 100);
          return;
        }
      } else if (slideIndex < totalSlides - 1) {
        newIndex = slideIndex + 1;
      } else {
        return;
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (canScrollToPrev) {
        // Try to scroll within current slide first
        if (currentSlideRef.current) {
          currentSlideRef.current.scrollBy(0, -100);
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
        console.log("External slide change: from", slideIndex + 1, "to", currentSlide + 1);
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
          className="w-full h-full transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] overflow-auto scroll-smooth"
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



      {/* Scroll indicator for content overflow */}
      {!isSeamless && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            {canScrollToPrev && (
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" title="Scroll up for more content" />
            )}
            {canScrollToNext && (
              <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" title="Scroll down for more content" />
            )}
          </div>
        </div>
      )}

      {/* Responsive Navigation */}
      {/* Desktop Navigation - Hidden on mobile */}
      {!isMobile && (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 pointer-events-none">
          <div className="flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={() => slideIndex > 0 && handleSlideChange(slideIndex - 1)}
              disabled={slideIndex === 0}
              className={`p-3 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 ${
                slideIndex === 0 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white hover:scale-110'
              }`}
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center gap-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === slideIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={() => slideIndex < totalSlides - 1 && handleSlideChange(slideIndex + 1)}
              disabled={slideIndex === totalSlides - 1}
              className={`p-3 rounded-full bg-black/20 backdrop-blur-sm transition-all duration-300 hover:bg-black/40 ${
                slideIndex === totalSlides - 1 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white hover:scale-110'
              }`}
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation - Bottom centered, above footer */}
      {isMobile && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
          <div className={`flex gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 pointer-events-auto ${
            isLandscape ? 'px-3 py-1' : 'px-4 py-2'
          }`}>
            <button
              onClick={() => slideIndex > 0 && handleSlideChange(slideIndex - 1)}
              disabled={slideIndex === 0}
              className={`p-2 rounded-full transition-all duration-300 touch-feedback ${
                slideIndex === 0 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Previous slide"
            >
              <svg className={`${isLandscape ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: totalSlides }, (_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 ${
                    index === slideIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  style={{
                    width: isLandscape ? '8px' : '12px',
                    height: isLandscape ? '8px' : '12px'
                  }}
                />
              ))}
            </div>
            
            <button
              onClick={() => slideIndex < totalSlides - 1 && handleSlideChange(slideIndex + 1)}
              disabled={slideIndex === totalSlides - 1}
              className={`p-2 rounded-full transition-all duration-300 touch-feedback ${
                slideIndex === totalSlides - 1 
                  ? 'text-white/30 cursor-not-allowed' 
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Next slide"
            >
              <svg className={`${isLandscape ? 'w-5 h-5' : 'w-6 h-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
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
