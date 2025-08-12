import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const B_Fast = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const videoRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom", // start fading before section fully enters
        end: "top top",      // finish when section is fully at top
        scrub: true,
      },
    });

    // Background fade
    tl.fromTo(
      sectionRef.current,
      { backgroundColor: "#000000" },
      { backgroundColor: "#ffffff", ease: "none" },
      0
    );

    // Content fade
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, ease: "power1.out" },
      0
    );

    // Video fade (independent from text, but aligned)
    tl.fromTo(
      videoRef.current,
      { opacity: 0 },
      { opacity: 1, ease: "power1.out" },
      0.1 // slight delay after scroll starts
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      id="entire"
      className="flex flex-col justify-center py-35 min-h-screen"
    >
      <div ref={contentRef} className="flex flex-col items-center">
        <h1
          id="bfast"
          className="text-[130px] flex-center eb-garamond-Bfast 
            bg-gradient-to-r from-[#9AB5D2] to-[#092646] 
            bg-clip-text text-transparent"
        >
          B-Fast
        </h1>

        <p
          id="bfast-sub"
          className="flex flex-col text-[28px] flex-center inter-Bfast_sub 
            bg-gradient-to-r from-[#777575] to-[#092646] 
            bg-clip-text text-transparent mt-4"
        >
          One Tap. Zero Wait.
        </p>

        <video
          ref={videoRef}
          src="/bfast_video.mp4"
          className="w-full h-auto p-10"
          autoPlay
          muted
          loop
          playsInline
          style={{ opacity: 0 }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default B_Fast;
