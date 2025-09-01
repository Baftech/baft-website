import React, { useRef, useState, useEffect } from "react";

// Mobile version of B_Fast.jsx tailored for iPhone 13 mini dimensions
const B_Fast_Mobile = () => {
  const contentRef = useRef(null);
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const sectionRef = useRef(null);
  const orbitingStarsRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  // Keep a bit of top spacing to avoid navbar overlap
  const [navbarSafeSpacing, setNavbarSafeSpacing] = useState("80px");
  // Scale the text group from an iPhone 13 mini baseline (≈390px width)
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const onResize = () => {
      const estimatedNavbarHeight = 80;
      const currentScreenHeight = window.innerHeight;
      const safeSpacing = Math.max(estimatedNavbarHeight + 20, currentScreenHeight * 0.08);
      setNavbarSafeSpacing(`${safeSpacing}px`);

      // Compute a responsive scale factor based on viewport width
      const BASE_WIDTH = 390; // iPhone 13 mini logical width
      const vw = Math.max(window.innerWidth, 320);
      const computed = vw / BASE_WIDTH;
      // Keep scaling reasonable across devices
      const clamped = Math.max(0.62, Math.min(computed, 1.35));
      setScaleFactor(clamped);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Ensure content is visible immediately when component mounts
  useEffect(() => {
    // Start with video hidden and text hidden
    if (videoSectionRef.current) {
      videoSectionRef.current.style.opacity = '0';
      videoSectionRef.current.style.transform = 'scale(0.8)';
    }
    if (contentRef.current) {
      // Start with text hidden and above position for slide-down animation
      const el = contentRef.current;
      el.style.opacity = '0';
      el.style.transform = 'translate3d(0, -50px, 0)';
      el.style.willChange = 'opacity, transform';
      el.style.backfaceVisibility = 'hidden';
      el.style.WebkitBackfaceVisibility = 'hidden';
      el.style.perspective = '1000px';
      el.style.contain = 'layout paint style';
    }
    
    // Animation sequence: Video appears first, then text slides down
    setTimeout(() => {
      // Step 1: Video appears with scale and fade effect
      if (videoSectionRef.current) {
        videoSectionRef.current.style.transition = 'opacity 1.0s cubic-bezier(0.4, 0, 0.2, 1), transform 1.0s cubic-bezier(0.4, 0, 0.2, 1)';
        videoSectionRef.current.style.opacity = '1';
        videoSectionRef.current.style.transform = 'scale(1)';
      }
    }, 200); // Video starts appearing after 200ms
    
    setTimeout(() => {
      // Step 2: Text slides down after video is visible with smoother easing
      const el = contentRef.current;
      if (!el) return;
      el.style.transition = 'none';
      void el.offsetHeight; // force reflow
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = 'opacity 1.3s cubic-bezier(0.22, 1, 0.36, 1), transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translate3d(0, 0, 0)';
        });
      });
    }, 700); // Text starts sliding down after 700ms (500ms after video starts)
    
    if (orbitingStarsRef.current) {
      orbitingStarsRef.current.style.opacity = '1';
    }
  }, []);



  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden b-fast-section" style={{ backgroundColor: '#ffffff' }} data-theme="light">
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-start" style={{ backgroundColor: '#ffffff', textAlign: 'center' }}>
        {/* Text Content */}
        <div
          ref={contentRef}
          className="text-center max-w-6xl mx-auto"
          style={{ 
            marginTop: navbarSafeSpacing,
            marginBottom: '0cm',
            paddingTop: 'clamp(20px, 2vh, 40px)',
            width: 'clamp(280px, 90vw, 1600px)',
            height: 'clamp(100px, 15vh, 200px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5cm',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
                     <h1 
             className="mb-4 leading-tight"
             style={{ 
               fontFamily: 'EB Garamond, serif',
               fontWeight: 700,
               fontStyle: 'bold',
               fontSize: 'clamp(60px, 7vw, 100px)', // Adjusted for mobile
               lineHeight: '100%',
               letterSpacing: '0%',
               textAlign: 'center',
               width: 'clamp(280px, 90vw, 1600px)',
               height: 'clamp(80px, 15vh, 200px)',
               backgroundImage: 'linear-gradient(180deg, #B8C9E0 33.59%, #0A2A4A 77.13%)',
               backgroundRepeat: 'no-repeat',
               backgroundSize: '100% 100%',
               backgroundPosition: 'center',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text',
               color: 'transparent',
               textShadow: 'none',
               margin: '0 auto',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative',
               left: '50%',
               transform: 'translateX(-50%) rotate(0deg)'
             }}
           >
            B-Fast
          </h1>

                     <p 
             className="leading-relaxed"
             style={{ 
               width: 'clamp(280px, 90vw, 1600px)',
               height: 'clamp(25px, 3vh, 50px)',
               opacity: 1,
               fontFamily: 'Inter, sans-serif',
               fontWeight: 500,
               fontStyle: 'normal',
               fontSize: 'clamp(14px, 1.8vw, 24px)', // Adjusted for mobile
               lineHeight: '100%',
               letterSpacing: '0%',
               textAlign: 'center',
               color: '#777575',
               marginTop: 'clamp(16px, 2vh, 32px)',
               margin: '0 auto',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               position: 'relative',
               left: '50%',
               transform: 'translateX(-50%)',
             }}
           >
            One Tap. Zero Wait.
          </p>
        </div>

                 {/* Video Section */}
         <div 
           ref={videoSectionRef}
           className="relative w-full mx-auto" 
           style={{ 
             backgroundColor: 'transparent',
             position: 'relative',
             flex: '1 1 auto',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             minHeight: 'clamp(300px, 50vh, 600px)', // Adjusted for mobile
             maxHeight: 'clamp(400px, 70vh, 800px)', // Adjusted for mobile
             marginTop: 'clamp(40px, 4vh, 80px)',
             marginLeft: 'clamp(10px, 1vw, 20px)',
             marginRight: 'clamp(10px, 1vw, 20px)'
           }}
         >
           {/* Centered Video Glow */}
           <div style={{
             position: 'absolute',
             inset: 0,
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             pointerEvents: 'none',
             zIndex: 11
           }}>
             <div style={{
               width: 'min(80vw, 600px)',
               height: 'min(60vh, 400px)',
               background: 'radial-gradient(ellipse at center, rgba(55,102,183,0.28) 0%, rgba(55,102,183,0.14) 40%, rgba(55,102,183,0.06) 70%, rgba(55,102,183,0) 100%)',
               filter: 'blur(50px)',
               mixBlendMode: 'overlay',
               borderRadius: '50%',
               transform: 'translateZ(0)'
             }} />
           </div>
           
           {/* Video Container */}
           <div className="relative w-full h-full flex items-center justify-center" style={{ 
             backgroundColor: 'transparent',
             border: 'none',
             outline: 'none'
           }}>
             {videoError ? (
               <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative z-10 shadow-lg">
                 <div className="text-center text-gray-500">
                   <div className="text-2xl sm:text-3xl md:text-4xl mb-2">🎥</div>
                   <p className="text-sm sm:text-base">Video unavailable</p>
                 </div>
               </div>
             ) : (
               <video
                 ref={videoRef}
                 src="/bfast_video.mp4"
                 className="object-contain relative z-10"
                 style={{ 
                   width: 'clamp(300px, 80vw, 600px)',
                   height: 'clamp(169px, 45vw, 338px)',
                   objectFit: 'contain',
                   objectPosition: 'center center',
                   transform: 'none',
                   opacity: 0.98,
                   position: 'relative',
                   margin: '0',
                   left: 'auto',
                   mixBlendMode: 'normal',
                   filter: 'saturate(1.08) contrast(1.04) brightness(1.02)',
                   WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                   maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                   pointerEvents: 'none',
                   border: 'none',
                   outline: 'none',
                   background: 'transparent',
                   backgroundColor: 'transparent',
                   maxWidth: '100%',
                   maxHeight: '100%'
                 }}
                 autoPlay
                 muted
                 playsInline
                 controls={false}
                 disablePictureInPicture
                 preload="auto"
                 onError={() => setVideoError(true)}
                 onLoadStart={() => {}}
                 onCanPlay={() => {}}
                 onEnded={() => {}}
               />
             )}
           </div>
         </div>

                 {/* Global Glow Overlay */}
         <div style={{
           position: 'fixed',
           width: 'clamp(300px, 80vw, 600px)',
           height: 'clamp(350px, 70vh, 700px)',
           left: 'calc(50% - (clamp(300px, 80vw, 600px))/2)',
           top: 'calc(50% - (clamp(350px, 70vh, 700px))/2)',
           background: 'radial-gradient(ellipse at center, rgba(55, 102, 183, 0.12) 0%, rgba(55, 102, 183, 0.08) 40%, rgba(55, 102, 183, 0.03) 75%, rgba(55, 102, 183, 0) 100%)',
           filter: 'blur(30px)',
           mixBlendMode: 'soft-light',
           zIndex: 12,
           pointerEvents: 'none'
         }} />

         {/* Orbiting stars overlay - simplified for mobile */}
         <div ref={orbitingStarsRef} style={{ position: 'absolute', inset: 0, zIndex: 22, pointerEvents: 'none' }}>
           <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0 }}>
             {/* Ring 1 */}
             <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitSlow 24s linear infinite' }}>
               <div style={{ width: 'clamp(6px, 0.4vw, 12px)', height: 'clamp(6px, 0.4vw, 12px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'translateX(clamp(200px, 25vw, 300px))' }} />
               <div style={{ width: 'clamp(6px, 0.4vw, 12px)', height: 'clamp(6px, 0.4vw, 12px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'rotate(120deg) translateX(clamp(200px, 25vw, 300px))' }} />
               <div style={{ width: 'clamp(6px, 0.4vw, 12px)', height: 'clamp(6px, 0.4vw, 12px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.85, transform: 'rotate(240deg) translateX(clamp(200px, 25vw, 300px))' }} />
             </div>
             {/* Ring 2 */}
             <div style={{ position: 'absolute', left: '-1px', top: '-1px', width: '2px', height: '2px', transformOrigin: '1px 1px', animation: 'orbitMed 18s linear infinite reverse' }}>
               <div style={{ width: 'clamp(4px, 0.3vw, 8px)', height: 'clamp(4px, 0.3vw, 8px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'translateX(clamp(280px, 35vw, 400px))' }} />
               <div style={{ width: 'clamp(4px, 0.3vw, 8px)', height: 'clamp(4px, 0.3vw, 8px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(90deg) translateX(clamp(280px, 35vw, 400px))' }} />
               <div style={{ width: 'clamp(4px, 0.3vw, 8px)', height: 'clamp(4px, 0.3vw, 8px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(180deg) translateX(clamp(280px, 35vw, 400px))' }} />
               <div style={{ width: 'clamp(4px, 0.3vw, 8px)', height: 'clamp(4px, 0.3vw, 8px)', background: '#000', clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)', opacity: 0.9, transform: 'rotate(270deg) translateX(clamp(280px, 35vw, 400px))' }} />
             </div>
           </div>
         </div>
      </div>

              {/* Star animations */}
        <style>{`
          @keyframes orbitSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes orbitMed { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        `}</style>
    </section>
  );
};

export default B_Fast_Mobile;


