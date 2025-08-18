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

  // === Canvas Starfield ===
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  let stars = [];
  let rafId = 0;
  let rotationAngle = 0;

  const createStars = () => {
    const starCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 8000
    );

    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
      });
    }
  };

  const resizeCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform before scaling
    ctx.scale(dpr, dpr);
    createStars(); // regenerate stars on resize
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
    ctx.rotate(rotationAngle);
    ctx.translate(-window.innerWidth / 2, -window.innerHeight / 2);

    for (let star of stars) {
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.radius * 3
      );
      gradient.addColorStop(0, `rgba(0,0,0,${star.alpha})`);
      gradient.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    rotationAngle += 0.0005;
    rafId = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resizeCanvas);
  };
}, []);

  // === GSAP ScrollTrigger Animation ===
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: true,
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-white"
      aria-label="B-Fast hero section"
    >
      {/* Black Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black z-20 pointer-events-none"
        aria-hidden="true"
      />

      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 bg-transparent"
        role="presentation"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[130px] eb-garamond-Bfast bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent">
          B-Fast
        </h1>

        <p className="mt-4 text-lg sm:text-xl md:text-2xl inter-Bfast_sub bg-gradient-to-r from-[#777575] to-[#092646] bg-clip-text text-transparent">
          One Tap. Zero Wait.
        </p>

        {/* Responsive Video */}
        <div className="relative w-full max-w-[1500px] mt-4">
          <video
            src="/bfast_video.mp4"
            className="w-full h-auto object-contain"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Fallback for JS-disabled users */}
      <noscript>
        <style>{`.no-js-hidden { display: none; }`}</style>
        <div className="bg-black text-white p-6 text-center z-30">
          Please enable JavaScript to experience the full B-Fast animation.
        </div>
      </noscript>
    </section>
  );
};

export default B_Fast;
