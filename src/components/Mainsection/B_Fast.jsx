import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const B_Fast = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useGSAP(() => {
    // Check if refs exist before animating
    if (!contentRef.current || !videoRef.current) return;
    
    // Initially hide everything
    gsap.set(contentRef.current, { opacity: 0, y: -100 });
    gsap.set(videoRef.current, { opacity: 0, scale: 0.8 });
    
    // Start video animation first with much longer duration
    const videoTimer = setTimeout(() => {
      // Check if ref still exists
      if (!videoRef.current) return;
      
      // Show video first - fade in from position with longer duration
      gsap.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 3.2,
        ease: "power2.out",
        clearProps: "scale" // Clear transform after animation to prevent conflicts
      });
      
      // Show text after video animation - slide down from top with longer duration
      const textTimer = setTimeout(() => {
        // Check if ref still exists
        if (!contentRef.current) return;
        
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 3.6,
          ease: "power2.out",
          clearProps: "y" // Clear transform after animation to prevent conflicts
        });
      }, 1400);
      
      // Cleanup function for text timer
      return () => clearTimeout(textTimer);
    }, 700);
    
    // Cleanup function for video timer
    return () => clearTimeout(videoTimer);
  }, []);

  return (
    <section className="relative w-full h-screen bg-white overflow-hidden" data-theme="light">
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 bg-white">
        {/* Text Content */}
        <div
          ref={contentRef}
          className="text-center mb-16"
          style={{ marginTop: '80px' }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[130px] eb-garamond-Bfast bg-gradient-to-r from-[#9AB5D2] to-[#092646] bg-clip-text text-transparent mb-4">
            B-Fast
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl inter-Bfast_sub bg-gradient-to-r from-[#777575] to-[#092646] bg-clip-text text-transparent">
            One Tap. Zero Wait.
          </p>
        </div>

        {/* Semi-transparent layer between text and video */}
        <div className="w-full max-w-[600px] h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8 opacity-70"></div>

        {/* Video Section */}
        <div className="relative w-full max-w-[1000px] h-[100px] md:h-[350px] flex items-center justify-center bg-white" style={{ marginTop: '-100px' }}>
          {videoError ? (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">🎥</div>
                <p>Video unavailable</p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src="/bfast_video.mp4"
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              preload="auto"
              onError={() => setVideoError(true)}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can start playing')}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default B_Fast;
