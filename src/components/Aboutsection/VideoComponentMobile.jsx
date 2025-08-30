import React, { useRef, useEffect, useState } from "react";

const VideoComponentMobile = ({ slide = false }) => {
  const mainContainerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0 });
  const originalBodyOverflowRef = useRef('');
  const originalBodyTouchActionRef = useRef('');
  const originalHtmlOverscrollRef = useRef('');

  // Get phone screen dimensions
  useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenDimensions({
        width: window.screen.width,
        height: window.screen.height
      });
    };

    updateScreenDimensions();
    window.addEventListener('resize', updateScreenDimensions);
    window.addEventListener('orientationchange', updateScreenDimensions);
    
    return () => {
      window.removeEventListener('resize', updateScreenDimensions);
      window.removeEventListener('orientationchange', updateScreenDimensions);
    };
  }, []);

  // Handle scroll-based video expansion
  useEffect(() => {
    let timeoutId;
    
    const handleScroll = () => {
      // Don't handle scroll if touch animation is active
      if (isAnimating || isExpanded) return;
      
      // Debounce scroll events
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollY = window.scrollY;
        const threshold = 100; // Start expansion after 100px scroll
        
        if (scrollY > threshold && !isScrolled) {
          setIsScrolled(true);
        } else if (scrollY <= threshold && isScrolled) {
          setIsScrolled(false);
        }
      }, 50); // 50ms debounce
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled, isAnimating, isExpanded]);

  // Handle touch-based expansion in slide mode
  useEffect(() => {
    if (!slide) return;

    const addOpts = { passive: false, capture: true };

    const handleTouch = (e) => {
      // Only trigger if not already animating/expanded
      if (isAnimating || isExpanded) return;
      
      // Check if scrolling is in progress
      if (document.documentElement.style.overflow === 'hidden') {
        return; // Don't interfere with ongoing scroll operations
      }
      
      // Only prevent default if the event is cancelable
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopPropagation();
      
      // Mark animation as starting
      setIsAnimating(true);
      
      // Mark global handoff so SlideContainer ignores touch during expansion
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

      document.addEventListener('touchmove', prevent, addOpts);
      document.addEventListener('touchstart', prevent, addOpts);
      document.addEventListener('touchend', prevent, addOpts);
      document.addEventListener('scroll', prevent, addOpts);
      document.addEventListener('keydown', prevent, addOpts);

      // Start the synchronized animation
      setTimeout(() => {
        setIsExpanded(true);
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
        document.removeEventListener('touchmove', prevent, addOpts);
        document.removeEventListener('touchstart', prevent, addOpts);
        document.removeEventListener('touchend', prevent, addOpts);
        document.removeEventListener('scroll', prevent, addOpts);
        document.removeEventListener('keydown', prevent, addOpts);
        
        try {
          document.body.style.overflow = originalBodyOverflowRef.current || '';
          document.body.style.touchAction = originalBodyTouchActionRef.current || '';
          document.documentElement.style.overscrollBehavior = originalHtmlOverscrollRef.current || '';
        } catch {}
        setIsAnimating(false);
      }, 3000);
    };

    // Add touch listener
    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouch, addOpts);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouch, addOpts);
      }
      // Clean up global handoff
      if (typeof window !== 'undefined') {
        window.__videoHandoffActive = false;
      }
    };
  }, [slide, isAnimating, isExpanded]);

  // Synchronized animation styles for mobile
  const containerStyle = {
    transition: isExpanded ? 'all 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
    transform: isExpanded ? 'scale(1)' : 'scale(1)',
  };

  const videoContainerStyle = {
    transition: isExpanded
      ? 'all 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
    width: isExpanded ? '100vw' : '100%',
    height: isExpanded ? '100vh' : 'auto',
    maxHeight: isExpanded ? '100vh' : '250px',
    borderRadius: isExpanded ? '0px' : '16px',
    transition: isExpanded
      ? 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'all 0.3s ease',
    objectFit: isExpanded ? 'cover' : 'contain',
    display: 'block',
    margin: '0 auto',
    boxShadow: isExpanded ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.12)',
    cursor: 'pointer'
  };

  const textContainerStyle = {
    transform: isExpanded ? 'translateY(100vh)' : 'translateY(0)',
    opacity: isExpanded ? 0 : 1,
    transition: isExpanded 
      ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s, opacity 0.4s ease 0.2s'
      : 'transform 0.3s ease, opacity 0.3s ease',
    pointerEvents: isExpanded ? 'none' : 'auto',
  };

  const layoutStyle = {
    flexDirection: isExpanded ? 'column' : 'column',
    gap: isExpanded ? '0rem' : '2rem',
    transition: isExpanded 
      ? 'gap 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
      : 'none',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

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
        overscrollBehaviorY: slide ? 'none' : undefined,
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          perspective: '1000px'
        }}>
          {/* Header Section - Centered */}
          <div style={{
            textAlign: 'center',
            paddingTop: '0',
            paddingBottom: '0',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: isScrolled ? 'fixed' : 'relative',
            top: isScrolled ? '0' : 'auto',
            left: isScrolled ? '0' : 'auto',
            zIndex: isScrolled ? 1001 : 'auto',
            background: isScrolled ? 'white' : 'transparent',
            paddingTop: isScrolled ? '1rem' : '0',
            paddingBottom: isScrolled ? '1rem' : '0',
            width: isScrolled ? `${screenDimensions.width}px` : '100%'
          }}>
            {/* Interactive Video Card - Centered */}
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              borderRadius: isScrolled ? '0' : 'clamp(12px, 3vw, 20px)',
              width: isScrolled ? '100vw' : 'clamp(280px, 85vw, 400px)',
              height: isScrolled ? '100vh' : 'clamp(10rem, 25vh, 15rem)',
              marginTop: isScrolled ? '0' : '-5rem',
              marginBottom: '0',
              overflow: 'hidden',
              position: isScrolled ? 'fixed' : 'relative',
              top: isScrolled ? '0' : 'auto',
              left: isScrolled ? '0' : 'auto',
              zIndex: isScrolled ? 1000 : 'auto',
              boxShadow: isScrolled ? 'none' : '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transform: isScrolled ? 'rotateX(0deg) rotateY(0deg) scale(1)' : 'rotateX(5deg) rotateY(-2deg) scale(0.98)',
              transformOrigin: 'center center',
              animation: isScrolled ? 'horizontalVideoPlay 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
              transition: isScrolled ? 'none' : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              backfaceVisibility: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Video/Image */}
              <img
                ref={videoRef}
                src="/video_com.png"
                alt="Video Preview"
                style={{
                  ...videoStyle,
                  width: '100%',
                  height: '100%',
                  objectFit: isScrolled ? 'contain' : 'cover',
                  borderRadius: isScrolled ? '0' : '1rem',
                  transform: isScrolled ? 'scale(1) rotate(0deg)' : 'scale(1)',
                  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  maxWidth: isScrolled ? '100vw' : '100%',
                  maxHeight: isScrolled ? '100vh' : '100%'
                }}
              />
              
              {/* Touch hint overlay */}
              {!isScrolled && !isExpanded && !isAnimating && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg style={{ width: '2rem', height: '2rem' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                                      <p style={{
                    fontSize: '0.875rem',
                    opacity: 0.9
                  }}>
                    {isScrolled ? 'Scroll to collapse' : 'Scroll to expand to full screen'}
                  </p>
                  </div>
                </div>
              )}
              
              {/* Horizontal Video Player Overlay - Only visible when expanded */}
              {isScrolled && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001
                }}>
                  <div style={{
                    textAlign: 'center',
                    color: 'white',
                    padding: '2rem'
                  }}>
                    <div style={{
                      width: '6rem',
                      height: '6rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                      backdropFilter: 'blur(8px)',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      <svg style={{ width: '3rem', height: '3rem' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '600'
                    }}>
                      Video Playing
                    </h3>
                    <p style={{
                      fontSize: '1rem',
                      opacity: 0.8,
                      marginBottom: '1rem'
                    }}>
                      Horizontal full-screen mode
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '1rem',
                      justifyContent: 'center'
                    }}>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Pause
                      </button>
                      <button style={{
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '0.5rem',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        Full Screen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Content Section - Responsive margins */}
          <div style={{
            paddingLeft: 'clamp(1rem, 4vw, 1.5rem)',
            paddingRight: 'clamp(1rem, 4vw, 1.5rem)',
            paddingTop: '0',
            marginTop: isScrolled ? '1rem' : '-3rem',
            width: 'clamp(280px, 85vw, 400px)',
            margin: '0 auto',
            opacity: isScrolled ? 0 : 1,
            transform: isScrolled ? 'translateY(20px)' : 'translateY(0)',
            transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pointerEvents: isScrolled ? 'none' : 'auto'
          }}>
            {/* Text Container */}
            <div 
              className="text-container"
              style={{
                ...textContainerStyle,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '0.5rem',
                padding: '0',
                height: 'auto',
                textAlign: 'left',
                width: '100%',
                maxWidth: '100%'
              }}
            >
              <p
                className="font-normal mb-2 flex items-center gap-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(12px, 3.5vw, 16px)",
                  color: "#092646",
                  fontWeight: 400,
                  fontStyle: "normal",
                  lineHeight: "1.2",
                  letterSpacing: "-0.15px",
                  margin: 0,
                  padding: 0,
                  width: 'auto',
                  height: 'auto'
                }}
              >
                <img src="/SVG.svg" alt="Icon" className="w-4 h-4" />
                Know our story
              </p>
              
              <h1 style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(28px, 8vw, 44px)',
                fontWeight: '700',
                fontStyle: 'normal',
                color: '#1966BB',
                lineHeight: '1.2',
                letterSpacing: '-0.15px',
                margin: '0.5rem 0',
                padding: 0,
                width: 'auto',
                height: 'auto'
              }}>
                The Video
              </h1>
              
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(14px, 4vw, 18px)',
                color: '#909090',
                lineHeight: '1.5',
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '0px',
                margin: 0,
                padding: 0,
                width: 'auto',
                height: 'auto'
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

      {/* CSS for animations and text container positioning */}
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
          
          @keyframes videoTilt {
            0% { 
              transform: rotateX(5deg) rotateY(-2deg) scale(0.98);
            }
            50% { 
              transform: rotateX(2deg) rotateY(-1deg) scale(0.99);
            }
            100% { 
              transform: rotateX(0deg) rotateY(0deg) scale(1);
            }
          }
          
          @keyframes youtubeExpand {
            0% {
              transform: rotateX(5deg) rotateY(-2deg) scale(0.98);
              border-radius: 16px;
              box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            25% {
              transform: rotateX(2deg) rotateY(-1deg) scale(1.02);
              border-radius: 12px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            }
            50% {
              transform: rotateX(1deg) rotateY(-0.5deg) scale(1.05);
              border-radius: 8px;
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            75% {
              transform: rotateX(0.5deg) rotateY(-0.25deg) scale(1.08);
              border-radius: 4px;
              box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
            }
            100% {
              transform: rotateX(0deg) rotateY(0deg) scale(1);
              border-radius: 0px;
              box-shadow: none;
            }
          }
          
          @keyframes horizontalVideoPlay {
            0% {
              transform: scale(0.98) rotateX(5deg) rotateY(-2deg);
              width: 85vw;
              height: 25vh;
            }
            25% {
              transform: scale(1.02) rotateX(2deg) rotateY(-1deg);
              width: 90vw;
              height: 30vh;
            }
            50% {
              transform: scale(1.05) rotateX(1deg) rotateY(-0.5deg);
              width: 95vw;
              height: 40vh;
            }
            75% {
              transform: scale(1.08) rotateX(0.5deg) rotateY(-0.25deg);
              width: 98vw;
              height: 60vh;
            }
            100% {
              transform: scale(1) rotateX(0deg) rotateY(0deg);
              width: 100vw;
              height: 100vh;
            }
          }
          
          .text-container {
            margin-left: 0 !important;
            padding-left: 0 !important;
            left: 0 !important;
            position: relative !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          
          /* Force no gap between video and text */
          .text-container {
            transform: translateY(clamp(-1.5rem, -4vw, -2.5rem)) !important;
            margin-top: clamp(-0.75rem, -2vw, -1.25rem) !important;
          }
        `}
      </style>
    </div>
  );
};

export default VideoComponentMobile;
