import React, { useRef, useState } from "react";
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

  useGSAP(() => {
    // Check if refs exist before animating
    if (!contentRef.current || !videoRef.current || !sectionRef.current || !overlayRef.current) return;
    
    // Always set initial heading state for animation
    gsap.set(contentRef.current, { opacity: 0, y: -80 }); // Heading starts higher and hidden
    
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
            
            // Always reset heading before animation
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
            // Reset when leaving
            gsap.set(contentRef.current, { opacity: 0, y: -80 });
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
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8" style={{ backgroundColor: '#ffffff' }}>
        {/* Text Content */}
        <div
          ref={contentRef}
          className="text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto"
          style={{ 
            marginTop: '40px',
            marginBottom: 'clamp(1rem, 3vw, 2rem)' // Responsive gap reduction
          }}
        >
          <h1 className="eb-garamond-Bfast bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent mb-4 leading-tight" style={{ fontSize: '128px' }}>
            B-Fast
          </h1>

          <p className="inter-Bfast_sub bg-gradient-to-r from-[#777575] to-[#092646] bg-clip-text text-transparent leading-relaxed" style={{ fontSize: '24px' }}>
            One Tap. Zero Wait.
          </p>
        </div>



        {/* Video Section */}
        <div className="relative w-full mx-auto" style={{ 
          marginTop: 'clamp(-120px, -12vw, -80px)', // More aggressive gap reduction
          height: 'clamp(300px, 55vw, 750px)',
          minHeight: '250px',
          maxHeight: '80vh',
          backgroundColor: 'transparent'
        }}>
          {/* Responsive positioning container */}
          <div className="relative w-full h-full" style={{ 
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
                  // Page-filling horizontal stretch (reduced by 2rem)
                  width: 'clamp(288px, calc(85vw - 2rem), 1168px)',
                  // Proportional height scaling
                  height: 'clamp(180px, 48vw, 675px)',
                  // No rotation + perfect centering
                  transform: 'translateX(-50%) rotate(0deg)',
                  // Visible opacity
                  opacity: 1,
                  // Responsive positioning
                  position: 'absolute',
                  // Top: better for laptop screens
                  top: 'clamp(20px, 8vw, 120px)',
                  // Perfect centering for all screen sizes
                  left: '50%',
                  // Darken blend mode for visual effect
                  mixBlendMode: 'darken',
                  objectPosition: 'center center',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  backgroundColor: 'transparent'
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
