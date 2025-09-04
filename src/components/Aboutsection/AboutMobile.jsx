import React, { useState, useRef, useEffect } from "react";
import "./About.css";

// Simplified ReadMoreText for mobile
const ReadMoreText = ({ content, maxLength = 200, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const isLong = content.length > maxLength;

  // Split content into paragraphs
  const paragraphs = content
    .split(/\n+/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState);
  };

  return (
    <div className="leading-relaxed">
                     <div
          ref={contentRef}
          style={{
            height: isExpanded ? "auto" : "clamp(140px, 28vw, 220px)",
            overflow: "hidden",
            transition: "height 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
                 {paragraphs.map((para, i) => (
           <p
             key={i}
             className={i === paragraphs.length - 1 ? "mb-0" : "mb-2"}
             style={{
               fontFamily: "Inter, sans-serif",
               fontWeight: "400",
               fontStyle: "normal",
               fontSize: "clamp(10px, 2.8vw, 12.38px)",
               lineHeight: "147%",
               letterSpacing: "0px",
               verticalAlign: "middle",
               color: "#909090",
               width: "clamp(250px, 80vw, 326.1158447265625px)",
               opacity: 1,
             }}
           >
             {para}
           </p>
         ))}
      </div>

              {isLong && (
          <div 
            className="button-container"
            style={{
              transform: isExpanded ? "translateY(0)" : "translateY(0)",
              transition: "all 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <button
              onClick={handleToggle}
              className="mt-3 reveal-button"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "400",
                fontStyle: "normal",
                borderRadius: "200px",
                backgroundColor: "#E3EDFF",
                color: "#092646",
                border: "none",
                cursor: "pointer",
                width: "clamp(70px, 20vw, 140px)",
                height: "clamp(28px, 7vw, 44px)",
                fontSize: "clamp(9px, 2.5vw, 13px)",
                lineHeight: "clamp(12px, 3vw, 16px)",
                letterSpacing: "0px",
                verticalAlign: "middle",
                opacity: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = "#000000";
                e.target.style.color = "#ffffff";
                e.target.style.transform = "scale(0.95)";
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = "#E3EDFF";
                e.target.style.color = "#092646";
                e.target.style.transform = "scale(1)";
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        )}
    </div>
  );
};

// Use the same InteractiveTeamImage component from About.jsx
const InteractiveTeamImage = ({ disabled = false }) => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState("full");
  const [activeImageId, setActiveImageId] = useState("full");
  const [loadedImages, setLoadedImages] = useState(
    new Set(["/Property 1=Image.png"])
  );

  const teamMembers = React.useMemo(
    () => [
      {
        id: "vibha",
        name: "Vibha Harish",
        position: "Co-Founder, BaFT Technology",
        area: { x: "35%", y: "45%", width: "30%", height: "55%" },
        image: "/Property 1=Vibha Harish (1).png",
        textPosition: {
          left: "51%",
          bottom: "26%",
          transform: "translateX(-50%)",
        },
        animation: "center",
      },
      {
        id: "dion",
        name: "Dion Monteiro",
        position: "Co-Founder, BaFT Technology",
        area: { x: "5%", y: "20%", width: "35%", height: "70%" },
        image: "/Property 1=Dion Monteiro (1).png",
        textPosition: { left: "8%", bottom: "27%" },
        animation: "fade-right",
      },
      {
        id: "saket",
        name: "Saket Borkar",
        position: "Co-Founder, BaFT Technology",
        area: { x: "60%", y: "15%", width: "35%", height: "75%" },
        image: "/Property 1=Saket Borkar (1).png",
        textPosition: { right: "5%", bottom: "27%" },
        animation: "fade-left",
      },
    ],
    []
  );

  const cycleSequence = React.useMemo(
    () => ["full", "vibha", "dion", "saket"],
    []
  );

  // Preload images on component mount
  React.useEffect(() => {
    const imagesToPreload = teamMembers.map((member) => member.image);

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, src]));
      };
      img.src = src;
    });
  }, [teamMembers]);

  // Auto-cycling effect (paused when disabled)
  React.useEffect(() => {
    if (!isUserInteracting && !disabled) {
      const interval = setInterval(() => {
        setAutoHighlight((current) => {
          const currentIndex = cycleSequence.findIndex((id) => id === current);
          const nextIndex = (currentIndex + 1) % cycleSequence.length;
          return cycleSequence[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    } else {
      // Ensure stable state when disabled or interacting
      setAutoHighlight('full');
    }
  }, [isUserInteracting, disabled, cycleSequence]);

  // Image transition effect (force full when disabled)
  React.useEffect(() => {
    if (disabled) {
      setActiveImageId('full');
      return;
    }
    const activeMember = isUserInteracting ? hoveredMember : autoHighlight;
    setActiveImageId(activeMember || "full");
  }, [autoHighlight, hoveredMember, isUserInteracting, disabled]);

  // Reset interaction state when disabled toggles on
  React.useEffect(() => {
    if (disabled) {
      setHoveredMember(null);
      setIsUserInteracting(false);
    }
  }, [disabled]);

  const handleMouseEnterImage = () => {
    if (disabled) return;
    setIsUserInteracting(true);
  };

  const handleMouseLeaveImage = () => {
    if (disabled) return;
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
  };

  const handleMouseEnterMember = (memberId) => {
    if (disabled) return;
    setHoveredMember(memberId);
  };

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsUserInteracting(true);
  };

  const handleTouchEnd = (e) => {
    if (disabled) return;
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
  };

  const getAnimationStyles = (member) => {
    if (!member) return {};

    const isHovered = isUserInteracting && hoveredMember === member.id;
    const isActive = !isUserInteracting && autoHighlight === member.id;
    const shouldShow = isHovered || isActive;

    switch (member.animation) {
      case "fade-right":
        return {
          name: {
            transform: shouldShow ? "translateX(0)" : "translateX(20px)",
            opacity: shouldShow ? 1 : 0,
            transition:
              "transform 0.6s ease-in-out 0.5s, opacity 0.6s ease-in-out 0.5s",
          },
          role: {
            transform: shouldShow ? "translateX(0)" : "translateX(0)",
            opacity: shouldShow ? 1 : 0,
            transition: "transform 1.2s ease-in-out, opacity 1.2s ease-in-out",
          },
        };
      case "fade-left":
        return {
          name: {
            transform: shouldShow ? "translateX(0)" : "translateX(-30px)",
            opacity: shouldShow ? 1 : 0,
            transition:
              "transform 0.6s ease-in-out 0.5s, opacity 0.6s ease-in-out 0.5s",
            textAlign: "right",
          },
          role: {
            transform: shouldShow ? "translateX(0)" : "translateX(0)",
            opacity: shouldShow ? 1 : 0,
            transition: "transform 1.2s ease-in-out, opacity 1.2s ease-in-out",
            textAlign: "right",
          },
        };
      case "center":
        return {
          name: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out 0.5s",
            textAlign: "center",
          },
          role: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            textAlign: "center",
          },
        };
      default:
        return {
          name: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
          },
          role: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out 0.1s",
          },
        };
    }
  };

  return (
    <div 
      className="relative bg-gray-100 w-full h-full" 
      style={{
        borderRadius: 'inherit',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {/* Main Image Container */}
      <div
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={{
          borderRadius: 'inherit',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        onMouseEnter={disabled ? undefined : handleMouseEnterImage}
        onMouseLeave={disabled ? undefined : handleMouseLeaveImage}
        onTouchStart={disabled ? undefined : handleTouchStart}
        onTouchEnd={disabled ? undefined : handleTouchEnd}
      >
        {/* Base Image - Full Team */}
        <img
          src="/Property 1=Image.png"
          alt="BaFT Team Full"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            objectPosition: "center center",
            opacity: activeImageId === "full" ? 1 : 0.999,
            transition: "opacity 1200ms ease-in-out",
            zIndex: 1,
          }}
          onLoad={() => {}}
        />

        {/* Individual Member Images */}
        {teamMembers.map((member) => {
          const isLoaded = loadedImages.has(member.image);
          const isActive = activeImageId === member.id;

          return (
            <img
              key={member.id}
              src={member.image}
              alt={`BaFT Team ${member.name}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{
                objectPosition: "center center",
                opacity: isActive && isLoaded ? 1 : 0,
                transition: "opacity 1200ms ease-in-out",
                zIndex: isActive ? 2 : 1,
                display: isLoaded ? "block" : "none",
              }}
              onLoad={() => {
                setLoadedImages((prev) => new Set([...prev, member.image]));
              }}
            />
          );
        })}

        {/* Text Overlays for all members */}
        {teamMembers.map((member) => {
          const memberAnimationStyles = getAnimationStyles(member);

          return (
            <div
              key={member.id}
              className="absolute z-30 pointer-events-none"
              style={{
                ...member.textPosition,
                maxWidth: '280px',
              }}
            >
              <div className="text-white">
                <h3
                  className="text-2xl font-bold leading-tight mb-2"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    ...memberAnimationStyles.name,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-lg leading-tight"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "150",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    ...memberAnimationStyles.role,
                  }}
                >
                  {member.position}
                </p>
              </div>
            </div>
          );
        })}

        {/* Invisible hover areas */}
        {!disabled && teamMembers.map((member) => (
          <div
            key={member.id}
            className="absolute cursor-pointer z-20"
            style={{
              left: member.area.x,
              top: member.area.y,
              width: member.area.width,
              height: member.area.height,
            }}
            onMouseEnter={() => handleMouseEnterMember(member.id)}
            onTouchStart={() => handleMouseEnterMember(member.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Main mobile component
const AboutMobile = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [forcedAnimT, setForcedAnimT] = useState(0);
  const [isForceAnimating, setIsForceAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasAnimationTriggered, setHasAnimationTriggered] = useState(false);
  const sectionRef = useRef(null);
  
  const imageRef = useRef(null);
  const triggerRef = useRef(null);
  const imageStartRef = useRef(null);
  const [startRect, setStartRect] = useState(null);
  const isForceAnimatingRef = useRef(false);
  const transitionTriggeredRef = useRef(false);
  const hasAnimationTriggeredRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  const scrollDampeningRef = useRef(0);
  const smoothScrollProgressRef = useRef(0);
  const lastScrollVelocityRef = useRef(0);
  const scrollVelocityHistoryRef = useRef([]);
  const scrollMomentumRef = useRef(0);
  const isScrollControlledRef = useRef(false);
  const originalBodyOverflowRef = useRef('');
  const originalBodyTouchActionRef = useRef('');
  const originalHtmlOverscrollRef = useRef('');
  const FORCED_DURATION_MS = 3800; // 3.8 seconds for expansion (optimized for mobile)

  // Central lock/release functions for body scroll prevention
  const lockBodyScroll = () => {
    try {
      originalBodyOverflowRef.current = document.body.style.overflow;
      originalBodyTouchActionRef.current = document.body.style.touchAction;
      originalHtmlOverscrollRef.current = document.documentElement.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
    } catch (e) {
      console.warn('Could not lock body scroll:', e);
    }
  };

  const releaseBodyScroll = () => {
    try {
      document.body.style.overflow = originalBodyOverflowRef.current || '';
      document.body.style.touchAction = originalBodyTouchActionRef.current || '';
      document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
    } catch (e) {
      console.warn('Could not release body scroll:', e);
    }
  };

  // Central event prevention system
  const preventEventListeners = [];
  const addEventPrevention = () => {
    const prevent = (evt) => { 
      evt.preventDefault(); 
      evt.stopPropagation(); 
      return false; 
    };
    
    const events = ['wheel', 'touchmove', 'touchstart', 'touchend', 'scroll', 'keydown'];
    const addOpts = { passive: false, capture: true };
    
    events.forEach(eventType => {
      document.addEventListener(eventType, prevent, addOpts);
      preventEventListeners.push({ eventType, handler: prevent, options: addOpts });
    });
  };

  const removeEventPrevention = () => {
    preventEventListeners.forEach(({ eventType, handler, options }) => {
      document.removeEventListener(eventType, handler, options);
    });
    preventEventListeners.length = 0;
  };

  // Cleanup on unmount to prevent frozen state
  useEffect(() => {
    return () => {
      releaseBodyScroll();
      removeEventPrevention();
      isForceAnimatingRef.current = false;
      // Don't reset transition state if transition has been triggered to prevent image from returning to placeholder
      // transitionTriggeredRef.current = false;
      // setIsTransitioning(false);
    };
  }, []);

  // Robust auto-scroll to next section (CombinedFooter)
  const scrollToNextSection = () => {
    console.log('AboutMobile: Starting auto-scroll to next section...');
    
    // Method 1: Use slide navigation system (most reliable)
    try {
      const evt = new CustomEvent('navigateToSlide', { 
        detail: { index: 8, slow: false, instant: false } // Navigate to slide 8 (CombinedFooter)
      });
      window.dispatchEvent(evt);
      console.log('AboutMobile: Dispatched navigateToSlide event to slide 8');
      
      // Also dispatch the transition event
      const transitionEvt = new CustomEvent('aboutToPreFooterTransition');
      window.dispatchEvent(transitionEvt);
      console.log('AboutMobile: Dispatched aboutToPreFooterTransition event');
      return;
    } catch (e) {
      console.warn('AboutMobile: Slide navigation failed:', e);
    }
    
    // Method 2: Direct DOM targeting
    const targets = [
      '.pre-footer-container',
      '#footer', 
      '[data-theme="dark"]',
      '.combined-footer',
      'section[data-theme="dark"]'
    ];
    
    for (const selector of targets) {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`AboutMobile: Found target with selector "${selector}"`);
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return;
      }
    }
    
    // Method 3: Find next section after about
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      let nextElement = aboutSection.nextElementSibling;
      while (nextElement && nextElement.tagName !== 'SECTION') {
        nextElement = nextElement.nextElementSibling;
      }
      
      if (nextElement) {
        console.log('AboutMobile: Found next section element');
        nextElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return;
      }
    }
    
    // Method 4: Force scroll by viewport height
    console.log('AboutMobile: Using fallback - scroll by viewport height');
    const currentScroll = window.pageYOffset;
    const targetScroll = currentScroll + window.innerHeight;
    
    window.scrollTo({
      top: Math.min(targetScroll, document.documentElement.scrollHeight - window.innerHeight),
      behavior: 'smooth'
    });
  };

  // Shared forced animation function
  const runForcedAnimation = (startProgress = 0) => {
    if (isForceAnimatingRef.current) return;
    
    isForceAnimatingRef.current = true;
    transitionTriggeredRef.current = false;
    setIsForceAnimating(true);
    setHasAnimationTriggered(true); // Mark that animation has been triggered
    hasAnimationTriggeredRef.current = true; // Also set ref for more robust tracking

    // Lock body scroll and add event prevention
    lockBodyScroll();
    addEventPrevention();

    // Animate progress to 1 over duration with improved easing
    const startTime = performance.now();
    
    const step = (nowTs) => {
      const now = nowTs || performance.now();
      const t = Math.max(0, Math.min((now - startTime) / FORCED_DURATION_MS, 1));
      // Improved easing: cubic-bezier(0.65, 0, 0.35, 1) - hits harder at start
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const next = startProgress + (1 - startProgress) * eased;
      
      setScrollProgress(next);
      setForcedAnimT(t);
      
      // Phase 1: Image expansion (0 to 0.8)
      // Phase 2: Dark overlay appears (0.8 to 1.0)
      const expansionPhase = Math.min(1, t / 0.8); // Expansion completes at 80% of animation
      const overlayPhase = Math.max(0, (t - 0.8) / 0.2); // Overlay phase from 80% to 100%
      
      // Overlay only appears after expansion is complete
      const overlayOpacity = t >= 0.8 ? Math.min(0.7, overlayPhase * 0.7) : 0;
      
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        // Release locks and cleanup
        releaseBodyScroll();
        removeEventPrevention();
        
        isForceAnimatingRef.current = false;
        setIsForceAnimating(false);
        // Keep forcedAnimT at 1 to maintain the expanded state during transition
        setForcedAnimT(1);
        
        // Set transition state to keep floating overlay visible
        setIsTransitioning(true);
        transitionTriggeredRef.current = true;
        
        // Trigger transition after animation completes with proper timing
        setTimeout(() => {
          scrollToNextSection();
        }, 1000); // Give time for dark overlay to appear and image to be visible
        
        // Keep the floating overlay visible permanently to prevent image from returning to container
        // Don't fade out the overlay - let it stay visible during and after transition
        // setTimeout(() => {
        //   const floatingOverlay = document.querySelector('.floating-overlay-container');
        //   if (floatingOverlay) {
        //     floatingOverlay.style.transition = 'opacity 1.5s ease-out';
        //     floatingOverlay.style.opacity = '0';
        //   }
        // }, 1500); // Commented out to prevent image from returning to container
      }
    };

    requestAnimationFrame(step);
  };

  // Measure starting position/size of the image
  useEffect(() => {
    const measure = () => {
      if (imageStartRef.current) {
        const rect = imageStartRef.current.getBoundingClientRect();
        setStartRect({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Comprehensive scroll control system
  useEffect(() => {
    if (!sectionRef.current) return;

    let rafId = null;
    let smoothRafId = null;
    let scrollControlRafId = null;

    const handleScroll = (e) => {
      if (!triggerRef.current || rafId || isForceAnimatingRef.current) return;

      // Apply scroll momentum control
      if (isScrollControlledRef.current) {
        e.preventDefault();
        e.stopPropagation();
        
        // Apply controlled scroll with momentum
        const scrollDelta = e.deltaY * 0.1; // Reduce scroll sensitivity
        scrollMomentumRef.current += scrollDelta;
        scrollMomentumRef.current *= 0.9; // Apply friction
        
        // Limit momentum
        scrollMomentumRef.current = Math.max(-50, Math.min(50, scrollMomentumRef.current));
        
        return false;
      }

      rafId = requestAnimationFrame(() => {
        try {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const triggerHeight = triggerRef.current.offsetHeight;
          const windowHeight = window.innerHeight;
          
          // Calculate progress based on trigger position
          if (triggerRect.top <= 0 && triggerRect.bottom > windowHeight) {
            // We're in the pinned zone
            const scrolledIntoTrigger = Math.abs(triggerRect.top);
            const totalScrollDistance = Math.max(triggerHeight - windowHeight, 1);
            const rawProgress = Math.max(0, Math.min(scrolledIntoTrigger / totalScrollDistance, 1));
            
            // Apply aggressive dampening to make scroll feel controlled
            const dampeningFactor = 0.2; // Further reduce scroll sensitivity
            const dampenedProgress = rawProgress * dampeningFactor;
            
            // Smooth the progress to prevent harsh movements
            const smoothingFactor = 0.05; // Slower smoothing for more control
            smoothScrollProgressRef.current += (dampenedProgress - smoothScrollProgressRef.current) * smoothingFactor;
            
            setScrollProgress(smoothScrollProgressRef.current);
          } else if (triggerRect.top > 0) {
            // Before the trigger - smooth transition to 0
            smoothScrollProgressRef.current += (0 - smoothScrollProgressRef.current) * 0.05;
            setScrollProgress(smoothScrollProgressRef.current);
          } else {
            // After the trigger - smooth transition to 1
            smoothScrollProgressRef.current += (1 - smoothScrollProgressRef.current) * 0.05;
            setScrollProgress(smoothScrollProgressRef.current);
          }
        } catch (error) {
          console.warn('Scroll calculation error:', error);
          setScrollProgress(0);
        } finally {
          rafId = null;
        }
      });
    };

    // Scroll control animation loop
    const scrollControlAnimation = () => {
      if (isScrollControlledRef.current && scrollMomentumRef.current !== 0) {
        // Apply controlled scroll movement
        const controlledDelta = scrollMomentumRef.current * 0.1;
        window.scrollBy(0, controlledDelta);
        
        scrollControlRafId = requestAnimationFrame(scrollControlAnimation);
      }
    };

    // Smooth animation loop for continuous dampening
    const smoothAnimation = () => {
      if (!isForceAnimatingRef.current) {
        smoothRafId = requestAnimationFrame(smoothAnimation);
      }
    };
    smoothAnimation();

    window.addEventListener('scroll', handleScroll, { passive: false });
    window.addEventListener('wheel', handleScroll, { passive: false });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (smoothRafId) {
        cancelAnimationFrame(smoothRafId);
      }
      if (scrollControlRafId) {
        cancelAnimationFrame(scrollControlRafId);
      }
    };
  }, []);

  // Force expansion on scroll down (mobile touch/wheel)
  useEffect(() => {
      if (!sectionRef.current) return;
      
    const addOpts = { passive: false, capture: true };
    const minSwipeDistance = 40;
    let touchStartY = null;

    const handleWheel = (e) => {
      if (isForceAnimatingRef.current) return;
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;

      // Only trigger on scroll down with sufficient intensity
      if (e.deltaY <= 0) return;
      
      // Enable scroll control for this section
      isScrollControlledRef.current = true;
      
      // Aggressive scroll intensity control to prevent flying off
      const scrollIntensity = Math.abs(e.deltaY);
      const minScrollIntensity = 5; // Lower minimum for more responsive feel
      const maxScrollIntensity = 40; // Even lower maximum for better control
      
      if (scrollIntensity < minScrollIntensity || scrollIntensity > maxScrollIntensity) {
        return; // Block both too gentle and too harsh scrolls
      }
      
      // Apply very aggressive dampening for controlled feel
      let dampeningFactor = 0.15; // Start with very low factor
      if (scrollIntensity > 20) {
        dampeningFactor = 0.08; // Even lower for medium scrolls
      }
      if (scrollIntensity > 30) {
        dampeningFactor = 0.03; // Very low for harsh scrolls
      }
      
      const dampenedIntensity = scrollIntensity * dampeningFactor;
      
      // Track scroll velocity to prevent rapid consecutive scrolls
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTimeRef.current;
      const scrollVelocity = scrollIntensity / Math.max(timeSinceLastScroll, 1);
      
      // Add to velocity history
      scrollVelocityHistoryRef.current.push(scrollVelocity);
      if (scrollVelocityHistoryRef.current.length > 5) {
        scrollVelocityHistoryRef.current.shift();
      }
      
      // Calculate average velocity
      const avgVelocity = scrollVelocityHistoryRef.current.reduce((a, b) => a + b, 0) / scrollVelocityHistoryRef.current.length;
      
      // Block if velocity is too high (rapid consecutive scrolls)
      if (avgVelocity > 2 || timeSinceLastScroll < 300) { // Increased debounce time
        return;
      }
      
      lastScrollTimeRef.current = now;

      e.preventDefault();
      e.stopPropagation();

      isForceAnimatingRef.current = true;
      setIsForceAnimating(true);

      // Lock scroll during animation
      const prevent = (evt) => { 
        evt.preventDefault(); 
        evt.stopPropagation(); 
        return false; 
      };

      try {
        originalBodyOverflowRef.current = document.body.style.overflow;
        originalBodyTouchActionRef.current = document.body.style.touchAction;
        originalHtmlOverscrollRef.current = document.documentElement.style.overscrollBehavior;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
      } catch {}

      document.addEventListener('wheel', prevent, addOpts);
      document.addEventListener('touchmove', prevent, addOpts);
      document.addEventListener('touchstart', prevent, addOpts);
      document.addEventListener('touchend', prevent, addOpts);
      document.addEventListener('scroll', prevent, addOpts);

      // Animate progress to 1 over duration
      const startTime = performance.now();
      const startProgress = Math.max(0, Math.min(scrollProgress, 1));

      const step = (nowTs) => {
        const now = nowTs || performance.now();
        const t = Math.max(0, Math.min((now - startTime) / FORCED_DURATION_MS, 1));
        
        // Use very gentle easing to make animation feel subtle
        const eased = t * t * (3 - 2 * t); // Smooth step function for subtle feel
        const next = startProgress + (1 - startProgress) * eased;
        setScrollProgress(next);
        setForcedAnimT(t);
        
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          // Release locks
          document.removeEventListener('wheel', prevent, addOpts);
          document.removeEventListener('touchmove', prevent, addOpts);
          document.removeEventListener('touchstart', prevent, addOpts);
          document.removeEventListener('touchend', prevent, addOpts);
          document.removeEventListener('scroll', prevent, addOpts);
          
          try {
            document.body.style.overflow = originalBodyOverflowRef.current || '';
            document.body.style.touchAction = originalBodyTouchActionRef.current || '';
            document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
          } catch {}

          isForceAnimatingRef.current = false;
          setIsForceAnimating(false);
          setForcedAnimT(1); // Keep at 1 to maintain expanded state permanently
          
          // Auto-scroll to CombinedFooterMobile pre-footer section after animation completes
          setTimeout(() => {
            console.log('AboutMobile: Starting auto-scroll to pre-footer...');
            console.log('AboutMobile: Current scroll position:', window.pageYOffset);
            console.log('AboutMobile: Document height:', document.documentElement.scrollHeight);
            
            // Use the centralized scroll function
            
            // Execute scroll immediately
            scrollToNextSection();
            
            // Removed retry logic to prevent multiple triggers
            
            // Removed fallback logic to prevent multiple triggers
            
            // Dispatch custom event for other components to listen to
            try {
              const evt = new CustomEvent('aboutMobileExpansionComplete');
              window.dispatchEvent(evt);
              console.log('AboutMobile: Dispatched aboutMobileExpansionComplete event');
            } catch (e) {
              console.warn('Could not dispatch aboutMobileExpansionComplete event:', e);
            }
          }, 1000); // Increased delay to ensure animation is fully complete (matching desktop)
        }
      };

      requestAnimationFrame(step);
    };

    const handleTouchStart = (e) => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : null;
    };

    const handleTouchEnd = (e) => {
      if (isForceAnimatingRef.current) return;
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      if (touchStartY == null) return;
      
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
      const distance = touchStartY - endY; // swipe up -> positive distance
      if (distance < minSwipeDistance) return;

      e.preventDefault();
      e.stopPropagation();

      // Trigger the same forced animation as wheel down
      isForceAnimatingRef.current = true;
      setIsForceAnimating(true);
      
      const prevent = (evt) => { 
        evt.preventDefault(); 
        evt.stopPropagation(); 
        return false; 
      };

      try {
        originalBodyOverflowRef.current = document.body.style.overflow;
        originalBodyTouchActionRef.current = document.body.style.touchAction;
        originalHtmlOverscrollRef.current = document.documentElement.style.overscrollBehavior;
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.documentElement.style.overscrollBehavior = 'none';
      } catch {}

      document.addEventListener('wheel', prevent, addOpts);
      document.addEventListener('touchmove', prevent, addOpts);
      document.addEventListener('touchstart', prevent, addOpts);
      document.addEventListener('touchend', prevent, addOpts);
      document.addEventListener('scroll', prevent, addOpts);

      const startTime = performance.now();
      const startProgress = Math.max(0, Math.min(scrollProgress, 1));
      
      const step = (nowTs) => {
        const now = nowTs || performance.now();
        const t = Math.max(0, Math.min((now - startTime) / FORCED_DURATION_MS, 1));
        const eased = 1 - Math.pow(1 - t, 4);
        const next = startProgress + (1 - startProgress) * eased;
        setScrollProgress(next);
        setForcedAnimT(t);
        
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          document.removeEventListener('wheel', prevent, addOpts);
          document.removeEventListener('touchmove', prevent, addOpts);
          document.removeEventListener('touchstart', prevent, addOpts);
          document.removeEventListener('touchend', prevent, addOpts);
          document.removeEventListener('scroll', prevent, addOpts);
          
          try {
            document.body.style.overflow = originalBodyOverflowRef.current || '';
            document.body.style.touchAction = originalBodyTouchActionRef.current || '';
            document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
          } catch {}

          isForceAnimatingRef.current = false;
          setIsForceAnimating(false);
          setForcedAnimT(1); // Keep at 1 to maintain expanded state permanently
          
          // Auto-scroll to CombinedFooterMobile pre-footer section after animation completes
          setTimeout(() => {
            console.log('AboutMobile: Starting auto-scroll to pre-footer...');
            console.log('AboutMobile: Current scroll position:', window.pageYOffset);
            console.log('AboutMobile: Document height:', document.documentElement.scrollHeight);
            
            // Use the centralized scroll function
            
            // Execute scroll immediately
            scrollToNextSection();
            
            // Removed retry logic to prevent multiple triggers
            
            // Removed fallback logic to prevent multiple triggers
            
            // Dispatch custom event for other components to listen to
            try {
              const evt = new CustomEvent('aboutMobileExpansionComplete');
              window.dispatchEvent(evt);
              console.log('AboutMobile: Dispatched aboutMobileExpansionComplete event');
            } catch (e) {
              console.warn('Could not dispatch aboutMobileExpansionComplete event:', e);
            }
          }, 1000); // Increased delay to ensure animation is fully complete (matching desktop)
        }
      };
      
      requestAnimationFrame(step);
    };

    const el = sectionRef.current;
    el.addEventListener('wheel', handleWheel, addOpts);
    el.addEventListener('touchstart', handleTouchStart, addOpts);
    el.addEventListener('touchend', handleTouchEnd, addOpts);

    return () => {
      el.removeEventListener('wheel', handleWheel, addOpts);
      el.removeEventListener('touchstart', handleTouchStart, addOpts);
      el.removeEventListener('touchend', handleTouchEnd, addOpts);
    };
  }, [scrollProgress]);

  // Animation values
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easedProgress = easeInOutCubic(scrollProgress);
  
  // Overlay and zoom-out timing based on forced animation time (matching desktop)
  const overlayStartT = 200 / FORCED_DURATION_MS; // Start overlay after 200ms (same as desktop)
  const overlayProgress = Math.max(0, Math.min(1, (forcedAnimT - overlayStartT) / Math.max(0.0001, 1 - overlayStartT)));
  const overlayOpacity = Math.min(1, overlayProgress * 1); // up to 100% black to mask handoff (same as desktop)
  const zoomScale = 1 + 0.10 * overlayProgress; // zoom in up to 110% (same as desktop)
  const disperseOpacity = 1 - 0.2 * overlayProgress; // slight fade of image content under overlay (same as desktop)

  return (
    <div ref={triggerRef} className="relative" style={{ height: '300vh' }}>
    <section
      ref={sectionRef}
      id="about"
      data-theme="light"
        className="sticky top-0 bg-white flex items-center justify-center"
      style={{ 
          height: '100vh',
          width: '100vw',
          overflow: 'hidden',
          paddingTop: 'clamp(56px, 14vw, 112px)',
          // Add scroll dampening CSS
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth'
        }}
      >
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col h-full">
        {/* Content Column */}
                  <div
            className="flex flex-col justify-center flex-1"
            style={{
              padding: "clamp(12px, 3vw, 28px)",
              opacity: 1 - easedProgress,
              transition: 'none',
              pointerEvents: (1 - easedProgress) < 0.05 ? 'none' : 'auto',
            }}
          >
          <p
              className="font-normal mb-2 flex items-center gap-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: "400",
              fontStyle: "normal",
              fontSize: "clamp(8px, 2.5vw, 12px)",
              lineHeight: "clamp(8px, 2.5vw, 12px)",
              letterSpacing: "-0.14px",
              verticalAlign: "middle",
              color: "#092646",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: 1,
            }}
          >
            <img 
              src="/SVG.svg" 
              alt="Icon" 
              style={{
                width: "clamp(8px, 2.5vw, 12px)",
                height: "clamp(8px, 2.5vw, 12px)",
                transform: "rotate(-0.08deg)",
                opacity: 1,
                flexShrink: 0,
              }}
            />
            <span style={{ whiteSpace: "nowrap" }}>Know our story</span>
          </p>
          
          <h1
              className="leading-tight mb-3 sm:mb-4"
            style={{
              fontFamily: "EB Garamond, serif",
              fontWeight: "700",
              fontStyle: "normal",
              fontSize: "clamp(24px, 7.5vw, 33.02px)",
              lineHeight: "clamp(24px, 7.5vw, 33.02px)",
              letterSpacing: "-0.14px",
              verticalAlign: "middle",
              color: "#1966BB",
              width: "clamp(140px, 40vw, 172px)",
              height: "clamp(24px, 7.5vw, 34px)",
              opacity: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span className="block">About BaFT</span>
          </h1>

          <ReadMoreText
            content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
            onExpandChange={setIsExpanded}
          />
        </div>

        {/* Image Column */}
          <div className="flex justify-center items-center flex-1">
        <div 
              ref={imageStartRef}
              className="relative rounded-2xl overflow-hidden"
          style={{
                width: "clamp(327px, 80vw, 400px)",
                height: "clamp(462px, 100vh, 600px)",
                opacity: (easedProgress > 0.08 || forcedAnimT >= 0.8 || isTransitioning || transitionTriggeredRef.current || forcedAnimT > 0 || hasAnimationTriggered || hasAnimationTriggeredRef.current) ? 0 : 1, // Hide original image during animation and permanently after
                // Debug: Add a visual indicator
                border: hasAnimationTriggered ? '2px solid red' : 'none',
                transition: 'opacity 200ms ease-out',
                // Ensure no movement or jumping
                transform: 'none',
                position: 'relative',
                zIndex: 1,
                // Lock the position to prevent any floating
                left: 'auto',
                top: 'auto',
                right: 'auto',
                bottom: 'auto',
              }}
            >
              <InteractiveTeamImage disabled={easedProgress > 0.02} />
            </div>
          </div>
        </div>

                                        {/* Floating overlay image that enlarges to full screen and stays visible during transition */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Permanent floating overlay - never disappears once animation is triggered */}
          {startRect && hasAnimationTriggeredRef.current && startRect.width > 0 && startRect.height > 0 && (() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            
            // Calculate center positions with strict bounds to prevent flying off screen
            const clampedStartLeft = Math.max(0, Math.min(startRect.left, vw));
            const clampedStartTop = Math.max(0, Math.min(startRect.top, vh));
            const clampedStartWidth = Math.max(0, Math.min(startRect.width, vw));
            const clampedStartHeight = Math.max(0, Math.min(startRect.height, vh));
            
            const startCenterX = clampedStartLeft + clampedStartWidth / 2;
            const startCenterY = clampedStartTop + clampedStartHeight / 2;
            
            // Ensure perfect viewport centering for mobile - use actual viewport dimensions
            const targetCenterX = vw / 2;
            const targetCenterY = vh / 2;
            
            // Mobile-specific viewport centering adjustments
            const mobileViewportCenterX = window.innerWidth / 2;
            const mobileViewportCenterY = window.innerHeight / 2;
            
            // Calculate expansion phase based on current animation progress
            const currentExpansionPhase = Math.min(1, forcedAnimT / 0.8); // Expansion completes at 80% of animation
            const imageExpansionProgress = (isTransitioning || transitionTriggeredRef.current) ? 1 : Math.max(currentExpansionPhase, 0.08);
            
            // Keep image anchored to original position during expansion to prevent flying off
            const currentCenterX = startCenterX; // Stay at original position
            const currentCenterY = startCenterY; // Stay at original position
            
            // Calculate dimensions with strict size limits to prevent flying off
            const maxExpansionFactor = 1.5; // Limit expansion to 150% of original size
            const currentW = imageExpansionProgress >= 1 ? vw : Math.min(vw, startRect.width * (1 + imageExpansionProgress * maxExpansionFactor));
            const currentH = imageExpansionProgress >= 1 ? vh : Math.min(vh, startRect.height * (1 + imageExpansionProgress * maxExpansionFactor));
            
            // Position from center (so it's properly centered)
            // When fully expanded, ensure it covers the entire viewport
            const currentLeft = imageExpansionProgress >= 1 ? 0 : (currentCenterX - currentW / 2);
            const currentTop = imageExpansionProgress >= 1 ? 0 : (currentCenterY - currentH / 2);
            
            const currentRadius = imageExpansionProgress >= 1 ? 0 : Math.max(0, 16 * (1 - imageExpansionProgress));
            const boxShadowOpacity = 0.25 * (1 - imageExpansionProgress);

            return (
                            <div
                className="absolute floating-overlay-container"
            style={{
                  position: 'fixed', // Use fixed positioning to break out of container constraints
                  left: `${imageExpansionProgress >= 1 ? 0 : (() => {
                    // Aggressive bounds to prevent flying off
                    const maxLeft = Math.max(0, vw - currentW);
                    const safeLeft = Math.max(0, Math.min(startRect.left, maxLeft));
                    return safeLeft;
                  })()}px`,
                  top: `${imageExpansionProgress >= 1 ? 0 : (() => {
                    // Aggressive bounds to prevent flying off
                    const maxTop = Math.max(0, vh - currentH);
                    const safeTop = Math.max(0, Math.min(startRect.top, maxTop));
                    return safeTop;
                  })()}px`,
                  right: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  bottom: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  width: `${currentW}px`,
                  height: `${currentH}px`,
                  borderRadius: `${currentRadius}px`,
                  overflow: 'hidden',
                  boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                  pointerEvents: 'none',
                  transform: `scale(${isTransitioning ? 1.05 : zoomScale})`,
                  transformOrigin: 'center center',
                  transition: isTransitioning ? 'all 0.8s ease-out' : 'none', // Smooth transition during scroll
                  zIndex: 50,
                  opacity: 1, // Keep fully visible to prevent image from returning to container
                }}
              >
                <div className="relative w-full h-full" style={{ 
                  opacity: (isTransitioning || transitionTriggeredRef.current) ? 0.8 : (forcedAnimT >= 0.8 ? 0.8 : disperseOpacity),
                  transition: isTransitioning ? 'opacity 0.8s ease-out' : 'none'
                }}>
                  <InteractiveTeamImage disabled={true} />
                </div>
                {/* Dark transparent overlay that appears after expansion and stays visible during transition */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0, 0, 0, 0.7)', 
                    opacity: (isTransitioning || transitionTriggeredRef.current) ? 0.7 : (forcedAnimT >= 0.8 ? Math.min(0.7, ((forcedAnimT - 0.8) / 0.2) * 0.7) : 0), 
                    pointerEvents: 'none',
                    transition: isTransitioning ? 'opacity 0.8s ease-out' : 'none'
                  }} 
                />
              </div>
            );
          })()}
          
          {/* Fallback floating overlay for expansion phase */}
          {startRect && !hasAnimationTriggeredRef.current && (easedProgress > 0.08 || forcedAnimT >= 0.8 || isTransitioning || transitionTriggeredRef.current || forcedAnimT > 0) && (() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            
            // Calculate center positions for proper responsive centering on mobile
            const startCenterX = startRect.left + startRect.width / 2;
            const startCenterY = startRect.top + startRect.height / 2;
            
            // Ensure perfect viewport centering for mobile - use actual viewport dimensions
            const targetCenterX = vw / 2;
            const targetCenterY = vh / 2;
            
            // Mobile-specific viewport centering adjustments
            const mobileViewportCenterX = window.innerWidth / 2;
            const mobileViewportCenterY = window.innerHeight / 2;
            
            // Calculate expansion phase based on current animation progress
            const currentExpansionPhase = Math.min(1, forcedAnimT / 0.8); // Expansion completes at 80% of animation
            const imageExpansionProgress = Math.max(currentExpansionPhase, 0.08);
            
            // Interpolate center positions with mobile-optimized centering
            const currentCenterX = startCenterX + (mobileViewportCenterX - startCenterX) * imageExpansionProgress;
            const currentCenterY = startCenterY + (mobileViewportCenterY - startCenterY) * imageExpansionProgress;
            
            // Calculate dimensions - ensure full viewport coverage when expanded
            const targetW = vw; // fill screen width
            const targetH = vh; // fill screen height
            const currentW = imageExpansionProgress >= 1 ? vw : (startRect.width + (targetW - startRect.width) * imageExpansionProgress);
            const currentH = imageExpansionProgress >= 1 ? vh : (startRect.height + (targetH - startRect.height) * imageExpansionProgress);
            
            // Position from center (so it's properly centered)
            // When fully expanded, ensure it covers the entire viewport
            const currentLeft = imageExpansionProgress >= 1 ? 0 : (currentCenterX - currentW / 2);
            const currentTop = imageExpansionProgress >= 1 ? 0 : (currentCenterY - currentH / 2);
            
            const currentRadius = imageExpansionProgress >= 1 ? 0 : Math.max(0, 16 * (1 - imageExpansionProgress));
            const boxShadowOpacity = 0.25 * (1 - imageExpansionProgress);

            return (
              <div
                className="absolute floating-overlay-container"
                style={{
                  position: 'fixed', // Use fixed positioning to break out of container constraints
                  left: `${imageExpansionProgress >= 1 ? 0 : (() => {
                    const constrainedLeft = Math.max(0, Math.min(currentLeft, vw - currentW));
                    return (currentW > vw) ? 0 : constrainedLeft;
                  })()}px`,
                  top: `${imageExpansionProgress >= 1 ? 0 : (() => {
                    const constrainedTop = Math.max(0, Math.min(currentTop, vh - currentH));
                    return (currentH > vh) ? 0 : constrainedTop;
                  })()}px`,
                  width: `${currentW}px`,
                  height: `${currentH}px`,
                  borderRadius: `${currentRadius}px`,
                  overflow: 'hidden',
                  boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                  pointerEvents: 'none',
                  transform: `scale(${isTransitioning ? 1.05 : zoomScale})`,
                  transformOrigin: 'center center',
                  transition: isTransitioning ? 'all 0.8s ease-out' : 'none', // Smooth transition during scroll
                  zIndex: 50,
                  opacity: 1, // Keep fully visible to prevent image from returning to container
                }}
              >
                <div className="relative w-full h-full" style={{ 
                  opacity: (isTransitioning || transitionTriggeredRef.current) ? 0.8 : (forcedAnimT >= 0.8 ? 0.8 : disperseOpacity),
                  transition: isTransitioning ? 'opacity 0.8s ease-out' : 'none'
                }}>
                  <InteractiveTeamImage disabled={true} />
                </div>
                {/* Dark transparent overlay that appears after expansion and stays visible during transition */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'rgba(0, 0, 0, 0.7)', 
                    opacity: (isTransitioning || transitionTriggeredRef.current) ? 0.7 : (forcedAnimT >= 0.8 ? Math.min(0.7, ((forcedAnimT - 0.8) / 0.2) * 0.7) : 0), 
                    pointerEvents: 'none',
                    transition: isTransitioning ? 'opacity 0.8s ease-out' : 'none'
                  }} 
                />
              </div>
            );
          })()}
          </div>

    </section>
      </div>
  );
};

export default AboutMobile;