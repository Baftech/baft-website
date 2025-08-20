import React from "react";
import { GridBackground } from "../Themes/Gridbackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const VideoElement = () => {
  const getResponsiveGradient = () => {
    if (typeof window === 'undefined') {
      return `radial-gradient(ellipse 70% 50% at center, 
               transparent 20%, 
               rgba(0, 0, 0, 0.1) 40%, 
               rgba(0, 0, 0, 0.4) 70%, 
               rgba(0, 0, 0, 0.8) 100%)`;
    }
    const width = window.innerWidth;
    if (width >= 1024) {
      return `radial-gradient(ellipse 70% 50% at center, 
               transparent 20%, 
               rgba(0, 0, 0, 0.1) 40%, 
               rgba(0, 0, 0, 0.4) 70%, 
               rgba(0, 0, 0, 0.8) 100%)`;
    } else if (width >= 768) {
      return `radial-gradient(ellipse 65% 55% at center, 
               transparent 15%, 
               rgba(0, 0, 0, 0.1) 35%, 
               rgba(0, 0, 0, 0.4) 65%, 
               rgba(0, 0, 0, 0.8) 100%)`;
    } else {
      return `radial-gradient(ellipse 80% 70% at center, 
               transparent 30%, 
               rgba(0, 0, 0, 0.1) 50%, 
               rgba(0, 0, 0, 0.3) 75%, 
               rgba(0, 0, 0, 0.7) 100%)`;
    }
  };

  return (
    <div className="absolute inset-0 z-10">
      <div 
        id="videoGradient"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: getResponsiveGradient(),
        }}
      />
      <video
        id="videoElement"
        src="/BAFT Vid 2_1.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/baft_video.gif"
        className="w-full h-full object-cover"
        style={{
          transformOrigin: "top center",
          opacity: 1,
          borderRadius: "0px",
          boxShadow: "none",
          border: "none",
          filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
        }}
      />
    </div>
  );
};

// Helpers for responsive text styling
const getResponsiveTextColor = () => {
  if (typeof window === 'undefined') return "#888888";
  const width = window.innerWidth;
  if (width >= 1024) return "#777575";
  return "#999999";
};

const getResponsiveFontSize = () => {
  if (typeof window === 'undefined') return "clamp(48px, 8vw, 140px)";
  const width = window.innerWidth;
  if (width >= 2560) return "clamp(80px, 6vw, 180px)";
  if (width >= 1920) return "clamp(70px, 7vw, 160px)";
  if (width >= 1440) return "clamp(60px, 8vw, 150px)";
  if (width >= 1024) return "clamp(50px, 9vw, 140px)";
  if (width >= 768) return "clamp(45px, 10vw, 120px)";
  if (width >= 414) return "clamp(50px, 13vw, 110px)";
  return "clamp(45px, 14vw, 95px)";
};

const getResponsiveLineHeight = () => {
  if (typeof window === 'undefined') return "clamp(52px, 9vw, 160px)";
  const width = window.innerWidth;
  if (width >= 2560) return "clamp(85px, 6.5vw, 200px)";
  if (width >= 1920) return "clamp(75px, 7.5vw, 180px)";
  if (width >= 1440) return "clamp(65px, 8.5vw, 170px)";
  if (width >= 1024) return "clamp(55px, 9.5vw, 160px)";
  if (width >= 768) return "clamp(50px, 10.5vw, 140px)";
  if (width >= 414) return "clamp(55px, 14vw, 125px)";
  return "clamp(50px, 15vw, 110px)";
};

const getResponsiveGradientText = () => {
  if (typeof window === 'undefined') return "linear-gradient(165.6deg, #999999 32.7%, #161616 70.89%)";
  const width = window.innerWidth;
  if (width >= 1024) {
    return "linear-gradient(165.6deg, #999999 32.7%, #161616 70.89%)";
  } else {
    return "linear-gradient(165.6deg, #CCCCCC 32.7%, #444444 70.89%)";
  }
};

const getResponsiveTextShadow = () => {
  if (typeof window === 'undefined') return "0 2px 10px rgba(0,0,0,0.5)";
  const width = window.innerWidth;
  if (width >= 1024) {
    return "0 1px 5px rgba(0,0,0,0.3)";
  } else {
    return "0 2px 15px rgba(0,0,0,0.7)";
  }
};

