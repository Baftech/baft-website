import React, { useState, useRef, useEffect } from "react";
import "./About.css";

// Simplified ReadMoreText for mobile
const ReadMoreText = ({ content, maxLength = 200, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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

  return (
    <div className="leading-relaxed">
                     <div
          ref={contentRef}
          style={{
            height: isExpanded ? "auto" : "clamp(180px, 32vw, 260px)",
            overflow: "hidden",
            transition: "height 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
                 {paragraphs.map((para, i) => (
           <p
             key={i}
             className={i === paragraphs.length - 1 ? "mb-0" : "mb-2"}
             style={{
               fontFamily: "Inter, sans-serif",
               fontWeight: "400",
               fontStyle: "normal",
               fontSize: "clamp(10px, 2.8vw, 12.38px)",
               lineHeight: "147%",
               letterSpacing: "0px",
               verticalAlign: "middle",
               color: "#909090",
               width: "clamp(250px, 80vw, 326.1158447265625px)",
               opacity: 1,
             }}
           >
             {para}
           </p>
         ))}
      </div>

              {isLong && (
          <div 
            className="button-container"
            style={{
              transform: isExpanded ? "translateY(0)" : "translateY(0)",
              transition: "all 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <button
              onClick={handleToggle}
              className="mt-3 reveal-button"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: "400",
                fontStyle: "normal",
                borderRadius: "200px",
                backgroundColor: "#E3EDFF",
                color: "#092646",
                border: "none",
                cursor: "pointer",
                width: "clamp(70px, 20vw, 140px)",
                height: "clamp(28px, 7vw, 44px)",
                fontSize: "clamp(9px, 2.5vw, 13px)",
                lineHeight: "clamp(12px, 3vw, 16px)",
                letterSpacing: "0px",
                verticalAlign: "middle",
                opacity: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "all 3.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onTouchStart={(e) => {
                e.target.style.backgroundColor = "#000000";
                e.target.style.color = "#ffffff";
                e.target.style.transform = "scale(0.95)";
              }}
              onTouchEnd={(e) => {
                e.target.style.backgroundColor = "#E3EDFF";
                e.target.style.color = "#092646";
                e.target.style.transform = "scale(1)";
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
        )}
    </div>
  );
};

// Use the same InteractiveTeamImage component from About.jsx
const InteractiveTeamImage = ({ disabled = false }) => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState("full");
  const [activeImageId, setActiveImageId] = useState("full");
  const [loadedImages, setLoadedImages] = useState(
    new Set(["/Property 1=Image.png"])
  );

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
      };
      img.src = src;
    });
  }, [teamMembers]);

  // Auto-cycling effect (paused when disabled)
  React.useEffect(() => {
    if (!isUserInteracting && !disabled) {
      const interval = setInterval(() => {
        setAutoHighlight((current) => {
          const currentIndex = cycleSequence.findIndex((id) => id === current);
          const nextIndex = (currentIndex + 1) % cycleSequence.length;
          return cycleSequence[nextIndex];
        });
      }, 2500);
      return () => clearInterval(interval);
    } else {
      // Ensure stable state when disabled or interacting
      setAutoHighlight('full');
    }
  }, [isUserInteracting, disabled, cycleSequence]);

  // Image transition effect (force full when disabled)
  React.useEffect(() => {
    if (disabled) {
      setActiveImageId('full');
      return;
    }
    const activeMember = isUserInteracting ? hoveredMember : autoHighlight;
    setActiveImageId(activeMember || "full");
  }, [autoHighlight, hoveredMember, isUserInteracting, disabled]);

  // Reset interaction state when disabled toggles on
  React.useEffect(() => {
    if (disabled) {
      setHoveredMember(null);
      setIsUserInteracting(false);
    }
  }, [disabled]);

  const handleMouseEnterImage = () => {
    if (disabled) return;
    setIsUserInteracting(true);
  };

  const handleMouseLeaveImage = () => {
    if (disabled) return;
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
  };

  const handleMouseEnterMember = (memberId) => {
    if (disabled) return;
    setHoveredMember(memberId);
  };

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    if (disabled) return;
    setIsUserInteracting(true);
  };

  const handleTouchEnd = (e) => {
    if (disabled) return;
    setHoveredMember(null);
    setIsUserInteracting(false);
    setAutoHighlight("full");
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
        borderRadius: 'inherit',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {/* Main Image Container */}
      <div
        className="relative w-full h-full overflow-hidden bg-gray-100"
        style={{
          borderRadius: 'inherit',
          pointerEvents: disabled ? 'none' : 'auto'
        }}
        onMouseEnter={disabled ? undefined : handleMouseEnterImage}
        onMouseLeave={disabled ? undefined : handleMouseLeaveImage}
        onTouchStart={disabled ? undefined : handleTouchStart}
        onTouchEnd={disabled ? undefined : handleTouchEnd}
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
          onLoad={() => {}}
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
        {!disabled && teamMembers.map((member) => (
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
            onTouchStart={() => handleMouseEnterMember(member.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Main mobile component
const AboutMobile = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="about"
      data-theme="light"
      className={`about-section-mobile bg-white ${isExpanded ? 'expanded' : ''}`}
      style={{ 
        minHeight: '100vh',
        width: '100%',
        position: 'relative'
      }}
    >
      <div className="about-grid-mobile">
        {/* Content Column */}
                  <div
            className={`content-column transition-all duration-500 ease-in-out flex flex-col h-full ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
            style={{
              padding: "clamp(16px, 4vw, 32px)",
              paddingTop: "clamp(24px, 6vw, 48px)",
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "white",
              marginBottom: isExpanded ? "0.5rem" : "0",
            }}
          >
          <p
            className="font-normal mb-2 flex items-center gap-2 transition-all duration-500 ease-out"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: "400",
              fontStyle: "normal",
              fontSize: "clamp(8px, 2.5vw, 12px)",
              lineHeight: "clamp(8px, 2.5vw, 12px)",
              letterSpacing: "-0.14px",
              verticalAlign: "middle",
              color: "#092646",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: 1,
            }}
          >
            <img 
              src="/SVG.svg" 
              alt="Icon" 
              style={{
                width: "clamp(8px, 2.5vw, 12px)",
                height: "clamp(8px, 2.5vw, 12px)",
                transform: "rotate(-0.08deg)",
                opacity: 1,
                flexShrink: 0,
              }}
            />
            <span style={{ whiteSpace: "nowrap" }}>Know our story</span>
          </p>
          
          <h1
            className="leading-tight mb-3 sm:mb-4 transition-all duration-500 ease-out"
            style={{
              fontFamily: "EB Garamond, serif",
              fontWeight: "700",
              fontStyle: "normal",
              fontSize: "clamp(24px, 7.5vw, 33.02px)",
              lineHeight: "clamp(24px, 7.5vw, 33.02px)",
              letterSpacing: "-0.14px",
              verticalAlign: "middle",
              color: "#1966BB",
              width: "clamp(140px, 40vw, 172px)",
              height: "clamp(24px, 7.5vw, 34px)",
              opacity: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
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

        {/* Image Column */}
        <div 
          className="about-image-container-mobile"
          style={{
            marginTop: "auto",
            transition: "all 0.5s ease-in-out",
          }}
        >
          <div 
            className="responsive-image-wrapper"
            style={{
              width: "clamp(350px, 85vw, 450px)",
              height: "clamp(550px, 120vw, 700px)",
              margin: "0 auto 0 auto",
              borderRadius: "clamp(10px, 3vw, 14.19px)",
              opacity: 1,
              transform: "rotate(0deg)",
              overflow: "hidden",
              position: "relative",
              alignSelf: "flex-end",
              marginTop: "auto",
              transition: "all 0.5s ease-in-out",
            }}
          >
            <InteractiveTeamImage />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMobile;
