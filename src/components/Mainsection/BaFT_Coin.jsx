import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BaFT_Coin = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#introduction",
        start: "top 80%",
        toggleActions: "play none none reverse",
        markers: false,
      },
    });

    // Animate the h6 first
    tl.fromTo(
      "#introduction",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 3 }
    );

    // Animate the h1 next
    tl.fromTo(
      "#baft_coin",
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 3 },
      "+=0.5"
    );

    tl.fromTo(
      "#B_coin",
      { opacity: 0, y: 100 },
      { opacity: 0.5, y: 0, duration: 3 }
    );
  });

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center relative">
      <img
        id="B_coin"
        src="b-coin image.png"
        alt="BaFT Coin Image"
        className="opacity-50 w-[500px] h-auto p-10"
      />

      {/* Text Overlay */}
      <div className="absolute flex flex-col items-center">
        <h6
          id="introduction"
          className="text-[55px] eb-garamond-introduction mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
        >
          Introducing
        </h6>

        <h1
          id="baft_coin"
          className="text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
        >
          BaFT Coin
        </h1>
      </div>
    </div>
  );
};

export default BaFT_Coin;
