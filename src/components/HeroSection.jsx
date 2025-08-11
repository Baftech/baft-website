import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {Navbar} from "./Navbar";
import {GridBackground} from "./GridBackground";
import B_coin from "./B_coin"
import B_Instant from "./B_Instant";
import "./Home.css";

export  const HeroSection = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [zoomOut, setZoomOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Track previous visibility state to detect entry event
  const prevVisibleRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 6 && !zoomOut) {
        setZoomOut(true);
        setShowContent(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        // Trigger reset only when visibility changes from false -> true
        if (isVisible && !prevVisibleRef.current) {
          // Container just came into view
          setZoomOut(false);
          setShowContent(false);
          video.currentTime = 0;
          video.play().catch((e) => console.log("Autoplay failed:", e));
        }

        // Update previous visibility state
        prevVisibleRef.current = isVisible;
      },
      { threshold: 0.5 }
    );

    video.play().catch((e) => console.log("Initial autoplay failed:", e));
    video.addEventListener("timeupdate", handleTimeUpdate);

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      observer.disconnect();
    };
  }, [zoomOut]);

  return (
    <>
    
    <section
      id="hero"
      data-theme="dark"
      className="home-wrapper min-h-screen relative "
      ref={containerRef}
    >
      <GridBackground className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black to-[65%]" />


      <div className="relative">
  <motion.video
    ref={videoRef}
    src="/Home_components/home_vid.mp4"
    muted
    autoPlay
    playsInline
    preload="metadata"
    className="video-fade-edges"
    initial={{
      width: "100vw",
      height: "100vh",
      top: 0,
      left: 0,
      borderRadius: 0,
      position: "absolute",
      zIndex: 20,
      objectFit: "cover",
      scale: 1,
    }}
    animate={
      zoomOut
        ? {
            scale: window.innerWidth < 768 ? 0.3 : window.innerWidth < 1024 ? 0.35 : 0.45,
            top: window.innerWidth < 768 ? 120 : window.innerWidth < 1024 ? 150 : 190,
            left: "50%",
            x: "-50%",
            borderRadius: window.innerWidth < 768 ? 150 : 200,
            opacity: 1,
          }
        : {
            scale: 1,
            top: 0,
            left: 0,
            x: 0,
            borderRadius: 0,
            opacity: 1,
          }
    }
    transition={{ duration: 2, ease: "easeInOut" }}
  />
</div>
      <Navbar />

      <motion.div
        className="hero-image-wrapper mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 flex justify-center relative z-20 px-3 sm:px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 120 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 120 }}
        transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <motion.img
          src="/Home_components/headline.png"
          alt="Do Money, Differently"
          className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-sm md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl mx-auto mt-1 sm:mt-2 md:mt-4 lg:mt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={showContent ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </motion.div>

      <motion.button
        className="scroll-btn relative z-20 text-xs sm:text-sm md:text-base lg:text-lg
                   px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 lg:py-4
                   bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-16 xl:bottom-20"
        initial={{ opacity: 0, y: 20 }}
        animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        onClick={() => {
          const nextSection = document.querySelector('section:nth-child(2)');
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Scroll Down ↓
      </motion.button>

      <div className="ellipse"></div>
      
    </section>
    
    
    </>
  );
};


