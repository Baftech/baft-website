import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

// Updated ReadMoreText with animation
const ReadMoreText = ({ content, maxLength = 320, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef(null);

  const isLong = content.length > maxLength;

  // Split content into paragraphs
  const paragraphs = content
    .split(/\n+/)
    .map((para) => para.trim())
    .filter((para) => para.length > 0);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState);
  };

  useEffect(() => {
    if (contentRef.current) {
      if (isExpanded) {
        setMaxHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setMaxHeight("200px"); // collapsed preview height
      }
    }
  }, [isExpanded]);

  return (
    <div className="leading-relaxed pr-2">
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 1s ease, opacity 0.8s ease",
          opacity: isExpanded ? 1 : 0.9,
        }}
      >
        {paragraphs.map((para, i) => (
          <p
            key={i}
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#909090] mb-4 sm:mb-5 md:mb-6"
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            {para}
          </p>
        ))}
      </div>

      {isLong && (
        <button
          onClick={handleToggle}
          className="mt-2 transition-all duration-500 ease-out w-32 sm:w-36 md:w-40 lg:w-44 h-12 sm:h-14 md:h-16 text-sm sm:text-base"
          style={{
            fontFamily: "Inter, sans-serif",
            borderRadius: "200px",
            backgroundColor: "#E3EDFF",
            color: "#092646",
            border: "none",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#000000";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#E3EDFF";
            e.target.style.color = "#092646";
          }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

const InteractiveTeamImage = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState("full");
  const [activeImageId, setActiveImageId] = useState("full");
  const [loadedImages, setLoadedImages] = useState(
    new Set(["/Property 1=Image.png"])
  );
  const [imageError, setImageError] = useState(false);

  // Add debugging for component dimensions
  useEffect(() => {
    console.log('InteractiveTeamImage mounted');
    return () => console.log('InteractiveTeamImage unmounted');
  }, []);

  const teamMembers = React.useMemo(
    () => [
      {
        id: "vibha",
        name: "Vibha Harish",
        position: "Co-Founder, BaFT Technology",
        area: { x: "35%", y: "45%", width: "30%", height: "55%" },
        image: "/Property 1=Vibha Harish (1).png",
        textPosition: {
          left: "51%",
          bottom: "26%",
          transform: "translateX(-50%)",
        },
        animation: "center",
      },
      {
        id: "dion",
        name: "Dion Monteiro",
        position: "Co-Founder, BaFT Technology",
        area: { x: "5%", y: "20%", width: "35%", height: "70%" },
        image: "/Property 1=Dion Monteiro (1).png",
        textPosition: { left: "8%", bottom: "27%" },
        animation: "fade-right",
      },
      {
        id: "saket",
        name: "Saket Borkar",
        position: "Co-Founder, BaFT Technology",
        area: { x: "60%", y: "15%", width: "35%", height: "75%" },
        image: "/Property 1=Saket Borkar (1).png",
        textPosition: { right: "5%", bottom: "27%" },
        animation: "fade-left",
      },
    ],
    []
  );

  const cycleSequence = React.useMemo(
    () => ["full", "vibha", "dion", "saket"],
    []
  );

  // Preload images on component mount
  React.useEffect(() => {
    const imagesToPreload = teamMembers.map((member) => member.image);

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, src]));
        console.log('Image loaded:', src);
      };
      img.onerror = () => {
        console.error('Failed to load image:', src);
        setImageError(true);
      };
      img.src = src;
    });
  }, [teamMembers]);

  // Auto-cycling effect
  React.useEffect(() => {
    if (!isUserInteracting) {
      const interval = setInterval(() => {
        setAutoHighlight((current) => {
          const currentIndex = cycleSequence.findIndex((id) => id === current);
          const nextIndex = (currentIndex + 1) % cycleSequence.length;
          return cycleSequence[nextIndex];
        });
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isUserInteracting, cycleSequence]);

  // Image transition effect
  React.useEffect(() => {
    const activeMember = isUserInteracting ? hoveredMember : autoHighlight;
    setActiveImageId(activeMember || "full");
  }, [autoHighlight, hoveredMember, isUserInteracting]);

  const handleMouseEnterImage = () => {
    setIsUserInteracting(true);
  };

  const handleMouseLeaveImage = () => {
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
  };

  const handleMouseEnterMember = (memberId) => {
    setHoveredMember(memberId);
  };

  const getAnimationStyles = (member) => {
    if (!member) return {};

    const isHovered = isUserInteracting && hoveredMember === member.id;
    const isActive = !isUserInteracting && autoHighlight === member.id;
    const shouldShow = isHovered || isActive;

    switch (member.animation) {
      case "fade-right":
        return {
          name: {
            transform: shouldShow ? "translateX(0)" : "translateX(20px)",
            opacity: shouldShow ? 1 : 0,
            transition:
              "transform 0.6s ease-in-out 0.5s, opacity 0.6s ease-in-out 0.5s",
          },
          role: {
            transform: shouldShow ? "translateX(0)" : "translateX(0)",
            opacity: shouldShow ? 1 : 0,
            transition: "transform 1.2s ease-in-out, opacity 1.2s ease-in-out",
          },
        };
      case "fade-left":
        return {
          name: {
            transform: shouldShow ? "translateX(0)" : "translateX(-30px)",
            opacity: shouldShow ? 1 : 0,
            transition:
              "transform 0.6s ease-in-out 0.5s, opacity 0.6s ease-in-out 0.5s",
            textAlign: "right",
          },
          role: {
            transform: shouldShow ? "translateX(0)" : "translateX(0)",
            opacity: shouldShow ? 1 : 0,
            transition: "transform 1.2s ease-in-out, opacity 1.2s ease-in-out",
            textAlign: "right",
          },
        };
      case "center":
        return {
          name: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out 0.5s",
            textAlign: "center",
          },
          role: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 1.2s ease-in-out",
            textAlign: "center",
          },
        };
      default:
        return {
          name: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out",
          },
          role: {
            opacity: shouldShow ? 1 : 0,
            transition: "opacity 0.6s ease-in-out 0.1s",
          },
        };
    }
  };

  return (
    <div 
      className="relative bg-gray-100 w-full h-full" 
      style={{
        borderRadius: '24px',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        minHeight: '400px',
        minWidth: '300px'
      }}
    >
      {/* Main Image Container */}
      <div
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={{
          borderRadius: '24px'
        }}
        onMouseEnter={handleMouseEnterImage}
        onMouseLeave={handleMouseLeaveImage}
      >
        {/* Base Image - Full Team */}
        <img
          src="/Property 1=Image.png"
          alt="BaFT Team Full"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            objectPosition: "center center",
            opacity: activeImageId === "full" ? 1 : 0.999,
            transition: "opacity 1200ms ease-in-out",
            zIndex: 1,
          }}
          onLoad={() => console.log('Base image loaded successfully')}
          onError={(e) => {
            console.error('Base image failed to load:', e);
            setImageError(true);
          }}
        />

        {/* Individual Member Images */}
        {teamMembers.map((member) => {
          const isLoaded = loadedImages.has(member.image);
          const isActive = activeImageId === member.id;

          return (
            <img
              key={member.id}
              src={member.image}
              alt={`BaFT Team ${member.name}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{
                objectPosition: "center center",
                opacity: isActive && isLoaded ? 1 : 0,
                transition: "opacity 1200ms ease-in-out",
                zIndex: isActive ? 2 : 1,
                display: isLoaded ? "block" : "none",
              }}
              onLoad={() => {
                setLoadedImages((prev) => new Set([...prev, member.image]));
              }}
            />
          );
        })}

        {/* Text Overlays for all members */}
        {teamMembers.map((member) => {
          const memberAnimationStyles = getAnimationStyles(member);

          return (
            <div
              key={member.id}
              className="absolute z-30 pointer-events-none"
              style={{
                ...member.textPosition,
                maxWidth: '280px',
              }}
            >
              <div className="text-white">
                <h3
                  className="text-2xl font-bold leading-tight mb-2"
                  style={{
                    fontFamily: "EB Garamond, serif",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    ...memberAnimationStyles.name,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-lg leading-tight"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "150",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    ...memberAnimationStyles.role,
                  }}
                >
                  {member.position}
                </p>
              </div>
            </div>
          );
        })}

        {/* Invisible hover areas */}
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="absolute cursor-pointer z-20"
            style={{
              left: member.area.x,
              top: member.area.y,
              width: member.area.width,
              height: member.area.height,
            }}
            onMouseEnter={() => handleMouseEnterMember(member.id)}
          />
        ))}

        {/* Fallback display for debugging */}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-50">
            <div className="text-center">
              <p className="text-red-600 font-bold">Image Loading Error</p>
              <p className="text-red-500 text-sm">Check console for details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// AboutBaft with integrated scroll animation
const AboutBaft = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageRef = useRef(null);
  const triggerRef = useRef(null);

  // Check if screen is desktop size
  useEffect(() => {
    const checkScreenSize = () => {
      const newIsDesktop = window.innerWidth >= 1024; // lg breakpoint and above
      setIsDesktop(newIsDesktop);
      console.log('Screen size check:', { width: window.innerWidth, isDesktop: newIsDesktop });
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Log when component mounts and when isDesktop changes
  useEffect(() => {
    console.log('AboutBaft component mounted, isDesktop:', isDesktop);
    
    // Log component dimensions
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      console.log('AboutBaft section dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left
      });
    }
  }, [isDesktop]);

  // Add effect to log dimensions when mobile layout renders
  useEffect(() => {
    if (!isDesktop) {
      console.log('Mobile layout rendered');
      
      // Log after a short delay to ensure DOM is ready
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const rect = aboutSection.getBoundingClientRect();
          console.log('Mobile About section dimensions:', {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            visible: rect.width > 0 && rect.height > 0
          });
        }
        
        // Check for image container
        const imageContainer = document.querySelector('.about-image-container-mobile');
        if (imageContainer) {
          const rect = imageContainer.getBoundingClientRect();
          console.log('Image container dimensions:', {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            visible: rect.width > 0 && rect.height > 0
          });
        }
      }, 100);
    }
  }, [isDesktop]);

  // Simplified pin screen scroll animation for desktop
  useEffect(() => {
    if (!sectionRef.current || !isDesktop) return;

    const handleScroll = () => {
      if (!triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const triggerHeight = triggerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate progress based on trigger position
      if (triggerRect.top <= 0 && triggerRect.bottom > windowHeight) {
        // We're in the pinned zone
        const scrolledIntoTrigger = Math.abs(triggerRect.top);
        const totalScrollDistance = triggerHeight - windowHeight;
        const progress = Math.min(scrolledIntoTrigger / totalScrollDistance, 1);
        
        setScrollProgress(progress);
      } else if (triggerRect.top > 0) {
        // Before the trigger
        setScrollProgress(0);
      } else {
        // After the trigger
        setScrollProgress(1);
      }
    };

    // Use passive: false to allow preventDefault if needed
    window.addEventListener('scroll', handleScroll, { passive: false });
    handleScroll(); // Initialize
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  // Animation values - more responsive and smooth
  // Apply aggressive easing function for faster completion
  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
  const easedProgress = easeOutQuart(scrollProgress);
  
  const textTransform = easedProgress * -400; // More aggressive text movement
  const textOpacity = Math.max(1 - easedProgress * 3, 0); // Much faster fade out

  return (
    <>
             {/* Desktop scroll animation version */}
       {isDesktop && (
         <div ref={triggerRef} className="relative" style={{ height: '300vh' }}>
          <section
            id="about"
            ref={sectionRef}
            data-theme="light"
            className="sticky top-0 bg-white flex items-center justify-center"
            style={{ 
              height: '100vh',
              width: '100vw',
              overflow: 'hidden'
            }}
          >
            {easedProgress < 0.3 ? (
              // Initial state with text and image side by side
              <div className="w-full max-w-6xl mx-auto px-12 grid grid-cols-2 gap-20 items-center">
                <div
                  ref={textContainerRef}
                  className="flex flex-col justify-center"
                  style={{
                    transform: `translateX(${textTransform}px)`,
                    opacity: textOpacity,
                  }}
                >
                  <p
                    className="font-normal mb-2 flex items-center gap-2 text-xl"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "#092646",
                    }}
                  >
                    <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
                    Know our story
                  </p>
                  <h1
                    className="leading-tight mb-8 font-bold text-6xl text-[#1966BB]"
                    style={{
                      fontFamily: "EB Garamond, serif",
                    }}
                  >
                    <span className="block">About BaFT</span>
                  </h1>

                  <ReadMoreText
                    content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
                    onExpandChange={setIsExpanded}
                  />
                </div>

                <div className="flex justify-end">
                  <div style={{ width: '553px', height: '782px' }}>
                    <InteractiveTeamImage />
                  </div>
                </div>
              </div>
            ) : (
              // Expanded state - large centered image like reference
              <div 
                className="flex items-center justify-center w-full h-full"
                ref={imageRef}
                style={{
                  padding: '60px',
                }}
              >
                <div
                  style={{
                    width: `${553 + (easedProgress * (750))}px`, // Expands to ~1300px
                    height: `${782 + (easedProgress * (500))}px`, // Expands to ~1282px  
                    maxWidth: '80vw',
                    maxHeight: '80vh',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 40px 120px rgba(0,0,0,0.25)',
                    transition: 'all 0.1s ease-out',
                  }}
                >
                  <InteractiveTeamImage />
                </div>
              </div>
            )}

            
          </section>
        </div>
      )}

      {/* Mobile/Tablet version - Original Layout */}
      {!isDesktop && (
        <section
          id="about"
          data-theme="light"
          className="about-section-mobile bg-white"
          style={{ 
            minHeight: '100vh',
            width: '100%',
            position: 'relative'
          }}
        >
          <div className="about-grid-mobile">
            {/* Left Column */}
            <div
              className={`transition-all duration-1200 ease-in-out flex flex-col h-full ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
              style={{
                transform: `translateY(${isExpanded ? "-20px" : "0px"})`,
              }}
            >
              <p
                className="font-normal mb-2 flex items-center gap-2 transition-all duration-1200 ease-out text-sm sm:text-base md:text-lg lg:text-xl"
                style={{
                  fontFamily: "Inter, sans-serif",
                  color: "#092646",
                }}
              >
                <img src="/SVG.svg" alt="Icon" className="w-4 h-4 sm:w-5 sm:h-5" />
                Know our story
              </p>
              <h1
                className="leading-tight md:leading-none mb-3 sm:mb-4 md:mb-6 lg:mb-8 font-bold transition-all duration-1200 ease-out text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-[#1966BB]"
                style={{
                  fontFamily: "EB Garamond, serif",
                }}
              >
                <span className="block">About BaFT</span>
              </h1>

              <ReadMoreText
                content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
                onExpandChange={setIsExpanded}
              />
            </div>

            {/* Right Column - Fixed for mobile/tablet visibility */}
            <div className="about-image-container-mobile">
              <div className="debug-border debug-bg" style={{ width: '100%', height: '100%' }}>
                {/* Test image to verify layout */}
                <img 
                  src="/Property 1=Image.png" 
                  alt="Test Image" 
                  className="w-full h-full object-cover object-center rounded-3xl"
                  style={{ minHeight: '400px' }}
                  onLoad={() => console.log('Test image loaded successfully on mobile')}
                  onError={(e) => console.error('Test image failed to load on mobile:', e)}
                />
                {/* Original InteractiveTeamImage */}
                <div className="absolute inset-0">
                  <InteractiveTeamImage />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AboutBaft;