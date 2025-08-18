import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

const SignupForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section
      className="text-white mx-auto w-full max-w-[1000px]"
      style={{
        borderRadius: "30px",
        background: "linear-gradient(92.61deg, #092646 3.49%, #3766B7 98.57%)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4 px-4 py-4 md:px-6 lg:px-10 lg:py-6">
        <div className="flex flex-col justify-center order-2 md:order-1">
          <h2
            className="text-xl md:text-2xl font-semibold mx-2 md:mx-6 mb-1"
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
            className="text-xs text-gray-200 mx-2 md:mx-6 mb-3"
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              letterSpacing: "-1%",
              lineHeight: "120%",
            }}
          >
            Get early access, updates, and exclusive perks. Enter your email
            below - no spam, we promise.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 mb-4 md:mb-8 mx-2 md:mx-6">
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 mb-2 sm:mb-0"
              style={{ borderRadius: "17.15px", borderWidth: "0.4px" }}
            />
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
              style={{ minWidth: "90px" }}
            >
              <span
                style={{
                  fontFamily: "Inter",
                  fontWeight: 500,
                  fontSize: "11px",
                  lineHeight: "14px",
                  textAlign: "center",
                  display: "inline-block",
                }}
              >
                Subscribe
              </span>
            </button>
          </div>
        </div>
        <div className="relative flex items-center justify-center w-full order-1 md:order-2">
          <img
            src="/hand_iphone_image.svg"
            alt="Signup Illustration"
            className="w-[200px] md:w-[250px] lg:w-[350px] max-w-full rounded-3xl object-contain"
            style={{ filter: "drop-shadow(0 0 12px rgba(55, 102, 183, 0.6))" }}
          />
        </div>
      </div>
    </section>
  );
};

const socialLinks = [
  {
    id: 1,
    icon: <FontAwesomeIcon icon={faInstagram} />,
    url: "https://www.instagram.com/",
  },
  {
    id: 2,
    icon: <FontAwesomeIcon icon={faWhatsapp} />,
    url: "https://wa.me/1234567890",
  },
  {
    id: 3,
    icon: <FontAwesomeIcon icon={faLinkedin} />,
    url: "https://www.linkedin.com/",
  },
  {
    id: 4,
    icon: <FontAwesomeIcon icon={faFacebook} />,
    url: "https://www.facebook.com/",
  },
];

const Footer = () => {
  return (
    <footer id="footer" data-theme="dark" className="bg-gray-100 py-6 md:py-12 px-4">
      <div className="max-w-full mx-auto">
        <div className="mb-6 md:mb-8">
          <SignupForm />
        </div>
        <div
          className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-12 bg-transperent rounded-lg gap-6 md:gap-4"
          style={{ minHeight: "auto" }}
        >
          {/* Left */}
          <div className="flex flex-col items-center md:items-start gap-1 w-full md:w-[280px]">
            <img
              src="/baft_pic.png"
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
              Bengaluru, Karnataka
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
                  textAlign: window.innerWidth >= 768 ? "right" : "center",
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
    </footer>
  );
};

export default Footer;
