import React from "react";
import "./SafeSecure.css";

const SafeSecure = () => {
  return (
      <div id="securitycard" data-theme = 'light'className="safe-secure-container" style={{
  width: 1200,
  height: 450,
  angle: "0deg",
  opacity: 1,
  
  borderRadius: 37.03
}}>
      <div className="safe-secure-content">
        {/* Left Text Section */}
        <div className="safe-secure-text">
          <h2 className="safe-secure-title">Safe & Secure</h2>
          <p className="safe-secure-description">
            At BAFT, we know trust isn't built in a day. That's why every payment,
            every detail, and every account is protected with care. No hidden
            risks. Just the security you deserve while managing your money.
          </p>
        </div>

        {/* Right Logo Section (SVG only) */}
        <div className="safe-secure-logo">
          <div className="security-logo-wrapper">
            <img
              src="/safe_sec.svg"
              alt="Security Badge"
              className="security-logo-svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSecure;
