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

  // Recompute theme on slide change
  useEffect(() => {
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
        {theme !== "light" && theme !== "features" && (
          <div className="hidden lg:flex gap-2 xl:gap-4">
            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              className={`nav-btn ${
                theme === "dark" ? "text-white" : "text-[#092646]"
              }`}
            >
              About BaFT
            </button>

            <button
              onClick={() => setIsContactModalOpen(true)}
              className={`nav-btn ${
                theme === "dark" ? "text-white" : "text-[#092646]"
              }`}
            >
              Let's Chat
            </button>
          </div>
        )}

        {/* Center logo */}
        <div
          id="hero_container"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1 items-center"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className={`w-12 xs:w-14 sm:w-16 md:w-18 lg:w-20 h-auto ${theme === 'dark' ? 'logo-white-filter' : 'logo-blue-filter'}`}
            loading="eager"
          />
        </div>

        {/* Right signup (hidden in light section) */}
        {theme !== "light" && (
          <div className="fancy hidden lg:block">
            <button onClick={() => setIsSignUpModalOpen(true)}>Signup</button>
          </div>
        )}

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
          {theme !== "light" && theme !== "features" && (
            <button
              onClick={() => {
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              className={`mobile-link ${
                theme === "dark" ? "text-white" : "text-[#092646]"
              }`}
            >
              About BaFT
            </button>
          )}

          <button
            onClick={() => {
              onNavigate && onNavigate("contact");
              setIsContactModalOpen(true);
              setIsMobileMenuOpen(false);
            }}
            className={`mobile-link ${
              theme === "dark" ? "text-white" : "text-[#092646]"
            }`}
          >
            Let's Chat
          </button>
          {theme !== "light" && theme !== "features" && (
            <button
              onClick={() => {
                onNavigate && onNavigate("signup");
                setIsSignUpModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className={`mobile-link ${
                theme === "dark" ? "text-white" : "text-[#092646]"
              }`}
            >
              Sign Up
            </button>
          )}
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
