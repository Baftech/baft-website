import { useRef, useEffect, useState } from "react";
// import { motion } from "framer-motion";
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
      <div className="relative w-full h-screen overflow-hidden bg-black">
        
        <video
          ref={videoRef}
          src="/BFAST Coin Mov.mp4" // <-- Replace with your video path
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          playsInline
        />

        
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black via-zinc-600 to-white opacity-60 pointer-events-none" />


        <div className="relative z-20 flex flex-col justify-center items-center h-full text-white">
          {showText && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-4xl font-bold bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent"
                style={{
                  fontFamily: "Libertinus Serif",
                  fontSize: "6rem",
                }}
              >
                B-Fast
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-white text-lg mt-4"
              >
                One Tap. Zero Wait.
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default B_Fast;
