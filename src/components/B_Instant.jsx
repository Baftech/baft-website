import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CoinsSection = () => {
  const [showOverlayText, setShowOverlayText] = useState(false);

  // Trigger overlay text animation after StackedCoins zoom-in completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOverlayText(true);
    }, 1000); // Wait for StackedCoins animation to complete (1000ms)

    return () => clearTimeout(timer);
  }, []);

  // StackedCoins animation variants
  const stackedCoinsVariants = {
    initial: { 
      scale: 0.5,
      opacity: 0
    },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1, // 1000ms
        ease: "easeOut",
        delay: 0 // No delay
      }
    }
  };

  // OverlayText animation variants
  const overlayTextVariants = {
    initial: { 
      opacity: 0,
      y: 50 // Start from bottom
    },
    animate: { 
      opacity: 1,
      y: 0, // Move to center
      transition: {
        duration: 0.8, // 800ms
        ease: "easeInOut",
        delay: 0.2 // 200ms delay
      }
    }
  };

  return (
    <section id="b_instant" data-theme="dark" className="bg-black w-full min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="relative flex flex-col items-center justify-center">
        {/* StackedCoins Element */}
        <motion.div
          className="relative z-20"
          variants={stackedCoinsVariants}
          initial="initial"
          animate="animate"
        >
          {/* Additional stacked coin effect */}
          <img
            src="/coin.png"
            alt=""
            className="gap-10 absolute top-2 left-2 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain opacity-100 -z-10"
            style={{ 
              filter: "brightness(0.9) saturate(1.1)" 
            }}
          />
          <br/>
          <img
            src="/coin.png"
            alt="Stacked gold coins representing wealth accumulation"
            className="gap-10 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain filter brightness-110"
            style={{ 
              filter: "brightness(1.3) saturate(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))" 
            }}
          />
          
          
          
          <img
            src="/coin.png"
            alt=""
            className="gap-10 absolute top-4 left-4 w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain opacity-100 -z-20"
            style={{ 
              filter: "brightness(0.7) saturate(1.0)" 
            }}
          />
        </motion.div>

        {/* OverlayText Element */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-20"
          variants={overlayTextVariants}
          initial="initial"
          animate={showOverlayText ? "animate" : "initial"}
        >
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-amber-50 mb-2 sm:mb-3 md:mb-4"
            style={{
              fontFamily: "Libertinus Serif",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)"
            }}
          >
            Stack Your Success
          </h2>
          <p 
            className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-md mx-auto"
            style={{
              fontFamily: "Libertinus Serif"
            }}
          >
            Build wealth coin by coin, step by step
          </p>
        </motion.div>
      </div>

      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-amber-900/10 via-transparent to-transparent pointer-events-none" />
    </section>
  );
};

export default CoinsSection;