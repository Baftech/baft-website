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
      // Fade in "Introducing"
      gsap.from(".intro-text", {
        opacity: 0,
        y: 40,
        duration: 1.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
        },
      });

      // Fade & scale in "BaFT Coin"
      gsap.from(".coin-text", {
        opacity: 0,
        scale: 0.9,
        duration: 1.6,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top center",
        },
      });

      // Floating coin animation (looping)
      gsap.to(coinRef.current, {
        y: -20,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 3.4,
      });
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
        className="absolute w-56 h-auto sm:w-64 md:w-72 lg:w-96 xl:w-96 opacity-30 z-10"
      />

      {/* Overlay Text */}
      <div className="z-10">
        <h2
          className="intro-text text-white eb-garamond-intro text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] font-normal mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
        >
          Introducing
        </h2>
        <h1
          className="coin-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[156px] drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
        >
          BaFT Coin
        </h1>
      </div>
    </section>
  );
};

export default BaFTCoin;