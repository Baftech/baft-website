import React, { useEffect, useState, useRef } from 'react';

export default function Preloader() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [waveOffset, setWaveOffset] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 2 + 0.5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = performance.now();
    const animate = (t) => {
      const elapsed = t - start;
      const speed = 70; // px/s horizontal wave speed
      setWaveOffset((elapsed / 1000) * speed);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Dimensions (viewBox space). Rendering will scale responsively.
  const svgWidth = 800;
  const svgHeight = 400;

  // Letter approximate bounds for y (based on fontSize=230 and baseline y=285)
  const letterTopY = 285 - 230; // ~55
  const letterBottomY = 285; // baseline area

  // Ease the fill rise for a smoother, more liquid feel and clamp within letters
  const p = Math.min(1, Math.max(0, loadingProgress / 100));
  const eased = 1 - Math.pow(1 - p, 2); // ease-out quad
  const fillYInLetters = letterBottomY - eased * (letterBottomY - letterTopY);

  const generateWavePath = (yBase, amplitude, wavelength, phase) => {
    const points = [];
    const step = 8; // px between samples
    for (let x = -svgWidth; x <= svgWidth * 2; x += step) {
      const y = yBase + amplitude * Math.sin(((x + waveOffset + phase) / wavelength) * Math.PI * 2);
      points.push(`${x},${y}`);
    }
    const leftX = -svgWidth;
    const rightX = svgWidth * 2;
    return `M ${leftX},${svgHeight} L ${points.join(' ')} L ${rightX},${svgHeight} Z`;
  };

  const LetterFill = ({ clipId }) => (
    <g clipPath={`url(#${clipId})`} filter="url(#goo)">
      {/* Base rising fill constrained to letter area */}
      <rect x="0" y={fillYInLetters} width={svgWidth} height={svgHeight} fill="url(#liquidGrad)" />
      {/* Back wave (deeper, softer) */}
      <path d={generateWavePath(fillYInLetters + 4, 12, 140, 0)} fill="#E5E7EB" opacity="0.6" />
      {/* Front wave (brighter crest) */}
      <path d={generateWavePath(fillYInLetters, 16, 120, 60)} fill="#FFFFFF" opacity="0.9" />
      {/* Specular highlight near the crest */}
      <path d={generateWavePath(fillYInLetters - 2, 10, 160, 30)} fill="url(#highlightGrad)" opacity="0.35" />
    </g>
  );

  return (
    <div className="preloader min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Responsive container: fluid width with max, keep 2:1 aspect */}
      <div className="w-full max-w-[800px]" style={{ aspectRatio: '2 / 1' }}>
        <svg
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid meet"
          className="block w-full h-full"
        >
          <defs>
            {/* Clips for each letter */}
            <clipPath id="clip-B" clipPathUnits="userSpaceOnUse">
              <text x="90" y="285" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">B</text>
            </clipPath>
            <clipPath id="clip-a" clipPathUnits="userSpaceOnUse">
              <text x="265" y="285" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">a</text>
            </clipPath>
            <clipPath id="clip-F" clipPathUnits="userSpaceOnUse">
              <text x="455" y="285" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">F</text>
            </clipPath>
            <clipPath id="clip-T" clipPathUnits="userSpaceOnUse">
              <text x="610" y="285" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">T</text>
            </clipPath>

            {/* Liquid base gradient */}
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D1D5DB" />
            </linearGradient>
            {/* Crest highlight gradient */}
            <linearGradient id="highlightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>

            {/* Subtle goo filter to blend wave layers */}
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>

          {/* Liquid fill inside clipped letters */}
          <LetterFill clipId="clip-B" />
          <LetterFill clipId="clip-a" />
          <LetterFill clipId="clip-F" />
          <LetterFill clipId="clip-T" />

          {/* Letter outlines on top */}
          <text x="90" y="285" fill="none" stroke="#6B7280" strokeWidth="6" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">B</text>
          <text x="265" y="285" fill="none" stroke="#6B7280" strokeWidth="6" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">a</text>
          <text x="455" y="285" fill="none" stroke="#6B7280" strokeWidth="6" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">F</text>
          <text x="610" y="285" fill="none" stroke="#6B7280" strokeWidth="6" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="230">T</text>
        </svg>
      </div>

      {/* Loading indicator centered directly below the letters */}
      <div className="mt-3 z-10 w-full max-w-[800px]">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-400 tracking-wide text-sm md:text-base">loading</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"
                style={{ animationDelay: `${i * 0.3}s`, animationDuration: '1.5s' }}
              />
            ))}
          </div>
          <span className="text-white font-mono tracking-wider ml-2 text-sm md:text-base">{Math.floor(loadingProgress)}%</span>
        </div>
      </div>
    </div>
  );
}


