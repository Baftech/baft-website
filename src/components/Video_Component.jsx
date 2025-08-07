import React from "react";

const Video_Component = () => {
  return (
    <section className="bg-white min-h-screen flex items-center justify-center">
      <div className="mt-4 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-y-10 gap-x-20 px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-10">
        {/* Left Column */}
        <div className="flex items-center justify-center">
          <video className="w-full h-auto rounded-lg shadow-lg" controls>
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        {/* Right Column */}
        <div className="w-[479px] h-[245px] p-4 flex flex-col justify-start items-start space-y-2">
          <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
            <span className="text-xs">🔹</span> Know Our Story
          </p>
          <h1
            className="text-3xl font-bold text-blue-600 leading-tight"
            style={{ fontFamily: "EB Garamond" }}
          >
            The Video
          </h1>
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed pr-2">
            BaFT Technologies is a next-gen neo-banking startup headquartered in
            Bangalore, proudly founded in 2025. We're a tight-knit team of
            financial innovators and tech experts on a mission: to reimagine
            financial services in India with customer-first solutions.
          </p>
          <button className="bg-[rgba(25,102,187,1)] text-white py-2 px-4 rounded">
            Watch Now
          </button>
        </div>
      </div>
      
    </section>
  );
};

export default Video_Component;
