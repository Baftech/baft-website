import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { GridBackground } from "../Themes/Grid_coins";
import { B_COIN_IMAGE_PNG } from "../../assets/assets";
import "./BaftCoinMobile.css";

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
      if (typeof animationRef.current.kill === 'function') {
        animationRef.current.kill();
      }
      gsap.killTweensOf(coinRef.current);
      animationRef.current = null;
    }

    // Reset coin animation properties for mobile - Safari optimized
    gsap.set(coinRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: 0,
      // Safari-specific properties
      force3D: true,
      transformOrigin: 'center center',
      WebkitTransformOrigin: 'center center',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden'
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

      // Mobile-optimized animation sequence with synchronized coin and text movement - Safari optimized
      tl.fromTo(
        ".intro-text",
        {
          opacity: 0,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          WebkitTransform: "translate(-50%, -50%)",
        },
        {
          opacity: 1,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          WebkitTransform: "translate(-50%, -50%)",
          duration: 1.5,
          ease: "power2.out",
          force3D: true,
          // Safari-specific optimizations
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
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
          WebkitTransform: "translate(-50%, -50%)",
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          x: "50%",
          left: "50%",
          top: "50vh",
          transform: "translate(-50%, -50%)",
          WebkitTransform: "translate(-50%, -50%)",
          duration: 1.5,
          ease: "power2.out",
          force3D: true,
          // Safari-specific optimizations
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
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
          duration: 3.2,
          ease: "power2.out",
          force3D: true,
          // Safari-specific optimizations
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          onComplete: () => {
            // Gentle floating animation for mobile - Safari optimized
            if (coinRef.current) {
              animationRef.current = gsap.to(coinRef.current, {
                y: -20,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                duration: 6,
                force3D: true,
                // Safari-specific properties
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
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
        if (typeof animationRef.current.kill === 'function') {
          animationRef.current.kill();
        }
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
      className="baft-coin-mobile relative w-full h-screen flex flex-col items-center justify-center bg-black text-center overflow-hidden px-4"
    >
      {/* Background grid removed for production */}
      
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
          className="intro-text text-white eb-garamond-intro leading-tight font-normal mb-14 opacity-0"
          style={{ fontSize: 'clamp(56px, 11vw, 120px)', lineHeight: '1.05' }}
        >
          Introducing
        </h2>
        <h1
          className="coin-text eb-garamond-intro font-medium leading-tight text-transparent bg-clip-text bg-[linear-gradient(180deg,#999999_30.89%,#3D3D3D_63.42%)] [--tw-text-stroke:1px_rgba(255,255,255,0.5)] [webkit-text-stroke:var(--tw-text-stroke)] [text-stroke:var(--tw-text-stroke)] opacity-0"
          style={{ fontSize: 'clamp(88px, 14.5vw, 220px)', lineHeight: '1.02' }}
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaftCoinMobile;