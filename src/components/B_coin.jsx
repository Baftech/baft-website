import "./B_coin.css";
import React, { useState, useEffect } from "react";



 {/* Section 1 */}
const B_coin = () => {
  const [imageVisible, setImageVisible] = useState(false);
  const [introducingVisible, setIntroducingVisible] = useState(false);
  const [baftCoinVisible, setBaftCoinVisible] = useState(false);

  useEffect(() => {
  // Step 1: Show "Introducing"
  const introducingTimer = setTimeout(() => {
    setIntroducingVisible(true);
  }, 0); // Start immediately

  // Step 2: Show "BaFT Coin" after 3s
  const baftCoinTimer = setTimeout(() => {
    setBaftCoinVisible(true);
  }, 3000);

  // Step 3: Show Coin image after another 3s (6s total)
  const imageTimer = setTimeout(() => {
    setImageVisible(true);
  }, 6000);

  return () => {
    clearTimeout(introducingTimer);
    clearTimeout(baftCoinTimer);
    clearTimeout(imageTimer);
  };
}, []);

  return (
    <div id="b-coin" data-theme="dark" className="bg-black w-full min-h-screen flex items-center justify-center relative px-4 sm:px-6 md:px-8">
      
      {/* Glowing Lines Container */}
      <div className="glowing-lines-container">
        <div className="glowing-line-1"></div>
        <div className="glowing-line-2"></div>
        <div className="glowing-line-3"></div>
      </div>
      
      <div className="mt-70 absolute z-20 text-center w-full max-w-4xl mx-auto">
        {/** add animation intro 3sec*/}
        {/** add animation intro 3sec after animation 3  viabrate up and down */}
        <img
          src="b-coin image.png"
          alt="b-coin image.png"
          className={`absolute top-1/2 left-1/2 transform-translate-x-1/2-translate-y-1/2 z-10 
            w-96 sm:w-[20rem] md:w-[30rem] lg:w-[30rem] xl:w-[30rem] mx-2
            ${imageVisible
              ? "transition-opacity ease-in-out duration-700 smooth-vibrate opacity-20"
              : "opacity-0"
          }`}
          style={{ filter: "brightness(1.2)" }}
        />
        <h3
          className={`flex justify-center items-center px-2 py-3 sm:py-4 md:py-5 text-white font-[400] 
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
            ${introducingVisible ? "smooth-fade-in" : "opacity-0"}`}
          style={{
            fontFamily: "Libertinus Serif",
            fontStyle: "normal",
          }}
        >
          Introducing
        </h3>

        <h1
          className={`flex justify-center items-center px-2 text-white font-[400] 
            text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] xl:text-[8rem] 2xl:text-[9rem]
            ${baftCoinVisible ? "smooth-fade-in" : "opacity-0"}`}
          style={{
            fontFamily: "Libertinus Serif",
            fontStyle: "normal",
          }}
        >
          BaFT Coin
        </h1>
      </div>
      
    </div>
  );
};
export default B_coin;
