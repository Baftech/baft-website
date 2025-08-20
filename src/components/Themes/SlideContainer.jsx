import React, { useState, useCallback, useEffect } from "react";
import "./SlideContainer.css";

const SlideContainer = ({ children, currentSlide, onSlideChange }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = React.Children.count(children);

  const handleSlideChange = useCallback((newIndex) => {
    if (newIndex >= 0 && newIndex < totalSlides) {
      setSlideIndex(newIndex);
      onSlideChange?.(newIndex);
    }
  }, [totalSlides, onSlideChange]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? 1 : -1;
    const newIndex = Math.max(0, Math.min(totalSlides - 1, slideIndex + direction));
    if (newIndex !== slideIndex) {
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange]);

  const handleKeyDown = useCallback((e) => {
    let newIndex = slideIndex;
    
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      newIndex = Math.min(totalSlides - 1, slideIndex + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      newIndex = Math.max(0, slideIndex - 1);
    } else if (e.key === "Home") {
      newIndex = 0;
    } else if (e.key === "End") {
      newIndex = totalSlides - 1;
    }
    
    if (newIndex !== slideIndex) {
      handleSlideChange(newIndex);
    }
  }, [slideIndex, totalSlides, handleSlideChange]);

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

  return (
    <div className="slide-container relative w-full h-screen overflow-hidden">
      
      {/* Current Slide */}
      <div className="w-full h-full">
        {(() => {
          const currentChild = React.Children.toArray(children)[slideIndex];
          return currentChild || (
            <div className="w-full h-full bg-yellow-500 flex items-center justify-center text-black text-2xl">
              No slide content found for index {slideIndex}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default SlideContainer;
