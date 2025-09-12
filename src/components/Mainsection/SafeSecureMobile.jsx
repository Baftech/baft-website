import React, { useEffect } from "react";
import "./SafeSecure.css";
import { SAFE_SEC_SVG } from "../../assets/assets";

const SafeSecureMobile = () => {
  const isSafari = typeof navigator !== 'undefined' && /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios|android/i.test(navigator.userAgent);
  const isIPad = typeof navigator !== 'undefined' && /ipad/i.test(navigator.userAgent);
  const isIPadPro = typeof navigator !== 'undefined' && /ipad/i.test(navigator.userAgent) && window.screen.width >= 1024;
  const isPhone = typeof navigator !== 'undefined' && /mobile/i.test(navigator.userAgent) && !/ipad/i.test(navigator.userAgent);

  return (
    <div className="h-screen bg-gray-900 relative" style={{
      // Safari hardware acceleration
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden'
    }}>
      <section className="h-full flex items-center justify-center px-0" style={{
        // Safari-specific optimizations
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}>
        <div className="w-full h-full relative" style={{
          // Safari hardware acceleration
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}>
          {/* Main Content - Safari optimized */}
          <div
            className="safe-secure-container flex flex-col items-center justify-center text-center"
            style={{
              width: "100%",
              height: "100%",
              background: "#000000",
              padding: "2rem 1rem",
              gap: "2rem",
              // Safari hardware acceleration
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Title - Safari optimized */}
            <h1
              className="safe-secure-title"
              style={{
                fontSize: isIPadPro ? "clamp(64px, 16vw, 96px)" : isIPad ? "clamp(56px, 14vw, 84px)" : isPhone ? "clamp(42px, 11vw, 60px)" : isSafari ? "clamp(48px, 12vw, 72px)" : "clamp(56px, 14vw, 96px)",
                color: "#FFFFFF",
                fontWeight: "700",
                fontFamily: "EB Garamond, serif",
                lineHeight: "100%",
                textAlign: "center",
                marginTop: isIPadPro ? "clamp(12px, 8vh, 40px)" : isIPad ? "clamp(8px, 6vh, 32px)" : isPhone ? "clamp(6px, 4vh, 24px)" : isSafari ? "clamp(8px, 5vh, 28px)" : "clamp(8px, 6vh, 40px)",
                marginBottom: isIPadPro ? "2rem" : isIPad ? "1.5rem" : isPhone ? "1.2rem" : isSafari ? "1.5rem" : "2rem",
                maxWidth: "90vw",
                overflow: "hidden",
                wordWrap: "break-word",
                padding: "0 1rem",
                // Safari text rendering optimizations
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                WebkitTextStroke: '0.01em transparent',
                // Safari hardware acceleration
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            >
              Safe & Secure
            </h1>

            {/* Description - Safari optimized */}
            <p
              className="safe-secure-description"
              style={{
                fontSize: isIPadPro ? "clamp(18px, 5vw, 24px)" : isIPad ? "clamp(16px, 4vw, 20px)" : isPhone ? "clamp(13px, 3.5vw, 15px)" : isSafari ? "clamp(14px, 4vw, 16px)" : "clamp(14px, 4vw, 16px)",
                color: "#FFFFFF8C",
                fontWeight: "400",
                fontFamily: "Inter, sans-serif",
                lineHeight: "1.6",
                textAlign: "center",
                maxWidth: isIPadPro ? "45ch" : isIPad ? "40ch" : isPhone ? "32ch" : isSafari ? "34ch" : "35ch",
                marginBottom: isIPadPro ? "2rem" : isIPad ? "1.5rem" : isPhone ? "1.2rem" : isSafari ? "1.5rem" : "2rem",
                // Safari text rendering optimizations
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                WebkitTextStroke: '0.01em transparent',
                // Safari hardware acceleration
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}
            >
              At BaFT, we know trust isn't built in a day. That's why every
              payment, every detail, and every account is protected with care.
              No hidden risks. Just the security you deserve while managing your
              money.
            </p>

            {/* Logo - Safari optimized */}
            <div className="safe-secure-logo">
              <div
                className="security-logo-wrapper"
                style={{
                  width: isIPadPro ? 'clamp(320px, 45vw, 420px)' : isIPad ? 'clamp(280px, 40vw, 360px)' : isPhone ? 'clamp(200px, 28vw, 250px)' : isSafari ? 'clamp(250px, 35vw, 320px)' : '100%',
                  height: isIPadPro ? 'clamp(320px, 45vw, 420px)' : isIPad ? 'clamp(280px, 40vw, 360px)' : isPhone ? 'clamp(200px, 28vw, 250px)' : isSafari ? 'clamp(250px, 35vw, 320px)' : '100%',
                  aspectRatio: '1 / 1',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                  flexGrow: 0,
                  boxSizing: 'border-box',
                  transform: 'none',
                  WebkitTransform: 'none',
                  transformOrigin: 'center center',
                  WebkitTransformOrigin: 'center center',
                  overflow: 'hidden',
                  borderRadius: '50%',
                  margin: '0 auto',
                  WebkitMaskImage: 'radial-gradient(circle, #000 99.9%, transparent 100%)',
                  maskImage: 'radial-gradient(circle, #000 99.9%, transparent 100%)',
                  opacity: 1,
                }}
              >
                <img
                  src={SAFE_SEC_SVG}
                  alt="Security Badge"
                  className="security-logo-svg"
                  style={{
                    width: '108%',
                    height: '108%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    WebkitTransform: 'translate(-50%, -50%)',
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transformOrigin: 'center',
                    WebkitTransformOrigin: 'center',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafeSecureMobile;