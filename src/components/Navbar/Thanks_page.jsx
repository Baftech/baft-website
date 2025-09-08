import React from "react";
import "./Thanks_Page.css";
import { LOGO_PNG } from "../../assets/assets";

const ThanksPage = () => {
  return (
    <div className="thanks-page-container">
      <div className="thanks-card">
        {/* Close button
        <button
          className="close-btn"
          onClick={() => (window.location.href = "/")}
        >
          ✕
        </button> */}
        <div className="signup-header">
          <img src={LOGO_PNG} alt="BaFT Logo" className="signup-logo" />
          <p className="signup-tagline">Build for You, Powered by Tech</p>
        </div>

        {/* Animated Checkmark */}
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
            We’ve received your inquiry and will be in touch shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;
