import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Mobile Transition Manager for Cinematic Section Transitions
export const useMobileTransition = (sectionRef, options = {}) => {
  const {
    enterDelay = 0.2,
    exitDelay = 0.1,
    duration = 0.8,
    ease = "power2.out",
    stagger = 0.1,
    direction = "up", // up, down, left, right
    scale = true,
    opacity = true,
    blur = false,
    perspective = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const animationRef = useRef(null);

  // Get transform values based on direction
  const getTransformValues = (direction, isEntering) => {
    const multiplier = isEntering ? 1 : -1;
    const baseValue = 100;
    
    switch (direction) {
      case "up":
        return { y: multiplier * baseValue, x: 0, z: 0 };
      case "down":
        return { y: -multiplier * baseValue, x: 0, z: 0 };
      case "left":
        return { x: multiplier * baseValue, y: 0, z: 0 };
      case "right":
        return { x: -multiplier * baseValue, y: 0, z: 0 };
      default:
        return { y: multiplier * baseValue, x: 0, z: 0 };
    }
  };

  // Enter animation
  const enterAnimation = () => {
    if (!sectionRef.current || isVisible) return;
    
    setIsVisible(true);
    setIsExiting(false);
    
    const elements = sectionRef.current.querySelectorAll('[data-transition]');
    const transformValues = getTransformValues(direction, true);
    
    // Set initial state
    gsap.set(elements, {
      opacity: 0,
      scale: scale ? 0.8 : 1,
      filter: blur ? "blur(20px)" : "none",
      transform: `translate3d(${transformValues.x}px, ${transformValues.y}px, ${transformValues.z}px) rotateX(${perspective ? 15 : 0}deg)`,
      transformOrigin: "center center"
    });

    // Animate in
    const tl = gsap.timeline({
      delay: enterDelay,
      ease: ease
    });

    tl.to(elements, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transform: "translate3d(0px, 0px, 0px) rotateX(0deg)",
      duration: duration,
      stagger: stagger,
      ease: ease
    });

    animationRef.current = tl;
  };

  // Exit animation
  const exitAnimation = () => {
    if (!sectionRef.current || !isVisible || isExiting) return;
    
    setIsExiting(true);
    
    const elements = sectionRef.current.querySelectorAll('[data-transition]');
    const transformValues = getTransformValues(direction, false);
    
    const tl = gsap.timeline({
      delay: exitDelay,
      ease: ease
    });

    tl.to(elements, {
      opacity: 0,
      scale: scale ? 0.8 : 1,
      filter: blur ? "blur(20px)" : "none",
      transform: `translate3d(${transformValues.x}px, ${transformValues.y}px, ${transformValues.z}px) rotateX(${perspective ? -15 : 0}deg)`,
      duration: duration * 0.7,
      stagger: stagger * 0.5,
      ease: ease
    });

    animationRef.current = tl;
    
    // Reset state after animation
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, duration * 1000 + exitDelay * 1000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  return {
    enterAnimation,
    exitAnimation,
    isVisible,
    isExiting
  };
};

// Smooth Swipe Detection Hook
export const useSmoothSwipe = (onSwipe, options = {}) => {
  const {
    threshold = 50,
    velocity = 0.3,
    direction = "vertical" // vertical, horizontal, both
  } = options;

  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const velocityRef = useRef(0);
  const lastTouchTimeRef = useRef(0);

  const getSwipeDirection = (start, end) => {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY && absX > threshold) {
      return deltaX > 0 ? "right" : "left";
    } else if (absY > absX && absY > threshold) {
      return deltaY > 0 ? "down" : "up";
    }
    return null;
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    velocityRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTouchTimeRef.current;
    
    if (deltaTime > 0) {
      const deltaY = touch.clientY - touchStartRef.current.y;
      velocityRef.current = deltaY / deltaTime;
    }
    
    lastTouchTimeRef.current = currentTime;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const swipeDirection = getSwipeDirection(touchStartRef.current, touchEndRef.current);
    const isFastSwipe = Math.abs(velocityRef.current) > velocity;

    if (swipeDirection && isFastSwipe) {
      onSwipe(swipeDirection, {
        velocity: velocityRef.current,
        distance: Math.sqrt(
          Math.pow(touchEndRef.current.x - touchStartRef.current.x, 2) +
          Math.pow(touchEndRef.current.y - touchStartRef.current.y, 2)
        ),
        duration: touchEndRef.current.time - touchStartRef.current.time
      });
    }

    // Reset
    touchStartRef.current = null;
    touchEndRef.current = null;
    velocityRef.current = 0;
  };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};

// Section Transition Component
export const SectionTransition = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.8,
  className = "",
  ...props 
}) => {
  return (
    <div
      data-transition
      className={`transition-element ${className}`}
      style={{
        transitionDelay: `${delay}s`,
        transitionDuration: `${duration}s`
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Page Transition Wrapper
export const PageTransition = ({ children, isActive, direction = "up" }) => {
  const containerRef = useRef(null);
  const { enterAnimation, exitAnimation, isVisible } = useMobileTransition(containerRef, {
    direction,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.15,
    scale: true,
    opacity: true,
    blur: true,
    perspective: true
  });

  useEffect(() => {
    if (isActive) {
      enterAnimation();
    } else if (isVisible) {
      exitAnimation();
    }
  }, [isActive, isVisible]);

  return (
    <div ref={containerRef} className="page-transition-container">
      {children}
    </div>
  );
};
