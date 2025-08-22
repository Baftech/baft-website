import React from "react";
import "./SafeSecure.css";

const SafeSecure = () => {
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
                  At BAFT, we know trust isn't built in a day. That's why every
                  payment, every detail, and every account is protected with care. No
                  hidden risks. Just the security you deserve while managing your
                  money.
                </p>
              </div>

              {/* Right Logo Section */}
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
        </div>
      </section>
    </div>
  );
};

export default SafeSecure;
