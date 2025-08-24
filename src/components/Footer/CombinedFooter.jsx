import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Thanks from "./Thanks";
import "./CombinedFooter.css";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Here you can add your email subscription logic
      setEmail("");
      setIsSubmitted(true);
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
      {isSubmitted && (
        <Thanks isOpen={true} onClose={() => setIsSubmitted(false)} />
      )}
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ borderRadius: "17.15px" }}
            />
            <button
              type="submit"
              disabled={!email.trim()}
              className={`cursor-pointer w-full sm:w-auto px-5 py-2.5 rounded-full font-medium transition ${
                email.trim()
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed"
              }`}
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
                Subscribe
              </span>
            </button>
          </form>
        </div>
      </div>

      {/* Image positioned at bottom right of the component */}
      <div className="absolute right-4 md:right-8 -bottom-0 md:-bottom-3 lg:-bottom-5.5 z-20">
        <img
          src="/hand_iphone_image.svg"
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
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    const starCount = Math.floor(canvas.width * canvas.height / 9000); // fewer stars

    for (let i = 0; i < starCount; i++) {
      stars.push({
        radius: Math.random() * 1.5 + 0.5,
        opacity: 0.05 + Math.random() * 0.3,
        angle: Math.random() * Math.PI * 2, // polar angle
        dist: Math.random() * (Math.min(canvas.width, canvas.height) / 2),
      });
    }

    let rotationSpeed = 0.0005; // galaxy swirl
    let lastTime = 0;
    const targetFPS = 30; // Reduced FPS for better scroll performance
    const frameInterval = 1000 / targetFPS;

    function draw(currentTime) {
      // Skip rendering if not visible to improve scroll performance
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      
      // Throttle to target FPS to reduce scroll interference
      if (currentTime - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(draw);
        return;
      }
      
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Batch rendering for better performance
      ctx.beginPath();
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.angle += rotationSpeed;

        const x = cx + Math.cos(star.angle) * star.dist;
        const y = cy + Math.sin(star.angle) * star.dist;

        ctx.moveTo(x + star.radius, y);
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(draw);
    }

    // Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    
    observer.observe(canvas);
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <footer id="footer" data-theme="dark" className="combined-footer smooth-scroll">
      {/* Pre-footer Section with Animation */}
      <div className="pre-footer-container">
        <canvas ref={canvasRef} className="starfield-canvas" />

        <div className="concentric-wrapper">
          <div className="concentric-circle" />
          <div className="concentric-circle" />
          <div className="concentric-circle" />
          <div className="concentric-circle" />
          <div className="concentric-circle" />
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
            <SignupForm />
          </div>
          <div
            className="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-12 bg-transparent rounded-lg gap-6 md:gap-4"
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
    </footer>
  );
};

export default CombinedFooter;
