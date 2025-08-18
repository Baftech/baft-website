import React, { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Instant = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, 1000); // delay text animation
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Coin separation animation
    const coinTimeline = gsap.timeline({ delay: 0.5 });
    
    coinTimeline
      .to("#top-coin", {
        x: -150,
        y: -120,
        rotation: -15,
        duration: 1.5,
        ease: "power2.out",
      })
      .to("#bottom-coin", {
        x: 150,
        y: 120,
        rotation: 15,
        duration: 1.5,
        ease: "power2.out",
      }, 0); // Start at the same time as top coin

    // Text animation
    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#introduction",
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: false,
      },
    });
    t1.fromTo(
      "#instant",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#b_instant",
          start: "top 80%",
          toggleActions: "play none none reverse",
          markers: false,
        },
      }
    );
    
  }, []);

  return (
    <section
      
      className="relative bg-black w-full min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      {/* Stacked Coins Container */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Bottom Coin - behind others */}
        <img 
          id="bottom-coin"
          src="/b-coin.svg" 
          alt="Bottom Coin" 
          className="absolute w-80 h-80 object-contain"
          style={{ zIndex: 1 }}
        />
        
        {/* Center Coin - middle layer */}
        <img 
          id="center-coin"
          src="/b-coin.svg" 
          alt="Center Coin" 
          className="absolute w-80 h-80 object-contain"
          style={{ zIndex: 2 }}
        />
        
        {/* Top Coin - front layer */}
        <img 
          id="top-coin"
          src="/b-coin.svg" 
          alt="Top Coin" 
          className="absolute w-80 h-80 object-contain"
          style={{ zIndex: 3 }}
        />
      </div>
      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        {/* Overlay text */}
        <div
          id="instant"
          className={`absolute inset-0 flex flex-row items-center justify-center gap-4 whitespace-nowrap z-20 pointer-events-none transition-opacity duration-500 ${
            showOverlayText ? "opacity-100" : "opacity-0"
          }`}
        >
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
            <br />
            Instant Value
          </span>

          <span
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-white"
            style={{
              fontSize: "75.35px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            <br />—
          </span>
          <div id="instant" className="flex flex-col items-center">
            <span
             
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-amber-50"
              style={{
                fontFamily: '"EB Garamond", serif',
                fontWeight: 500,
                fontSize: "84.04px",
                fontStyle: "normal",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            >
              <br />
              <br />
              SHARED
            </span>

            <span
              
              className="mb-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-amber-50"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 200,
                fontStyle: "italic",
                fontSize: "75.35px",
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