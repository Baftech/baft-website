import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollToNext, setCanScrollToNext] = useState(true);
  const [canScrollToPrev, setCanScrollToPrev] = useState(true);
  const totalSlides = React.Children.count(children);
  const lastNavTime = useRef(0);
  const navCooldownMs = 300;
  
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

  // Responsive detection
  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < 768);
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

  // Touch gesture handlers (element-level)
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning) return;
    if (typeof window !== 'undefined' && window.__videoHandoffActive) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isTransitioning]);

  const handleTouchMove = useCallback(() => {
    // Allow native scrolling; do not prevent default
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioning) return;
    if (typeof window !== 'undefined' && window.__videoHandoffActive) return;
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

  const handleWheel = useCallback((e) => {
    if (isTransitioning) return;
    if (typeof window !== 'undefined' && window.__videoHandoffActive) return;

    const element = currentSlideRef.current;
    if (!element) return;

    const now = Date.now();
    const atTop = element.scrollTop <= scrollThreshold;
    const atBottom = element.scrollTop >= (element.scrollHeight - element.clientHeight - scrollThreshold);

    if (e.deltaY > 0 && atBottom && slideIndex < totalSlides - 1) {
      e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        handleSlideChange(slideIndex + 1);
      }
    } else if (e.deltaY < 0 && atTop && slideIndex > 0) {
      e.preventDefault();
      if (now - lastNavTime.current >= navCooldownMs) {
        lastNavTime.current = now;
        handleSlideChange(slideIndex - 1);
      }
    }
    // Otherwise allow native scrolling
  }, [isTransitioning, slideIndex, totalSlides, handleSlideChange]);

  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return;
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
    <div className="slide-container relative w-full h-screen overflow-hidden" tabIndex={0} onKeyDown={handleKeyDown}>
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
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
