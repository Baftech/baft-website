import React, { useState, useEffect } from "react";
import "./Thanks.css" // Use the same CSS file

const Thanks = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setIsVisible(false);
    setTimeout(() => onClose(), 800); // Wait for animation to complete
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className={`thanks-page-container transition-all duration-800 ease-out ${
          isVisible && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="thanks-card">
          <button
            onClick={handleClose}
            className="cursor-pointer absolute top-4 right-4 text-white hover:text-gray-300 text-2xl z-10"
          >
            ✕
          </button>
          
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
            <h2 className="thanks-title">Thanks for subscribing!</h2>
            <p className="thanks-message font-light text-white opacity-85">
              You're all set! We'll keep you updated with our latest news and exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Thanks;