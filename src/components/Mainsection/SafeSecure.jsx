import React, { useEffect, useState } from "react";
import "./SafeSecure.css";
import SafeSecureMobile from "./SafeSecureMobile.jsx";
import { SAFE_SEC_SVG } from "../../assets/assets";

// Desktop layout
const SafeSecureDesktop = () => {
  const baseScale = 1.10004;
  const bulgeMax = 0.08; // extra scale on hover at center (stronger bulge)
  const [tilt, setTilt] = useState({ x: 0, y: 0, s: baseScale });
  const maxTilt = 8; // degrees

  const handleMove = (e) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width; // 0..1
      const relY = (e.clientY - rect.top) / rect.height; // 0..1
      const x = (relX - 0.5) * 2; // -1..1
      const y = (relY - 0.5) * 2; // -1..1
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      const r = Math.min(1, Math.sqrt(clampedX * clampedX + clampedY * clampedY));
      const intensity = 1 - r; // 1 at center, 0 at edges
      const s = baseScale + bulgeMax * intensity;
      setTilt({
        x: clampedX * maxTilt,
        y: clampedY * maxTilt,
        s,
      });
    } catch {}
  };

  const handleLeave = () => setTilt({ x: 0, y: 0, s: baseScale });

  const handleTouchMove = (e) => {
    try {
      const t = e.touches && e.touches[0];
      if (!t) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (t.clientX - rect.left) / rect.width;
      const relY = (t.clientY - rect.top) / rect.height;
      const x = (relX - 0.5) * 2;
      const y = (relY - 0.5) * 2;
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      const r = Math.min(1, Math.sqrt(clampedX * clampedX + clampedY * clampedY));
      const intensity = 1 - r;
      const s = baseScale + bulgeMax * intensity;
      setTilt({ x: clampedX * maxTilt, y: clampedY * maxTilt, s });
    } catch {}
  };

  const handleTouchEnd = () => handleLeave();

  return (
    <div className="h-screen bg-white" data-theme="light">
      <section className="h-screen flex items-center justify-center px-3 lg:px-16">
        <div className="w-full max-w-7xl">
          <div className="safe-secure-container">
            <div className="safe-secure-content">
              {/* Left Text Section */}
              <div className="safe-secure-text">
                <h2 className="safe-secure-title">Safe & Secure</h2>
                <p className="safe-secure-description">
                  At BaFT, we know trust isn't built in a day. That's why every
                  payment, every detail, and every account is protected with care. No
                  hidden risks. Just the security you deserve while managing your
                  money.
                </p>
              </div>

              {/* Logo */}
            <div className="safe-secure-logo">
              <div className="security-logo-wrapper " style = {{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "scale(1.5)",
                transformOrigin: "center center",
                perspective: "800px",
                cursor: "pointer"
              }} onMouseMove={handleMove} onMouseLeave={handleLeave} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <img
  src={SAFE_SEC_SVG}
  alt="Security Badge"
  className="security-logo-svg"
  style={{
    width: "100%",       // base size
    height: "auto",
    position : "relative",
    display: "block",
    transform: `scale(${tilt.s.toFixed(5)}) rotateX(${(-tilt.y).toFixed(2)}deg) rotateY(${tilt.x.toFixed(2)}deg)`,
    transformOrigin: "center",
    transition: "transform 200ms ease",
    willChange: "transform"
  }}
/>

              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Wrapper to switch based on viewport
const SafeSecure = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (isMobile) return <SafeSecureMobile />;
  return <SafeSecureDesktop />;
};

export default SafeSecure;
