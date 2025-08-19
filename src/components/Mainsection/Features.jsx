// Features.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

/* ===========================
   CardStack Component
=========================== */
const CardStack = ({ items, activeIndex, setActiveIndex }) => {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current || isAnimating.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      e.preventDefault();
      isAnimating.current = true;

      let nextIndex = activeIndex;
      if (e.deltaY > 0) {
        nextIndex = Math.min(activeIndex + 1, items.length - 1);
      } else {
        nextIndex = Math.max(activeIndex - 1, 0);
      }

      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
        setTimeout(() => (isAnimating.current = false), 500);
      } else {
        isAnimating.current = false;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeIndex, items.length, setActiveIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center"
    >
      {items.map((item, index) => {
        const offset = index - activeIndex;
        const isActive = index === activeIndex;

        return (
          <motion.div
            key={item.id}
            initial={false}
            animate={{
              y: offset * 40,
              scale: isActive ? 1 : 0.92,
              opacity: Math.abs(offset) > 2 ? 0 : 1,
              zIndex: items.length - Math.abs(offset),
              filter: isActive ? "none" : "brightness(0.85) saturate(0.9)",
            }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <img
              src={item.src}
              alt={item.alt}
              className="w-full h-full object-contain"
            />
          </motion.div>
        );
      })}
    </div>
  );
};

/* ===========================
   Features Component
=========================== */
const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const featuresData = [
    {
      icon: FaCreditCard,
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders.",
      card: { id: 1, src: "baft_card1.svg", alt: "Pay Bills Card" },
    },
    {
      icon: FaUser,
      title: "Manage Account",
      description: "Control your finances with management tools and insights.",
      card: { id: 2, src: "baft_card2.svg", alt: "Manage Account Card" },
    },
    {
      icon: FaGift,
      title: "Rewards",
      description: "Earn points and redeem them for rewards and benefits.",
      card: { id: 3, src: "baft_card3.svg", alt: "Rewards Card" },
    },
    {
      icon: FaShieldAlt,
      title: "Seamless Payments",
      description: "Send and receive coins instantly with just a few taps.",
      card: { id: 4, src: "baft_card4.svg", alt: "Seamless Payments Card" },
    },
  ];

  const cardsData = featuresData.map((feature) => feature.card);

  return (
    <div className="min-h-screen bg-white">
      <section
        id="features"
        data-theme="light"
        className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-36 2xl:px-40 py-20 min-h-screen flex items-center justify-center"
      >
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Features List */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p
              className="font-normal mb-2 flex items-center gap-2 text-[20px] text-[#092646]"
              style={{ fontFamily: "Inter, sans-serif" }}
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
                const IconComponent = feature.icon;
                const isActive = index === activeIndex;

                return (
                  <li
                    key={index}
                    className={`flex items-start gap-3 md:gap-4 p-4 rounded-lg transition-all duration-500 cursor-pointer ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-blue-600 shadow-md transform scale-105"
                        : "border-l-4 border-transparent"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <IconComponent
                      className={`text-lg md:text-xl mt-1 flex-shrink-0 transition-colors duration-300 ${
                        isActive ? "text-[#1966BB]" : "text-[#1966BB]" 
                      }`}
                    />
                    <div>
                      <h6
                        className={`font-semibold text-sm md:text-base transition-colors duration-300 ${
                          isActive ? "text-[#1966BB]" : "text-gray-700"
                        }`}
                      >
                        {feature.title}
                      </h6>
                      <p
                        className={`text-sm md:text-base transition-colors duration-300 px-2 py-1 rounded ${
                          isActive ? " text-[#989898]" : " text-[#989898]"
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

          {/* Right Column - CardStack */}
          <div className="relative flex items-center justify-center w-full order-1 lg:order-2 lg:pl-8">
            <CardStack
              items={cardsData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
