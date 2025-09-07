import React, { useLayoutEffect, useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { GridBackground } from "../Themes/Grid_coins";
import BaftCoinMobile from "./BaftCoinMobile";
import { B_COIN_IMAGE_PNG } from "../../assets/assets";

gsap.registerPlugin(ScrollTrigger);

const BaFTCoin = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMacBook, setIsMacBook] = useState(false);
  const introRef = useRef(null);
  const coinRef = useRef(null);
  const animationRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const exitTlRef = useRef(null);

  // Mobile and MacBook detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setIsMobile(width <= 768);
      
      // Simplified MacBook detection: Check for Mac user agent and desktop size
      const isMacUserAgent = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
      const isDesktopSize = width >= 1024 && height >= 640;
      const isNotWindows = !/Windows/.test(navigator.userAgent);
      
      // Detect as MacBook if it's a Mac device with desktop size
      const isMacBook = isMacUserAgent && isDesktopSize && isNotWindows;
      setIsMacBook(isMacBook);
      
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Method to trigger exit animations (called by SlideContainer)
  const triggerExitAnimation = useCallback(() => {
    if (!introRef.current || !coinRef.current) {
      return;
    }

    // Kill any existing floating or exit animations to avoid overlap
    if (animationRef.current) {
      if (typeof animationRef.current.kill === 'function') {
        animationRef.current.kill();
      }
      gsap.killTweensOf(coinRef.current);
      animationRef.current = null;
    }
    if (exitTlRef.current) {
      exitTlRef.current.kill();
      exitTlRef.current = null;
    }

    // Scope to this section to avoid global selector issues
    const ctx = gsap.context(() => {
      // Make sure we're starting from the live state
      const rawOpacity = gsap.getProperty(coinRef.current, "opacity");
      const parsedOpacity = typeof rawOpacity === 'string' ? parseFloat(rawOpacity) : Number(rawOpacity);
      const currentCoinOpacity = Number.isFinite(parsedOpacity) ? parsedOpacity : 0.3;

      gsap.killTweensOf([coinRef.current, ".intro-text", ".coin-text"], "opacity,y,scale");

      exitTlRef.current = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          // Ensure coin ends hidden even if user scrolled extremely fast
          gsap.set(coinRef.current, { opacity: 0 });
          window.dispatchEvent(new CustomEvent('baftCoinExitComplete'));
        }
      });

      exitTlRef.current
        .fromTo(coinRef.current,
          { opacity: currentCoinOpacity, scale: 1, y: 0 },
          {
            opacity: 0,
            scale: 0.95,
            y: -10,
            duration: 0.6,
            ease: "power2.inOut"
          }
        )
        .to([".intro-text", ".coin-text"], {
          y: -100,
          duration: 1.0,
          ease: "power1.out"
        }, "<")
        .to([".intro-text", ".coin-text"], {
          opacity: 0,
          duration: 1.0,
          ease: "power1.out"
        }, "<");
    }, introRef);

    // Revert context after completion
    exitTlRef.current?.eventCallback("onComplete", () => {
      ctx.revert();
      window.dispatchEvent(new CustomEvent('baftCoinExitComplete'));
    });
  }, []);

  // Expose the method to SlideContainer
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__baftCoinExitHooked) {
      console.log('🎯 BaFT Coin: Exposing triggerBaftCoinExit to window');
      window.triggerBaftCoinExit = triggerExitAnimation;
      window.__baftCoinExitHooked = true;
    }
    return () => {
      if (typeof window !== 'undefined') {
        console.log('🎯 BaFT Coin: Cleaning up triggerBaftCoinExit from window');
        delete window.triggerBaftCoinExit;
        delete window.__baftCoinExitHooked;
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
        if (typeof animationRef.current.kill === 'function') {
          animationRef.current.kill();
        }
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
      {/* Background Coin Image - Centered independently */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          ref={coinRef}
          src={B_COIN_IMAGE_PNG}
          alt="BaFT Coin"
          className="absolute md:relative h-auto left-1/2 -translate-x-1/2 bottom-[2vh] sm:bottom-[3vh] md:bottom-auto md:left-auto md:translate-x-0 transform translate-y-0 sm:translate-y-0 md:mt-[2cm] lg:mt-[2cm] opacity-0"
          style={{
            width: isMacBook 
              ? `min(95vw, 95vh)`
              : `min(80vw, 75vh)`,
            height: isMacBook 
              ? `min(95vw, 95vh)`
              : `min(80vw, 75vh)`,
            maxWidth: isMacBook ? '95vw' : '80vw',
            maxHeight: isMacBook ? '95vh' : '75vh',
            objectFit: 'contain'
          }}
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