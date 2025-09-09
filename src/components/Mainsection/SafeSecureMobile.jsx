import React, { useEffect } from "react";
import "./SafeSecure.css";
import { SAFE_SEC_SVG } from "../../assets/assets";

const SafeSecureMobile = () => {
  const isSafari = typeof navigator !== 'undefined' && /safari/i.test(navigator.userAgent) && !/chrome|crios|fxios|android/i.test(navigator.userAgent);

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
                fontSize: "clamp(48px, 12vw, 85px)",
                color: "#FFFFFF",
                fontWeight: "700",
                fontFamily: "EB Garamond, serif",
                lineHeight: "100%",
                textAlign: "center",
                marginBottom: "2rem",
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
                fontSize: "clamp(14px, 4vw, 16px)",
                color: "#FFFFFF8C",
                fontWeight: "400",
                fontFamily: "Inter, sans-serif",
                lineHeight: "1.6",
                textAlign: "center",
                maxWidth: "35ch",
                marginBottom: "2rem",
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
                  width: isSafari ? '300.5002899169922px' : '100%',
                  height: isSafari ? '300.5002899169922px' : '100%',
                  aspectRatio: isSafari ? '1 / 1' : undefined,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: isSafari ? 0 : undefined,
                  flexGrow: isSafari ? 0 : undefined,
                  boxSizing: isSafari ? 'content-box' : undefined,
                  transform: isSafari ? 'none' : 'scale(1.5)',
                  WebkitTransform: isSafari ? 'none' : 'scale(1.5)',
                  transformOrigin: 'center center',
                  WebkitTransformOrigin: 'center center',
                  overflow: 'hidden',
                  borderRadius: isSafari ? '50%' : undefined,
                  margin: isSafari ? '0 auto' : undefined,
                  WebkitMaskImage: isSafari ? 'radial-gradient(circle, #000 99.9%, transparent 100%)' : undefined,
                  maskImage: isSafari ? 'radial-gradient(circle, #000 99.9%, transparent 100%)' : undefined,
                  opacity: isSafari ? 1 : undefined,
                }}
              >
                <img
                  src={SAFE_SEC_SVG}
                  alt="Security Badge"
                  className="security-logo-svg"
                  style={{
                    width: isSafari ? '100%' : '100%',
                    height: isSafari ? '110%' : 'auto',
                    position: 'relative',
                    display: 'block',
                    objectFit: isSafari ? 'cover' : 'contain',
                    transform: isSafari ? 'none' : 'scale(1.10004)',
                    WebkitTransform: isSafari ? 'none' : 'scale(1.10004)',
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



