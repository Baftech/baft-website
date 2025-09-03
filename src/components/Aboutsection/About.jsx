import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";
import AboutMobile from "./AboutMobile";
import { SVG_SVG, PROPERTY_IMAGE_PNG, PROPERTY_VIBHA_PNG, PROPERTY_DION_PNG, PROPERTY_SAKET_PNG } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

// Updated ReadMoreText with animation
const ReadMoreText = ({ content, maxLength = 320, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const paragraphRefs = useRef([]);
  const [collapsedHeight, setCollapsedHeight] = useState(200);
  const [maxExpandedHeight, setMaxExpandedHeight] = useState(520);
  const touchStartRef = useRef(null);

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

  // Measure the first paragraph to set an exact collapsed height
  useEffect(() => {
    const measure = () => {
      try {
        const firstP = paragraphRefs.current && paragraphRefs.current[0];
        if (firstP) {
          const rect = firstP.getBoundingClientRect();
          const styles = window.getComputedStyle(firstP);
          const marginBottom = parseFloat(styles.marginBottom || '0');
          const h = rect.height + marginBottom;
          // Reasonable bounds to avoid 0 heights during layout thrash
          setCollapsedHeight(Math.max(120, Math.min(h, 600)));
        }
        // Set safe maximum expansion to avoid overlapping navbar on small laptops
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
        // Allow up to ~80% of viewport height and enable inner scroll if more content
        const safeMax = Math.max(380, Math.min(Math.floor(vh * 0.8), 840));
        setMaxExpandedHeight(safeMax);
      } catch {}
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [content]);

  // GSAP height animation for smooth transitions - no auto snapping
  useEffect(() => {
    if (contentRef.current) {
      // Kill any existing tweens to avoid conflicts
      gsap.killTweensOf(contentRef.current);
      
      if (isExpanded) {
        // Get the natural height of the content
        const contentHeight = contentRef.current.scrollHeight;
        const targetHeight = Math.min(Math.max(contentHeight, collapsedHeight), maxExpandedHeight); // Clamp to safe maximum
        
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
  }, [isExpanded, collapsedHeight, maxExpandedHeight]);

  // Ensure inner scrolling works even in pinned section: capture wheel/touch on content
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (!isExpanded) return;
      const canScroll = el.scrollHeight > el.clientHeight;
      if (!canScroll) return;
      e.preventDefault();
      e.stopPropagation();
      try { el.scrollTop += e.deltaY; } catch {}
    };

    const onTouchStart = (e) => {
      if (!isExpanded) return;
      try { touchStartRef.current = e.touches && e.touches[0] ? e.touches[0].clientY : null; } catch { touchStartRef.current = null; }
    };
    const onTouchMove = (e) => {
      if (!isExpanded) return;
      if (touchStartRef.current == null) return;
      const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : touchStartRef.current;
      const dy = touchStartRef.current - y;
      const canScroll = el.scrollHeight > el.clientHeight;
      if (!canScroll) return;
      e.preventDefault();
      e.stopPropagation();
      try { el.scrollTop += dy; } catch {}
      touchStartRef.current = y;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [isExpanded]);

  return (
    <div className="leading-relaxed pr-2">
      <div
        ref={contentRef}
        style={{
          height: `${collapsedHeight}px`, // Collapsed height equals first paragraph
          overflow: isExpanded ? "auto" : "hidden",
          opacity: isExpanded ? 1 : 0.9,
          transition: "opacity 0.6s ease",
          maxWidth: 'clamp(520px, 42vw, 680px)',
          maxHeight: isExpanded ? `${maxExpandedHeight}px` : `${collapsedHeight}px`,
          WebkitOverflowScrolling: isExpanded ? 'touch' : 'auto',
          willChange: 'height'
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            ref={(el) => (paragraphRefs.current[i] = el)}
            className="mb-4 sm:mb-5 md:mb-6"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#909090",
              fontSize: 'clamp(14px, 1.3vw, 26px)',
              lineHeight: 'clamp(22px, 1.85vw, 36px)'
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-2 transition-all duration-500 ease-out"
          style={{
            fontFamily: "Inter, sans-serif",
            borderRadius: "200px",
            backgroundColor: "#E3EDFF",
            color: "#092646",
            border: "none",
            cursor: "pointer",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(104px, 10vw, 177px)',
            height: 'clamp(32px, 3.6vw, 64px)',
            fontSize: 'clamp(11px, 0.9vw, 18px)',
            paddingInline: 'clamp(10px, 1.6vw, 24px)',
            paddingBlock: 'clamp(6px, 0.8vw, 12px)',
            marginTop: 'clamp(0px, min(0.4vw, 0.4vh), 10px)'
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
  const hoverRafRef = useRef(null);
  const hoverElRef = useRef(null);
  const hoverAnimIdRef = useRef(null);
  const hoverTargetRef = useRef({ x: 0, y: 0, scale: 1 });
  const hoverCurrentRef = useRef({ x: 0, y: 0, scale: 1 });
  const parallaxRef = useRef(null);

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
    // Start smoothing loop
    if (!hoverAnimIdRef.current) {
      const animate = () => {
        const el = parallaxRef.current;
        if (!el) { hoverAnimIdRef.current = null; return; }
        const curr = hoverCurrentRef.current;
        const tgt = hoverTargetRef.current;
        // Damped spring/lerp
        curr.x += (tgt.x - curr.x) * 0.15;
        curr.y += (tgt.y - curr.y) * 0.15;
        curr.scale += (tgt.scale - curr.scale) * 0.12;
        el.style.transform = `translate3d(${curr.x.toFixed(2)}px, ${curr.y.toFixed(2)}px, 0) scale(${curr.scale.toFixed(3)})`;
        hoverAnimIdRef.current = requestAnimationFrame(animate);
      };
      hoverAnimIdRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseLeaveImage = () => {
    if (disabled) return;
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
    // Ease back to rest and stop loop when settled
    hoverTargetRef.current = { x: 0, y: 0, scale: 1 };
    const stopWhenSettled = () => {
      const curr = hoverCurrentRef.current;
      if (Math.abs(curr.x) < 0.2 && Math.abs(curr.y) < 0.2 && Math.abs(curr.scale - 1) < 0.002) {
        if (hoverAnimIdRef.current) {
          cancelAnimationFrame(hoverAnimIdRef.current);
          hoverAnimIdRef.current = null;
        }
        const el = parallaxRef.current;
        if (el) el.style.transform = 'translate3d(0,0,0) scale(1)';
        return;
      }
      requestAnimationFrame(stopWhenSettled);
    };
    requestAnimationFrame(stopWhenSettled);
  };

  const handleMouseMoveImage = (e) => {
    if (disabled) return;
    const target = e.currentTarget;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(rect.width, 1)) - 0.5;
    const ny = ((e.clientY - rect.top) / Math.max(rect.height, 1)) - 0.5;
    const maxShiftPx = 10; // subtle parallax
    const dx = Math.max(-1, Math.min(1, nx)) * maxShiftPx;
    const dy = Math.max(-1, Math.min(1, ny)) * maxShiftPx;
    hoverTargetRef.current = { x: dx, y: dy, scale: 1.03 };
  };

  const handleMouseEnterMember = (memberId) => {
    if (disabled) return;
    setHoveredMember(memberId);
  };

  // Keep base image visible until the target member image has loaded to avoid white flashes
  const activeMember = React.useMemo(
    () => teamMembers.find((m) => m.id === activeImageId),
    [teamMembers, activeImageId]
  );
  const isActiveLoaded = React.useMemo(
    () => {
      if (!activeMember) return activeImageId === 'full';
      return loadedImages.has(activeMember.image);
    },
    [activeMember, loadedImages, activeImageId]
  );

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
      className="relative w-full h-full" 
      style={{
        borderRadius: '24px',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        minHeight: '400px',
        minWidth: '300px',
        backgroundColor: 'transparent'
      }}
    >
      {/* Main Image Container */}
      <div
        ref={hoverElRef}
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: '24px',
          pointerEvents: disabled ? 'none' : 'auto',
          transition: 'transform 0ms',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={disabled ? undefined : handleMouseEnterImage}
        onMouseLeave={disabled ? undefined : handleMouseLeaveImage}
        onMouseMove={disabled ? undefined : handleMouseMoveImage}
      >
        {/* Parallax content wrapper with bleed to avoid edge reveal */}
        <div
          ref={parallaxRef}
          className="absolute"
          style={{
            left: '-32px',
            top: '-32px',
            right: '-32px',
            bottom: '-32px',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0) scale(1)',
            backgroundColor: '#000'
          }}
        >
        {/* Base Image - Full Team */}
        <img
          src={PROPERTY_IMAGE_PNG}
          alt="BaFT Team Full"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            objectPosition: "center center",
            opacity: activeImageId === "full" || !isActiveLoaded ? 1 : 0,
            transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 1,
            backfaceVisibility: 'hidden',
            willChange: 'opacity',
          }}
          loading="eager"
          decoding="async"
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
                transition: "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
                zIndex: isActive ? 2 : 1,
                visibility: isLoaded ? 'visible' : 'hidden',
                backfaceVisibility: 'hidden',
                willChange: 'opacity',
              }}
              onLoad={() => {
                setLoadedImages((prev) => new Set([...prev, member.image]));
              }}
            />
          );
        })}

        {/* Constant dark overlay above images, below text overlays */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.35)',
            zIndex: 9,
            pointerEvents: 'none'
          }}
        />

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
    </div>
  );
};

