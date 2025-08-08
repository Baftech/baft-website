import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
const B_Fast = () => {
  const videoRef = useRef(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (video.currentTime >= 9 && !showText) {
        setShowText(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [showText]);

  return (
    <>
      <div id="b-fast" data-theme="light" className="relative w-full min-h-screen overflow-hidden bg-black">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/BFAST Coin Mov.mp4"
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          playsInline
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-zinc-600 to-white opacity-60 pointer-events-none" />

        {/* Centered Content */}
        <div className="relative z-20 w-full min-h-screen flex flex-col justify-center items-center text-white px-4 sm:px-6 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent text-center"
            style={{
              fontFamily: "Libertinus Serif",
            }}
          >
            B-Fast
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-white text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 mb-6 sm:mb-8 text-center"
          >
            One Tap. Zero Wait.
          </motion.div>

        
        </div>
      </div>
    </>
  );
};

export default B_Fast;
