import React from "react";
import "./ThanksPage.css";
import logo from "../assets/logo.png"; // adjust path to your logo

const ThanksPage = () => {
  return (
    <div className="thanks-page-container">
      <div className="thanks-card">
        {/* Close button if you want to navigate back */}
        <button className="close-btn" onClick={() => window.location.href = "/"}>
          ✕
        </button>

        <img src={logo} alt="Logo" className="thanks-logo" />
        <p className="signup-tagline">Build for You, Powered by Tech</p>

        <div className="checkmark">✔</div>

        <h2 className="thanks-title">Thanks for reaching out!</h2>
        <p className="thanks-message">
          We’ve received your inquiry and will be in touch shortly.
        </p>
      </div>
    </div>
  );
};

export default ThanksPage;
