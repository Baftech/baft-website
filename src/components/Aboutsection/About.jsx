import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";
import AboutMobile from "./AboutMobile";

gsap.registerPlugin(ScrollTrigger);

// Updated ReadMoreText with animation
const ReadMoreText = ({ content, maxLength = 320, onExpandChange }) => {
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

  // GSAP height animation for smooth transitions - no auto snapping
  useEffect(() => {
    if (contentRef.current) {
      // Kill any existing tweens to avoid conflicts
      gsap.killTweensOf(contentRef.current);
      
      if (isExpanded) {
        // Get the natural height of the content
        const contentHeight = contentRef.current.scrollHeight;
        const targetHeight = Math.max(contentHeight, 200); // Ensure minimum height
        
        gsap.to(contentRef.current, {
          height: targetHeight,
          duration: 0.8,
          ease: "power2.out"
        });
      } else {
        // Collapse back to base height
        gsap.to(contentRef.current, {
          height: 200,
          duration: 0.8,
          ease: "power2.out"
        });
      }
    }
  }, [isExpanded]);

  return (
    <div className="leading-relaxed pr-2">
      <div
        ref={contentRef}
        style={{
          height: "200px", // Fixed base height - GSAP will animate this
          overflow: "hidden",
          opacity: isExpanded ? 1 : 0.9,
          transition: "opacity 0.6s ease",
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#909090] mb-4 sm:mb-5 md:mb-6"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-2 transition-all duration-500 ease-out w-32 sm:w-36 md:w-40 lg:w-44 h-12 sm:h-14 md:h-16 text-sm sm:text-base"
          style={{
            fontFamily: "Inter, sans-serif",
            borderRadius: "200px",
            backgroundColor: "#E3EDFF",
            color: "#092646",
            border: "none",
            cursor: "pointer",
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
    new Set(["/Property 1=Image.png"])
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const isForceAnimatingRef = useRef(false);
  const originalBodyOverflowRef = useRef('');
  const originalBodyTouchActionRef = useRef('');
  const originalHtmlOverscrollRef = useRef('');
  const [forcedAnimT, setForcedAnimT] = useState(0); // 0..1 during forced expansion
  const FORCED_DURATION_MS = 5500; // slow expansion
  
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
          } else {
            // After the trigger
            setScrollProgress(1);
            if (typeof window !== 'undefined') {
              window.__aboutPinnedActive = false;
            }

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

    const handleWheel = (e) => {
      if (isForceAnimatingRef.current) return;
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const inPinned = rect.top <= 0 && rect.bottom > windowHeight;
      if (!inPinned) return;

      // Only trigger on scroll down (positive deltaY) as user moves to bottom section
      if (typeof e.deltaY !== 'number' || e.deltaY <= 0) return;

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
              overflow: 'hidden'
            }}
          >
            {/* Static grid: text left, measuring placeholder right */}
            <div className="w-full max-w-6xl mx-auto px-12 grid grid-cols-2 gap-20 items-center">
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
                  className="font-normal mb-2 flex items-center gap-2 text-xl"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: "#092646",
                  }}
                >
                  <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
                  Know our story
                </p>
                <h1
                  className="leading-tight mb-8 font-bold text-6xl text-[#1966BB]"
                  style={{
                    fontFamily: "EB Garamond, serif",
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

              <div className="flex justify-end">
                <div
                  ref={imageStartRef}
                  style={{ width: '553px', height: '782px', borderRadius: '24px', overflow: 'hidden' }}
                >
                  <div className="w-full h-full" style={{ opacity: 1 - easedProgress, transition: 'opacity 120ms linear' }}>
                    <InteractiveTeamImage disabled={easedProgress > 0.02} />
                  </div>
                </div>
              </div>
            </div>

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