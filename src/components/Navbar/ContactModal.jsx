import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThanksPage from "./Thanks_Page"; // ✅ Import your thanks page
import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showThanks, setShowThanks] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  if (!isOpen) return null;

  const handleClose = () => onClose();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send formData to your backend if needed
    setShowThanks(true); // show thank you message
  };

  const handleThanksClose = () => {
    setShowThanks(false);
    setFormData({ name: "", email: "", message: "" }); // reset state
    onClose();
  };

  return (
    <div className="contact-modal-backdrop">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      <div className="contact-modal-container">
        <button onClick={handleClose} className="contact-close-button">✕</button>

        {showThanks ? (
          <ThanksPage onClose={handleThanksClose} />
        ) : (
          <>
            <div className="contact-header">
              <img src="/logo.png" alt="BaFT Logo" className="contact-logo" />
              <p className="contact-tagline">Build for You, Powered by Tech</p>
            </div>

            <div className="contact-form-container">
              <h3 className="contact-title">Contact Us</h3>
              <p className="contact-subtitle">Have any Query feel free to reach out</p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-input"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="contact-input"
                ></textarea>

                <button
                  type="submit"
                  className="contact-send-button"
                >
                  Send <span className="text-lg leading-none">•</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
