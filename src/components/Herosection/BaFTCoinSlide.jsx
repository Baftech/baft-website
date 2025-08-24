import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackground } from "../Themes/Grid_coins";

gsap.registerPlugin(ScrollTrigger);

const BaFTCoin = () => {
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
        scale: 1,
        rotation: 0,
        // Don't reset y and x to preserve CSS positioning
      });
    }

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
          duration: 2.5,
          ease: "power3.out",
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
          opacity: 0.2,
          scale: 1,
          rotation: 0,
          duration: 3.8,
          ease: "power2.out",
          onComplete: () => {
            // Start smooth floating animation after fade-in completes
            animationRef.current = gsap.to(coinRef.current, {
              y: -15,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              duration: 6,
            });
          }
        }, "-=1.2") // Start slightly before previous animation ends
      .to(".intro-text, .coin-text", {
        filter: "drop-shadow(0 0 8px rgba(255,215,0,0.4))",
        duration: 4,
        ease: "power1.out",
      }, "-=2.5"); // Start glow effect during coin animation
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
          // Don't reset y and x to preserve CSS positioning
        });
      }
      hasAnimatedRef.current = false;
      // Refresh ScrollTrigger to ensure proper cleanup
      ScrollTrigger.refresh();
      ctx.revert();
    };
  }, []);

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
          src="/b-coin image.png"
          alt="BaFT Coin"
          className="w-56 h-auto sm:w-64 md:w-72 lg:w-104 xl:w-104 opacity-0"
          style={{
            position: 'relative',
            top: '5%', // Move down slightly from center
          }}
        />
      </div>

      {/* Overlay Text */}
      <div className="z-10">
        <h2
          className="intro-text text-white eb-garamond-intro text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] font-normal mb-4 opacity-0"
        >
          Introducing
        </h2>
        <h1
          className="coin-text text-4xl sm:text-5xl md:text-6xl lg:text-9xl xl:text-9xl 2xl:text-[160px] opacity-0"
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaFTCoin;