import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const B_Fast = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);

  useGSAP(() => {
    // Initially hide everything
    gsap.set(contentRef.current, { opacity: 0, y: -100 });
    gsap.set(videoRef.current, { opacity: 0, scale: 0.8 });
    
    // Start video animation first
    setTimeout(() => {
      // Show video first - fade in from position
      gsap.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power2.out"
      });
      
      // Show text after video animation - slide down from top
      setTimeout(() => {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out"
        });
      }, 600);
    }, 300);
  }, []);

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden" data-theme="light">
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 bg-white">
        {/* Text Content */}
        <div
          ref={contentRef}
          className="text-center mb-16"
          style={{ marginTop: '80px' }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[130px] eb-garamond-Bfast bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent mb-4">
            B-Fast
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl inter-Bfast_sub bg-gradient-to-r from-[#777575] to-[#092646] bg-clip-text text-transparent">
            One Tap. Zero Wait.
          </p>
        </div>

        {/* Semi-transparent layer between text and video */}
        <div className="w-full max-w-[600px] h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8 opacity-70"></div>

        {/* Video Section */}
        <div className="relative w-full max-w-[1000px] h-[100px] md:h-[350px] flex items-center justify-center bg-white" style={{ marginTop: '-100px' }}>
          <video
            ref={videoRef}
            src="/bfast_video.mp4"
            className="w-full h-full object-cover rounded-lg"
            autoPlay
            loop
            muted
            playsInline
            style={{ 
              opacity: 0,
              transform: "scale(0.8)"
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default B_Fast;
