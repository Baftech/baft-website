import React, { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { VIDEO_COM_PNG, SVG_SVG, VIDEOPLAYBACK_MP4 } from "../../assets/assets";

const VideoComponentMobile = ({ slide = false }) => {
  const cardRef = useRef(null);
  const fullscreenRef = useRef(null);
  const videoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLandscape, setIsLandscape] = useState(() => (typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false));
  const [showRotateTip, setShowRotateTip] = useState(false);
  const [isInline, setIsInline] = useState(false);
  const autoFSRef = useRef(false);

  const expandInline = () => {
    if (isInline || isExpanded || isAnimating) return;
    setIsInline(true);
    // Autoplay inline (muted, playsInline)
    requestAnimationFrame(() => {
      if (videoRef.current) {
        try { videoRef.current.play().catch(() => {}); } catch (_) {}
      }
    });
  };

  const enterFullscreen = async () => {
    if (isExpanded || isAnimating) return;
    setIsAnimating(true);
    setIsExpanded(true);
    try {
      const landscapeNow = window.innerWidth > window.innerHeight;
      setShowRotateTip(!landscapeNow);
    } catch (_) {}

    // Lock scroll
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    // Request fullscreen and lock orientation to landscape
    if (fullscreenRef.current?.requestFullscreen) {
      try {
        await fullscreenRef.current.requestFullscreen();
        if (screen.orientation && screen.orientation.lock) {
          await screen.orientation.lock("landscape").catch(() => {});
        }
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
      }
    }

    // Play video
    if (videoRef.current) {
      try { await videoRef.current.play(); } catch (_) {}
    }

    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        setIsAnimating(false);
      }
    });
  };

  const collapse = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsExpanded(false);
    setIsInline(false);

    // Exit fullscreen and unlock orientation
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (err) {
        console.warn("Exit fullscreen failed:", err);
      }
    }

    // Pause & reset video
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    gsap.to(cardRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        setIsAnimating(false);
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    });
  };

  const handleOrientationUpdate = useCallback(() => {
    const landscape = window.innerWidth > window.innerHeight;
    setIsLandscape(landscape);
    setShowRotateTip(!landscape);
  }, []);

  useEffect(() => {
    // If inline and user rotates to landscape, auto enter fullscreen once
    if (isInline && !isExpanded && isLandscape && !autoFSRef.current) {
      autoFSRef.current = true;
      // small delay to allow layout to settle
      setTimeout(() => enterFullscreen(), 50);
    }
    if (!isExpanded) return;
    const onResize = () => handleOrientationUpdate();
    const onOrientationChange = () => handleOrientationUpdate();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onOrientationChange);
    handleOrientationUpdate();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientationChange);
    };
  }, [isExpanded, handleOrientationUpdate]);

  // Auto-hide the rotate tip after a short delay
  useEffect(() => {
    if (!isExpanded || !showRotateTip) return;
    const t = setTimeout(() => setShowRotateTip(false), 3500);
    return () => clearTimeout(t);
  }, [isExpanded, showRotateTip]);

  return (
    <>
      <style>
        {`
          @media (min-width: 640px) {
            .video-card-responsive {
              transform: rotateX(4deg) rotateY(-1.5deg) scale(0.995) !important;
            }
          }
          @media (min-width: 768px) {
            .video-card-responsive {
              transform: rotateX(5deg) rotateY(-2deg) scale(0.99) !important;
            }
          }
        `}
      </style>
      <div className="relative w-full h-screen flex items-center justify-center bg-white overflow-hidden">
      <section
        style={{
          height: '100vh',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}
        data-theme="light"
      >
                {/* Video Card Container */}
        <div
          ref={cardRef}
          className="relative w-[85vw] h-[30vh] rounded-xl overflow-hidden shadow-lg cursor-pointer video-card-responsive"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
                transform: 'rotateX(3deg) rotateY(-1deg) scale(0.998)',
                transformOrigin: 'center center',
                backfaceVisibility: 'hidden'
              }}
          onClick={expandInline}
            >
          {/* Thumbnail Image - Only show when not expanded */}
          {!isInline && !isExpanded && (
              <img
                src={VIDEO_COM_PNG}
                alt="Video Preview"
              className="w-full h-full object-contain rounded-xl bg-gray-100"
            />
          )}

          {/* Inline video (step 2) */}
          {isInline && !isExpanded && (
            <>
              <video
                ref={videoRef}
                src={VIDEOPLAYBACK_MP4}
                playsInline
                muted
                autoPlay
                preload="auto"
                poster={VIDEO_COM_PNG}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ backgroundColor: 'black' }}
              />
              {/* Floating fullscreen icon (bottom-right) */}
              <button
                onClick={(e) => { e.stopPropagation(); enterFullscreen(); }}
                className="absolute bottom-2 right-2 z-20 bg-black/50 hover:bg-black/60 text-white rounded-md p-2"
                style={{ border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
                aria-label="Enter fullscreen"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 9V4h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 15v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 4h5v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 20H4v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}

          {/* Play Button Overlay - Only show when not expanded */}
          {!isInline && !isExpanded && !isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                <p className="text-sm opacity-90">
                  Tap to play in landscape
                </p>
                  </div>
                </div>
              )}
          </div>
          
        {/* Full screen button (step 2 -> step 3) */}
        {isInline && !isExpanded && (
          <div className="w-[85vw] max-w-[400px] flex justify-end mt-3">
            <button
              onClick={enterFullscreen}
              className="px-4 py-2 rounded-full text-white"
              style={{
                backgroundColor: '#092646',
                boxShadow: '0 8px 18px rgba(9,38,70,0.25)'
              }}
            >
              Full screen
            </button>
          </div>
        )}

        {/* Fullscreen Video Overlay - Only show when expanded */}
        {isExpanded && (
          <div
            ref={fullscreenRef}
            className="fixed inset-0 bg-black z-40 flex items-center justify-center"
            style={{
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh'
            }}
            onClick={(e) => {
              // Close when clicking outside the video
              if (e.target === e.currentTarget) {
                collapse();
              }
            }}
          >
            {/* Rotate tip when in portrait */}
            {showRotateTip && (
              <div
                className="absolute left-1/2 -translate-x-1/2 px-3 py-2 rounded-full text-white text-xs sm:text-sm"
                style={{
                  top: 'calc(64px + env(safe-area-inset-top, 0px))',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 50
                }}
              >
                Rotate your phone for the best viewing experience
              </div>
            )}
            <div
              style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                background: "black",
                overflow: "hidden",
              }}
            >
              <video
                ref={videoRef}
                src={VIDEOPLAYBACK_MP4}
                playsInline
                muted
                autoPlay
                preload="auto"
                poster={VIDEO_COM_PNG}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: isLandscape ? "translate(-50%, -50%)" : "translate(-50%, -50%) rotate(90deg)",
                  minWidth: isLandscape ? "100vw" : "100vh",
                  minHeight: isLandscape ? "100vh" : "100vw",
                  width: isLandscape ? "100vw" : "auto",
                  height: isLandscape ? "100vh" : "auto",
                  objectFit: "cover",
                  backgroundColor: "black"
                }}
              />
            </div>
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                collapse();
              }}
              className="absolute top-4 right-4 z-50 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-lg font-bold"
              style={{ 
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Text Content - Only show when not expanded */}
        {!isExpanded && (
          <div className="mt-12 w-[85vw] max-w-[400px] px-2">
            <div className="flex flex-col gap-3">
              {/* Know Our Story */}
              <p 
                className="flex items-center gap-2 text-[#092646]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: 'clamp(11px, 3.5vw, 13.6834px)',
                  lineHeight: 'clamp(9px, 2.8vw, 11px)',
                  letterSpacing: '-0.153595px',
                  display: 'flex',
                  alignItems: 'center',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                <img src={SVG_SVG} alt="Icon" className="w-3 h-3 sm:w-4 sm:h-4" />
                Know our story
              </p>
              
              <h1 
                className="text-[#1966BB]"
                style={{
                  fontFamily: 'EB Garamond, serif',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 8vw, 43.7867px)',
                  lineHeight: 'clamp(34px, 10vw, 54px)',
                  letterSpacing: '-0.153595px',
                  display: 'flex',
                  alignItems: 'center',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                The Video
              </h1>
              
              <p 
                className="text-[#909090]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: 'clamp(14px, 4.2vw, 16.42px)',
                  lineHeight: 'clamp(20px, 6vw, 24px)',
                  display: 'flex',
                  alignItems: 'center',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0
                }}
              >
                BaFT Technology is a next-gen neo-banking startup headquartered in
                Bangalore, proudly founded in 2025. We're a tight-knit team of
                financial innovators and tech experts on a mission: to reimagine
                financial services in India with customer-first solutions.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
    </>
  );
};

export default VideoComponentMobile;