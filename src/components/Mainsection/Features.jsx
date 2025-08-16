import React, { useEffect, useRef, useState } from 'react';
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from 'react-icons/fa';

// CardStack Component
const CardStack = ({ items, activeIndex, setActiveIndex }) => {
  const [isCardStackActive, setIsCardStackActive] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const accumulatedDelta = useRef(0);
  const scrollThreshold = 100; // Pixels of scroll needed to advance to next card

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;

      if (!isInView) return;

      // Check if we're in the card stack section
      if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5) {
        if (!isCardStackActive) {
          setIsCardStackActive(true);
          setScrollLocked(true);
        }

        // Prevent default scrolling when cards are active
        if (activeIndex < items.length - 1 || (e.deltaY < 0 && activeIndex > 0)) {
          e.preventDefault();
          
          // Accumulate scroll delta (considering direction)
          accumulatedDelta.current += Math.abs(e.deltaY);
          
          // Advance to next/previous card when threshold is reached
          if (accumulatedDelta.current >= scrollThreshold) {
            let nextIndex;
            
            if (e.deltaY > 0) {
              // Scrolling down - advance to next card
              nextIndex = Math.min(activeIndex + 1, items.length - 1);
            } else {
              // Scrolling up - go to previous card
              nextIndex = Math.max(activeIndex - 1, 0);
            }
            
            setActiveIndex(nextIndex);
            accumulatedDelta.current = 0;
            
            // If we've reached the last card and scrolling down, allow normal scrolling after a brief delay
            if (nextIndex === items.length - 1 && e.deltaY > 0) {
              setTimeout(() => {
                setScrollLocked(false);
                setIsCardStackActive(false);
              }, 500);
            }
          }
        }
      } else if (isCardStackActive && rect.bottom < window.innerHeight * 0.5) {
        // Reset when scrolled past the section
        setIsCardStackActive(false);
        setScrollLocked(false);
        setActiveIndex(0);
        accumulatedDelta.current = 0;
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      // Reset card stack when scrolling back up past the section
      if (rect.top > window.innerHeight) {
        setActiveIndex(0);
        setIsCardStackActive(false);
        setScrollLocked(false);
        accumulatedDelta.current = 0;
      }
    };

    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [items.length, activeIndex, isCardStackActive, setActiveIndex]);

  return (
    <div ref={containerRef} className="relative w-full h-[500px]">
      <div className="relative w-full h-full mx-auto" style={{ perspective: '1500px', perspectiveOrigin: 'center center' }}>
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, index) => {
  // Calculate position relative to active card
  const offsetFromActive = index - activeIndex;
  const isActive = index === activeIndex;

  // Show all cards but with different positioning
  let transform = '';
  let zIndex = items.length - Math.abs(offsetFromActive);
  let opacity = 1;

  if (isActive) {
    // Active card - front and center
    transform = 'translate(-50%, -50%) translateY(0px) scale(1)';
    zIndex = items.length + 10;
    opacity = 1;
  } else {
    // Stack cards behind with offset based on their distance from active card
    const stackOffset = Math.abs(offsetFromActive) * 8; // 8px offset per card
    const scaleDown = 1 - (Math.abs(offsetFromActive) * 0.03); // Slight scale reduction
    const yOffset = Math.abs(offsetFromActive) * 3; // Slight vertical offset
    
    transform = `translate(-50%, -50%) translateY(${yOffset}px) translateX(0px) scale(${scaleDown})`;
    
    // Position cards behind based on their order
    if (offsetFromActive > 0) {
      // Future cards - stack behind
      transform = `translate(-50%, -50%) translateY(${yOffset + stackOffset}px) translateX(0px) scale(${scaleDown})`;
    } else {
      // Past cards - also stack behind but less visible
      transform = `translate(-50%, -50%) translateY(${yOffset + stackOffset}px) translateX(0px) scale(${scaleDown})`;
      opacity = 0.7;
    }
  }

  return (
    <div
      key={item.id}
      ref={el => cardRefs.current[index] = el}
      className="absolute transition-all duration-500 ease-out"
      style={{
        width: '320px',
        height: '400px',
        top: '50%',
        left: '50%',
        transform,
        zIndex,
        opacity,
      }}
    >
      {/* Card with Image */}
      <div 
        className="w-full h-full rounded-2xl relative overflow-hidden"
        style={{
          boxShadow: isActive 
            ? '0 20px 40px rgba(0,0,0,0.25), 0 8px 16px rgba(0,0,0,0.1)' 
            : '0 8px 20px rgba(0,0,0,0.15)'
        }}
      >
        {/* Card Image */}
      <img 
        src={item.src}
        alt={item.alt}
          className="w-full h-full object-cover rounded-2xl" 
          style={{
            filter: isActive ? 'none' : 'brightness(0.8) saturate(0.9)',
          }}
        />
        
        {/* Card Content Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h3 className="font-bold text-xl drop-shadow-lg">{item.name}</h3>
          <p className="text-base opacity-90 drop-shadow-lg">{item.designation}</p>
        </div>
        
        {/* Debug info - remove this later */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 p-1 rounded text-xs text-white">
          Card {index}: {item.name}
        </div>
      </div>
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
  const [activeIndex, setActiveIndex] = useState(0);
  const featuresRef = useRef(null);

  // Combined data where cards and features match in order
  const featuresData = [
    {
      icon: FaCreditCard,
      title: "Pay Bills",
      description: "Sort your bills with automated payments and reminders.",
      card: {
        id: 1,
        src: "baft_card1.svg",
        alt: "Pay Bills Card",
        name: "Pay Bills",
        designation: "Automated Payments"
      }
    },
    {
      icon: FaUser,
      title: "Manage Account",
      description: "Control your finances with management tools and insights.",
      card: {
        id: 2,
        src: "baft_card2.svg", 
        alt: "Manage Account Card",
        name: "Manage Account", 
        designation: "Financial Control"
      }
    },
    {
      icon: FaGift,
      title: "Rewards", 
      description: "Earn points and redeem them for rewards and benefits.",
      card: {
        id: 3,
        src: "baft_card3.svg",
        alt: "Rewards Card",
        name: "Rewards",
        designation: "Earn & Redeem"
      }
    },
    {
      icon: FaShieldAlt,
      title: "Seamless Payments",
      description: "Send and receive coins instantly with just a few taps.",
      card: {
        id: 4,
        src: "baft_card4.svg",
        alt: "Seamless Payments Card",
        name: "Seamless Payments",
        designation: "Instant Transfers"
      }
    }
  ];

  // Extract cards data for the CardStack component
  const cardsData = featuresData.map(feature => feature.card);

  // No separate scroll effect needed as activeIndex is controlled by CardStack

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
                  const isActive = index === activeIndex;
                  
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
                          {feature.title} {isActive && `(Active: ${index})`}
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