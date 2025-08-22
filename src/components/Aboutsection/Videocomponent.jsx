import React, { useRef, useEffect, useState } from "react";

const Videocomponent = ({ slide = false }) => {
  const mainContainerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle scroll-based expansion in slide mode
  useEffect(() => {
    if (!slide) return;

    const handleScroll = (e) => {
      if (isExpanded) return;
      
      // Trigger expansion on any scroll
      // Mark global handoff so SlideContainer ignores wheel during expansion
      if (typeof window !== 'undefined') {
        window.__videoHandoffActive = true;
      }

      // Lock global scroll briefly to keep focus on expanding preview
      const prevent = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        return false;
      };
      document.addEventListener('wheel', prevent, { passive: false });
      document.addEventListener('touchmove', prevent, { passive: false });
      document.addEventListener('keydown', prevent, { passive: false });

      setIsExpanded(true);
      setAnimationProgress(1);
      
      // Don't play video here - it will play in the expanded section
      // Just trigger the expansion animation

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
        document.removeEventListener('keydown', prevent);
      }, 1600);
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
  }, [slide, isExpanded]);

  // Animation styles
  // Keep video perfectly centered and fit within viewport as it expands
  const containerStyle = {
    transition: animationProgress > 0 ? 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
  };

  const videoStyle = {
    width: animationProgress > 0 ? '100vw' : 'min(100%, 1000px)',
    height: 'auto',
    maxHeight: animationProgress > 0 ? '70vh' : '400px',
    transform: 'none',
    transformOrigin: 'center center',
    borderRadius: `${Math.max(0, 33.72 - (animationProgress * 33.72))}px`,
    transition: animationProgress > 0
      ? 'width 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), max-height 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : 'none',
    objectFit: 'contain',
    display: 'block',
    margin: '0 auto',
  };

  const textStyle = {
    transform: `translateX(${animationProgress * 100}vw)`,
    opacity: Math.max(0, 1 - animationProgress * 1.5),
    transition: animationProgress > 0 ? 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
  };

  const gridStyle = {
    gap: `${5 - (animationProgress * 5)}rem`,
    transition: animationProgress > 0 ? 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
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
          position: 'relative'
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
            gridTemplateColumns: '1fr 1fr',
            ...gridStyle,
            alignItems: 'center',
            maxWidth: '1200px',
            width: '100%',
            padding: '0 2rem',
            ...containerStyle
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              height: '100vh',
              overflow: 'hidden'
            }}>
              {/* Preview image - shows poster until expansion */}
              <img
                src="/video_com.png"
                alt="Video Preview"
                style={{
                  ...videoStyle,
                  maxWidth: animationProgress > 0 ? '100vw' : '100%',
                  maxHeight: animationProgress > 0 ? '70vh' : '400px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  objectFit: 'contain'
                }}
              />
              
              {/* Expansion hint */}
              {!isExpanded && (
                <div style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(25, 102, 187, 0.9)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  animation: 'pulse 2s infinite',
                  zIndex: 10
                }}>
                  Scroll to expand
                </div>
              )}
            </div>

            <div style={{
              ...textStyle,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}>
              <p
                className="font-normal mb-2 flex items-center gap-2"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  color: "#092646",
                }}
              >
                <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
                Know our story
              </p>
              
              <h1 style={{
                fontFamily: 'EB Garamond, serif',
                fontSize: 'clamp(34px, 8vw, 64px)',
                fontWeight: 'bold',
                color: '#1966BB',
                lineHeight: '1.1',
                marginBottom: '1rem'
              }}>
                The Video
              </h1>
              
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                color: '#909090',
                lineHeight: '1.6',
                fontWeight: 400
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

      {/* CSS for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: translateX(-50%) scale(1); }
            50% { opacity: 0.7; transform: translateX(-50%) scale(1.05); }
            100% { opacity: 1; transform: translateX(-50%) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default Videocomponent;
