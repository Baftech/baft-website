import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabasedb/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Thanks from "./Thanks";
import CombinedFooterMobile from "./CombinedFooterMobile";
import "./CombinedFooter.css";
import { HAND_IPHONE_IMAGE_SVG, BAFT_PIC_PNG } from "../../assets/assets";

const SignupForm = ({ onOpenThanks }) => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedEmail = email.trim().toLowerCase();
    setErrMsg("");
    if (!isValidEmail(cleanedEmail)) {
      setErrMsg("Please enter a valid email address.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("signups")
        .insert([{ email: cleanedEmail }]);

      if (error) {
        console.error("Footer signup insert error:", error);
        setErrMsg("Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      onOpenThanks();
      setEmail("");
    } catch (err) {
      console.error("Unexpected footer signup error:", err);
      setErrMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative text-white mx-auto w-full max-w-screen-xl overflow-visible px-4 sm:px-6 lg:px-8"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(92.61deg, #092646 3.49%, #3766B7 98.57%)",
        width:"95%"
      }}
    >
      {/* Modal is rendered by parent to avoid stacking context issues */}
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-8 py-8 md:py-10 lg:py-14 relative z-10">
        {/* Left Content */}
        <div className="flex flex-col justify-center text-center md:text-left order-2 md:order-1">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3"
            style={{
              fontFamily: "EB Garamond",
              fontWeight: 700,
              letterSpacing: "-1%",
              lineHeight: "120%",
            }}
          >
            Sign Up
          </h2>
          <p
            className="text-sm sm:text-base text-gray-200 mb-6"
            style={{
              fontFamily: "Inter",
              fontWeight: 200,
              letterSpacing: "-1%",
              lineHeight: "150%",
            }}
          >
            Get early access, updates, and exclusive perks. Enter your email
            below – no spam, we promise.
          </p>

          {/* Input + Button */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errMsg && isValidEmail(e.target.value)) setErrMsg("");
              }}
              className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ borderRadius: "17.15px" }}
            />
            {errMsg && (
              <span className="text-red-500 text-sm w-full sm:w-auto">{errMsg}</span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-full font-medium transition bg-white text-black hover:bg-gray-100"
              style={{ minWidth: "110px" }}
            >
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "13px",
                  lineHeight: "16px",
                }}
              >
                {isSubmitting ? "Submitting..." : "Subscribe"}
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Image positioned at bottom right of the component */}
      <div className="absolute right-4 md:right-8 -bottom-0 md:-bottom-3 lg:-bottom-5.5 z-20">
        <img
          src={HAND_IPHONE_IMAGE_SVG}
          alt="Signup Illustration"
          className="w-[200px] sm:w-[245px] md:w-[300px] lg:w-[350px] object-contain"
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

