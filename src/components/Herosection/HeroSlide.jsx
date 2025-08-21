import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";

const HeroSlide = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Step 0: Start fullscreen
    gsap.set(wrapperRef.current, {
      opacity: 0,
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      borderRadius: 0,
      zIndex: 50,
    });

    gsap.set("#grid_container", { opacity: 0 });
    gsap.set("#text", { opacity: 0, y: 50, scale: 0.9 });

    // Step 1: fade in fullscreen
    tl.to(wrapperRef.current, { opacity: 1, duration: 1, delay: 0.5 })
      // Step 2: shrink into placeholder after 9s
      .to(
        wrapperRef.current,
        {
          width: () => placeholderRef.current.offsetWidth,
          height: () => placeholderRef.current.offsetHeight,
          borderRadius: "220px",
          top: () => placeholderRef.current.getBoundingClientRect().top,
          left: () => placeholderRef.current.getBoundingClientRect().left,
          x: 0,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
        },
        "+=9"
      )
      // Step 3: fade in grid + text at the same time as shrink
      .to("#grid_container", { opacity: 1, duration: 1.5 }, "<")
      .to(
        "#text",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        },
        "<"
      );
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center" data-theme="dark">
      {/* Grid overlay */}
      <div id="grid_container" className="absolute inset-0 opacity-0 z-0">
        <GridBackground />
      </div>

      {/* Text appears later */}
      <div id="text" className="relative z-20 text-center px-4 mt-20">
        <p
          style={{
            fontFamily: "General Sans, sans-serif",
            fontWeight: 500,
            fontSize: "24px",
            lineHeight: "100%",
            color: "#777575",
            marginBottom: "1rem",
          }}
        >
          The new-age finance app for your digital-first life.
        </p>

        <h1
          style={{
            fontFamily: "EB Garamond",
            fontWeight: 700,
            fontSize: "clamp(72px, 8vw, 120px)",
            lineHeight: "1.3em",
            textAlign: "center",
            background: "linear-gradient(180deg, #999999 0%, #161616 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Do Money, Differently.
        </h1>
      </div>

      {/* Placeholder container (final position) */}
      <div className="relative z-10 flex justify-center items-center mt-10 w-full">
        <div
          ref={placeholderRef}
          className="relative w-full max-w-[1000px] h-[600px]"
          style={{ overflow: "hidden" }}
        />
      </div>

      {/* Floating fullscreen wrapper (GSAP animates this into placeholder) */}
      <div ref={wrapperRef} style={{ overflow: "hidden" }}>
        <video
          ref={videoRef}
          src="/BAFT Vid 2_1.mp4"
          autoPlay
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          className="w-full h-full object-cover pointer-events-none"
          onEnded={() => videoRef.current.pause()}
        />
      </div>
    </div>
  );
};

export default HeroSlide;
