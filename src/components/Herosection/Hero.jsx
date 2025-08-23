import React, { useState, useEffect } from "react";
import HeroContainer from "./HeroContainer";
import BaFTCoinSection from "./BaFTCoinSection";
import BInstantSection from "./BInstantSection";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  let coinFloatTween = null;

  const startBaftCoinFloat = () => {
    if (coinFloatTween) return;
    coinFloatTween = gsap.to("#B_coin", {
      y: -20,
      duration: 2.4,
      yoyo: true,
      repeat: -1,
      ease: "power2.inOut",
    });
  };

  const stopBaftCoinFloat = () => {
    if (coinFloatTween) {
      coinFloatTween.kill();
      coinFloatTween = null;
      gsap.set("#B_coin", { y: 0 });
    }
  };
  const [showOverlayText, setShowOverlayText] = useState(false);
  const [coinAnimationStarted, setCoinAnimationStarted] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlayText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getResponsiveGradient = () => {
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

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      
      // Update gradient on resize
      const videoGradient = document.getElementById('videoGradient');
      if (videoGradient) {
        videoGradient.style.backgroundImage = getResponsiveGradient();
      }

      // If video is already shrunk, keep it aligned under the text on resize
      const currentScale = Number(gsap.getProperty("#videoElement", "scale")) || 1;
      if (currentScale < 0.99) {
        const targetY = computeVideoTargetY(currentScale);
        gsap.set("#videoElement", { y: targetY });
      }
    };

    // Set initial size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    gsap.set("#videoElement", { opacity: 1, scale: 1, y: 0, x: 0 });
    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.8 });
    gsap.set("#scroll_button", { opacity: 0, visibility: "hidden", y: 20 });

    // Ensure video is visible immediately
    gsap.set("#videoElement", { opacity: 1 });
    setTimeout(startVideoShrinkAnimation, 7000);
  };

  const startVideoShrinkAnimation = () => {
    // Ensure video is playing before starting animation
    const video = document.getElementById("videoElement");
    if (video && video.paused) {
      video.play().catch(() => {});
    }

    const getResponsiveScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Ultra-wide monitors (21:9, 32:9)
      if (width >= 2560) return 0.35;
      // Large desktop monitors (1440p, 4K)
      if (width >= 1920) return 0.4;
      // Standard desktop/laptop (1080p)
      if (width >= 1440) return 0.42;
      // Small laptops/large tablets
      if (width >= 1024) return 0.45;
      // Tablets (iPad, etc.)
      if (width >= 768) return 0.6;
      // Large mobile phones
      if (width >= 414) return 0.7;
      // Standard mobile phones - smaller to fit in bottom half
      return 0.65;
    };

    const computeVideoTargetY = (scale) => {
      const viewportHeight = window.innerHeight || 0;
      const textEl = document.getElementById("text");
      const textRect = textEl ? textEl.getBoundingClientRect() : { bottom: viewportHeight * 0.25 };
      const topMargin = Math.max(12, Math.min(48, viewportHeight * 0.03));
      // Because transformOrigin is set to top center, the visual top equals translateY
      const yPixels = textRect.bottom + topMargin;
      return Math.max(yPixels, 0);
    };

    const targetScale = getResponsiveScale();
    const targetY = computeVideoTargetY(targetScale);

    // Create a smooth timeline for all animations
    const tl = gsap.timeline({
      ease: "power3.out",
      smoothChildTiming: true
    });

    // Start all animations simultaneously for smooth motion
    tl.to("#videoElement", {
      scale: targetScale,
      x: 0,
      y: targetY,
      opacity: 0.9,
      borderRadius: "0px",
      filter: "brightness(1.0) contrast(1.25) saturate(1.15)",
      duration: 0.8,
      ease: "power3.out",
      // Ensure video continues playing during animation
      onUpdate: () => {
        const video = document.getElementById("videoElement");
        if (video && video.paused) {
          video.play().catch(() => {}); // Ignore autoplay errors
        }
      },
      onStart: () => {
        // Set up periodic video playback check during animation
        const video = document.getElementById("videoElement");
        if (video) {
          const playCheckInterval = setInterval(() => {
            if (video.paused) {
              video.play().catch(() => {});
            }
          }, 100); // Check every 100ms during animation
          
          // Clear interval when animation completes
          setTimeout(() => clearInterval(playCheckInterval), 800);
        }
      }
    }, 0)
    .to("#grid_container", { 
      opacity: 1, 
      duration: 0.8,
      ease: "power2.out"
    }, 0)
    .to("#text", {
      opacity: 1,
      y: 0,
      scale: 1,
      visibility: "visible",
      duration: 0.8,
      ease: "power3.out"
    }, 0.1) // Slight stagger for text
    .to("#scroll_button", {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.8,
      ease: "power3.out"
    }, 0.6); // Delayed appearance for scroll button
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

  const setupScrollListener = () => {
    window.addEventListener("scroll", handleScroll);
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

    // Floating coin only while BaFT Coin section is in view
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
    // Create a smooth reverse timeline
    const tl = gsap.timeline({
      ease: "power3.in",
      smoothChildTiming: true
    });

    tl.to(["#text", "#grid_container", "#scroll_button"], {
      opacity: 0,
      duration: 0.6,
      ease: "power3.in",
      stagger: 0.05
    })
    .to("#text", {
      y: 50,
      scale: 0.8,
      visibility: "hidden",
      duration: 0.6,
      ease: "power3.in"
    }, 0)
    .to("#scroll_button", {
      y: 20,
      visibility: "hidden",
      duration: 0.6,
      ease: "power3.in"
    }, 0)
    .to("#videoElement", {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 1,
      borderRadius: "0px",
      filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
      duration: 0.8,
      ease: "power3.out",
    }, 0.1);
  };

  const startCoinAnimation = () => {
    // Set initial states for coin animations
    gsap.set("#top_coin", { x: 0, y: 0, zIndex: 1 });
    gsap.set("#center_coin", { zIndex: 2 });
    gsap.set("#bottom_coin", { x: 0, y: 0, zIndex: 1 });
    gsap.set("#instant_content", { opacity: 0, y: 50 });

    // Create animation timeline for coins
    const coinTimeline = gsap.timeline();

    coinTimeline
      // Animate overlay text first
      .to("#instant_content", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2
      })
      // Animate coins with staggered delays
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
      }, "<0") // Start at same time as top coin
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
      .to("#scroll_button", { opacity: 0, y: 20, visibility: "hidden", duration: 0.5 }, "<") // Hide scroll button when leaving hero
      .to("#videoElement", { opacity: 0, duration: 1 }, "<") // Hide video background
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
      .to("#Hero", { opacity: 0, duration: 0.5 }, "<") // Hide entire hero section background
      .to("#b_instant_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .call(() => startCoinAnimation()); // Trigger coin animation when BInstantSection is visible
  };

  return (
    <div id="hero_container" className="relative w-full h-screen">
      <HeroContainer />
      <BaFTCoinSection />
      <BInstantSection />
    </div>
  );
};

export default Hero;