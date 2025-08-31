import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Thanks from "./Thanks";
import "./CombinedFooter.css";

const SignupFormMobile = ({ onOpenThanks }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onOpenThanks();
  };

  return (
         <section
       className="relative text-white mx-auto overflow-visible px-4 sm:px-6 flex"
       style={{
         width: 'clamp(327px, 85vw, 500px)',
         height: 'clamp(160px, 40vh, 220px)',
         borderRadius: "20px",
         background: "linear-gradient(92.61deg, #092646 3.49%, #3766B7 98.57%)",
         opacity: 1,
         top: '16px',
         margin: '0 auto',
         border: '1px solid rgba(255, 255, 255, 0.1)',
         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
       }}
     >
       <div className="py-4 sm:py-6 lg:py-8 relative z-20 px-3 sm:px-4 lg:px-6 w-3/5">
        <div className="flex flex-col items-start text-left gap-3 sm:gap-4 lg:gap-6">
          <h2
            className="mb-3 sm:mb-4 lg:mb-6"
            style={{
              width: 'clamp(54px, 15vw, 80px)',
              height: 'clamp(19px, 5vw, 28px)',
              fontFamily: "EB Garamond",
              fontWeight: 700,
              fontStyle: "Bold",
              fontSize: "clamp(16px, 4.5vw, 24px)",
              lineHeight: "100%",
              letterSpacing: "-1%",
              color: "#FFFFFF",
              opacity: 1,
              transform: "rotate(0deg)",
              margin: "0",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
          >
            Sign Up
          </h2>
          <p
            className="mb-3 sm:mb-4 lg:mb-6"
            style={{
              width: 'clamp(195px, 50vw, 280px)',
              height: 'clamp(42px, 10vw, 60px)',
              fontFamily: "Inter",
              fontWeight: 400,
              fontStyle: "Regular",
              fontSize: "clamp(12px, 3vw, 16px)",
              lineHeight: "120%",
              letterSpacing: "-1%",
              color: "#FFFFFFC4",
              opacity: 1,
              transform: "rotate(0deg)",
              margin: "0"
            }}
          >
            Get early access, updates, and exclusive perks. Enter your email below – no spam, we promise.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start gap-3 sm:gap-4 lg:gap-5 w-full"
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
                width: 'clamp(200px, 50vw, 350px)',
                height: 'clamp(36px, 9vw, 50px)',
                background: 'rgba(247, 247, 247, 0.18)',
                backdropFilter: 'blur(7.4622px)',
                borderRadius: 'clamp(10px, 3vw, 15px)',
                fontSize: "clamp(14px, 3.5vw, 18px)",
                color: '#FFFFFF'
              }}
            />
                        <button
              type="submit"
              disabled={!email.trim()}
              className={`font-medium transition ${
                email.trim() 
                  ? 'cursor-pointer hover:bg-gray-100' 
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                width: 'clamp(80px, 20vw, 120px)',
                height: 'clamp(28px, 7vw, 36px)',
                minHeight: 'clamp(28px, 7vw, 36px)',
                maxHeight: 'clamp(28px, 7vw, 36px)',
                justifyContent: 'center',
                opacity: email.trim() ? 1 : 0.5,
                top: '15px',
                borderRadius: '9999px',
                borderWidth: '0.28px',
                borderStyle: 'solid',
                padding: '0',
                margin: '0',
                lineHeight: '1',
                color: email.trim() ? '#000000' : '#666666',
                backgroundColor: email.trim() ? '#FFFFFF' : '#E5E5E5',
                border: '0.28px solid',
                borderImageSource: 'linear-gradient(121.31deg, rgba(49, 49, 49, 0.048) -10.95%, rgba(49, 49, 49, 0) 146.16%), linear-gradient(297.75deg, rgba(255, 255, 255, 0.048) 22.05%, rgba(0, 0, 0, 0) 120.83%, rgba(255, 255, 255, 0) 120.83%)',
                display: 'flex',
                alignItems: 'center',
                fontSize: 'clamp(10px, 2.5vw, 14px)',
                boxSizing: 'border-box'
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Phone image */}
      <div 
        className="absolute z-10"
        style={{
          width: 'clamp(160px, 35vw, 220px)',
          height: 'auto',
          right: '10px',
          bottom: '0px',
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

  return (
    <footer id="footer" data-theme="dark" className="combined-footer smooth-scroll">
      {/* Mobile-optimized pre-footer section */}
      <div className="pre-footer-container relative bg-black w-screen min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-16 xl:py-20">
        {/* Concentric circles background */}
        <div className="concentric-wrapper absolute inset-0 flex items-center justify-center">
          {/* Smallest circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Medium circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Large circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Extra large circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Largest circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
          
          {/* Outermost circle */}
          <div 
            className="concentric-circle absolute rounded-full"
            style={{
              position: 'absolute',
              width: '450px',
              height: '450px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.25,
              border: '0.5px solid #272731',
              borderRadius: '50%',
              willChange: 'auto',
              backfaceVisibility: 'hidden'
            }}
          />
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
      <div className="main-footer bg-gray-100 py-6 px-4 shadow-lg border-t border-gray-200">
        <div className="max-w-full mx-auto">
          <div className="mb-6">
            <SignupFormMobile onOpenThanks={() => setIsThanksOpen(true)} />
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
        </div>
      </div>
      
     
      
      {isThanksOpen && (
        <Thanks isOpen={true} onClose={() => setIsThanksOpen(false)} />
      )}
    </footer>
  );
};

export default CombinedFooterMobile;
