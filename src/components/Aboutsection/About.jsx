import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";
import AboutMobile from "./AboutMobile";
import { SVG_SVG, PROPERTY_IMAGE_PNG, PROPERTY_VIBHA_PNG, PROPERTY_DION_PNG, PROPERTY_SAKET_PNG } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

// Updated ReadMoreText with animation
const ReadMoreText = ({ content, maxLength = 320, onExpandChange, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [collapsedHeight, setCollapsedHeight] = useState(200);
  const [isCompact, setIsCompact] = useState(false);
  const [maxContentHeight, setMaxContentHeight] = useState(560);

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

  // Compute a collapsed height that aligns to full lines; track compact viewport and max content height
  useEffect(() => {
    const measure = () => {
      if (!contentRef.current || typeof window === 'undefined') return;
      try {
        // Determine compact viewport (small width or height)
        const vw = window.innerWidth || 0;
        const vh = window.innerHeight || 0;
        const compact = vw < 1280 || vh < 820;
        setIsCompact(compact);

        // Collapsed height logic: show full first paragraph plus first line of second paragraph (if present)
        const paraNodes = contentRef.current.querySelectorAll('p');
        const refElem = paraNodes && paraNodes[0] ? paraNodes[0] : contentRef.current;
        const cs = window.getComputedStyle(refElem);
        const lineH = parseFloat(cs.lineHeight || '0') || 28;

        let collapsed = 200;
        if (paraNodes && paraNodes.length > 0) {
          const firstRect = paraNodes[0].getBoundingClientRect();
          const firstParaHeight = firstRect ? firstRect.height : lineH * 3;
          const previewLines = 1; // show first line of second paragraph
          collapsed = Math.max(lineH * 3, firstParaHeight + previewLines * lineH);
        } else {
          // Fallback to a reasonable number of lines
          const linesToShow = compact ? 5 : 7;
          collapsed = Math.max(3, linesToShow) * lineH;
        }
        setCollapsedHeight(collapsed);

        // Max content height so expanded text doesn't overflow viewport on compact screens
        const verticalPaddingAllowance = 200; // tighter allowance so expansion reaches the visual baseline
        const safeMax = Math.max(280, (vh || 800) - verticalPaddingAllowance);
        setMaxContentHeight(safeMax);
      } catch {
        setCollapsedHeight(200);
        setMaxContentHeight(560);
      }
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, []);

  // GSAP height animation for smooth transitions - snap to measured collapsed/max height
  useEffect(() => {
    if (contentRef.current) {
      // Kill any existing tweens to avoid conflicts
      gsap.killTweensOf(contentRef.current);
      
      if (isExpanded) {
        // Get the natural height of the content
        const contentHeight = contentRef.current.scrollHeight;
        // Respect the maxContentHeight cap so it expands only up to the baseline
        const cappedMax = Math.max(collapsedHeight, maxContentHeight);
        const targetHeight = Math.min(Math.max(contentHeight, collapsedHeight), cappedMax);
        
        gsap.to(contentRef.current, {
          height: targetHeight,
          duration: 0.8,
          ease: "power2.out"
        });
      } else {
        // Collapse back to base height
        gsap.to(contentRef.current, {
          height: collapsedHeight,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    }
  }, [isExpanded, collapsedHeight, maxContentHeight]);

  // Ensure content is scrolled to top when expanding so text appears at the top
  useEffect(() => {
    if (isExpanded && contentRef.current) {
      try {
        contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
      } catch {
        try { contentRef.current.scrollTop = 0; } catch {}
      }
    }
  }, [isExpanded]);

  return (
    <div className="leading-relaxed pr-2" style={{ maxWidth: 'clamp(520px, 42vw, 680px)' }}>
      <div
        ref={contentRef}
        style={{
          height: `${collapsedHeight}px`,
          // When expanded, cap to available height so it grows until the visual baseline
          maxHeight: isExpanded ? `${maxContentHeight}px` : undefined,
          overflowY: isExpanded ? 'auto' : 'hidden',
          WebkitOverflowScrolling: isExpanded ? 'touch' : undefined,
          paddingRight: isExpanded ? '4px' : 0,
          opacity: isExpanded ? 1 : 0.9,
          transition: "opacity 0.6s ease",
          position: 'relative',
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="mt-[-10] mb-10 sm:mb-3 md:mb-4"
            style={{
              fontFamily: "Inter, sans-serif",
              color: '#909090',
              fontSize: compact ? 'clamp(14px, 1.2vw, 20px)' : 'clamp(16px, 1.4vw, 24px)',
              lineHeight: compact ? 'clamp(22px, 1.9vw, 30px)' : 'clamp(24px, 2.1vw, 35px)'
            }}
          >
            {para}
          </p>
        ))}
        {!isExpanded && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: Math.max(24, Math.min(collapsedHeight * 0.25, 72)),
              background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-[-5] transition-all duration-500 ease-out"
          style={{
            fontFamily: "Inter, sans-serif",
            width: 'clamp(148px, calc(180px * var(--btn-scale, 1)), 220px)',
            height: 'calc(64px * var(--btn-scale, 1))',
            fontSize: 'clamp(13px, calc(16px * var(--btn-scale, 1)), 18px)',
            lineHeight: 1.1,
            borderRadius: "200px",
            backgroundColor: "#E3EDFF",
            color: "#092646",
            border: "none",
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
            order: 2,
            flexGrow: 0
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#000000";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#E3EDFF";
            e.target.style.color = "#092646";
          }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const InteractiveTeamImage = ({ disabled = false }) => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState("full");
  const [activeImageId, setActiveImageId] = useState("full");
  const [loadedImages, setLoadedImages] = useState(
    new Set([PROPERTY_IMAGE_PNG])
  );

  // Add debugging for component dimensions
  useEffect(() => {
    return () => {};
  }, []);

  const teamMembers = React.useMemo(
    () => [
      {
        id: "vibha",
        name: "Vibha Harish",
        position: "Co-Founder, BaFT Technology",
        area: { x: "35%", y: "45%", width: "30%", height: "55%" },
        image: PROPERTY_VIBHA_PNG,
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
        image: PROPERTY_DION_PNG,
        textPosition: { left: "8%", bottom: "27%" },
        animation: "fade-right",
      },
      {
        id: "saket",
        name: "Saket Borkar",
        position: "Co-Founder, BaFT Technology",
        area: { x: "60%", y: "15%", width: "35%", height: "75%" },
        image: PROPERTY_SAKET_PNG,
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
        borderRadius: '24px',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        minHeight: '400px',
        minWidth: '300px'
      }}
    >
      {/* Main Image Container */}
      <div
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={{
          borderRadius: '24px',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        onMouseEnter={disabled ? undefined : handleMouseEnterImage}
        onMouseLeave={disabled ? undefined : handleMouseLeaveImage}
      >
        {/* Base Image - Full Team */}
        <img
          src={PROPERTY_IMAGE_PNG}
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
          />
        ))}
      </div>
    </div>
  );
};

// AboutBaft with integrated scroll animation
const AboutBaft = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isForceAnimatingRef = useRef(false);
  const scrollAccumulatorRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const originalBodyOverflowRef = useRef('');
  const originalBodyTouchActionRef = useRef('');
  const originalHtmlOverscrollRef = useRef('');
  const [forcedAnimT, setForcedAnimT] = useState(0); // 0..1 during forced expansion
  const [scrollProgressIndicator, setScrollProgressIndicator] = useState(0); // 0..1 for scroll accumulation progress
  const FORCED_DURATION_MS = 5500; // slow expansion
  
  // Measure navbar height and expose CSS variables for gap/spacing on desktop
  useEffect(() => {
    if (!isDesktop) return;
    const navEl = document.querySelector('nav') || document.getElementById('navbar') || document.querySelector('.site-navbar');
    const updateVars = () => {
      const navH = navEl ? navEl.getBoundingClientRect().height : 64;
      document.documentElement.style.setProperty('--nav-h', `${navH}px`);
      const gap = Math.max(12, Math.min(window.innerHeight * 0.02, 28));
      document.documentElement.style.setProperty('--gap', `${gap}px`);
      // Button scale derived from viewport's smaller dimension
      const vmin = Math.min(window.innerWidth || 0, window.innerHeight || 0);
      const btnScale = Math.max(0.65, Math.min(vmin / 1100, 1.05));
      document.documentElement.style.setProperty('--btn-scale', String(btnScale));
      // Left column scale for compact desktops
      const vw = window.innerWidth || 0;
      let leftScale = 1;
      if (vw <= 1366) leftScale = 0.94;
      if (vw <= 1280) leftScale = 0.9;
      if (vw <= 1180) leftScale = 0.86;
      if (vw <= 1100) leftScale = 0.84;
      if (vw <= 1024) leftScale = 0.82;
      if (vw <= 980) leftScale = 0.8;
      if (vw <= 940) leftScale = 0.78;
      // Further reduce when height is compact or paragraph is expanded
      if ((window.innerHeight || 0) <= 820) leftScale *= 0.94;
      if ((window.innerHeight || 0) <= 760) leftScale *= 0.92;
      if (isExpanded) leftScale *= 0.92;
      leftScale = Math.max(0.72, Math.min(leftScale, 1));
      document.documentElement.style.setProperty('--left-scale', String(leftScale));
      // Track compact desktop viewport to allow internal slide scrolling
      const compact = (window.innerWidth || 0) < 1280 || (window.innerHeight || 0) < 820;
      setIsCompactViewport(compact);
    };
    updateVars();
    window.addEventListener('resize', updateVars, { passive: true });
    return () => window.removeEventListener('resize', updateVars);
  }, [isDesktop, isExpanded]);
  
  // Ensure stable initial state
  useEffect(() => {
    if (isDesktop) {
      setScrollProgress(0);
    }
  }, [isDesktop]);
  
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageStartRef = useRef(null);
  const triggerRef = useRef(null);
  const [startRect, setStartRect] = useState(null);
  const hasDispatchedPinnedEndRef = useRef(false);
  const hasAcknowledgedIntroRef = useRef(false);

  // Check if screen is desktop size
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsDesktop = window.innerWidth >= 1024; // lg breakpoint and above
      setIsDesktop(newIsDesktop);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Removed unnecessary logging effects that were causing performance issues

  // Simplified pin screen scroll animation for desktop
  useEffect(() => {
    if (!sectionRef.current || !isDesktop) return;

    let rafId = null;

    const handleScroll = () => {
      if (!triggerRef.current || rafId || isForceAnimatingRef.current) return;

      rafId = requestAnimationFrame(() => {
        try {
          const triggerRect = triggerRef.current.getBoundingClientRect();
          const triggerHeight = triggerRef.current.offsetHeight;
          const windowHeight = window.innerHeight;
          
          // Calculate progress based on trigger position with better clamping
          if (triggerRect.top <= 0 && triggerRect.bottom > windowHeight) {
            // We're in the pinned zone
            const scrolledIntoTrigger = Math.abs(triggerRect.top);
            const totalScrollDistance = Math.max(triggerHeight - windowHeight, 1); // Prevent division by zero
            const progress = Math.max(0, Math.min(scrolledIntoTrigger / totalScrollDistance, 1));

            setScrollProgress(progress);

            // Keep navigation fully paused for the entire pinned zone to avoid handoff jank
            if (typeof window !== 'undefined') {
              window.__aboutPinnedActive = true;
            }

            // Reset end-dispatch flag while in pinned zone
            hasDispatchedPinnedEndRef.current = false;
          } else if (triggerRect.top > 0) {
            // Before the trigger
            setScrollProgress(0);
            if (typeof window !== 'undefined') {
              window.__aboutPinnedActive = false;
            }
            hasDispatchedPinnedEndRef.current = false;
            // Reset scroll accumulator when leaving pinned zone
            scrollAccumulatorRef.current = 0;
            lastScrollTimeRef.current = 0;
            setScrollProgressIndicator(0);
            hasAcknowledgedIntroRef.current = false;
          } else {
            // After the trigger
            setScrollProgress(1);
            if (typeof window !== 'undefined') {
              window.__aboutPinnedActive = false;
            }
            // Reset scroll accumulator when leaving pinned zone
            scrollAccumulatorRef.current = 0;
            lastScrollTimeRef.current = 0;
            setScrollProgressIndicator(0);
            hasAcknowledgedIntroRef.current = false;

            // Fire a one-time event to request advancing to the next slide (pre-footer)
            if (!hasDispatchedPinnedEndRef.current && typeof window !== 'undefined') {
              try {
                const evt = new CustomEvent('aboutPinnedEnded');
                window.dispatchEvent(evt);
              } catch {}
              hasDispatchedPinnedEndRef.current = true;
            }
          }
        } catch (error) {
          console.warn('Scroll calculation error:', error);
          setScrollProgress(0);
        } finally {
          rafId = null;
        }
      });
    };

    // Use passive: true for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (typeof window !== 'undefined') {
        window.__aboutPinnedActive = false;
      }
    };
  }, [isDesktop]);

  // Single scroll-down forced expansion using video component's lock pattern
  useEffect(() => {
    if (!sectionRef.current || !isDesktop) return;

    const addOpts = { passive: false, capture: true };
    const minSwipeDistance = 40;
    let touchStartY = null;
    
    // Add scroll accumulation for touchpad sensitivity (using refs for cross-effect access)
    const scrollThreshold = 150; // Minimum accumulated scroll before triggering
    const scrollDecayTime = 200; // Time in ms for scroll accumulation to decay
    const minScrollDelta = 10; // Minimum single scroll delta to accumulate

    const handleWheel = (e) => {
      if (isForceAnimatingRef.current) return;
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;

      // Only trigger on scroll down (positive deltaY) as user moves to bottom section
      if (typeof e.deltaY !== 'number' || e.deltaY <= 0) return;

      // Gate: first deliberate wheel-down only acknowledges the intro; expansion requires second action
      if (!hasAcknowledgedIntroRef.current) {
        hasAcknowledgedIntroRef.current = true;
        scrollAccumulatorRef.current = 0;
        lastScrollTimeRef.current = 0;
        setScrollProgressIndicator(0.2);
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const currentTime = Date.now();
      
      // Decay scroll accumulator over time
      if (currentTime - lastScrollTimeRef.current > scrollDecayTime) {
        scrollAccumulatorRef.current = Math.max(0, scrollAccumulatorRef.current - (currentTime - lastScrollTimeRef.current) / scrollDecayTime * 50);
      }
      
      // Only accumulate significant scroll movements
      if (e.deltaY >= minScrollDelta) {
        scrollAccumulatorRef.current += e.deltaY;
        lastScrollTimeRef.current = currentTime;
        // Update progress indicator
        setScrollProgressIndicator(Math.min(1, scrollAccumulatorRef.current / scrollThreshold));
      }
      
      // Don't trigger expansion until sufficient scroll accumulation
      if (scrollAccumulatorRef.current < scrollThreshold) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Reset accumulator after triggering
      scrollAccumulatorRef.current = 0;
      lastScrollTimeRef.current = 0;
      setScrollProgressIndicator(0);

      e.preventDefault();
      e.stopPropagation();

      isForceAnimatingRef.current = true;

      // Global handoff flag so other containers ignore wheel
      try { if (typeof window !== 'undefined') { window.__videoHandoffActive = true; } } catch {}

      // Strictly lock global scroll/input during animation
      const prevent = (evt) => { try { evt.preventDefault(); evt.stopPropagation(); } catch {}; return false; };
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
      document.addEventListener('keydown', prevent, addOpts);
      try {
        if (typeof window !== 'undefined') {
          window.addEventListener('wheel', prevent, addOpts);
          window.addEventListener('touchmove', prevent, addOpts);
          window.addEventListener('touchstart', prevent, addOpts);
          window.addEventListener('touchend', prevent, addOpts);
          window.addEventListener('scroll', prevent, addOpts);
        }
      } catch {}

      // Animate progress to 1 over duration
      const durationMs = FORCED_DURATION_MS; // slow expansion
      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const startProgress = Math.max(0, Math.min(scrollProgress, 1));

      const step = (nowTs) => {
        const now = nowTs || (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const t = Math.max(0, Math.min((now - startTime) / durationMs, 1));
        const eased = 1 - Math.pow(1 - t, 4);
        const next = startProgress + (1 - startProgress) * eased;
        setScrollProgress(next);
        setForcedAnimT(t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          // Release locks and handoff
          try { if (typeof window !== 'undefined') { window.__videoHandoffActive = false; } } catch {}
          try { if (typeof window !== 'undefined') { window.__aboutPinnedActive = false; } } catch {}
          document.removeEventListener('wheel', prevent, addOpts);
          document.removeEventListener('touchmove', prevent, addOpts);
          document.removeEventListener('touchstart', prevent, addOpts);
          document.removeEventListener('touchend', prevent, addOpts);
          document.removeEventListener('scroll', prevent, addOpts);
          document.removeEventListener('keydown', prevent, addOpts);
          try {
            if (typeof window !== 'undefined') {
              window.removeEventListener('wheel', prevent, addOpts);
              window.removeEventListener('touchmove', prevent, addOpts);
              window.removeEventListener('touchstart', prevent, addOpts);
              window.removeEventListener('touchend', prevent, addOpts);
              window.removeEventListener('scroll', prevent, addOpts);
            }
          } catch {}
          try {
            document.body.style.overflow = originalBodyOverflowRef.current || '';
            document.body.style.touchAction = originalBodyTouchActionRef.current || '';
            document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
          } catch {}

          // Proactively dispatch end event to advance
          try {
            if (typeof window !== 'undefined') {
              setScrollProgress(1);
              const evt = new CustomEvent('aboutPinnedEnded');
              window.dispatchEvent(evt);
            }
          } catch {}

          // Avoid duplicate dispatch from scroll handler
          try { hasDispatchedPinnedEndRef.current = true; } catch {}

          isForceAnimatingRef.current = false;
          setForcedAnimT(0);
          hasAcknowledgedIntroRef.current = false;
        }
      };

      requestAnimationFrame(step);
    };

    const el = sectionRef.current;
    el.addEventListener('wheel', handleWheel, addOpts);
    const handleTouchStart = (e) => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      try { touchStartY = e.touches && e.touches[0] ? e.touches[0].clientY : null; } catch { touchStartY = null; }
    };
    const handleTouchEnd = (e) => {
      if (isForceAnimatingRef.current) return;
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;
      if (touchStartY == null) return;
      const endY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : touchStartY;
      const distance = touchStartY - endY; // swipe up -> positive distance
      if (distance < minSwipeDistance) return;

      // Gate: first qualifying swipe only acknowledges the intro; expansion requires next swipe
      if (!hasAcknowledgedIntroRef.current) {
        hasAcknowledgedIntroRef.current = true;
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Trigger the same forced animation as wheel down
      isForceAnimatingRef.current = true;
      try { if (typeof window !== 'undefined') { window.__videoHandoffActive = true; } } catch {}
      const prevent = (evt) => { try { evt.preventDefault(); evt.stopPropagation(); } catch {}; return false; };
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
      document.addEventListener('keydown', prevent, addOpts);
      try {
        if (typeof window !== 'undefined') {
          window.addEventListener('wheel', prevent, addOpts);
          window.addEventListener('touchmove', prevent, addOpts);
          window.addEventListener('touchstart', prevent, addOpts);
          window.addEventListener('touchend', prevent, addOpts);
          window.addEventListener('scroll', prevent, addOpts);
        }
      } catch {}

      const durationMs = FORCED_DURATION_MS;
      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const startProgress = Math.max(0, Math.min(scrollProgress, 1));
      const step = (nowTs) => {
        const now = nowTs || (typeof performance !== 'undefined' ? performance.now() : Date.now());
        const t = Math.max(0, Math.min((now - startTime) / durationMs, 1));
        const eased = 1 - Math.pow(1 - t, 4);
        const next = startProgress + (1 - startProgress) * eased;
        setScrollProgress(next);
        setForcedAnimT(t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          try { if (typeof window !== 'undefined') { window.__videoHandoffActive = false; } } catch {}
          try { if (typeof window !== 'undefined') { window.__aboutPinnedActive = false; } } catch {}
          document.removeEventListener('wheel', prevent, addOpts);
          document.removeEventListener('touchmove', prevent, addOpts);
          document.removeEventListener('touchstart', prevent, addOpts);
          document.removeEventListener('touchend', prevent, addOpts);
          document.removeEventListener('scroll', prevent, addOpts);
          document.removeEventListener('keydown', prevent, addOpts);
          try {
            if (typeof window !== 'undefined') {
              window.removeEventListener('wheel', prevent, addOpts);
              window.removeEventListener('touchmove', prevent, addOpts);
              window.removeEventListener('touchstart', prevent, addOpts);
              window.removeEventListener('touchend', prevent, addOpts);
              window.removeEventListener('scroll', prevent, addOpts);
            }
          } catch {}
          try {
            document.body.style.overflow = originalBodyOverflowRef.current || '';
            document.body.style.touchAction = originalBodyTouchActionRef.current || '';
            document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
          } catch {}
          try {
            if (typeof window !== 'undefined') {
              setScrollProgress(1);
              const evt = new CustomEvent('aboutPinnedEnded');
              window.dispatchEvent(evt);
            }
          } catch {}
          try { hasDispatchedPinnedEndRef.current = true; } catch {}
          isForceAnimatingRef.current = false;
          setForcedAnimT(0);
          hasAcknowledgedIntroRef.current = false;
        }
      };
      requestAnimationFrame(step);
    };
    el.addEventListener('touchstart', handleTouchStart, addOpts);
    el.addEventListener('touchend', handleTouchEnd, addOpts);

    return () => {
      el.removeEventListener('wheel', handleWheel, addOpts);
      el.removeEventListener('touchstart', handleTouchStart, addOpts);
      el.removeEventListener('touchend', handleTouchEnd, addOpts);
    };
  }, [isDesktop, scrollProgress]);

  // Measure starting position/size of the right image placeholder (desktop)
  useEffect(() => {
    if (!isDesktop) {
      setStartRect(null);
      return;
    }
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
  }, [isDesktop]);

  // Animation values - only for image expansion, not text movement
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easedProgress = easeInOutCubic(scrollProgress);
  const textShiftX = -300 * easedProgress; // move left as it expands
  const textShiftY = 0; // no vertical movement
  const textOpacity = 1 - easedProgress;   // fade out as it expands
  // Overlay and zoom-out timing based on forced animation time
  const overlayStartT = 200 / (FORCED_DURATION_MS || 1);
  const overlayProgress = Math.max(0, Math.min(1, (forcedAnimT - overlayStartT) / Math.max(0.0001, 1 - overlayStartT)));
  const overlayOpacity = Math.min(1, overlayProgress * 1); // up to 100% black to mask handoff
  const zoomScale = 1 + 0.10 * overlayProgress; // zoom in up to 110%
  const disperseOpacity = 1 - 0.2 * overlayProgress; // slight fade of image content under overlay

  return (
    <>
      {/* Mobile/Tablet version - Use dedicated AboutMobile component */}
      {!isDesktop && <AboutMobile />}
      
      {/* Desktop scroll animation version */}
      {isDesktop && (
         <div ref={triggerRef} className="relative" style={{ height: '300vh' }}>
          <section
            id="about"
            ref={sectionRef}
            data-theme="light"
            className="sticky top-0 bg-white flex items-center justify-center"
            style={{ 
              height: '100vh',
              width: '100vw',
              overflow: 'hidden',
              paddingTop: 'calc(var(--nav-h, 64px) + calc(var(--gap, 16px) * 2))'
            }}
          >
            {/* Static grid: text left, measuring placeholder right */}
            <div
              className="w-full h-full"
              style={{
                marginTop: 'clamp(2vh, 4vh, 8vh)',
                marginLeft: '1cm',
                marginRight: '1cm',
                // Enable internal vertical scrolling on compact desktop viewports
                overflowY: isCompactViewport ? 'auto' : 'visible',
                WebkitOverflowScrolling: isCompactViewport ? 'touch' : undefined,
                height: '100%',
                maxHeight: '100%',
                paddingBottom: isCompactViewport ? '16px' : 0
              }}
            >
              <div
                className="w-full max-w-6xl mx-auto px-12 grid grid-cols-2 gap-20 items-center"
                style={{
                  columnGap: 'clamp(40px, 5vw, 96px)'
                }}
              >
              <div
                ref={textContainerRef}
                className="flex flex-col justify-center"
                style={{
                  transform: `translateX(${textShiftX}px)`,
                  opacity: textOpacity,
                  transition: 'none',
                  pointerEvents: textOpacity < 0.05 ? 'none' : 'auto',
                }}
              >
                <p
                  className="font-normal mb-2 flex items-center"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    color: '#092646',
                    lineHeight: 1.1,
                    gap: 'clamp(6px, 0.6vw, 8px)',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <img 
                    src={SVG_SVG} 
                    alt="Icon" 
                    style={{ width: 'clamp(12px, 0.9vw, 16px)', height: 'clamp(12px, 0.9vw, 16px)' }}
                  />
                  Know our story
                </p>
                <h1
                  className="mb-8 font-bold text-[#1966BB]"
                  style={{
                    fontFamily: 'EB Garamond, serif',
                    fontSize: 'clamp(22px, 4.8vw, 72px)',
                    lineHeight: 'clamp(26px, 5.2vw, 78px)',
                    letterSpacing: 'clamp(-0.18px, -0.02vw, -0.273006px)',
                    display: 'flex',
                    alignItems: 'center',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    marginBottom: '1cm'
                  }}
                >
                  <span className="block">About BaFT</span>
                </h1>

                <ReadMoreText
                  content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
                  onExpandChange={setIsExpanded}
                  compact={isCompactViewport}
                />
              </div>

              <div className="flex justify-end">
                <div
                  ref={imageStartRef}
                  className="about-right-responsive relative rounded-3xl overflow-hidden"
                >
                  <div className="w-full h-full" style={{ opacity: 1 - easedProgress, transition: 'opacity 120ms linear' }}>
                    <InteractiveTeamImage disabled={easedProgress > 0.1} />
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Scroll progress indicator */}
            {scrollProgressIndicator > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <div className="w-16 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-200 ease-out"
                        style={{ width: `${scrollProgressIndicator * 100}%` }}
                      />
                    </div>
                    <span className="text-xs opacity-80">Scroll to expand</span>
                  </div>
                </div>
              </div>
            )}

            {/* Floating overlay image that enlarges from right to full screen */}
            <div className="fixed inset-0 pointer-events-none">
              {startRect && (() => {
                const vw = typeof window !== 'undefined' ? window.innerWidth : 0;
                const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
                const targetW = vw; // fill screen width
                const targetH = vh; // fill screen height
                const currentW = startRect.width + (targetW - startRect.width) * easedProgress;
                const currentH = startRect.height + (targetH - startRect.height) * easedProgress;
                const targetLeft = 0;
                const targetTop = 0;
                const currentLeft = startRect.left + (targetLeft - startRect.left) * easedProgress;
                const currentTop = startRect.top + (targetTop - startRect.top) * easedProgress;
                const currentRadius = Math.max(0, 24 * (1 - easedProgress));
                const boxShadowOpacity = 0.25 * (1 - easedProgress);

                return (
                  <div
                    className="absolute"
                    style={{
                      left: `${currentLeft}px`,
                      top: `${currentTop}px`,
                      width: `${currentW}px`,
                      height: `${currentH}px`,
                      borderRadius: `${currentRadius}px`,
                      overflow: 'hidden',
                      boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                      pointerEvents: 'none',
                      transform: `scale(${zoomScale})`,
                      transformOrigin: 'center center',
                      transition: 'transform 120ms linear',
                    }}
                  >
                    <div className="relative w-full h-full" style={{ opacity: disperseOpacity }}>
                      <InteractiveTeamImage disabled={true} />
                    </div>
                    <div style={{ position: 'absolute', inset: 0, background: '#000', opacity: overlayOpacity, pointerEvents: 'none' }} />
                  </div>
                );
              })()}
            </div>

            
          </section>
        </div>
      )}


    </>
  );
};

export default AboutBaft;