import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Fast = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);

  // Starfield effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 8000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let rotationAngle = 0;
    let rafId = 0;

    function draw() {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotationAngle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#000000";
        ctx.fill();
      }

      ctx.restore();
      rotationAngle += 0.0005; // Slow rotation

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // GSAP scroll animation
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top", // Start as soon as section reaches top
        end: "bottom bottom", // Run until section leaves viewport
        scrub: true,
        pin: true, // Keep section full-screen during scroll
      },
    });

    tl.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 0, ease: "power2.out" },
      0
    ).fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: "power1.out" },
      0.1
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [sectionRef, contentRef, overlayRef]);

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-white"
    >
      {/* Black overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />

      {/* Starfield */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "transparent",
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="flex flex-col items-center relative z-10 text-center"
      >
        <h1
          className="text-[130px] eb-garamond-Bfast bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent"
        >
          B-Fast
        </h1>

        <p
          className="text-[28px] inter-Bfast_sub bg-gradient-to-r from-[#777575] to-[#092646] bg-clip-text text-transparent mt-4"
        >
          One Tap. Zero Wait.
        </p>

        <video
          src="/bfast_video.mp4"
          alt="Bfast animation"
          className="w-[1500px] max-w-full h-auto mt-2"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default B_Fast;
