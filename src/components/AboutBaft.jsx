import React, { useState } from "react";

// ReadMoreText Component (placeholder - replace with your actual component)
const ReadMoreText = ({ content, maxLength, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const truncatedContent = content.substring(0, maxLength);
  const shouldShowReadMore = content.length > maxLength;
  const additionalContent = content.substring(maxLength);
  
  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onExpandChange) onExpandChange(newState);
  };
  
  return (
    <div className="leading-relaxed pr-2">
      <p 
        className="transition-all duration-1000 ease-out"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          color: '#909090'
        }}
      >
        {truncatedContent}
        {!isExpanded && shouldShowReadMore && "..."}
        <span 
          className="inline-block overflow-hidden transition-all duration-1200 ease-in-out"
          style={{
            maxHeight: isExpanded ? '500px' : '0px',
            opacity: isExpanded ? 1 : 0,
            transform: `translateY(${isExpanded ? '0px' : '-10px'})`,
          }}
        >
          {additionalContent}
        </span>
      </p>
      {shouldShowReadMore && (
        <div className="transition-all duration-1200 ease-in-out" style={{
          transform: `translateY(${isExpanded ? '20px' : '0px'})`
        }}>
          <button
            onClick={handleToggle}
            className="mt-6 transition-all duration-500 ease-out"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '16px',
              width: '177px',
              height: '64px',
              borderRadius: '200px',
              backgroundColor: '#E3EDFF',
              color: '#092646',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#000000';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#E3EDFF';
              e.target.style.color = '#092646';
            }}
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>
      )}
    </div>
  );
};

// Interactive Team Image Component
const InteractiveTeamImage = () => {
  const [hoveredMember, setHoveredMember] = useState(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [autoHighlight, setAutoHighlight] = useState('full');
  const [currentImageSrc, setCurrentImageSrc] = useState('/baft_about_us_image.jpg');

  const teamMembers = [
    {
      id: 'vibha',
      name: 'Vibha Harish',
      position: 'Co-Founder & Chief Executive Officer',
      area: { x: '35%', y: '45%', width: '30%', height: '55%' },
      image: '/Property 1=Vibha Harish (1).png'
    },
    {
      id: 'dion',
      name: 'Dion Montalbo',
      position: 'Co-Founder & Chief Technology Officer',
      area: { x: '5%', y: '20%', width: '35%', height: '70%' },
      image: '/Property 1=Dion Monteiro (1).png'
    },
    {
      id: 'saket',
      name: 'Saket Borkar',
      position: 'Co-Founder & Chief Product Officer',
      area: { x: '60%', y: '15%', width: '35%', height: '75%' },
      image: '/Property 1=Saket Borkar (1).png'
    }
  ];

  // Cycle sequence including the full image
  const cycleSequence = ['full', 'vibha', 'dion', 'saket'];

  // Auto-cycling effect
  React.useEffect(() => {
    if (!isUserInteracting) {
      const interval = setInterval(() => {
        setAutoHighlight(current => {
          const currentIndex = cycleSequence.findIndex(id => id === current);
          const nextIndex = (currentIndex + 1) % cycleSequence.length;
          return cycleSequence[nextIndex];
        });
      }, 2500); // Change every 2.5 seconds

      return () => clearInterval(interval);
    }
  }, [isUserInteracting]);

  // Handle smooth image transitions
  React.useEffect(() => {
    const activeMember = isUserInteracting ? hoveredMember : autoHighlight;
    const targetMember = teamMembers.find(m => m.id === activeMember);
    const targetSrc = targetMember ? targetMember.image : '/baft_about_us_image.jpg';
    
    if (targetSrc !== currentImageSrc) {
      setCurrentImageSrc(targetSrc);
    }
  }, [autoHighlight, hoveredMember, isUserInteracting, currentImageSrc]);

  const getImageSrc = () => {
    const activeMember = isUserInteracting ? hoveredMember : autoHighlight;
    if (activeMember === 'vibha') return '/Property 1=Vibha Harish (1).png';
    if (activeMember === 'dion') return '/Property 1=Dion Monteiro (1).png';
    if (activeMember === 'saket') return '/Property 1=Saket Borkar (1).png';
    return '/baft_about_us_image.jpg'; // default image for 'full' and null states
  };

  const handleMouseEnterImage = () => {
    setIsUserInteracting(true);
  };

  const handleMouseLeaveImage = () => {
    setHoveredMember(null);
    setIsUserInteracting(false);
  };

  const handleMouseEnterMember = (memberId) => {
    setHoveredMember(memberId);
  };

  return (
    <div className="relative" style={{ width: '553px', height: '782px' }}>
      {/* Main Image Container */}
      <div 
        className="relative w-full h-full"
        onMouseEnter={handleMouseEnterImage}
        onMouseLeave={handleMouseLeaveImage}
      >
        <img 
          src={currentImageSrc}
          alt="BaFT Team" 
          className="w-full h-full object-cover"
          style={{ 
            borderRadius: '24px'
          }}
        />
        
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

const AboutBaft = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <section id="about" data-theme="light" className="bg-white min-h-screen flex items-center justify-center">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10 items-start">
        {/* Left Column */}
        <div className="transition-all duration-1200 ease-in-out" style={{
          transform: `translateY(${isExpanded ? '-20px' : '0px'})`
        }}>
          <p 
            className="font-normal mb-2 flex items-center gap-2 transition-all duration-1200 ease-out"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '20px',
              color: '#092646'
            }}
          >
            <span className="text-xs">🔹</span> Know Our Story
          </p>
          <h1
            className="leading-none mb-6 md:mb-8 font-bold transition-all duration-1200 ease-out"
            style={{
              fontFamily: "EB Garamond, serif",
              fontSize: '64px',
              lineHeight: 1.1,
              color: '#1966BB'
            }}
          >
            <span className="block">About BaFT</span>
          </h1>
          
          {/* ReadMoreText Component */}
          <ReadMoreText
            content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.

Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.

At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
            maxLength={150}
            onExpandChange={setIsExpanded}
          />
        </div>

        {/* Right Column - Interactive Team Image */}
        <div className="flex justify-center lg:justify-start">
          <InteractiveTeamImage />
        </div>
      </div>
    </section>
  );
};

export default AboutBaft;