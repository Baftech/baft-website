import React, { useState, useEffect } from "react";
import { GridBackground } from "../Themes/Gridbackground";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Hero = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    gsap.set("#baft_coin_section, #b_instant_section", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50 }); // Headline hidden

    // 🎥 Hero entry animation
    ScrollTrigger.create({
      trigger: "#hero_container",
      start: "top top",
      end: "+=100%",
      onEnter: () => {
        const heroTl = gsap.timeline();
        heroTl
          // Video fade in
          .fromTo("#videoElement",
            { opacity: 0, scale: 1 },
            { opacity: 1, duration: 1 }
          )
          // Scale down video
          .to("#videoElement", {
            scale: 0.4,
            duration: 2,
            ease: "power2.out",
            delay: 3
          })
          // Fade in headline from bottom
          .to("#text", {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out"
          }, "-=1.5");
      },
      onLeaveBack: () => {
        // Reverse when scrolling up
        const reverseTl = gsap.timeline();
        reverseTl
          .to("#text", { opacity: 0, y: 50, duration: 1, ease: "power2.in" })
          .to("#videoElement", { scale: 1, duration: 1.5, ease: "power2.in" }, "-=0.5")
          .to("#videoElement", { opacity: 0, duration: 1 }, "-=0.5");
      }
    });

    // 💰 Scroll-based section transitions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero_container",
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true
      }
    });

    tl.to("#Hero", { opacity: 0, duration: 1 }, "+=1")
      .to("#baft_coin_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .from(["#introduction", "#baft_coin_text", "#B_coin"], {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1
      })
      .to("#baft_coin_section", { opacity: 0, duration: 1 }, "+=1")
      .to("#b_instant_section", { opacity: 1, y: 0, duration: 1 }, "<")
      .from("#instant_content", {
        opacity: 0,
        y: 50,
        duration: 1
      });
  }, []);

  return (
    <div id="hero_container" className="relative w-full h-screen">

      {/* Hero Section */}
      <div
        id="Hero"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black overflow-hidden z-10"
      >
        <GridBackground />

        {/* Video */}
        <div className="absolute top-20 rounded-lg overflow-hidden mb-5 z-10">
          <video
            id="videoElement"
            src="/BAFT Vid 2_1.mp4"
            style={{ opacity: 0 }}
            autoPlay
            muted
            playsInline
            loop={false} // Only once
          />
        </div>

        {/* Headline */}
        <div className="absolute top-0 bottom-35 left-2 right-2 flex items-center justify-center pointer-events-none z-20">
          <img
            id="text"
            src="/headline.png"
            alt="Headline"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* BaFT Coin Section */}
      <div
        id="baft_coin_section"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black text-white flex items-center justify-center z-20"
      >
        <img
          id="B_coin"
          src="b-coin image.png"
          alt="BaFT Coin Image"
          className="w-[500px] h-auto p-10"
        />
        <div className="absolute flex flex-col items-center">
          <h6
            id="introduction"
            className="text-[55px] eb-garamond-introduction mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
          >
            Introducing
          </h6>
          <h1
            id="baft_coin_text"
            className="text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
          >
            BaFT Coin
          </h1>
        </div>
      </div>

      {/* B-Instant Section */}
      <div
        id="b_instant_section"
        data-theme="dark"
        className="absolute top-0 w-full h-screen bg-black flex flex-col items-center justify-center px-4 overflow-hidden z-30"
        style={{ isolation: "isolate" }}
      >
        <img id="stacked_coins" src="/b-coin.svg" alt="Stacked Coins" />
        <div className="relative flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          <div
            id="instant_content"
            className={`absolute inset-0 flex flex-row items-center justify-center gap-4 whitespace-nowrap z-20 pointer-events-none transition-opacity duration-500 ${showOverlayText ? "opacity-100" : "opacity-0"}`}
          >
            <span
              className="text-amber-50 italic"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 200,
                fontSize: "75.35px",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
              }}
            >
              B-Coin
              <br />Instant Value
            </span>
            <span
              className="text-white font-semibold"
              style={{
                fontSize: "75.35px",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
              }}
            >
              <br />—
            </span>
            <div className="flex flex-col items-center">
              <span
                className="text-amber-50"
                style={{
                  fontFamily: '"EB Garamond", serif',
                  fontWeight: 500,
                  fontSize: "84.04px",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
                }}
              >
                <br />
                <br />SHARED
              </span>
              <span
                className="text-amber-50 italic mb-5"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 200,
                  fontSize: "75.35px",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
                }}
              >
                Instantly
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none z-0" />
      </div>
    </div>
  );
};

export default Hero;
