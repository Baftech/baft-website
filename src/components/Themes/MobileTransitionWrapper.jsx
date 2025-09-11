import React, { useEffect, useRef, useState } from 'react';
import { useMobileTransition, useSmoothSwipe, SectionTransition } from './MobileTransitionManager';

// Mobile Transition Wrapper for all mobile components
const MobileTransitionWrapper = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.8,
  enableSwipe = true,
  swipeDirection = "vertical",
  onSwipe,
  className = "",
  ...props 
}) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use mobile transition hook - minimal effect
  const { enterAnimation, exitAnimation } = useMobileTransition(sectionRef, {
    direction,
    duration: duration * 0.3, // Much shorter duration
    ease: "power1.out", // Gentler easing
    stagger: 0.02, // Minimal stagger
    scale: false,
    opacity: true,
    blur: false,
    perspective: false
  });

  // Use swipe detection if enabled
  const { handlers } = useSmoothSwipe((swipeDir, swipeData) => {
    if (onSwipe) {
      onSwipe(swipeDir, swipeData);
    }
  }, {
    threshold: 50,
    velocity: 0.3,
    direction: swipeDirection
  });

  // Intersection Observer for automatic animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            enterAnimation();
          } else if (!entry.isIntersecting && isVisible) {
            setIsVisible(false);
            exitAnimation();
          }
        });
      },
      { 
        threshold: 0.1, // Much more sensitive, triggers earlier
        rootMargin: "0px 0px -5% 0px" // Smaller margin
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible, enterAnimation, exitAnimation]);

  return (
    <div
      ref={sectionRef}
      className={`mobile-transition-wrapper ${className}`}
      {...(enableSwipe ? handlers : {})}
      {...props}
    >
      <SectionTransition
        direction={direction}
        delay={delay}
        duration={duration}
      >
        {children}
      </SectionTransition>
    </div>
  );
};

export default MobileTransitionWrapper;
