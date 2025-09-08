import React, { useRef, useEffect, useState } from "react";
import VideoComponentMobile from "./VideoComponentMobile";
import { VIDEO_COM_PNG, SVG_SVG, BAFT_VID_MP4 } from "../../assets/assets";

// Custom hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Enhanced responsive hook for desktop
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  return isMobile;
};

const Videocomponent = ({ slide = false }) => {
  const isMobile = useIsMobile();
  const mainContainerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const originalBodyOverflowRef = useRef('');
  const originalBodyTouchActionRef = useRef('');
  const originalHtmlOverscrollRef = useRef('');
  const inViewRef = useRef(false);
  const expansionArmedRef = useRef(false); // true after first scroll once in view
  const lastArmAtRef = useRef(0);
  const armCooldownMsRef = useRef(200); // Reduced delay for faster response
  const touchStartYRef = useRef(null);
  const autoplayRetryRef = useRef(null);
  const scrollVelocityRef = useRef(0);
  const lastScrollTimeRef = useRef(0);

  // Enhanced responsive hook for desktop
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  // Responsive sizing based on screen dimensions
  const isSmallDesktop = screenSize.width <= 1024; // Small laptop
  const isMediumDesktop = screenSize.width <= 1366; // Medium laptop
  const isLargeDesktop = screenSize.width > 1366; // Large desktop

  // Adaptive sizing
  const containerMaxWidth = isSmallDesktop ? '1000px' : isMediumDesktop ? '1200px' : '1400px';
  const containerPadding = isSmallDesktop ? '0 1.5rem' : '0 2rem';
  const videoMaxWidth = isSmallDesktop ? '400px' : isMediumDesktop ? '500px' : '600px';
  const videoMaxHeight = isSmallDesktop ? '300px' : isMediumDesktop ? '350px' : '400px';
  const headingSize = isSmallDesktop ? 'clamp(28px, 5vw, 48px)' : isMediumDesktop ? 'clamp(32px, 6vw, 52px)' : 'clamp(36px, 6vw, 56px)';
  const bodyTextSize = isSmallDesktop ? '15px' : isMediumDesktop ? '16px' : '17px';
  const subheadingSize = isSmallDesktop ? '16px' : isMediumDesktop ? '18px' : '20px';
  const gridGap = isSmallDesktop ? '2rem' : isMediumDesktop ? '2.5rem' : '3rem';

  // Handle scroll-based expansion in slide mode
  useEffect(() => {
    if (!slide) return;

    const addOpts = { passive: false, capture: true };

    // Observe when the section is actually in view so we can arm expansion only then
    let observer;
    if (videoSectionRef.current && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === videoSectionRef.current) {
            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
              // Section is visible enough: allow the first scroll to just settle/show content
              inViewRef.current = true;
              expansionArmedRef.current = false;
            } else if (!entry.isIntersecting) {
              // Leaving view resets the arming logic
              inViewRef.current = false;
              expansionArmedRef.current = false;
            }
          }
        });
      }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
      try { observer.observe(videoSectionRef.current); } catch {}
    }

    const handleScroll = (e) => {
      // Only trigger if not already animating/expanded
      if (isAnimating || isExpanded) return;
      // If section isn't in view yet, let the scroll proceed to bring it into view
      if (!inViewRef.current) return;
      // Normalize input and direction
      let directionDown = true;
      let magnitude = 0;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      
      if (e.type === 'wheel') {
        const dy = typeof e.deltaY === 'number' ? e.deltaY : 0;
        directionDown = dy > 0;
        magnitude = Math.abs(dy);
        
        // Calculate scroll velocity for fast scroll detection
        if (lastScrollTimeRef.current > 0) {
          const timeDelta = now - lastScrollTimeRef.current;
          scrollVelocityRef.current = magnitude / Math.max(timeDelta, 1);
        }
        lastScrollTimeRef.current = now;
      } else if (e.type === 'touchstart') {
        try { touchStartYRef.current = e.touches && e.touches[0] ? e.touches[0].clientY : null; } catch {}
        return; // don't act on touchstart alone
      } else if (e.type === 'touchmove') {
        if (touchStartYRef.current != null) {
          const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : touchStartYRef.current;
          const dy = touchStartYRef.current - y;
          directionDown = dy > 0;
          magnitude = Math.abs(dy);
        }
      } else if (e.type === 'touchend') {
        touchStartYRef.current = null;
        return;
      }

      // Require downward intent and a small threshold to avoid micro scrolls
      // Use different thresholds based on whether we're armed or not
      const threshold = expansionArmedRef.current ? 8 : 5; // Moderately sensitive after arming
      if (magnitude < threshold || !directionDown) return;

      // Fast scroll detection - if velocity is high, trigger immediately
      const isFastScroll = scrollVelocityRef.current > 2; // High velocity threshold
      
      // Two-step behavior: first qualifying scroll arms expansion (let it pass)
      if (!expansionArmedRef.current) {
        expansionArmedRef.current = true;
        lastArmAtRef.current = now;
        
        // If it's a fast scroll, skip the first step and trigger immediately
        if (isFastScroll) {
          // Skip the debounce for fast scrolling
        } else {
          return; // allow the first scroll to settle content for normal scrolling
        }
      }

      // After first step is completed, be moderately sensitive to scroll
      const nowTs = now;
      const timeSinceArm = nowTs - lastArmAtRef.current;
      
      // If armed and enough time has passed, be moderately sensitive to scroll
      if (expansionArmedRef.current && timeSinceArm > 200) { // Slightly longer delay after arming
        // Scroll after arming should trigger expansion
        // Skip debounce for better responsiveness
      } else if (!isFastScroll && timeSinceArm < 200) {
        return; // Apply moderate delay for normal scrolling
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // Mark animation as starting
      setIsAnimating(true);
      
      // Mark global handoff so SlideContainer ignores wheel during expansion
      if (typeof window !== 'undefined') {
        window.__videoHandoffActive = true;
      }

      // Lock global scroll during animation
      const prevent = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      };
      // Save originals and apply strict locks
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
      if (typeof window !== 'undefined') {
        window.addEventListener('wheel', prevent, addOpts);
        window.addEventListener('touchmove', prevent, addOpts);
        window.addEventListener('touchstart', prevent, addOpts);
        window.addEventListener('touchend', prevent, addOpts);
        window.addEventListener('scroll', prevent, addOpts);
      }

      // Start the synchronized animation
      setTimeout(() => {
        setIsExpanded(true);
        
        // Hide navbar when video expands
        const navbar = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.querySelector('.navbar') || document.querySelector('#navbar');
        if (navbar) {
          navbar.style.display = 'none';
        }
      }, 50);

      // Ensure the section is in view
      try {
        videoSectionRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
      } catch {}

      // Release locks after animation completes
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.__videoHandoffActive = false;
        }
        document.removeEventListener('wheel', prevent, addOpts);
        document.removeEventListener('touchmove', prevent, addOpts);
        document.removeEventListener('touchstart', prevent, addOpts);
        document.removeEventListener('touchend', prevent, addOpts);
        document.removeEventListener('scroll', prevent, addOpts);
        document.removeEventListener('keydown', prevent, addOpts);
        if (typeof window !== 'undefined') {
          window.removeEventListener('wheel', prevent, addOpts);
          window.removeEventListener('touchmove', prevent, addOpts);
          window.removeEventListener('touchstart', prevent, addOpts);
          window.removeEventListener('touchend', prevent, addOpts);
          window.removeEventListener('scroll', prevent, addOpts);
        }
        try {
          document.body.style.overflow = originalBodyOverflowRef.current || '';
          document.body.style.touchAction = originalBodyTouchActionRef.current || '';
          document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
        } catch {}
        setIsAnimating(false);
      }, 3000); // Increased to match the longest animation duration
    };

    // Add scroll listener
    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, addOpts);
      container.addEventListener('touchmove', handleScroll, addOpts);
      container.addEventListener('touchstart', handleScroll, addOpts);
      container.addEventListener('touchend', handleScroll, addOpts);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll, addOpts);
        container.removeEventListener('touchmove', handleScroll, addOpts);
        container.removeEventListener('touchstart', handleScroll, addOpts);
        container.removeEventListener('touchend', handleScroll, addOpts);
      }
      if (observer) {
        try { observer.disconnect(); } catch {}
      }
      // Clean up global handoff
      if (typeof window !== 'undefined') {
        window.__videoHandoffActive = false;
      }
    };
  }, [slide, isAnimating, isExpanded]);

  // Synchronized animation styles
  const containerStyle = {
    transition: isExpanded ? 'all 3s linear' : 'none',
    transform: isExpanded ? 'scale(1)' : 'scale(1)',
  };

  // Autoplay MP4 when expanded and handle navbar visibility
  useEffect(() => {
    if (!isExpanded) {
      // Show navbar when video is not expanded
      const navbar = document.querySelector('nav') || document.querySelector('[role="navigation"]') || document.querySelector('.navbar') || document.querySelector('#navbar');
      if (navbar) {
        navbar.style.display = '';
      }
      return;
    }
    
    const el = videoRef.current;
    if (!el) return;

    // Ensure ideal attributes for autoplay
    try {
      el.muted = false;
      el.playsInline = true;
      el.autoplay = true;
    } catch {}

    const tryPlay = () => {
      if (!el || typeof el.play !== 'function') return;
      try { el.play().catch(() => {}); } catch {}
    };

    // Attempt immediately, then on next frame, then after a short delay
    tryPlay();
    const raf = requestAnimationFrame(tryPlay);
    autoplayRetryRef.current = setTimeout(tryPlay, 300);

    return () => {
      cancelAnimationFrame(raf);
      if (autoplayRetryRef.current) clearTimeout(autoplayRetryRef.current);
    };
  }, [isExpanded]);

  const videoContainerStyle = {
    transition: isExpanded
      ? 'transform 3s linear'
      : 'none',
    transform: isExpanded ? 'translate(calc(50vw - 50%), calc(50vh - 50%))' : 'translateX(0)',
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const videoStyle = {
    width: isExpanded ? '100vw' : `min(100%, ${videoMaxWidth})`,
    height: isExpanded ? '100vh' : 'auto',
    maxHeight: isExpanded ? '100vh' : videoMaxHeight,
    borderRadius: isExpanded ? '0px' : isSmallDesktop ? '20px' : '24px',
    transition: isExpanded
      ? 'width 3s linear, height 3s linear, max-height 3s linear, border-radius 3s linear, box-shadow 3s linear'
      : 'none',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
    boxShadow: isExpanded ? 'none' : '0 20px 40px rgba(0,0,0,0.15)',
  };

  const textContainerStyle = {
    transform: isExpanded ? 'translateX(100vw)' : 'translateX(0)',
    opacity: isExpanded ? 0 : 1,
    transition: isExpanded 
      ? 'transform 5s linear, opacity 4s linear' 
      : 'none',
    pointerEvents: isExpanded ? 'none' : 'auto',
  };

  const gridStyle = {
    gap: isExpanded ? '0rem' : gridGap,
    gridTemplateColumns: isExpanded ? '1fr 0fr' : '1fr 1fr',
    transition: isExpanded 
      ? 'gap 4s linear, grid-template-columns 4s linear' 
      : 'none',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  // Render mobile component on mobile devices
  if (isMobile) {
    return <VideoComponentMobile slide={slide} />;
  }

  return (
    <div 
      ref={mainContainerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        height: '100vh',
        overflowY: slide ? 'hidden' : 'scroll',
        scrollSnapType: slide ? undefined : 'y mandatory',
        scrollBehavior: slide ? undefined : 'smooth',
        overscrollBehavior: slide ? 'none' : undefined,
        
        touchAction: slide ? 'none' : undefined
      }}
    >
      <section
        ref={videoSectionRef}
        style={{
          height: '100vh',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
          overscrollBehavior: 'none',
          touchAction: 'none'
        }}
        data-theme="light"
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            ...gridStyle,
            maxWidth: isExpanded ? 'none' : containerMaxWidth,
            width: '100%',
            padding: isExpanded ? '0' : containerPadding,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            ...containerStyle
          }}>
            {/* Video Container */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              ...videoContainerStyle
            }}>
              {/* Video/Image */}
              {isExpanded ? (
                <video
                  ref={videoRef}
                  src={BAFT_VID_MP4}
                  style={videoStyle}
                  playsInline
                  autoPlay
                  preload="auto"
                  poster={VIDEO_COM_PNG}
                  onLoadedMetadata={() => { try { videoRef.current && videoRef.current.play && videoRef.current.play(); } catch {} }}
                  onCanPlay={() => { try { videoRef.current && videoRef.current.play && videoRef.current.play(); } catch {} }}
                />
              ) : (
                <img
                  ref={videoRef}
                  src={VIDEO_COM_PNG}
                  alt="Video Preview"
                  style={videoStyle}
                />
              )}
              
            </div>

            {/* Text Container */}
            <div style={{
              ...textContainerStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: isSmallDesktop ? '0.75rem' : '1rem',
              padding: isSmallDesktop ? '1.5rem' : '2rem',
              height: '100%'
            }}>
              <p
                className="font-normal mb-2 flex items-center gap-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: subheadingSize,
                  color: "#092646",
                  fontWeight: 500,
                  margin: 0
                }}
              >
                <img 
                  src={SVG_SVG} 
                  alt="Icon" 
                  className="w-5 h-5" 
                  style={{
                    width: isSmallDesktop ? '18px' : '20px',
                    height: isSmallDesktop ? '18px' : '20px'
                  }}
                />
                Know our story
              </p>
              
              <h1 style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: headingSize,
                fontWeight: 'bold',
                color: '#1966BB',
                lineHeight: '1.2',
                margin: 0
              }}>
                The Video
              </h1>
              
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: bodyTextSize,
                color: '#909090',
                lineHeight: '1.7',
                fontWeight: 400,
                maxWidth: isSmallDesktop ? '95%' : '90%',
                margin: 0
              }}>
                BaFT Technology is a next-gen neo-banking startup headquartered in
                Bangalore, proudly founded in 2025. We're a tight-knit team of
                financial innovators and tech experts on a mission: to reimagine
                financial services in India with customer-first solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CSS for animations */}
      <style>
        {`
          @keyframes gentlePulse {
            0% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1); 
            }
            50% { 
              opacity: 0.8; 
              transform: translateX(-50%) scale(1.02); 
            }
            100% { 
              opacity: 1; 
              transform: translateX(-50%) scale(1); 
            }
          }
          
          /* Additional responsive styles for desktop */
          @media (max-width: 1024px) {
            .desktop-container {
              padding: 0 1.5rem;
            }
          }
          
          @media (min-width: 1367px) {
            .desktop-container {
              padding: 0 2.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Videocomponent;