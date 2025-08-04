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
    <div className="home-wrapper" ref={containerRef}>
     
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
        className="hero-image-wrapper fade-in-bottom mt-24 flex justify-center relative z-20"
      >
        <img
          src="/headline.png"
          alt="Do Money, Differently"
          className="w-[900px] max-w-full mx-auto mt-4"
        />
      </div>

      <button ref={scrollBtnRef} className="scroll-btn relative z-20">
        Scroll Down ↓
      </button>
      <div className="ellipse"></div>
    </div>
  );
};

export default Home;
