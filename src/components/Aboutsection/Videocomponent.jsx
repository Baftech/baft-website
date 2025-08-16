import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Videocomponent = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef([]);
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

  // Scroll animations for entering section
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom top",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(videoRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      tl.from(
        textRef.current,
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP ScrollTrigger to handle enlarged overlay video
  useEffect(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        if (scrollDir === "up") {
          setShowFullVideo(true);
        }
      },
      onEnterBack: () => {
        if (scrollDir === "up") {
          setShowFullVideo(true);
        }
      },
      onLeave: () => {
        if (scrollDir === "down") {
          setShowFullVideo(false);
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
            ref={(el) => (textRef.current[0] = el)}
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
            ref={(el) => (textRef.current[1] = el)}
            className="leading-tight md:leading-none mb-4 md:mb-6 lg:mb-8 font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
            style={{
              fontFamily: "EB Garamond, serif",
            }}
          >
            <span className="block">The Video</span>
          </h1>
          <p
            ref={(el) => (textRef.current[2] = el)}
            className="text-sm text-gray-600 leading-relaxed pr-2"
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "24px",
              lineHeight: "147%",
              letterSpacing: "0px",
              verticalAlign: "middle",
            }}
          >
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
          <div
            className="relative w-[90%] max-w-5xl"
            style={{ animation: "fadeZoomIn 0.5s ease-out forwards" }}
          >
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
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1 opacity-0 animate-fadeIn"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style jsx>{`
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
