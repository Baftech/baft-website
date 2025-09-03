import React, { useRef, useState } from "react";
import { gsap } from "gsap";
import { VIDEO_COM_PNG, SVG_SVG, BAFT_VID_MP4 } from "../../assets/assets";

const VideoComponentMobile = ({ slide = false }) => {
  const cardRef = useRef(null);
  const fullscreenRef = useRef(null);
  const videoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const expandAndPlay = async () => {
    if (isExpanded || isAnimating) return;
    
    setIsAnimating(true);
    setIsExpanded(true);

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
      videoRef.current.play().catch(() => {});
    }

    gsap.to(cardRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.3,
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

  return (
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
          className="relative w-[85vw] h-[25vh] rounded-xl overflow-hidden shadow-lg cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
                transform: 'rotateX(5deg) rotateY(-2deg) scale(0.98)',
                transformOrigin: 'center center',
            backfaceVisibility: 'hidden'
              }}
          onClick={expandAndPlay}
            >
          {/* Thumbnail Image - Only show when not expanded */}
          {!isExpanded && (
              <img
                src={VIDEO_COM_PNG}
                alt="Video Preview"
              className="w-full h-full object-cover rounded-xl"
            />
          )}

          

          {/* Play Button Overlay - Only show when not expanded */}
          {!isExpanded && !isAnimating && (
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
                src={BAFT_VID_MP4}
                playsInline
                muted
                autoPlay
                preload="auto"
                poster={VIDEO_COM_PNG}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(90deg)",
                  height: "100vw",   // scale using the larger side
                  width: "auto",     // preserve aspect ratio
                  objectFit: "cover", // YouTube-style edge-to-edge
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
          <div className="mt-8 w-[85vw] max-w-[400px]">
            <div className="flex flex-col gap-2">
              <p className="font-normal flex items-center gap-2 text-sm text-[#092646]">
                <img src={SVG_SVG} alt="Icon" className="w-4 h-4" />
                Know our story
              </p>
              
              <h1 className="text-3xl font-bold text-[#1966BB] leading-tight">
                The Video
              </h1>
              
              <p className="text-[#909090] text-sm leading-relaxed">
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
  );
};

export default VideoComponentMobile;