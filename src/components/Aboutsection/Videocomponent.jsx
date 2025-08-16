import React from "react";

const Videocomponent = () => {
  return (
    <section
      className="bg-white min-h-screen flex items-center justify-center"
    >
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 items-center max-w-[1200px] mx-auto w-full">
        {/* Left Column - Image */}
        <div className="flex items-center justify-center relative w-full h-full">
          <img
            src="/video_com.png"
            alt="BaFT Technologies Video Preview"
            className="max-w-full h-auto rounded-lg shadow-lg transition-all duration-300 relative mx-auto"
            style={{
              transformOrigin: "center center",
              display: "block",
              maxHeight: "400px",
              objectFit: "contain"
            }}
          />
        </div>

        {/* Right Column - Text Content */}
        <div className="flex flex-col justify-start items-start space-y-2">
          <p
            className="font-normal mb-2 flex items-center gap-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              color: "#092646",
            }}
          >
            <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
            Know our story
          </p>
          <h1
            className="leading-tight md:leading-none mb-4 md:mb-6 lg:mb-8 font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
            style={{
              fontFamily: "EB Garamond, serif",
            }}
          >
            <span className="block">The Video</span>
          </h1>
          <p
            className="text-gray-600 leading-relaxed pr-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#909090"
            }}
          >
            BaFT Technologies is a next-gen neo-banking startup headquartered
            in Bangalore, proudly founded in 2025. We're a tight-knit team of
            financial innovators and tech experts on a mission: to reimagine
            financial services in India with customer-first solutions.
          </p>
        </div>
      </div>


      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeZoomIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Videocomponent;
