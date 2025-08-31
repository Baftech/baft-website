import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";

const Cards = () => {
  const cardsRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef(null);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const overlayTimerRef = useRef(null);
  const currentIndexRef = useRef(0);
  const rotateIntervalRef = useRef(null);

  const featuresData = [
    {
      icon: null,
      customIcon: "/pay-bills.svg",
      image: "/baft_card1.svg",
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders.",
    },
    {
      icon: null,
      customIcon: "/manage-account.svg",
      image: "/baft_card2.svg",
      title: "Manage Accounts",
      description: "Control your finances with management tools and insights.",
    },
    {
      icon: null,
      customIcon: "/rewards.svg",
      image: "/baft_card3.svg",
      title: "Rewards",
      description: "Earn points and redeem them for rewards and benefits.",
    },
    {
      icon: null,
      customIcon: "/seamless-payments.svg",
      image: "/baft_card4.svg",
      title: "Seamless Payments",
      description: "Send and receive coins instantly with just a few taps.",
    },
  ];

  // Global vertical offset to move all cards slightly down
  const CARD_Y_OFFSET = 40; // px

  const setOrAnimate = (card, props, immediate) => {
    if (immediate) {
      gsap.set(card, props);
    } else {
      gsap.to(card, { ...props, duration: 1.2, ease: "power2.inOut", overwrite: "auto" });
    }
  };

  const updateCardPositions = (activeIndex, immediate = false) => {
    if (!cardsRef.current) return;

    const cardElements = Array.from(cardsRef.current.children);
    const totalCards = featuresData.length;

    // Simple card stack positioning - each card with small offset and progressive scaling
    cardElements.forEach((card, index) => {
      const isActive = index === activeIndex;
      
      if (isActive) {
        // Active card: animate from above with swiping down effect
        if (immediate) {
          // Immediate positioning for initial load
          setOrAnimate(card, { 
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            opacity: 1,
            zIndex: totalCards + 10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, true);
        } else {
          // Simple fall down motion - no z-axis changes
          setOrAnimate(card, { 
            x: 0,
            y: -50, // Start above for smooth fall
            z: 0, // Keep at same depth - no jumping
            scale: 0.9, // Start smaller for smooth scaling
            opacity: 1, // Start fully visible
            zIndex: totalCards + 10,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, false);
          
          // Smooth fall down to final position
          setTimeout(() => {
            setOrAnimate(card, { 
              x: 0,
              y: 0,
              z: 0, // Same depth - no movement
              scale: 1,
              opacity: 1,
              zIndex: totalCards + 10,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0
            }, false);
          }, 100);
        }
      } else {
        // Calculate position for simple card stack - ensure top to bottom flow
        let relativeIndex = index - activeIndex;
        if (relativeIndex > totalCards / 2) relativeIndex -= totalCards;
        if (relativeIndex < -totalCards / 2) relativeIndex += totalCards;
        
        // Simple stack positioning - ensure cards always fall from top to bottom
        const stackOffset = Math.abs(relativeIndex) * 25; // 25px offset for better visibility
        const stackScale = 1 - Math.abs(relativeIndex) * 0.08; // Progressive scaling like reference
        const stackOpacity = 1 - Math.abs(relativeIndex) * 0.15; // Progressive opacity like reference
        
        if (relativeIndex > 0) {
          // Cards after active: hide below (no bottom stack)
          setOrAnimate(card, { 
            x: 0,
            y: 100, // Move far below to hide
            z: 0,
            scale: 0.8,
            opacity: 0, // Hidden
            zIndex: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, immediate);
        } else if (relativeIndex === -1) {
          // Card that will become active next: positioned above to fall down
          setOrAnimate(card, { 
            x: 0,
            y: -40, // Position above to fall down
            z: 0, // Same depth - no jumping
            scale: 0.9, // Ready to scale up when falling
            opacity: 0.8, // Ready to become fully visible
            zIndex: totalCards - 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, immediate);
        } else if (relativeIndex === -2) {
          // Second card above: visible layer
          setOrAnimate(card, { 
            x: 0,
            y: -70, // Further above
            z: 0, // Same depth - no jumping
            scale: 0.85,
            opacity: 0.7,
            zIndex: totalCards - 2,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, immediate);
        } else if (relativeIndex === -3) {
          // Third card above: visible layer
          setOrAnimate(card, { 
            x: 0,
            y: -100, // Furthest above
            z: 0, // Same depth - no jumping
            scale: 0.8,
            opacity: 0.6,
            zIndex: totalCards - 3,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, immediate);
        } else {
          // Other cards: stack above with z-depth
          setOrAnimate(card, { 
            x: 0,
            y: -stackOffset,
            z: -Math.abs(relativeIndex) * 30,
            scale: stackScale,
            opacity: stackOpacity,
            zIndex: totalCards - Math.abs(relativeIndex),
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
          }, immediate);
        }
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

    // Instantly place cards on first paint to avoid initial bounce
    updateCardPositions(0, true);

    // Handle window resize for responsive updates
    const handleResize = () => {
      updateCardPositions(currentIndexRef.current, true);
    };

    window.addEventListener('resize', handleResize);
    startAutoRotate();

    return () => {
      stopAutoRotate();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keep positions in sync when index changes (hover/auto-rotate)
  useEffect(() => {
    currentIndexRef.current = currentIndex;
    updateCardPositions(currentIndex, false);
  }, [currentIndex]);

  // Scroll-in appearance for the whole section
  useEffect(() => {
    if (!sectionRef.current || hasAnimatedIn) return;

    const el = sectionRef.current;

    const findScrollParent = (node) => {
      let cur = node.parentElement;
      while (cur) {
        const style = window.getComputedStyle(cur);
        const overflowY = style.overflowY;
        const canScroll = cur.scrollHeight > cur.clientHeight;
        if ((overflowY === 'auto' || overflowY === 'scroll') && canScroll) return cur;
        cur = cur.parentElement;
      }
      return window;
    };

    const scrollParent = findScrollParent(el);

    const checkVisibility = () => {
      if (hasAnimatedIn) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const visible = rect.top < vh * 0.85 && rect.bottom > vh * 0.15;
      if (visible) {
        el.classList.remove('pre-enter');
        el.classList.add('animate-slideInFromBottom');
        setHasAnimatedIn(true);
        setOverlayActive(true);
        if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
        overlayTimerRef.current = setTimeout(() => {
          setOverlayActive(false);
        }, 1000);
        detach();
      }
    };

    const onScroll = () => checkVisibility();
    const onResize = () => checkVisibility();

    const attach = () => {
      if (scrollParent === window) {
        window.addEventListener('scroll', onScroll, { passive: true });
      } else {
        scrollParent.addEventListener('scroll', onScroll, { passive: true });
      }
      window.addEventListener('resize', onResize);
      // initial check
      requestAnimationFrame(checkVisibility);
    };

    const detach = () => {
      if (scrollParent === window) {
        window.removeEventListener('scroll', onScroll);
      } else if (scrollParent && scrollParent.removeEventListener) {
        scrollParent.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', onResize);
    };

    attach();
    return () => {
      detach();
      if (overlayTimerRef.current) clearTimeout(overlayTimerRef.current);
    };
  }, [hasAnimatedIn]);

  return (
    <div className="bg-white" data-theme="light">
                    <section
          id="features"
          className="relative overflow-hidden px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-8 pre-enter"
          style={{
            marginTop: "clamp(0.5vh, 1vh, 2vh)",
            marginLeft: "0.5cm",
            marginRight: "0.5cm",
            marginBottom: "0.1cm"
          }}
          ref={sectionRef}
        >
        {overlayActive && <div className="screen-reveal-overlay" />}
        
        {/* Mobile Layout - Stacked vertically */}
        <div 
          className="w-full max-w-4xl mx-auto flex flex-col gap-0 items-center"
          style={{ marginTop: "4rem" }}
        >

          {/* Top Section - Features Text */}
          <div 
            className="flex flex-col justify-start w-full text-left z-10"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "0px",
              width: "100%",
              maxWidth: "clamp(300px, 90%, 500px)"
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
              <img src="/SVG.svg" alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
              Features
            </p>

            <h1
              className="leading-tight font-bold text-[#1966BB] text-left"
              style={{ 
                width: "176.35px",
                height: "89px",
                transform: "rotate(-0.08deg)",
                opacity: 1,
                fontFamily: "EB Garamond",
                fontWeight: 700,
                fontStyle: "Bold",
                fontSize: "43.6px",
                lineHeight: "44.47px",
                letterSpacing: "-0.89px",
                verticalAlign: "middle",
                color: "#1966BB",
                margin: 0,
                padding: 0,
                marginBottom: "0.7cm"
              }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <ul
              className="space-y-1 sm:space-y-1.5 md:space-y-2"
              onMouseEnter={stopAutoRotate}
              onMouseLeave={startAutoRotate}
              style={{ 
                cursor: "default", 
                marginBottom: "0",
                width: "100%"
              }}
            >
              {featuresData.map((feature, index) => {
                const isActive = index === currentIndex;
                const IconComponent = feature.icon;

                return (
                  <li
                    key={index}
                    onMouseEnter={() => setCurrentIndex(index)}
                    style={{
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      padding: isActive 
                        ? "clamp(12px, 1.5vw, 20px) clamp(10px, 1.2vw, 14px)"
                        : "clamp(12px, 1.5vw, 20px) clamp(10px, 1.2vw, 14px)",
                      gap: "clamp(8px, 1vw, 14px)",
                      width: isActive ? "fit-content" : "100%",
                      minHeight: "clamp(50px, 5vh, 75px)",
                      background: isActive ? "#FFFFFF" : "transparent",
                      border: isActive 
                        ? "1px solid rgba(22, 93, 172, 0.19)"
                        : "none",
                      borderRadius: "clamp(8px, 1.2vw, 14px)",
                      boxShadow: isActive ? "0px 2px 8px rgba(25, 102, 187, 0.1)" : "none",
                      flex: "none",
                      order: isActive ? 0 : 1,
                      flexGrow: 0,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {feature.customIcon ? (
                      <img 
                        src={feature.customIcon} 
                        alt={feature.title}
                        className="flex-shrink-0"
                        style={{
                          width: "clamp(16px, 2vw, 24px)",
                          height: "clamp(16px, 2vw, 24px)"
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
                          fontSize: "clamp(12px, 1.3vw, 15px)",
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
                          fontSize: "clamp(10px, 1vw, 12px)",
                          lineHeight: "120%",
                          letterSpacing: "0%",
                          color: "#989898",
                          margin: 0,
                          marginTop: "clamp(8px, 1.2vw, 12px)"
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

                                {/* Bottom Section - Phone Mockups (Horizontal Cylinder) */}
            <div
              className="relative w-full flex items-end justify-center perspective-[1200px] mt-0"
              style={{ 
                willChange: "transform, opacity", 
                backfaceVisibility: "hidden", 
                transformStyle: "preserve-3d",
                minHeight: "600px",
                paddingBottom: "7rem",
                paddingTop: "0",
                overflow: "hidden",
                marginTop: "-2rem"
              }}
              ref={cardsRef}
            >
                                                                                                       {featuresData.map((feature, index) => (
                 <div
                   key={index}
                   className="absolute flex flex-col items-center justify-center"
                   style={{
                     width: "clamp(350px, 85vw, 500px)",
                     height: "clamp(450px, 90vw, 600px)"
                   }}
                 >
                   <img
                     src={feature.image}
                     alt={feature.title}
                     className="w-full h-full object-contain"
                     loading="eager"
                     decoding="async"
                     fetchPriority="high"
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
