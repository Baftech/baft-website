import React from 'react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import './SignUpModal.css';

const SignUpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="signup-modal-backdrop">
      <div className="signup-modal-container">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="signup-close-button"
        >
          ✕
        </button>
        
        {/* Logo */}
        <div className="signup-header">
          <img src="/logo.png" alt="BaFT Logo" className="signup-logo" />
          <p className="signup-tagline">Build for You, Powered by Tech</p>
        </div>
        
        {/* Sign Up Form Container */}
        <div className="signup-form-container">
          <div className="signup-title-section">
            <h3 className="signup-title">Sign Up</h3>
            <p className="signup-subtitle">Don't miss the chance!</p>
          </div>
          
          <form className="signup-form">
            <div className="signup-input-group">
              <input
                type="text"
                placeholder="Name"
                className="signup-input"
              />
            </div>
            
            <div className="signup-input-group">
              <input
                type="email"
                placeholder="Email Id"
                className="signup-input"
              />
            </div>
            
            <div className="signup-input-group">
              <input
                type="tel"
                placeholder="Contact Number"
                className="signup-input"
              />
            </div>
            
            {/* Auto-fill checkbox */}
            <div className="signup-checkbox-container">
              <input
                type="checkbox"
                id="autofill"
                className="signup-checkbox"
              />
              <label htmlFor="autofill" className="signup-checkbox-label">
                Auto fill my details
              </label>
            </div>
            
            <button
              type="submit"
              className="signup-send-button"
            >
              Send •
            </button>
          </form>
          
          {/* Divider */}
          <div className="signup-divider">
            <div className="signup-divider-line"></div>
            <span className="signup-divider-text">or continue with</span>
            <div className="signup-divider-line"></div>
          </div>
          
          {/* Social Login Buttons */}
          <div className="signup-social-buttons">
            <button className="signup-social-button">
              <FaGoogle className="signup-social-icon" />
              <span>Sign Up with Google Account</span>
              <span className="signup-arrow">→</span>
            </button>
            
            <button className="signup-social-button">
              <FaMicrosoft className="signup-social-icon" />
              <span>Sign Up with Outlook Account</span>
              <span className="signup-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;