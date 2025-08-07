import React from "react";

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="lets-chat">
    <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50 p-4 sm:p-6 md:p-8">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-4 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold"
        >
          ×
        </button>

        {/* Logo */}
        <div className="text-center mb-4">
          <h2 className="text-white text-xl font-bold">BaFT</h2>
          <p className="text-blue-100 text-xs mt-1">
            Built for You, Powered by Tech
          </p>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          <div>
            <h3 className="text-white text-lg font-semibold mb-1">
              Contact Us
            </h3>
            <p className="text-blue-100 text-xs">
              Have any Query, feel free to reach out
            </p>
          </div>

          <form className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Id"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              />
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                rows="3"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactModal;
