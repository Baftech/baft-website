import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Videocomponent = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef([]);
  const textContainerRef = useRef(null);

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

      tl.from(imageRef.current, {
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

  // GSAP ScrollTrigger for proper section pinning and animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main ScrollTrigger with pin and animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center", // Start when section center reaches viewport center
          end: "+=100vh", // Pin for 100vh of scrolling
          pin: true, // Pin the section
          scrub: 1, // Smooth scrub animation
          onUpdate: (self) => {
            console.log('Scroll progress:', self.progress); // Debug log
          }
        }
      });

      // Set initial state - static layout
      tl.set([imageRef.current, videoRef.current, textContainerRef.current], {
        clearProps: "all" // Clear any previous transforms
      });
      
      // Stage 1: Keep static for first part (0-40% of timeline)
      tl.to({}, { duration: 0.4 }); // Empty animation to create delay
      
      // Stage 2: Start image to video transition (40-50%)
      tl.to(imageRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: "none"
      }, 0.4)
      .to(videoRef.current, {
        opacity: 1,
        duration: 0.1,
        ease: "none"
      }, 0.4);
      
      // Stage 3: Video moves from left to center and scales (50-100%)
      tl.to(videoRef.current, {
        x: window.innerWidth * 0.25, // Move to center
        y: -50, // Move up slightly
        scale: 1.8, // Scale up
        zIndex: 50,
        duration: 0.5,
        ease: "power2.out"
      }, 0.5);
      
      // Stage 4: Paragraph slides right with opacity fade (50-100%)
      tl.to(textContainerRef.current, {
        x: window.innerWidth, // Move completely right
        opacity: 0, // Fade out
        duration: 0.5,
        ease: "power2.out"
      }, 0.5);

      // Auto-play video when it's visible and scaled
      tl.call(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(error => {
            console.log('Video play failed:', error);
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.log('Muted play also failed:', e));
          });
        }
      }, null, 0.7); // Call at 70% of timeline
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white min-h-[150vh] flex items-center justify-center relative overflow-hidden"
    >
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 relative z-[1]">
        {/* Left Column */}
        <div className="flex items-center justify-center relative">
          {/* Initial Static Image */}
          <img
            ref={imageRef}
            src="/video_com.png"
            alt="Video Preview"
            className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 relative"
            style={{
              transformOrigin: "center center"
            }}
          />
          
          {/* Video Element (initially hidden) */}
          <video
            ref={videoRef}
            className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 absolute top-0 left-0 opacity-0"
            controls
            muted
            playsInline
            preload="metadata"
            style={{
              transformOrigin: "center center"
            }}
            onError={(e) => {
              console.error('Video error:', e.target.error);
            }}
            onLoadedData={() => {
              console.log('Video loaded successfully');
            }}
          >
            <source src="/BAFT Vid 2_1.mp4" type="video/mp4" />
            <source src="/bfast_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Column */}
        <div 
          ref={textContainerRef}
          className="w-[479px] h-[245px] p-4 flex flex-col justify-start items-start space-y-2"
        >
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
