import React, { useState, useEffect } from 'react';
import './SignUpModal.css';
import Thanks_page from './Thanks_page';

const SignUpModal = ({ isOpen, onClose }) => {
  const [showThanks, setShowThanks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    autoFill: false
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowThanks(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 800);
  };

  const handleThanksClose = () => {
    setShowThanks(false);
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      autoFill: false
    });
    handleClose();
  };

  return (
    <div data-theme="dark" className="signup-modal-backdrop">
      <div className={`signup-modal-container transition-all duration-800 ease-out ${
        isAnimating && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
      }`}>
        <button
          onClick={handleClose}
          className="signup-close-button"
        >
          ✕
        </button>
        
        {showThanks ? (
          <Thanks_page onClose={handleThanksClose} />
        ) : (
          <>
            <div className="signup-header">
              <img src="/logo.png" alt="BaFT Logo" className="signup-logo" />
              <p className="signup-tagline">Built for You, Powered by Tech</p>
            </div>
            
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
                
                <button
                  type="submit"
                  className="signup-send-button"
                >
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpModal;