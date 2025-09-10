import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";
import { BAFT_CARD1_SVG, BAFT_CARD2_SVG, BAFT_CARD3_SVG, BAFT_CARD4_SVG, PAY_BILLS_SVG, MANAGE_ACCOUNT_SVG, REWARDS_SVG, SEAMLESS_PAYMENTS_SVG, SVG_SVG } from "../../assets/assets";

// Prewarm feature images as soon as this module is loaded (before user reaches section)
const FEATURE_IMAGES = [BAFT_CARD1_SVG, BAFT_CARD2_SVG, BAFT_CARD3_SVG, BAFT_CARD4_SVG];
(() => {
  if (typeof window === 'undefined') return;
  if (window.__baftFeaturesPreloaded) return;
  window.__baftFeaturesPreloaded = true;
  try {
    FEATURE_IMAGES.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      const img = new Image();
      img.src = src;
    });
  } catch (_) {
    // no-op
  }
})();

const Cards = () => {
  const cardsRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const prevIndexRef = useRef(null);
  const rotateIntervalRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
   
  const featuresData = [
    {
      icon: null,
      customIcon: PAY_BILLS_SVG,
      image: BAFT_CARD1_SVG,
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders.",
    },
    {
      icon: null,
      customIcon: MANAGE_ACCOUNT_SVG,
      image: BAFT_CARD2_SVG,
      title: "Manage Account",
      description: "Control your finances with management tools and insights.",
    },
    {
      icon: null,
      customIcon: REWARDS_SVG,
      image: BAFT_CARD3_SVG,
      title: "Rewards",
      description: "Earn points and redeem them for rewards and benefits.",
    },
    {
      icon: null,
      customIcon: SEAMLESS_PAYMENTS_SVG,
      image: BAFT_CARD4_SVG,
      title: "Seamless Payments",
      description: "Send and receive coins instantly with just a few taps.",
    },
  ];

  // Global vertical offset to move all cards slightly down
  const CARD_Y_OFFSET = 40; // px

  const setOrAnimate = (card, props, immediate) => {
    if (immediate) {
      gsap.set(card, {
        ...props,
        // Safari-specific optimizations
        force3D: true,
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      });
    } else {
      // Reduced duration from 1.2s to 0.4s for faster transitions - Safari optimized
      gsap.to(card, { 
        ...props, 
        duration: 0.4, 
        ease: "power2.out", 
        overwrite: "auto",
        // Safari-specific optimizations
        force3D: true,
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      });
    }
  };

  const animateCardFall = (fallIndex) => {
    if (!cardsRef.current) return;
    const card = cardsRef.current.children[fallIndex];
    if (!card) return;

    gsap.to(card, {
      y: 400,
      opacity: 0,
      scale: 0.9,
      rotateZ: 15,
      zIndex: 5,
      duration: 0.4, // Reduced from 1.2s to 0.4s
      ease: "power2.out",
      // Safari-specific optimizations
      force3D: true,
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden'
    });
  };

  const updateCardPositions = (activeIndex, immediate = false) => {
    if (!cardsRef.current) return;

    const cardElements = Array.from(cardsRef.current.children);
    const totalCards = featuresData.length;

    cardElements.forEach((card, index) => {
      // Direct mapping: card index should match list item index exactly
      if (index === activeIndex) {
        // Current active card (should be visible on top, not falling)
        setOrAnimate(card, { 
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          top: "auto",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%) rotate(0deg)"
        }, immediate);
      } else if (index === (activeIndex + 1) % totalCards) {
        // Next card - slides up to become active
        setOrAnimate(card, { 
          x: 0,
          y: -50, // Decreased offset
          z: -50,
          scale: 0.9,
          opacity: 1,
          zIndex: 20,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          top: "auto",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%) rotate(0deg)"
        }, immediate);
      } else if (index === (activeIndex + 2) % totalCards) {
        // Third card - visible peek
        setOrAnimate(card, { 
          x: 0,
          y: -100, // Decreased offset
          z: -100,
          scale: 0.8,
          opacity: 1,
          zIndex: 10,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          top: "auto",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%) rotate(0deg)"
        }, immediate);
      } else {
        // Hide all other cards
        setOrAnimate(card, { 
          x: 0,
          y: 200, // Move far below to hide
          z: 0,
          scale: 0.7,
          opacity: 0,
          zIndex: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          top: "auto",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%) rotate(0deg)"
        }, immediate);
      }
    });
  };

  const stopAutoRotate = () => {
    if (rotateIntervalRef.current) {
      clearInterval(rotateIntervalRef.current);
      rotateIntervalRef.current = null;
    }
  };

  const startAutoRotate = () => {
    if (rotateIntervalRef.current) return;
    rotateIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuresData.length);
    }, 3000);
  };

  useLayoutEffect(() => {
    if (!cardsRef.current) return;

    // Instantly place cards on first paint to avoid initial bounce - Safari optimized
    // Ensure cards start with index 0 to match list item 0
    updateCardPositions(0, true);

    // Handle window resize for responsive updates - Safari optimized
    const handleResize = () => {
      // Safari-specific timing for resize handling
      requestAnimationFrame(() => {
        updateCardPositions(currentIndexRef.current, true);
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    startAutoRotate();

    return () => {
      stopAutoRotate();
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Module-level prefetch handles warming; no need for in-component effect

  // Keep positions in sync when index changes (hover/auto-rotate)
  useEffect(() => {
    const prevIndex = prevIndexRef.current;
    
    // Only animate fall if we're not on the initial load (prevIndex !== currentIndex)
    if (prevIndex !== currentIndex && prevIndexRef.current !== 0) {
      // Make the old active card fall
      animateCardFall(prevIndex);
    }
    
    // Bring new active card to front
    updateCardPositions(currentIndex, false);
    
    // Update refs
    prevIndexRef.current = currentIndex;
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  return (
    <div className="bg-white" data-theme="light">
      <section
        id="features"
        className="relative overflow-hidden py-8 sm:py-12 md:py-8"
        style={{
          marginTop: "clamp(0.5vh, 1vh, 2vh)",
          marginBottom: "0.1cm"
        }}
      >
        {/* Mobile/Tablet Layout - Stacked vertically */}
        <div 
          className="w-full max-w-4xl mx-auto flex flex-col gap-0 items-center px-4 sm:px-6 md:px-8 lg:px-12"
          style={{ 
            marginTop: "clamp(0.5rem, 1vh, 1rem)",
            minHeight: "calc(100vh - 100px)", // Account for navbar and padding
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >

          {/* Top Section - Features Text */}
           <div 
             className="flex flex-col items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] mx-auto text-left z-10"
             style={{
               display: "flex",
               flexDirection: "column",
               justifyContent: "center",
               alignItems: "flex-start",
               padding: "0px",
               width: "100%",
               maxWidth: "clamp(300px, 90%, 500px)",
               margin: "0 auto"
             }}
          >

            <p
              className="font-normal mb-3 sm:mb-4 flex items-center gap-2 justify-start"
              style={{
                width: "36px",
                height: "13px",
                transform: "rotate(-0.08deg)",
                opacity: 1,
                color: "#092646",
                marginBottom: "0.5cm"
              }}
            >
              <img src={SVG_SVG} alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
              Features
            </p>

            <h1
              className="leading-tight font-bold text-[#1966BB] text-left md:text-center lg:text-left"
              style={{ 
                width: "clamp(200px, 50vw, 500px)",
                height: "clamp(60px, 12vh, 100px)",
                transform: "rotate(-0.08deg)",
                opacity: 1,
                fontFamily: "EB Garamond",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "clamp(40px, 8vw, 70px)",
                lineHeight: "clamp(44px, 9vw, 74px)",
                letterSpacing: "-0.89px",
                verticalAlign: "middle",
                color: "#1966BB",
                margin: 0,
                padding: 0,
                marginBottom: "clamp(0.5rem, 1.5vh, 1rem)"
              }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <ul
              className="space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2"
              style={{ 
                cursor: "default", 
                marginBottom: "clamp(2rem, 4vh, 3rem)",
                width: "100%"
              }}
            >
              {featuresData.map((feature, index) => {
                const isActive = index === currentIndex;
                const IconComponent = feature.icon;

                return (
                  <li
                    key={index}
                    onMouseEnter={() => {
                      stopAutoRotate(); // Stop auto-rotation when hovering
                      setCurrentIndex(index);
                      // Update cards immediately when hovering
                      updateCardPositions(index, false);
                    }}
                    onMouseLeave={() => {
                      // Small delay before resuming auto-rotation for better UX
                      setTimeout(() => {
                        startAutoRotate(); // Resume auto-rotation when leaving
                      }, 500);
                    }}
                    onClick={() => {
                      // Pause rotation and focus on clicked card
                      stopAutoRotate();
                      // Cancel any pending resume timers
                      if (resumeTimeoutRef.current) {
                        clearTimeout(resumeTimeoutRef.current);
                        resumeTimeoutRef.current = null;
                      }
                      setCurrentIndex(index);
                      updateCardPositions(index, false);
                      // Resume after 3 seconds from current index
                      resumeTimeoutRef.current = setTimeout(() => {
                        startAutoRotate();
                        resumeTimeoutRef.current = null;
                      }, 3000);
                    }}
                    style={{
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                padding: isActive
                  ? "clamp(12px, 1.8vw, 24px) clamp(12px, 1.5vw, 22px)"
                  : "clamp(10px, 1.5vw, 20px) clamp(10px, 1.2vw, 18px)",
                gap: "clamp(8px, 1.5vw, 20px)",
                width: isActive ? "fit-content" : "100%",
                minHeight: "clamp(45px, 5vh, 80px)",
                      background: isActive ? "#FFFFFF" : "transparent",
                      border: isActive 
                        ? "1px solid rgba(22, 93, 172, 0.19)"
                        : "none",
                      borderRadius: "clamp(6px, 1vw, 12px)",
                      boxShadow: isActive ? "0px 2px 8px rgba(25, 102, 187, 0.1)" : "none",
                      flex: "none",
                      order: isActive ? 0 : 1,
                      flexGrow: 0,
                      transition: isActive ? "all 0.3s ease" : "none"
                    }}
                  >
                    {feature.customIcon ? (
                      <img 
                        src={feature.customIcon} 
                        alt={feature.title}
                        className="flex-shrink-0"
                        style={{
                          width: "clamp(18px, 2.5vw, 30px)",
                          height: "clamp(18px, 2.5vw, 30px)"
                        }}
                      />
                    ) : (
                      <IconComponent
                        className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl flex-shrink-0 ${
                          isActive ? "text-[#1966BB]" : "text-[#1966BB]" 
                        }`}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h6
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "clamp(12px, 1.8vw, 20px)",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#1966BB",
                          margin: 0
                        }}
                      >
                        {feature.title}
                      </h6>
                      <p
                        style={{
                          fontFamily: "Inter",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "clamp(10px, 1.4vw, 16px)",
                          lineHeight: "120%",
                          letterSpacing: "0%",
                          color: "#989898",
                          margin: 0,
                          marginTop: "clamp(6px, 1vh, 10px)"
                        }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Section - Phone Mockups (Horizontal Cylinder) - Safari optimized */}
          <div
            className="relative w-full flex items-end justify-center perspective-[1200px] mt-0"
            style={{ 
              willChange: "transform, opacity", 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              minHeight: "clamp(280px, 40vh, 450px)",
              maxHeight: "clamp(350px, 45vh, 550px)",
              paddingBottom: "clamp(6rem, 12vh, 10rem)",
              paddingTop: "clamp(-0.5rem, -1vh, -1rem)",
              overflow: "hidden",
              marginTop: "clamp(-0.5rem, -1vh, -1rem)",
              // Safari hardware acceleration
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)'
            }}
            ref={cardsRef}
          >
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center justify-center"
                style={{
                  width: "270px",
                  height: "281px",
                  top: "auto",
                  bottom: "0px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(0deg)",
                  opacity: 1,
                  transformOrigin: "center bottom",
                  WebkitTransformOrigin: "center bottom",
                  zIndex: 10,
                  // Safari hardware acceleration
                  WebkitTransform: 'translateX(-50%) translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  draggable={false}
                  style={{
                    // Safari image rendering optimizations
                    WebkitTransform: 'translateZ(0)',
                    transform: 'translateZ(0)',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    imageRendering: 'auto',
                    WebkitImageRendering: 'auto'
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Cards;
