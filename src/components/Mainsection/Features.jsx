import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";

const Cards = () => {
  const cardsRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  useLayoutEffect(() => {
    if (!cardsRef.current) return;

    const cardElements = gsap.utils.toArray(cardsRef.current.children);
    const totalCards = featuresData.length;
    let totalRotation = 0;
    const anglePerCard = 360 / totalCards;
    const setOrAnimate = (card, props, immediate) => {
      if (immediate) {
        gsap.set(card, props);
      } else {
        gsap.to(card, { ...props, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      }
    };
    const updateCardPositions = (activeIndex, immediate = false) => {
      cardElements.forEach((card, index) => {
        if (index === activeIndex) {
          setOrAnimate(card, { x: 0, z: 0, scale: 1, opacity: 1, rotateY: 0, zIndex: 10 }, immediate);
        } else if (index === (activeIndex - 1 + totalCards) % totalCards) {
          setOrAnimate(card, { x: -80, z: -80, scale: 0.85, opacity: 0.8, rotateY: 20, zIndex: 9 }, immediate);
        } else if (index === (activeIndex + 1) % totalCards) {
          setOrAnimate(card, { x: 80, z: -80, scale: 0.85, opacity: 0.8, rotateY: -20, zIndex: 9 }, immediate);
        } else {
          setOrAnimate(card, { x: index < activeIndex ? -160 : 160, z: -120, scale: 0.7, opacity: 0.6, rotateY: index < activeIndex ? 30 : -30, zIndex: 7 }, immediate);
        }
      });
    };

    // Instantly place cards on first paint to avoid initial bounce
    updateCardPositions(0, true);

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % totalCards;
      setCurrentIndex(i);
      updateCardPositions(i, false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="h-screen bg-white" data-theme="features">
      <section
        id="features"
        className="px-6 lg:px-24 h-screen flex items-center justify-center"
      >
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p
              className="font-normal mb-2 flex items-center gap-2"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "20px",
                color: "#092646",
              }}
            >
              <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
              Features
            </p>

            <h1
              className="leading-tight mb-6 font-bold text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
              style={{ fontFamily: "EB Garamond, serif" }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <ul className="space-y-5 md:space-y-6 text-base md:text-lg">
              {featuresData.map((feature, index) => {
                const isActive = index === currentIndex;
                const IconComponent = feature.icon;

                return (
                  <li
                    key={index}
                    className={`feature-item flex items-center gap-3 md:gap-4 p-4 rounded-lg transition-all duration-500 ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-[#1966BB] shadow-sm"
                        : "bg-transparent border-l-4 border-transparent"
                    }`}
                  >
                    <IconComponent
                      className={`text-2xl ${
                        isActive ? "text-[#1966BB]" : "text-[#1966BB]" 
                      }`}
                    />
                    <div>
                      <h6
                        className={`font-semibold text-base ${
                          isActive ? "text-[#1966BB]" : "text-[#092646]"
                        }`}
                      >
                        {feature.title}
                      </h6>
                      <p
                        className={`text-sm ${
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

         {/* Right Column - Horizontal Cylinder */}
<div
  className="relative w-full flex items-center justify-end perspective-[1200px] order-1 lg:order-2"
  style={{ marginTop: "100px", willChange: "transform, opacity", backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
  ref={cardsRef}
>

  {featuresData.map((feature, index) => (
   <div
  key={index}
  className="absolute w-[32rem] flex flex-col items-center justify-center scale-150"
  
>
  <img
    src={feature.image}
    alt={feature.title}
    className="w-full h-full object-fill"
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