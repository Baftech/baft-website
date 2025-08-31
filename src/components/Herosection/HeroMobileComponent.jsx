import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";

const HeroMobileComponent = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const shrinkStartedRef = useRef(false);
  const [orientation, setOrientation] = useState('portrait');
  const [isMobile, setIsMobile] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const scaleRef = useRef(1);
  
  // Function to navigate to next slide
  const navigateToNextSlide = () => {
    console.log('Mobile hero: Attempting to navigate to next slide...');
    
    // Add visual feedback
    const button = document.querySelector('#scroll-down-btn button');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }
    
    try {
      // Dispatch the slide navigation event that SlideContainer listens for
      const evt = new CustomEvent('navigateToSlide', { 
        detail: { index: 1, slow: false }  // Navigate to slide 1 (BaFT Coin)
      });
      console.log('Mobile hero: Dispatching navigateToSlide event:', evt.detail);
      
      // Dispatch immediately
      window.dispatchEvent(evt);
      
      // Also try after a short delay in case SlideContainer isn't ready
      setTimeout(() => {
        console.log('Mobile hero: Dispatching navigateToSlide event (delayed)');
        window.dispatchEvent(evt);
      }, 100);
      
    } catch (error) {
      console.error('Mobile hero: Navigation failed:', error);
    }
  };

  // Detect device orientation and screen size
  useEffect(() => {
    const checkOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check if mobile device
      const mobile = width <= 768;
      setIsMobile(mobile);
      
      // Determine orientation
      if (mobile) {
        if (width > height) {
          setOrientation('landscape');
          setIsLandscape(true);
        } else {
          setOrientation('portrait');
          setIsLandscape(false);
        }
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Mobile animation synced to video time
  useEffect(() => {
    let rafId;

    const start = () => {
      if (!wrapperRef.current || !videoRef.current || !placeholderRef.current) {
        rafId = requestAnimationFrame(start);
        return;
      }

      // Mobile-specific initial frame (not fullscreen):
      // - Start 5cm below top
      // - Width ~85vw (capped), centered
      // - Maintain original video aspect ratio 1056x594
      const viewportWidth = window.innerWidth;
      const videoAspect = 594 / 1056; // ≈ 0.5625
      // Use Figma iPhone 13 mini specs, scaled to the current viewport width (375 base)
      const baseViewportWidth = 375; // iPhone 13 mini logical width
      const scale = viewportWidth / baseViewportWidth;
      const initialWidth = 1056 * scale;
      const initialHeight = 594 * scale; // keeps exact aspect
      const initialTop = 218 * scale;
      const initialLeft = -340.89 * scale;

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
      // Grid container disabled - removed GSAP reference
      // gsap.set("#grid_container", { 
      //   opacity: 1, 
      //   visibility: "visible",
      //   zIndex: 10 
      // });
      // Text starts centered vertically, hidden
      gsap.set("#text-mobile", { opacity: 0, top: "50%", yPercent: -50 });

      const handleTimeUpdate = () => {
        if (!videoRef.current || !wrapperRef.current || !placeholderRef.current) return;
        if (videoRef.current.currentTime < 8 || animationCompletedRef.current || shrinkStartedRef.current) return;

        // Use Figma final frame specs, positioned at center of mobile viewport
        const baseViewportWidth = 375; // iPhone 13 mini logical width
        const scale = window.innerWidth / baseViewportWidth;
        const finalWidth = 618.6666870117188 * scale;
        const finalHeight = 348 * scale;
        const finalTop = 350 * scale;
        const finalLeft = -122.33 * scale;
        const finalRadius = 125.1 * scale;

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

        const textTop = 134 * scale; // animate to designed position
        gsap.to("#text-mobile", { opacity: 1, top: textTop, yPercent: 0, duration: 0.8, ease: "sine.out" });
        // Button is now visible immediately, no need for GSAP animation
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
  }, []); // Remove isLandscape dependency to prevent re-initialization

  // Text will animate in at 8s from screen center → target position
  // No initial fade-in on mount

  // Mobile-optimized scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!animationCompletedRef.current || !wrapperRef.current || !placeholderRef.current) return;
      
      const rect = placeholderRef.current.getBoundingClientRect();
      gsap.set(wrapperRef.current, {
        top: rect.top,
        left: rect.left,
        transformOrigin: "center center",
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        `}
      </style>
      
      <div 
        id="hero-mobile" 
        className={`relative w-full min-h-screen bg-black flex flex-col items-center overflow-y-auto ${
          isLandscape ? 'mobile-landscape' : 'mobile-portrait'
        }`}
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

        {/* Top-centered logo */}
        <img
          src="/logo1.png"
          alt="BaFT"
          style={{
            position: 'absolute',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '64px',
            height: 'auto',
            zIndex: 80,
            opacity: 0.92,
          }}
        />

        {/* Text block visible from start (matches screenshot layout) */}
        <div 
          id="text-mobile" 
          className={"opacity-0"}
          style={{
            position: 'absolute',
            width: '375px',
            height: '192.53px',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '134px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: 0,
            gap: '7.53px',
            zIndex: 70,
            textAlign: 'left',
          }}
        >
          <p 
            style={{
              width: '375px',
              height: '17px',
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '17px',
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
              width: '375px',
              height: '168px',
              fontFamily: 'EB Garamond',
              fontStyle: 'normal',
              fontWeight: 700,
              fontSize: '64px',
              lineHeight: '84px',
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

        {/* Mobile-responsive placeholder container */}
        <div className={`relative z-10 w-full px-4 ${
          isLandscape ? 'mt-4' : 'mt-6'
        }`}>
          <div
            ref={placeholderRef}
            className="shadow-lg mx-auto"
            style={{
              width: isLandscape ? "clamp(280px, 70vw, 600px)" : "clamp(320px, 85vw, 400px)",
              aspectRatio: isLandscape ? "16 / 9" : "4 / 3",
              borderRadius: isLandscape ? "16%" : "20%",
              overflow: "hidden",
              background: "transparent",
              position: "relative",
            }}
          />
        </div>

        {/* Mobile video wrapper with radial gradient background only (no beams/spotlights) */}
        <div
          ref={wrapperRef}
          className="w-full opacity-0"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: isLandscape ? "calc(100vh - 2rem)" : "calc(100vh - 4rem)",
            overflow: "hidden",
            borderRadius: 0,
            background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)",
            zIndex: 50,
          }}
        >
          <video
            ref={videoRef}
            src="/BAFT Vid 2_1.mp4"
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

        {/* Mobile-optimized scroll button */}
        <div
          id="scroll-down-btn"
          className={`absolute pointer-events-auto mobile-scroll-btn ${
            isLandscape ? 'bottom-6' : 'bottom-8'
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
