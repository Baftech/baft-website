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
      gsap.to(card, { ...props, duration: 0.8, ease: "power3.out", overwrite: "auto" });
    }
  };

  const updateCardPositions = (activeIndex, immediate = false) => {
    if (!cardsRef.current) return;

    const cardElements = Array.from(cardsRef.current.children);
    const totalCards = featuresData.length;

    // Get screen width for responsive positioning
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth < 768;
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isSmallDesktop = screenWidth >= 1024 && screenWidth < 1280;
    const isMediumDesktop = screenWidth >= 1280 && screenWidth < 1536;
    const isLargeDesktop = screenWidth >= 1536;

    cardElements.forEach((card, index) => {
      if (isMobile) {
        // Mobile: Stack cards vertically with minimal spacing
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else {
          setOrAnimate(card, { x: 0, y: index < activeIndex ? CARD_Y_OFFSET - 20 : CARD_Y_OFFSET + 20, z: -20, scale: 0.9, opacity: 0.7, rotateY: 0, zIndex: 5 }, immediate);
        }
      } else if (isTablet) {
        // Tablet: Reduced horizontal spacing
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -40, y: CARD_Y_OFFSET, z: -40, scale: 0.9, opacity: 0.8, rotateY: 15, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 40, y: CARD_Y_OFFSET, z: -40, scale: 0.9, opacity: 0.8, rotateY: -15, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -80 : 80, y: CARD_Y_OFFSET, z: -60, scale: 0.75, opacity: 0.6, rotateY: index < activeIndex ? 20 : -20, zIndex: 7 }, immediate);
        }
      } else if (isSmallDesktop) {
        // Small Desktop (1024px - 1279px): Moderate 3D carousel
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -60, y: CARD_Y_OFFSET, z: -60, scale: 0.9, opacity: 0.8, rotateY: 15, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 60, y: CARD_Y_OFFSET, z: -60, scale: 0.9, opacity: 0.8, rotateY: -15, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -120 : 120, y: CARD_Y_OFFSET, z: -90, scale: 0.8, opacity: 0.6, rotateY: index < activeIndex ? 25 : -25, zIndex: 7 }, immediate);
        }
      } else if (isMediumDesktop) {
        // Medium Desktop (1280px - 1535px): Enhanced 3D carousel
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -80, y: CARD_Y_OFFSET, z: -80, scale: 0.85, opacity: 0.8, rotateY: 20, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 80, y: CARD_Y_OFFSET, z: -80, scale: 0.9, opacity: 0.8, rotateY: -15, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -160 : 160, y: CARD_Y_OFFSET, z: -120, scale: 0.75, opacity: 0.6, rotateY: index < activeIndex ? 30 : -30, zIndex: 7 }, immediate);
        }
      } else {
        // Large Desktop (1536px+): Full 3D carousel effect
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -100, y: CARD_Y_OFFSET, z: -100, scale: 0.8, opacity: 0.8, rotateY: 25, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 100, y: CARD_Y_OFFSET, z: -100, scale: 0.85, opacity: 0.8, rotateY: -20, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -200 : 200, y: CARD_Y_OFFSET, z: -150, scale: 0.7, opacity: 0.5, rotateY: index < activeIndex ? 35 : -35, zIndex: 7 }, immediate);
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
        className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28 pre-enter"
        style={{
          marginTop: "clamp(4vh, 8vh, 12vh)",
          marginLeft: "1cm",
          marginRight: "1cm"
        }}
        ref={sectionRef}
      >
        {overlayActive && <div className="screen-reveal-overlay" />}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 2xl:gap-24 items-start lg:items-center">

          {/* Left Column - Features Text */}
          <div 
            className="flex flex-col justify-start w-full lg:w-auto order-2 lg:order-1 z-10"
            style={{
              /* Container */
              /* Auto layout */
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              padding: "0px",
              width: "clamp(400px, 60vw, 757.63px)",
              height: "clamp(600px, 80vh, 1023.77px)",
              transform: "rotate(0.08deg)",
              /* Inside auto layout */
              flex: "none",
              order: 0,
              flexGrow: 1
            }}
          >
            <p
              className="font-normal mb-3 sm:mb-4 lg:mb-5 xl:mb-6 flex items-center gap-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(16px, 4vw, 20px)",
                color: "#092646",
              }}
            >
              <img src="/SVG.svg" alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              Features
            </p>

            <h1
              className="leading-tight mb-6 sm:mb-8 lg:mb-10 xl:mb-12 font-bold text-[#1966BB]"
              style={{ 
                fontFamily: "EB Garamond, serif",
                fontSize: "clamp(32px, 7vw, 96px)",
                lineHeight: "clamp(36px, 7.5vw, 100px)",
                margin: 0,
                padding: 0
              }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

                          <ul
                className="space-y-1 sm:space-y-1 md:space-y-1 lg:space-y-2 xl:space-y-2 2xl:space-y-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
                onMouseEnter={stopAutoRotate}
                onMouseLeave={startAutoRotate}
                style={{ cursor: "default", marginBottom: "0.5cm" }}
              >
              {featuresData.map((feature, index) => {
                const isActive = index === currentIndex;
                const IconComponent = feature.icon;

                return (
                  <li
                    key={index}
                    onMouseEnter={() => setCurrentIndex(index)}
                    style={{
                      /* Frame 1171276245 (Active) / Frame 1171276246 (Inactive) */
                      boxSizing: "border-box",
                      /* Auto layout */
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      padding: isActive 
                        ? "clamp(16px, 2vw, 24px) clamp(12px, 1.5vw, 16px)"
                        : "clamp(16px, 2vw, 24px) clamp(12px, 1.5vw, 16px)",
                      gap: "clamp(12px, 1.5vw, 16px)",
                      width: "100%",
                      minHeight: "clamp(70px, 6vh, 91px)",
                      background: isActive ? "#FFFFFF" : "transparent",
                      border: isActive 
                        ? "1px solid rgba(22, 93, 172, 0.19)"
                        : "none",
                      borderRadius: "clamp(12px, 1.5vw, 16px)",
                      boxShadow: isActive ? "0px 2px 8px rgba(25, 102, 187, 0.1)" : "none",
                      /* Inside auto layout */
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
                          width: "clamp(20px, 2.5vw, 30px)",
                          height: "clamp(20px, 2.5vw, 30px)"
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
                          fontSize: "clamp(14px, 1.5vw, 17.8px)",
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
                          fontSize: "clamp(12px, 1.2vw, 14px)",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#989898",
                          margin: 0,
                          marginTop: "clamp(6px, 1vw, 12px)"
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

          {/* Right Column - Phone Mockups (Positioned Below on Mobile) */}
          <div
            className="relative w-full flex items-center justify-center lg:justify-end perspective-[1200px] order-1 lg:order-2 mt-20 lg:mt-0"
            style={{ 
              willChange: "transform, opacity", 
              backfaceVisibility: "hidden", 
              transformStyle: "preserve-3d" 
            }}
            ref={cardsRef}
          >
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="absolute w-[16rem] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] xl:w-[32rem] 2xl:w-[36rem] flex flex-col items-center justify-center scale-100 sm:scale-110 md:scale-125 lg:scale-150 xl:scale-175 2xl:scale-200"
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