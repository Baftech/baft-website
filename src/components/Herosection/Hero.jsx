import React, { useState, useEffect } from "react";
import {GridBackground} from "../Themes/Gridbackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);
  const [coinAnimationStarted, setCoinAnimationStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlayText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    initializeAnimation();
    setupScrollListener();
    setupScrollTrigger();
    setupScrollTimeline();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const initializeAnimation = () => {
    gsap.set(["#baft_coin_section", "#b_instant_section"], { opacity: 0 });
    gsap.set("#Hero", { opacity: 1 });
    gsap.set("#videoElement", { opacity: 0, scale: 1, y: 0, x: 0 });
    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.8 });
    gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });
    
    gsap.to("#videoElement", { opacity: 1, duration: 1, delay: 0.9 });
    setTimeout(startVideoShrinkAnimation, 9500);
  };

  const startVideoShrinkAnimation = () => {
      gsap.to("#videoElement", {
      scale: 0.4,
      x: 0,
      y: "20%",
      opacity: 0.9,
      borderRadius: "20px",
        duration: 1.5,
        ease: "power2.out",
    });

    gsap.to("#grid_container", { opacity: 1, duration: 1.5 });
      gsap.to("#text", {
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        duration: 2,
        delay: 0.3,
      ease: "power2.out",
      });
      
      gsap.to("#scroll_button", {
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 1.5,
      delay: 1,
      ease: "power2.out",
      });
  };
      
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop === 0) {
      resetAnimation();
      setTimeout(startVideoShrinkAnimation, 5500);
    }
  };
        
  const resetAnimation = () => {
        gsap.killTweensOf(["#videoElement", "#text", "#grid_container"]);
        gsap.set("#text", { opacity: 0, y: 50, scale: 0.8, visibility: "hidden" });
        gsap.set("#grid_container", { opacity: 0 });
        gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });
        gsap.set("#videoElement", { 
          scale: 1,
          x: 0,
          y: 0,
          opacity: 1,
      borderRadius: "20px",
        });
        
        const video = document.getElementById("videoElement");
        if (video) {
          video.currentTime = 0;
          video.play();
        }
  };

  const setupScrollListener = () => {
    window.addEventListener("scroll", handleScroll);
  };

  const setupScrollTrigger = () => {
    ScrollTrigger.create({
      trigger: "#hero_container",
      start: "top center",
      end: "bottom center",
      onLeave: () => console.log("Scrolling past hero section"),
      onEnter: () => console.log("Entering hero section"),
      onLeaveBack: reverseAnimation,
      onEnterBack: startVideoShrinkAnimation,
    });
  };

  const reverseAnimation = () => {
        gsap.to("#text", {
          opacity: 0,
          y: 50,
          scale: 0.8,
          visibility: "hidden",
          duration: 0.8,
      ease: "power2.in",
    });
    gsap.to("#grid_container", { opacity: 0, duration: 0.8 });
        gsap.to("#scroll_button", {
          opacity: 0,
          y: 20,
          visibility: "hidden",
          duration: 0.8,
      ease: "power2.in",
        });
        
        setTimeout(() => {
          gsap.killTweensOf("#videoElement");
          gsap.to("#videoElement", {
            scale: 1,
            x: 0,
            y: 0,
            opacity: 1,
            borderRadius: "20px",
            duration: 1.2,
        ease: "power2.out",
      });
    }, 300);
  };



  const setupScrollTimeline = () => {
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero_container",
        start: "top top",
        end: "+=2000",
        scrub: true,
        pin: true,
      },
    });

    scrollTimeline
      .to("#grid_container", { opacity: 0, duration: 1 }, "+=2")
      .to("#text", { opacity: 0, duration: 1 }, "<")
      .to("#scroll_button", { opacity: 0, y: 20, visibility: "hidden", duration: 0.5 }, "<") // Hide scroll button when leaving hero
      .to("#videoElement", { opacity: 0, duration: 1 }, "<") // Hide video background
      .to("#baft_coin_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .from(["#introduction", "#baft_coin_text", "#B_coin"], {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
      })
      .to("#baft_coin_section", { opacity: 0, duration: 1 }, "+=1");
  };

  return (
    <div id="hero_container" className="relative w-full h-screen">
        <div 
          id="Hero" 
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black overflow-hidden z-10"
        >
        <div id="grid_container" style={{ opacity: 0 }}>
          <GridBackground />
        </div>
        <VideoElement />
        <OverlayText />
      </div>
      <ScrollButton />
      <BaFTCoinSection />
    </div>
  );
};

