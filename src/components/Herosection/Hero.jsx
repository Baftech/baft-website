import React, { useState, useEffect } from "react";
import {GridBackground} from "../Themes/Gridbackground";
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

  useGSAP(() => {
  gsap.set(["#baft_coin_section", "#b_instant_section"], { opacity: 0 });

  // 1️⃣ Time-based animation inside Hero
  ScrollTrigger.create({
    trigger: "#hero_container",
    start: "top top",
    end: "+=100%", // only runs while Hero is in view
    onEnter: () => {
      const heroTl = gsap.timeline();
      heroTl
        .fromTo("#videoElement", 
          { opacity: 0, scale: 1 },
          { opacity: 1, duration: 1 }
        )
        .to("#videoElement", {
          scale: 0.4,
          duration: 2,
          ease: "power2.out",
          delay: 7 // wait before compressing
        })
        .fromTo("#text", 
          { opacity: 0, y: 50, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 2 },
          "<"
        );
    },
    onLeaveBack: () => {
      gsap.set(["#videoElement", "#text"], { clearProps: "all" });
    }
  });

  // 2️⃣ Scroll-based transition between sections
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero_container",
      start: "top top",
      end: "+=3000",
      scrub: true,
      pin: true,
    }
  });

  tl.to("#Hero", { opacity: 0, duration: 1 }, "+=1")
    .to("#baft_coin_section", { opacity: 1, y: 0, duration: 1 }, "<")
    .from(["#introduction", "#baft_coin_text", "#B_coin"], {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1
    })
    .to("#baft_coin_section", { opacity: 0, duration: 1 }, "+=1")
    .to("#b_instant_section", { opacity: 1, y: 0, duration: 1 }, "<")
    .from("#instant_content", {
      opacity: 0,
      y: 50,
      duration: 1
    });
});

  

  return (
    <div id="hero_container" className="relative w-full h-[300vh]">
      {/* Original Hero Section */}
      <div 
        id="Hero" 
        data-theme='dark' 
        className="absolute top-0 w-full h-screen bg-black overflow-hidden z-10"
      >

        <GridBackground />
        {/* <GridBackground className="absolute inset-0 z-0" />
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent to-black to-[65%]" /> */}
        
        {/* Video */}
        <div className="absolute top-20 rounded-lg overflow-hidden mb-5 z-10">
          <video
            id="videoElement"
            src="/BAFT Vid 2_1.mp4"
            style={{ opacity: 0 }}
            autoPlay
            muted
            playsInline
          />
        </div>
        
        {/* Text overlay */}
        <div className="absolute top-0 bottom-35 left-2 right-2 flex items-center justify-center pointer-events-none z-20">
          <img 
            id="text" 
            src="/headline.png" 
            alt="Headline"
            className="max-w-full max-h-full object-contain"
          />
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

        {/* Text Overlay */}
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

      {/* B_Instant Section */}
      <div
        id="b_instant_section"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden z-30"
        style={{ isolation: "isolate" }}
      >
        <img id="stacked_coins" src="/b-coin.svg" alt="Stacked Coins" />
        
        <div className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          {/* Overlay text */}
          <div
            id="instant_content"
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
            
            <div className="flex flex-col items-center">
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
      </div>
    </div>
  );
}

export default Hero;