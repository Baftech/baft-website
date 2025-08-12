import React, { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin();

const B_Instant = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlayText(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    // Animate each coin into place with stagger
    gsap.fromTo(
      ".coin",
      { y: 50, opacity: 0, scale: 0.8 },
      {
        y: (i) => i * -15, // offset upwards for stacking
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.15,
      }
    );
  }, []);

  const coins = Array.from({ length: 5 });

  return (
    <section
      id="b_instant"
      className="relative bg-black w-full min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
        
        {/* Coin stack container */}
        <div className="relative z-10 w-full max-w-[12rem] mx-auto h-[200px]">
          {coins.map((_, i) => (
            <img
              key={i}
              src="/b-coin.svg"
              alt={`Coin ${i}`}
              className="coin absolute left-1/2 -translate-x-1/2 w-full opacity-0"
              style={{
                filter:
                  "drop-shadow(0 5px 10px rgba(0,0,0,0.5)) drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))",
              }}
            />
          ))}
        </div>

        {/* Overlay text */}
        <div
          className={`absolute inset-0 flex flex-row items-center justify-center gap-2 whitespace-nowrap z-20 pointer-events-none transition-opacity duration-500 ${
            showOverlayText ? "opacity-100" : "opacity-0"
          }`}
        >
          <span
            className="text-amber-50"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 200,
              fontStyle: "italic",
              fontSize: "75.35px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            B-Coin
            <br />
            Instant Value
          </span>

          <span
            className="text-white font-semibold"
            style={{
              fontSize: "75.35px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            <br />—
          </span>

          <span
            className="text-amber-50"
            style={{
              fontFamily: '"EB Garamond", serif',
              fontWeight: 500,
              fontSize: "84.04px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            <br />
            SHARED
          </span>

          <span
            className="text-amber-50"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 200,
              fontStyle: "italic",
              fontSize: "75.35px",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            <br />
            Instantly
          </span>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none z-0" />
    </section>
  );
};

export default B_Instant;
