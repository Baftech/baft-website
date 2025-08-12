import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  useGSAP(() => {
    // Set initial state for text - positioned off-screen and invisible
    gsap.set("#text", { 
      opacity: 0, 
      y: 50,
      scale: 0.8 
    });

    const tl = gsap.timeline();

    // Step 1: Fade in video
    tl.fromTo(
      "#videoElement",
      { opacity: 0, scale: 1 },
      { opacity: 1, duration: 1 }
    );

    // Step 2: Wait 9 seconds, then zoom out video AND animate text
    tl.to("#videoElement", {
      scale: 0.4,
      duration: 2,
      ease: "power2.out",
      delay: 9,
      onStart: () => {
        const video = document.getElementById("videoElement");
        video.play();
      },
    })
    // Animate text at the same time as video zoom
    .to("#text", {
      duration: 2,
      ease: "power1.inOut",
      opacity: 1,
      y: 0,
      scale: 1,
    }, "<"); // "<" makes it start at the same time as the previous animation

  }, []);

  return (
    <div className="relative w-full h-screen bg-black  overflow-hidden">
      {/* Video */}
      <div className="absolute top-20 rounded-lg overflow-hidden mb-5">
      <video
        id="videoElement"
        src="/BAFT Vid 2_1.mp4"
        
        style={{ opacity: 0 }}
        autoPlay
        muted
        playsInline
      />
      </div>
      
      {/* Text overlay - positioned absolutely on top */}
      <div className="absolute top-0 bottom-35 left-2 right-2 flex items-center justify-center pointer-events-none z-10
">
        <img 
          id="text" 
          src="/headline.png" 
          alt="Headline"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Hero;