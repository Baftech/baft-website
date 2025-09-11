import React, { useEffect, useState } from "react";
import "./SafeSecure.css";
import SafeSecureMobile from "./SafeSecureMobile.jsx";
import { SAFE_SEC_SVG } from "../../assets/assets";

// Desktop layout
const SafeSecureDesktop = () => {
  const baseScale = 1.18;
  const hoverScale = 1.24;
  const imageBaseScale = 1.08;
  const imageHoverScale = 1.14;
  const [isHovering, setIsHovering] = useState(false);
  const handleEnter = () => setIsHovering(true);
  const handleLeave = () => setIsHovering(false);
  const handleTouchStart = () => setIsHovering(true);
  const handleTouchEnd = () => setIsHovering(false);

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
               <div 
                 className={`security-logo-wrapper ${isHovering ? 'hovering' : ''}`}
                 style={{
                   width: "100%",
                   height: "100%",
                   display: "flex",
                   justifyContent: "center",
                   alignItems: "center",
                   transformOrigin: "center center",
                   cursor: "pointer",
                   overflow: "hidden",
                   transform: `scale(${(isHovering ? hoverScale : baseScale).toFixed(3)})`,
                   transition: "transform 200ms ease"
                 }} 
                 onMouseEnter={handleEnter}
                 onMouseLeave={handleLeave}
                 onTouchStart={handleTouchStart}
                 onTouchEnd={handleTouchEnd}
               >
                 <div 
                   className="image-container"
                   style={{
                     overflow: "hidden"
                   }}
                 >
                   <img
                     src={SAFE_SEC_SVG}
                     alt="Security Badge"
                     className="security-logo-svg"
                     style={{
                       width: "100%",
                       height: "100%",
                       position: "relative",
                       display: "block",
                       transform: `scale(${(isHovering ? imageHoverScale : imageBaseScale).toFixed(3)})`,
                       transformOrigin: "center",
                       transition: "transform 200ms ease"
                     }}
                   />
                 </div>
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