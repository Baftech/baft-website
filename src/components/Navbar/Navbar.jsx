// Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";
import { HiMenu, HiX } from "react-icons/hi";

export const Navbar = ({ onNavigate, currentSlide }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [theme, setTheme] = useState("dark"); // default

  // Determine theme based on current slide
  useEffect(() => {
    // Define which slides should have light theme (white backgrounds)
    const lightThemeSlides = [3, 4, 5, 6, 7]; // B-Fast (3), Features (4), Video (5), SafeSecure (6), Footer (7)
    
    if (lightThemeSlides.includes(currentSlide)) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [currentSlide]);

  // Hide/show on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      // Don't hide navbar on mobile when menu is open
      if (isMobileMenuOpen) return;

      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Navbar */}
      <div
        className={`navbar-container ${theme}-theme transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Left group */}
        <div className="hidden lg:flex gap-2 xl:gap-4">
          <button
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }}
            className={`w-[124px] h-16 rounded-[200px] nav-btn ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            About BaFT
          </button>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-[124px] h-16 rounded-[200px] nav-btn"
          >
            Let's Chat
          </button>
        </div>

        {/* Center logo */}
        <div
          id="hero_container"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[38%] flex gap-1 items-center justify-center"
        >
          <img
            src={theme === "dark" ? "logo.png" : "logo1.png"}
            alt="Logo"
            className="w-16 xs:w-18 sm:w-20 md:w-24 lg:w-28 xl:w-30 h-auto"
            loading="eager"
          />
        </div>

        {/* Right signup */}
        <div className="fancy hidden lg:block">
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="w-[124px] h-16 rounded-[200px]"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden absolute top-3 right-4 z-[110]">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-all duration-300 ${
              theme === "dark" ? "text-white" : "text-black hover:bg-black/20"
            }`}
          >
            {isMobileMenuOpen ? (
              <HiX
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
            ) : (
              <HiMenu
                className={`w-6 h-6 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 ${
          theme === "dark" ? "bg-black/95" : "bg-white/95"
        } backdrop-blur-lg z-[105] flex flex-col justify-center items-center space-y-4 sm:space-y-6 px-4 sm:px-6 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } lg:hidden overflow-hidden`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col space-y-4 sm:space-y-6 w-full max-w-sm"
        >
          <button
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
              setIsMobileMenuOpen(false);
            }}
            className={`mobile-link ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            About BaFT
          </button>

          <button
            onClick={() => {
              onNavigate && onNavigate("contact");
              setIsContactModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className={`mobile-link ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Let's Chat
          </button>
          <button
            onClick={() => {
              onNavigate && onNavigate("signup");
              setIsSignUpModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className={`mobile-link ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Sign Up
          </button>
        </div>
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
