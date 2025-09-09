import React, { useEffect } from "react";
import "./SafeSecure.css";
import { SAFE_SEC_SVG } from "../../assets/assets";

const SafeSecureMobile = () => {

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
              At BAFT, we know trust isn't built in a day. That's why every
              payment, every detail, and every account is protected with care.
              No hidden risks. Just the security you deserve while managing your
              money.
            </p>

            {/* Logo - Safari optimized */}
            <div className="safe-secure-logo" style={{
              // Safari hardware acceleration
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}>
              <div className="security-logo-wrapper" style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: "scale(1.5)",
                WebkitTransform: "scale(1.5)",
                transformOrigin: "center center",
                WebkitTransformOrigin: "center center",
                // Safari hardware acceleration
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden'
              }}>
                <img
                  src={SAFE_SEC_SVG}
                  alt="Security Badge"
                  className="security-logo-svg"
                  style={{
                    width: "100%",       // base size
                    height: "auto",
                    position: "relative",
                    display: "block",
                    transform: "scale(1.10004)", // scale 5x
                    WebkitTransform: "scale(1.10004)",
                    transformOrigin: "center",
                    WebkitTransformOrigin: "center",
                    // Safari image rendering optimizations
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto'
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