// AboutBaft with integrated scroll animation
const AboutBaft = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [textScale, setTextScale] = useState(1);
  const [topGap, setTopGap] = useState(0);
  const [imageBox, setImageBox] = useState({ width: 553, height: 782 });
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
      // Scale down left content slightly on smaller desktop widths
      if (newIsDesktop) {
        const w = window.innerWidth || 1440;
        const h = window.innerHeight || 800;
        let scale = 1;
        if (w <= 1024) {
          scale = 0.82;
        } else if (w >= 1440) {
          scale = 1;
        } else {
          const t = (w - 1024) / (1440 - 1024);
          scale = 0.82 + 0.18 * Math.max(0, Math.min(1, t));
        }
        setTextScale(scale);

        // Add a small top gap on short-height laptops to clear the navbar
        if (h < 1000) {
          const gap = Math.max(40, Math.min(96, Math.round(h * 0.12))); // ~12vh, clamped
          setTopGap(gap);
        } else {
          setTopGap(0);
        }
      } else {
        setTextScale(1);
        setTopGap(0);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Dynamic right image container sizing based on viewport height (desktop)
  useEffect(() => {
    const ASPECT_RATIO = 553 / 782; // width / height
    const computeImageBox = () => {
      if (typeof window === 'undefined') return;
      const vh = window.innerHeight || 900;
      const vw = window.innerWidth || 1440;
      // On smaller laptops, allow a smaller minimum; aim for ~85% of viewport height
      const minH = Math.min(520, Math.max(380, Math.floor(vh * 0.72)));
      const maxH = Math.floor(vh * 0.85);
      let targetH = Math.max(minH, Math.min(782, maxH));
      let targetW = Math.round(targetH * ASPECT_RATIO);
      // Ensure the width never exceeds 90% of viewport width
      const maxW = Math.floor(vw * 0.9);
      if (targetW > maxW) {
        targetW = maxW;
        targetH = Math.round(targetW / ASPECT_RATIO);
      }
      setImageBox({ width: targetW, height: targetH });
    };
    computeImageBox();
    window.addEventListener('resize', computeImageBox);
    return () => window.removeEventListener('resize', computeImageBox);
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
    let rafId = null;
    const measure = () => {
      if (!imageStartRef.current) return;
      const rect = imageStartRef.current.getBoundingClientRect();
      setStartRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };
    const scheduleMeasure = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        measure();
      });
    };
    measure();
    window.addEventListener('resize', scheduleMeasure, { passive: true });
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    return () => {
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('scroll', scheduleMeasure);
      if (rafId) cancelAnimationFrame(rafId);
    };
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
                  transform: `translateX(${textShiftX}px) scale(${textScale})`,
                  transformOrigin: 'left top',
                  opacity: textOpacity,
                  transition: 'none',
                  pointerEvents: textOpacity < 0.05 ? 'none' : 'auto',
                  marginTop: topGap
                }}
              >
                <p
                  className="font-normal mb-2 flex items-center"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    color: "#092646",
                    fontSize: 'clamp(16px, 1.15vw, 20px)',
                    lineHeight: '20px',
                    letterSpacing: '-0.273006px',
                    gap: 'clamp(6px, 0.6vw, 8px)',
                    marginTop: 'clamp(10px, min(2.2vh, 1.8vw), 28px)',
                    marginBottom: 'clamp(6px, min(1.2vw, 1.2vh), 16px)'
                  }}
                >
                  <img
                    src={SVG_SVG}
                    alt="Icon"
                    style={{
                      width: 'clamp(16px, 1.1vw, 20px)',
                      height: 'clamp(16px, 1.1vw, 20px)'
                    }}
                  />
                  Know our story
                </p>
                <h1
                  className="leading-tight font-bold text-[#1966BB]"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontSize: 'clamp(44px, 4.6vw, 72px)',
                    lineHeight: 'clamp(48px, 4.8vw, 76px)',
                    letterSpacing: '-0.273006px',
                    marginBottom: 'clamp(8px, min(2vh, 1.8vw), 28px)'
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

              <div className="flex justify-center items-center">
                <div
                  ref={imageStartRef}
                  style={{ width: `${imageBox.width}px`, height: `${imageBox.height}px`, borderRadius: '24px', overflow: 'hidden', margin: '0 auto' }}
                >
                  <div className="w-full h-full" style={{ opacity: 1 - easedProgress, transition: 'opacity 120ms linear' }}>
                    <InteractiveTeamImage disabled={easedProgress > 0.02} />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating overlay image that enlarges from right to full screen */}
            <div className="fixed inset-0 pointer-events-none">
              {startRect && easedProgress > 0.02 && (() => {
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
                      left: `${Math.round(currentLeft)}px`,
                      top: `${Math.round(currentTop)}px`,
                      width: `${Math.round(currentW)}px`,
                      height: `${Math.round(currentH)}px`,
                      borderRadius: `${currentRadius}px`,
                      overflow: 'hidden',
                      boxShadow: `0 40px 120px rgba(0,0,0,${boxShadowOpacity})`,
                      pointerEvents: 'none',
                      transform: `translateZ(0) scale(${zoomScale})`,
                      transformOrigin: 'center center',
                      transition: 'transform 120ms linear',
                      willChange: 'transform, left, top, width, height',
                      backfaceVisibility: 'hidden',
                      contain: 'layout paint size'
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