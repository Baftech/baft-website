import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";

const Hero = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationCompletedRef = useRef(false);

  useEffect(() => {
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

      gsap.set("#grid_container", { opacity: 1 });
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
        duration: 1.4, 
        delay: 0.6,
        onComplete: () => {
          // Start video playback when it becomes visible
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        }
      })
        .addLabel("shrink", "+=6.5")
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
            duration: 2.5,
            ease: "power2.inOut",
            transformOrigin: "center center",
            onUpdate: () => {
              // Make border areas transparent during scaling
              if (wrapperRef.current) {
                const currentScale = gsap.getProperty(wrapperRef.current, "scale") || 1;
                const targetScale = targetWidth() / window.innerWidth;
                const progress = Math.min(1, (1 - currentScale) / (1 - targetScale));
                
                // Update overlay gradient based on scaling progress
                const overlay = document.getElementById('dynamic-overlay');
                if (overlay) {
                  // Calculate dynamic gradient values for smudged effect with transparent left/right corners
                  const centerTransparency = Math.max(0, 40 - (progress * 20));
                  const edgeStart = Math.max(centerTransparency + 10, 50);
                  const edgeMid = Math.max(edgeStart + 15, 65);
                  const edgeEnd = Math.max(edgeMid + 20, 85);
                  
                  // Create gradient that makes left and right corners transparent during scaling
                  const leftRightTransparency = Math.max(0, 0.8 - (progress * 0.8)); // Left/right corners become transparent
                  const dynamicGradient = `radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) ${centerTransparency}%, rgba(0, 0, 0, ${0.05 + progress * 0.15}) ${edgeStart}%, rgba(0, 0, 0, ${0.2 + progress * 0.3}) ${edgeMid}%, rgba(0, 0, 0, ${leftRightTransparency}) ${edgeEnd}%, rgba(0, 0, 0, ${leftRightTransparency * 0.5}) 95%, transparent 100%)`;
                  
                  overlay.style.background = dynamicGradient;
                  
                  // Also update corner overlay to make left/right corners transparent during scaling
                  const cornerOverlay = document.getElementById('corner-overlay');
                  if (cornerOverlay) {
                    const cornerOpacity = Math.max(0, 0.8 - (progress * 0.8));
                    cornerOverlay.style.opacity = cornerOpacity;
                    
                    // Create dynamic corner transparency that works better with rounded borders
                    const leftCornerOpacity = Math.max(0, 0.4 - (progress * 0.4));
                    const rightCornerOpacity = Math.max(0, 0.4 - (progress * 0.4));
                    
                    // Update the gradient to make corners more transparent during scaling
                    const dynamicCornerGradient = `radial-gradient(ellipse at 20% 50%, rgba(0, 0, 0, ${leftCornerOpacity}) 0%, rgba(0, 0, 0, ${leftCornerOpacity * 0.5}) 30%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0, 0, 0, ${rightCornerOpacity}) 0%, rgba(0, 0, 0, ${rightCornerOpacity * 0.5}) 30%, transparent 60%)`;
                    
                    cornerOverlay.style.background = dynamicCornerGradient;
                  }
                }
              }
            },
            onComplete: () => {
              animationCompletedRef.current = true;
              // Lock the wrapper position after animation
              if (wrapperRef.current) {
                wrapperRef.current.classList.add('video-container-locked');
              }
            },
          },
          "shrink"
        )
        .to(
          "#text",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 3.2,
            ease: "sine.out",
          },
          "shrink"
        );
    };

    rafId = requestAnimationFrame(start);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Keep wrapper aligned to placeholder on viewport resize after animation completes
  useEffect(() => {
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

    // Constrain scroll to prevent going beyond video end
    const constrainScroll = (e) => {
      if (!animationCompletedRef.current || !placeholderRef.current) return;
      
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
        
        // Smooth scroll back to the boundary
        window.scrollTo({
          top: maxScrollTop,
          behavior: 'smooth'
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
        
        window.scrollTo({
          top: minScrollTop,
          behavior: 'smooth'
        });
        return false;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", lockVideoPosition);
    window.addEventListener("scroll", constrainScroll, { passive: false });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", lockVideoPosition);
      window.removeEventListener("scroll", constrainScroll);
    };
  }, []);

  return (
    <>
      <style>
        {`
          #hero::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          #hero::-webkit-scrollbar-track {
            background: transparent;
          }
          #hero::-webkit-scrollbar-thumb {
            background: transparent;
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
          
          /* Enhanced scroll behavior for video section */
          .video-scroll-boundary::-webkit-scrollbar {
            width: 8px;
          }
          
          .video-scroll-boundary::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.1);
            border-radius: 4px;
          }
          
          .video-scroll-boundary::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
          }
          
          .video-scroll-boundary::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
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
          
          /* Enhanced smudged overlay effects */
          .video-blend > div[style*="radial-gradient"] {
            backdrop-filter: blur(1px);
            transform: translateZ(0);
          }
          
          /* Create additional smudging effect */
          .video-blend::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(ellipse at center, transparent 25%, rgba(0, 0, 0, 0.02) 40%, rgba(0, 0, 0, 0.08) 55%, transparent 75%);
            border-radius: inherit;
            filter: blur(4px);
            mix-blend-mode: soft-light;
            z-index: 4;
            pointer-events: none;
          }
          
          /* Corner transparency overlay */
          #corner-overlay {
            transition: opacity 0.2s ease-out, background 0.2s ease-out;
            will-change: opacity, background;
            border-radius: inherit;
            overflow: hidden;
          }
          
          /* Enhanced corner transparency for rounded borders */
          #corner-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(ellipse at 15% 50%, rgba(0, 0, 0, 0.2) 0%, transparent 40%), radial-gradient(ellipse at 85% 50%, rgba(0, 0, 0, 0.2) 0%, transparent 40%);
            border-radius: inherit;
            pointer-events: none;
            z-index: 1;
            filter: blur(2px);
          }
          
          /* Additional corner fade for rounded borders */
          .video-blend::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(ellipse at 10% 50%, rgba(0, 0, 0, 0.15) 0%, transparent 35%), radial-gradient(ellipse at 90% 50%, rgba(0, 0, 0, 0.15) 0%, transparent 35%);
            border-radius: inherit;
            pointer-events: none;
            z-index: 2;
            filter: blur(1px);
            mix-blend-mode: soft-light;
          }
        `}
      </style>
      <div id="hero" className="relative w-full min-h-screen bg-black flex flex-col items-center overflow-y-auto scroll-constrained video-scroll-boundary" style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
      {/* Grid overlay */}
      <div id="grid_container" className="absolute inset-0 z-0">
        <GridBackground />
      </div>

      {/* Text appears later */}
      <div id="text" className="relative z-[70] text-center px-4 mt-40 opacity-0">
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
    backgroundImage: "linear-gradient(180deg, #ffffff 0%, #cccccc 15%, #161616 100%)",
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
<div className="relative z-10 w-full px-4" style={{ marginTop: "0.7cm" }}>
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
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.6) 75%, #000000 100%)",
    zIndex: 50,
  }}
>

  <video
    ref={videoRef}
    src="/BAFT Vid 2_1.mp4"
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
  
  {/* Primary smudged radial ellipse overlay */}
  <div
    id="dynamic-overlay"
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.6) 75%, rgba(0, 0, 0, 0.8) 85%, #000000 100%)",
      borderRadius: "inherit",
      mixBlendMode: "multiply",
      zIndex: 1,
      transition: "background 0.1s ease-out",
      filter: "blur(2px)",
    }}
  />
  
  {/* Secondary smudged overlay for enhanced blending */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.05) 45%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0.4) 80%, transparent 100%)",
      borderRadius: "inherit",
      mixBlendMode: "overlay",
      zIndex: 2,
      filter: "blur(3px)",
      opacity: 0.7,
    }}
  />
  
  {/* Enhanced left and right corner transparency overlay for rounded corners */}
  <div
    id="corner-overlay"
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(ellipse at 20% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 30%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 30%, transparent 60%)",
      borderRadius: "inherit",
      mixBlendMode: "multiply",
      zIndex: 3,
      filter: "blur(3px)",
      opacity: 0.8,
    }}
  />
</div>

    </div>
    </>
  );
};

export default Hero;