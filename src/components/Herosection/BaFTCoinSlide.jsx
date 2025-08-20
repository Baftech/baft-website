import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const BaFTCoinSlide = () => {
  useGSAP(() => {
    // Initially hide all elements below the screen
    gsap.set("#introduction", { y: 100, opacity: 0 });
    gsap.set("#baft_coin_text", { y: 100, opacity: 0 });
    gsap.set("#B_coin", { y: 100, opacity: 0 });

    // Create a timeline for sequential animations
    const tl = gsap.timeline();
    
    // Each element slides up with 1 second delay
    tl.to("#introduction", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out"
    })
    .to("#baft_coin_text", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.2") // Start slightly before previous animation ends
    .to("#B_coin", {
      y: 0,
      opacity: 0.3,
      duration: 1.2,
      ease: "power2.out"
    }, "-=0.2") // Start slightly before previous animation ends
    .to("#B_coin", {
      y: -20,
      duration: 0.8,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    }, "+=0.5"); // Start bounce after a small delay
  }, []);

  return (
    <div
      id="baft_coin_section"
      data-theme="dark"
      className="relative w-full h-screen bg-black text-white flex items-center justify-center z-20 px-4 sm:px-6 md:px-8"
    >
      <img
        id="B_coin"
        src="/b-coin image.png"
        alt="BaFT Coin Image"
        className="w-64 sm:w-80 md:w-96 lg:w-[500px] h-auto p-6 sm:p-8 md:p-10 opacity-30"
      />
      <div className="absolute flex flex-col items-center text-center">
        <h6
          id="introduction"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[55px] eb-garamond-introduction mb-2 sm:mb-3 md:mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
        >
          Introducing
        </h6>
        <h1
          id="baft_coin_text"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
        >
          BaFT Coin
        </h1>
      </div>
    </div>
  );
};

export default BaFTCoinSlide;
