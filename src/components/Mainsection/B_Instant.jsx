import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Instant = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlayText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Set initial states for coin animations
    gsap.set("#top_coin", { x: 0, y: 0, scale: 0.8, opacity: 0.7, zIndex: 1 });
    gsap.set("#center_coin", { scale: 0.8, opacity: 0.7, zIndex: 2 });
    gsap.set("#bottom_coin", { x: 0, y: 0, scale: 0.8, opacity: 0.7, zIndex: 1 });
    gsap.set("#instant_content", { opacity: 0, y: 50, scale: 0.9 });

    // Create scroll-triggered animation for B-Instant section
    ScrollTrigger.create({
      trigger: "#b_instant_section",
      start: "top 80%", // Start when section enters viewport
      end: "bottom 20%", // End when section nearly exits viewport
      scrub: 1, // Smooth scroll-linked animation
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Text animation - appears earlier and stays visible
        gsap.set("#instant_content", {
          y: (1 - progress) * 50, // Start 50px below, move to 0
          scale: 0.9 + (progress * 0.1), // Scale from 0.9 to 1.0
          opacity: Math.max(0.8, progress) // Start at 80% opacity, fade in to 100%
        });
        
        // Center coin animation - smooth scaling and positioning
        gsap.set("#center_coin", {
          scale: 0.8 + (progress * 0.2), // Scale from 0.8 to 1.0
          opacity: Math.max(0.8, progress), // High opacity throughout
          zIndex: 2
        });
        
        // Top coin animation - move diagonally up-left
        gsap.set("#top_coin", {
          x: progress * -80, // Move left as animation progresses
          y: progress * -60, // Move up as animation progresses
          scale: 0.8 + (progress * 0.2),
          opacity: Math.max(0.7, progress * 0.9),
          zIndex: progress > 0.6 ? 3 : 1 // Come to front after 60% progress
        });
        
        // Bottom coin animation - move diagonally down-right
        gsap.set("#bottom_coin", {
          x: progress * 80, // Move right as animation progresses
          y: progress * 60, // Move down as animation progresses
          scale: 0.8 + (progress * 0.2),
          opacity: Math.max(0.7, progress * 0.9),
          zIndex: 1
        });
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === "#b_instant_section") {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <section
      id="b_instant_section"
      data-theme="dark"
      className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Centered container */}
      <div className="relative flex items-center justify-center w-full h-full max-w-7xl mx-auto">
        
        {/* Coin Stack Container */}
        <div className="relative max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[30rem] w-full h-auto">
          
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
          className="absolute inset-0 bg-black bg-opacity-20 z-10 pointer-events-none"
          style={{ 
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(1px)'
          }}
        ></div>

        {/* Overlay Text */}
        <div
          id="instant_content"
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4 sm:px-6 md:px-8"
          style={{ opacity: 0, transform: "translateY(50px)" }}
        >
          <div className="flex flex-col items-start leading-tight text-center sm:text-left">
            {/* First line group */}
            <div className="flex flex-col">
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 200,
                  fontStyle: "italic",
                  fontOpticalSizing: "auto",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                B-Coin
              </span>
              <div className="flex items-baseline flex-wrap">
                <span
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50 mr-1 sm:mr-2"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 200,
                    fontStyle: "italic",
                    fontOpticalSizing: "auto",
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  Instant Value
                </span>
                <span
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white"
                  style={{
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  —
                </span>
                <span
                  className="ml-1 sm:ml-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white font-serif font-bold"
                  style={{
                    fontFamily: '"EB Garamond", serif',
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
              className="self-end text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50 mt-2 sm:mt-0"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 200,
                fontStyle: "italic",
                fontOpticalSizing: "auto",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            >
              Instantly
            </span>
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none z-0" />
    </section>
  );
};

export default B_Instant;