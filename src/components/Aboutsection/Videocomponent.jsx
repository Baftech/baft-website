import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Videocomponent = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const textContainerRef = useRef(null);
  const videoOverlayRef = useRef(null);

  // GSAP ScrollTrigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=100vh",
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            console.log("Scroll progress:", self.progress);
          },
        },
      });

      // Stage 1: Keep static layout (0-40% of timeline)
      tl.to({}, { duration: 0.4 });

      // Stage 2: Text moves right and fades out (40-60%)
      tl.to(
        textContainerRef.current,
        {
          x: "100vw",
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0.4
      );

      // Stage 3: Image fades out, video overlay appears (40-50%)
      tl.to(
        imageRef.current,
        {
          opacity: 0,
          duration: 0.1,
          ease: "none",
        },
        0.4
      ).to(
        videoOverlayRef.current,
        {
          opacity: 1,
          duration: 0.1,
          ease: "none",
        },
        0.4
      );

      // Stage 4: Video overlay scales and positions (50-100%)
      tl.to(
        videoOverlayRef.current,
        {
          scale: 1.2,
          duration: 0.5,
          ease: "power2.out",
        },
        0.5
      );

      // Auto-play video when it's scaled
      tl.call(
        () => {
          if (videoRef.current) {
            videoRef.current.play().catch((error) => {
              console.log("Video play failed:", error);
              videoRef.current.muted = true;
              videoRef.current
                .play()
                .catch((e) => console.log("Muted play also failed:", e));
            });
          }
        },
        null,
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white min-h-[150vh] flex items-center justify-center relative overflow-hidden"
    >
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 items-center max-w-[1200px] mx-auto w-full">
        {/* Left Column - Image */}
        <div className="flex items-center justify-center relative w-full h-full">
          <img
            ref={imageRef}
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
        <div
          ref={textContainerRef}
          className="flex flex-col justify-start items-start space-y-2"
        >
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

      {/* Full-Screen Video Overlay (initially hidden) */}
      <div
        ref={videoOverlayRef}
        className="fixed inset-0 bg-white rounded-lg bg-opacity-80 flex items-center justify-center z-50 opacity-0"
        style={{
          transformOrigin: "center center",
        }}
      >
        <video
          ref={videoRef}
          className="shadow-2xl justify-center"
          
          muted
          playsInline
          preload="metadata"
          style={{
            position: "absolute", // so top/left take effect
            width: "1000px",
            height: "700px",
            transform: "rotate(0deg)", // matches your angle
            opacity: 1,
            
            borderRadius: "63.44px", // exact rounded corners
            transformOrigin: "center center",
            objectFit: "contain",
          }}
          onError={(e) => {
            console.error("Video error:", e.target.error);
          }}
          onLoadedData={() => {
            console.log("Video loaded successfully");
          }}
        >
          <source src="/BAFT Vid 2_1.mp4" type="video/mp4" />
          <source src="/bfast_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
