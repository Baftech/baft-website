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

  // Determine theme based on current slide and device type
  useEffect(() => {
    // Check if it's mobile device
    const isMobile = window.innerWidth <= 768;
    
    // Define which slides should have light theme (white backgrounds)
    const lightThemeSlides = [3, 4, 5, 7]; // B-Fast (3), Features (4), Video (5), Footer (7)
    
    if (currentSlide === 6) {
      // SafeSecure slide: light theme on desktop, dark theme on mobile
      setTheme(isMobile ? "dark" : "light");
    } else if (lightThemeSlides.includes(currentSlide)) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }, [currentSlide]);

  // Hide/show on scroll and when video is expanded
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
    
    // Check for navbar-hidden attribute from video expansion
    const checkNavbarHidden = () => {
      const isNavbarHidden = document.documentElement.hasAttribute('data-navbar-hidden');
      if (isNavbarHidden) {
        setShowNavbar(false);
      } else {
        // Only show navbar if not scrolling down
        if (window.scrollY <= lastScrollY || window.scrollY <= 50) {
          setShowNavbar(true);
        }
      }
    };
    
    // Initial check
    checkNavbarHidden();
    
    // Listen for scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Listen for attribute changes
    const observer = new MutationObserver(checkNavbarHidden);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-navbar-hidden'] });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Handle window resize for responsive theme switching
  useEffect(() => {
    const handleResize = () => {
      // Re-evaluate theme when window is resized
      const isMobile = window.innerWidth <= 768;
      const lightThemeSlides = [3, 4, 5, 7]; // B-Fast (3), Features (4), Video (5), Footer (7)
      
      if (currentSlide === 6) {
        // SafeSecure slide: light theme on desktop, dark theme on mobile
        setTheme(isMobile ? "dark" : "light");
      } else if (lightThemeSlides.includes(currentSlide)) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentSlide]);

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
            className={`rounded-[200px] nav-btn nav-btn-size ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            About BaFT
          </button>

          <button
            onClick={() => setIsContactModalOpen(true)}
            className="rounded-[200px] nav-btn nav-btn-size"
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
            className="w-16 h-auto sm:w-18 md:w-20 lg:w-22 xl:w-24 cursor-pointer"
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
            className={`rounded-[200px] nav-btn-size ${
              theme === 'dark'
                ? 'bg-black text-white hover:bg-neutral-900'
                : 'bg-white text-black hover:bg-gray-100'
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