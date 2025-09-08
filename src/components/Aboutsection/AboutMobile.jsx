import React, { useState, useRef, useEffect, useMemo } from "react";
import "./About.css";

// Hoisted constants and helpers
const FORCED_DURATION_MS = 3800; // 3.8 seconds for expansion (optimized for mobile)
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Simplified ReadMoreText for mobile (memoized)
const ReadMoreText = React.memo(({ content, maxLength = 200, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);

  const isLong = content.length > maxLength;

  // Split content into paragraphs
  const paragraphs = useMemo(() => (
    content
      .split(/\n+/)
      .map((para) => para.trim())
      .filter((para) => para.length > 0)
  ), [content]);

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
            transition: "height 8s cubic-bezier(0.1, 0.0, 0.1, 1)",
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
              transition: "all 8s cubic-bezier(0.1, 0.0, 0.1, 1)",
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
                transition: "all 8s cubic-bezier(0.1, 0.0, 0.1, 1)",
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
});

// Use the same InteractiveTeamImage component from About.jsx (slightly memoized)
const InteractiveTeamImage = React.memo(({ disabled = false }) => {
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
});

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
  const lockedStartRectRef = useRef(null);
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
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const startedOnInteractiveRef = useRef(false);
  // moved FORCED_DURATION_MS to module scope

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
  const preventEventListenersRef = useRef([]);
  const addEventPrevention = () => {
    const prevent = (evt) => { 
      if (evt.cancelable) {
        evt.preventDefault(); 
      }
      evt.stopPropagation(); 
      return false; 
    };
    
    const events = ['wheel', 'touchmove', 'touchstart', 'touchend', 'scroll', 'keydown'];
    const addOpts = { passive: false, capture: true };
    
    events.forEach(eventType => {
      document.addEventListener(eventType, prevent, addOpts);
      preventEventListenersRef.current.push({ eventType, handler: prevent, options: addOpts });
    });
  };

  const removeEventPrevention = () => {
    preventEventListenersRef.current.forEach(({ eventType, handler, options }) => {
      document.removeEventListener(eventType, handler, options);
    });
    preventEventListenersRef.current.length = 0;
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
    // Method 1: Use slide navigation system (most reliable)
    try {
      const evt = new CustomEvent('navigateToSlide', { 
        detail: { index: 8, slow: false, instant: false } // Navigate to slide 8 (CombinedFooter)
      });
      window.dispatchEvent(evt);
      
      // Also dispatch the transition event
      const transitionEvt = new CustomEvent('aboutToPreFooterTransition');
      window.dispatchEvent(transitionEvt);
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
        nextElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        return;
      }
    }
    
    // Method 4: Force scroll by viewport height
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
        if (e.cancelable) {
          e.preventDefault();
        }
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
            
            // Smooth the progress with per-frame clamping to avoid sudden jumps
            const smoothingFactor = 0.06; // Steady but responsive
            const desiredNext = smoothScrollProgressRef.current + (dampenedProgress - smoothScrollProgressRef.current) * smoothingFactor;
            const maxDelta = 0.02; // cap progress change per frame
            const delta = Math.max(-maxDelta, Math.min(maxDelta, desiredNext - smoothScrollProgressRef.current));
            smoothScrollProgressRef.current += delta;
            
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

  // Force expansion on scroll down (mobile touch/wheel) and suppress native scrolling while pinned
  useEffect(() => {
      if (!sectionRef.current) return;
      
    const addOpts = { passive: false, capture: true };
    const minSwipeDistance = 40;
    let touchStartY = null;

    const handleWheel = (e) => {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;

      // Always suppress native scroll inside pinned zone so image never moves with finger
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();

      if (isForceAnimatingRef.current) return false;

      // Only trigger on scroll down with sufficient intensity
      if (e.deltaY <= 0) return;
      
      // Enable scroll control for this section
      isScrollControlledRef.current = true;
      
      // Treat any harsh or sudden downward scroll as gentle and proceed
      // Reset velocity tracking so we don't block the animation
      lastScrollTimeRef.current = Date.now();
      scrollVelocityHistoryRef.current = [];

      isForceAnimatingRef.current = true;
      setIsForceAnimating(true);

      // Lock scroll during animation
      // Snapshot starting rect at the moment animation starts
      try {
        if (imageStartRef.current) {
          lockedStartRectRef.current = imageStartRef.current.getBoundingClientRect();
        }
      } catch {}
      const prevent = (evt) => { 
        if (evt.cancelable) {
          evt.preventDefault(); 
        }
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

      // Animate progress to 1 over duration (steady easing)
      const startTime = performance.now();
      const startProgress = Math.max(0, Math.min(scrollProgress, 1));

      const step = (nowTs) => {
        const now = nowTs || performance.now();
        const t = Math.max(0, Math.min((now - startTime) / FORCED_DURATION_MS, 1));
        // Unified easing for steady feel
        const eased = easeInOutCubic(t);
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
            // Use the centralized scroll function
            
            // Execute scroll immediately
            scrollToNextSection();
            
            // Removed retry logic to prevent multiple triggers
            
            // Removed fallback logic to prevent multiple triggers
            
            // Dispatch custom event for other components to listen to
            try {
              const evt = new CustomEvent('aboutMobileExpansionComplete');
              window.dispatchEvent(evt);
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
      
      // Get the primary touch point - more robust handling for different hand positions
      const t = e.touches && e.touches[0] ? e.touches[0] : null;
      if (!t) return;
      
      // Store touch coordinates with bounds checking
      touchStartY = Math.max(0, Math.min(t.clientY, window.innerHeight));
      touchStartXRef.current = Math.max(0, Math.min(t.clientX, window.innerWidth));
      touchStartYRef.current = touchStartY;
      
      // Allow taps on interactive elements (e.g., Read More button)
      startedOnInteractiveRef.current = !!(e.target && (e.target.closest && e.target.closest('.reveal-button')));
      // Do not prevent default immediately to allow clicks; prevention handled in touchmove if needed
    };

    const handleTouchMove = (e) => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      if (startedOnInteractiveRef.current) return;
      
      // Only prevent when there is an actual swipe move beyond a tiny threshold
      const t = e.touches && e.touches[0] ? e.touches[0] : null;
      if (!t) return;
      
      // More robust coordinate handling for different hand positions
      const currentX = Math.max(0, Math.min(t.clientX, window.innerWidth));
      const currentY = Math.max(0, Math.min(t.clientY, window.innerHeight));
      const startX = touchStartXRef.current || 0;
      const startY = touchStartYRef.current || 0;
      
      const dx = Math.abs(currentX - startX);
      const dy = Math.abs(currentY - startY);
      const moved = dx > 4 || dy > 4;
      
      if (moved) {
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopPropagation();
        return false;
      }
    };

    const handleTouchEnd = (e) => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      if (touchStartY == null) return;
      
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
      const distance = touchStartY - endY; // swipe up -> positive distance
      if (distance < minSwipeDistance) return;

      // If interaction started on interactive element, allow click; otherwise prevent scroll flicks
      if (!startedOnInteractiveRef.current) {
        // Only prevent default if the event is cancelable
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopPropagation();
      }

      // Trigger the same forced animation as wheel down
      if (isForceAnimatingRef.current) {
        startedOnInteractiveRef.current = false;
        return;
      }
      isForceAnimatingRef.current = true;
      setIsForceAnimating(true);
      
      const prevent = (evt) => { 
        if (evt.cancelable) {
          evt.preventDefault(); 
        }
        evt.stopPropagation(); 
        return false; 
      };

      try {
        // Snapshot starting rect at the moment animation starts (touch)
        if (imageStartRef.current) {
          lockedStartRectRef.current = imageStartRef.current.getBoundingClientRect();
        }
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
        // Unified easing for steady feel
        const eased = easeInOutCubic(t);
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
            // Use the centralized scroll function
            
            // Execute scroll immediately
            scrollToNextSection();
            
            // Removed retry logic to prevent multiple triggers
            
            // Removed fallback logic to prevent multiple triggers
            
            // Dispatch custom event for other components to listen to
            try {
              const evt = new CustomEvent('aboutMobileExpansionComplete');
              window.dispatchEvent(evt);
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
    el.addEventListener('touchmove', handleTouchMove, addOpts);
    el.addEventListener('touchend', handleTouchEnd, addOpts);

    return () => {
      el.removeEventListener('wheel', handleWheel, addOpts);
      el.removeEventListener('touchstart', handleTouchStart, addOpts);
      el.removeEventListener('touchmove', handleTouchMove, addOpts);
      el.removeEventListener('touchend', handleTouchEnd, addOpts);
    };
  }, [scrollProgress]);

  // Animation values (easing hoisted to module scope)
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
            content={`We're Vibha, Dion and Saket, the trio behind BaFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BaFT Technology was born.

At BaFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
            onExpandChange={setIsExpanded}
          />
        </div>

        {/* Image Column */}
          <div className="flex justify-center items-center flex-1">
        <div 
              ref={imageStartRef}
              className="relative rounded-2xl overflow-hidden"
          style={{
                width: "clamp(280px, 75vw, 380px)",
                height: isExpanded ? "clamp(462px, 100vh, 600px)" : "clamp(320px, 50vh, 400px)",
                opacity: (easedProgress > 0.08 || forcedAnimT >= 0.8 || isTransitioning || transitionTriggeredRef.current || forcedAnimT > 0 || hasAnimationTriggered || hasAnimationTriggeredRef.current) ? 0 : 1, // Hide original image during animation and permanently after
                // Debug: Add a visual indicator
                border: hasAnimationTriggered ? '2px solid red' : 'none',
                transition: 'opacity 200ms ease-out, height 8s cubic-bezier(0.1, 0.0, 0.1, 1)',
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
          {(lockedStartRectRef.current || startRect) && hasAnimationTriggeredRef.current && (lockedStartRectRef.current ? lockedStartRectRef.current.width > 0 : startRect.width > 0) && (() => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            
            // Calculate center positions with strict bounds to prevent flying off screen
            const baseRect = lockedStartRectRef.current || startRect;
            
            // More robust bounds checking to prevent image flying off
            const clampedStartLeft = Math.max(0, Math.min(baseRect.left, vw - baseRect.width));
            const clampedStartTop = Math.max(0, Math.min(baseRect.top, vh - baseRect.height));
            const clampedStartWidth = Math.max(100, Math.min(baseRect.width, vw)); // Ensure minimum width
            const clampedStartHeight = Math.max(100, Math.min(baseRect.height, vh)); // Ensure minimum height
            
            const startCenterX = clampedStartLeft + clampedStartWidth / 2;
            const startCenterY = clampedStartTop + clampedStartHeight / 2;
            
            // Ensure perfect viewport centering for mobile - use actual viewport dimensions
            const targetCenterX = vw / 2;
            const targetCenterY = vh / 2;
            
            // Mobile-specific viewport centering adjustments - ensure we're using consistent values
            const mobileViewportCenterX = vw / 2;
            const mobileViewportCenterY = vh / 2;
            
            // Calculate expansion phase based on current animation progress
            const currentExpansionPhase = Math.min(1, forcedAnimT / 0.8); // Expansion completes at 80% of animation
            const imageExpansionProgress = (isTransitioning || transitionTriggeredRef.current) ? 1 : Math.max(currentExpansionPhase, 0.08);

            // Linearly interpolate from the original top-left and size to full viewport
            const currentW = clampedStartWidth + (vw - clampedStartWidth) * imageExpansionProgress;
            const currentH = clampedStartHeight + (vh - clampedStartHeight) * imageExpansionProgress;
            
            // Calculate position with better centering logic to prevent flying off
            let currentLeft, currentTop;
            
            if (imageExpansionProgress >= 1) {
              // When fully expanded, center the image
              currentLeft = 0;
              currentTop = 0;
            } else {
              // During expansion, interpolate from start position to center
              const targetLeft = (vw - currentW) / 2;
              const targetTop = (vh - currentH) / 2;
              currentLeft = clampedStartLeft + (targetLeft - clampedStartLeft) * imageExpansionProgress;
              currentTop = clampedStartTop + (targetTop - clampedStartTop) * imageExpansionProgress;
            }
            
            // Final bounds checking to prevent image from flying off screen
            const finalLeft = Math.max(0, Math.min(currentLeft, vw - currentW));
            const finalTop = Math.max(0, Math.min(currentTop, vh - currentH));
            
            const currentRadius = imageExpansionProgress >= 1 ? 0 : Math.max(0, 16 * (1 - imageExpansionProgress));
            const boxShadowOpacity = 0.25 * (1 - imageExpansionProgress);

            return (
                            <div
                className="absolute floating-overlay-container"
            style={{
                  position: 'fixed', // Use fixed positioning to break out of container constraints
                  left: `${finalLeft}px`,
                  top: `${finalTop}px`,
                  right: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  bottom: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  width: `${currentW}px`,
                  height: `${currentH}px`,
                  borderRadius: `${currentRadius}px`,
                  overflow: 'hidden',
                  boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                  pointerEvents: 'none',
                  // Disable scaling during expansion to prevent visual drift; only apply slight bump during transition
                  transform: `scale(${(isTransitioning && imageExpansionProgress >= 1) ? 1.02 : 1})`,
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
            const vw = Math.max(1, window.innerWidth || 1);
            const vh = Math.max(1, window.innerHeight || 1);

            // Use locked rect if available to avoid jumps when layout changes
            const baseRect = lockedStartRectRef.current || startRect;
            const startLeft = Math.max(0, Math.min(baseRect.left, vw));
            const startTop = Math.max(0, Math.min(baseRect.top, vh));
            const startWidth = Math.max(0, Math.min(baseRect.width, vw));
            const startHeight = Math.max(0, Math.min(baseRect.height, vh));

            // Calculate center positions for proper responsive centering on mobile
            const startCenterX = startLeft + startWidth / 2;
            const startCenterY = startTop + startHeight / 2;

            // Mobile-specific viewport centering adjustments
            const mobileViewportCenterX = vw / 2;
            const mobileViewportCenterY = vh / 2;

            // Calculate expansion phase based on current animation progress
            const currentExpansionPhase = Math.min(1, forcedAnimT / 0.8); // Expansion completes at 80% of animation
            const imageExpansionProgress = Math.max(currentExpansionPhase, 0.08);

            // Interpolate center positions with mobile-optimized centering
            const currentCenterX = startCenterX + (mobileViewportCenterX - startCenterX) * imageExpansionProgress;
            const currentCenterY = startCenterY + (mobileViewportCenterY - startCenterY) * imageExpansionProgress;

            // Calculate dimensions - ensure full viewport coverage when expanded
            const targetW = vw; // fill screen width
            const targetH = vh; // fill screen height
            const currentW = imageExpansionProgress >= 1 ? vw : (startWidth + (targetW - startWidth) * imageExpansionProgress);
            const currentH = imageExpansionProgress >= 1 ? vh : (startHeight + (targetH - startHeight) * imageExpansionProgress);

            // Position from center (so it's properly centered)
            // When fully expanded, ensure it covers the entire viewport
            let currentLeft = imageExpansionProgress >= 1 ? 0 : (currentCenterX - currentW / 2);
            let currentTop = imageExpansionProgress >= 1 ? 0 : (currentCenterY - currentH / 2);

            // Clamp positions so image never flies off-screen
            if (currentW <= vw) currentLeft = Math.max(0, Math.min(currentLeft, vw - currentW)); else currentLeft = 0;
            if (currentH <= vh) currentTop = Math.max(0, Math.min(currentTop, vh - currentH)); else currentTop = 0;

            const currentRadius = imageExpansionProgress >= 1 ? 0 : Math.max(0, 16 * (1 - imageExpansionProgress));
            const boxShadowOpacity = 0.25 * (1 - imageExpansionProgress);

            return (
              <div
                className="absolute floating-overlay-container"
                style={{
                  position: 'fixed', // Use fixed positioning to break out of container constraints
                  left: `${currentLeft}px`,
                  top: `${currentTop}px`,
                  right: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  bottom: `${imageExpansionProgress >= 1 ? 0 : 'auto'}px`,
                  width: `${currentW}px`,
                  height: `${currentH}px`,
                  borderRadius: `${currentRadius}px`,
                  overflow: 'hidden',
                  boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                  pointerEvents: 'none',
                  transform: `scale(${(isTransitioning && imageExpansionProgress >= 1) ? 1.02 : 1})`,
                  transformOrigin: 'center center',
                  transition: isTransitioning ? 'all 0.8s ease-out' : 'none', // Smooth transition during scroll
                  willChange: 'left, top, width, height, transform, opacity',
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