import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Fast = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

    ScrollTrigger.create({
    trigger: sectionRef.current,
    start: "top center",
    onEnter: () => {
      videoRef.current.currentTime = 0; // restart video
      videoRef.current.play();
    },
    onEnterBack: () => {
      videoRef.current.currentTime = 0; // restart video
      videoRef.current.play();
    },
  });

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: 0.7 + Math.random() * 0.3, // brighter range (0.7–1.0)
      });
    }

    let rotationAngle = 0;

    function draw() {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotationAngle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `(#000000;
 ${star.opacity})`; // Bright sky blue stars
        ctx.fill();
      }

      ctx.restore();
      rotationAngle += 0.0001;

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // GSAP scroll animation
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom", // start fading when section enters
        end: "top center", // fully revealed at center
        scrub: true,
      },
    });

    // Screen reveal from black
    tl.fromTo(
      "#black-overlay",
      { opacity: 1 },
      { opacity: 0, ease: "power2.out" },
      0
    );

    // Your existing content fade
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: "power1.out" },
      0.1
    );

    tl.fromTo(
      videoRef.current,
      { opacity: 0 },
      { opacity: 1, ease: "power1.out" },
      0.2
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      id="entire"
      className="relative flex flex-col justify-center py-35 min-h-screen overflow-hidden"
    >
      {/* Black overlay for reveal */}
      <div
        id="black-overlay"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          zIndex: 20,
          pointerEvents: "none",
        }}
      ></div>

      {/* Starfield Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#ffff", // keep black background for contrast
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="flex flex-col items-center relative z-10"
      >
        <h1
          id="bfast"
          className="text-[130px] flex-center eb-garamond-Bfast 
      bg-gradient-to-r from-[#9AB5D2] to-[#092646] 
      bg-clip-text text-transparent"
        >
          B-Fast
        </h1>

        <p
          id="bfast-sub"
          className="flex flex-col text-[28px] flex-center inter-Bfast_sub 
      bg-gradient-to-r from-[#777575] to-[#092646] 
      bg-clip-text text-transparent mt-4"
        >
          One Tap. Zero Wait.
        </p>

        {/* GIF below heading and paragraph */}
        <img
          src="/baft_video.gif"
          alt="Bfast animation"
          className="w-[1500px] max-w-full h-auto"
          style={{ opacity: 1 }}
        />
      </div>
    </div>
  );
};

export default B_Fast;
