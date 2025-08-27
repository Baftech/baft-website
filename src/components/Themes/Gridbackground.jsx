import { useRef, useEffect } from "react";

export const GridBackground = ({ forceMobile = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, dpr, animationId;
    let startMs = 0; // track first frame time for elapsed calculations

    // Mobile-specific grid behavior
    const isMobile = forceMobile || window.innerWidth <= 768;
    
    // Mobile timing variables (accessible to all functions)
    const mobileDelay = isMobile ? 0 : 11000;
    const mobileDuration = isMobile ? 1000 : 3000;
    
    // Grid size - increased for better visibility
    const gridSize = isMobile ? 48 : 110; // Larger grid size for mobile
    const speed = isMobile ? 5 : 7; // Slower animation for mobile

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

  function drawGrid(elapsedMs) {
  ctx.clearRect(0, 0, W, H);

  // --- Define the dome area (just for overlay, not skipping tiles) ---
  const domeWidth = W * 1.2; // Wider than screen width for gentle curve
  const domeHeight = 150; // Much shallower for gentle arc
  const domeX = W / 2 - domeWidth / 2;
  const domeY = -50; // Closer to screen for subtle effect

  // --- Tile background - static for mobile, animated for desktop ---
  // Mobile: Always show tiles, Desktop: Wait and animate
  const tilesAlpha = isMobile ? 1 : (elapsedMs < mobileDelay ? 0 : Math.min(1, (elapsedMs - mobileDelay) / mobileDuration));

  // Compute a responsive centered band of columns to skip (e.g., ~20% of width)
  const totalCols = Math.max(1, Math.ceil(W / gridSize));
  const bandWidthCols = Math.max(2, Math.round(totalCols * 0.2));
  const bandStartCol = Math.floor((totalCols - bandWidthCols) / 2);
  const bandEndCol = bandStartCol + bandWidthCols - 1;
  
  if (elapsedMs < 10000) {
    // Make tiles simple black background for first 10 seconds
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,1)";
    for (let x = 0; x < W; x += gridSize) {
      for (let y = 0; y < (isMobile ? H * 0.50 : H); y += gridSize) {
        const col = x / gridSize;

        // 🚫 Skip checkboxes in the responsive centered strip
        if (col >= bandStartCol && col <= bandEndCol) {
          continue;
        }

        // Draw simple black tiles
        if (((x / gridSize) + (y / gridSize)) % 2 === 0) {
          ctx.fillRect(x, y, gridSize, gridSize);
        }
      }
    }
    ctx.restore();
  } else if (tilesAlpha > 0) {
    // Show actual grid pattern after 10 seconds
    ctx.save();
    ctx.globalAlpha = tilesAlpha;
    for (let x = 0; x < W; x += gridSize) {
      for (let y = 0; y < H; y += gridSize) {
        const col = x / gridSize;

        // 🚫 Skip checkboxes in the responsive centered strip
        if (col >= bandStartCol && col <= bandEndCol) {
          continue;
        }

        // Actual grid pattern rendering
        if (((x / gridSize) + (y / gridSize)) % 2 === 0) {
          if (isMobile) {
            // Mobile: Simpler, more subtle tiles
            ctx.fillStyle = "rgba(255,255,255,0.03)";
            ctx.fillRect(x, y, gridSize, gridSize);
          } else {
            // Desktop: Gradient tiles
            const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
            gradient.addColorStop(0, "rgba(240,240,240,0.05)");
            gradient.addColorStop(1, "rgba(200,200,200,0.05)");
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, gridSize, gridSize);
          }
        }
      }
    }
    ctx.restore();
  }

  // --- Grid lines - static for mobile, animated for desktop ---
  const gridAlpha = isMobile ? 1 : (elapsedMs < mobileDelay ? 0 : 1);
  
  // Only draw grid lines if they should be visible
  if (gridAlpha > 0) {
    // Grid lines with better visibility
    const gridOpacity = isMobile ? 0.4 : 0.25; // Increased mobile opacity
    const gridWidth = isMobile ? 0.8 : 0.5; // Thicker mobile lines
    ctx.strokeStyle = `rgba(255,255,255,${gridOpacity * gridAlpha})`;
    ctx.lineWidth = gridWidth;

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

  // --- Gentle Arc Dome Overlay (drawn last to maintain visibility) ---
  ctx.save();
  ctx.globalCompositeOperation = "source-over"; // Ensure dome is drawn on top
  
  // Make dome appear - static for mobile, animated for desktop
  const domeAlpha = isMobile ? 1 : (elapsedMs < mobileDelay ? 0 : Math.min(1, (elapsedMs - mobileDelay) / mobileDuration));
  ctx.globalAlpha = domeAlpha;
  
  ctx.beginPath();
  
  // Create a smooth, gentle arc that curves down in the center
  const arcWidth = W * 1.2; // Wider than screen for gentle curve
  const arcHeight = 80; // Very shallow height for subtle arc
  const arcX = W / 2;
  const arcY = 50; // Position for gentle curve
  
  // Draw the arc using quadratic curves for smoothness
  ctx.moveTo(0, arcY); // Start at left edge
  
  // Left curve down
  ctx.quadraticCurveTo(
    arcX * 0.25, // Control point 1/4 from left
    arcY + arcHeight * 0.8, // Dip down
    arcX, // Center point (lowest)
    arcY + arcHeight
  );
  
  // Right curve up
  ctx.quadraticCurveTo(
    arcX * 1.75, // Control point 3/4 from left
    arcY + arcHeight * 0.8, // Dip down
    W, // End at right edge
    arcY
  );
  
  // Close the path to create the dome
  ctx.lineTo(W, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)"; // Increased from 0.15 to 0.35 for brighter dome
  ctx.filter = "blur(120px)"; // Increased blur for softer, more diffused glow
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
  if (!startMs) startMs = performance.now();
  const elapsed = performance.now() - startMs;
  drawGrid(elapsed)

  // Only show beams for desktop (mobile: no beams)
  if (!isMobile && elapsed >= mobileDelay) {
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
    if (horizontalProgress < 0.20) {
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
    if (horizontalLProgress > 0.80) {
      drawFadingLine(x3, horizontaLlY, -1, 0, 8, 200)
    }

    // shared counter for all beams
    progress += speed * 0.7
  }

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
      {/* Grid canvas layer at 60% opacity */}
      <div className="absolute inset-0" style={{ opacity: 0.6 }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 9998 }}
        />
      </div>


    </div>
  );
};
GridBackground.jsx
