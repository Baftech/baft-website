import React, { useState, useEffect } from "react";
import "./SignUpModal.css";
import { LOGO_PNG } from "../../assets/assets";

const SignUpModal = ({ isOpen, onClose }) => {
  const [showThanks, setShowThanks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); // Track if form was ever submitted
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    autoFill: false,
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
      // If user has already submitted, show thanks page immediately
      if (hasSubmitted) {
        setShowThanks(true);
      }
    } else {
      setIsAnimating(false);
      setIsClosing(false);
      setShowThanks(hasSubmitted); // Keep thanks state based on submission status
      setIsTransitioning(false);
    }
  }, [isOpen, hasSubmitted]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsTransitioning(true);
    setHasSubmitted(true); // Mark that form has been submitted

    // Fade out form content
    setTimeout(() => {
      setShowThanks(true);
      setIsTransitioning(false);
    }, 200); // Half of transition duration (slower animation)
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      // Don't reset showThanks or hasSubmitted - keep the submission state
      setIsTransitioning(false);
      onClose();
    }, 800);
  };

  return (
    <div data-theme="dark" className="signup-modal-backdrop">
      <div
        className={`signup-modal-container transition-all duration-1200 ease-in-out ${
          isAnimating && !isClosing
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-90 translate-y-8"
        }`}
      >
        <button onClick={handleClose} className="signup-close-button">
          ✕
        </button>

        {/* Logo - Always visible */}
        <div className="signup-header">
          <img src={LOGO_PNG} alt="BaFT Logo" className="signup-logo" />
          <p className="signup-tagline">Built for You, Powered by Tech</p>
        </div>

        {/* Content Container - Fixed Height */}
        <div className="signup-content-container">
          {/* Form Content */}
          <div
            className={`absolute inset-0 w-full transition-all duration-1200 ease-in-out ${
              showThanks || isTransitioning
                ? "opacity-0 scale-95 pointer-events-none"
                : "opacity-100 scale-100"
            }`}
          >
            <div className="signup-form-container">
              <div className="signup-title-section">
                <h3 className="signup-title">Sign Up</h3>
                <p className="signup-subtitle">Don't miss the chance!</p>
              </div>

              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="signup-input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="signup-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="signup-input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Id"
                    className="signup-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="signup-input-group">
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Contact Number"
                    className="signup-input"
                    pattern="^\+91[0-9]{10}$"
                    maxLength="13"
                    onFocus={(e) => {
                      if (e.target.value === "") {
                        const newValue = "+91";
                        e.target.value = newValue;
                        setFormData((prev) => ({
                          ...prev,
                          contactNumber: newValue,
                        }));
                      }
                      setTimeout(() => e.target.setSelectionRange(3, 3), 0);
                    }}
                    onKeyDown={(e) => {
                      const cursorPos = e.target.selectionStart;
                      if (
                        (e.key === "Backspace" || e.key === "Delete") &&
                        cursorPos <= 3
                      ) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      let value = e.target.value;

                      // Remove any non-digit characters except +
                      value = value.replace(/[^0-9+]/g, "");

                      // Ensure it starts with +91
                      if (value.length < 3) {
                        value = "+91";
                      } else if (!value.startsWith("+91")) {
                        // Remove any existing +91 and add it at the beginning
                        value = "+91" + value.replace(/^\+91/, "").replace(/\+/g, "");
                      }

                      // Limit to 13 characters (+91 + 10 digits)
                      if (value.length > 13) {
                        value = value.slice(0, 13);
                      }

                      e.target.value = value;
                      
                      // Update form data
                      setFormData((prev) => ({
                        ...prev,
                        contactNumber: value,
                      }));
                    }}
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="signup-checkbox-container">
                  <input
                    type="checkbox"
                    id="autofill"
                    name="autoFill"
                    className="signup-checkbox"
                    checked={formData.autoFill}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="autofill" className="signup-checkbox-label">
                    Auto fill my details
                  </label>
                </div>

                <button type="submit" className="signup-send-button"></button>
              </form>
            </div>
          </div>

          {/* Thanks Content */}
          <div
            className={`absolute inset-0 w-full transition-all duration-1200 ease-in-out flex flex-col items-center justify-center ${
              showThanks && !isTransitioning
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {showThanks && !isClosing && (
              <>
                <div className="checkmark-wrapper">
                  <svg
                    className="checkmark-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                    key={`signup-checkmark-${showThanks}`} // Only re-render when showThanks becomes true
                  >
                    <circle
                      className="checkmark-circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark-path"
                      fill="none"
                      d="M14 27l7 7 17-17"
                    />
                  </svg>
                </div>
                <div className="thanks-text">
                  <h2 className="thanks-title">Thanks for signing up!</h2>
                  <p className="thanks-message font-light text-white opacity-85">
                    We've received your information and will be in touch
                    shortly.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;