import React, { useEffect, useRef } from "react";
import Dark_Navbar from "./Dark_Navbar";
import GridBackground from "./GridBackground";
import "./Home.css";

const Home = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const scrollBtnRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    // const handleTimeUpdate = () => {
    //   if (video.currentTime >= 6 && !video.classList.contains("zoom-out")) {
    //     video.classList.add("zoom-out");
    //     headingRef.current.classList.add("fade-in-bottom");
    //     scrollBtnRef.current.classList.add("fade-in-bottom");
    //   }
    // };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset animations
          video.classList.remove("zoom-out");
          headingRef.current.classList.remove("fade-in-bottom");
          scrollBtnRef.current.classList.remove("fade-in-bottom");

          // Reset video
          video.currentTime = 0;
          video.play();
        }
      },
      { threshold: 0.6 }
    );

    // if (containerRef.current) observer.observe(containerRef.current);
    // video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      // video.removeEventListener("timeupdate", handleTimeUpdate);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-wrapper min-h-screen relative" ref={containerRef}>
     
        {/* Grid Component */}
        <GridBackground className="absolute inset-0 z-0" />

        {/* Black overlay covering bottom 75% */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black to-[75%]" />
      

      <Dark_Navbar />
      {/*<video
        ref={videoRef}
        src="/BAFT Vid 2_1.mp4"
        muted
        className="fullscreen-video"
      />*/}
      <div
        ref={headingRef}
        className="hero-image-wrapper fade-in-bottom mt-16 sm:mt-20 md:mt-24 lg:mt-28 xl:mt-32 flex justify-center relative z-20 px-4 sm:px-6 md:px-8"
      >
        <img
          src="/headline.png"
          alt="Do Money, Differently"
          className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto mt-2 sm:mt-4 md:mt-6"
        />
      </div>

      <button 
        ref={scrollBtnRef} 
        className="scroll-btn relative z-20 text-xs sm:text-sm md:text-base lg:text-lg
                   px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4
                   bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20"
      >
        Scroll Down ↓
      </button>
      <div className="ellipse"></div>
    </div>
  );
};

export default Home;
