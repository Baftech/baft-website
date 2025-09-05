import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import B_Fast_Mobile from "./B_Fast_Mobile.jsx";
import { BFAST_VIDEO_MP4 } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

// Desktop implementation extracted to keep hooks order safe when switching to mobile
const B_Fast_Desktop = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const overlayRef = useRef(null); // kept for ref safety, but overlay is not rendered/used
  const starsGroup2Ref = useRef(null);
  const starsGroup1Ref = useRef(null);
  const orbitingStarsRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const [videoSize, setVideoSize] = useState({ width: '100%', height: '100%' });
  const [optimalSpacing, setOptimalSpacing] = useState('2cm');
  const [navbarSafeSpacing, setNavbarSafeSpacing] = useState('80px');

  // Dynamic video sizing and spacing calculation
  useEffect(() => {
    const calculateVideoSizeAndSpacing = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // X-5 margin (5px on each side)
      const availableWidth = screenWidth - 10;
      // Y-2 margin (2px on each side)  
      const availableHeight = screenHeight - 4;
      
      // Calculate optimal dimensions maintaining 16:9 aspect ratio
      const aspectRatio = 16 / 9;
      
      let videoWidth, videoHeight;
      
      if (availableWidth / availableHeight > aspectRatio) {
        // Height is the limiting factor
        videoHeight = availableHeight;
        videoWidth = availableHeight * aspectRatio;
      } else {
        // Width is the limiting factor
        videoWidth = availableWidth;
        videoHeight = availableWidth / aspectRatio;
      }
      
      setVideoSize({
        width: `${videoWidth}px`,
        height: `${videoHeight}px`
      });
      
      // Calculate optimal spacing to keep content in viewport
      const navbarHeight = 80; // Estimated navbar height
      const textHeight = 200; // Estimated text content height
      const videoHeightPx = videoHeight;
      
      // Calculate available space for spacing
      const totalContentHeight = navbarHeight + textHeight + videoHeightPx;
      const availableSpaceForSpacing = screenHeight - totalContentHeight;
      
      // Convert to cm (1cm ≈ 37.8px)
      const availableSpaceCm = availableSpaceForSpacing / 37.8;
      
      // Find optimal spacing that's a multiple of 0.2 (decimal multiples of 2)
      let optimalSpacingCm = 2.0; // Start with 2cm
      
      if (availableSpaceCm < 2.0) {
        // Calculate decimal multiples of 2 that fit
        for (let i = 1.8; i >= 0.2; i -= 0.2) {
          if (i <= availableSpaceCm) {
            optimalSpacingCm = i;
            break;
          }
        }
      }
      
      setOptimalSpacing(`${optimalSpacingCm}cm`);
      
      // Calculate safe spacing from navbar to prevent cutoff
      const estimatedNavbarHeight = 80; // Base navbar height
      const currentScreenHeight = window.innerHeight;
      const safeSpacing = Math.max(estimatedNavbarHeight + 20, currentScreenHeight * 0.08); // At least 8% of screen height
      setNavbarSafeSpacing(`${safeSpacing}px`);
    };
    
    // Calculate initial size and spacing
    calculateVideoSizeAndSpacing();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateVideoSizeAndSpacing);
    
    return () => window.removeEventListener('resize', calculateVideoSizeAndSpacing);
  }, []);

  useGSAP(() => {
    // Check if refs exist before animating
    if (!contentRef.current || !videoRef.current || !sectionRef.current || !overlayRef.current) return;
    
    // Set initial heading state - start hidden and above position
    gsap.set(contentRef.current, { opacity: 0, y: -80 }); // Heading starts hidden and above position
    
    // Remove overlay usage to preserve raw video quality
    if (overlayRef.current) gsap.set(overlayRef.current, { opacity: 0 });
    if (starsGroup2Ref.current) gsap.set(starsGroup2Ref.current, { opacity: 0 });
    if (starsGroup1Ref.current) gsap.set(starsGroup1Ref.current, { opacity: 0 });
    if (orbitingStarsRef.current) gsap.set(orbitingStarsRef.current, { opacity: 0 });
    
    // Track scroll direction to determine if coming from bottom
    let lastScrollY = window.scrollY;
    let isFromBottom = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Detect scroll direction
            const currentScrollY = window.scrollY;
            isFromBottom = currentScrollY < lastScrollY; // scrolling up
            
            // Reset heading for animation but ensure it becomes visible
            gsap.set(contentRef.current, { opacity: 0, y: -80 });
            
            const tl = gsap.timeline();
            
            if (isFromBottom) {
              // Coming from bottom → show content without overlay
              tl.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power1.inOut"
              })
              .to([starsGroup2Ref.current, starsGroup1Ref.current, orbitingStarsRef.current].filter(Boolean), {
                opacity: 1,
                duration: 2.0,
                ease: "power1.out"
              }, "<");
            } else {
              // Normal scroll from top → just animate heading
              tl.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power1.inOut",
                delay: 1.5
              })
              .to([starsGroup2Ref.current, starsGroup1Ref.current, orbitingStarsRef.current].filter(Boolean), {
                opacity: 1,
                duration: 2.0,
                ease: "power1.out"
              }, "<");
            }
            
            lastScrollY = currentScrollY; // ✅ update scroll position
          } else {
            // Don't reset content when leaving - let the animation handle it
            lastScrollY = window.scrollY;
          }
        });
      },
      {
        threshold: 0.3, // Trigger when 30% of section is visible
        rootMargin: "0px 0px -20% 0px"
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    // Cleanup function
    return () => {
      observer.disconnect();
      gsap.killTweensOf([contentRef.current, overlayRef.current, starsGroup2Ref.current, starsGroup1Ref.current, orbitingStarsRef.current]);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#ffffff' }} data-theme="light">
      {/* Overlay removed to preserve original video quality */}
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start" style={{ backgroundColor: '#ffffff', textAlign: 'center', marginTop: 'clamp(20px, 6vh, 160px)' }}>
        {/* Text Content */}
        <div
          ref={contentRef}
          className="text-center max-w-6xl mx-auto"
          style={{ 
            marginTop: navbarSafeSpacing, // Dynamic spacing to prevent navbar cutoff
            marginBottom: '0cm', // No margin below text
            paddingTop: 'clamp(20px, 2vh, 40px)', // Additional responsive padding
            width: 'clamp(280px, 90vw, 1600px)', // Responsive width for all small screens
            height: 'clamp(100px, 15vh, 200px)', // Responsive height for all small screens
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5cm', // Consistent gap between h1 and p
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <h1 
            className="mb-4 leading-tight"
            style={{ 
              fontFamily: 'EB Garamond, serif',
              fontWeight: 700,
              fontStyle: 'bold',
              fontSize: 'clamp(80px, 8vw, 130.81px)', // Bold and 130.81px responsively
              lineHeight: '100%',
              letterSpacing: '0%',
                          textAlign: 'center',
            width: 'clamp(280px, 100vw, 1600px)', // Responsive width for all small screens
            height: 'clamp(80px, 15vh, 200px)', // Responsive height for all small screens
            backgroundImage: 'linear-gradient(180deg, #B8C9E0 33.59%, #0A2A4A 77.13%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: 'none',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%) rotate(0deg)'
            }}
          >
            B-Fast
          </h1>

          <p 
            className="leading-relaxed"
            style={{ 
              width: 'clamp(280px, 90vw, 1600px)', // Responsive width for all small screens
              height: 'clamp(25px, 3vh, 50px)', // Responsive height for all small screens
              opacity: 1,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontStyle: 'normal',
              fontSize: 'clamp(16px, 2vw, 28px)', // Responsive scaling for small screens
              lineHeight: '100%',
              letterSpacing: '0%',
                          textAlign: 'center',
            color: '#777575',
            marginTop: 'clamp(16px, 2vh, 32px)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50%)',
            }}
          >
            One Tap. Zero Wait.
          </p>
        </div>



                {/* Video Section */}
        <div className="relative w-full mx-auto mac-margin mac-gap" style={{ 
          backgroundColor: 'transparent',
          position: 'relative',
          flex: '1 1 auto', // Allow growing and shrinking, but maintain aspect ratio
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'clamp(380px, 65vh, 1100px)', // Larger baseline height for bigger video
          maxHeight: 'clamp(760px, 90vh, 1300px)', // Allow up to 90vh for larger render
          marginTop: 'clamp(130px, 12vh, 240px)', // Increased gap under heading
          marginLeft: 'clamp(5px, 0.5vw, 5px)', // X-5 margin for bigger screens
          marginRight: 'clamp(5px, 0.5vw, 5px)' // X-5 margin for bigger screens
        }}>
          {/* Removed centered glow overlay for cleaner video */}
          {/* Responsive positioning container */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ 
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none'
          }}>
            {/* Removed additional glow layers */}
                      {videoError ? (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative z-10 shadow-lg">
                <div className="text-center text-gray-500">
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🎥</div>
                  <p className="text-sm sm:text-base">Video unavailable</p>
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={BFAST_VIDEO_MP4}
                className="object-contain relative z-10"
                style={{ 
                  // Dynamic scaling using calculated dimensions with fallback
                  width: videoSize.width || 'clamp(600px, 90vw, 1400px)',
                  height: videoSize.height || 'clamp(338px, 54vw, 788px)',
                  objectFit: 'contain',
                  objectPosition: 'center center',
                  // Remove conflicting transforms and positioning
                  transform: 'none',
                  // Visible opacity
                  opacity: 0.98,
                  // Responsive positioning
                  position: 'relative',
                  // Remove margin and left positioning
                  margin: '0',
                  left: 'auto',
                  // Blend into background for animation-like feel
                  mixBlendMode: 'normal',
                  // Subtle visual tuning
                  
                  // removed Feather edges to merge with background
                  
                  // Non-interactive feel
                  pointerEvents: 'none',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  // Ensure video fits in container
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                autoPlay
                muted
                playsInline
                controls={false}
                disablePictureInPicture
                preload="auto"
                onError={() => setVideoError(true)}
                onLoadStart={() => {}}
                onCanPlay={() => {}}
                onEnded={() => {}}
              />
            )}
          </div>
        </div>

        {/* Removed global glow overlay */}

        {/* Group 2 - Stars Overlay - Spread across entire screen */}
        <div ref={starsGroup2Ref} style={{
          position: 'absolute',
          width: '100vw', // Full viewport width
          height: '100vh', // Full viewport height
          left: '0px',
          top: '0px',
          transform: 'rotate(45deg)',
          opacity: 1, // 100% opacity
          zIndex: 21, // Above glow and video
          pointerEvents: 'none'
        }}>
          {/* Star 1 - Four-pointed star */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '15%',
            top: '20%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinDriftA 18s linear infinite, twinkle 3.8s ease-in-out infinite'
          }} />
          {/* Star 2 - Four-pointed star */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '65%',
            top: '15%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinDriftB 22s linear infinite, twinkle 4.6s ease-in-out infinite'
          }} />
          {/* Star 3 - Four-pointed star */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '35%',
            top: '60%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinDriftC 20s linear infinite, twinkle 4.2s ease-in-out infinite'
          }} />
          {/* Star 4 - Four-pointed star */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '85%',
            top: '70%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinDriftB 24s linear infinite, twinkle 5s ease-in-out infinite'
          }} />
          {/* Star 5 - Additional star for better spread */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '80%',
            top: '85%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinStar 10s linear infinite'
          }} />
          {/* Star 6 - Additional star for better spread */}
          <div style={{
            position: 'absolute',
            width: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            height: 'clamp(8px, 0.5vw, 16px)', // Much smaller: 8px minimum, scales with viewport
            left: '5%',
            top: '45%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.8,
            animation: 'spinStar 10s linear infinite'
          }} />
        </div>

        {/* Extra Global Stars Overlay (Group 1 - smaller) */}
        <div ref={starsGroup1Ref} style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          left: '0px',
          top: '0px',
          opacity: 1,
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          {/* 4 smaller stars, ~32% of local star container size */}
          <div style={{
            position: 'absolute',
            width: 'clamp(6px, 0.35vw, 12px)',
            height: 'clamp(6px, 0.35vw, 12px)',
            left: '12%',
            top: '18%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.85,
            animation: 'spinDriftA 26s linear infinite, twinkle 3.6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: 'clamp(6px, 0.35vw, 12px)',
            height: 'clamp(6px, 0.35vw, 12px)',
            left: '42%',
            top: '35%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.85,
            animation: 'spinDriftB 21s linear infinite, twinkle 4.3s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: 'clamp(6px, 0.35vw, 12px)',
            height: 'clamp(6px, 0.35vw, 12px)',
            left: '72%',
            top: '28%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.85,
            animation: 'spinDriftC 28s linear infinite, twinkle 5.1s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            width: 'clamp(6px, 0.35vw, 12px)',
            height: 'clamp(6px, 0.35vw, 12px)',
            left: '88%',
            top: '68%',
            background: '#222222',
            clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
            opacity: 0.85,
            animation: 'spinDriftA 24s linear infinite, twinkle 4.8s ease-in-out infinite'
          }} />
        </div>

        {/* Orbiting stars overlay - revolve around center */}
        <div ref={orbitingStarsRef} style={{ position: 'absolute', inset: 0, zIndex: 22, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
            {/* Ring 1 */}
            <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitSlow 24s linear infinite' }}>
              <div style={{ width: 'clamp(8px, 0.5vw, 16px)', height: 'clamp(8px, 0.5vw, 16px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'translateX(clamp(280px, 22vw, 420px))' }} />
              <div style={{ width: 'clamp(8px, 0.5vw, 16px)', height: 'clamp(8px, 0.5vw, 16px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'rotate(120deg) translateX(clamp(280px, 22vw, 420px))' }} />
              <div style={{ width: 'clamp(8px, 0.5vw, 16px)', height: 'clamp(8px, 0.5vw, 16px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'rotate(240deg) translateX(clamp(280px, 22vw, 420px))' }} />
            </div>
            {/* Ring 2 */}
            <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitMed 18s linear infinite reverse' }}>
              <div style={{ width: 'clamp(6px, 0.35vw, 12px)', height: 'clamp(6px, 0.35vw, 12px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'translateX(clamp(380px, 30vw, 580px))' }} />
              <div style={{ width: 'clamp(6px, 0.35vw, 12px)', height: 'clamp(6px, 0.35vw, 12px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(90deg) translateX(clamp(380px, 30vw, 580px))' }} />
              <div style={{ width: 'clamp(6px, 0.35vw, 12px)', height: 'clamp(6px, 0.35vw, 12px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(180deg) translateX(clamp(380px, 30vw, 580px))' }} />
              <div style={{ width: 'clamp(6px, 0.35vw, 12px)', height: 'clamp(6px, 0.35vw, 12px)', background: '#222', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(270deg) translateX(clamp(380px, 30vw, 580px))' }} />
            </div>
          </div>
        </div>
      </div>
      {/* Star animations */}
      <style>{`
        @keyframes spinStar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
        @keyframes spinDriftA {
          0% { transform: rotate(0deg) translate(0px, 0px); }
          50% { transform: rotate(180deg) translate(6px, -4px); }
          100% { transform: rotate(360deg) translate(0px, 0px); }
        }
        @keyframes spinDriftB {
          0% { transform: rotate(0deg) translate(0px, 0px); }
          50% { transform: rotate(180deg) translate(-5px, 6px); }
          100% { transform: rotate(360deg) translate(0px, 0px); }
        }
        @keyframes spinDriftC {
          0% { transform: rotate(0deg) translate(0px, 0px); }
          50% { transform: rotate(180deg) translate(4px, 5px); }
          100% { transform: rotate(360deg) translate(0px, 0px); }
        }
        @keyframes orbitSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbitMed { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        
        /* Mac-specific margin */
        @media screen and (-webkit-min-device-pixel-ratio: 2) and (min-resolution: 192dpi) {
          .mac-margin {
            margin-left: 5px !important;
            margin-right: 5px !important;
          }
          /* Smaller Mac displays: add extra gap between heading and video */
          @media (max-height: 900px) {
            .mac-gap { margin-top: clamp(160px, 14vh, 280px) !important; }
          }
        }
      `}</style>
    </section>
  );
};

// Wrapper decides whether to render mobile or desktop
const B_Fast = () => {
  const getIsMobile = () => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)').matches : false);
  const [isMobile, setIsMobile] = useState(getIsMobile);

  // Run before paint to avoid a single-frame desktop flash on mobile
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (isMobile) {
    return <B_Fast_Mobile />;
  }
  return <B_Fast_Desktop />;
};

export default B_Fast;