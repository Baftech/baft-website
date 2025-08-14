import React, { useState, useEffect } from "react";
import { GridBackground } from "../Themes/Gridbackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Note: Coin animations are now handled by scroll-linked GSAP timeline in useGSAP

  useGSAP(() => {
    // Set initial states - everything in one section
    gsap.set(["#baft_coin_section", "#b_instant_section"], { opacity: 0 });
    gsap.set("#Hero", { opacity: 1 }); // Hero section always visible
    gsap.set("#videoElement", { opacity: 0, scale: 1, y: 0, x: 0 });
    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.8 });
    gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });
    
    // Set initial states for coin animations
    // Initial states will be handled by the scroll-linked animation

    // Step 1: Show video immediately
    gsap.to("#videoElement", { 
      opacity: 1, 
      duration: 1,
      delay: 0.5
    });

    // Step 2: After exactly 5 seconds from start, shrink video and show text
    setTimeout(() => {
      console.log("Starting video shrink animation"); // Debug log
      
      // Shrink video and position it properly like in reference image
      gsap.to("#videoElement", {
        scale: 0.4, // Slightly bigger to show more of the phone
        x: 0, // Keep centered horizontally
        y: "20%", // Move higher to show full phone properly
        opacity: 0.9, // High opacity to clearly show the phone
        borderRadius: "20px", // Phone-like border radius
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          console.log("Video shrink complete, video should be visible"); // Debug log
        }
      });
      
      // Show grid background
      gsap.to("#grid_container", {
        opacity: 1,
        duration: 1.5
      });
      
      // Show text
      gsap.to("#text", {
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        duration: 2,
        delay: 0.3,
        ease: "power2.out"
      });
      
      // Show scroll button after text
      gsap.to("#scroll_button", {
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 1.5,
        delay: 1, // Appear after text starts showing
        ease: "power2.out"
      });
      
    }, 5500); // 5.5 seconds total (0.5 delay + 5 seconds)

    // Add scroll listener for top of page detection
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop === 0) {
        console.log("Reached top of page - back to initial state");
        
        // Kill any ongoing animations
        gsap.killTweensOf(["#videoElement", "#text", "#grid_container"]);
        
        // Immediately hide text, grid, and scroll button (back to initial state)
        gsap.set("#text", { opacity: 0, y: 50, scale: 0.8, visibility: "hidden" });
        gsap.set("#grid_container", { opacity: 0 });
        gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });
        
        // Expand video to full screen (back to initial state)
        gsap.set("#videoElement", { 
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
          borderRadius: "20px"
        });
        
        // Restart video playback from beginning
        const video = document.getElementById("videoElement");
        if (video) {
          video.currentTime = 0;
          video.play();
        }
        
        // Set up 5-second timer to trigger shrink animation again
        setTimeout(() => {
          // Check if we're still at the top of the page
          const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (currentScrollTop === 0) {
            console.log("5 seconds completed at top - triggering shrink animation");
            
            // Shrink video and show text/grid (same as the original animation)
            gsap.to("#videoElement", {
              scale: 0.4,
              x: 0,
              y: "20%",
              opacity: 0.9,
              duration: 1.5,
              ease: "power2.out"
            });
            
            // Show grid background
            gsap.to("#grid_container", {
              opacity: 1,
              duration: 1.5
            });
            
            // Show text
            gsap.to("#text", {
              opacity: 1,
              y: 0,
              scale: 1,
              visibility: "visible",
              duration: 2,
              delay: 0.3,
              ease: "power2.out"
            });
            
            // Show scroll button after text
            gsap.to("#scroll_button", {
              opacity: 1,
              y: 0,
              visibility: "visible",
              duration: 1.5,
              delay: 1,
              ease: "power2.out"
            });
          }
        }, 5500); // 5.5 seconds to match the original timing
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Add scroll trigger for reverse animation
    ScrollTrigger.create({
      trigger: "#hero_container",
      start: "top center",
      end: "bottom center",
      onLeave: () => {
        console.log("Scrolling past hero section");
      },
      onEnter: () => {
        console.log("Entering hero section");
      },
      onLeaveBack: () => {
        console.log("Scrolling back up past hero - triggering reverse animation");
        
        // Step 1: First hide text, grid, and scroll button (reverse of their appearance)
        gsap.to("#text", {
          opacity: 0,
          y: 50,
          scale: 0.8,
          visibility: "hidden",
          duration: 0.8,
          ease: "power2.in"
        });
        
        gsap.to("#grid_container", {
          opacity: 0,
          duration: 0.8
        });
        
        gsap.to("#scroll_button", {
          opacity: 0,
          y: 20,
          visibility: "hidden",
          duration: 0.8,
          ease: "power2.in"
        });
        
        // Step 2: Then expand video back to full screen (reverse of shrinking)
        setTimeout(() => {
          gsap.killTweensOf("#videoElement");
          gsap.to("#videoElement", {
            scale: 1,
            x: 0,
            y: 0,
            opacity: 1,
            borderRadius: "20px",
            duration: 1.2,
            ease: "power2.out"
          });
        }, 300); // Small delay to sequence the reverse properly
      },
      onEnterBack: () => {
        console.log("Scrolling back down into hero - showing shrunk video and text");
        
        // Wait a moment then trigger the shrink animation
        setTimeout(() => {
          gsap.to("#videoElement", {
            scale: 0.4,
            x: 0,
            y: "20%",
            opacity: 0.9,
            duration: 1.5,
            ease: "power2.out"
          });
          
          gsap.to("#grid_container", {
            opacity: 1,
            duration: 1.5
          });
          
          gsap.to("#text", {
            opacity: 1,
            y: 0,
            scale: 1,
            visibility: "visible",
            duration: 2,
            delay: 0.3,
            ease: "power2.out"
          });
          
          gsap.to("#scroll_button", {
            opacity: 1,
            y: 0,
            visibility: "visible",
            duration: 1.5,
            delay: 1,
            ease: "power2.out"
          });
        }, 100);
      }
    });

    // 2️⃣ Scroll-based transition between sections (after main timeline completes)
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero_container",
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
      }
    });

    // Start scroll transitions - only fade grid and text, keep video
    scrollTimeline
      .to("#grid_container", { opacity: 0, duration: 1 }, "+=3") // Fade out grid
      .to("#text", { opacity: 0, duration: 1 }, "<") // Fade out text
      .to("#baft_coin_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .from(["#introduction", "#baft_coin_text", "#B_coin"], {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1
      })
      .to("#baft_coin_section", { opacity: 0, duration: 1 }, "+=1")
      .to("#b_instant_section", { opacity: 1, y: 0, duration: 1 }, "<");
      // Note: #instant_content animation now handled by separate scroll-linked trigger

    // Create separate scroll-linked animation for B-Instant section
    ScrollTrigger.create({
      trigger: "#b_instant_section",
      start: "top bottom-=100", // Start before section fully enters
      end: "bottom top+=100", // End after section fully exits
      scrub: 1, // Smooth scroll-linked animation
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Text animation
        gsap.set("#instant_content", {
          y: (1 - progress) * 200, // Start 200px below, move to 0
          scale: 0.6 + (progress * 0.4), // Scale from 0.6 to 1.0
          opacity: Math.max(0.3, progress) // Always visible but starts dim
        });
        
        // Center coin animation - solid but subdued
        gsap.set("#center_coin", {
          y: (1 - progress) * 180,
          scale: 0.7 + (progress * 0.3),
          opacity: Math.max(0.7, progress * 0.9), // More solid, max 90% opacity
          zIndex: 2
        });
        
        // Top coin animation - solid but subdued
        gsap.set("#top_coin", {
          x: progress * -60, // Move left as animation progresses
          y: (1 - progress) * 200 - (progress * 80), // Start below, end up-left
          scale: 0.5 + (progress * 0.5),
          opacity: Math.max(0.6, progress * 0.85), // More solid, max 85% opacity
          zIndex: progress > 0.5 ? 3 : 1 // Come to front halfway through
        });
        
        // Bottom coin animation - solid but subdued
        gsap.set("#bottom_coin", {
          x: progress * 60, // Move right as animation progresses
          y: (1 - progress) * 220 + (progress * 80), // Start below, end down-right
          scale: 0.5 + (progress * 0.5),
          opacity: Math.max(0.6, progress * 0.85), // More solid, max 85% opacity
          zIndex: 1
        });
      }
    });

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div id="hero_container" className="relative w-full h-screen">

      {/* Combined Section - Video and Grid/Text Together */}
      <div 
        id="Hero" 
        data-theme='dark' 
        className="absolute top-0 w-full h-screen bg-black overflow-hidden z-10"
      >
        {/* Grid Background - Initially Hidden */}
        <div id="grid_container" style={{ opacity: 0 }}>
          <GridBackground />
        </div>
        
        {/* Video - Always Present */}
        <div className="absolute inset-0 z-10">
          <video
            id="videoElement"
            src="/BAFT Vid 2_1.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              transformOrigin: 'center center',
              opacity: 0,
              borderRadius: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)', // Add shadow for depth
              border: '2px solid rgba(255,255,255,0.1)' // Subtle border
            }}
          />
        </div>
        
        {/* Text overlay - Initially Hidden */}
        <div className="absolute top-0 bottom-35 left-2 right-2 flex items-center justify-center pointer-events-none z-30">
          <img 
            id="text" 
            src="/headline.png" 
            alt="Headline"
            className="max-w-full max-h-full object-contain"
            style={{ opacity: 0 }}
          />
        </div>
        
        {/* Scroll Down Button - Initially Hidden */}
        <div 
          id="scroll_button"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Scroll button clicked - simulating scroll");
              
              // Simulate natural scroll behavior
              const startPosition = window.pageYOffset;
              const targetPosition = window.innerHeight; // Scroll one viewport height
              const distance = targetPosition - startPosition;
              const duration = 1500; // 1.5 seconds for smooth scroll
              let startTime = null;
              
              function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                
                // Easing function for natural scroll feel
                const easeInOutQuad = progress < 0.5 
                  ? 2 * progress * progress 
                  : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                const currentPosition = startPosition + (distance * easeInOutQuad);
                window.scrollTo(0, currentPosition);
                
                if (progress < 1) {
                  requestAnimationFrame(scrollAnimation);
                } else {
                  console.log("Scroll simulation completed");
                }
              }
              
              requestAnimationFrame(scrollAnimation);
            }}
            className="group flex items-center gap-3 px-6 py-3 text-white cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(15px)',
              WebkitBackdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            <span className="text-sm font-medium tracking-wide">Scroll Down</span>
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="transition-transform duration-300 group-hover:translate-y-1"
            >
              <path 
                d="M7 10L12 15L17 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* BaFT Coin Section */}
      <div
        id="baft_coin_section"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black text-white flex items-center justify-center z-20"
      >
        <img
          id="B_coin"
          src="b-coin image.png"
          alt="BaFT Coin Image"
          className="w-[500px] h-auto p-10"
        />
        <div className="absolute flex flex-col items-center">
          <h6
            id="introduction"
            className="text-[55px] eb-garamond-introduction mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
          >
            Introducing
          </h6>
          <h1
            id="baft_coin_text"
            className="text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
          >
            BaFT Coin
          </h1>
        </div>
      </div>

      {/* B-Instant Section */}
      <div
        id="b_instant_section"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden z-30"
        style={{ isolation: "isolate" }}
      >
        {/* Centered container */}
        <div className="relative flex items-center justify-center w-full h-full">
          
          {/* Coin Stack Container */}
          <div className="relative max-w-[30rem] w-full h-auto">
            
            {/* Bottom Coin - Starts behind center, moves diagonally down-right, stays behind */}
            <div
              id="bottom_coin"
              className="absolute inset-0 w-full h-auto"
              style={{ zIndex: 1 }}
            >
              <img
                src="/b-coin.svg"
                alt="Bottom coin"
                className="w-full h-auto object-contain"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3)) brightness(0.9)",
                }}
              />
            </div>

            {/* Center Coin - This stays in place and is always visible */}
            <div
              id="center_coin"
              className="relative w-full h-auto"
              style={{ zIndex: 2 }}
            >
              <img
                src="/b-coin.svg"
                alt="Center coin"
                className="w-full h-auto object-contain"
                style={{
                  filter: "drop-shadow(0 0 25px rgba(255, 215, 0, 0.4)) brightness(1.2)",
                }}
              />
            </div>

            {/* Top Coin - Starts behind center, moves diagonally up-left, ends up in front */}
            <div
              id="top_coin"
              className="absolute inset-0 w-full h-auto"
              style={{ zIndex: 1 }}
            >
              <img
                src="/b-coin.svg"
                alt="Top coin"
                className="w-full h-auto object-contain"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3)) brightness(1.1)",
                }}
              />
            </div>
          </div>

          {/* Transparent Black Overlay between coins and text */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none"
            style={{ 
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(1px)'
            }}
          ></div>

          {/* Overlay Text */}
          <div
            id="instant_content"
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            style={{ opacity: 0, transform: "translateY(50px)" }}
          >
            <div className="flex flex-col items-start leading-tight">
              {/* First line group */}
              <div className="flex flex-col">
                <span
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-amber-50"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 200,
                    fontStyle: "italic",
                    fontSize: "75.35px",
                    fontOpticalSizing: "auto",
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  B-Coin
                </span>
                <div className="flex items-baseline">
                  <span
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-amber-50 mr-2"
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: 200,
                      fontStyle: "italic",
                      fontSize: "75.35px",
                      fontOpticalSizing: "auto",
                      textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                    }}
                  >
                    Instant Value
                  </span>
                  <span
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white"
                    style={{
                      fontSize: "75.35px",
                      textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                    }}
                  >
                    —
                  </span>
                  <span
                    className="ml-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white font-serif font-bold"
                    style={{
                      fontFamily: '"EB Garamond", serif',
                      fontSize: "84.04px",
                      fontWeight: 500,
                      fontStyle: "normal",
                      textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                    }}
                  >
                    SHARED
                  </span>
                </div>
              </div>

              {/* Second line */}
              <span
                className="self-end text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-amber-50"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 200,
                  fontSize: "75.35px",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
                }}
              >
                Instantly
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none z-0" />
      </div>
    </div>
  );
};

export default Hero;
