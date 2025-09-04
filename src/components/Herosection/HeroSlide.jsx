import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";
import HeroMobileComponent from "./HeroMobileComponent";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const lastUpdateAtRef = useRef(0);
  const lastTransform = useRef({});
  // Responsive dome mask sizing (mirrors Gridbackground gentle arc params)
  const [viewportWidth, setViewportWidth] = useState(() => {
    try { return window.innerWidth; } catch (_) { return 0; }
  });

  useEffect(() => {
    const onResize = () => {
      try { setViewportWidth(window.innerWidth); } catch (_) {}
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  const domeWidth = viewportWidth * 1.2;   // Wider than screen width for gentle curve
  const domeHeight = 150;                   // Much shallower for gentle arc
  const domeY = -50;                        // Closer to screen for subtle effect

  // Detect mobile devices by viewport width
  useEffect(() => {
    const checkMobile = () => {
      try {
        setIsMobile(window.innerWidth <= 768);
      } catch (_) {}
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  // Note: We do NOT early-return for mobile because that would change the
  // number/order of hooks between renders. We will conditionally render
  // mobile UI in the JSX and short-circuit effect bodies when isMobile is true.

  useEffect(() => {
    if (isMobile) return; // skip desktop animation on mobile
    let rafId;
    const start = () => {
      if (!wrapperRef.current || !placeholderRef.current) {
        rafId = requestAnimationFrame(start);
        return;
      }
      const tl = gsap.timeline();

      gsap.set(wrapperRef.current, {
        opacity: 0,
        position: "absolute",
        top: "2cm",
        left: 0,
        width: "100%",
        height: "100vh",
        borderRadius: 0,
        zIndex: 50,
      });

      // While video plays fullscreen, hide the grid to prevent bleed-through on tab switches
      gsap.set("#grid_container", { opacity: 0 });
      gsap.set("#dynamic-overlay", { opacity: 0 });
      gsap.set("#hero-top-mask", { opacity: 0 });
      gsap.set("#hero-side-mask", { opacity: 0 });
      gsap.set("#hero-dome-mask", { opacity: 0 });
      gsap.set("#text", { opacity: 0, y: "50vh", scale: 0.9 });

      // Responsive target based on placeholder metrics
      const targetWidth = () => (placeholderRef.current ? placeholderRef.current.offsetWidth : 0);
      const targetHeight = () => (placeholderRef.current ? placeholderRef.current.offsetHeight : 0);
      const targetTop = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().top : 0);
      const targetLeft = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().left : 0);
      const targetBorderRadius = () => {
        if (!placeholderRef.current) return 0;
        const cs = window.getComputedStyle(placeholderRef.current);
        return cs.borderRadius || 0;
      };
      
      // Calculate center position for locked scaling
      const targetCenterX = () => targetLeft() + (targetWidth() / 2);
      const targetCenterY = () => targetTop() + (targetHeight() / 2);

      tl.to(wrapperRef.current, { 
        opacity: 1, 
        duration: 1.0, 
        delay: 0.4,
      })
        .to("#dynamic-overlay", { opacity: 1, duration: 0.6, ease: "sine.out" }, "<")
        // Show fullscreen spotlight when video starts playing
        .to("#fullscreen-spotlight", { opacity: 1, duration: 0.6, ease: "sine.out" }, "<")
        .addLabel("shrink", "+=7.5")
        // Hide fullscreen spotlight when scaling begins
        .to("#fullscreen-spotlight", { opacity: 0, duration: 0.25, ease: "power1.out" }, "shrink")
        // Ensure the overlay/container effect is invisible during scaling (fade out smoothly)
        .to("#dynamic-overlay", { opacity: 0, duration: 0.25, ease: "power1.out" }, "shrink")
        // Dim video gradually so the change isn't noticeable
        .to(videoRef.current, { opacity: 0.5, duration: 0.6, ease: "power1.inOut" }, "shrink")
        .to(
          wrapperRef.current,
          {
            width: targetWidth,
            height: targetHeight,
            borderRadius: targetBorderRadius,
            top: targetTop,
            left: targetLeft,
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 2.6,
            ease: "power1.inOut",
            transformOrigin: "center center",
            onStart: () => {
              if (wrapperRef.current) {
                wrapperRef.current.classList.add('perf-hint');
              }
            },
            onUpdate: () => {
              // Make border areas transparent during scaling
              if (wrapperRef.current) {
                // Throttle updates to ~30fps to reduce jank
                const now = performance.now();
                if (now - lastUpdateAtRef.current < 33) return;
                lastUpdateAtRef.current = now;

                const currentScale = gsap.getProperty(wrapperRef.current, "scale") || 1;
                const targetScale = targetWidth() / window.innerWidth;
                const progress = Math.min(1, (1 - currentScale) / (1 - targetScale));
                // No per-frame overlay updates to reduce runtime work
              }
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              // Lock the wrapper position after animation
              if (wrapperRef.current) {
                wrapperRef.current.classList.remove('perf-hint');
                wrapperRef.current.classList.add('video-container-locked');
                
                // Store the final transform state to prevent jumping on tab switch
                lastTransform.current = {
                  x: gsap.getProperty(wrapperRef.current, "x"),
                  y: gsap.getProperty(wrapperRef.current, "y"),
                  scaleX: gsap.getProperty(wrapperRef.current, "scaleX"),
                  scaleY: gsap.getProperty(wrapperRef.current, "scaleY"),
                  top: gsap.getProperty(wrapperRef.current, "top"),
                  left: gsap.getProperty(wrapperRef.current, "left"),
                  width: gsap.getProperty(wrapperRef.current, "width"),
                  height: gsap.getProperty(wrapperRef.current, "height"),
                  borderRadius: gsap.getProperty(wrapperRef.current, "borderRadius"),
                };
              }
              // No extra video effects after scaling completes
            },
          },
          "shrink"
        )
        .to(videoRef.current, { opacity: 1, duration: 0.8, ease: "power1.out", onComplete: () => {
          if (videoRef.current) {
            // ensure the video is paused at final state and doesn't replay
            try { videoRef.current.pause(); } catch (_) {}
          }
        } }, ">")
        // After scaling completes, show a simple elliptical radial spotlight on top
        .to({}, { duration: 0, onStart: () => {
          const el = document.getElementById('dynamic-overlay');
          if (el) {
            el.style.background = 'radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)';
          }
        }}, ">")
        .to("#dynamic-overlay", { opacity: 1, duration: 0.4, ease: "sine.out" }, "<")
        // Fade in grid darkening masks as scaling begins
        .to(["#hero-top-mask", "#hero-side-mask"], { opacity: 1, duration: 0.4, ease: "sine.out" }, "shrink")
        // Reveal the top dome ellipse only after scaling completes
        .to("#hero-dome-mask", { opacity: 1, duration: 0.6, ease: "sine.out" }, ">")
        // Restore grid visibility after scaling completes so the design returns
        .to("#grid_container", { opacity: 1, duration: 0.4, ease: "sine.out" }, "<")
        .to(
          "#text",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2.8,
            ease: "sine.out",
          },
          "shrink"
        )
        // Show scroll down button after video scaling completes
        .to("#scroll-down-btn", { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "sine.out" 
        }, ">");
    };

    rafId = requestAnimationFrame(start);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  // Keep wrapper aligned to placeholder on viewport resize after animation completes
  useEffect(() => {
    if (isMobile) return; // skip desktop resync logic on mobile
    const resyncLockedVideo = () => {
      if (!animationCompletedRef.current) return;
      if (!wrapperRef.current || !placeholderRef.current) return;
      const rect = placeholderRef.current.getBoundingClientRect();
      const cs = window.getComputedStyle(placeholderRef.current);
      gsap.set(wrapperRef.current, {
        width: placeholderRef.current.offsetWidth,
        height: placeholderRef.current.offsetHeight,
        top: rect.top,
        left: rect.left,
        borderRadius: cs.borderRadius || 0,
        transformOrigin: "center center",
        x: 0,
        y: 0,
        opacity: 1,
        position: "fixed",
      });
      if (videoRef.current) {
        videoRef.current.style.opacity = '1';
        // do not resume playback on tab return
      }
    };

    const handleResize = () => {
      if (!animationCompletedRef.current) return;
      if (!wrapperRef.current || !placeholderRef.current) return;
      const rect = placeholderRef.current.getBoundingClientRect();
      const cs = window.getComputedStyle(placeholderRef.current);
      
      // Maintain locked position during resize
      gsap.set(wrapperRef.current, {
        width: placeholderRef.current.offsetWidth,
        height: placeholderRef.current.offsetHeight,
        top: rect.top,
        left: rect.left,
        borderRadius: cs.borderRadius || 0,
        transformOrigin: "center center",
        x: 0,
        y: 0,
      });
    };

    // Lock video position during scroll
    const lockVideoPosition = () => {
      if (animationCompletedRef.current && wrapperRef.current && placeholderRef.current) {
        const rect = placeholderRef.current.getBoundingClientRect();
        gsap.set(wrapperRef.current, {
          top: rect.top,
          left: rect.left,
          transformOrigin: "center center",
        });
      }
    };

    // Optimized scroll constraint for mobile performance
    const constrainScroll = (e) => {
      if (!placeholderRef.current || !animationCompletedRef.current) return;
      
      // Throttle scroll constraint checks for better mobile performance
      if (constrainScroll.throttle) return;
      constrainScroll.throttle = true;
      
      requestAnimationFrame(() => {
        constrainScroll.throttle = false;
        
        const placeholderRect = placeholderRef.current.getBoundingClientRect();
        const videoBottom = placeholderRect.bottom;
        const viewportHeight = window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if video is currently playing
        const isVideoPlaying = videoRef.current && !videoRef.current.paused && !videoRef.current.ended;
        
        // Calculate the maximum scroll position (video bottom should stay visible)
        const maxScrollTop = Math.max(0, videoBottom - viewportHeight + 100); // Add 100px buffer
        
        // If trying to scroll beyond video end, prevent it
        if (scrollTop > maxScrollTop) {
          e.preventDefault();
          e.stopPropagation();
          
          // Add visual feedback for scroll constraint
          const heroElement = document.getElementById('hero');
          if (heroElement) {
            heroElement.classList.add('scroll-limit-reached');
            setTimeout(() => heroElement.classList.remove('scroll-limit-reached'), 500);
          }
          
          // Use auto behavior for better mobile performance
          window.scrollTo({
            top: maxScrollTop,
            behavior: 'auto'
          });
          return false;
        }
        
        // Also prevent scrolling too far up (before video starts)
        const videoTop = placeholderRect.top;
        const minScrollTop = Math.max(0, videoTop - 50); // 50px buffer above video
        
        if (scrollTop < minScrollTop) {
          e.preventDefault();
          e.stopPropagation();
          
          // Add visual feedback for scroll constraint
          const heroElement = document.getElementById('hero');
          if (heroElement) {
            heroElement.classList.add('scroll-limit-reached');
            setTimeout(() => heroElement.classList.remove('scroll-limit-reached'), 500);
          }
          
          // Use auto behavior for better mobile performance
          window.scrollTo({
            top: minScrollTop,
            behavior: 'auto'
          });
          return false;
        }
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", lockVideoPosition);
    window.addEventListener("scroll", constrainScroll, { passive: false });
    
    // Add continuous transform state tracking to prevent jumping on tab switch
    const updateTransformState = () => {
      if (animationCompletedRef.current && wrapperRef.current) {
        lastTransform.current = {
          x: gsap.getProperty(wrapperRef.current, "x"),
          y: gsap.getProperty(wrapperRef.current, "y"),
          scaleX: gsap.getProperty(wrapperRef.current, "scaleX"),
          scaleY: gsap.getProperty(wrapperRef.current, "scaleY"),
          top: gsap.getProperty(wrapperRef.current, "top"),
          left: gsap.getProperty(wrapperRef.current, "left"),
          width: gsap.getProperty(wrapperRef.current, "width"),
          height: gsap.getProperty(wrapperRef.current, "height"),
          borderRadius: gsap.getProperty(wrapperRef.current, "borderRadius"),
        };
      }
    };
    
    // Update transform state on every frame when animation is completed
    gsap.ticker.add(updateTransformState);
    
    document.addEventListener("visibilitychange", () => {
      // When user comes back to tab, restore the correct visual state
      if (animationCompletedRef.current && wrapperRef.current && lastTransform.current) {
        gsap.set(wrapperRef.current, lastTransform.current);
        // Ensure post-scale overlays are visible
        gsap.set("#dynamic-overlay", { opacity: 1 });
        gsap.set("#hero-dome-mask", { opacity: 1 });
        gsap.set("#grid_container", { opacity: 1 });
      } else {
        // During pre-scale playback, keep fullscreen overlays active to hide grid
        gsap.set("#fullscreen-spotlight", { opacity: 1 });
        gsap.set("#dynamic-overlay", { opacity: 1 });
        gsap.set("#hero-top-mask", { opacity: 0 });
        gsap.set("#hero-side-mask", { opacity: 0 });
        gsap.set("#grid_container", { opacity: 0 });
        resyncLockedVideo();
      }
    });
    window.addEventListener("pageshow", () => {
      // When page is shown, also restore visual state
      if (animationCompletedRef.current && wrapperRef.current && lastTransform.current) {
        gsap.set(wrapperRef.current, lastTransform.current);
        gsap.set("#dynamic-overlay", { opacity: 1 });
        gsap.set("#hero-dome-mask", { opacity: 1 });
        gsap.set("#grid_container", { opacity: 1 });
      } else {
        gsap.set("#fullscreen-spotlight", { opacity: 1 });
        gsap.set("#dynamic-overlay", { opacity: 1 });
        gsap.set("#hero-top-mask", { opacity: 0 });
        gsap.set("#hero-side-mask", { opacity: 0 });
        gsap.set("#grid_container", { opacity: 0 });
        resyncLockedVideo();
      }
    });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", lockVideoPosition);
      window.removeEventListener("scroll", constrainScroll);
      document.removeEventListener("visibilitychange", resyncLockedVideo);
      window.removeEventListener("pageshow", resyncLockedVideo);
      gsap.ticker.remove(updateTransformState);
    };
  }, [isMobile]);

  return (
    <>
      {isMobile ? (
        <HeroMobileComponent />
      ) : (
        <>
      <style>
        {`
          /* Hide scrollbar completely across all browsers - Global approach */
          *::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
            display: none !important;
          }
          
          *::-webkit-scrollbar-track {
            background: transparent !important;
            display: none !important;
          }
          
          *::-webkit-scrollbar-thumb {
            background: transparent !important;
            display: none !important;
          }
          
          *::-webkit-scrollbar-corner {
            background: transparent !important;
            display: none !important;
          }
          
          /* Firefox scrollbar hiding - Global */
          * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          /* Specific hero element scrollbar hiding */
          #hero::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
            display: none !important;
          }
          
          #hero::-webkit-scrollbar-track {
            background: transparent !important;
            display: none !important;
          }
          
          #hero::-webkit-scrollbar-thumb {
            background: transparent !important;
            display: none !important;
          }
          
          #hero::-webkit-scrollbar-corner {
            background: transparent !important;
            display: none !important;
          }
          
          /* Firefox scrollbar hiding */
          #hero {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          
          /* Lock video position and ensure center scaling */
          .video-blend {
            transform-origin: center center !important;
            position: relative !important;
            will-change: transform, width, height, top, left;
            backface-visibility: hidden;
            border-radius: inherit;
            overflow: hidden;
          }
          
          /* Lock wrapper position after animation */
          [ref="wrapperRef"] {
            transform-origin: center center !important;
          }
          
          /* Ensure video scales from placeholder center */
          .video-container-locked {
            transform-origin: center center !important;
            position: fixed !important;
          }
          
          /* Lock placeholder position */
          .video-placeholder-locked {
            position: relative !important;
            z-index: 10 !important;
          }
          
          /* Prevent any unwanted movement during scroll */
          .video-container-locked .video-blend {
            transform-origin: center center !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
          }
          
          /* Scroll constraint visual feedback */
          .scroll-constrained {
            scroll-behavior: smooth;
            overscroll-behavior: contain;
          }
          
          /* Prevent overscroll beyond video boundaries */
          .video-scroll-boundary {
            overscroll-behavior: contain;
            scroll-snap-type: y proximity;
          }
          
          /* Visual feedback when scroll limit is reached */
          .scroll-limit-reached {
            animation: scrollBounce 0.5s ease-out;
          }
          
          @keyframes scrollBounce {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          /* Hide scrollbar for video scroll boundary as well */
          .video-scroll-boundary::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
            display: none !important;
          }
          
          .video-scroll-boundary::-webkit-scrollbar-track {
            background: transparent !important;
            display: none !important;
          }
          
          .video-scroll-boundary::-webkit-scrollbar-thumb {
            background: transparent !important;
            display: none !important;
          }
          
          /* Smooth scaling animation for video */
          .video-scaling {
            transition: all 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          /* Optimize video performance during scaling */
          .video-blend video {
            will-change: transform;
            transform: translateZ(0);
            border-radius: inherit;
            overflow: hidden;
          }
          
          /* Natural video-to-background merge */
          .video-blend {
            position: relative;
            border-radius: inherit;
            overflow: hidden;
          }
          
          /* Ensure video blends naturally with overlay */
          .video-blend video {
            border-radius: inherit;
            mix-blend-mode: normal;
          }
          
          /* Dynamic overlay transitions during scaling */
          #dynamic-overlay {
            transition: background 0.1s ease-out;
            will-change: background;
          }
          
          /* Ensure smooth scaling animation */
          .video-blend {
            will-change: transform, width, height;
            backface-visibility: hidden;
          }
          
          /* Removed extra spotlight/glow to reduce cost - keep only main ellipse */
          
          /* Additional scrollbar hiding for all possible scrollable elements */
          html::-webkit-scrollbar,
          body::-webkit-scrollbar,
          .overflow-y-auto::-webkit-scrollbar,
          .scroll-constrained::-webkit-scrollbar,
          .video-scroll-boundary::-webkit-scrollbar {
            width: 0px !important;
            height: 0px !important;
            background: transparent !important;
            display: none !important;
          }
          
          html::-webkit-scrollbar-track,
          body::-webkit-scrollbar-track,
          .overflow-y-auto::-webkit-scrollbar-track,
          .scroll-constrained::-webkit-scrollbar-track,
          .video-scroll-boundary::-webkit-scrollbar-track {
            background: transparent !important;
            display: none !important;
          }
          
          html::-webkit-scrollbar-thumb,
          body::-webkit-scrollbar-thumb,
          .overflow-y-auto::-webkit-scrollbar-thumb,
          .scroll-constrained::-webkit-scrollbar-thumb,
          .video-scroll-boundary::-webkit-scrollbar-thumb {
            background: transparent !important;
            display: none !important;
          }
          
          /* Force hide scrollbars with CSS */
          html, body, #hero, .overflow-y-auto, .scroll-constrained, .video-scroll-boundary {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            overflow: -moz-scrollbars-none !important;
          }
        `}
      </style>
      <div id="hero" className="relative w-full min-h-screen bg-black flex flex-col items-center overflow-y-auto scroll-constrained video-scroll-boundary" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitScrollbarWidth: 'none',
        overflow: '-moz-scrollbars-none'
      }}>
      {/* Grid overlay */}
      <div id="grid_container" className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Top and side black mask to darken hero edges */}
      <div
        id="hero-top-mask"
        className="absolute inset-x-0 top-0 pointer-events-none z-[30]"
        style={{
          height: '40vh',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)',
          opacity: 0
        }}
      />
      <div
        id="hero-side-mask"
        className="absolute inset-y-0 left-0 right-0 pointer-events-none z-[30]"
        style={{
          background:
            'radial-gradient(60% 80% at 0% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.0) 58%) , radial-gradient(60% 80% at 100% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 22%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.0) 58%)',
          opacity: 0
        }}
      />

      {/* Gentle dome-shaped mask at the very top */}
      <div
        id="hero-dome-mask"
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
          maskImage: 'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0) 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 48%, rgba(0,0,0,0) 80%)',
          opacity: 0
        }}
      />

      {/* Text appears later */}
      <div id="text" className="relative z-[70] text-center px-4 mt-40 opacity-0" style={{ marginTop: "calc(10rem + 0.5cm)" }}>
        <p
  style={{
    fontFamily: "General Sans, sans-serif",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "100%",
    color: "#777575",
    marginBottom: "1rem",
  }}
>
  The new-age finance app for your digital-first life.
</p>

<h1
  style={{
    fontFamily: "EB Garamond",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "clamp(72px, 9.08vw, 130.81px)", // 130.81/1440 = 9.08%
    lineHeight: "1.4", // Increased from 1.2 to 1.4 for more vertical space
    letterSpacing: "0%",
    textAlign: "center",
    width: "100%",
    // Removed height constraint to prevent text cropping
            backgroundImage: "linear-gradient(178deg, #999999 32.7%, #161616 70.89%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  }}
>
  Do Money, Differently.
</h1>



      </div>

      {/* Placeholder container (final position) */}
<div className="relative z-10 w-full px-4" style={{ marginTop: "-0.2cm" }}>
  <div
    ref={placeholderRef}
    className="shadow-lg mx-auto video-placeholder-locked"
    style={{
      // Responsive size in normal flow
      width: "clamp(320px, 80vw, 1088px)",
      aspectRatio: "1088 / 612",
      borderRadius: "20.22%", // ≈ 220 / 1088
      overflow: "hidden",
      background: "transparent",
      position: "relative",
    }}
  />
</div>

{/* Floating fullscreen wrapper (GSAP animates this into placeholder) */}
<div
  ref={wrapperRef}
  className="w-full opacity-0"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    borderRadius: 0,
    background: "transparent",
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
    className="w-full h-full object-cover object-center pointer-events-none video-blend"
    style={{
      objectPosition: 'center center',
      filter: 'brightness(1.1) contrast(1.05) saturate(1.1)',
    }}
    onEnded={() => videoRef.current.pause()}
  />
  
  {/* Fullscreen spotlight - only visible when video is fullscreen */}
  <div
    id="fullscreen-spotlight"
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)",
      borderRadius: "inherit",
      zIndex: 2,
      opacity: 0,
      transition: "opacity 0.3s ease-out",
    }}
  />
  
  {/* Primary smudged radial ellipse overlay */}
  <div
    id="dynamic-overlay"
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 12%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0) 38%), radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.10) 58%, rgba(0,0,0,0.28) 70%, rgba(0,0,0,0.45) 82%, rgba(0,0,0,0.60) 100%)",
      borderRadius: "inherit",
      mixBlendMode: "multiply",
      zIndex: 1,
      transition: "background 0.1s ease-out",
      filter: "blur(2px)",
      opacity: 0,
    }}
  />
  
        {/* Remove other spotlight overlays to keep only the main ellipse */}
</div>

      {/* Scroll Down Button - appears after video scales */}
      <div
        id="scroll-down-btn"
        className="absolute pointer-events-auto"
        style={{
          width: '178px',
          height: '70px',
          left: 'calc(50% - 178px/2)',
          bottom: '52px',
          zIndex: 100,
          opacity: 0,
          transform: 'translateY(20px)',
        }}
      >
        <button
          className="w-full h-full flex items-center justify-center gap-[10px] px-8 py-6 rounded-[220px] hover:bg-white/0.08 transition-all duration-300 group"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            fontFamily: 'GeneralSans, sans-serif',
          }}
          onClick={() => {
            // Scroll to next section
            const nextSection = document.querySelector('[data-section="next"]') || 
                               document.getElementById('about') ||
                               document.querySelector('main > div:nth-child(2)');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <span 
            className="text-white font-medium text-lg tracking-wide"
            style={{ fontFamily: 'GeneralSans, sans-serif' }}
          >
            Scroll Down
          </span>
          <svg 
            className="w-5 h-5 text-white transform group-hover:translate-y-1 transition-transform duration-300" 
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
      )}
    </>
  );
};

export default Hero;