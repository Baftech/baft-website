import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackground } from "../Themes/Grid_coins";
import { B_COIN_IMAGE_PNG } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const BaftCoinMobile = () => {
  const introRef = useRef(null);
  const coinRef = useRef(null);
  const animationRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useLayoutEffect(() => {
    // Only proceed if refs are available
    if (!introRef.current || !coinRef.current) return;

    // Kill any existing animations first
    if (animationRef.current) {
      gsap.killTweensOf(animationRef.current);
      animationRef.current = null;
    }

    // Reset coin animation properties for mobile
    gsap.set(coinRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: 0,
    });

    const ctx = gsap.context(() => {
      // Create a timeline optimized for mobile
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
          end: "bottom center",
          toggleActions: "play none none reverse",
          onEnter: () => {
            if (hasAnimatedRef.current) return;
            hasAnimatedRef.current = true;
          },
          onLeave: () => {
            hasAnimatedRef.current = false;
          },
          onEnterBack: () => {
            if (hasAnimatedRef.current) return;
            hasAnimatedRef.current = true;
          },
          onLeaveBack: () => {
            hasAnimatedRef.current = false;
          }
        }
      });

      // Mobile-optimized animation sequence with synchronized coin and text movement
      tl.fromTo(
        ".intro-text",
        {
          opacity: 0,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
        },
        {
          opacity: 1,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          duration: 1.5,
          ease: "power2.out",
        }
      )
      .fromTo(
        ".coin-text",
        {
          opacity: 0,
          scale: 0.9,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          duration: 1.5,
          ease: "power2.out",
        },
        "-=0.8"
      )
      .fromTo(coinRef.current, 
        {
          opacity: 0,
          scale: 0.8,
          rotation: 0,
          y: "100vh",
          bottom: "auto",
        },
        {
          opacity: 0.3,
          scale: 1,
          rotation: 0,
          y: 0,
          top: "50vh",
          left: "50%",
          xPercent: -50,
          duration: 2.5,
          ease: "power2.out",
          onComplete: () => {
            // Gentle floating animation for mobile
            if (coinRef.current) {
              animationRef.current = gsap.to(coinRef.current, {
                y: -20,
                duration: 3,
                ease: "power2.out",
              });
            }
          }
        }, "-=1.0")
      .to(".intro-text", {
        y: "-15vh",
        duration: 2.5,
        ease: "none",
      }, "<")
      .to(".coin-text", {
        y: "-15vh",
        duration: 2.5,
        ease: "none",
      }, "<")
      .to(".coin-text", {
        textShadow: "0px -2px 16px rgba(255,255,255,0.2)",
        duration: 2.5,
        ease: "power2.out",
      }, "<")
      .to(".intro-text, .coin-text", {
        filter: "none",
        duration: 0.01,
        ease: "none",
      }, "-=2.0");
    }, introRef);

    return () => {
      // Clean up animations safely
      if (coinRef.current) {
        gsap.killTweensOf(coinRef.current);
      }
      if (animationRef.current) {
        gsap.killTweensOf(animationRef.current);
        animationRef.current = null;
      }
      hasAnimatedRef.current = false;
      
      // Safely revert context with proper error handling
      try {
        if (ctx && typeof ctx.revert === 'function') {
          ctx.revert();
        }
      } catch (error) {
        console.warn('GSAP context cleanup warning:', error);
      }
    };
  }, []);

  return (
    <section
      ref={introRef}
      className="relative w-full h-screen flex flex-col items-center justify-center bg-black text-center overflow-hidden px-4"
    >
      <div id="grid_container" className="absolute inset-0 opacity-100 z-0">
        <GridBackground />
      </div>
      
      {/* Coin Image - Positioned by GSAP */}
      <div className="absolute inset-0 z-10">
        <img
          ref={coinRef}
          src={B_COIN_IMAGE_PNG}
          alt="BaFT Coin"
          className="absolute h-auto w-[80vw] max-w-[400px] opacity-0"
        />
      </div>

      {/* Mobile-optimized Text Layout */}
      <div className="z-10 relative z-20 mb-6">
        <h2
          className="intro-text text-white eb-garamond-intro text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight font-normal mb-8 opacity-0"
        >
          Introducing
        </h2>
        <h1
          className="coin-text eb-garamond-intro font-medium leading-tight text-7xl sm:text-8xl md:text-9xl lg:text-[120px] xl:text-[140px] text-transparent bg-clip-text bg-[linear-gradient(197.98deg,#999999_12.89%,#3D3D3D_73.42%)] [--tw-text-stroke:1px_rgba(255,255,255,0.5)] [webkit-text-stroke:var(--tw-text-stroke)] [text-stroke:var(--tw-text-stroke)] opacity-0"
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaftCoinMobile;
