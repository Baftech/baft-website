// Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";

export const Navbar = ({ onNavigate, currentSlide }) => {
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
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <div
        className={`navbar-container ${theme}-theme transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Left group - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex gap-6 xl:gap-8">
          <button
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('about', { slow: true });
              } else {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className={`w-20 h-8 lg:w-24 lg:h-10 xl:w-28 xl:h-12 rounded-[200px] nav-btn ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            About BaFT
          </button>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="w-16 h-8 lg:w-20 lg:h-10 xl:w-24 xl:h-12 rounded-[200px] nav-btn"
          >
            Let's Chat
          </button>
        </div>

        {/* Center logo - Always visible, responsive sizing */}
        <div
          id="hero_container"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[38%] flex gap-1 items-center justify-center"
        >
          <img
            src={theme === "dark" ? "logo.png" : "logo1.png"}
            alt="Logo"
            className="w-12 h-auto sm:w-14 md:w-16 lg:w-18 xl:w-20 cursor-pointer"
            onClick={() => {
              if (typeof onNavigate === 'function') {
                onNavigate('hero');
              } else {
                document
                  .getElementById("hero")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            loading="eager"
          />
        </div>

        {/* Right signup - Hidden on mobile, visible on lg+ */}
        <div className="fancy hidden lg:block">
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="w-16 h-8 lg:w-20 lg:h-10 xl:w-24 xl:h-12 rounded-[200px]"
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