const VideoElement = () => (
  <div className="absolute inset-0 z-10">
          <video
            id="videoElement"
            src="/BAFT Vid 2_1.mp4"
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
        transformOrigin: "center center",
              opacity: 0,
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        border: "2px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
);

const OverlayText = () => (
  <div id="text" className="absolute top-0 left-0 right-0 flex flex-col items-center justify-start pointer-events-none z-30" style={{ paddingTop: "18vh", paddingBottom: "6vh" }}>
    <div className="text-center flex flex-col items-center w-full px-2 sm:px-4 md:px-6 lg:px-8" style={{ maxWidth: "95vw" }}>
      <p
        className="tracking-tight mb-6 sm:mb-8 md:mb-10 w-full"
        style={{
          fontFamily: "GeneralSans-Medium",
          fontWeight: 500,
          fontSize: "clamp(10px, 2vw, 20px)",
          lineHeight: "130%",
          letterSpacing: "0",
          textAlign: "center",
          color: "#777575"
        }}
      >
        The new-age finance app for your digital-first life.
      </p>
      <h1
        className="tracking-tight w-full"
        style={{
          width: "100%",
          maxWidth: "100vw",
          height: "auto",
          fontFamily: "EB Garamond",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: "clamp(60px, 9vw, 140px)",
          lineHeight: "clamp(60px, 9vw, 160px)",
          textAlign: "center",
          background: "linear-gradient(165.6deg, #999999 32.7%, #161616 70.89%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textFillColor: "transparent",
          flex: "none",
          order: 1,
          flexGrow: 0,
          wordBreak: "keep-all",
          whiteSpace: "nowrap",
          overflow: "visible",
          paddingBottom: "0.9rem"
        }}
      >
        Do Money, Differently.
      </h1>
    </div>
        </div>
);
        
const ScrollButton = () => (
        <div 
          id="scroll_button"
    className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50"
    style={{ opacity: 0, visibility: "hidden", pointerEvents: "auto" }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
        e.stopPropagation();
        console.log('Scroll button clicked'); // Debug log
        simulateScroll();
      }}
      className="group flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 text-white cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "50px",
        boxShadow:
          "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        pointerEvents: "auto"
      }}
      onMouseEnter={(e) => handleMouseEnter(e)}
      onMouseLeave={(e) => handleMouseLeave(e)}
    >
      <span className="text-xs sm:text-sm font-medium tracking-wide">Scroll Down</span>
      <svg
        width="16"
        height="16"
              viewBox="0 0 24 24" 
              fill="none" 
        className="sm:w-[18px] sm:h-[18px] transition-transform duration-300 group-hover:translate-y-1"
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
);

const simulateScroll = () => {
  console.log('simulateScroll called'); // Debug log
  
  // Trigger the scroll timeline by scrolling to a specific position
  // The scroll timeline is configured to show BaFT Coin section at specific scroll positions
  const targetScrollPosition = window.innerHeight * 3; // Scroll 3 viewport heights down
  const startPosition = window.pageYOffset;
  const distance = targetScrollPosition - startPosition;
  const duration = 1500;
  let startTime = null;

  const scrollAnimation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutQuad =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const currentPosition = startPosition + distance * easeInOutQuad;
    window.scrollTo(0, currentPosition);

    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    } else {
      console.log('Scroll animation completed'); // Debug log
    }
  };

  requestAnimationFrame(scrollAnimation);
};

const handleMouseEnter = (e) => {
  e.target.style.background = "rgba(255, 255, 255, 0.1)";
  e.target.style.borderColor = "rgba(255, 255, 255, 0.2)";
  e.target.style.boxShadow =
    "0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)";
};

const handleMouseLeave = (e) => {
  e.target.style.background = "rgba(255, 255, 255, 0.05)";
  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
  e.target.style.boxShadow =
    "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
};

const BaFTCoinSection = () => (
        <div
          id="baft_coin_section"
          data-theme="dark" 
    className="absolute top-0 w-full h-screen bg-black text-white flex items-center justify-center z-20 px-4 sm:px-6 md:px-8"
        >
        <img
          id="B_coin"
          src="b-coin image.png"
          alt="BaFT Coin Image"
      className="w-64 sm:w-80 md:w-96 lg:w-[500px] h-auto p-6 sm:p-8 md:p-10 opacity-30"
        />
    <div className="absolute flex flex-col items-center text-center">
           <h6
             id="introduction"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[55px] eb-garamond-introduction mb-2 sm:mb-3 md:mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
           >
             Introducing
           </h6>
           <h1
             id="baft_coin_text"
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
           >
             BaFT Coin
           </h1>
         </div>
      </div>
);


 
 export default Hero;
