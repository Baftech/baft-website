import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Video_Component = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [showFullVideo, setShowFullVideo] = useState(false);
  const [scrollDir, setScrollDir] = useState("down");

  // Detect scroll direction
  useEffect(() => {
    let lastScroll = window.scrollY;
    const updateScrollDir = () => {
      const newScroll = window.scrollY;
      setScrollDir(newScroll > lastScroll ? "down" : "up");
      lastScroll = newScroll > 0 ? newScroll : 0;
    };
    window.addEventListener("scroll", updateScrollDir);
    return () => window.removeEventListener("scroll", updateScrollDir);
  }, []);

  // GSAP ScrollTrigger to decide when to enlarge or skip
  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%", // section is 80% in view
      end: "bottom top",
      onEnter: () => {
        if (scrollDir === "up") {
          setShowFullVideo(true);
          gsap.to(videoRef.current, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      },
      onEnterBack: () => {
        if (scrollDir === "up") {
          setShowFullVideo(true);
          gsap.to(videoRef.current, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      },
      onLeave: () => {
        if (scrollDir === "down") {
          setShowFullVideo(false); // skip to next section
        }
      },
    });
  }, [scrollDir]);

  return (
    <section
      ref={sectionRef}
      className="bg-white min-h-screen flex items-center justify-center relative"
    >
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
        {/* Left Column */}
        <div className="flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-lg"
            controls
            muted
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Right Column */}
        <div className="w-[479px] h-[245px] p-4 flex flex-col justify-start items-start space-y-2">
          <p
            className="font-normal mb-2 flex items-center gap-2 transition-all duration-1200 ease-out"
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
            className="leading-tight md:leading-none mb-4 md:mb-6 lg:mb-8 font-bold transition-all duration-1200 ease-out text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
            style={{
              fontFamily: "EB Garamond, serif",
            }}
          >
            <span className="block">The Video</span>
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed pr-2" style={{
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "24px",
                  lineHeight: "147%",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                }}>
            BaFT Technologies is a next-gen neo-banking startup headquartered
            in Bangalore, proudly founded in 2025. We're a tight-knit team of
            financial innovators and tech experts on a mission: to reimagine
            financial services in India with customer-first solutions.
          </p>
         
        </div>
      </div>

      {/* Enlarged Video Overlay */}
      {showFullVideo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative w-[90%] max-w-5xl">
            <video
              className="w-full h-auto rounded-lg shadow-lg"
              autoPlay
              controls
              muted
              ref={(el) => {
                if (el) el.play();
              }}
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
            <button
              onClick={() => setShowFullVideo(false)}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Video_Component;
