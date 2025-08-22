import React, { useRef, useEffect, useState } from "react";

const Videocomponent = ({ slide = false }) => {
  const mainContainerRef = useRef(null);
  const videoSectionRef = useRef(null);
  const videoRef = useRef(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Slide mode: show normal view first, then expand on interaction
  useEffect(() => {
    if (!slide) return;
    
    // Reset to normal view when entering slide
    setExpanded(false);
    setAnimationProgress(0);
    
    // Add a delay before allowing expansion to ensure normal view is visible
    const timer = setTimeout(() => {
      const onWheel = (e) => {
        if (expanded) return;
        setExpanded(true);
        setAnimationProgress(1);
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          });
        }
      };
      
      const onKey = (e) => {
        if (expanded) return;
        if (["ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) {
          setExpanded(true);
          setAnimationProgress(1);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            });
          }
        }
      };
      
      window.addEventListener("wheel", onWheel, { passive: true });
      window.addEventListener("keydown", onKey);
      
      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
      };
    }, 1000); // 1 second delay to show normal view first
    
    return () => clearTimeout(timer);
  }, [slide, expanded]);

  // Standalone scroll mode: original behavior
  useEffect(() => {
    if (slide) return; // Skip in slide mode
    const handleScroll = () => {
      if (!mainContainerRef.current || !videoSectionRef.current) return;
      const container = mainContainerRef.current;
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const videoSectionStart = 0;
      const videoSectionEnd = windowHeight;
      if (scrollTop >= videoSectionStart && scrollTop <= videoSectionEnd) {
        const sectionScroll = scrollTop - videoSectionStart;
        if (sectionScroll >= 1) {
          setAnimationProgress(1);
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch((error) => {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            });
          }
        } else {
          setAnimationProgress(0);
        }
      } else if (scrollTop < videoSectionStart) {
        setAnimationProgress(0);
        if (videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
    };

    const handleWheel = () => {
      if (!mainContainerRef.current) return;
      const container = mainContainerRef.current;
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const videoSectionStart = 0;
      const videoSectionEnd = windowHeight;
      if (scrollTop >= videoSectionStart && scrollTop < videoSectionEnd && animationProgress === 0) {
        setAnimationProgress(1);
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {
              videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          });
        }
      }
    };

    const container = mainContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      container.addEventListener('wheel', handleWheel, { passive: true });
      handleScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [animationProgress, slide]);

  const textStyle = {
    transform: `translateX(${animationProgress * 120}vw)`,
    opacity: Math.max(0, 1 - animationProgress * 1.5),
    transition: animationProgress > 0 ? 'all 3s ease-out' : 'none',
  };

  const videoStyle = {
    transform: `scale(${1 + animationProgress * 2})`,
    transformOrigin: "center center",
    transition: animationProgress > 0 ? 'all 2s ease-out' : 'none',
  };

  // Container expansion style - stretches to the right
  const containerStyle = {
    transform: `translateX(${animationProgress * 50}vw)`,
    width: `${100 + animationProgress * 100}%`,
    transition: animationProgress > 0 ? 'all 2.5s ease-out' : 'none',
  };

  // Grid transition style
  const gridStyle = {
    transition: animationProgress > 0 ? 'all 2.5s ease-out' : 'none',
  };

  // Show expansion hint after delay
  const showExpansionHint = slide && !expanded && animationProgress === 0;

  return (
    <div 
      ref={mainContainerRef}
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
             gridTemplateColumns: animationProgress > 0 ? '1fr' : '1fr 1fr',
             gap: animationProgress > 0 ? '0' : '5rem',
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
              position: 'relative'
            }}>
              <video
                ref={videoRef}
                muted
                playsInline
                preload="metadata"
                poster="/video_com.png"
            style={{
                  ...videoStyle,
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '33.72px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  maxHeight: '400px',
                  objectFit: 'contain',
                }}
              >
                <source src="/sample-5s.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Expansion hint */}
              {showExpansionHint && (
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
                  Scroll or press Space to expand
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



      {/* Debug Info hidden in slide mode */}
      {!slide && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          fontSize: '12px',
          zIndex: 1000
        }}>
          <div>Animation: {Math.round(animationProgress * 100)}%</div>
          <div>Video: {videoRef.current?.paused === false ? 'Playing' : 'Paused'}</div>
          <div>ScrollTop: {mainContainerRef.current?.scrollTop || 0}</div>
          <div>Section Scroll: {Math.max(0, (mainContainerRef.current?.scrollTop || 0) - 0)}</div>
          <div>Window Height: {window.innerHeight}</div>
        </div>
      )}
      
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
