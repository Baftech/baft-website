import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";

const Hero = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);
  const animationCompletedRef = useRef(false);

  useEffect(() => {
    let rafId;
    const start = () => {
      if (!wrapperRef.current || !placeholderRef.current) {
        rafId = requestAnimationFrame(start);
        return;
      }
      const tl = gsap.timeline();

      gsap.set(wrapperRef.current, {
        opacity: 0,
        position: "absolute",
        top: "3.4cm",
        left: 0,
        width: "100%",
        height: "100vh",
        borderRadius: 0,
        zIndex: 50,
      });

      gsap.set("#grid_container", { opacity: 0 });
      gsap.set("#text", { opacity: 0, y: 50, scale: 0.9 });

      // Responsive target based on placeholder metrics
      const targetWidth = () => (placeholderRef.current ? placeholderRef.current.offsetWidth : 0);
      const targetHeight = () => (placeholderRef.current ? placeholderRef.current.offsetHeight : 0);
      const targetTop = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().top : 0);
      const targetLeft = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().left : 0);
      const targetBorderRadius = () => {
        if (!placeholderRef.current) return 0;
        const cs = window.getComputedStyle(placeholderRef.current);
        return cs.borderRadius || 0;
      };

      tl.to(wrapperRef.current, { opacity: 1, duration: 1.4, delay: 0.6 })
        .addLabel("shrink", "+=8")
        .to(
          wrapperRef.current,
          {
            width: targetWidth,
            height: targetHeight,
            borderRadius: targetBorderRadius,
            top: targetTop,
            left: targetLeft,
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.8,
            ease: "power2.out",
            onComplete: () => {
              animationCompletedRef.current = true;
            },
          },
          "shrink"
        )
        .to("#grid_container", { opacity: 1, duration: 1.8 }, "shrink")
        .to(
          "#text",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2.2,
            ease: "power2.out",
          },
          "shrink"
        );
    };

    rafId = requestAnimationFrame(start);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Keep wrapper aligned to placeholder on viewport resize after animation completes
  useEffect(() => {
    const handleResize = () => {
      if (!animationCompletedRef.current) return;
      if (!wrapperRef.current || !placeholderRef.current) return;
      const rect = placeholderRef.current.getBoundingClientRect();
      const cs = window.getComputedStyle(placeholderRef.current);
      gsap.set(wrapperRef.current, {
        width: placeholderRef.current.offsetWidth,
        height: placeholderRef.current.offsetHeight,
        top: rect.top,
        left: rect.left,
        borderRadius: cs.borderRadius || 0,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="hero" className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center">
      {/* Grid overlay */}
      <div id="grid_container" className="absolute inset-0 opacity-0 z-0">
        <GridBackground />
      </div>

      {/* Text appears later */}
      <div id="text" className="relative z-20 text-center px-4 mt-40 opacity-0">
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
    fontStyle: "normal",
    fontSize: "clamp(72px, 9.08vw, 130.81px)", // 130.81/1440 = 9.08%
    lineHeight: "1.4", // Increased from 1.2 to 1.4 for more vertical space
    letterSpacing: "0%",
    textAlign: "center",
    width: "100%",
    // Removed height constraint to prevent text cropping
    backgroundImage: "linear-gradient(180deg, #ffffff 0%, #cccccc 15%, #161616 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  }}
>
  Do Money, Differently.
</h1>



      </div>

      {/* Placeholder container (final position) */}
<div className="relative z-10 w-full px-4 mt-6">
  <div
    ref={placeholderRef}
    className="shadow-lg mx-auto"
    style={{
      // Responsive size in normal flow
      width: "clamp(320px, 80vw, 1088px)",
      aspectRatio: "1088 / 612",
      borderRadius: "20.22%", // ≈ 220 / 1088
      overflow: "hidden",
      background:
        "transparent",
    }}
  />
</div>

{/* Floating fullscreen wrapper (GSAP animates this into placeholder) */}
<div
  ref={wrapperRef}
  className="w-full opacity-0"
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    borderRadius: 0,
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0) 54.88%, #000000 100%)",
    zIndex: 50,
  }}
>

  <video
    ref={videoRef}
    src="/BAFT Vid 2_1.mp4"
    autoPlay
    muted
    playsInline
    disablePictureInPicture
    controlsList="nodownload nofullscreen noremoteplayback"
    className="w-full h-full object-cover pointer-events-none video-blend"
    onEnded={() => videoRef.current.pause()}
  />
  
  {/* Radial gradient overlay for edge blending */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%)",
      borderRadius: "inherit",
    }}
  />
</div>

    </div>
  );
};

export default Hero;