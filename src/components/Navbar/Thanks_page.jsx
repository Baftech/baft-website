import React, { useState, useEffect } from "react";
import "./Thanks_Page.css";

const ThanksPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  return (
    <div className={`thanks-page-container transition-all duration-800 ease-out ${
      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
    }`}>
      <div className="thanks-card">
        <div className="signup-header">
          <img src="/logo.png" alt="BaFT Logo" className="signup-logo" />
          <p className="signup-tagline">Built for You, Powered by Tech</p>
        </div>

        <div className="checkmark-wrapper">
          <svg
            className="checkmark-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path className="checkmark-path" fill="none" d="M14 27l7 7 17-17" />
          </svg>
        </div>

        <div className="thanks-text">
          <h2 className="thanks-title">Thanks for reaching out!</h2>
          <p className="thanks-message font-light text-white opacity-85">
            We've received your inquiry and will be in touch shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;