const getResponsiveScale = () => {
  if (typeof window === 'undefined') return 0.45;
  const width = window.innerWidth;
  if (width >= 2560) return 0.35;
  if (width >= 1920) return 0.4;
  if (width >= 1440) return 0.42;
  if (width >= 1024) return 0.45;
  if (width >= 768) return 0.6;
  if (width >= 414) return 0.7;
  return 0.65;
};

const OverlayText = () => {
  const getResponsivePadding = () => {
    if (typeof window === 'undefined') return { paddingTop: "18vh", paddingBottom: "6vh" };
    const width = window.innerWidth;
    if (width >= 2560) {
      return { paddingTop: "15vh", paddingBottom: "5vh" };
    } else if (width >= 1920) {
      return { paddingTop: "16vh", paddingBottom: "5vh" };
    } else if (width >= 1440) {
      return { paddingTop: "17vh", paddingBottom: "5vh" };
    } else if (width >= 1024) {
      return { paddingTop: "18vh", paddingBottom: "6vh" };
    } else if (width >= 768) {
      return { paddingTop: "12vh", paddingBottom: "4vh" };
    } else if (width >= 414) {
      return { paddingTop: "5vh", paddingBottom: "3vh" };
    } else {
      return { paddingTop: "6vh", paddingBottom: "3vh" };
    }
  };

  return (
    <div 
      id="text" 
      className="absolute top-0 left-0 right-0 flex flex-col items-center justify-start pointer-events-none z-30" 
      style={getResponsivePadding()}
    >
      <div className="text-center flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16" style={{ maxWidth: "95vw" }}>
        <p
          className="tracking-tight mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 w-full"
          style={{
            fontFamily: "GeneralSans-Medium",
            fontWeight: 500,
            fontSize: "clamp(14px, 3vw, 24px)",
            lineHeight: "130%",
            letterSpacing: "0",
            textAlign: "center",
            color: getResponsiveTextColor()
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
            fontSize: getResponsiveFontSize(),
            lineHeight: getResponsiveLineHeight(),
            textAlign: "center",
            backgroundImage: getResponsiveGradientText(),
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            flex: "none",
            order: 1,
            flexGrow: 0,
            wordBreak: "keep-all",
            whiteSpace: "nowrap",
            overflow: "visible",
            paddingBottom: "clamp(0.8rem, 2vw, 1.5rem)",
            textShadow: getResponsiveTextShadow()
          }}
        >
          Do Money, Differently.
        </h1>
      </div>
    </div>
  );
};

const HeroSlide = () => {
  useGSAP(() => {
    // Initially hide everything except video
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.8, visibility: "hidden" });
    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#videoGradient", { opacity: 0 });

    // After 8 seconds, start the transition
    setTimeout(() => {
      // Show video gradient
      gsap.to("#videoGradient", { opacity: 1, duration: 1 });
      
      // Shrink video and move it under text
      const targetScale = getResponsiveScale();
      const targetY = window.innerHeight * 0.6; // Position under text
      
      gsap.to("#videoElement", {
        scale: targetScale,
        y: targetY,
        opacity: 0.9,
        borderRadius: "0px",
        filter: "brightness(1.0) contrast(1.25) saturate(1.15)",
        duration: 1.6,
        ease: "power2.out",
      });

      // Show grid background
      gsap.to("#grid_container", { 
        opacity: 1, 
        duration: 1.5 
      });

      // Show text with animation
      gsap.to("#text", {
        opacity: 1,
        y: 0,
        scale: 1,
        visibility: "visible",
        duration: 2,
        delay: 0.3,
        ease: "power2.out",
      });
    }, 8000); // 8 seconds delay
  }, []);

  return (
    <div 
      id="Hero"
      data-theme="dark"
      className="relative w-full h-screen bg-black overflow-hidden z-10"
    >
      <div id="grid_container" style={{ opacity: 0 }}>
        <GridBackground />
      </div>
      <VideoElement />
      <OverlayText />
    </div>
  );
};

export default HeroSlide;
