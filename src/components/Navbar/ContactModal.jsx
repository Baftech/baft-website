import React, { useState, useEffect } from "react";
import ThanksPage from "./Thanks_Page";
import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose }) => {
  const [showThanks, setShowThanks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 800); // Match the duration-800
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowThanks(true);
  };

  const handleThanksClose = () => {
    setShowThanks(false);
    setFormData({ name: "", email: "", message: "" });
    handleClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      <div 
        className={`relative w-[90%] max-w-[450px] max-h-[95vh] rounded-3xl p-6 shadow-xl backdrop-blur-[30px] z-10 overflow-y-auto box-border flex flex-col items-center transition-all duration-800 ease-out ${
          isAnimating && !isClosing ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8'
        }`}
        style={{
          background: 'radial-gradient(112.62% 112.6% at 47.95% 3.5%, #090E65 0%, rgba(55, 102, 183, 0.96) 78.84%, rgba(25, 25, 25, 0.93) 100%)',
          border: '2px solid rgba(255, 255, 255, 0.46)'
        }}
      >
        <button 
  onClick={handleClose} 
  className="absolute top-6 right-4 bg-none border-none text-white text-[22px] cursor-pointer transition-opacity duration-200 hover:opacity-70 z-20 w-8 h-8 flex items-center justify-center"
>
  ✕
</button>

        {showThanks ? (
          <ThanksPage onClose={handleThanksClose} />
        ) : (
          <>
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <img src="/logo.png" alt="BaFT Logo" className="w-[120px] h-auto mx-auto" />
              <p className="mt-3 font-['Inter'] text-[15px] text-white/70">Built for You, Powered by Tech</p>
            </div>

            <div className="w-full bg-white/10 rounded-2xl p-5 flex flex-col gap-4 mb-5">
              <div>
                <h3 className="font-semibold text-xl text-white mb-1.5">Contact Us</h3>
                <p className="text-sm text-white/60 m-0 mb-2.5">Have any Query feel free to reach out</p>
              </div>

              <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="p-3 w-full bg-white/15 rounded-[10px] border-none text-white text-base outline-none placeholder-white/70"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  value={formData.email}
                  onChange={handleChange}
                  className="p-3 w-full bg-white/15 rounded-[10px] border-none text-white text-base outline-none placeholder-white/70"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="p-3 w-full bg-white/15 rounded-[10px] border-none text-white text-base outline-none placeholder-white/70 resize-none"
                ></textarea>

                <button
                  type="submit"
                  className="contact-send-button w-full h-11 bg-[#4A90E2] border-none rounded-[25px] text-white font-semibold text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-1"
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

export default ContactModal;