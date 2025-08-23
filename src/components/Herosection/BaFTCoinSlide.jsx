import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GridBackground } from "../Themes/Grid_coins";

gsap.registerPlugin(ScrollTrigger);

const BaFTCoin = () => {
  const introRef = useRef(null);
  const coinRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in "Introducing" first - smoother with better easing
      gsap.from(".intro-text", {
        opacity: 0,
        y: 30,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
        },
      });

      // Fade & scale in "BaFT Coin" second - smoother scale animation
      gsap.from(".coin-text", {
        opacity: 0,
        scale: 0.85,
        y: 20,
        duration: 2.2,
        delay: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
        },
      });

      // Fade in coin image last - smoother with subtle scale and rotation
      gsap.fromTo(coinRef.current, 
        {
          opacity: 0,
          scale: 0.7,
          rotation: -5,
        },
        {
          opacity: 0.2,
          scale: 1,
          rotation: 0,
          duration: 2.4,
          delay: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top center",
          },
          onComplete: () => {
            // Start floating animation after fade-in completes - smoother floating
            gsap.to(coinRef.current, {
              y: -15,
              repeat: -1,
              yoyo: true,
              ease: "power1.inOut",
              duration: 4.2,
            });
            
            // Add glow effect to text after coin appears
            gsap.to(".intro-text, .coin-text", {
              filter: "drop-shadow(0 0 8px rgba(255,215,0,0.4))",
              duration: 2.8,
              ease: "power1.out",
            });
          }
        }
      );
    }, introRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={introRef}
      className="relative w-full h-screen flex items-center justify-center bg-black text-center overflow-hidden"
    >
         <div id="grid_container" className="absolute inset-0 opacity-100 z-0">
                <GridBackground />
              </div>
      {/* Background Coin Image */}
      <img
        ref={coinRef}
        src="/b-coin image.png"
        alt="BaFT Coin"
        className="absolute w-56 h-auto sm:w-64 md:w-72 lg:w-96 xl:w-96 opacity-0 z-10 top-1/5 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      {/* Overlay Text */}
      <div className="z-10">
        <h2
          className="intro-text text-white eb-garamond-intro text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] font-normal mb-4"
        >
          Introducing
        </h2>
        <h1
          className="coin-text text-4xl sm:text-5xl md:text-6xl lg:text-9xl xl:text-9xl 2xl:text-[160px]"
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaFTCoin;