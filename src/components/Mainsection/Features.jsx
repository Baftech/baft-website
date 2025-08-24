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
      icon: FaCreditCard,
      image: "/baft_card1.svg",
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders.",
    },
    {
      icon: FaUser,
      image: "/baft_card2.svg",
      title: "Manage Account",
      description: "Control your finances with management tools and insights.",
    },
    {
      icon: FaGift,
      image: "/baft_card3.svg",
      title: "Rewards",
      description: "Earn points and redeem them for rewards and benefits.",
    },
    {
      icon: FaShieldAlt,
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
      } else {
        // Desktop: Full 3D carousel effect
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, y: CARD_Y_OFFSET, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -80, y: CARD_Y_OFFSET, z: -80, scale: 0.85, opacity: 0.8, rotateY: 20, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 80, y: CARD_Y_OFFSET, z: -80, scale: 0.9, opacity: 0.8, rotateY: -15, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -160 : 160, y: CARD_Y_OFFSET, z: -120, scale: 0.75, opacity: 0.6, rotateY: index < activeIndex ? 30 : -30, zIndex: 7 }, immediate);
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
        className="relative overflow-hidden px-4 sm:px-6 md:px-12 lg:px-24 py-12 sm:py-16 lg:py-20 pre-enter"
        ref={sectionRef}
      >
        {overlayActive && <div className="screen-reveal-overlay" />}
        <div className="w-full max-w-7xl flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start lg:items-center">

          {/* Left Column - Features Text */}
          <div className="flex flex-col justify-start w-full lg:w-auto order-2 lg:order-1 z-10">
            <p
              className="font-normal mb-3 sm:mb-4 flex items-center gap-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(16px, 4vw, 20px)",
                color: "#092646",
              }}
            >
              <img src="/SVG.svg" alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
              Features
            </p>

            <h1
              className="leading-tight mb-6 sm:mb-8 font-bold text-[28px] sm:text-[34px] md:text-[44px] lg:text-[54px] xl:text-[64px] text-[#1966BB]"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <ul
              className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-6 text-sm sm:text-base md:text-lg"
              onMouseEnter={stopAutoRotate}
              onMouseLeave={startAutoRotate}
            >
              {featuresData.map((feature, index) => {
                const isActive = index === currentIndex;
                const IconComponent = feature.icon;

                return (
                  <li
                    key={index}
                    className={`feature-item flex items-center gap-3 sm:gap-4 p-4 rounded-lg transition-all duration-500 ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-[#1966BB] shadow-sm"
                        : "bg-transparent border-l-4 border-transparent"
                    }`}
                    onMouseEnter={() => setCurrentIndex(index)}
                  >
                    <IconComponent
                      className={`text-xl sm:text-2xl flex-shrink-0 ${
                        isActive ? "text-[#1966BB]" : "text-[#1966BB]" 
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h6
                        className={`font-semibold text-sm sm:text-base ${
                          isActive ? "text-[#1966BB]" : "text-[#092646]"
                        }`}
                      >
                        {feature.title}
                      </h6>
                      <p
                        className={`text-xs sm:text-sm ${
                          isActive ? "text-[#1966BB]/90" : "text-gray-600"
                        }`}
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
                className="absolute w-[16rem] sm:w-[20rem] md:w-[24rem] lg:w-[28rem] xl:w-[32rem] flex flex-col items-center justify-center scale-100 sm:scale-110 md:scale-125 lg:scale-150"
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