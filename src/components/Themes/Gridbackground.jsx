import { useRef, useEffect } from "react";

export const GridBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, animationId;

    // Increased grid size to match Figma design
    const gridSize = 100; // Was 100, now larger for more spacing
    const speed = 10; // Slightly slower animation

  let progress = 0 // one shared progress-right light

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

  // --- Define the dome area (just for overlay, not skipping tiles) ---
  const domeWidth = 1359;
  const domeHeight = 457;
  const domeX = W / 2 - domeWidth / 2 + 4.5;
  const domeY = -277;

  // --- Tile background with lighter smudged gradient ---
  // --- Tile background with lighter smudged gradient ---
for (let x = 0; x < W; x += gridSize) {
  for (let y = 0; y < H; y += gridSize) {
    const col = x / gridSize;

    // 🚫 Skip checkboxes in the red-marked vertical strip (columns 4 → 9)
    if (col >= 4 && col <= 9) {
      continue;
    }

    // Normal checkbox rendering
    if (((x / gridSize) + (y / gridSize)) % 2 === 0) {
      const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
      gradient.addColorStop(0, "rgba(240,240,240,0.05)");
      gradient.addColorStop(1, "rgba(200,200,200,0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, gridSize, gridSize);
    }
  }
}

  // --- Grid lines ---
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 0.5;

  for (let x = 0; x <= W; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }

  for (let y = 0; y <= H; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // --- Vertical fade mask ---
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";

  const fade = ctx.createLinearGradient(0, H, 0, 0);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(0.5, "rgba(0,0,0,0)");
  fade.addColorStop(0.75, "rgba(0,0,0,1)");
  fade.addColorStop(1, "rgba(0,0,0,1)");

  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, W, H);

  ctx.restore();

  // --- Dome Overlay (just shading, no tile skipping) ---
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    W / 2,
    domeY + domeHeight,
    domeWidth / 2,
    domeHeight,
    0,
    Math.PI,
    2 * Math.PI
  );
  ctx.fillStyle = "#272727";
  ctx.filter = "blur(162px)";
  ctx.fill();
  ctx.restore();
}




    // New function for fading tail effect
    function drawFadingLine(x, y, dx, dy, segments = 8, totalLength = 150) {
      const segmentLength = totalLength / segments;

      for (let i = 0; i < segments; i++) {
        const startX = x + dx * segmentLength * i;
        const startY = y + dy * segmentLength * i;
        const endX = x + dx * segmentLength * (i + 1);
        const endY = y + dy * segmentLength * (i + 1);

        // Fade from bright to transparent
        const opacity = (1 - i / segments) * 0.5; // Max opacity of 0.5, fading to 0
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.lineWidth = 1.2 * (1 - (i / segments) * 0.5); // Also fade the width slightly
        ctx.shadowBlur = 3 * (1 - i / segments);
        ctx.shadowColor = `rgba(255,255,255,${opacity * 0.4})`;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    }

    function animate() {
  drawGrid()

  // Beam 1 - vertical up
  const verticalX = Math.round((gridSize * 1.5) / gridSize) * gridSize
  const y1 = H - (progress % (H + 150))
  const verticalProgress = y1 / H
  if (verticalProgress < 0.25) {
    drawFadingLine(verticalX, y1, 0, 1, 8, 200)
  }

  // Beam 2 - horizontal left
  const horizontalY = Math.round((gridSize * 1.5) / gridSize) * gridSize
  const x2 = W - (progress % (W + 150))
  const horizontalProgress = x2 / W
  if (horizontalProgress < 0.25) {
    drawFadingLine(x2, horizontalY, 1, 0, 8, 200)
  }

  // Beam 3 - vertical from top right
  const verticalXRight = Math.round((gridSize * 11) / gridSize) * gridSize
  const y3 = (progress % (H + 150)) - 150
  const verticalRightProgress = y3 / H
  if (verticalRightProgress < 0.5) {
    drawFadingLine(verticalXRight, y3, 0, -1, 8, 200)
  }

  // Beam 4 - horizontal right
  const horizontaLlY = Math.round((gridSize * 1.5) / gridSize) * gridSize
  const x3 = (progress % (W + 150)) + 150
  const horizontalLProgress = x3 / W
  if (horizontalLProgress > 0.75) {
    drawFadingLine(x3, horizontaLlY, -1, 0, 8, 200)
  }

  // shared counter for all beams
  progress += speed * 0.7

  animationId = requestAnimationFrame(animate)
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
      {/* Blue tint overlay */}
      {/* Blue tint overlay removed */}

      {/* Grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 2 }}
      />
      {/* ✨ Half Ellipse Dome Overlay */}
    <div
  className="absolute"
  style={{
    width: "900px",   // smaller width
    height: "300px",  // smaller height
    left: "calc(50% - 900px/2)", // keep centered
    top: "-180px",    // less offset
    background: "rgba(255,255,255,0.08)", // lighter gray with transparency
    filter: "blur(120px)", // softer blur
    borderRadius: "50% / 100% 100% 0 0", // top half ellipse
    zIndex: 3,
  }}
/>
    </div>
  );
};

GridBackground.jsx