import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Fast = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
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
    
    // Set initial heading state for animation but ensure visibility
    gsap.set(contentRef.current, { opacity: 1, y: 0 }); // Heading starts visible and in position
    
    // Always start with overlay hidden, we'll show it conditionally
    gsap.set(overlayRef.current, { opacity: 0 });
    
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
              // Coming from bottom → run page reveal
              gsap.set(overlayRef.current, { opacity: 1 });
              
              tl.to(overlayRef.current, {
                opacity: 0,
                duration: 2.5,
                ease: "power2.out"
              })
              .to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 4.0,
                ease: "power1.inOut"
              }, "+=2.0");
            } else {
              // Normal scroll from top → just animate heading
              tl.to(contentRef.current, {
                opacity: 1,
                y: 0,
                duration: 4.0,
                ease: "power1.inOut",
                delay: 1.5
              });
            }
            
            lastScrollY = currentScrollY; // ✅ update scroll position
          } else {
            // Keep content visible when leaving
            gsap.set(contentRef.current, { opacity: 1, y: 0 });
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
      gsap.killTweensOf([contentRef.current, overlayRef.current]);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#ffffff' }} data-theme="light">
      {/* Reveal Overlay - starts covering everything, then fades out */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 z-50 pointer-events-none"
        style={{ backgroundColor: '#ffffff' }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start" style={{ backgroundColor: '#ffffff', textAlign: 'center' }}>
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
            opacity: 1, // Ensure content is visible by default
            transform: 'translateY(0px)', // Ensure content is in position by default
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
            width: 'clamp(280px, 90vw, 1600px)', // Responsive width for all small screens
            height: 'clamp(80px, 15vh, 200px)', // Responsive height for all small screens
            transform: 'rotate(0deg)',
            opacity: 1,
            background: 'linear-gradient(161.3deg, #9AB5D2 33.59%, #092646 77.13%)',
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
              transform: 'rotate(0deg)',
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
            transform: 'translateX(-50%)'
            }}
          >
            One Tap. Zero Wait.
          </p>
        </div>



                {/* Video Section */}
        <div className="relative w-full mx-auto" style={{ 
          backgroundColor: 'transparent',
          position: 'relative',
          flex: '1 1 auto', // Allow growing and shrinking, but maintain aspect ratio
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'clamp(500px, 70vh, 1000px)', // Much bigger video: 500px minimum, scales to 1000px
          maxHeight: 'clamp(700px, 90vh, 1200px)', // Much bigger video: 700px minimum, scales to 1200px
          marginTop: 'clamp(60px, 6vh, 100px)' // Move video a bit higher - reduced from 80px to 60px
        }}>
          {/* Responsive positioning container */}
          <div className="relative w-full h-full flex items-center justify-center" style={{ 
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none'
          }}>
            {/* Subtle glow behind video - blends with background */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'transparent', // Remove glow for seamless blend
                zIndex: 1
              }}
            />
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
                src="/bfast_video.mp4"
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
                  opacity: 1,
                  // Responsive positioning
                  position: 'relative',
                  // Remove margin and left positioning
                  margin: '0',
                  left: 'auto',
                  // Darken blend mode for visual effect
                  mixBlendMode: 'darken',
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
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can start playing')}
                onEnded={() => console.log('Video playback ended')}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default B_Fast;
