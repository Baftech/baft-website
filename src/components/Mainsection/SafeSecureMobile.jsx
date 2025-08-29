import React from "react";
import "./SafeSecure.css";

// Mobile-first rendering of the Safe & Secure section
// Uses the same class names/colors as the desktop version for visual parity
const SafeSecureMobile = () => {
  return (
    <div className="h-screen bg-white" data-theme="light">
      <section className="h-screen flex items-center justify-center px-4">
        <div className="w-full">
          <div className="safe-secure-container">
            <div className="safe-secure-content" style={{ flexDirection: "column", textAlign: "center" }}>
              <div className="safe-secure-text" style={{ maxWidth: 480, margin: "0 auto" }}>
                <h2 className="safe-secure-title">Safe & Secure</h2>
                <p className="safe-secure-description">
                  At BAFT, we know trust isn't built in a day. That's why every
                  payment, every detail, and every account is protected with care. No
                  hidden risks. Just the security you deserve while managing your
                  money.
                </p>
              </div>

              <div className="safe-secure-logo">
                <div className="security-logo-wrapper">
                  <img src="/safe_sec.svg" alt="Security Badge" className="security-logo-svg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafeSecureMobile;



