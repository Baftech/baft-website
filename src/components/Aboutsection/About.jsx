import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReadMore from "./ReadMore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const t1 = gsap.timeline({
      scrollTrigger: {
        trigger: "#aboutus",
        start: "top center",
        end: "bottom end",
        scrub: true,
      }
    });
    t1.fromTo("#aboutus", { opacity: 1 }, { opacity: 0 });

    // Initial setup
    gsap.set("#layer1", { opacity: 0 });
    gsap.set("#layer2", { opacity: 0 });
    gsap.set("#layer3", { opacity: 0 });
    gsap.set("#layer1_write", { opacity: 0 });
    gsap.set("#layer2_write", { opacity: 0 });
    gsap.set("#layer3_write", { opacity: 0 });
    gsap.set("#spotlight-overlay", { opacity: 0 });
    
    // Set initial spotlight properties
    gsap.set("#spotlight-overlay", {
      background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 5%, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.9) 100%)"
    });

    // Main animation timeline
    t1.fromTo("#aboutus", { opacity: 1 }, { delay: 2, opacity: 0.5 })
      .to("#spotlight-overlay", { opacity: 1, duration: 0.5 })
      
      // Layer 1 spotlight - move to position and resize
      .to("#spotlight-overlay", {
        duration: 1,
        ease: "power2.inOut",
        background: "radial-gradient(circle at 30% 40%, transparent 0%, transparent 8%, rgba(0,0,0,0.8) 12%, rgba(0,0,0,0.9) 100%)"
      }, "layer1")
      .fromTo("#layer1", { opacity: 0 }, { opacity: 1, duration: 1 }, "layer1")
      .fromTo("#layer1_write", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "layer1+=0.5")
      
      // Layer 2 spotlight
      .to("#spotlight-overlay", {
        duration: 1,
        ease: "power2.inOut",
        background: "radial-gradient(circle at 60% 35%, transparent 0%, transparent 8%, rgba(0,0,0,0.8) 12%, rgba(0,0,0,0.9) 100%)"
      }, "layer2")
      .to("#layer1_write", { opacity: 0, duration: 0.3 }, "layer2")
      .fromTo("#layer2", { opacity: 0 }, { opacity: 1, duration: 1 }, "layer2")
      .fromTo("#layer2_write", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "layer2+=0.5")
      
      // Layer 3 spotlight
      .to("#spotlight-overlay", {
        duration: 1,
        ease: "power2.inOut",
        background: "radial-gradient(circle at 45% 65%, transparent 0%, transparent 8%, rgba(0,0,0,0.8) 12%, rgba(0,0,0,0.9) 100%)"
      }, "layer3")
      .to("#layer2_write", { opacity: 0, duration: 0.3 }, "layer3")
      .fromTo("#layer3", { opacity: 0 }, { opacity: 1, duration: 1 }, "layer3")
      .fromTo("#layer3_write", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "layer3+=0.5")
      
      // Final state - expand spotlight and fade overlay
      .to("#spotlight-overlay", {
        duration: 1,
        ease: "power2.inOut",
        background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 50%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.9) 100%)"
      }, "final")
      .to("#spotlight-overlay", { opacity: 0, duration: 0.5 }, "final+=0.5")
      .to("#aboutus", { opacity: 1, duration: 0.5 }, "final")
      .to("#layer3_write", { opacity: 0, duration: 0.3 }, "final");

  }, { scope: containerRef });

  return (
    <div id="about" data-theme="light" className="bg-white min-h-screen flex items-center justify-center">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 items-center">
        {/* Left Column */}
        <div>
          <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-2 flex items-center gap-2">
            <span className="text-xs">🔹</span> Know Our Story
          </p>
          <h1
            className="leading-none mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[rgba(25,102,187,1)]"
            style={{
              fontFamily: "EB Garamond",
              lineHeight: 1.1,
            }}
          >
            <span className="block">About BaFT</span>
          </h1>
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed pr-2">
            We're Vibha, Dion and Saket, the trio behind BAFT Technology. We
            started this company with a simple goal: to make banking in India less
            of a headache and more of a smooth, dare we say… enjoyable
            experience.
            <br/>
            <br/>
            Somewhere between dodging endless forms and wond...
          </p>
          {/* ReadMoreText Component */}
          <ReadMore
            content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.
`}
            maxLength={150}
          />
        </div>

        {/* Right Column */}
        <div ref={containerRef} className="flex justify-center">
          <div className="relative w-full max-w-full">
            {/* Main aboutus image */}
            <img 
              id="aboutus" 
              src="/aboutus.svg" 
              alt="About BaFT" 
              className="max-w-full h-auto relative z-10" 
            />
            
            {/* Layer images positioned absolutely over main image */}
            <img 
              id="layer1"
              src="/layer1.svg" 
              alt="Layer 1" 
              className="absolute top-0 left-0 w-full h-full object-contain z-20" 
              style={{ opacity: 0 }}
            />
            
            <img 
              id="layer1_write"
              src="/layer1_write.svg" 
              alt="Layer 1 Write" 
              className="absolute top-0 left-0 w-full h-full object-contain z-30" 
              style={{ opacity: 0 }}
            />
            
            <img 
              id="layer2"
              src="/layer2.svg" 
              alt="Layer 2" 
              className="absolute top-0 left-0 w-full h-full object-contain z-20" 
              style={{ opacity: 0 }}
            />
            
            <img 
              id="layer2_write"
              src="/layer2_write.svg" 
              alt="Layer 2 Write" 
              className="absolute top-0 left-0 w-full h-full object-contain z-30" 
              style={{ opacity: 0 }}
            />
            
            <img 
              id="layer3"
              src="/layer3.svg" 
              alt="Layer 3" 
              className="absolute top-0 left-0 w-full h-full object-contain z-20" 
              style={{ opacity: 0 }}
            />
            
            <img 
              id="layer3_write"
              src="/layer3_write.svg" 
              alt="Layer 3 Write" 
              className="absolute top-0 left-0 w-full h-full object-contain z-30" 
              style={{ opacity: 0 }}
            />
            
            {/* Spotlight overlay using radial gradient */}
            <div 
              id="spotlight-overlay"
              className="absolute top-0 left-0 w-full h-full z-40 pointer-events-none"
              style={{ 
                opacity: 0,
                background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 5%, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.9) 100%)"
              }}
            >
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;