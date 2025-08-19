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
  const shootingStars = [];
  const starCount = Math.floor(canvas.width * canvas.height / 3000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      opacity: 0.05 + Math.random() * 0.25, // Dimmer stars
    });
  }

  let rotationAngle = 0; // For rotation effect

  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rotate around center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotationAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Stars
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fill();
    }

    ctx.restore();

    // Shooting stars (only diagonal)
    if (Math.random() < 0.008) {
      const fromLeft = Math.random() < 0.5;
      shootingStars.push({
        x: fromLeft ? 0 : canvas.width,
        y: 0,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 6 + 4,
        angle: fromLeft ? Math.PI / 4 : (3 * Math.PI) / 4, // 45° or 135°
        life: 1,
      });
    }

    for (let i = 0; i < shootingStars.length; i++) {
      const s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= 0.01;

      if (s.life > 0) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        );
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.life})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        shootingStars.splice(i, 1);
        i--;
      }
    }

    // Increment rotation slowly
    rotationAngle += 0.0001;

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  return () => {
    window.removeEventListener("resize", resizeCanvas);
  };
}, []);


  return (
    <div className="pre-footer-container">
      {/* Starfield Background */}
      <canvas
        ref={canvasRef}
        className="starfield-canvas"
      />

      {/* Concentric Circles */}
      <div className="concentric-wrapper">
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
        <div className="concentric-circle" />
      </div>

      {/* SVG Layer */}
      <div className="svg-container">
        <object
          data={`${import.meta.env.BASE_URL}pre_footer.svg`}
          type="image/svg+xml"
          aria-label="Star Animation"
          className="svg-object"
        >
          <img
            src={`${import.meta.env.BASE_URL}pre_footer.svg`}
            alt="Star Animation"
            className="svg-fallback"
          />
        </object>
      </div>

      {/* Text */}
      <div className="text-container">
        <h1 className="main-heading">Banking was never easy…</h1>
        <p className="sub-heading">BAFT – Built for You, Powered by Tech</p>
      </div>
    </div>
  );
};

export default Pre_footer;
