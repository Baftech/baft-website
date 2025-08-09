// Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [theme, setTheme] = useState("dark"); // default

  // Detect theme based on section in view
  useEffect(() => {
    const handleScrollTheme = () => {
      const sections = document.querySelectorAll("[data-theme]");
      let currentTheme = theme;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentTheme = section.getAttribute("data-theme");
        }
      });
      setTheme(currentTheme);
    };

    window.addEventListener("scroll", handleScrollTheme);
    handleScrollTheme();
    return () => window.removeEventListener("scroll", handleScrollTheme);
  }, []);

  // Hide/show on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
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
        className={`navbar-container ${theme}-theme transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        {/* Left group */}
        <div className="hidden lg:flex gap-2 xl:gap-4">
          <button
            onClick={() => onNavigate && onNavigate("about")}
            className="nav-btn"
          >
            About BaFT
          </button>
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="nav-btn"
          >
            Let's Chat
          </button>
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-1 items-center">
          <img
            src={theme === "dark" ? "logo.png" : "logo1.png"}
            alt="Logo"
            className="w-16 sm:w-18 md:w-20"
          />
        </div>

        {/* Right signup */}
        <div className="fancy hidden lg:block">
          <button onClick={() => setIsSignUpModalOpen(true)}>Signup</button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden absolute top-3 right-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-all duration-300 ${theme === "dark" ? "text-white hover:bg-white/20" : "text-black hover:bg-black/20"}`}
          >
            {isMobileMenuOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 transform ${theme === "dark" ? "bg-black/90" : "bg-white/90"
          } backdrop-blur-sm z-50 flex flex-col justify-center items-center space-y-6 px-6 transition-transform duration-300 ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => {
            onNavigate && onNavigate("about");
            setIsMobileMenuOpen(false);
          }}
          className="mobile-link"
        >
          About BaFT
        </button>
        <button
          onClick={() => {
            setIsContactModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="mobile-link"
        >
          Let's Chat
        </button>
        <button
          onClick={() => {
            setIsSignUpModalOpen(true);
            setIsMobileMenuOpen(false);
          }}
          className="mobile-link"
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

export default Navbar;
