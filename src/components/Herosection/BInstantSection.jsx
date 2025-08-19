import React from "react";

const BInstantSection = () => (
  <div
    id="b_instant_section"
    data-theme="dark"
    className="absolute top-0 w-full h-screen bg-black flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 overflow-hidden z-30"
    style={{ isolation: "isolate" }}
  >
    <div className="relative flex items-center justify-center w-full h-full">
      <div className="relative max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem] lg:max-w-[30rem] w-full h-auto">
        <div
          id="bottom_coin"
          className="absolute inset-0 w-full h-auto"
          style={{ zIndex: 1 }}
        >
          <img
            src="/b-coin.svg"
            alt="Bottom coin"
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3)) brightness(0.9)",
            }}
          />
        </div>

        <div
          id="center_coin"
          className="relative w-full h-auto"
          style={{ zIndex: 2 }}
        >
          <img
            src="/b-coin.svg"
            alt="Center coin"
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 25px rgba(255, 215, 0, 0.4)) brightness(1.2)",
            }}
          />
        </div>

        <div
          id="top_coin"
          className="absolute inset-0 w-full h-auto"
          style={{ zIndex: 1 }}
        >
          <img
            src="/b-coin.svg"
            alt="Top coin"
            className="w-full h-auto object-contain"
            style={{
              filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3)) brightness(1.1)",
            }}
          />
        </div>
      </div>

      <div 
        className="absolute inset-0 bg-black bg-opacity-30 z-10 pointer-events-none"
        style={{ 
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(1px)'
        }}
      ></div>

      <div
        id="instant_content"
        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4 sm:px-6 md:px-8"
        style={{ opacity: 0, transform: "translateY(50px)" }}
      >
        <div className="flex flex-col items-start leading-tight text-center sm:text-left">
          <div className="flex flex-col">
            <span
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 200,
                fontStyle: "italic",
                fontOpticalSizing: "auto",
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            >
              B-Coin
            </span>
            <div className="flex items-baseline flex-wrap">
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50 mr-1 sm:mr-2"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 200,
                  fontStyle: "italic",
                  fontOpticalSizing: "auto",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                Instant Value
              </span>
              <span
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white"
                style={{
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                —
              </span>
              <span
                className="ml-1 sm:ml-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-white font-serif font-bold"
                style={{
                  fontFamily: '"EB Garamond", serif',
                  fontWeight: 500,
                  fontStyle: "normal",
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                SHARED
              </span>
            </div>
          </div>

          <span
            className="self-end text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl text-amber-50 mt-2 sm:mt-0"
            style={{
              fontFamily: '"Inter", sans-serif',
              fontWeight: 200,
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
);

export default BInstantSection;


