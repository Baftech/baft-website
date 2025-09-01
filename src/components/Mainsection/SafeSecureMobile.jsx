import React, { useEffect } from "react";
import "./SafeSecure.css";
import { SAFE_SEC_SVG } from "../../assets/assets";

const SafeSecureMobile = () => {
  // Force dark theme for navbar
  useEffect(() => {
    // Set data-theme on document body to ensure navbar gets dark theme
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    
    return () => {
      // Cleanup when component unmounts
      document.documentElement.removeAttribute('data-theme');
      document.body.removeAttribute('data-theme');
    };
  }, []);

  return (
    <div className="h-screen bg-gray-900 relative" data-theme="dark">
      <section className="h-full flex items-center justify-center px-0">
        <div className="w-full h-full relative">
          {/* Main Content */}
          <div
            className="safe-secure-container flex flex-col items-center justify-center text-center"
            style={{
              width: "100%",
              height: "100%",
              background: "#000000",
              padding: "2rem 1rem",
              gap: "2rem"
            }}
          >
            {/* Title */}
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
                padding: "0 1rem"
              }}
            >
              Safe & Secure
            </h1>

            {/* Description */}
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
                marginBottom: "2rem"
              }}
            >
              At BAFT, we know trust isn't built in a day. That's why every
              payment, every detail, and every account is protected with care.
              No hidden risks. Just the security you deserve while managing your
              money.
            </p>

            {/* Logo */}
            <div className="safe-secure-logo">
              <div className="security-logo-wrapper flex justify-center">
                <img
                  src={SAFE_SEC_SVG}
                  alt="Security Badge"
                  className="security-logo-svg w-24 h-24"
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




