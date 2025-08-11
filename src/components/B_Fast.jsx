import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const B_Fast = () => {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);

  return (
    <>
      <motion.div
        id="b-fast"
        ref={sectionRef}
        style={{ opacity }}
        data-theme="light"
        className="relative w-full min-h-screen overflow-hidden bg-white"
      >
        {/* Fixed Video */}
       <video
  ref={videoRef}
  src="/BFAST Coin Mov.mp4"
  className="absolute inset-0 z-0 w-full h-full object-contain"
  autoPlay
  muted
  loop
  playsInline
  disablePictureInPicture
  controlsList="nodownload nofullscreen noremoteplayback"
/>


        {/* Centered Content */}
        <div className="relative z-20 w-full min-h-screen flex flex-col justify-center items-center text-black px-4 sm:px-6 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent text-center"
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
            className="text-black text-sm sm:text-base md:text-lg lg:text-xl mt-3 sm:mt-4 mb-6 sm:mb-8 text-center"
          >
            One Tap. Zero Wait.
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default B_Fast;
