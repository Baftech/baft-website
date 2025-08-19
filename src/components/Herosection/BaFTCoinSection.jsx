import React from "react";

const BaFTCoinSection = () => (
  <div
    id="baft_coin_section"
    data-theme="dark"
    className="absolute top-0 w-full h-screen bg-black text-white flex items-center justify-center z-20 px-4 sm:px-6 md:px-8"
  >
    <img
      id="B_coin"
      src="b-coin image.png"
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

export default BaFTCoinSection;


