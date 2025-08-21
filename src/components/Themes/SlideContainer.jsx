import React, { useState, useCallback, useEffect, useRef } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [previousSlideIndex, setPreviousSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState('none');
  const totalSlides = React.Children.count(children);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 800; // 800ms cooldown between scrolls

  const handleSlideChange = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides && !isTransitioning) {
      console.log("SlideContainer: Changing from slide", slideIndex, "to", newIndex);
      
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
      }, 1200); // Increased duration for smoother banner transition
    }
  }, [totalSlides, onSlideChange, isTransitioning, slideIndex]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (now - lastScrollTime.current < scrollCooldown || isTransitioning) {
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
        // At last slide, do nothing
        return;
      }
    } else {
      // Scrolling up - only allow if not at first slide
      if (slideIndex > 0) {
        newIndex = slideIndex - 1;
      } else {
        // At first slide, do nothing
      }
    }
    
    if (newIndex !== slideIndex) {
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
    
    document.addEventListener("wheel", handleWheelEvent, { passive: false });
    document.addEventListener("keydown", handleKeyDownEvent);
    
    return () => {
      document.removeEventListener("wheel", handleWheelEvent);
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [handleWheel, handleKeyDown]);

  // Update slide index when currentSlide prop changes
  useEffect(() => {
    if (currentSlide !== undefined && currentSlide !== slideIndex) {
      setSlideIndex(currentSlide);
    }
  }, [currentSlide, slideIndex]);

  const childrenArray = React.Children.toArray(children);
  const currentChild = childrenArray[slideIndex];
  const previousChild = childrenArray[previousSlideIndex];

  // Seamless slide-up condition: slide 4 (index 3) -> slide 5 (index 4)
  const isSeamlessUp = isTransitioning && transitionDirection === 'up' && previousSlideIndex === 3 && slideIndex === 4;
  // Seamless slide-down condition: slide 5 (index 4) -> slide 4 (index 3)
  const isSeamlessDown = isTransitioning && transitionDirection === 'down' && previousSlideIndex === 4 && slideIndex === 3;
  const isSeamless = isSeamlessUp || isSeamlessDown;

  return (
    <div className="slide-container relative w-full h-screen overflow-hidden">
      {isSeamless ? (
        <>
          <div className={`absolute inset-0 w-full h-full ${isSeamlessUp ? 'seamless-up-prev' : 'seamless-down-prev'}`}>
            {previousChild}
          </div>
          <div className={`absolute inset-0 w-full h-full ${isSeamlessUp ? 'seamless-up-next' : 'seamless-down-next'}`}>
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
    </div>
  );
};

export default SlideContainer;
