import React from "react";

import "./Thanks_page.css";

const Thanks_page = ({ onClose }) => {
  return (
    <div data-theme="dark" className="thank-you-message">
      <div className="thanks-content">
        
        <div className="thanks-text-content">
          <h2 className="thanks-title">
            Thanks for reaching out!
          </h2>
          <p className="thanks-message">
            We've received your inquiry and will be in touch shortly.
          </p>
        </div>
        <button
          onClick={onClose}
          className="thanks-close-button"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Thanks_page;
