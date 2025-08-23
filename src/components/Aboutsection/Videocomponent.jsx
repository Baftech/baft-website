import React, { useRef, useEffect, useState } from "react";

const Videocomponent = ({ slide = false }) => {
  const mainContainerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle scroll-based expansion in slide mode
  useEffect(() => {
    if (!slide) return;

    const handleScroll = (e) => {
      // Only trigger if not already animating/expanded
      if (isAnimating || isExpanded) return;
      
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
      document.addEventListener('wheel', prevent, { passive: false });
      document.addEventListener('touchmove', prevent, { passive: false });
      document.addEventListener('keydown', prevent, { passive: false });

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
        document.removeEventListener('wheel', prevent);
        document.removeEventListener('touchmove', prevent);
        setIsAnimating(false);
      }, 2000);
    };

    // Add scroll listener
    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      container.addEventListener('touchmove', handleScroll, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleScroll);
        container.removeEventListener('touchmove', handleScroll);
      }
    };
  }, [slide, isAnimating, isExpanded]);

  // Synchronized animation styles
  const containerStyle = {
    transition: isExpanded ? 'all 1.8s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
    transform: isExpanded ? 'scale(1)' : 'scale(1)',
  };

  const videoContainerStyle = {
    transition: isExpanded
      ? 'all 1.8s cubic-bezier(0.23, 1, 0.32, 1)'
      : 'none',
    transform: isExpanded ? 'translate(calc(50vw - 50%), calc(50vh - 50%))' : 'translateX(0)',
    position: isExpanded ? 'fixed' : 'relative',
    top: isExpanded ? '0' : 'auto',
    left: isExpanded ? '0' : 'auto',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: isExpanded ? 100 : 1,
  };

  const videoStyle = {
    width: isExpanded ? '100vw' : 'min(100%, 500px)',
    height: isExpanded ? '100vh' : 'auto',
    maxHeight: isExpanded ? '100vh' : '350px',
    borderRadius: isExpanded ? '0px' : '24px',
    transition: isExpanded
      ? 'all 1.8s cubic-bezier(0.23, 1, 0.32, 1)'
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
      ? 'transform 2.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 2s cubic-bezier(0.16, 1, 0.3, 1)' 
      : 'none',
    pointerEvents: isExpanded ? 'none' : 'auto',
  };

  const gridStyle = {
    gap: isExpanded ? '0rem' : '3rem',
    gridTemplateColumns: isExpanded ? '1fr 0fr' : '1fr 1fr',
    transition: isExpanded 
      ? 'gap 3s cubic-bezier(0.16, 1, 0.3, 1), grid-template-columns 3.2s cubic-bezier(0.16, 1, 0.3, 1)' 
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
        scrollBehavior: slide ? undefined : 'smooth'
      }}
    >
      <section
        ref={videoSectionRef}
        style={{
          height: '100vh',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden'
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
            maxWidth: isExpanded ? 'none' : '1200px',
            width: '100%',
            padding: isExpanded ? '0' : '0 2rem',
            height: '100%',
            position: 'relative',
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
              <img
                ref={videoRef}
                src="/video_com.png"
                alt="Video Preview"
                style={videoStyle}
              />
              
              {/* Scroll hint - only show when not expanded */}
              {!isExpanded && !isAnimating && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(25, 102, 187, 0.9)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  animation: 'gentlePulse 3s infinite',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  Scroll to expand video
                </div>
              )}
            </div>

            {/* Text Container */}
            <div style={{
              ...textContainerStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '2rem',
              height: '100%'
            }}>
              <p
                className="font-normal mb-2 flex items-center gap-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "18px",
                  color: "#092646",
                  fontWeight: 500
                }}
              >
                <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
                Know our story
              </p>
              
              <h1 style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(32px, 6vw, 56px)',
                fontWeight: 'bold',
                color: '#1966BB',
                lineHeight: '1.2',
                marginBottom: '1rem'
              }}>
                The Video
              </h1>
              
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                color: '#666666',
                lineHeight: '1.7',
                fontWeight: 400,
                maxWidth: '90%'
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
        `}
      </style>
    </div>
  );
};

export default Videocomponent;