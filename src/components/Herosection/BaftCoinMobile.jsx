import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackground } from "../Themes/Grid_coins";

gsap.registerPlugin(ScrollTrigger);

const BaftCoinMobile = () => {
  const introRef = useRef(null);
  const coinRef = useRef(null);
  const animationRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useLayoutEffect(() => {
    // Kill any existing animations first
    if (animationRef.current) {
      gsap.killTweensOf(coinRef.current);
      animationRef.current = null;
    }

    // Reset coin animation properties without affecting position
    if (coinRef.current) {
      gsap.set(coinRef.current, {
        opacity: 0,
        scale: 0.5,
        rotation: -10,
      });
    }

    const ctx = gsap.context(() => {
      // Mobile-specific timeline
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

      // Mobile-optimized animations
      tl.fromTo(
        ".intro-text",
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2.0,
          ease: "power2.out",
        }
      )
      .fromTo(
        ".coin-text",
        {
          opacity: 0,
          scale: 0.7,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 2.0,
          ease: "power2.out",
        },
        "-=1.0"
      )
      .fromTo(coinRef.current, 
        {
          // Coin starts from bottom of phone
          opacity: 0,
          scale: 0.5,
          y: 400, // Start from further down (bottom of phone)
          x: 0, // Keep horizontal position centered
          rotation: 0, // Keep coin perfectly upright
        },
        {
          // Coin moves straight up to final position
          opacity: 1,
          y: 0, // Move to final Y position
          x: 0, // Maintain centered horizontal position
          scale: 1,
          rotation: 0, // Maintain upright position
          duration: 2.5,
          ease: "power2.out",
          onComplete: () => {
            // Mobile floating animation (smaller movement)
            animationRef.current = gsap.to(coinRef.current, {
              y: -8,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              duration: 4,
            });
          }
        }, "-=1.5"
      )
      .to(".text-container", {
        // Move entire text container upwards along with coin, maintaining 5cm gap
        y: -189,
        duration: 2.5,
        ease: "power2.out",
      }, "-=1.5"); // Start when coin animation is 1.5s in
    }, introRef);

    return () => {
      // Clean up all GSAP animations without affecting position
      if (coinRef.current) {
        gsap.killTweensOf(coinRef.current);
        // Reset only animation properties, preserve CSS positioning
        gsap.set(coinRef.current, {
          opacity: 0,
          scale: 1,
          rotation: 0,
        });
      }
      hasAnimatedRef.current = false;
      
      // Kill all ScrollTriggers in the context instead of refreshing
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === introRef.current) {
          trigger.kill();
        }
      });
      
      // Revert the context (this will clean up all GSAP animations)
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={introRef}
      className="relative w-full h-screen flex items-center justify-center bg-black text-center overflow-hidden"
    >
      {/* Grid Background */}
      <div id="grid_container" className="absolute inset-0 opacity-100 z-0">
        <GridBackground />
      </div>

      {/* Mobile Coin Image - Larger and positioned for mobile */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <img
          ref={coinRef}
          src="/b-coin image.png"
          alt="BaFT Coin"
          className="absolute w-[80vw] sm:w-[70vw] h-auto left-1/2 -translate-x-1/2 bottom-[15vh] transform translate-y-0 opacity-0"
        />
      </div>

      {/* Mobile Text - Responsive sizing based on iPhone 13 mini specs */}
      <div className="z-10 absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-container">
          <h2
            className="intro-text text-white eb-garamond-intro text-3xl sm:text-3xl md:text-3xl lg:text-4xl leading-[1.16] font-normal mb-3 opacity-0 text-center"
          >
            Introducing
          </h2>
          <h1
            className="coin-text eb-garamond-intro font-medium text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[1.16] text-transparent bg-clip-text bg-[linear-gradient(197.98deg,#999999_12.89%,#3D3D3D_73.42%)] [--tw-text-stroke:0.75px_rgba(255,255,255,0.6)] [webkit-text-stroke:var(--tw-text-stroke)] [text-stroke:var(--tw-text-stroke)] opacity-0 text-center"
          >
            BaFT Coin
          </h1>
        </div>
      </div>
    </section>
  );
};

export default BaftCoinMobile;
