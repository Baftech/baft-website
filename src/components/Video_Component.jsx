import React, { useEffect, useRef, useState } from "react";

const Video_Component = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
  if (!containerRef.current) return;

  const rect = containerRef.current.getBoundingClientRect();
  const windowHeight = window.innerHeight;


  if (rect.top <= windowHeight / 2 && !isVideoPlaying) {
    setScrollProgress(1); 
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
      setIsVideoPlaying(true);
    }
  } else if (rect.top > windowHeight / 2 && isVideoPlaying) {
    setScrollProgress(0); 
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsVideoPlaying(false);
  }
};


    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVideoPlaying]);

  // Calculate smooth transitions
  const videoWidth = 50 + (scrollProgress * 50); // From 50% to 100% of viewport
  const videoHeight = Math.min(100, 60 + (scrollProgress * 40)); // Height expansion
  const textTranslateX = scrollProgress * 150; // Push text to the right (150% off screen)
  const borderRadius = Math.max(0, 8 * (1 - scrollProgress)); // Reduce border radius

  return (
    <section 
      ref={containerRef}
      className="bg-white min-h-[250vh] relative overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center">
        
        {/* Main Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative">
          
          
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
            style={{
              width: `${videoWidth}vw`,
              height: `${videoHeight}vh`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <video 
              ref={videoRef}
              className="w-full h-full object-cover shadow-lg"
              muted
              loop
              playsInline
              style={{ borderRadius: `${borderRadius}px` }}
            >
              <source src="/BAFT Vid 2_1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

         
          <div 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ 
              transform: `translate(${textTranslateX}%, -50%)`,
              opacity: Math.max(0, 1 - scrollProgress * 1.2)
            }}
          >
            <div className="w-[479px] h-[245px] p-4 flex flex-col justify-start items-start space-y-2 bg-white rounded-lg shadow-lg">
              <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 transform rotate-45 inline-block mr-1"></span>
                Know Our Story
              </p>
              <h1
                className="text-3xl font-bold text-blue-600 leading-tight"
                style={{ fontFamily: "EB Garamond" }}
              >
                The Video
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed pr-2">
                BaFT Technologies is a next-gen neo-banking startup headquartered in
                Bangalore, proudly founded in 2025. We`re a tight-knit team of
                financial innovators and tech experts on a mission: to reimagine
                financial services in India with customer-first solutions.
              </p>
              <button className="bg-[rgba(25,102,187,1)] hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded">
                Watch Now
              </button>
            </div>
          </div>

       

        </div>
      </div>
    </section>
  );
};

export default Video_Component;