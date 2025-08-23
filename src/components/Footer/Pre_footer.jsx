import React, { useEffect, useRef } from "react";
import "./Pre_footer.css";

const Pre_footer = () => {
  const canvasRef = useRef(null);

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
    const starCount = Math.floor(canvas.width * canvas.height / 9000); // fewer stars

    for (let i = 0; i < starCount; i++) {
      stars.push({
        radius: Math.random() * 1.5 + 0.5,
        opacity: 0.05 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2, // polar angle
        dist: Math.random() * (Math.min(canvas.width, canvas.height) / 2),
      });
    }

    let rotationSpeed = 0.0005; // galaxy swirl

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Rotating galaxy stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.angle += rotationSpeed;

        const x = cx + Math.cos(star.angle) * star.dist;
        const y = cy + Math.sin(star.angle) * star.dist;

        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="pre-footer-container">
      <canvas ref={canvasRef} className="starfield-canvas" />

      <div className="concentric-wrapper">
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
      </div>

      <div className="text-container">
        <h1 className="main-heading">Banking was never easy…</h1>
        <p className="sub-heading">BaFT – Built for You, Powered by Tech</p>
      </div>
    </div>
  );
};

export default Pre_footer;
