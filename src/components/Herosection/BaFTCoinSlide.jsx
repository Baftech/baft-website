import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Background grid effect for BaFT Coin slide
const CoinGridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, animationId;

    const gridSize = 100;
    const speed = 10;
    let progress = 0;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    function drawGrid() {
      ctx.clearRect(0, 0, W, H);

      const regions = [
        { x: 0, y: 0, width: W / 2, height: H / 2 },
        { x: W / 2, y: H / 2, width: W / 2, height: H / 2 }
      ];

      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 0.25;

      regions.forEach(region => {
        const { x, y, width, height } = region;

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();

        for (let gx = 0; gx <= W; gx += gridSize) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, H);
          ctx.stroke();
        }

        for (let gy = 0; gy <= H; gy += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(W, gy);
          ctx.stroke();
        }

        ctx.restore();
      });
    }

    function drawDiagonalRectangle() {
      ctx.save();
      ctx.fillStyle = "black";
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-Math.PI / 4);
      const rectWidth = Math.sqrt(W * W + H * H);
      const rectHeight = 800;
      ctx.fillRect(-rectWidth / 2, -rectHeight / 2, rectWidth, rectHeight);
      ctx.restore();
    }

    function getLifetimeFactor(progress, cycleLength) {
      const t = (progress % cycleLength) / cycleLength;
      return Math.sin(Math.PI * t);
    }

    function getOffsetPosition(progress, screenLength, fromStart = true) {
      const cycle = screenLength * 1.5;
      const raw = progress % cycle;
      return fromStart
        ? raw - screenLength * 0.25
        : screenLength - (raw - screenLength * 0.25);
    }

    function drawFadingLine(x, y, dx, dy, lifetime, segments = 8, totalLength = 150) {
      const segmentLength = totalLength / segments;

      for (let i = 0; i < segments; i++) {
        const startX = x + dx * segmentLength * i;
        const startY = y + dy * segmentLength * i;
        const endX = x + dx * segmentLength * (i + 1);
        const endY = y + dy * segmentLength * (i + 1);

        const opacity = lifetime * (1 - i / segments) * 0.6;
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = 1.2 * (1 - (i / segments) * 0.5) * lifetime;
        ctx.shadowBlur = 4 * (1 - i / segments) * lifetime;
        ctx.shadowColor = `rgba(255,255,255,${opacity * 0.5})`;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    }

    function animate() {
      drawGrid();
      drawDiagonalRectangle();

      const cycleLength = 2000;
      const lifetime = getLifetimeFactor(progress, cycleLength);
      const horizontalLifetime = getLifetimeFactor(progress + cycleLength * 0.2, cycleLength);

      const verticalX = gridSize * 0.5;
      const y1 = getOffsetPosition(progress, H, true);
      drawFadingLine(verticalX, y1, 0, -1, lifetime, 8, 200);

      const verticallX = gridSize * 2.5;
      const y2 = getOffsetPosition(progress, H, false);
      drawFadingLine(verticallX, y2, 0, 1, lifetime, 8, 200);

      const verticalXRight = gridSize * 12;
      const y3 = getOffsetPosition(progress, H, true);
      drawFadingLine(verticalXRight, y3, 0, -1, lifetime, 8, 200);

      const vertical4XRight = gridSize * 10;
      const y4 = getOffsetPosition(progress, H, false);
      drawFadingLine(vertical4XRight, y4, 0, 1, lifetime, 8, 200);

      const horizontalY = gridSize * 1.5;
      const x2 = W - ((progress % (W * 1.5)) + W * 0.75);
      drawFadingLine(x2, horizontalY, 1, 0, horizontalLifetime, 8, 200);

      const horizontaLlY = gridSize * 3.5;
      const x3 = ((progress % (W * 1.5)) + W * 0.75);
      drawFadingLine(x3, horizontaLlY, -1, 0, horizontalLifetime, 8, 200);

      progress += speed * 0.7;
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />
    </div>
  );
};

const BaFTCoinSlide = () => {
  useGSAP(() => {
    const timer = setTimeout(() => {
      gsap.set("#introduction", { y: 100, opacity: 0 });
      gsap.set("#baft_coin_text", { y: 100, opacity: 0 });
      gsap.set("#B_coin", { y: 100, opacity: 0 });

      const tl = gsap.timeline();
      tl.to("#introduction", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      })
      .to("#baft_coin_text", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.2")
      .to("#B_coin", {
        y: 0,
        opacity: 0.3,
        duration: 1.2,
        ease: "power2.out"
      }, "-=0.2")
      .to("#B_coin", {
        y: -20,
        duration: 0.8,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      }, "+=0.5");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="baft_coin_section"
      data-theme="dark"
      className="relative w-full h-screen bg-black text-white flex items-center justify-center z-20 px-4 sm:px-6 md:px-8"
    >
      {/* Background grid effect */}
      <CoinGridBackground />

      <img
        id="B_coin"
        src="/b-coin image.png"
        alt="BaFT Coin Image"
        className="w-64 sm:w-80 md:w-96 lg:w-[500px] h-auto p-6 sm:p-8 md:p-10 opacity-30"
      />
      <div className="absolute flex flex-col items-center text-center">
        <h6
          id="introduction"
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[55px] eb-garamond-introduction mb-2 sm:mb-3 md:mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]"
        >
          Introducing
        </h6>
        <h1
          id="baft_coin_text"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[130px] eb-garamond-Baftcoin drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]"
        >
          BaFT Coin
        </h1>
      </div>
    </div>
  );
};

export default BaFTCoinSlide;
