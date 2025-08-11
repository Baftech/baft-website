import React, { useState, useEffect } from "react";
import "./B_coin.css";

// ===== COMPONENT: B_COIN =====
const B_coin = () => {
  // ===== STATE MANAGEMENT =====
  const [imageVisible, setImageVisible] = useState(false);
  const [introducingVisible, setIntroducingVisible] = useState(false);
  const [baftCoinVisible, setBaftCoinVisible] = useState(false);

  // ===== ANIMATION EFFECTS =====
  useEffect(() => {
    // Step 1: Show "Introducing" text immediately
    const introducingTimer = setTimeout(() => {
      setIntroducingVisible(true);
    }, 0);

    // Step 2: Show "BaFT Coin" text after 3 seconds
    const baftCoinTimer = setTimeout(() => {
      setBaftCoinVisible(true);
    }, 3000);

    // Step 3: Show coin image after 6 seconds total
    const imageTimer = setTimeout(() => {
      setImageVisible(true);
    }, 6000);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(introducingTimer);
      clearTimeout(baftCoinTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  // ===== COMPONENT RENDER =====
  return (
    <div 
      id="b-coin" 
      data-theme="dark" 
      className="bg-black w-full min-h-screen ios-vh-fix flex items-center justify-center relative container-fluid-responsive pt-20"
    >
      
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="glowing-lines-container">
        <div className="glowing-line-1"></div>
        <div className="glowing-line-2"></div>
        <div className="glowing-line-3"></div>
      </div>
      
      {/* ===== MAIN CONTENT CONTAINER ===== */}
      <div className="absolute z-20 text-center w-full max-w-4xl mx-auto">
        
        {/* ===== COIN IMAGE ===== */}
        <img
          src="/B_coin/b-coin image.png"
          alt="BaFT Coin"
          className={`absolute top-1/2 left-1/2 transform-translate-x-1/2-translate-y-1/2 z-10 
            w-64 xs:w-72 sm:w-80 md:w-96 lg:w-[25rem] xl:w-[25rem] mx-2 responsive-img ios-hardware-acceleration
            ${imageVisible
              ? "transition-opacity ease-in-out duration-700 smooth-vibrate opacity-20"
              : "opacity-0"
            }`}
          style={{ filter: "brightness(1.2)" }}
          loading="lazy"
        />
        
        {/* ===== INTRODUCING TEXT ===== */}
        <h3
          className={`flex justify-center items-center responsive-padding-sm text-white font-[400] 
            responsive-text-3xl sm:responsive-text-4xl md:responsive-text-5xl
            ${introducingVisible ? "smooth-fade-in" : "opacity-0"}`}
          style={{
            fontFamily: "Libertinus Serif",
            fontStyle: "normal",
          }}
        >
          Introducing
        </h3>

        {/* ===== MAIN TITLE ===== */}
        <h1
          className={`flex justify-center items-center px-2 text-white font-[400] 
            responsive-text-4xl sm:responsive-text-5xl md:responsive-text-6xl lg:text-[7rem] xl:text-[8rem] 2xl:text-[9rem]
            ${baftCoinVisible ? "smooth-fade-in" : "opacity-0"}`}
          style={{
            fontFamily: "Libertinus Serif",
            fontStyle: "normal",
            fontSize: "clamp(2.5rem, 8vw, 8rem)",
            lineHeight: "1.1",
          }}
        >
          BaFT Coin
        </h1>
        
      </div>
      
    </div>
  );
};

// ===== EXPORT =====
export default B_coin;
