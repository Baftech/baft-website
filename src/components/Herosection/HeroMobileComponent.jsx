import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { BAFT_VID_MP4, LOGO_PNG } from "../../assets/assets";


const HeroMobileComponent = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const shrinkStartedRef = useRef(false);
  const [orientation, setOrientation] = useState('portrait');
  const [isMobile, setIsMobile] = useState(true);
  const [isTablet, setIsTablet] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile', 'tablet', 'desktop'
  const scaleRef = useRef(1);
  
  // Function to navigate to next slide
  const navigateToNextSlide = () => {
    // Scroll to the next section or slide
    const nextSection = document.querySelector('#next-section') || 
                       document.querySelector('.next-slide') ||
                       document.querySelector('main') ||
                       document.body;
    
    if (nextSection) {
      nextSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Detect device orientation and screen size
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check device type - adjusted for smaller iPads and modern tablets
      const mobile = width <= 575; // Reduced from 768 to 575 to catch smaller iPads
      const tablet = width > 575 && width <= 1600; // Tablets start from 576px
      const desktop = width > 1600;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Determine orientation
      if (width > height) {
        setOrientation('landscape');
        setIsLandscape(true);
      } else {
        setOrientation('portrait');
        setIsLandscape(false);
      }
      
      // Set view mode based on device and orientation
      if (mobile) {
        setViewMode('mobile');
      } else if (tablet) {
        // Tablet: portrait = tablet-portrait view, landscape = desktop view
        setViewMode(orientation === 'portrait' ? 'tablet-portrait' : 'desktop');
      } else {
        setViewMode('desktop');
      }
      
      // Debug logging for device detection (log once per mount)
      if (!window.__loggedHeroDevice) {
        window.__loggedHeroDevice = true;
        console.log(`Device Detection: width=${width}, height=${height}, mobile=${mobile}, tablet=${tablet}, desktop=${desktop}, orientation=${orientation}, viewMode=${orientation === 'portrait' ? 'tablet-portrait' : 'desktop'}`);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [orientation]);

  // ... existing code ...

  // Mobile animation synced to video time
  useEffect(() => {
    let rafId;

    const start = () => {
      if (!wrapperRef.current || !videoRef.current || !placeholderRef.current) {
        rafId = requestAnimationFrame(start);
        return;
      }

      // Only run animation if we're in mobile or tablet-portrait view mode
      if (viewMode !== 'mobile' && viewMode !== 'tablet-portrait') return;

      // Mobile-specific initial frame (not fullscreen):
      // - Start 5cm below top
      // - Width ~85vw (capped), centered
      // - Maintain original video aspect ratio 1056x594
      const viewportWidth = window.innerWidth;
      const videoAspect = 594 / 1056; // ≈ 0.5625
      
      // Aggressive scaling for tablet portrait to ensure complete viewport fit
      let baseViewportWidth, scale;
      if (viewMode === 'tablet-portrait') {
        // Tablet portrait: use much smaller scale to guarantee fit
        baseViewportWidth = viewportWidth; // Use actual device width
        scale = 1; // Base scale of 1 for natural sizing
        // Apply very aggressive scaling factor to ensure video fits
        if (viewportWidth <= 575) {
          scale = 0.4; // Very small tablets get 40% scale
        } else if (viewportWidth <= 768) {
          scale = 0.5; // Small tablets get 50% scale
        } else if (viewportWidth <= 1024) {
          scale = 0.6; // Medium tablets get 60% scale
        } else if (viewportWidth <= 1600) {
          scale = 0.7; // Large tablets (like Pixel Tablet) get 70% scale
        } else {
          scale = 0.8; // Extra large tablets get 80% scale
        }
      } else if (viewMode === 'mobile') {
        // Mobile: use iPhone 13 mini specs for consistent mobile experience
        baseViewportWidth = 375; // iPhone 13 mini logical width
        scale = viewportWidth / baseViewportWidth;
      } else {
        // Landscape: use original scaling
        baseViewportWidth = 375;
        scale = viewportWidth / baseViewportWidth;
      }
      
      const initialWidth = 1056 * scale;
      const initialHeight = 594 * scale; // keeps exact aspect
      const initialTop = viewMode === 'tablet-portrait' ? 60 * scale : 218 * scale; // Much higher for tablet portrait
      const initialLeft = viewMode === 'tablet-portrait' ? -80 * scale : -340.89 * scale; // Better centered for tablet portrait

      const initial = {
        width: initialWidth,
        height: initialHeight,
        top: initialTop,
        left: initialLeft,
      };

      // Initial state (video visible immediately)
      gsap.set(wrapperRef.current, {
        opacity: 1,
        position: "absolute",
        top: initial.top,
        left: initial.left,
        width: initial.width,
        height: initial.height,
        borderRadius: 0,
        zIndex: 50,
      });

      // Text starts centered vertically, hidden
      gsap.set("#text-mobile", { opacity: 0, top: "50%", yPercent: -50 });

      const handleTimeUpdate = () => {
        if (!videoRef.current || !wrapperRef.current || !placeholderRef.current) return;
        if (videoRef.current.currentTime < 8 || animationCompletedRef.current || shrinkStartedRef.current) return;

        // Use Figma final frame specs with aggressive scaling for tablet portrait
        let baseViewportWidth, scale;
        if (viewMode === 'tablet-portrait') {
          // Tablet portrait: use much smaller scale to guarantee fit
          baseViewportWidth = window.innerWidth; // Use actual device width
          scale = 1; // Base scale of 1 for natural sizing
          // Apply very aggressive scaling factor to ensure video fits
          if (window.innerWidth <= 575) {
            scale = 0.4; // Very small tablets get 40% scale
          } else if (window.innerWidth <= 768) {
            scale = 0.5; // Small tablets get 50% scale
          } else if (window.innerWidth <= 1024) {
            scale = 0.6; // Medium tablets get 60% scale
          } else if (window.innerWidth <= 1600) {
            scale = 0.7; // Large tablets (like Pixel Tablet) get 70% scale
          } else {
            scale = 0.8; // Extra large tablets get 80% scale
          }
        } else if (viewMode === 'mobile') {
          // Mobile: use iPhone 13 mini specs for consistent mobile experience
          baseViewportWidth = 375; // iPhone 13 mini logical width
          scale = window.innerWidth / baseViewportWidth;
        } else {
          // Landscape: use original scaling
          baseViewportWidth = 375;
          scale = window.innerWidth / baseViewportWidth;
        }
        
        const finalWidth = 618.6666870117188 * scale;
        const finalHeight = 348 * scale;
        const finalTop = viewMode === 'tablet-portrait' ? 120 * scale : 350 * scale; // Much higher for tablet portrait
        const finalLeft = viewMode === 'tablet-portrait' ? -60 * scale : -122.33 * scale; // Better centered for tablet portrait
        const finalRadius = viewMode === 'tablet-portrait' ? 60 * scale : 125.1 * scale; // Smaller radius for tablet portrait

        // prevent multiple concurrent animations
        shrinkStartedRef.current = true;

        gsap.to(wrapperRef.current, {
          width: finalWidth,
          height: finalHeight,
          top: finalTop,
          left: finalLeft,
          borderRadius: finalRadius,
          duration: 1.6,
          ease: "none",
          force3D: true,
          onComplete: () => { 
            animationCompletedRef.current = true; 
          }
        });

        const textTop = viewMode === 'tablet-portrait' ? 40 * scale : 134 * scale; // Much higher for tablet portrait
        gsap.to("#text-mobile", { opacity: 1, top: textTop, yPercent: 0, duration: 0.8, ease: "sine.out" });
        
        // Show dome mask after scaling completes with smooth animation
        gsap.to("#hero-dome-mask-mobile", { 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out", 
          delay: 1.6,
          force3D: true
        });
      };

      videoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      // Also trigger if the user seeks beyond 8s instantly
      const handleLoaded = () => handleTimeUpdate();
      videoRef.current.addEventListener("loadeddata", handleLoaded);

      return () => {
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current?.removeEventListener("loadeddata", handleLoaded);
      };
    };

    rafId = requestAnimationFrame(start);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [viewMode]); // Add viewMode dependency

  // Optimized scroll handler for mobile performance
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!animationCompletedRef.current || !wrapperRef.current || !placeholderRef.current) return;
          if (viewMode !== 'mobile' && viewMode !== 'tablet-portrait') return; // Handle scroll for mobile and tablet portrait
          
          const rect = placeholderRef.current.getBoundingClientRect();
          gsap.set(wrapperRef.current, {
            top: rect.top,
            left: rect.left,
            transformOrigin: "center center",
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive event listener for better mobile performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  // Don't render mobile component if we're in desktop view mode
  if (viewMode === 'desktop') {
    return null; // This will fall back to the desktop component
  }

  return (
    <>
      <style>
        {`
          /* Grid container - disabled */
          /* #grid_container {
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 10 !important;
          } */
          
          /* Mobile-specific scrollbar hiding */
          #hero-mobile::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background-color: transparent !important;
            display: none !important;
          }
          
          #hero-mobile::-webkit-scrollbar-track,
          #hero-mobile::-webkit-scrollbar-thumb,
          #hero-mobile::-webkit-scrollbar-corner {
            background-color: transparent !important;
            display: none !important;
          }
          
          #hero-mobile {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow: -moz-scrollbars-none !important;
          }
          
          /* Mobile-optimized video container */
          .mobile-video-blend {
            transform-origin: center center !important;
            position: relative !important;
            will-change: transform, width, height, top, left;
            backface-visibility: hidden;
            border-radius: inherit;
            overflow: hidden;
          }
          
          .mobile-video-container-locked {
            transform-origin: center center !important;
            position: fixed !important;
          }
          
          /* Mobile-specific text sizing */
          .mobile-hero-text {
            font-size: clamp(2rem, 8vw, 4rem);
            line-height: 1.2;
            text-align: center;
            padding: 0 1rem;
          }
          
          .mobile-hero-subtitle {
            font-size: clamp(1rem, 4vw, 1.5rem);
            line-height: 1.3;
            margin-bottom: 1.5rem;
          }
          
          /* Tablet-specific adjustments */
          .tablet-portrait .mobile-hero-text {
            font-size: clamp(2.5rem, 6vw, 3.5rem);
          }
          
          .tablet-portrait .mobile-hero-subtitle {
            font-size: clamp(1.2rem, 3vw, 1.3rem);
          }
          
          /* Tablet portrait video container adjustments */
          .tablet-portrait .mobile-video-blend {
            transform-origin: center center !important;
            will-change: transform, width, height, top, left;
            backface-visibility: hidden;
          }
          
          /* Landscape-specific adjustments */
          .mobile-landscape .mobile-hero-text {
            font-size: clamp(2.5rem, 6vw, 3.5rem);
            margin-top: 2rem;
          }
          
          .mobile-landscape .mobile-hero-subtitle {
            font-size: clamp(1.2rem, 3vw, 1.3rem);
            margin-bottom: 1rem;
          }
          
          /* Mobile scroll button */
          .mobile-scroll-btn {
            width: 140px;
            height: 56px;
            font-size: 1rem;
            border-radius: 28px;
          }
          
          .mobile-landscape .mobile-scroll-btn {
            width: 120px;
            height: 48px;
            font-size: 0.9rem;
            border-radius: 24px;
          }
          
          /* Touch-friendly interactions */
          .mobile-touch-target {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Mobile performance optimizations */
          .mobile-perf-hint {
            will-change: transform;
            backface-visibility: hidden;
          }
          
          /* Dome mask smooth animation */
          #hero-dome-mask-mobile {
            will-change: opacity;
            backface-visibility: hidden;
            transform: translateZ(0);
          }
        `}
      </style>
      
      <div 
        id="hero-mobile" 
        className={`relative w-full min-h-screen bg-black flex flex-col items-center overflow-y-auto ${
          isLandscape ? 'mobile-landscape' : 'mobile-portrait'
        } ${isTablet && !isLandscape ? 'tablet-portrait' : ''}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbarWidth: 'none',
          overflow: '-moz-scrollbars-none'
        }}
      >
        {/* Grid overlay - disabled */}
        {/* <div id="grid_container" className="absolute inset-0 z-10">
          <GridBackground forceMobile={true} key="mobile-grid" />
        </div> */}

        {/* Gentle dome-shaped mask at the very top */}
        <div
          id="hero-dome-mask-mobile"
          className="absolute pointer-events-none z-[40]"
          style={{
            position: 'absolute',
            width: 'clamp(1024px, 94vw, 1600px)',
            height: '360px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-160px',
            background: '#272727',
            filter: 'blur(162px)',
            mixBlendMode: 'normal',
            opacity: 0,
            willChange: 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />

        

        {/* Text block visible from start (matches screenshot layout) */}
        <div 
          id="text-mobile" 
          className={"opacity-0"}
          style={{
            position: 'absolute',
            width: isTablet ? '600px' : '375px',
            height: isTablet ? 'auto' : '192.53px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: isTablet ? '180px' : '134px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 0,
            gap: isTablet ? '12px' : '7.53px',
            zIndex: 70,
            textAlign: 'left',
          }}
        >
          <p 
            style={{
              width: '100%',
              height: 'auto',
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: isTablet ? '18px' : '14px',
              lineHeight: isTablet ? '22px' : '17px',
              textAlign: 'center',
              color: '#777575',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
              padding: 0,
            }}
          >
            The new-age finance app for your digital-first life.
          </p>
          
          <h1 
            style={{
              width: '100%',
              height: 'auto',
              fontFamily: 'EB Garamond',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: isTablet ? '80px' : '64px',
              lineHeight: isTablet ? '96px' : '84px',
              textAlign: 'center',
              backgroundImage: 'linear-gradient(165.6deg, #999999 32.7%, #161616 70.89%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              flex: 'none',
              order: 1,
              flexGrow: 0,
              margin: 0,
              padding: 0,
            }}
          >
            Do Money, Differently.
          </h1>
        </div>

        {/* Responsive placeholder container */}
        <div className={`relative z-10 w-full px-4 ${
          isLandscape ? 'mt-4' : 'mt-6'
        }`}>
          <div
            ref={placeholderRef}
            className="shadow-lg mx-auto"
            style={{
              width: viewMode === 'tablet-portrait'
                ? "clamp(250px, 70vw, 500px)" // Tablet portrait: optimized for smaller tablets
                : viewMode === 'mobile'
                  ? "clamp(320px, 90vw, 400px)" // Mobile: responsive sizing
                  : "clamp(280px, 70vw, 600px)", // Landscape: original sizing
              aspectRatio: "16 / 9", // Consistent 16:9 for all modes (matches video 1056x594)
              borderRadius: viewMode === 'tablet-portrait'
                ? "20%" // Tablet portrait: elegant border radius
                : viewMode === 'mobile'
                  ? "20%" // Mobile: consistent border radius
                  : "16%", // Landscape: original border radius
              overflow: "hidden",
              background: "transparent",
              position: "relative",
            }}
          />
        </div>

        {/* Responsive video wrapper with radial gradient background */}
        <div
          ref={wrapperRef}
          className="w-full opacity-0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: viewMode === 'tablet-portrait'
              ? "calc(100vh - 12rem)" // Tablet portrait: adjusted margin for smaller tablets
              : viewMode === 'mobile'
                ? "calc(100vh - 4rem)" // Mobile: original margin
                : "calc(100vh - 2rem)", // Landscape: minimal margin
            overflow: "hidden",
            borderRadius: 0,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)",
            zIndex: 50,
          }}
        >
          <video
            ref={videoRef}
            src={BAFT_VID_MP4}
            preload="auto"
            autoPlay
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            className="w-full h-full object-contain bg-black object-center pointer-events-none mobile-video-blend"
            style={{
              objectPosition: 'center center',
              // Remove heavy filters to avoid jank on mobile GPUs
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            onEnded={() => videoRef.current.pause()}
          />
          
          {/* Radial gradient spotlight overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)",
              borderRadius: "inherit",
              zIndex: 2,
            }}
          />
        </div>

        {/* Responsive scroll button */}
        <div
          id="scroll-down-btn"
          className={`absolute pointer-events-auto mobile-scroll-btn ${
            viewMode === 'tablet-portrait'
              ? 'bottom-1' // Tablet portrait: much higher to ensure visibility
              : viewMode === 'mobile'
                ? 'bottom-8' // Mobile: original position
                : 'bottom-6' // Landscape: original position
          }`}
          style={{
            left: '50%',
            zIndex: 100,
            opacity: 1, // Make visible immediately for testing
            transform: 'translateX(-50%) translateY(0)', // Remove translateY offset
          }}
        >
          <button
            className="w-full h-full flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:bg-white/0.08 transition-all duration-300 group mobile-touch-target"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              fontFamily: 'GeneralSans, sans-serif',
            }}
            onClick={navigateToNextSlide}
          >
            <span className="text-white font-medium tracking-wide">
              Scroll Down
            </span>
            <svg 
              className="w-4 h-4 text-white transform group-hover:translate-y-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default HeroMobileComponent;