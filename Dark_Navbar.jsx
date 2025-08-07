import React from "react";
import "./Dark_Navbar.css";
import { useState } from "react";
import ContactModal from "./ContactModal";
import SignUpModal from "./SignUpModal";

const Dark_Navbar = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  return (
    <>
    <div className="navbar-container">
      {/* Left Group: About + Let's Chat */}
      <div className="flex gap-4">
        <button className="px-4 py-2 border border-transparent transition-all duration-300 hover:bg-white hover:text-black hover:rounded-full inter-aandl">
          About BaFT
        </button>
        <button className="px-4 py-2 border border-transparent transition-all duration-300 hover:bg-white hover:text-black hover:rounded-full inter-aandl">
          Let's Chat
        </button>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 transform-translate-x-1/2 flex gap-1 items-center">
        <img src="logo.png" alt="Logo" className="w-20" />
      </div>

      {/* Right: Sign Up */}
      <div>
        <div className="fancy px-4 py-2 border border-transparent transition-all duration-300 hover:bg-white hover:text-black hover:rounded-full inter-signup">
          <button>Signup</button>
        </div>
      </div>
       <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            <img
              src={isMobileMenuOpen ? "/cross_icon.svg" : "/menu_icon.svg"}
              alt={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="w-6 h-6"
            />
          </button>
    </div>
    {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => {
                  onNavigate && onNavigate('about');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                About BaFT
              </button>
              
              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                Let's Chat
              </button>
              
              <button
                onClick={() => {
                  setIsSignUpModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-white hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
        
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