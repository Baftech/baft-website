import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

// SignupForm component
const SignupForm = () => {
  return (
    <section
      className="bg-gradient-to-br from-[#0f2c5c] to-[#163e74] text-white mx-auto"
      style={{
        width: "1100px",
        height: "350px",
        borderRadius: "30px",
        opacity: 1,
        transform: "rotate(0deg)",
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-4 md:py-10">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <h2 className="text-3xl font-semibold mx-10 mb-2">Sign Up</h2>
          <p className="text-sm text-gray-200 mx-10 mb-4">
            Get early access, updates, and exclusive perks. Enter your email
            below - no spam, we promise.
          </p>
          <form className="flex flex-row items-center gap-3 mb-20">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="block w-full ml-10 flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button
              type="submit"
              className="px-2 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
        <div className="relative flex items-center justify-center w-full order-1 lg:order-2">
          <img
            src="/hand_iphone_image.png"
            alt="Signup Illustration"
            className="align-top-[-15px] w-[450px] h-[350px] rounded-2xl object-cover"
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
    url: "https://wa.me/1234567890", // Replace with your number
  },

  {
    id: 5,
    icon: <FontAwesomeIcon icon={faLinkedin} />,
    url: "https://www.linkedin.com/",
  },
];

const Footer = () => {
  return (
    <footer id="footer" data-theme="dark" className="bg-gray-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Signup Form Section */}
        <div className="mb-4">
          <SignupForm />
        </div>
        <div className="relative h-40">
          <div className="absolute bottom-0 left-0 w-full flex justify-between items-end">
            {/* Left: Logo */}
            <div className="flex items-end">
              <img src="/logo1.png" alt="Logo" className="w-24 h-auto" />
            </div>

            {/* Center: Social Links */}
            <ul className="flex gap-4 sm:gap-8">
              {socialLinks.map((link) => (
                <a
                  href={link.url}
                  target="__blank"
                  key={link.id}
                  className="text-gray-700 cursor-pointer rounded-full bg-gray-50 dark:bg-ternary-dark hover:bg-gray-100 shadow-sm p-4 duration-300"
                >
                  <i className="text-l sm:text-1xl md:text-2xl">{link.icon}</i>
                </a>
              ))}
            </ul>
            {/* Right: Contact Info */}

            <div className="text-right text-sm text-[#36382E]">
              <p>
                <strong className="text-#092646;">Contact Us</strong>
              </p>
              <p>
                <a href="tel:+916361042098">+91 6361042098</a>
              </p>
              <p>
                <a href="mailto:business@thebaft.com">business@thebaft.com</a>
              </p>
              <p>
                <a href="mailto:support@thebaft.com">support@thebaft.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
