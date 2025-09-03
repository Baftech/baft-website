import React, { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackground } from "../Themes/Grid_coins";
import BaftCoinMobile from "./BaftCoinMobile";
import { B_COIN_IMAGE_PNG } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const BaFTCoin = () => {
  const [isMobile, setIsMobile] = useState(false);
  const introRef = useRef(null);
  const coinRef = useRef(null);
  const animationRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Method to trigger exit animations (called by SlideContainer)
  const triggerExitAnimation = useCallback(() => {
    console.log('🎯 BaFT Coin: triggerExitAnimation called!');
    if (!introRef.current || !coinRef.current) {
      console.log('❌ BaFT Coin: Refs not ready for exit animation');
      return;
    }
    
    console.log('🎯 BaFT Coin: Starting exit animations...');
    
    // Kill any existing floating animation
    if (animationRef.current) {
      gsap.killTweensOf(coinRef.current);
      animationRef.current = null;
    }
    
    // Create exit animation timeline
    const exitTl = gsap.timeline({
      onComplete: () => {
        console.log('🎯 BaFT Coin: Exit animations complete, dispatching event...');
        // Fire exit complete event when exit animations finish
        // This will trigger automatic transition to BInstant section
        window.dispatchEvent(new CustomEvent('baftCoinExitComplete'));
      }
    });

    // Amazing exit animations in reverse order
    // Coin fades from current opacity (0.3) to 0 - starts immediately on scroll
    exitTl.fromTo(coinRef.current, 
      { opacity: 0.3 }, // Start from current opacity
      { 
        opacity: 0, // Fade to completely transparent
        scale: 0.8, // Come closer (shrink)
        y: -20, // Move up slightly
        duration: 1.5, 
        ease: "power2.in" 
      }
    )
    .to([".intro-text", ".coin-text"], { 
      y: -120, // Move texts upwards
      duration: 1.2, 
      ease: "power2.in" 
    }, "-=0.3") // Start 0.3s before coin animation ends (smaller gap)
    .to([".intro-text", ".coin-text"], { 
      opacity: 0, // Then fade out the texts
      duration: 1.2, 
      ease: "power2.out" 
    }, "-=1.2"); // Start fading at the same time as moving up
  }, []);

  // Expose the method to SlideContainer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🎯 BaFT Coin: Exposing triggerBaftCoinExit to window');
      window.triggerBaftCoinExit = triggerExitAnimation;
    }
    return () => {
      if (typeof window !== 'undefined') {
        console.log('🎯 BaFT Coin: Cleaning up triggerBaftCoinExit from window');
        delete window.triggerBaftCoinExit;
      }
    };
  }, [triggerExitAnimation]);

  useLayoutEffect(() => {
    // Only proceed if refs are available
    if (!introRef.current || !coinRef.current) return;

    // Kill any existing animations first
    if (animationRef.current) {
      gsap.killTweensOf(coinRef.current);
      animationRef.current = null;
    }

    // Reset coin animation properties without affecting position
    gsap.set(coinRef.current, {
      opacity: 0,
      scale: 1,
      rotation: 0,
      // Don't reset y and x to preserve CSS positioning
    });

    const ctx = gsap.context(() => {
      // Create a timeline for smooth sequencing
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

      // Sequence the animations properly
      tl.fromTo(
        ".intro-text",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 3.2,
          ease: "power2.out",
        }
      )
      .fromTo(
        ".coin-text",
        {
          opacity: 0,
          scale: 0.8,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 3.2,
          ease: "power2.out",
        },
        "-=0.8"
      ) // Start slightly before previous animation ends
      .fromTo(coinRef.current, 
        {
          opacity: 0,
          scale: 0.7,
          rotation: -5,
        },
        {
          opacity: 0.3,
          scale: 1,
          rotation: 0,
          duration: 3.2,
          ease: "power2.out",
          onComplete: () => {
            // Start smooth floating animation after fade-in completes
            if (coinRef.current) {
              animationRef.current = gsap.to(coinRef.current, {
                y: -15,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                duration: 6,
              });
            }
          }
        }, "-=1.2") // Start slightly before previous animation ends
      .to(".coin-text", {
        // Apply glow to text only once the coin is on screen
        textShadow: "0px -4px 24px rgba(255,255,255,0.25)",
        duration: 3.2,
        ease: "power2.out",
      }, "<")
      .to(".intro-text, .coin-text", {
        filter: "none",
        duration: 0.01,
        ease: "none",
      }, "-=2.5") // No glow
      

    }, introRef);

    return () => {
      // Clean up all GSAP animations safely
      if (coinRef.current) {
        gsap.killTweensOf(coinRef.current);
      }
      if (animationRef.current) {
        gsap.killTweensOf(animationRef.current);
        animationRef.current = null;
      }
      hasAnimatedRef.current = false;
      
      // Safely revert context
      if (ctx) {
        ctx.revert();
      }
    };
  }, []);

  // Return mobile component if on mobile
  if (isMobile) {
    return <BaftCoinMobile />;
  }

  return (
    <section
      ref={introRef}
      className="relative w-full h-screen flex items-center justify-center bg-black text-center overflow-hidden"
    >
         <div id="grid_container" className="absolute inset-0 opacity-100 z-0">
                <GridBackground />
              </div>
      {/* Background Coin Image - Centered independently */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          ref={coinRef}
          src={B_COIN_IMAGE_PNG}
          alt="BaFT Coin"
          className="absolute md:relative h-auto w-[60vw] sm:w-[54vw] md:w-[40vw] lg:w-[34vw] xl:w-[46vw] 2xl:w-[48vw] 3xl:w-[45vw] max-w-[1000px] left-1/2 -translate-x-1/2 bottom-[2vh] sm:bottom-[3vh] md:bottom-auto md:left-auto md:translate-x-0 transform translate-y-0 sm:translate-y-0 md:mt-[2cm] lg:mt-[2cm] opacity-0"
        />
      </div>

      {/* Overlay Text */}
      <div className="z-10 mt-16 md:mt-20 lg:mt-24">
        <h2
          className="intro-text text-white eb-garamond-intro text-2xl sm:text-3xl md:text-[34px] lg:text-[48px] xl:text-[64px] 2xl:text-[72px] leading-[1.16] font-normal mb-4 opacity-0"
        >
          Introducing
        </h2>
        <h1
          className="coin-text eb-garamond-intro font-medium leading-[1.16] text-4xl sm:text-5xl md:text-[72px] lg:text-[104px] xl:text-[156px] 2xl:text-[160px] text-transparent bg-clip-text bg-[linear-gradient(180deg,#FFFFFF_38.23%,#000000_147.25%)] [--tw-text-stroke:1px_rgba(255,255,255,0.5)] [webkit-text-stroke:var(--tw-text-stroke)] [text-stroke:var(--tw-text-stroke)] opacity-0"
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaFTCoin;