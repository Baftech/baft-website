import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { GridBackground } from "../Themes/Gridbackground";

const Hero = () => {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);
  const placeholderRef = useRef(null);

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
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        borderRadius: 0,
        zIndex: 50,
      });

      gsap.set("#grid_container", { opacity: 0 });
      gsap.set("#text", { opacity: 0, y: 50, scale: 0.9 });

      const safeWidth = () => (placeholderRef.current ? placeholderRef.current.offsetWidth : 0);
      const safeHeight = () => (placeholderRef.current ? placeholderRef.current.offsetHeight : 0);
      const safeTop = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().top : 0);
      const safeLeft = () => (placeholderRef.current ? placeholderRef.current.getBoundingClientRect().left : 0);

      tl.to(wrapperRef.current, { opacity: 1, duration: 1.4, delay: 0.6 })
        .to(
          wrapperRef.current,
          {
            width: safeWidth,
            height: safeHeight,
            borderRadius: "220px",
            top: safeTop,
            left: safeLeft,
            x: 0,
            y: 0,
            duration: 1.8,
            ease: "power2.out",
          },
          "+=9.2"
        )
        .to("#grid_container", { opacity: 1, duration: 1.8 }, "<")
        .to(
          "#text",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 2.2,
            ease: "power2.out",
          },
          "<"
        );
    };

    rafId = requestAnimationFrame(start);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center">
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
    fontSize: "clamp(72px, 8vw, 120px)",
    lineHeight: "1.3em",
    textAlign: "center",
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
<div className="relative z-10 flex justify-center items-center mt-5 w-full">
  <div
    ref={placeholderRef}
    className="
      w-[clamp(280px,80vw,600px)]   /* responsive width: min 280px, max 600px */
      h-[clamp(150px,42vw,320px)]  /* responsive height: min 150px, max 320px */
      rounded-[220px]
      shadow-lg
      bg-black
    "
    style={{ overflow: "hidden" }}
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
    background: "black",
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
</div>

    </div>
  );
};

export default Hero;