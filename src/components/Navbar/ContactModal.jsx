import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThanksPage from "./Thanks_Page"; // ✅ Import your thanks page

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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
      <div className="relative bg-gradient-to-b from-[#0A0E65] via-[#3766B7E6] to-[#191919E6] rounded-2xl p-6 w-[95%] max-w-sm shadow-xl border border-white/10 backdrop-blur-lg z-10">
        <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-xl">✕</button>

        {showThanks ? (
          <ThanksPage onClose={handleThanksClose} />
        ) : (
          <>
            <div className="flex flex-col items-center mb-4">
              <img src="/logo.png" alt="BaFT Logo" className="h-10" />
              <p className="text-white/70 text-sm mt-2">Build for You, Powered by Tech</p>
            </div>

            <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/20">
              <h3 className="text-white text-lg font-semibold mb-1">Contact Us</h3>
              <p className="text-blue-100 text-xs mb-4">Have any Query feel free to reach out</p>

              <form className="space-y-3" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Id"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none text-sm"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-200 text-sm flex items-center justify-center gap-1"
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
