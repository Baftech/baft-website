import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
            className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-[#909090] mb-6"
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
          className="mt-2 transition-all duration-500 ease-out"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            width: "177px",
            height: "64px",
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
    <div className="relative w-full max-w-[553px] h-[420px] sm:h-[520px] md:h-[640px] lg:h-[782px]">
      {/* Main Image Container */}
      <div
        className="relative w-full h-full overflow-hidden"
        style={{ borderRadius: "24px", backgroundColor: "#f3f4f6" }}
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
            opacity: activeImageId === "full" ? 1 : 0.999, // Slightly transparent when not active to prevent z-index issues
            transition: "opacity 1200ms ease-in-out",
            zIndex: 1, // Always stays at base level
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
                maxWidth: "280px",
              }}
            >
              <div className="text-white">
                <h3
                  style={{
                    fontFamily: "EB Garamond, serif",
                    fontWeight: "bold",
                    fontSize: member.id === "vibha" ? "24px" : "26px",
                    lineHeight: "1.1",
                    marginBottom: "4px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    ...memberAnimationStyles.name,
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "150",
                    fontSize: "14px",
                    lineHeight: "1.2",
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
      </div>
    </div>
  );
};

// AboutBaft remains the same, just consumes the updated ReadMoreText
const AboutBaft = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "center center",
          end: "+=100vh",
          pin: true,
          scrub: 1,
        },
      });

      // Keep layout static for the first 40% of scroll
      tl.to({}, { duration: 0.4 });

      // Animate the left text column out after 40%
      tl.to(
        textContainerRef.current,
        {
          x: "-100vw",
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0.4
      );

      // Right image: enlarge and move to center after 40%
      tl.to(
        imageRef.current,
        {
          scale: 1.5,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "center center",
          duration: 0.6,
          ease: "power2.out",
        },
        0.4
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-theme="light"
      className="bg-white min-h-screen flex items-center justify-center"
    >
      <div
        className={`mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-8 md:gap-y-10 gap-x-6 md:gap-x-12 lg:gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 max-w-[1200px] mx-auto w-full ${
          isExpanded ? "items-start" : "items-center"
        }`}
      >
        {/* Left Column */}
        <div
          ref={textContainerRef}
          className={`transition-all duration-1200 ease-in-out flex flex-col h-full ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
          style={{
            transform: `translateY(${isExpanded ? "-20px" : "0px"})`,
          }}
        >
          <p
            className="font-normal mb-2 flex items-center gap-2 transition-all duration-1200 ease-out"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "20px",
              color: "#092646",
            }}
          >
            <img src="/SVG.svg" alt="Icon" className="w-5 h-5" />
            Know our story
          </p>
          <h1
            className="leading-tight md:leading-none mb-4 md:mb-6 lg:mb-8 font-bold transition-all duration-1200 ease-out text-[34px] sm:text-[44px] md:text-[54px] lg:text-[64px] text-[#1966BB]"
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

        {/* Right Column */}
        <div className="flex justify-center" ref={imageRef}>
          <InteractiveTeamImage />
        </div>
      </div>
    </section>
  );
};

export default AboutBaft;