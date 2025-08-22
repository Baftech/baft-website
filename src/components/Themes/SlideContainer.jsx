import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');
  const totalSlides = React.Children.count(children);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 600; // 600ms cooldown between scrolls for smoother transitions
  
  // Touch gesture handling
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const minSwipeDistance = 50; // Minimum distance for swipe to be recognized
  const touchCooldown = 800; // Touch cooldown for mobile devices

  const handleSlideChange = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides && !isTransitioning) {
      console.log("SlideContainer: Changing from slide", slideIndex, "to", newIndex);
      console.log("Total slides:", totalSlides);
      console.log("Previous slide index:", previousSlideIndex);
      
      // Store previous slide index for transition effects
      setPreviousSlideIndex(slideIndex);
      
      // Determine transition direction
      const direction = newIndex > slideIndex ? 'up' : 'down';
      setTransitionDirection(direction);
      setIsTransitioning(true);
      
      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setTransitionDirection('none');
      }, 1000); // Optimized duration for seamless transitions
    } else {
      console.log("SlideContainer: Invalid slide change attempt", {
        newIndex,
        totalSlides,
        isTransitioning,
        currentSlideIndex: slideIndex
      });
    }
  }, [totalSlides, onSlideChange, isTransitioning, slideIndex]);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e) => {
    if (isTransitioning) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e) => {
    if (isTransitioning) return;
    e.preventDefault(); // Prevent default scrolling during touch
  }, [isTransitioning]);

  const handleTouchEnd = useCallback((e) => {
    if (isTransitioning) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < touchCooldown) {
      return; // Still in cooldown
    }
    
    touchEndY.current = e.changedTouches[0].clientY;
    const distance = touchStartY.current - touchEndY.current;
    
    // Check if swipe distance is sufficient
    if (Math.abs(distance) > minSwipeDistance) {
      let newIndex = slideIndex;
      
      if (distance > 0) {
        // Swipe up - go to next slide
        if (slideIndex < totalSlides - 1) {
          newIndex = slideIndex + 1;
        }
      } else {
        // Swipe down - go to previous slide
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
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastScrollTime.current < scrollCooldown || isTransitioning) {
      console.log("Scroll blocked:", { 
        cooldown: now - lastScrollTime.current < scrollCooldown, 
        transitioning: isTransitioning 
      });
      return; // Still in cooldown or transitioning
    }
    
    const direction = e.deltaY > 0 ? 1 : -1;
    let newIndex = slideIndex;
    
    // Handle boundary conditions properly
    if (direction > 0) {
      // Scrolling down - only allow if not at last slide
      if (slideIndex < totalSlides - 1) {
        newIndex = slideIndex + 1;
      } else {
        console.log("At last slide, scroll down blocked");
        return;
      }
    } else {
      // Scrolling up - only allow if not at first slide
      if (slideIndex > 0) {
        newIndex = slideIndex - 1;
      } else {
        console.log("At first slide, scroll up blocked");
        return;
      }
    }
    
    if (newIndex !== slideIndex) {
      console.log("Wheel scroll: changing from slide", slideIndex + 1, "to", newIndex + 1);
      lastScrollTime.current = now;
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning]);

  const handleKeyDown = useCallback((e) => {
    if (isTransitioning) return; // Prevent key navigation during transitions
    
    let newIndex = slideIndex;
    
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      // Only go down if not at last slide
      if (slideIndex < totalSlides - 1) {
        newIndex = slideIndex + 1;
      } else {
        return; // At last slide, do nothing
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      // Only go up if not at first slide
      if (slideIndex > 0) {
        newIndex = slideIndex - 1;
      } else {
        return; // At first slide, do nothing
      }
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = totalSlides - 1;
    }
    
    if (newIndex !== slideIndex) {
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange, isTransitioning]);

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
      // Validate the slide index
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
     (previousSlideIndex === 5 && slideIndex === 6));
  const isSeamlessDown = isTransitioning && transitionDirection === 'down' && 
    ((previousSlideIndex === 4 && slideIndex === 3) || 
     (previousSlideIndex === 5 && slideIndex === 4) ||
     (previousSlideIndex === 6 && slideIndex === 5));
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
        <div className="w-full h-full transition-all duration-[800ms] ease-in-out">
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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50 pointer-events-none">
          <div>Slide: {slideIndex + 1}/{totalSlides}</div>
          <div>Previous: {previousSlideIndex + 1}</div>
          <div>Transitioning: {isTransitioning ? 'Yes' : 'No'}</div>
          <div>Direction: {transitionDirection}</div>
          <div>Seamless: {isSeamless ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none md:hidden">
        <div className="flex gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 pointer-events-auto">
          <button
            onClick={() => slideIndex > 0 && handleSlideChange(slideIndex - 1)}
            disabled={slideIndex === 0}
            className={`p-2 rounded-full transition-all duration-300 ${
              slideIndex === 0 
                ? 'text-white/30 cursor-not-allowed' 
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSlides }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === slideIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={() => slideIndex < totalSlides - 1 && handleSlideChange(slideIndex + 1)}
            disabled={slideIndex === totalSlides - 1}
            className={`p-2 rounded-full transition-all duration-300 ${
              slideIndex === totalSlides - 1 
                ? 'text-white/30 cursor-not-allowed' 
                : 'text-white hover:bg-white/20'
            }`}
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideContainer;
