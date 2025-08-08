import React, { useState, useEffect } from "react";
import "./Dark_Navbar.css";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";
import { HiMenu, HiX } from "react-icons/hi";

const Dark_Navbar = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  // Scroll hide/show effect
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false); // hide on scroll down
      } else {
        setShowNavbar(true); // show on scroll up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div
        className={`navbar-container relative w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-black text-white z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Left Group */}
        <div className="hidden lg:flex gap-2 xl:gap-4">
          <button
            onClick={() => onNavigate && onNavigate("about")}
            className="px-3 xl:px-4 py-2 text-sm xl:text-base hover:bg-white hover:text-black rounded-full transition-all duration-300"
          >
            About BaFT
          </button>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="px-3 xl:px-4 py-2 text-sm xl:text-base hover:bg-white hover:text-black rounded-full transition-all duration-300"
          >
            Let's Chat
          </button>
        </div>

        {/* Center Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-1 items-center">
          <img src="logo.png" alt="Logo" className="w-16 sm:w-18 md:w-20" />
        </div>

        {/* Right Signup */}
        <div className="fancy hidden lg:block">
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="px-3 xl:px-4 py-2 text-sm xl:text-base hover:bg-white hover:text-black rounded-full transition-all duration-300"
          >
            Signup
          </button>
        </div>

        {/* Hamburger / Close Icon */}
        <div className="lg:hidden absolute top-3 right-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col justify-center items-center space-y-6 px-6 transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => {
            onNavigate && onNavigate("about");
            setIsMobileMenuOpen(false);
          }}
          className="text-white text-xl w-full text-center hover:underline"
        >
          About BaFT
        </button>
        <button
          onClick={() => {
            setIsContactModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="text-white text-xl w-full text-center hover:underline"
        >
          Let's Chat
        </button>
        <button
          onClick={() => {
            setIsSignUpModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="text-white text-xl w-full text-center hover:underline"
        >
          Sign Up
        </button>
      </div>

      {/* Modals */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
    </>
  );
};

export default Dark_Navbar;