const CombinedFooter = () => {
  const [isThanksOpen, setIsThanksOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection logic
  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileDevice = window.innerWidth <= 768 || 
                           (window.innerWidth <= 1024 && isPortrait) ||
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobileDevice && isPortrait);
    };

    // Check on mount
    checkDeviceAndOrientation();

    // Check on resize and orientation change
    window.addEventListener('resize', checkDeviceAndOrientation);
    window.addEventListener('orientationchange', checkDeviceAndOrientation);

    return () => {
      window.removeEventListener('resize', checkDeviceAndOrientation);
      window.removeEventListener('orientationchange', checkDeviceAndOrientation);
    };
  }, []);



  // If mobile device in portrait mode, render mobile footer
  if (isMobile) {
    return <CombinedFooterMobile />;
  }

  return (
    <footer id="footer" data-theme="dark" className="combined-footer smooth-scroll">
      {/* Pre-footer Section with Animation */}
      <div className="pre-footer-container" style={{ position: 'relative' }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: '887px',
            height: '888px',
            left: '0px',
            top: '0px',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'radial-gradient(closest-side at 0 0, rgba(255,255,255,0.4), rgba(255,255,255,0))',
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
            width: 'clamp(820px, 95vmin, 2600px)',
            aspectRatio: '887 / 888',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.8,
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
            const alpha = 0.18 + 0.25 * (1 - Math.abs(0.5 - t) * 2); // even brighter
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
          <svg width="100%" height="100%" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Group 1 - Central stars (spread across screen) */}
            <g className="star-group-1">
              <circle cx="960" cy="540" r="2" fill="rgba(255,255,255,0.6)"/>
              <circle cx="800" cy="400" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="1120" cy="400" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="800" cy="680" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="1120" cy="680" r="1.5" fill="rgba(255,255,255,0.5)"/>
              <circle cx="960" cy="300" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="960" cy="780" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="700" cy="540" r="1" fill="rgba(255,255,255,0.4)"/>
              <circle cx="1220" cy="540" r="1" fill="rgba(255,255,255,0.4)"/>
            </g>
            
            {/* Group 2 - Revolving stars around the entire screen */}
            <g className="star-group-2">
              <circle cx="200" cy="200" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="1720" cy="200" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="200" cy="880" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="1720" cy="880" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="200" cy="400" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="1720" cy="400" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="200" cy="680" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="1720" cy="680" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="400" cy="300" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="1520" cy="300" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="400" cy="780" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="1520" cy="780" r="1" fill="rgba(255,255,255,0.5)"/>
            </g>
          </svg>
        </div>

        <div className="text-container">
          <h1 className="main-heading">Banking was never easy…</h1>
          <p className="sub-heading">BaFT – Built for You, Powered by Tech</p>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="main-footer bg-gray-100 py-6 md:py-12 px-4 shadow-lg border-t border-gray-200">
        <div className="max-w-full mx-auto">
          <div className="mb-6 md:mb-8">
            <SignupForm onOpenThanks={() => setIsThanksOpen(true)} />
          </div>
          <div
            className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-12 bg-transparent rounded-lg gap-6 md:gap-4"
            style={{ minHeight: "auto" }}
          >
            {/* Left */}
            <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-[280px]">
              <img
                src={BAFT_PIC_PNG}
                alt="BaFT Logo"
                className="p-2 w-[80px] h-[80px] rounded-[20px] object-cover"
              />
              <h6
                className="font-bold text-[18px] md:text-[20px] leading-[1.2] tracking-[-0.01em] text-[#092646] text-center md:text-left"
                style={{ fontFamily: "EB Garamond" }}
              >
                BaFT Technology Pvt.Ltd
              </h6>
              <p
                className="font-normal text-[14px] md:text-[16px] leading-[1.2] tracking-[-0.01em] text-[#3E3E3E] text-center md:text-left"
                style={{ fontFamily: "Inter" }}
              >
                3rd Floor, No. 38, Greenleaf Extension, 3rd Cross, 80 Feet Rd, 4th
                Block, Koramangala, Bengaluru, Karnataka 560034
              </p>
            </div>

            {/* Center */}
            <div className="flex flex-col items-center gap-2 w-full md:w-[180px] h-auto md:h-[60px] my-4 md:my-0">
              <p
                className="font-medium text-[13px] leading-[1.5] tracking-[0.04em] uppercase text-[#092646] text-center"
                style={{ fontFamily: "Inter" }}
              >
                FOLLOW US
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Social link ${link.id}`}
                    className="border border-gray-300 rounded-full p-2 text-[#092646] hover:bg-[#092646] hover:text-white transition duration-300 text-lg"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col justify-center items-center md:items-end w-full md:w-[280px] h-auto md:h-[120px] text-[#000000] space-y-1">
              {[
                { label: "CONTACT US" },
                { label: "+91 6361042098", href: "tel:+916361042098" },
                {
                  label: "business@thebaft.com",
                  href: "mailto:business@thebaft.com",
                },
                {
                  label: "support@thebaft.com",
                  href: "mailto:support@thebaft.com",
                },
              ].map(({ label, href }, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0 ? "mb-1 font-semibold" : "mb-0 font-medium"
                  }
                  style={{
                    fontFamily: idx === 0 ? "EB Garamond" : "Inter",
                    fontSize: idx === 0 ? 14 : 13,
                    lineHeight: "150%",
                    letterSpacing: "0.04em",
                    textAlign: "center",
                  }}
                >
                  {href ? (
                    <a href={href} className="hover:underline">
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isThanksOpen && (
        <Thanks isOpen={true} onClose={() => setIsThanksOpen(false)} />
      )}
    </footer>
  );
};

export default CombinedFooter;
