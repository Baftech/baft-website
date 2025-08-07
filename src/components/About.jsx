import React from 'react'
import ReadMoreText from "./ReadMoreText";

const About = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
        {/* Left Column - Grouped Content */}
        <div className="flex flex-col">
          <p className="text-sm text-[rgba(25,102,187,1)] font-medium mb-2 flex items-center gap-2">
            <span className="text-xs">🔹</span> Know Our Story
          </p>
          <h1
            className="leading-none mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[rgba(25,102,187,1)]"
            style={{
              fontFamily: "EB Garamond",
              lineHeight: 1.1,
            }}
          >
            <span className="block">About BaFT</span>
          </h1>
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed pr-2 mb-4">
            We're Vibha, Dion and Saket, the trio behind BAFT Technology. We
            started this company with a simple goal: to make banking in India less
            of a headache and more of a smooth, dare we say… enjoyable
            experience.Somewhere between dodging endless forms and wond.
          </p>
          {/* ReadMoreText Component */}
          <button>
          <ReadMoreText
            text="Read More"
            content={`We're Vibha, Dion and Saket, the trio behind BAFT Technology. We started this company with a simple goal: to make banking in India less of a headache and more of a smooth, dare we say... enjoyable experience.Somewhere between dodging endless forms and wondering if "technical glitch" was just a lifestyle, we figured there had to be a better way to do things. So, armed with ambition, caffeine, and a shared love for solving messy problems, we got to work and BAFT Technology was born.At BAFT, we build smart, seamless solutions that cut through the clutter of traditional banking. No more confusing interfaces, endless queues, or mysterious errors. Just clean, user-friendly tools designed for real people.`}
            maxLength={150}
          />
        </button>
      </div>

        {/* Right Column - Image */}
        <div className="flex items-center justify-center">
          <img
            src="/baft_about_us_image.jpg"
            alt="About BaFT"
            className="w-full h-auto max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
