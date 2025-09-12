import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Thanks from "./Thanks";
import { supabase } from "../../supabasedb/supabaseClient";
import "./CombinedFooter.css";

const SignupFormMobile = ({ onOpenThanks, isKeyboardOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isEmailValid = isValidEmail(email.trim().toLowerCase());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    const cleaned = email.trim().toLowerCase();
    if (!isValidEmail(cleaned)) {
      setErrMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([{ email: cleaned }]);

      if (error) {
        console.error("Supabase insert error:", error);
        setErrMsg("Something went wrong. Please try again.");
        return;
      }

      setEmail("");
      onOpenThanks();
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
         <section
       className="relative text-white mx-auto overflow-hidden px-2 sm:px-3 md:px-4 lg:px-6 flex"
       style={{
         width: 'clamp(280px, 95vw, 500px)',
         height: isKeyboardOpen ? 'clamp(160px, 40vh, 200px)' : 'clamp(180px, 45vh, 240px)',
         minHeight: isKeyboardOpen ? 'clamp(160px, 40vh, 200px)' : 'clamp(180px, 45vh, 240px)',
         maxHeight: isKeyboardOpen ? 'clamp(160px, 40vh, 200px)' : 'clamp(180px, 45vh, 240px)',
         borderRadius: "clamp(15px, 4vw, 20px)",
         background: "linear-gradient(92.61deg, #092646 3.49%, #3766B7 98.57%)",
         opacity: 1,
         top: isKeyboardOpen ? 'clamp(4px, 1vh, 8px)' : 'clamp(8px, 2vh, 16px)',
         margin: '0 auto',
         border: '1px solid rgba(255, 255, 255, 0.1)',
         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
         // Prevent content from spilling when keyboard opens
         flexShrink: 0,
         flexGrow: 0,
         // Lock the container size when keyboard is open
         position: 'relative',
         zIndex: 10,
         // Prevent viewport changes from affecting the container
         transform: 'translateZ(0)',
         backfaceVisibility: 'hidden'
       }}
     >
       <div className="py-1.5 sm:py-2 md:py-3 lg:py-4 relative z-20 px-1.5 sm:px-2 md:px-3 lg:px-4 w-3/4 h-full overflow-auto" style={{ paddingBottom: 'clamp(8px, 2vh, 16px)' }}>
        <div className="flex flex-col items-start text-left gap-1 sm:gap-1.5 md:gap-2 lg:gap-3 h-full justify-between">
          <h2
            className="mb-1 sm:mb-1.5 lg:mb-2"
            style={{
              width: 'clamp(70px, 20vw, 100px)',
              height: 'clamp(26px, 7vw, 36px)',
              fontFamily: "EB Garamond",
              fontWeight: 700,
              fontStyle: "Bold",
              fontSize: "clamp(22px, 6vw, 32px)",
              lineHeight: "100%",
              letterSpacing: "-1%",
              color: "#FFFFFF",
              opacity: 1,
              transform: "rotate(0deg)",
              margin: "0",
              whiteSpace: "nowrap"
            }}
          >
            Sign Up
          </h2>
          <p
            className="mb-1 sm:mb-1.5 lg:mb-2"
            style={{
              width: '100%',
              maxWidth: 'clamp(200px, 55vw, 300px)',
              fontFamily: "Inter",
              fontWeight: 400,
              fontStyle: "Regular",
              fontSize: "clamp(11px, 2.8vw, 14px)",
              lineHeight: "130%",
              letterSpacing: "-1%",
              color: "#FFFFFFC4",
              opacity: 1,
              transform: "rotate(0deg)",
              margin: "0",
              wordWrap: "break-word",
              overflowWrap: "break-word"
            }}
          >
            Get early access, updates, and exclusive perks. Enter your email below – no spam, we promise.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start gap-1.5 sm:gap-2 lg:gap-3 w-full mt-1 sm:mt-1.5 lg:mt-2"
          >
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 'clamp(2px, 0.8vw, 3px) clamp(15px, 4vw, 20px)',
                gap: 'clamp(4px, 1.2vw, 6px)',
                width: '100%',
                maxWidth: 'clamp(200px, 55vw, 350px)',
                height: 'clamp(28px, 7vw, 38px)',
                background: 'rgba(247, 247, 247, 0.18)',
                backdropFilter: 'blur(7.4622px)',
                borderRadius: 'clamp(10px, 3vw, 15px)',
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: '#FFFFFF'
              }}
            />
            <span
              className="text-red-500 text-xs"
              style={{ minHeight: '16px', lineHeight: '16px', visibility: errMsg ? 'visible' : 'hidden' }}
            >
              {errMsg || 'placeholder'}
            </span>
            <button
              type="submit"
              disabled={loading || !isEmailValid}
              className={`font-medium transition ${
                isEmailValid 
                  ? 'cursor-pointer hover:bg-gray-100' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                width: 'clamp(80px, 20vw, 120px)',
                height: 'clamp(24px, 6vw, 30px)',
                minHeight: 'clamp(24px, 6vw, 30px)',
                maxHeight: 'clamp(24px, 6vw, 30px)',
                justifyContent: 'center',
                opacity: isEmailValid ? 1 : 0.5,
                top: '15px',
                borderRadius: '9999px',
                borderWidth: '0.28px',
                borderStyle: 'solid',
                padding: '0',
                margin: '0',
                marginBottom: 'clamp(8px, 2vh, 16px)',
                lineHeight: '1',
                color: isEmailValid ? '#000000' : '#666666',
                backgroundColor: isEmailValid ? '#FFFFFF' : '#E5E5E5',
                border: '0.28px solid',
                borderImageSource: 'linear-gradient(121.31deg, rgba(49, 49, 49, 0.048) -10.95%, rgba(49, 49, 49, 0) 146.16%), linear-gradient(297.75deg, rgba(255, 255, 255, 0.048) 22.05%, rgba(0, 0, 0, 0) 120.83%, rgba(255, 255, 255, 0) 120.83%)',
                display: 'flex',
                alignItems: 'center',
                fontSize: 'clamp(10px, 2.5vw, 14px)',
                boxSizing: 'border-box'
              }}
            >
              {loading ? 'Submitting…' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Phone image */}
      <div 
        className="absolute z-10"
        style={{
          width: isKeyboardOpen ? 'clamp(120px, 25vw, 160px)' : 'clamp(140px, 30vw, 200px)',
          height: 'auto',
          right: 'clamp(2px, 1vw, 8px)',
          bottom: isKeyboardOpen ? 'clamp(-4px, -1vh, -1px)' : 'clamp(-8px, -2vh, -2px)',
          // Hide phone image when keyboard is open to save space
          opacity: isKeyboardOpen ? 0.3 : 1,
          transition: 'opacity 0.3s ease, width 0.3s ease, bottom 0.3s ease'
        }}
      >
        <img
          src="/hand_iphone_image.svg"
          alt="Signup Illustration"
          className="w-full h-full object-contain"
        />
      </div>
    </section>
  );
};

const socialLinks = [
  {
    id: 1,
    icon: <FontAwesomeIcon icon={faInstagram} />,
    url: "https://www.instagram.com/baft_tech?igsh=dTFueG81Z3pmbzk0&utm_source=qr",
  },
  {
    id: 3,
    icon: <FontAwesomeIcon icon={faLinkedin} />,
    url: "https://www.linkedin.com/company/baft-technology/",
  },
  {
    id: 4,
    icon: <FontAwesomeIcon icon={faFacebook} />,
    url: "https://www.facebook.com/share/1Aj45FuP4i/?mibextid=wwXIfr",
  },
];

const CombinedFooterMobile = () => {
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const footerRef = useRef(null);
  const signupRef = useRef(null);

  // Handle mobile keyboard behavior
  useEffect(() => {
    const handleResize = () => {
      const initialHeight = window.innerHeight;
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // If height difference is significant (keyboard likely open), set keyboard state
      setIsKeyboardOpen(heightDifference > 150);
    };

    const handleVisualViewportChange = () => {
      if (window.visualViewport) {
        const heightDifference = window.innerHeight - window.visualViewport.height;
        setIsKeyboardOpen(heightDifference > 150);
      }
    };

    // Set initial viewport meta tag to prevent zooming
    const setViewportMeta = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    };

    setViewportMeta();

    // Listen for viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleVisualViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Enable upward scroll/swipe handoff to About section with SlideContainer crossfade
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    let touchStartY = null;
    const threshold = 24; // px from top to consider at top
    const minSwipe = 40; // px swipe distance
    const opts = { passive: false };

    const atTop = () => {
      try {
        return el.scrollTop <= threshold;
      } catch {
        return true;
      }
    };

    const navigateToAbout = () => {
      try {
        const evt = new CustomEvent('navigateToSlide', { detail: { index: 6, slow: true } });
        window.dispatchEvent(evt);
      } catch {}
    };

    const onWheel = (e) => {
      if (e && e.cancelable) e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0 && atTop()) {
        navigateToAbout();
      }
    };

    const onTouchStart = (e) => {
      const t = e.touches && e.touches[0];
      touchStartY = t ? t.clientY : null;
    };

    const onTouchEnd = (e) => {
      if (touchStartY == null) return;
      const t = e.changedTouches && e.changedTouches[0];
      const dy = touchStartY - (t ? t.clientY : touchStartY);
      if (dy < -minSwipe && atTop()) {
        if (e && e.cancelable) e.preventDefault();
        e.stopPropagation();
        navigateToAbout();
      }
      touchStartY = null;
    };

    el.addEventListener('wheel', onWheel, opts);
    el.addEventListener('touchstart', onTouchStart, opts);
    el.addEventListener('touchend', onTouchEnd, opts);

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <footer ref={footerRef} id="footer" data-theme="dark" className="combined-footer smooth-scroll">
      {/* Mobile-optimized pre-footer section */}
      <div 
        className="pre-footer-container relative bg-black w-screen min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden py-8 sm:py-12 lg:py-16 xl:py-20" 
        style={{ 
          minHeight: isKeyboardOpen ? '50vh' : '100dvh', 
          height: isKeyboardOpen ? '50vh' : '100dvh',
          maxHeight: isKeyboardOpen ? '50vh' : '100dvh',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
          // Prevent layout shifts when keyboard opens
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Radial gradient background */}
          <div 
          aria-hidden
            style={{
              position: 'absolute',
            width: 'clamp(300px, 80vw, 600px)',
            height: 'clamp(300px, 80vw, 600px)',
            left: '0px',
            top: '0px',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(closest-side at 0 0, rgba(255,255,255,0.3), rgba(255,255,255,0))',
            backgroundRepeat: 'no-repeat',
            mixBlendMode: 'screen',
            filter: 'none',
            transform: 'translateZ(0)'
          }}
        />

        {/* Concentric circles - centered */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 'clamp(360px, 80vmin, 720px)',
            aspectRatio: '1 / 1',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 0,
            // Vertical fade mask to match the image
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.3) 80%, rgba(0,0,0,0) 100%)',
            // Soft blending for ethereal effect
            mixBlendMode: 'screen',
            filter: 'blur(0.8px) drop-shadow(0 0 25px rgba(255,255,255,0.35))',
          }}
        >
          {[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((ratio, i) => {
            const t = (ratio - 0.3) / (1.0 - 0.3); // 0..1 across rings
            const alpha = 0.12 + 0.18 * (1 - Math.abs(0.5 - t) * 2); // lighter
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${(1 - ratio) * 50}%`,
                  top: `${(1 - ratio) * 50}%`,
                  width: `${ratio * 100}%`,
                  height: `${ratio * 100}%`,
                  borderRadius: '50%',
                  border: `1px solid rgba(255,255,255,${alpha.toFixed(3)})`,
                  boxSizing: 'border-box',
                  // Soft inner glow for ethereal effect
                  boxShadow: `inset 0 0 15px rgba(255,255,255,${(alpha * 0.7).toFixed(3)})`,
                }}
              />
            );
          })}
        </div>
        
        {/* Star Groups */}
        <div className="star-groups" style={{ position: 'relative', zIndex: 1 }}>
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Group 1 - Central stars (spread across screen) */}
            <g className="star-group-1">
              <circle cx="200" cy="200" r="2" fill="rgba(255,255,255,0.5)"/>
              <circle cx="150" cy="150" r="1.5" fill="rgba(255,255,255,0.4)"/>
              <circle cx="250" cy="150" r="1.5" fill="rgba(255,255,255,0.4)"/>
              <circle cx="150" cy="250" r="1.5" fill="rgba(255,255,255,0.4)"/>
              <circle cx="250" cy="250" r="1.5" fill="rgba(255,255,255,0.4)"/>
              <circle cx="200" cy="100" r="1" fill="rgba(255,255,255,0.35)"/>
              <circle cx="200" cy="300" r="1" fill="rgba(255,255,255,0.35)"/>
              <circle cx="100" cy="200" r="1" fill="rgba(255,255,255,0.35)"/>
              <circle cx="300" cy="200" r="1" fill="rgba(255,255,255,0.35)"/>
            </g>
            
            {/* Group 2 - Revolving stars around the entire screen */}
            <g className="star-group-2">
              <circle cx="50" cy="50" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="350" cy="50" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="50" cy="350" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="350" cy="350" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="50" cy="150" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="350" cy="150" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="50" cy="250" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="350" cy="250" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="100" cy="100" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="300" cy="100" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="100" cy="300" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="300" cy="300" r="1" fill="rgba(255,255,255,0.4)"/>
            </g>
          </svg>
        </div>

                {/* Text content */}
        <div className="text-container relative z-10 text-center px-4 sm:px-6 lg:px-8">
          
          
          <h1 
             className="main-heading mb-3 sm:mb-4 lg:mb-6 font-bold text-center"
             style={{
               width: 'min(284px, 90vw)',
               height: 'auto',
               minHeight: '32px',
               fontFamily: 'Satoshi',
               fontWeight: 700,
               fontSize: 'clamp(24px, 6vw, 40px)',
               lineHeight: '100%',
               letterSpacing: '0%',
               background: 'linear-gradient(101.23deg, #EDEDED 24.07%, #B6B6B6 96.8%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text',
               maxWidth: '100%',
               margin: '0 auto'
             }}
           >
            Banking was never easy…
          </h1>
          <p 
            className="sub-heading font-medium text-center"
             style={{
               width: '100%',
               maxWidth: '400px',
               height: 'auto',
               minHeight: '19px',
               fontFamily: 'Satoshi',
               fontWeight: 500,
               fontSize: 'clamp(16px, 4vw, 22px)',
               lineHeight: '100%',
               letterSpacing: '0%',
               color: '#9898A8',
               margin: '0 auto',
               whiteSpace: 'nowrap'
             }}
           >
            BaFT – Built for You, Powered by Tech
          </p>
        </div>
      </div>

      {/* Mobile-optimized main footer section */}
      <div 
        className="main-footer bg-gray-100 py-6 px-4 pb-10 sm:pb-12 shadow-lg border-t border-gray-200 overflow-x-hidden" 
        style={{ 
          // Adjust padding when keyboard is open
          paddingTop: isKeyboardOpen ? 'clamp(12px, 3vh, 24px)' : 'clamp(24px, 6vh, 48px)',
          paddingBottom: isKeyboardOpen ? 'clamp(12px, 3vh, 24px)' : 'calc(env(safe-area-inset-bottom, 0px) + 48px)'
        }}
      >
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <SignupFormMobile 
              onOpenThanks={() => setIsThanksOpen(true)} 
              isKeyboardOpen={isKeyboardOpen}
            />
          </div>
          
          {/* Spacing between signup and contact info */}
          <div className="mb-10"></div>
          
          <div className="flex flex-col items-center gap-6">
           

            {/* Contact and Social Links - Side by Side */}
            <div className="flex flex-row justify-between items-start gap-8 w-full max-w-md">
              {/* Contact Info - Left Side */}
              <div className="flex flex-col items-start gap-2 text-left flex-1 pl-4 sm:pl-6">
              <p
                className="font-semibold text-[13px] text-[#000000]"
                style={{ fontFamily: "EB Garamond" }}
              >
                CONTACT US
              </p>
              <a
                href="tel:+916361042098"
                className="font-medium text-[13px] text-[#000000] hover:underline"
                style={{ fontFamily: "Inter" }}
              >
                +91 6361042098
              </a>
              <a
                href="mailto:business@thebaft.com"
                className="font-medium text-[13px] text-[#000000] hover:underline"
                style={{ fontFamily: "Inter" }}
              >
                business@thebaft.com
              </a>
              <a
                href="mailto:support@thebaft.com"
                className="font-medium text-[13px] text-[#000000] hover:underline"
                style={{ fontFamily: "Inter" }}
              >
                support@thebaft.com
              </a>
              </div>

              {/* Social Links - Right Side */}
              <div className="flex flex-col items-center justify-center gap-3 flex-1 text-center h-full">
                <p
                  className="font-medium text-[12px] leading-[1.5] tracking-[0.04em] uppercase text-[#092646]"
                  style={{ fontFamily: "Inter" }}
                >
                  FOLLOW US
                </p>
                <div className="flex items-center justify-center gap-3 w-full">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Social link ${link.id}`}
                      className="border border-gray-300 rounded-full p-2.5 text-[#092646] hover:bg-[#092646] hover:text-white transition duration-300 text-lg"
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Logo and Company Info - Added to Upper Container */}
            <div className="flex flex-col items-center gap-2 text-center mt-[-6] pt-0 border-none border-gray-300">
              <img
                src="/baft_pic.png"
                alt="BaFT Logo"
                className="p-2 w-[70px] h-[70px] rounded-[20px] object-cover"
              />
              <h6
                className="font-bold text-[16px] leading-[1.2] tracking-[-0.01em] text-[#092646]"
                style={{ fontFamily: "EB Garamond" }}
              >
                BaFT Technology Pvt.Ltd
              </h6>
              <p
                className="font-normal text-[13px] leading-[1.3] tracking-[-0.01em] text-[#3E3E3E] px-4"
                style={{ fontFamily: "Inter" }}
              >
                3rd Floor, No. 38, Greenleaf Extension, 3rd Cross, 80 Feet Rd, 4th
                Block, Koramangala, Bengaluru, Karnataka 560034
              </p>
              
              {/* Copyright within Upper Container */}
              <div className="mt-4 pt-3 border-t border-gray-300">
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    fontSize: '8px',
                    lineHeight: '150%',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    color: '#36382E'
                  }}
                >
                  © 2025 — Copyright BaFT
                </p>
              </div>
            </div>
          </div>
          
          {/* Final bottom spacer to prevent clipping on small screens / with keyboard */}
          <div className="w-full" style={{ height: 'clamp(24px, 6vh, 72px)' }}></div>
        </div>
      </div>
      
     
      
      {isThanksOpen && (
        <Thanks isOpen={true} onClose={() => setIsThanksOpen(false)} />
      )}
    </footer>
  );
};

export default CombinedFooterMobile;