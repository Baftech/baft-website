import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Videocomponent = () => {
  useGSAP(() => {
    // Simple entrance animation
    gsap.fromTo("#video_image", 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
    );
    
    gsap.fromTo("#video_title", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
    );
    
    gsap.fromTo("#video_description", 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <section className="bg-white w-full h-screen flex items-center justify-center relative overflow-hidden">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 items-center max-w-[1200px] mx-auto w-full">
        {/* Left Column - Image */}
        <div className="flex items-center justify-center relative w-full h-full">
          <img
            id="video_image"
            src="/video_com.png"
            alt="BaFT Technologies Video Preview"
            className="max-w-full h-auto rounded-lg shadow-lg transition-all duration-300 relative mx-auto"
            style={{
              transformOrigin: "center center",
              display: "block",
              maxHeight: "400px",
              objectFit: "contain",
              borderRadius: "33.72px",
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
            id="video_title"
            className="leading-tight md:leading-none mb-4 md:mb-6 lg:mb-8 font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
            style={{
              fontFamily: "EB Garamond, serif",
            }}
          >
            <span className="block">The Video</span>
          </h1>
          <p
            id="video_description"
            className="text-gray-600 leading-relaxed pr-2"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              lineHeight: "1.6",
              color: "#909090",
            }}
          >
            BaFT Technologies is a next-gen neo-banking startup headquartered in
            Bangalore, proudly founded in 2025. We're a tight-knit team of
            financial innovators and tech experts on a mission: to reimagine
            financial services in India with customer-first solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Videocomponent;
