import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BFAST_VIDEO_MP4 } from "../../assets/assets";
import MobileTransitionWrapper from "../Themes/MobileTransitionWrapper";
import safariViewportHandler from "../../safari-viewport-handler";

gsap.registerPlugin(ScrollTrigger);

// Mobile version of B_Fast.jsx tailored for iPhone 13 mini dimensions
const B_Fast_Mobile = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const overlayRef = useRef(null);
  const orbitingStarsRef = useRef(null);
  const [videoError, setVideoError] = useState(false);
  const videoStartedRef = useRef(false);
  
  // Safari detection
  const isSafari = typeof navigator !== 'undefined' && /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios|android/i.test(navigator.userAgent);

  // Keep a bit of top spacing to avoid navbar overlap
  const [navbarSafeSpacing, setNavbarSafeSpacing] = useState("80px");
  // Scale the text group from an iPhone 13 mini baseline (≈390px width)
  const [scaleFactor, setScaleFactor] = useState(1);
  // Safari viewport handling
  const [viewportInfo, setViewportInfo] = useState(null);

  useEffect(() => {
    const onResize = () => {
      const estimatedNavbarHeight = 80;
      const currentScreenHeight = window.innerHeight;
      const safeSpacing = Math.max(estimatedNavbarHeight + 20, currentScreenHeight * 0.08);
      setNavbarSafeSpacing(`${safeSpacing}px`);

      // Compute a responsive scale factor based on viewport width
      const BASE_WIDTH = 390; // iPhone 13 mini logical width
      const vw = Math.max(window.innerWidth, 320);
      const computed = vw / BASE_WIDTH;
      // Keep scaling reasonable across devices
      const clamped = Math.max(0.62, Math.min(computed, 1.35));
      setScaleFactor(clamped);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Subscribe to Safari viewport changes
  useEffect(() => {
    if (isSafari && safariViewportHandler) {
      const unsubscribe = safariViewportHandler.subscribe((info) => {
        setViewportInfo(info);
        // Adjust navbar spacing based on tab bar visibility
        const estimatedNavbarHeight = info.tabBarVisible ? 80 : 20;
        const safeSpacing = Math.max(estimatedNavbarHeight + 20, info.viewportHeight * 0.08);
        setNavbarSafeSpacing(`${safeSpacing}px`);
      });
      
      // Get initial viewport info
      setViewportInfo(safariViewportHandler.getViewportInfo());
      
      return unsubscribe;
    }
  }, [isSafari]);

  // Simple enter animation and reveal overlay, mirroring desktop logic
  useGSAP(() => {
    if (!contentRef.current || !sectionRef.current || !overlayRef.current) return;

    // Ensure hidden before any paint to avoid flicker
    gsap.set(contentRef.current, { opacity: 0, y: -80 });
    gsap.set(overlayRef.current, { opacity: 0 });
    if (orbitingStarsRef.current) gsap.set(orbitingStarsRef.current, { opacity: 0 });

    let lastScrollY = window.scrollY;
    let isFromBottom = false;
    const hasRevealedRef = { current: false };

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentScrollY = window.scrollY;
            isFromBottom = currentScrollY < lastScrollY;

            // Prevent duplicate triggers/flicker; reveal only once
            if (hasRevealedRef.current && !isFromBottom) {
              lastScrollY = currentScrollY;
              return;
            }

            const startReveal = () => {
              const tl = gsap.timeline({ onComplete: () => {
                hasRevealedRef.current = true;
                observer.disconnect();
              }});
              if (isFromBottom) {
                gsap.set(overlayRef.current, { opacity: 1 });
                tl.to(overlayRef.current, { opacity: 0, duration: 1.6, ease: "power2.out" })
                  .to(contentRef.current, { opacity: 1, y: 0, duration: 2.4, ease: "power1.inOut" }, "+=0.8")
                  .to(orbitingStarsRef.current, { opacity: 1, duration: 1.2, ease: "power1.out" }, "<");
              } else {
                tl.to(contentRef.current, { opacity: 1, y: 0, duration: 2.4, ease: "power1.inOut", delay: 0.4 })
                  .to(orbitingStarsRef.current, { opacity: 1, duration: 1.2, ease: "power1.out" }, "<");
              }
            };

            // Wait until video starts, then 800ms, then reveal
            const triggerAfterVideo = () => gsap.delayedCall(0.8, startReveal);
            if (videoStartedRef.current) {
              triggerAfterVideo();
            } else if (videoRef.current) {
              const onPlay = () => {
                videoStartedRef.current = true;
                triggerAfterVideo();
                videoRef.current && videoRef.current.removeEventListener('play', onPlay);
              };
              videoRef.current.addEventListener('play', onPlay, { once: true });
            } else {
              // Fallback: if no video ref, reveal after 800ms
              triggerAfterVideo();
            }
            lastScrollY = currentScrollY;
          } else {
            gsap.set(contentRef.current, { opacity: 1, y: 0 });
            lastScrollY = window.scrollY;
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      gsap.killTweensOf([contentRef.current, overlayRef.current]);
    };
  }, []);

  return (
    <MobileTransitionWrapper 
      direction="up" 
      duration={1.0} 
      enableSwipe={true}
      onSwipe={(direction) => {
        console.log('B_Fast_Mobile swiped:', direction);
      }}
    >
      <section ref={sectionRef} className="relative w-full h-screen overflow-hidden safari-optimized" style={{ backgroundColor: "#ffffff" }} data-theme="light">
      {/* Reveal overlay for page-reveal effect */}
      <div ref={overlayRef} className="absolute inset-0 z-50 pointer-events-none" style={{ backgroundColor: "#ffffff" }} />

      {/* Content */}
      <div className="relative z-10 w-full h-full" style={{ backgroundColor: "#ffffff" }}>
        {/* Absolutely positioned text group (responsive via scale) */}
        <div
          ref={contentRef}
          className="absolute"
          style={{
            top: navbarSafeSpacing,
            left: "50%",
            width: "1045.386px",
            height: "148.822px",
            transform: "translateX(-50%)",
            transformOrigin: "top center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "12px",
            pointerEvents: "none"
          }}
        >
          <h1
            className="mb-2 leading-tight"
            style={{
              fontFamily: "EB Garamond, serif",
              fontWeight: 700,
              fontStyle: "bold",
              fontSize: "94.97px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              width: "1045.386474609375px",
              height: "124px",
              opacity: 1,
              backgroundImage: "linear-gradient(180deg, #B8C9E0 33.59%, #0A2A4A 77.13%)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            B-Fast
          </h1>

          <p
            className="leading-relaxed"
            style={{
              width: "1045.386474609375px",
              height: "25px",
              opacity: 1,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "20.33px",
              lineHeight: "100%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#777575",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            One Tap. Zero Wait.
          </p>
        </div>

        {/* Video */}
        <div className="relative w-full h-full mx-auto" style={{
          backgroundColor: "transparent",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          marginTop: "60px",
          borderRadius: "0px",
          // Add gradient mask for video blending - even stronger effect
          maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)"
        }}>
          <div className="relative w-full h-full flex items-center justify-center" style={{ backgroundColor: "transparent" }}>
            {/* Removed overlay - using only video masking for blending */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "transparent", zIndex: 1 }} />
            
            {videoError ? (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative z-10 shadow-lg">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">🎥</div>
                  <p className="text-sm">Video unavailable</p>
                </div>
              </div>
            ) : (
              <div
                className="relative"
                style={{
                  width: "705.7943725585938px",
                  height: "397.00933837890625px",
                  position: "relative",
                  top: "3cm",
                  left: "50%",
                  transform: "translateX(-50%)"
                }}
              >
                {/* Blended ellipse overlay over video */}
                <div
                  style={{
                    position: 'absolute',
                    width: '351.11px',
                    height: '604.85px',
                    left: 'calc(50% - 351.11px/2 - 127.49px)',
                    top: '254.43px',
                    background: 'rgba(55, 102, 183, 0.1)',
                    filter: 'blur(67.271px)',
                    transform: 'rotate(-90deg)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 11
                  }}
                />
                
                <video
                  ref={videoRef}
                  src={BFAST_VIDEO_MP4}
                  className="relative z-10"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "50% 50%",
                    opacity: 1,
                    mixBlendMode: "normal",
                    filter: "saturate(1.08) contrast(1.04) brightness(1.02)",
                    // Safari-specific video blending - even stronger effect
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                    WebkitMaskPosition: "center center",
                    maskPosition: "center center",
                    transformOrigin: "center",
                    pointerEvents: "none",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    backgroundColor: "transparent",
                    // Safari-specific optimizations
                    WebkitPlaysInline: true,
                    playsInline: true,
                    // Force hardware acceleration
                    WebkitTransform: "translateZ(0)",
                    transform: "translateZ(0)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden"
                  }}
                  autoPlay
                  muted
                  playsInline
                  webkit-playsinline="true"
                  controls={false}
                  controlsList="nodownload noplaybackrate nofullscreen noremoteplayback"
                  disableRemotePlayback
                  disablePictureInPicture
                  preload="auto"
                  onError={(e) => { console.warn('Mobile video failed to load', e); setVideoError(true); }}
                  onPlay={() => { videoStartedRef.current = true; }}
                >
                  <source src={BFAST_VIDEO_MP4} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
        </div>

        

        {/* Orbiting stars overlay - revolve around center */}
        <div ref={orbitingStarsRef} style={{ position: 'absolute', inset: 0, zIndex: 21, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
            {/* Ring 1 */}
            <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitSlow 24s linear infinite' }}>
              <div style={{ width: '8px', height: '8px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.6, transform: 'translateX(clamp(180px, 28vw, 360px))' }} />
              <div style={{ width: '8px', height: '8px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.6, transform: 'rotate(120deg) translateX(clamp(180px, 28vw, 360px))' }} />
              <div style={{ width: '8px', height: '8px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.6, transform: 'rotate(240deg) translateX(clamp(180px, 28vw, 360px))' }} />
            </div>
            {/* Ring 2 */}
            <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitMed 18s linear infinite reverse' }}>
              <div style={{ width: '6px', height: '6px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.65, transform: 'translateX(clamp(260px, 36vw, 520px))' }} />
              <div style={{ width: '6px', height: '6px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.65, transform: 'rotate(90deg) translateX(clamp(260px, 36vw, 520px))' }} />
              <div style={{ width: '6px', height: '6px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.65, transform: 'rotate(180deg) translateX(clamp(260px, 36vw, 520px))' }} />
              <div style={{ width: '6px', height: '6px', background: '#666', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.65, transform: 'rotate(270deg) translateX(clamp(260px, 36vw, 520px))' }} />
            </div>
            {/* Scattered stars across the viewport */}
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '8%', top: '12%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '22%', top: '38%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.55 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '36%', top: '18%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '52%', top: '30%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '68%', top: '10%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.45 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '78%', top: '42%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.55 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '12%', top: '72%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '32%', top: '82%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '58%', top: '74%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.5 }} />
              <div style={{ position: 'absolute', width: '6px', height: '6px', left: '84%', top: '66%', background: '#777', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.45 }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spinStar { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.65; } 50% { opacity: 1; } }
        @keyframes spinDriftA { 0% { transform: rotate(0deg) translate(0px, 0px); } 50% { transform: rotate(180deg) translate(6px, -4px); } 100% { transform: rotate(360deg) translate(0px, 0px); } }
        @keyframes spinDriftB { 0% { transform: rotate(0deg) translate(0px, 0px); } 50% { transform: rotate(180deg) translate(-5px, 6px); } 100% { transform: rotate(360deg) translate(0px, 0px); } }
        @keyframes spinDriftC { 0% { transform: rotate(0deg) translate(0px, 0px); } 50% { transform: rotate(180deg) translate(4px, 5px); } 100% { transform: rotate(360deg) translate(0px, 0px); } }
        @keyframes orbitSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbitMed { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        
        /* Safari video optimizations */
        video::-webkit-media-controls {
          display: none !important;
          -webkit-appearance: none;
        }
        
        video::-webkit-media-controls-panel {
          display: none !important;
          -webkit-appearance: none;
        }
        
        video::-webkit-media-controls-play-button {
          display: none !important;
          -webkit-appearance: none;
        }
        
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }
        
        video::-webkit-media-controls-overlay-play-button {
          display: none !important;
          -webkit-appearance: none;
        }
        
        video::-webkit-media-controls-enclosure {
          display: none !important;
          -webkit-appearance: none;
        }
        
        /* Force hardware acceleration for Safari */
        video {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-perspective: 1000px;
          perspective: 1000px;
        }
        
        /* Safari video blending fix */
        .safari-optimized video {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-position: center center;
          mask-position: center center;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }
        
        /* Safari rendering optimizations */
        .safari-optimized {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-perspective: 1000px;
          perspective: 1000px;
          will-change: transform;
        }
      `}</style>
      </section>
    </MobileTransitionWrapper>
  );
};

export default B_Fast_Mobile;