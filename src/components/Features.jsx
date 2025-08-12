import React, { useEffect, useRef, useState } from 'react';
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from 'react-icons/fa';

// CardStack Component
const CardStack = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + containerHeight)));
      
      // Calculate which card should be active based on scroll progress
      const newActiveIndex = Math.min(items.length - 1, Math.floor(scrollProgress * items.length * 1.5));
      setActiveIndex(newActiveIndex);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items.length]);

  return (
    <div ref={containerRef} className="relative w-full h-96">
      <div className="relative w-80 h-80 mx-auto" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0 flex items-end justify-center"
             style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const isFuture = index > activeIndex;

            // Calculate transform based on position
            let transform = '';
            let zIndex = items.length - index;
            let opacity = 1;

            if (isFuture) {
              // Cards behind - completely hidden in stationary position
              const offsetY = (index - activeIndex) * 8; 
              const offsetX = (index - activeIndex) * 4; 
              transform = `translate(${offsetX}px, ${offsetY}px) scale(${0.98 - (index - activeIndex) * 0.02})`;
              opacity = 0; // Hidden when not active
              zIndex = items.length - index;
            } else if (isActive) {
              // Active card - 4-stage animation: back → up → forward → front of stack
              // This creates the complete arc movement
              transform = 'translate(0px, -80px) scale(1.1) translateZ(50px)';
              zIndex = items.length + 20;
              opacity = 1;
            } else {
              // Past cards - settled in front of stack
              const frontOffset = (activeIndex - index) * 4;
              transform = `translate(-${frontOffset}px, 0px) scale(1)`;
              opacity = 0.95;
              zIndex = items.length + index;
            }

            return (
              <div
                key={item.id}
                ref={el => cardRefs.current[index] = el}
                className="absolute transition-all duration-1200 ease-out w-72 h-48"
                style={{
                  transform,
                  zIndex,
                  opacity,
                  bottom: '20px',
                  transformStyle: 'preserve-3d' 
                }}
              >
                <img 
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover rounded-2xl shadow-lg" 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Main Features Component
const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef(null);

  const cardsData = [
    {
      id: 1,
      src: "card1.svg",
      alt: "Card 1",
      name: "BAFT Card 1",
      designation: "Premium Design"
    },
    {
      id: 2,
      src: "card2.svg", 
      alt: "Card 2",
      name: "BAFT Card 2", 
      designation: "Secure Payment"
    },
    {
      id: 3,
      src: "card3.svg",
      alt: "Card 3",
      name: "BAFT Card 3",
      designation: "Instant Transfer"
    },
    {
      id: 4,
      src: "card4.svg",
      alt: "Card 4",
      name: "BAFT Card 4",
      designation: "Global Access"
    }
  ];

  const featuresData = [
    {
      icon: FaCreditCard,
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders."
    },
    {
      icon: FaUser,
      title: "Manage Account",
      description: "Control your finances with management tools and insights."
    },
    {
      icon: FaGift,
      title: "Rewards", 
      description: "Earn points and redeem them for rewards and benefits."
    },
    {
      icon: FaShieldAlt,
      title: "Seamless Payments",
      description: "Send and receive coins instantly with just a few taps."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!featuresRef.current) return;

      const rect = featuresRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + containerHeight)));
      
    
      const newActiveFeature = Math.min(featuresData.length - 1, Math.floor(scrollProgress * featuresData.length * 1.5));
      setActiveFeature(newActiveFeature);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [featuresData.length]);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <section 
        ref={featuresRef}
        id="features" 
        data-theme="light" 
        className="bg-white min-h-screen flex items-center justify-center"
      >
        <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
          {/* Left Column */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-2 flex items-center gap-2">
              <span className="text-xs">🔹</span> Features
            </p>
            <h1
              className="leading-none mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[rgba(25,102,187,1)]"
              style={{
                fontFamily: "EB Garamond, serif",
                lineHeight: 1.1,
              }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <div className="flex flex-col justify-center">
              <ul className="space-y-4 md:space-y-6 lg:space-y-8 text-sm md:text-base">
                {featuresData.map((feature, index) => {
                  const IconComponent = feature.icon;
                  const isActive = index === activeFeature;
                  
                  return (
                    <li 
                      key={index}
                      className={`flex items-start gap-3 md:gap-4 p-4 rounded-lg transition-all duration-500 ${
                        isActive 
                          ? 'bg-blue-50 border-l-4 border-[rgba(25,102,187,1)] shadow-md transform scale-105' 
                          : 'bg-transparent border-l-4 border-transparent'
                      }`}
                    >
                      <IconComponent 
                        className={`text-lg md:text-xl mt-1 flex-shrink-0 transition-colors duration-300 ${
                          isActive ? 'text-[rgba(25,102,187,1)]' : 'text-gray-400'
                        }`} 
                      />
                      <div>
                        <h6 className={`font-semibold text-sm md:text-base transition-colors duration-300 ${
                          isActive ? 'text-[rgba(25,102,187,1)]' : 'text-gray-700'
                        }`}>
                          {feature.title}
                        </h6>
                        <p className={`text-sm md:text-base transition-colors duration-300 ${
                          isActive ? 'text-[rgba(25,102,187,1)]' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          {/* Right Column: CardStack */}
          <div className="relative flex items-center justify-center w-full order-1 lg:order-2">
            <CardStack items={cardsData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;