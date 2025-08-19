import React from "react";
import { GridBackground } from "../Themes/Gridbackground";
import BaFTCoinSection from "./BaFTCoinSection";
import BInstantSection from "./BInstantSection";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const simulateScroll = () => {
  const targetScrollPosition = window.innerHeight * 3;
  const startPosition = window.pageYOffset;
  const distance = targetScrollPosition - startPosition;
  const duration = 1500;
  let startTime = null;

  const scrollAnimation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeInOutQuad = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const currentPosition = startPosition + distance * easeInOutQuad;
    window.scrollTo(0, currentPosition);
    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
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
        simulateScroll();
      }}
      className="group flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-6 sm:py-3 text-white cursor-pointer transition-all duration-300 hover:scale-105"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "50px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
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

// Animation helpers and timeline logic (moved from Hero.jsx)
let coinFloatTween = null;

const startBaftCoinFloat = () => {
  if (coinFloatTween) return;
  coinFloatTween = gsap.to("#B_coin", {
    y: -20,
    duration: 1.8,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
};

const stopBaftCoinFloat = () => {
  if (coinFloatTween) {
    coinFloatTween.kill();
    coinFloatTween = null;
    gsap.set("#B_coin", { y: 0 });
  }
};

const HeroContainer = () => {
  const getResponsiveGradient = () => {
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

  const computeVideoTargetY = () => {
    const viewportHeight = window.innerHeight || 0;
    const textEl = document.getElementById("text");
    const textRect = textEl ? textEl.getBoundingClientRect() : { bottom: viewportHeight * 0.25 };
    const topMargin = Math.max(12, Math.min(48, viewportHeight * 0.03));
    const yPixels = textRect.bottom + topMargin;
    return Math.max(yPixels, 0);
  };

  const initializeAnimation = () => {
    gsap.set(["#baft_coin_section", "#b_instant_section"], { opacity: 0 });
    gsap.set("#Hero", { opacity: 1 });
    gsap.set("#videoElement", { opacity: 1, scale: 1, y: 0, x: 0 });
    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.8 });
    gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });

    const videoGradient = document.getElementById('videoGradient');
    if (videoGradient) {
      videoGradient.style.backgroundImage = getResponsiveGradient();
    }

    setTimeout(startVideoShrinkAnimation, 7000);
  };

  const startVideoShrinkAnimation = () => {
    const getResponsiveScale = () => {
      const width = window.innerWidth;
      if (width >= 2560) return 0.35;
      if (width >= 1920) return 0.4;
      if (width >= 1440) return 0.42;
      if (width >= 1024) return 0.45;
      if (width >= 768) return 0.6;
      if (width >= 414) return 0.7;
      return 0.65;
    };

    const targetScale = getResponsiveScale();
    const targetY = computeVideoTargetY();

    gsap.to("#videoElement", {
      scale: targetScale,
      x: 0,
      y: targetY,
      opacity: 0.9,
      borderRadius: "0px",
      filter: "brightness(1.0) contrast(1.25) saturate(1.15)",
      duration: 1.6,
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
      setTimeout(startVideoShrinkAnimation, 9500);
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
      borderRadius: "0px",
      filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
    });

    const video = document.getElementById("videoElement");
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  const setupScrollTrigger = () => {
    ScrollTrigger.create({
      trigger: "#hero_container",
      start: "top center",
      end: "bottom center",
      onLeave: () => {},
      onEnter: () => {},
      onLeaveBack: reverseAnimation,
      onEnterBack: startVideoShrinkAnimation,
    });

    ScrollTrigger.create({
      trigger: "#baft_coin_section",
      start: "top center",
      end: "bottom center",
      onEnter: startBaftCoinFloat,
      onEnterBack: startBaftCoinFloat,
      onLeave: stopBaftCoinFloat,
      onLeaveBack: stopBaftCoinFloat,
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
        borderRadius: "0px",
        filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
        duration: 1.2,
        ease: "power2.out",
      });
    }, 300);
  };

  const startCoinAnimation = () => {
    gsap.set("#top_coin", { x: 0, y: 0, zIndex: 1 });
    gsap.set("#center_coin", { zIndex: 2 });
    gsap.set("#bottom_coin", { x: 0, y: 0, zIndex: 1 });
    gsap.set("#instant_content", { opacity: 0, y: 50 });

    const coinTimeline = gsap.timeline();
    coinTimeline
      .to("#instant_content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2
      })
      .to("#top_coin", {
        x: -60,
        y: -80,
        zIndex: 3,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.3
      }, "<0.5")
      .to("#bottom_coin", {
        x: 60,
        y: 80,
        duration: 1.5,
        ease: "power2.out"
      }, "<0")
      .to("#center_coin", {
        rotationY: 0,
        duration: 1.2,
        ease: "power2.out"
      }, "<0");
  };

  const setupScrollTimeline = () => {
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero_container",
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true,
      },
    });

    scrollTimeline
      .to("#grid_container", { opacity: 0, duration: 1 }, "+=3")
      .to("#text", { opacity: 0, duration: 1 }, "<")
      .to("#scroll_button", { opacity: 0, y: 20, visibility: "hidden", duration: 0.5 }, "<")
      .to("#videoElement", { opacity: 0, duration: 1 }, "<")
      .to("#baft_coin_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .from(["#introduction", "#baft_coin_text", "#B_coin"], {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
      })
      .call(() => startBaftCoinFloat())
      .to("#baft_coin_section", { opacity: 0, duration: 1 }, "+=1")
      .call(() => stopBaftCoinFloat(), null, "<")
      .to("#Hero", { opacity: 0, duration: 0.5 }, "<")
      .to("#b_instant_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .call(() => startCoinAnimation());
  };

  useGSAP(() => {
    const handleResize = () => {
      const videoGradient = document.getElementById('videoGradient');
      if (videoGradient) {
        videoGradient.style.backgroundImage = getResponsiveGradient();
      }
      const currentScale = Number(gsap.getProperty("#videoElement", "scale")) || 1;
      if (currentScale < 0.99) {
        const targetY = computeVideoTargetY();
        gsap.set("#videoElement", { y: targetY });
      }
    };

    initializeAnimation();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    setupScrollTrigger();
    setupScrollTimeline();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  });

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
      <BaFTCoinSection />
      <BInstantSection />
      <ScrollButton />
    </div>
  );
};

export default HeroContainer;


