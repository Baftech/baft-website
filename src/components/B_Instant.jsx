import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const B_Instant = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const imageVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 0.5, // stays at 50% after animation
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const overlayTextVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeInOut", delay: 0.2 },
    },
  };

  return (
    <section
      id="b_instant"
      data-theme="dark"
      className="relative bg-black w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ isolation: "isolate" }}
    >
      {/* Centered container */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Image */}
        <motion.img
          src="/B_instant.svg"
          alt="B instant illustration"
          className="max-w-[30rem] w-full h-auto object-contain"
          style={{
            filter:
              "drop-shadow(0 0 20px rgba(255, 215, 0, 0.3)) brightness(1.2)",
          }}
          variants={imageVariants}
          initial="initial"
          animate="animate"
        />

        {/* Overlay Text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          variants={overlayTextVariants}
          initial="initial"
          animate={showOverlayText ? "animate" : "initial"}
        >
          <div className="flex flex-col items-start leading-tight">
            {/* First line group */}
            <div className="flex flex-col">
              <span
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-50 italic"
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 200,
                  textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                }}
              >
                B-Coin
              </span>
              <div className="flex items-baseline">
                <span
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-50 italic mr-2"
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 200,
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  Instant Value
                </span>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white">
                  —
                </span>
                <span
                  className="ml-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-serif font-bold"
                  style={{
                    fontFamily: '"EB Garamond", serif',
                    textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
                  }}
                >
                  SHARED
                </span>
              </div>
            </div>

            {/* Second line */}
            <span
              className="self-end text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-amber-50 italic"
              style={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 200,
                textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
              }}
            >
              Instantly
            </span>
          </div>
        </motion.div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none z-0" />
    </section>
  );
};

export default B_Instant;
