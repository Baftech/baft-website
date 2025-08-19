import React, { useState, useEffect } from "react";
import { GridBackground } from "../Themes/Gridbackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(useGSAP, ScrollTrigger);


const Hero_1 = () => {
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
      // Large screens - wide ellipse
      return `radial-gradient(ellipse 70% 50% at center, 
               transparent 20%, 
               rgba(0, 0, 0, 0.1) 40%, 
               rgba(0, 0, 0, 0.4) 70%, 
               rgba(0, 0, 0, 0.8) 100%)`;
    } else if (width >= 768) {
      // Medium screens - slightly narrower ellipse
      return `radial-gradient(ellipse 65% 55% at center, 
               transparent 15%, 
               rgba(0, 0, 0, 0.1) 35%, 
               rgba(0, 0, 0, 0.4) 65%, 
               rgba(0, 0, 0, 0.8) 100%)`;
    } else {
      // Small screens - lighter gradient for better text readability
      return `radial-gradient(ellipse 80% 70% at center, 
               transparent 30%, 
               rgba(0, 0, 0, 0.1) 50%, 
               rgba(0, 0, 0, 0.3) 75%, 
               rgba(0, 0, 0, 0.7) 100%)`;
    }
  };

  return (
    <div className="absolute inset-0 z-10">
      {/* Responsive elliptical spotlight shadow effect */}
      <div 
        id="videoGradient"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          // Use backgroundImage instead of background to avoid conflict with backgroundClip
          backgroundImage: getResponsiveGradient(),
        }}
      />
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
          borderRadius: "0px",
          boxShadow: "none",
          border: "none",
          filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
        }}
      />
    </div>
  );
};

// Helper functions for responsive text styling
const getResponsiveTextColor = () => {
  if (typeof window === 'undefined') return "#888888";
  const width = window.innerWidth;
  if (width >= 1024) return "#777575"; // Desktop - darker
  return "#999999"; // Mobile/tablet - lighter for better contrast
};

const getResponsiveFontSize = () => {
  if (typeof window === 'undefined') return "clamp(48px, 8vw, 140px)";
  const width = window.innerWidth;
  
  // Ultra-wide monitors
  if (width >= 2560) return "clamp(80px, 6vw, 180px)";
  // Large desktop monitors
  if (width >= 1920) return "clamp(70px, 7vw, 160px)";
  // Standard desktop/laptop
  if (width >= 1440) return "clamp(60px, 8vw, 150px)";
  // Small laptops
  if (width >= 1024) return "clamp(50px, 9vw, 140px)";
  // Tablets
  if (width >= 768) return "clamp(45px, 10vw, 120px)";
  // Large mobile phones
  if (width >= 414) return "clamp(50px, 13vw, 110px)";
  // Standard mobile phones - larger text for top positioning
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
    // Desktop - original darker gradient
    return "linear-gradient(165.6deg, #999999 32.7%, #161616 70.89%)";
  } else {
    // Mobile/tablet - lighter gradient for better visibility
    return "linear-gradient(165.6deg, #CCCCCC 32.7%, #444444 70.89%)";
  }
};

const getResponsiveTextShadow = () => {
  if (typeof window === 'undefined') return "0 2px 10px rgba(0,0,0,0.5)";
  const width = window.innerWidth;
  
  if (width >= 1024) {
    // Desktop - subtle shadow
    return "0 1px 5px rgba(0,0,0,0.3)";
  } else {
    // Mobile/tablet - stronger shadow for readability
    return "0 2px 15px rgba(0,0,0,0.7)";
  }
};

const OverlayText = () => {
  const getResponsivePadding = () => {
    if (typeof window === 'undefined') return { paddingTop: "18vh", paddingBottom: "6vh" };
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Ultra-wide monitors
    if (width >= 2560) {
      return { paddingTop: "15vh", paddingBottom: "5vh" };
    }
    // Large desktop monitors (4K, 1440p)
    else if (width >= 1920) {
      return { paddingTop: "16vh", paddingBottom: "5vh" };
    }
    // Standard desktop/laptop (1080p)
    else if (width >= 1440) {
      return { paddingTop: "17vh", paddingBottom: "5vh" };
    }
    // Small laptops/large tablets
    else if (width >= 1024) {
      return { paddingTop: "18vh", paddingBottom: "6vh" };
    }
    // Tablets (iPad, Surface)
    else if (width >= 768) {
      return { paddingTop: "12vh", paddingBottom: "4vh" };
    }
    // Large mobile phones (iPhone Pro Max, etc.)
    else if (width >= 414) {
      return { paddingTop: "5vh", paddingBottom: "3vh" };
    }
    // Standard mobile phones - text very close to top
    else {
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
            fontSize: "clamp(14px, 3vw, 24px)", // Better scaling across all devices
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
}
export default Hero_1;