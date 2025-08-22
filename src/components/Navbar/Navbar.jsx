// Navbar.jsx
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";



export const Navbar = ({ onNavigate }) => {

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
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          currentTheme = section.getAttribute("data-theme");
        }
      });
      setTheme(currentTheme);
    };

    window.addEventListener("scroll", handleScrollTheme);
    handleScrollTheme();
    return () => window.removeEventListener("scroll", handleScrollTheme);
  }, [theme]);

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
        {/* Left group - hidden on mobile, visible from md */}
        <div className="hidden md:flex gap-2 sm:gap-3 md:gap-4 items-center">
          <button
            onClick={() => {
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`nav-btn rounded-[200px] px-4 sm:px-5 md:px-6 h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-base ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            About BaFT
          </button>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="nav-btn rounded-[200px] px-4 sm:px-5 md:px-6 h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-base"
          >
            Let's Chat
          </button>
        </div>

        {/* Center logo - responsive sizes */}
        <div
          id="hero_container"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[38%] flex gap-1 items-center justify-center"
        >
          <img
            src={theme === "dark" ? "logo.png" : "logo1.png"}
            alt="Logo"
            className="w-10 sm:w-14 md:w-20 lg:w-24 xl:w-28 h-auto"
            loading="eager"
          />
        </div>

        {/* Right signup - hidden on mobile, visible from md */}
        <div className="fancy hidden md:inline-block">
          <button
            onClick={() => setIsSignUpModalOpen(true)}
            className="rounded-[200px] px-4 sm:px-5 md:px-6 h-10 sm:h-12 md:h-14 text-xs sm:text-sm md:text-base"
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
