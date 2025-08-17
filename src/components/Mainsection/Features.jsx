import React, { useEffect, useRef, useState } from 'react';
import { FaCreditCard, FaUser, FaGift, FaShieldAlt } from 'react-icons/fa';

// CardStack Component with integrated bounce animation
const CardStack = ({ items, activeIndex, setActiveIndex }) => {
  const containerRef = useRef(null);
  const isAnimating = useRef(false);
  const [animatingCard, setAnimatingCard] = useState(null);
  const [cardStates, setCardStates] = useState({});

  useEffect(() => {
    const handleWheel = (e) => {
      if (!containerRef.current || isAnimating.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      // Only activate when section is in view
      if (rect.top > window.innerHeight || rect.bottom < 0) return;

      // Prevent default scrolling
      e.preventDefault();
      
      // Set animation flag
      isAnimating.current = true;
      
      let nextIndex = activeIndex;
      
      if (e.deltaY > 0) {
        // Scrolling down - next card
        nextIndex = Math.min(activeIndex + 1, items.length - 1);
      } else {
        // Scrolling up - previous card
        nextIndex = Math.max(activeIndex - 1, 0);
      }
      
      if (nextIndex !== activeIndex) {
        // Calculate starting position for animation
        const targetCard = nextIndex;
        const offsetFromActive = targetCard - activeIndex;
        const stackOffset = Math.abs(offsetFromActive);
        
        // Set starting position variables for the animating card
        setCardStates(prev => ({
          ...prev,
          [targetCard]: {
            startY: stackOffset * 8,
            startZ: stackOffset * -50,
            startScale: 1 - (stackOffset * 0.08),
            startRotate: 0,
            isAnimating: true
          }
        }));
        
        setAnimatingCard(targetCard);
        setActiveIndex(nextIndex);
        
        // Reset animation state after completion
        setTimeout(() => {
          isAnimating.current = false;
          setAnimatingCard(null);
          setCardStates(prev => ({
            ...prev,
            [targetCard]: { ...prev[targetCard], isAnimating: false }
          }));
        }, 1500);
      } else {
        isAnimating.current = false;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [items.length, activeIndex, setActiveIndex]);

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes riseUpAndSlot {
          0% {
            transform: translate(-50%, -50%) translateY(var(--start-y)) translateZ(var(--start-z)) scale(var(--start-scale)) rotateX(var(--start-rotate));
          }
          20% {
            transform: translate(-50%, -50%) translateY(calc(var(--start-y) - 80px)) translateZ(var(--start-z)) scale(var(--start-scale)) rotateX(var(--start-rotate));
          }
          40% {
            transform: translate(-50%, -50%) translateY(-100px) translateZ(120px) scale(1.03) rotateX(-8deg);
          }
          65% {
            transform: translate(-50%, -50%) translateY(-15px) translateZ(25px) scale(1.04) rotateX(-3deg);
          }
          80% {
            transform: translate(-50%, -50%) translateY(6px) translateZ(-6px) scale(0.99) rotateX(1deg);
          }
          90% {
            transform: translate(-50%, -50%) translateY(-2px) translateZ(2px) scale(1.005) rotateX(-0.5deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) translateZ(0px) scale(1) rotateX(0deg);
          }
        }
      `}</style>

      <div ref={containerRef} className="relative w-full h-[600px]">
        <div className="relative w-full h-full mx-auto" style={{ perspective: '1500px', perspectiveOrigin: 'center center' }}>
          <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
            {items.map((item, index) => {
              // Calculate position relative to active card
              const offsetFromActive = index - activeIndex;
              const isActive = index === activeIndex;
              const isCurrentlyAnimating = animatingCard === index;
              const cardState = cardStates[index] || {};

              // Show all cards but with different positioning
              let transform = '';
              let zIndex = items.length - Math.abs(offsetFromActive);
              let opacity = 1;
              let scale = 1;
              let animationStyle = {};

              if (isCurrentlyAnimating) {
                // Apply bounce animation with smoother timing
                zIndex = items.length + 20;
                opacity = 1;
                animationStyle = {
                  animation: 'riseUpAndSlot 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  '--start-y': `${cardState.startY || 0}px`,
                  '--start-z': `${cardState.startZ || 0}px`,
                  '--start-scale': cardState.startScale || 1,
                  '--start-rotate': `${cardState.startRotate || 0}deg`
                };
              } else if (isActive) {
                // Active card - front and center
                transform = 'translate(-50%, -50%) translateY(0px) scale(1)';
                zIndex = items.length + 10;
                opacity = 1;
                scale = 1;
              } else {
                // Stack cards behind with smooth offset
                const stackOffset = Math.abs(offsetFromActive) * 15;
                const scaleDown = 1 - (Math.abs(offsetFromActive) * 0.08);
                const yOffset = Math.abs(offsetFromActive) * 8;
                
                if (offsetFromActive > 0) {
                  // Future cards - stack behind and slightly to the right
                  transform = `translate(-50%, -50%) translateY(${yOffset}px) translateX(${stackOffset * 0.3}px) scale(${scaleDown})`;
                  opacity = 0.8;
                } else {
                  // Past cards - stack behind and slightly to the left
                  transform = `translate(-50%, -50%) translateY(${yOffset}px) translateX(${-stackOffset * 0.3}px) scale(${scaleDown})`;
                  opacity = 0.6;
                }
                
                scale = scaleDown;
              }

              return (
                <div
                  key={item.id}
                  className={`absolute ${isCurrentlyAnimating ? '' : 'transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]'}`}
                  style={{
                    width: '320px',
                    height: '400px',
                    top: '50%',
                    left: '50%',
                    transform: isCurrentlyAnimating ? 'translate(-50%, -50%)' : transform,
                    zIndex,
                    opacity,
                    filter: isActive ? 'none' : 'brightness(0.9) saturate(0.8)',
                    ...animationStyle
                  }}
                >
                  {/* Your original card structure */}
                  <div 
                    className="w-full h-full rounded-2xl relative overflow-hidden"
                    style={{
                      boxShadow: isActive 
                        ? '0 25px 50px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.15)' 
                        : '0 8px 20px rgba(0,0,0,0.12)',
                      transform: `scale(${scale})`,
                      transition: isCurrentlyAnimating ? 'none' : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Your original Features component - unchanged
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

  return (
    <div className="min-h-screen bg-white">
      <section 
        ref={featuresRef}
        id="features" 
        data-theme="light" 
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12"
      >
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-3 flex items-center gap-2">
              <span className="text-xs">🔹</span> Features
            </p>
            <h1
              className="leading-none mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[rgba(25,102,187,1)]"
              style={{
                fontFamily: "EB Garamond, serif",
                lineHeight: 1.1,
              }}
            >
              <span className="block">All in</span>
              <span className="block">One Place</span>
            </h1>

            <div className="flex flex-col justify-center">
              <ul className="space-y-5 md:space-y-6 text-base md:text-lg">
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