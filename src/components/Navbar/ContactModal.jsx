import React from "react";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-[#0A0E65] via-[#3766B7E6] to-[#191919E6] rounded-2xl p-6 w-[95%] max-w-sm shadow-xl border border-white/10 backdrop-blur-lg z-10">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Logo & Tagline */}
        <div className="flex flex-col items-center mb-4">
          <img src="/logo.png" alt="BaFT Logo" className="h-10" />
          <p className="text-white/70 text-sm mt-2">
            Build for You, Powered by Tech
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/20">
          <h3 className="text-white text-lg font-semibold mb-1">Contact Us</h3>
          <p className="text-blue-100 text-xs mb-4">
            Have any Query feel free to reach out
          </p>

          <form className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
            <input
              type="email"
              placeholder="Email Id"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
            <textarea
              placeholder="Your Message"
              rows="3"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none text-sm"
            ></textarea>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-full shadow-lg transition duration-200 text-sm flex items-center justify-center gap-1"
            >
              Send <span className="text-lg leading-none">•</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
